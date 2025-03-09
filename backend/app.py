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

load_dotenv()

app = Flask(__name__)
CORS(app)

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
                return jsonify({'error': 'Token is missing'}), 401
            
            try:
                if token.startswith('Bearer '):
                    token = token[7:]
                data = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
                if data['role'] not in allowed_roles:
                    return jsonify({'error': 'Unauthorized'}), 403
            except:
                return jsonify({'error': 'Token is invalid'}), 401
                
            return f(*args, **kwargs)
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
@token_required
def get_enrolled_classes(current_user):
    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            SELECT c.* FROM classes c
            JOIN enrollments e ON c.id = e.class_id
            WHERE e.student_id = %s AND e.status = 'enrolled'
        """, (current_user['user_id'],))
        classes = cur.fetchall()
        cur.close()
        return jsonify(classes), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/student/classes/join', methods=['POST'])
@token_required
def join_class(current_user):
    try:
        data = request.get_json()
        class_code = data.get('classCode')
        
        cur = mysql.connection.cursor()
        # Check if class exists and user isn't already enrolled
        cur.execute("""
            INSERT INTO enrollments (student_id, class_id, status)
            SELECT %s, id, 'enrolled'
            FROM classes
            WHERE code = %s
            AND NOT EXISTS (
                SELECT 1 FROM enrollments
                WHERE student_id = %s AND class_id = id
            )
        """, (current_user['user_id'], class_code, current_user['user_id']))
        
        mysql.connection.commit()
        cur.close()
        
        if cur.rowcount == 0:
            return jsonify({"error": "Invalid code or already enrolled"}), 400
            
        return jsonify({"message": "Successfully joined class"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def generate_class_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

@app.route('/api/teacher/classes', methods=['GET'])
@role_required(['teacher', 'admin'])
def get_teacher_classes(current_user):
    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            SELECT c.*, COUNT(e.student_id) as student_count 
            FROM classes c 
            LEFT JOIN enrollments e ON c.id = e.class_id
            WHERE c.teacher_id = %s
            GROUP BY c.id
        """, (current_user['user_id'],))
        classes = cur.fetchall()
        cur.close()
        return jsonify(classes), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/teacher/classes', methods=['POST'])
@role_required(['teacher', 'admin'])
def create_class():
    try:
        data = request.get_json()
        name = data.get('name')
        if not name:
            return jsonify({"error": "Class name is required"}), 400

        code = generate_class_code()
        cur = mysql.connection.cursor()
        cur.execute("""
            INSERT INTO classes (name, code, teacher_id)
            VALUES (%s, %s, %s)
        """, (name, code, current_user['user_id']))
        mysql.connection.commit()
        
        class_id = cur.lastrowid
        cur.execute("SELECT * FROM classes WHERE id = %s", (class_id,))
        new_class = cur.fetchone()
        cur.close()
        
        return jsonify(new_class), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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

if __name__ == '__main__':
    print("Starting Flask application...")
    print(f"Database: {app.config['MYSQL_DB']}")
    print(f"Host: {app.config['MYSQL_HOST']}")
    
    with app.app_context():
        if test_mysql_connection():
            print("Starting Flask server...")
            app.run(debug=True)
        else:
            print("Application startup failed due to database connection error")
