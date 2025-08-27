# Mail-OTP-based-authenticaton
It is a OTP based authentication via mail . Enjoy reading the code .

For Backend -> 
Gmail Setup for Nodemailer
This project uses Gmail SMTP for sending emails via Nodemailer.

1. Enable 2-Step Verification
Go to your Google Account → Security
Turn on 2-Step Verification

2. Create an App Password
In your Google Account → Security → App Passwords
Select Mail as the app and Other (Custom) → give it a name (e.g., Nodemailer)
Copy the generated 16-character password (this is your EMAIL_PASS)

3. Add Environment Variables
Create a .env file in your project root:
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_app_password_here

Also add following .env file
# Server Config
PORT=5000

# Database
MONGO_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

Run the Project
After setting up .env, install dependencies and start the server:
npm install
npm run dev

PORT → Server running port (default: 5000)
MONGO_URI → MongoDB connection string (e.g., from MongoDB Atlas)
JWT_SECRET → Secret key for signing JSON Web Tokens
EMAIL_USER → Gmail address for Nodemailer
EMAIL_PASS → Gmail App Password (not regular Gmail password)

For Frontend -> 
Add this in .env file 
REACT_APP_API_URL=http://localhost:5000/api
run the following command -> 
cd frontend
npm install
npm start





