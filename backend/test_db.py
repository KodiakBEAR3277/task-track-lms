import mysql.connector
from mysql.connector import Error

def test_database_connection():
    try:
        connection = mysql.connector.connect(
            host='127.0.0.1',
            user='root',
            password='',
            database='task_track_db'
        )
        
        if connection.is_connected():
            db_info = connection.get_server_info()
            print(f"Connected to MySQL Server version {db_info}")
            
            cursor = connection.cursor()
            cursor.execute("SELECT DATABASE();")
            db_name = cursor.fetchone()[0]
            print(f"Connected to database: {db_name}")
            
            # Test users table
            cursor.execute("SHOW TABLES LIKE 'users';")
            if cursor.fetchone():
                print("Users table exists")
                cursor.execute("SELECT COUNT(*) FROM users;")
                count = cursor.fetchone()[0]
                print(f"Number of users in database: {count}")
            else:
                print("Users table does not exist")

    except Error as e:
        print(f"Error connecting to MySQL: {e}")
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection closed.")

if __name__ == "__main__":
    test_database_connection()