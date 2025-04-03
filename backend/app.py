from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from functools import wraps
from werkzeug.exceptions import HTTPException
import random
import string
from werkzeug.utils import secure_filename

load_dotenv()

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# MySQL configurations
app.config.update(
    MYSQL_HOST='127.0.0.1',
    MYSQL_USER='root',
    MYSQL_PASSWORD='',
    MYSQL_DB='task_track_db',
    MYSQL_CURSORCLASS='DictCursor'
)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key')

mysql = MySQL(app)

# Configuration for file uploads
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'txt', 'png', 'jpg', 'jpeg'}

app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), UPLOAD_FOLDER)
# Create uploads directory if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Test MySQL connection
def test_mysql_connection():
    try:
        print("Attempting to connect to MySQL...")
        with mysql.connection.cursor() as cur:
            print("Cursor created, executing test query...")
            cur.execute('SELECT 1')
            result = cur.fetchone()
            print(f"Test query result: {result}")
        print("MySQL connection successful!")
        return True
    except Exception as e:
        print(f"MySQL connection failed with error: {str(e)}")
        print("\nPlease check if:")
        print("1. XAMPP MySQL service is running (check XAMPP Control Panel)")
        print("2. Database 'task_track_db' exists in phpMyAdmin")
        print("3. Your MySQL credentials are correct in .env file")
        return False

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            # Remove 'Bearer ' prefix if present
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            current_user = data
        except:
            return jsonify({'error': 'Token is invalid'}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated

def role_required(allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = request.headers.get('Authorization')
            if not token:
                return jsonify({"error": "No token provided"}), 401
            
            try:
                # Remove 'Bearer ' prefix if present
                if token.startswith('Bearer '):
                    token = token.split(' ')[1]
                
                # Decode token
                data = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
                
                # Check role
                if data['role'] not in allowed_roles:
                    return jsonify({"error": "Unauthorized"}), 403
                
                # Call the decorated function with user data
                return f(data, *args, **kwargs)
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired"}), 401
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token"}), 401
            except Exception as e:
                print(f"Auth error: {str(e)}")
                return jsonify({"error": "Authentication failed"}), 401
                
        return decorated
    return decorator

@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'student')
        
        # Input validation
        if not all([username, email, password]):
            return jsonify({"error": "All fields are required"}), 400
        
        # Hash password
        hashed_password = generate_password_hash(password)
        
        cur = mysql.connection.cursor()
        
        # Check if email already exists
        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cur.fetchone():
            cur.close()
            return jsonify({"error": "Email already registered"}), 409
        
        # Insert new user
        cur.execute("""
            INSERT INTO users (username, email, password, role) 
            VALUES (%s, %s, %s, %s)
        """, (username, email, hashed_password, role))
        mysql.connection.commit()
        cur.close()
        
        return jsonify({"message": "User registered successfully"}), 201
        
    except Exception as e:
        print(f"Signup error: {str(e)}")
        return jsonify({"error": "An error occurred during registration"}), 500

# Update the login route to include better error handling
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
        
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cur.fetchone()
        cur.close()
        
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        if not check_password_hash(user['password'], password):
            return jsonify({"error": "Invalid password"}), 401
            
        if user['status'] != 'active':
            return jsonify({"error": "Account is inactive"}), 403
        
        token = jwt.encode({
            'user_id': user['id'],
            'username': user['username'],
            'role': user['role'],
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, app.config['JWT_SECRET_KEY'])
        
        return jsonify({
            "token": token,
            "user": {
                "id": user['id'],
                "username": user['username'],
                "role": user['role']
            }
        }), 200
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({"error": "An error occurred during login"}), 500

@app.route('/api/student/dashboard', methods=['GET'])
@role_required(['student', 'teacher', 'admin'])
def student_dashboard(current_user):
    return jsonify({'message': 'Student dashboard data'})

@app.route('/api/teacher/dashboard', methods=['GET'])
@role_required(['teacher', 'admin'])
def teacher_dashboard(current_user):
    return jsonify({'message': 'Teacher dashboard data'})

@app.route('/api/admin/dashboard', methods=['GET'])
@role_required(['admin'])
def admin_dashboard(current_user):
    return jsonify({'message': 'Admin dashboard data'})

@app.route('/api/student/classes', methods=['GET'])
@role_required(['student'])
def get_enrolled_classes(current_user):
    try:
        cur = mysql.connection.cursor()
        
        cur.execute(
            """
            SELECT 
                c.*,
                e.status as enrollment_status,
                e.enrolled_at,
                u.username as teacher_name,
                COUNT(DISTINCT e2.student_id) as student_count
            FROM classes c
            JOIN enrollments e ON c.id = e.class_id
            JOIN users u ON c.teacher_id = u.id
            LEFT JOIN enrollments e2 ON c.id = e2.class_id
            WHERE e.student_id = %s 
            AND e.status = 'enrolled'
            AND c.status = 'active'
            GROUP BY c.id, e.status, e.enrolled_at, u.username
            ORDER BY e.enrolled_at DESC
            """, (current_user['user_id'],))
        
        classes = cur.fetchall()
        print(f"Found {len(classes)} enrolled classes for student {current_user['user_id']}")
        return jsonify(classes), 200
        
    except Exception as e:
        print(f"Error fetching enrolled classes: {str(e)}")
        return jsonify({'error': 'Failed to fetch enrolled classes'}), 500

def generate_class_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

@app.route('/api/teacher/classes', methods=['GET'])
@role_required(['teacher', 'admin'])
def get_teacher_classes(current_user):
    try:
        cur = mysql.connection.cursor()
        # Add debug logging
        print(f"Fetching classes for teacher_id: {current_user['user_id']}")
        
        cur.execute("""
            SELECT 
                c.id,
                c.name,
                c.code,
                c.schedule,
                c.description,
                c.teacher_id,
                COUNT(e.student_id) as student_count 
            FROM classes c 
            LEFT JOIN enrollments e ON c.id = e.class_id
            WHERE c.teacher_id = %s
            GROUP BY c.id
        """, (current_user['user_id'],))
        
        classes = cur.fetchall()
        print(f"Found {len(classes) if classes else 0} classes")
        cur.close()
        return jsonify(classes), 200
        
    except Exception as e:
        print(f"Error in get_teacher_classes: {str(e)}")
        return jsonify({"error": "Failed to fetch classes", "details": str(e)}), 500

@app.route('/api/teacher/classes', methods=['POST'])
@role_required(['teacher', 'admin'])
def create_class(current_user):
    try:
        data = request.get_json()
        name = data.get('name')
        schedule = data.get('schedule', '')
        description = data.get('description', '')
        
        if not name:
            return jsonify({"error": "Class name is required"}), 400
        
        # Generate unique code
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        while True:
            cur = mysql.connection.cursor()
            cur.execute("SELECT 1 FROM classes WHERE code = %s", (code,))
            if not cur.fetchone():
                break
            code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        
        print(f"Creating class with code: {code}")
        
        cur = mysql.connection.cursor()
        cur.execute("""
            INSERT INTO classes (name, code, schedule, description, teacher_id)
            VALUES (%s, %s, %s, %s, %s)
        """, (name, code, schedule, description, current_user['user_id']))
        
        mysql.connection.commit()
        class_id = cur.lastrowid
        
        # Fetch the created class
        cur.execute("""
            SELECT 
                id, name, code, schedule, description, teacher_id,
                0 as student_count
            FROM classes 
            WHERE id = %s
        """, (class_id,))
        
        new_class = cur.fetchone()
        cur.close()
        
        if new_class:
            print(f"Successfully created class: {new_class}")
            return jsonify(new_class), 201
        else:
            return jsonify({"error": "Failed to create class"}), 500
            
    except Exception as e:
        print(f"Error in create_class: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/teacher/classes/<int:class_id>', methods=['DELETE'])
@role_required(['teacher', 'admin'])
def delete_class(current_user, class_id):
    try:
        cur = mysql.connection.cursor()
        
        # Verify ownership
        cur.execute("""
            SELECT 1 FROM classes 
            WHERE id = %s AND teacher_id = %s
        """, (class_id, current_user['user_id']))
        
        if not cur.fetchone():
            return jsonify({"error": "Unauthorized"}), 403

        # Delete class (modules and enrollments will be deleted by CASCADE)
        cur.execute("DELETE FROM classes WHERE id = %s", (class_id,))
        mysql.connection.commit()
        cur.close()
        
        return jsonify({"message": "Class deleted successfully"}), 200

    except Exception as e:
        print(f"Error deleting class: {str(e)}")
        return jsonify({"error": "Failed to delete class"}), 500

@app.route('/api/teacher/classes/<int:class_id>/modules/<int:module_id>', methods=['GET'])
@role_required(['teacher', 'admin'])
def get_class_details(current_user, class_id, module_id):
    try:
        cur = mysql.connection.cursor()
        
        # Verify the teacher owns this class
        cur.execute("""
            SELECT 
                c.*,
                COUNT(e.student_id) as student_count
            FROM classes c
            LEFT JOIN enrollments e ON c.id = e.class_id
            WHERE c.id = %s AND c.teacher_id = %s
            GROUP BY c.id
        """, (class_id, current_user['user_id']))
        
        class_data = cur.fetchone()
        
        if not class_data:
            return jsonify({"error": "Class not found"}), 404
            
        cur.close()
        return jsonify(class_data), 200
        
    except Exception as e:
        print(f"Error getting class details: {str(e)}")
        return jsonify({"error": "Failed to fetch class details"}), 500

@app.route('/api/teacher/classes/<int:class_id>/modules', methods=['GET'])
@role_required(['teacher', 'admin'])
def get_class_modules(current_user, class_id):
    try:
        cur = mysql.connection.cursor()
        
        # First verify class ownership
        cur.execute("""
            SELECT 1 FROM classes 
            WHERE id = %s AND teacher_id = %s
        """, (class_id, current_user['user_id']))
        
        if not cur.fetchone():
            return jsonify({"error": "Class not found"}), 404
            
        # Get modules with their contents
        cur.execute("""
            SELECT 
                m.id,
                m.title,
                m.content,
                m.order_index,
                m.created_at
            FROM modules m
            WHERE m.class_id = %s
            ORDER BY m.order_index
        """, (class_id,))
        
        modules = cur.fetchall()
        cur.close()
        
        return jsonify(modules), 200
        
    except Exception as e:
        print(f"Error getting class modules: {str(e)}")
        return jsonify({"error": "Failed to fetch modules"}), 500

@app.route('/api/teacher/classes/<int:class_id>/modules/<int:module_id>', methods=['DELETE'])
@role_required(['teacher', 'admin'])
def delete_module(current_user, class_id, module_id):
    try:
        cur = mysql.connection.cursor()
        
        # Verify ownership
        cur.execute("""
            SELECT teacher_id FROM classes 
            WHERE id = %s AND teacher_id = %s
        """, (class_id, current_user['user_id']))
        
        if not cur.fetchone():
            return jsonify({"error": "Unauthorized"}), 403

        # Delete module (contents will be deleted by CASCADE)
        cur.execute("DELETE FROM modules WHERE id = %s", (module_id,))
        mysql.connection.commit()
        cur.close()
        
        return jsonify({"message": "Module deleted successfully"}), 200

    except Exception as e:
        print(f"Error deleting module: {str(e)}")
        return jsonify({"error": "Failed to delete module"}), 500

@app.route('/api/teacher/classes/<int:class_id>/students', methods=['GET'])
@role_required(['teacher', 'admin'])
def get_class_students(current_user, class_id):
    try:
        cur = mysql.connection.cursor()
        
        # First verify class ownership
        cur.execute("""
            SELECT 1 FROM classes 
            WHERE id = %s AND teacher_id = %s
        """, (class_id, current_user['user_id']))
        
        if not cur.fetchone():
            return jsonify({"error": "Class not found"}), 404
            
        # Get enrolled students without last_accessed field
        cur.execute("""
            SELECT 
                u.id,
                u.username,
                u.email,
                e.status,
                e.enrolled_at,
                e.grade
            FROM users u
            JOIN enrollments e ON u.id = e.student_id
            WHERE e.class_id = %s
            ORDER BY u.username
        """, (class_id,))
        
        students = cur.fetchall()
        cur.close()
        
        return jsonify(students), 200
        
    except Exception as e:
        print(f"Error getting class students: {str(e)}")
        return jsonify({"error": "Failed to fetch students"}), 500

@app.route('/api/teacher/classes/<int:class_id>/modules', methods=['POST'])
@role_required(['teacher', 'admin'])
def create_module(current_user, class_id):
    try:
        data = request.get_json()
        title = data.get('title')
        content = data.get('content', '')
        
        if not title:
            return jsonify({"error": "Module title is required"}), 400
            
        cur = mysql.connection.cursor()
        
        # Verify class ownership
        cur.execute("""
            SELECT 1 FROM classes 
            WHERE id = %s AND teacher_id = %s
        """, (class_id, current_user['user_id']))
        
        if not cur.fetchone():
            return jsonify({"error": "Class not found"}), 404
            
        # Get the next order index
        cur.execute("SELECT MAX(order_index) FROM modules WHERE class_id = %s", (class_id,))
        max_order = cur.fetchone()['MAX(order_index)'] or 0
        
        # Create new module
        cur.execute("""
            INSERT INTO modules (class_id, title, content, order_index)
            VALUES (%s, %s, %s, %s)
        """, (class_id, title, content, max_order + 1))
        
        mysql.connection.commit()
        module_id = cur.lastrowid
        
        # Fetch the created module
        cur.execute("SELECT * FROM modules WHERE id = %s", (module_id,))
        new_module = cur.fetchone()
        cur.close()
        
        return jsonify(new_module), 201
        
    except Exception as e:
        print(f"Error creating module: {str(e)}")
        return jsonify({"error": "Failed to create module"}), 500

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/teacher/classes/<int:class_id>/modules/<int:module_id>/content', methods=['POST'])
@role_required(['teacher', 'admin'])
def create_module_content(current_user, class_id, module_id):
    try:
        # Handle file upload if present
        file_url = None
        if 'file' in request.files:
            file = request.files['file']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                file_url = f'/uploads/{filename}'

        # Get other form data
        title = request.form.get('title')
        description = request.form.get('description', '')
        content_type = request.form.get('type')
        due_date = request.form.get('dueDate')
        points = request.form.get('points')
        link_url = request.form.get('linkUrl')

        if not title:
            return jsonify({"error": "Content title is required"}), 400

        cur = mysql.connection.cursor()
        
        # Verify module ownership
        cur.execute("""
            SELECT c.teacher_id 
            FROM modules m
            JOIN classes c ON m.class_id = c.id
            WHERE m.id = %s AND c.id = %s
        """, (module_id, class_id))
        
        result = cur.fetchone()
        if not result or result['teacher_id'] != current_user['user_id']:
            return jsonify({"error": "Module not found"}), 404

        # Insert content
        cur.execute("""
            INSERT INTO module_contents 
            (module_id, title, description, type, due_date, points, file_url, link_url)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (module_id, title, description, content_type, due_date, 
              points, file_url, link_url))
        
        mysql.connection.commit()
        content_id = cur.lastrowid

        # Fetch created content
        cur.execute("""
            SELECT * FROM module_contents 
            WHERE id = %s
        """, (content_id,))
        
        new_content = cur.fetchone()
        cur.close()

        return jsonify(new_content), 201

    except Exception as e:
        print(f"Error creating module content: {str(e)}")
        return jsonify({"error": "Failed to create content"}), 500

@app.route('/api/teacher/classes/<int:class_id>/modules/<int:module_id>/content/<int:content_id>', methods=['DELETE'])
@role_required(['teacher', 'admin'])
def delete_module_content(current_user, class_id, module_id, content_id):
    try:
        cur = mysql.connection.cursor()
        
        # Verify ownership
        cur.execute("""
            SELECT c.teacher_id 
            FROM classes c
            JOIN modules m ON c.id = m.class_id
            JOIN module_contents mc ON m.id = mc.module_id
            WHERE c.id = %s AND m.id = %s AND mc.id = %s
        """, (class_id, module_id, content_id))
        
        result = cur.fetchone()
        if not result or result['teacher_id'] != current_user['user_id']:
            return jsonify({"error": "Unauthorized"}), 403

        # Delete content
        cur.execute("""
            DELETE FROM module_contents 
            WHERE id = %s AND module_id = %s
        """, (content_id, module_id))
        
        mysql.connection.commit()
        cur.close()
        
        return jsonify({"message": "Content deleted successfully"}), 200

    except Exception as e:
        print(f"Error deleting content: {str(e)}")
        return jsonify({"error": "Failed to delete content"}), 500

@app.route('/api/teacher/classes/<int:class_id>/modules/<int:module_id>/contents', methods=['GET'])
@role_required(['teacher', 'admin'])
def get_module_contents(current_user, class_id, module_id):
    try:
        cur = mysql.connection.cursor()
        
        # Verify module ownership
        cur.execute("""
            SELECT c.teacher_id 
            FROM modules m
            JOIN classes c ON m.class_id = c.id
            WHERE m.id = %s AND c.id = %s
        """, (module_id, class_id))
        
        result = cur.fetchone()
        if not result or result['teacher_id'] != current_user['user_id']:
            return jsonify({"error": "Module not found"}), 404

        # Fetch all contents for the module
        cur.execute("""
            SELECT * FROM module_contents 
            WHERE module_id = %s
            ORDER BY created_at
        """, (module_id,))
        
        contents = cur.fetchall()
        cur.close()

        return jsonify(contents), 200

    except Exception as e:
        print(f"Error fetching module contents: {str(e)}")
        return jsonify({"error": "Failed to fetch contents"}), 500

@app.route('/api/teacher/classes/<int:class_id>/modules/<int:module_id>/content/<int:content_id>', 
           methods=['GET'])
@role_required(['teacher', 'student', 'admin'])
def get_module_content(current_user, class_id, module_id, content_id):
    try:
        cur = mysql.connection.cursor()
        
        # Check access rights
        if current_user['role'] == 'student':
            # Verify student enrollment
            cur.execute("""
                SELECT 1 FROM enrollments
                WHERE student_id = %s AND class_id = %s
            """, (current_user['user_id'], class_id))
            if not cur.fetchone():
                return jsonify({"error": "Not enrolled in this class"}), 403
        elif current_user['role'] == 'teacher':
            # Verify teacher ownership
            cur.execute("""
                SELECT 1 FROM classes
                WHERE id = %s AND teacher_id = %s
            """, (class_id, current_user['user_id']))
            if not cur.fetchone():
                return jsonify({"error": "Unauthorized"}), 403

        # Fetch content
        cur.execute("""
            SELECT mc.*, m.title as module_title
            FROM module_contents mc
            JOIN modules m ON mc.module_id = m.id
            WHERE mc.id = %s AND m.id = %s
        """, (content_id, module_id))
        
        content = cur.fetchone()
        if not content:
            return jsonify({"error": "Content not found"}), 404

        cur.close()
        return jsonify(content), 200

    except Exception as e:
        print(f"Error fetching module content: {str(e)}")
        return jsonify({"error": "Failed to fetch content"}), 500

@app.route('/api/student/classes/<int:class_id>', methods=['GET'])
@role_required(['student'])
def get_student_class_details(current_user, class_id):
    try:
        cur = mysql.connection.cursor()
        
        # Verify enrollment
        cur.execute("""
            SELECT 1 FROM enrollments 
            WHERE student_id = %s AND class_id = %s 
            AND status = 'enrolled'
        """, (current_user['user_id'], class_id))
        
        if not cur.fetchone():
            return jsonify({"error": "Not enrolled in this class"}), 403
            
        # Get class details with teacher info
        cur.execute("""
            SELECT 
                c.*,
                u.username as teacher_name,
                COUNT(DISTINCT e.student_id) as student_count
            FROM classes c
            JOIN users u ON c.teacher_id = u.id
            LEFT JOIN enrollments e ON c.id = e.class_id
            WHERE c.id = %s AND c.status = 'active'
            GROUP BY c.id, u.username
        """, (class_id,))
        
        class_data = cur.fetchone()
        if not class_data:
            return jsonify({"error": "Class not found"}), 404
            
        cur.close()
        return jsonify(class_data), 200
        
    except Exception as e:
        print(f"Error getting class details: {str(e)}")
        return jsonify({"error": "Failed to get class details"}), 500

@app.route('/api/student/classes/<int:class_id>/modules', methods=['GET'])
@role_required(['student'])
def get_student_class_modules(current_user, class_id):
    try:
        cur = mysql.connection.cursor()
        
        # Verify enrollment
        cur.execute("""
            SELECT 1 FROM enrollments 
            WHERE student_id = %s AND class_id = %s 
            AND status = 'enrolled'
        """, (current_user['user_id'], class_id))
        
        if not cur.fetchone():
            return jsonify({"error": "Not enrolled in this class"}), 403
            
        # Get modules and their contents in a single query
        cur.execute("""
            SELECT 
                m.id as module_id,
                m.title as module_title,
                m.content as module_content,
                m.order_index,
                mc.id as content_id,
                mc.title as content_title,
                mc.description as content_description,
                mc.type as content_type,
                mc.due_date,
                mc.points,
                mc.link_url,
                mc.file_url
            FROM modules m
            LEFT JOIN module_contents mc ON m.id = mc.module_id
            WHERE m.class_id = %s
            ORDER BY m.order_index, m.created_at, mc.created_at
        """, (class_id,))
        
        rows = cur.fetchall()
        cur.close()
        
        # Organize data into modules with their contents
        modules = {}
        for row in rows:
            module_id = row['module_id']
            
            if module_id not in modules:
                modules[module_id] = {
                    'id': module_id,
                    'title': row['module_title'],
                    'content': row['module_content'],
                    'order_index': row['order_index'],
                    'contents': []
                }
            
            if row['content_id']:  # Only add content if it exists
                modules[module_id]['contents'].append({
                    'id': row['content_id'],
                    'title': row['content_title'],
                    'description': row['content_description'],
                    'type': row['content_type'],
                    'due_date': row['due_date'],
                    'points': row['points'],
                    'link_url': row['link_url'],
                    'file_url': row['file_url']
                })
        
        # Convert to list and sort by order_index
        module_list = list(modules.values())
        module_list.sort(key=lambda x: x['order_index'])
        
        print(f"Returning {len(module_list)} modules")
        return jsonify(module_list), 200
        
    except Exception as e:
        print(f"Error getting class modules: {str(e)}")
        return jsonify({"error": "Failed to get class modules"}), 500

@app.route('/api/student/classes/<int:class_id>/students', methods=['GET'])
@role_required(['student'])
def get_student_class_students(current_user, class_id):
    try:
        cur = mysql.connection.cursor()
        
        # Verify enrollment
        cur.execute("""
            SELECT 1 FROM enrollments 
            WHERE student_id = %s AND class_id = %s 
            AND status = 'enrolled'
        """, (current_user['user_id'], class_id))
        
        if not cur.fetchone():
            return jsonify({"error": "Not enrolled in this class"}), 403
            
        # Get enrolled students
        cur.execute("""
            SELECT 
                u.id,
                u.username,
                e.status,
                e.enrolled_at
            FROM users u
            JOIN enrollments e ON u.id = e.student_id
            WHERE e.class_id = %s AND e.status = 'enrolled'
            ORDER BY u.username
        """, (class_id,))
        
        students = cur.fetchall()
        cur.close()
        
        return jsonify(students), 200
        
    except Exception as e:
        print(f"Error getting class students: {str(e)}")
        return jsonify({"error": "Failed to get class students"}), 500

@app.route('/api/student/classes/<int:class_id>', methods=['DELETE'])
@role_required(['student'])
def leave_class(current_user, class_id):
    try:
        cur = mysql.connection.cursor()
        
        # Check if student is enrolled
        cur.execute("""
            SELECT student_id, class_id 
            FROM enrollments 
            WHERE student_id = %s AND class_id = %s 
            AND status = 'enrolled'
        """, (current_user['user_id'], class_id))
        
        enrollment = cur.fetchone()
        if not enrollment:
            return jsonify({"error": "Not enrolled in this class"}), 404
            
        # Update enrollment status to 'dropped'
        cur.execute("""
            UPDATE enrollments 
            SET status = 'dropped'
            WHERE student_id = %s AND class_id = %s
        """, (current_user['user_id'], class_id))
        
        mysql.connection.commit()
        cur.close()
        
        print(f"Student {current_user['user_id']} left class {class_id}")
        return jsonify({"message": "Successfully left the class"}), 200
        
    except Exception as e:
        print(f"Error leaving class: {str(e)}")
        mysql.connection.rollback()
        return jsonify({"error": f"Failed to leave class: {str(e)}"}), 500

@app.errorhandler(Exception)
def handle_error(error):
    response = {
        "error": str(error),
        "message": "An internal server error occurred."
    }
    if isinstance(error, HTTPException):
        response["message"] = error.description
        return jsonify(response), error.code
    return jsonify(response), 500

# Add a function to check if tables exist
def check_database_tables():
    try:
        cur = mysql.connection.cursor()
        
        # Check users table
        cur.execute("""
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = %s 
            AND table_name IN ('users', 'classes', 'enrollments')
        """, (app.config['MYSQL_DB'],))
        
        tables = cur.fetchall()
        cur.close()
        
        if len(tables) < 3:
            print("Warning: Some required tables are missing!")
            print("Expected tables: users, classes, enrollments")
            print(f"Found tables: {tables}")
            return False
        return True
        
    except Exception as e:
        print(f"Error checking tables: {str(e)}")
        return False

# Add/update these routes
@app.route('/api/teacher/classes/<int:class_id>', methods=['GET', 'DELETE'])
@role_required(['teacher', 'admin'])
def handle_class(current_user, class_id):
    if request.method == 'GET':
        try:
            cur = mysql.connection.cursor()
            
            # Verify the teacher owns this class
            cur.execute("""
                SELECT 
                    c.*,
                    COUNT(e.student_id) as student_count
                FROM classes c
                LEFT JOIN enrollments e ON c.id = e.class_id
                WHERE c.id = %s AND c.teacher_id = %s
                GROUP BY c.id
            """, (class_id, current_user['user_id']))
            
            class_data = cur.fetchone()
            
            if not class_data:
                return jsonify({"error": "Class not found"}), 404
                
            cur.close()
            return jsonify(class_data), 200
            
        except Exception as e:
            print(f"Error getting class details: {str(e)}")
            return jsonify({"error": "Failed to get class details"}), 500
            
    elif request.method == 'DELETE':
        try:
            cur = mysql.connection.cursor()
            
            # Verify ownership
            cur.execute("""
                SELECT 1 FROM classes 
                WHERE id = %s AND teacher_id = %s
            """, (class_id, current_user['user_id']))
            
            if not cur.fetchone():
                return jsonify({"error": "Unauthorized"}), 403

            # Delete class (modules and enrollments will be deleted by CASCADE)
            cur.execute("DELETE FROM classes WHERE id = %s", (class_id,))
            mysql.connection.commit()
            cur.close()
            
            return jsonify({"message": "Class deleted successfully"}), 200

        except Exception as e:
            print(f"Error deleting class: {str(e)}")
            return jsonify({"error": "Failed to delete class"}), 500

@app.route('/api/teacher/classes/<int:class_id>/modules/<int:module_id>/content/<int:content_id>', 
           methods=['GET', 'DELETE'])
@role_required(['teacher', 'admin'])
def handle_module_content(current_user, class_id, module_id, content_id):
    if request.method == 'DELETE':
        try:
            cur = mysql.connection.cursor()
            
            # Verify ownership
            cur.execute("""
                SELECT c.teacher_id 
                FROM classes c
                JOIN modules m ON c.id = m.class_id
                JOIN module_contents mc ON m.id = mc.module_id
                WHERE c.id = %s AND m.id = %s AND mc.id = %s
            """, (class_id, module_id, content_id))
            
            result = cur.fetchone()
            if not result or result['teacher_id'] != current_user['user_id']:
                return jsonify({"error": "Unauthorized"}), 403

            # Delete content
            cur.execute("DELETE FROM module_contents WHERE id = %s", (content_id,))
            mysql.connection.commit()
            cur.close()
            
            return jsonify({"message": "Content deleted successfully"}), 200

        except Exception as e:
            print(f"Error deleting content: {str(e)}")
            return jsonify({"error": "Failed to delete content"}), 500
    elif request.method == 'GET':
        # Add GET method implementation here
        pass

if __name__ == '__main__':
    print("Starting Flask application...")
    print(f"Database: {app.config['MYSQL_DB']}")
    print(f"Host: {app.config['MYSQL_HOST']}")
    
    with app.app_context():
        if test_mysql_connection() and check_database_tables():
            print("Starting Flask server...")
            app.run(debug=True)
        else:
            print("Application startup failed due to database issues")
