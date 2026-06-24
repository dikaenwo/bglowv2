#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "=== Starting B-Glow Project Deployment Setup ==="

# Define variables
PROJECT_DIR="$(pwd)"
DB_NAME="bglow_db"
DB_PASS="bglow2026"
VENV_DIR="$PROJECT_DIR/backend/venv"

echo "Project Directory: $PROJECT_DIR"

# 1. Update and Upgrade packages
echo "Updating packages..."
sudo apt update -y

# 2. Install Node.js (NodeSource Node 20)
echo "Installing Node.js 20..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
else
    echo "Node.js is already installed: $(node -v)"
fi

# 3. Install Python, pip, virtualenv, MySQL, Nginx, and curl
echo "Installing python3, pip, virtualenv, mysql-server, nginx..."
sudo apt install -y python3-pip python3-venv mysql-server nginx curl

# 4. Configure MySQL Database
echo "Configuring MySQL Database..."
# Start MySQL Service if not running
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure MySQL and set root password
# Note: For security and compatibility with mysql-connector-python we use mysql_native_password
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$DB_PASS';" || true
sudo mysql -u root -p"$DB_PASS" -e "FLUSH PRIVILEGES;"

# Create database if not exists
sudo mysql -u root -p"$DB_PASS" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"

# Import database schema
if [ -f "$PROJECT_DIR/backend/database.sql" ]; then
    echo "Importing database schema from backend/database.sql..."
    sudo mysql -u root -p"$DB_PASS" "$DB_NAME" < "$PROJECT_DIR/backend/database.sql"
else
    echo "Warning: backend/database.sql not found!"
fi

# 5. Setup Python Virtual Environment and Backend
echo "Setting up Python virtual environment..."
cd "$PROJECT_DIR/backend"
python3 -m venv venv
source venv/bin/activate

echo "Installing backend dependencies..."
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn

# Test backend setup
echo "Backend dependencies installed successfully."
deactivate
cd "$PROJECT_DIR"

# 6. Build Frontend
echo "Building frontend using Vite..."
npm install
npm run build

# Copy build folder to /var/www/bglow/dist
echo "Copying built frontend to /var/www/bglow/dist..."
sudo mkdir -p /var/www/bglow/dist
sudo cp -r "$PROJECT_DIR/dist/"* /var/www/bglow/dist/
sudo chown -R www-data:www-data /var/www/bglow/dist

# 7. Configure Gunicorn Systemd Service
echo "Creating Gunicorn Systemd service..."
cat <<EOF | sudo tee /etc/systemd/system/bglow-backend.service
[Unit]
Description=Gunicorn instance to serve B-Glow backend
After=network.target

[Service]
User=$USER
WorkingDirectory=$PROJECT_DIR/backend
ExecStart=$VENV_DIR/bin/gunicorn --workers 3 --bind 127.0.0.1:5000 main:app
Restart=always

[Install]
WantedBy=multi-user.target
EOF

echo "Starting and enabling Gunicorn bglow-backend service..."
sudo systemctl daemon-reload
sudo systemctl start bglow-backend
sudo systemctl enable bglow-backend

# 8. Configure Nginx
echo "Configuring Nginx..."
cat <<EOF | sudo tee /etc/nginx/sites-available/bglow
server {
    listen 80;
    server_name localhost 103.247.8.169;

    location / {
        root /var/www/bglow/dist;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:5000/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable the Nginx site
echo "Enabling Nginx configuration..."
sudo ln -sf /etc/nginx/sites-available/bglow /etc/nginx/sites-enabled/
# Remove default site if exists
sudo rm -f /etc/nginx/sites-enabled/default || true

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx

echo "=== B-Glow Project Deployment Setup Completed Successfully! ==="
echo "You can access your website at: http://103.247.8.169"
