import mysql.connector
from mysql.connector import Error

# Konfigurasi awal tanpa nama database untuk membuat database-nya terlebih dahulu
INIT_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': ''
}

def init_database():
    try:
        # Koneksi ke MySQL server
        conn = mysql.connector.connect(**INIT_CONFIG)
        if conn.is_connected():
            cursor = conn.cursor()
            
            # Buat database jika belum ada
            cursor.execute("CREATE DATABASE IF NOT EXISTS bglow_db")
            print("Database 'bglow_db' checked/created.")
            
            # Gunakan database tersebut
            cursor.execute("USE bglow_db")
            
            # Buat tabel users jika belum ada
            create_users_table = """
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
            cursor.execute(create_users_table)
            print("Table 'users' checked/created.")
            
            conn.commit()
            cursor.close()
            conn.close()
            print("Database initialization successful!")
    except Error as e:
        print(f"Error during database initialization: {e}")

if __name__ == "__main__":
    init_database()
