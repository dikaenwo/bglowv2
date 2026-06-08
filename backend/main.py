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
                "email": db_user['email'],
                "profile_photo": db_user.get('profile_photo'),
                "skin_type": db_user.get('skin_type'),
                "acne_level": db_user.get('acne_level'),
                "oil_level": db_user.get('oil_level'),
                "pore_condition": db_user.get('pore_condition'),
                "skin_score": db_user.get('skin_score', 0),
                "sunscreen_interval": db_user.get('sunscreen_interval', 2),
                "favorites": db_user.get('favorites'),
                "diary_entries": db_user.get('diary_entries')
            }
        }), 200
        
    except Exception as e:
        return jsonify({"detail": str(e)}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.route("/api/user/<int:user_id>", methods=["GET"])
def get_user_profile(user_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({"detail": "Database connection failed"}), 500
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT id, name, email, profile_photo, skin_type, acne_level, oil_level, pore_condition, skin_score, sunscreen_interval, favorites, diary_entries FROM users WHERE id = %s", 
            (user_id,)
        )
        user_data = cursor.fetchone()
        if not user_data:
            return jsonify({"detail": "User tidak ditemukan"}), 404
        return jsonify(user_data), 200
    except Exception as e:
        return jsonify({"detail": str(e)}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.route("/api/user/<int:user_id>", methods=["PUT"])
def update_user_profile(user_id):
    data = request.get_json()
    if not data:
        return jsonify({"detail": "Data tidak boleh kosong"}), 400
        
    conn = get_db_connection()
    if not conn:
        return jsonify({"detail": "Database connection failed"}), 500
        
    try:
        cursor = conn.cursor(dictionary=True)
        # Cek apakah user ada
        cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        user_data = cursor.fetchone()
        if not user_data:
            return jsonify({"detail": "User tidak ditemukan"}), 404
            
        # Susun update secara dinamis
        update_fields = []
        params = []
        
        # Daftar kolom yang diizinkan untuk diedit
        allowed_fields = [
            'name', 'email', 'profile_photo', 'skin_type', 
            'acne_level', 'oil_level', 'pore_condition', 'skin_score',
            'sunscreen_interval', 'favorites', 'diary_entries'
        ]
        for field in allowed_fields:
            if field in data:
                update_fields.append(f"{field} = %s")
                params.append(data[field])
                
        if not update_fields:
            return jsonify({"detail": "Tidak ada data yang diubah"}), 400
            
        params.append(user_id)
        update_query = f"UPDATE users SET {', '.join(update_fields)} WHERE id = %s"
        cursor.execute(update_query, tuple(params))
        conn.commit()
        
        # Ambil user terbaru
        cursor.execute(
            "SELECT id, name, email, profile_photo, skin_type, acne_level, oil_level, pore_condition, skin_score, sunscreen_interval, favorites, diary_entries FROM users WHERE id = %s", 
            (user_id,)
        )
        updated_user = cursor.fetchone()
        
        return jsonify({
            "message": "Profil berhasil diperbarui",
            "status": "success",
            "user": updated_user
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