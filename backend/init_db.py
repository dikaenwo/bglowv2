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
                profile_photo LONGTEXT,
                skin_type VARCHAR(255),
                acne_level VARCHAR(255),
                oil_level VARCHAR(255),
                pore_condition VARCHAR(255),
                skin_score INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
            cursor.execute(create_users_table)
            print("Table 'users' checked/created.")
            
            # Cek jika kolom baru sudah ada, jika belum tambahkan (migrasi)
            cursor.execute("SHOW COLUMNS FROM users")
            existing_columns = [col[0] for col in cursor.fetchall()]
            
            new_columns = {
                'profile_photo': 'LONGTEXT',
                'skin_type': 'VARCHAR(255)',
                'acne_level': 'VARCHAR(255)',
                'oil_level': 'VARCHAR(255)',
                'pore_condition': 'VARCHAR(255)',
                'skin_score': 'INT DEFAULT 0',
                'sunscreen_interval': 'INT DEFAULT 2',
                'favorites': 'LONGTEXT',
                'diary_entries': 'LONGTEXT'
            }
            
            for col_name, col_type in new_columns.items():
                if col_name not in existing_columns:
                    alter_query = f"ALTER TABLE users ADD COLUMN {col_name} {col_type}"
                    cursor.execute(alter_query)
                    print(f"Added column '{col_name}' to 'users' table.")
            
            conn.commit()
            cursor.close()
            conn.close()
            print("Database initialization successful!")
    except Error as e:
        print(f"Error during database initialization: {e}")

if __name__ == "__main__":
    init_database()

