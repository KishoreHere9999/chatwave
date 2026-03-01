# ChatWave 🌊

A full-stack real-time chat application built with the MERN stack and Socket.io.

🔗 **Live Demo:** [chatwave-eta.vercel.app](https://chatwave-eta.vercel.app)

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure register and login
- 💬 **Direct Messaging** — Real-time one-on-one chat
- 👥 **Group Rooms** — Create and join group chat rooms
- ⚡ **Real-time** — Instant messaging powered by Socket.io
- ✍️ **Typing Indicators** — See when someone is typing
- 🟢 **Online Status** — See who is online in real time
- 🖼️ **Image Uploads** — Send images in chat via Cloudinary
- 👤 **Profile Pictures** — Upload and update your avatar
- 📱 **Responsive Design** — Works on all screen sizes

---

## 🛠️ Tech Stack

### Frontend
- React.js + Vite
- Tailwind CSS
- Zustand (state management)
- Socket.io Client
- Axios
- React Router DOM
- React Hot Toast
- Lucide React (icons)

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- Socket.io
- JWT (JSON Web Tokens)
- bcryptjs (password hashing)
- Cloudinary (image uploads)
- dotenv

---

## 📁 Project Structure
```
chatwave/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Login, Register, Home
│   │   ├── store/          # Zustand state management
│   │   ├── lib/            # Axios & Socket.io config
│   │   └── hooks/          # Custom React hooks
│   └── index.html
│
└── server/                 # Node.js backend
    ├── controllers/        # Route controllers
    ├── models/             # MongoDB models
    ├── routes/             # API routes
    ├── middleware/         # Auth middleware
    ├── socket/             # Socket.io logic
    ├── utils/              # Helper functions
    └── server.js           # Entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/KishoreHere9999/chatwave.git
cd chatwave
```

2. **Setup Backend**
```bash
cd server
npm install
```

Create `.env` file in `server/`:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
```

3. **Setup Frontend**
```bash
cd ../client
npm install
```

Create `.env` file in `client/`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

4. **Run the app**

Backend:
```bash
cd server
npm run dev
```

Frontend:
```bash
cd client
npm run dev
```

5. Open `http://localhost:5173` in your browser

---

## 🌐 Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas
- **Images:** Cloudinary

---

## 👨‍💻 Author

**Kishore** — [@KishoreHere9999](https://github.com/KishoreHere9999)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).