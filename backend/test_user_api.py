import unittest
import json
from main import app
from database import get_db_connection

class TestUserAPI(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        
        # Clean up test user if exists
        self.email = "test_antigravity@example.com"
        self.password = "password123"
        self.name = "Test Antigravity"
        
        conn = get_db_connection()
        if conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM users WHERE email = %s", (self.email,))
            conn.commit()
            cursor.close()
            conn.close()

    def test_complete_user_flow(self):
        # 1. Register User
        reg_response = self.app.post('/api/register', 
            data=json.dumps({
                'name': self.name,
                'email': self.email,
                'password': self.password
            }),
            content_type='application/json'
        )
        self.assertEqual(reg_response.status_code, 201)
        
        # 2. Login User
        login_response = self.app.post('/api/login',
            data=json.dumps({
                'email': self.email,
                'password': self.password
            }),
            content_type='application/json'
        )
        self.assertEqual(login_response.status_code, 200)
        login_data = json.loads(login_response.data)
        user_id = login_data['user']['id']
        self.assertEqual(login_data['user']['name'], self.name)
        self.assertEqual(login_data['user']['email'], self.email)
        self.assertIsNone(login_data['user']['skin_type']) # Initially null
        
        # 3. Update User Profile Info (Name & Email)
        update_response = self.app.put(f'/api/user/{user_id}',
            data=json.dumps({
                'name': "Updated Name",
                'email': "updated_email@example.com"
            }),
            content_type='application/json'
        )
        self.assertEqual(update_response.status_code, 200)
        update_data = json.loads(update_response.data)
        self.assertEqual(update_data['user']['name'], "Updated Name")
        self.assertEqual(update_data['user']['email'], "updated_email@example.com")
        
        # 4. Update Profile Photo
        photo_response = self.app.put(f'/api/user/{user_id}',
            data=json.dumps({
                'profile_photo': "data:image/png;base64,iVBORw0KGgoAAAANS="
            }),
            content_type='application/json'
        )
        self.assertEqual(photo_response.status_code, 200)
        photo_data = json.loads(photo_response.data)
        self.assertEqual(photo_data['user']['profile_photo'], "data:image/png;base64,iVBORw0KGgoAAAANS=")
        
        # 5. Update Skin Profile Scan Results
        skin_response = self.app.put(f'/api/user/{user_id}',
            data=json.dumps({
                'skin_type': "Kombinasi",
                'acne_level': "Ringan — Grade 1",
                'oil_level': "Sedang — T-Zone",
                'pore_condition': "Baik — Minimal",
                'skin_score': 65
            }),
            content_type='application/json'
        )
        self.assertEqual(skin_response.status_code, 200)
        skin_data = json.loads(skin_response.data)
        self.assertEqual(skin_data['user']['skin_type'], "Kombinasi")
        self.assertEqual(skin_data['user']['acne_level'], "Ringan — Grade 1")
        self.assertEqual(skin_data['user']['oil_level'], "Sedang — T-Zone")
        self.assertEqual(skin_data['user']['pore_condition'], "Baik — Minimal")
        self.assertEqual(skin_data['user']['skin_score'], 65)
        
        # 6. Fetch Profile details to ensure they persist
        get_response = self.app.get(f'/api/user/{user_id}')
        self.assertEqual(get_response.status_code, 200)
        get_data = json.loads(get_response.data)
        self.assertEqual(get_data['name'], "Updated Name")
        self.assertEqual(get_data['email'], "updated_email@example.com")
        self.assertEqual(get_data['profile_photo'], "data:image/png;base64,iVBORw0KGgoAAAANS=")
        self.assertEqual(get_data['skin_type'], "Kombinasi")
        self.assertEqual(get_data['skin_score'], 65)

    def tearDown(self):
        # Clean up updated email as well
        conn = get_db_connection()
        if conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM users WHERE email IN (%s, %s)", (self.email, "updated_email@example.com"))
            conn.commit()
            cursor.close()
            conn.close()

if __name__ == '__main__':
    unittest.main()
