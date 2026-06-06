from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from database import get_db_connection

app = Flask(__name__)
# Konfigurasi CORS agar frontend bisa mengakses backend
CORS(app)

@app.route("/api/register", methods=["POST"])
def register_user():
    data = request.get_json()
    if not data or 'name' not in data or 'email' not in data or 'password' not in data:
        return jsonify({"detail": "Data tidak lengkap"}), 400
        
    name = data['name']
    email = data['email']
    password = data['password']
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"detail": "Database connection failed"}), 500
        
    try:
        cursor = conn.cursor(dictionary=True)
        # Cek apakah email sudah terdaftar
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        existing_user = cursor.fetchone()
        if existing_user:
            return jsonify({"detail": "Email sudah terdaftar"}), 400
            
        # Hash password menggunakan werkzeug (bawaan Flask)
        hashed_password = generate_password_hash(password)
        
        # Simpan ke database
        cursor.execute(
            "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s)",
            (name, email, hashed_password)
        )
        conn.commit()
        return jsonify({"message": "Pendaftaran berhasil", "status": "success"}), 201
        
    except Exception as e:
        return jsonify({"detail": str(e)}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.route("/api/login", methods=["POST"])
def login_user():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"detail": "Data tidak lengkap"}), 400
        
    email = data['email']
    password = data['password']
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"detail": "Database connection failed"}), 500
        
    try:
        cursor = conn.cursor(dictionary=True)
        # Cari user berdasarkan email
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        db_user = cursor.fetchone()
        
        if not db_user:
            return jsonify({"detail": "Email atau kata sandi salah"}), 400
            
        # Verifikasi password
        is_password_valid = check_password_hash(db_user['password_hash'], password)
        
        if not is_password_valid:
            return jsonify({"detail": "Email atau kata sandi salah"}), 400
            
        # Login sukses, kirim kembali info user (tanpa password)
        return jsonify({
            "message": "Login berhasil",
            "status": "success",
            "user": {
                "id": db_user['id'],
                "name": db_user['name'],
                "email": db_user['email']
            }
        }), 200
        
    except Exception as e:
        return jsonify({"detail": str(e)}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.route("/api/data", methods=["GET"])
def read_data():
    return jsonify({"data": "API is running"})

if __name__ == "__main__":
    app.run(debug=True, port=8000)