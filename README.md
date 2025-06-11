# ChitChat - Real-Time Chat Application

## Introduction
ChitChat is a real-time chat application enabling seamless communication between users. It features instant messaging, media sharing, and user authentication with email verification. Built with Socket.IO for real-time capabilities, it provides a responsive and intuitive chat experience.

## Project Type
Fullstack

## Deployed App
- Frontend: https://fastidious-lollipop-f9875b.netlify.app/
- Backend: https://real-time-chat-application-mq1s.onrender.com
- Database: MongoDB Atlas

## Directory Structure
```
Real-Time-chat-application/
├─ Backend/
│  ├─ configs/        # Database and middleware configs
│  ├─ controllers/    # Route controllers
│  ├─ middlewares/    # Auth, validation middlewares
│  ├─ models/         # Database schemas
│  ├─ routes/         # API routes
│  ├─ socket/         # Socket.IO configuration
│  ├─ public/         # Static assets
│  └─ app.js         # Server entry point
├─ frontend/
│  ├─ chat/          # Chat interface
│  ├─ login/         # Authentication pages
│  ├─ signup/        # Registration pages
│  ├─ socket/        # Client socket config
│  └─ index.html     # Entry point
```

## Video Walkthrough of the project
[Link to Feature Demo Video - 3 mins]

## Video Walkthrough of the codebase
[Link to Code Walkthrough Video - 5 mins]

## Features
- Real-time messaging with Socket.IO
- User authentication with JWT and email verification
- Media file sharing (images, documents, videos)
- Online/offline status indicators
- Typing indicators
- Message history with pagination
- Multi-user chat rooms
- File upload with preview
- Message delivery status
- User profile management

## Design Decisions & Assumptions
1. **Architecture**
   - WebSocket for real-time communication
   - REST APIs for CRUD operations
   - JWT for stateless authentication

2. **Security**
   - Rate limiting on API endpoints
   - File type validation
   - Maximum file size: 5MB
   - Token expiration: 24 hours

3. **Database**
   - MongoDB for flexible schema
   - Separate collections for users, messages, rooms
   - Indexing on frequent queries

## Installation & Getting Started
```bash
# Clone repository
git clone <repository-url>

# Backend setup
cd Backend
npm install
cp .env.example .env
# Update .env with your credentials
npm start

# Frontend
cd ../frontend
# Open index.html in browser
```

## Environment Variables
```env
MONGO_URI=<mongodb_uri>
JWT_SECRET=<jwt_secret_key>
PORT=8080
NODE_MAILER_ADMIN_EMAIL=<email>
NODE_MAILER_ADMIN_PASS=<email_password>
CLOUDINARY_CLOUD_NAME=<name>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>
```

## Usage
```javascript
// Connect to Socket.IO server
const socket = io('http://localhost:8080');

// Join chat room
socket.emit('join_room', roomId);

// Send message
socket.emit('send_message', {
    room: roomId,
    message: 'Hello!',
    sender: userId
});
```

## Credentials
```
Demo Account:
Email: demo@example.com
Password: Demo@123
```

## APIs Used
- Cloudinary API - File storage
- NodeMailer - Email service
- Socket.IO - Real-time communication

## API Endpoints

### Authentication
```
POST /api/users/register - Register new user
POST /api/users/login - User login
POST /api/users/forgot-password - Reset password
```

### Messages
```
GET /api/messages/:roomId - Get room messages
POST /api/messages - Send message
POST /api/upload/files - Upload files
```

### User Management
```
GET /api/users/profile - Get user profile
PATCH /api/users/update - Update profile
POST /api/verify/otp - Verify email OTP
```

## Technology Stack
- **Frontend**
  - HTML5, CSS3, JavaScript
  - Socket.IO Client
  - File Upload with preview

- **Backend**
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - Socket.IO
  - JWT Authentication
  - Nodemailer
  - Multer
  - Cloudinary