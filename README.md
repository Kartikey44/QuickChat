# QuickChat 🚀

QuickChat is a modern full-stack real-time chat application built using the MERN Stack. It enables users to communicate instantly through text messages, media sharing, and AI-powered conversations while providing a smooth and responsive user experience.

## 🌐 Live Demo

Frontend: https://quickchat-4e9d.onrender.com

Backend: https://quickchat-4e9d.onrender.com

---

## ✨ Features

### 🔐 Authentication & Authorization
- User Registration and Login
- JWT Access & Refresh Token Authentication
- Secure Password Hashing with bcrypt
- Protected Routes
- Persistent User Sessions

### 💬 Real-Time Messaging
- One-to-One Real-Time Chat
- Socket.io Integration
- Instant Message Delivery
- Online/Offline User Status
- Unread Message Count

### 📷 Media Sharing
- Image Uploads
- Media Preview Before Sending
- Cloudinary Integration
- Optimized Media Storage

### 🤖 AI Chat Assistant
- AI-Powered Conversations
- Conversation History Support
- Unique Conversation Sessions
- Smart Response Generation

### 📌 Advanced Chat Features
- Reply to Messages
- Edit Messages
- Delete Messages
- Clear Chat
- Chat Sorting by Latest Activity
- Context Menu Actions

### 👤 User Management
- Profile Management
- Profile Picture Upload
- User Search
- Contact List

### 🎨 Modern UI/UX
- Responsive Design
- Mobile Friendly
- Clean Chat Interface
- Smooth Animations
- Dark-Themed Layout

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Socket.io Client
- React Context API

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.io
- JWT Authentication
- Bcrypt

### Cloud Services
- Cloudinary
- Gemini AI API

---

## 📂 Project Structure

```bash
QuickChat/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── socket/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── App.jsx
│   │
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (.env)

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GEMINI_API_KEY=your_gemini_api_key

CLIENT_URL=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/Kartikey44/QuickChat.git
cd QuickChat
```

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## ▶️ Run Application

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
cd frontend
npm run dev
```

Application will be available at:

```bash
Frontend: http://localhost:5173
Backend : http://localhost:5000
```

---

## 📡 API Routes

### Authentication

```http
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/check
```

### Messages

```http
GET    /api/messages/:userId
POST   /api/messages/send/:userId
DELETE /api/messages/delete/:messageId
PUT    /api/messages/edit/:messageId
```

### AI Chat

```http
POST /api/ai/chat
GET  /api/ai/history
```

### User

```http
GET /api/users
GET /api/users/profile
PUT /api/users/update-profile
```

---

## 🔒 Security Features

- JWT Authentication
- Refresh Token Support
- Password Hashing with bcrypt
- Secure Cookies
- Protected API Routes
- Input Validation
- Error Handling Middleware

---

## 🎯 Future Improvements

- Group Chats
- Voice Messages
- Video Calling
- Message Reactions
- Message Forwarding
- Typing Indicators
- Push Notifications
- End-to-End Encryption

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit changes

```bash
git commit -m "feat: add new feature"
```

4. Push branch

```bash
git push origin feature/new-feature
```

5. Create Pull Request

---

## 👨‍💻 Author

**Kartikey Saraswat**

GitHub: https://github.com/Kartikey44

LinkedIn: https://linkedin.com/in/kartikey444

---

⭐ If you like this project, don't forget to give it a star!
