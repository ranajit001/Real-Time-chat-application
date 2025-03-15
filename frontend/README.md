
# Echosphere - Professional Networking Platform

Echosphere is a LinkedIn-inspired professional networking platform built with HTML, CSS, JavaScript, and Socket.IO for real-time communication. It allows users to sign up, log in, post updates, and chat with other professionals in a sleek, modern interface.

## Features
- **User Authentication**: Secure signup and login with form validation.
- **Homepage**: Professional feed with posts, sidebar profile, and trending news.
- **Real-time Chat**: Private messaging with online/offline status and image sharing.
- **Responsive Design**: Mobile-friendly layout with high-class styling.
- **Post Creation**: Share updates with text and media (planned).
- **Profile Display**: User avatars and basic info in sidebar and chat.

## Technologies
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- - **Backend**: Express,Node,MongoDB
- **Real-time Communication**: Socket.IO
- **Styling**: Custom CSS with animations and gradients
- **Image Upload**: Cloudinary (for chat images)
- **Storage**: LocalStorage (mock API for demo)
- **Dependencies**: Socket.IO client (`4.7.5`)

## Project Structure
echosphere/
├── index.html        # Homepage (feed, sidebar, posts)
├── styles.css        # Homepage styles
├── script.js         # Homepage functionality
├── chat.html         # Chat page
├── chat.css          # Chat styles
├── chat.js           # Chat logic with Socket.IO
├── signup.html       # Signup page
├── signup.css        # Signup styles
├── signup.js         # Signup form handling
├── login.html        # Login page
├── login.css         # Login styles
├── login.js          # Login form handling
└── README.md         # Project documentation


## Setup Instructions

### Prerequisites
- Node.js and npm (for Socket.IO server if implementing backend)
- A web browser (Chrome, Firefox, etc.)
- Cloudinary account (for image uploads in chat)
- Optional: Local server (e.g., Live Server extension in VS Code)

### Steps
1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/echosphere.git
   cd echosphere
Install Dependencies
Include Socket.IO client in your HTML files:
html
Wrap
Copy
<script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>

** Backend Code Repo:- "https://github.com/Shivam8175/Masai-X10-25hack.git"
