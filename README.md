MERN Authentication App
A full-stack authentication application built with the MERN stack featuring user registration, login, email verification, and password reset functionality.

📱 Live Demo
[(https://mern-authentication-app-eta.vercel.app/)]

Features

User Registration & Login: Secure authentication with JWT tokens
Email Verification: OTP-based email verification system
Password Reset: Secure password reset with email OTP
Protected Routes: JWT-based route protection
Responsive Design: Mobile-first design with Tailwind CSS
Real-time Notifications: Toast notifications for user feedback
Cookie-based Sessions: Secure HTTP-only cookies for token storage

Tech Stack
Frontend:

React 18
Vite (Build tool)
React Router DOM
Tailwind CSS
Axios (HTTP client)
React Toastify (Notifications)

Backend:

Node.js
Express.js
MongoDB with Mongoose
JWT (JSON Web Tokens)
bcryptjs (Password hashing)
Nodemailer (Email service)
Cookie Parser
CORS

🔧 Installation
Backend Setup
cd server
npm install

Create .env file:
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SENDER_MAIL=your_email@domain.com
NODE_ENV=development

npm start

Frontend Setup
bashcd client
npm install
Create .env file:
envVITE_BACKEND_URL=http://localhost:5000
bashnpm run dev
🚀 Deployment

Frontend: Deploy on Vercel
Backend: Deploy on Render
Database: MongoDB Atlas

Usage

Register: Create a new account with email verification
Login: Access your account with email and password
Email Verification: Verify your email using OTP sent to your inbox
Password Reset: Reset forgotten password using email OTP
Dashboard: Access protected routes after authentication

Security Features

Password hashing with bcryptjs
JWT token authentication
HTTP-only cookies for token storage
CORS configuration
Input validation and sanitization
OTP-based email verification
Secure password reset flow

Acknowledgments

Built with the MERN stack
Email templates powered by HTML/CSS
UI components styled with Tailwind CSS
Authentication flow inspired by modern web applications