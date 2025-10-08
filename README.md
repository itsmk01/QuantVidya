# 🎓 QuantVidya — MERN EdTech Platform

**QuantVidya** is a full-stack **EdTech web application** built using the **MERN stack** (MongoDB, Express, React + Vite, Node.js).  
It provides a digital learning environment for **students** and **instructors**, enabling secure authentication, course management, and an intuitive dashboard experience.

---

## ⚡ Quick Start

| Command | Description |
|----------|--------------|
| `git clone https://github.com/your-username/QuantVidya.git` | Clone the repository |
| `cd QuantVidya` | Navigate into the project |
| `npm install` | Install frontend dependencies |
| `cd server && npm install && cd ..` | Install backend dependencies |
| `npm run dev` | Start both frontend and backend concurrently |
| `npm run server` | Run backend only |
| `npm run client` | Run frontend only |

---

## 🚀 Features

### 👨‍🎓 For Students
- Secure login and registration
- Enroll and track learning progress
- Personalized dashboard
- Profile management

### 👩‍🏫 For Instructors
- Course creation and management
- Upload content, monitor enrollments
- Instructor dashboard and analytics
- Profile customization

### 🧩 Core Highlights
- **JWT + Cookie-based Authentication**
- **Email Verification & OTP System**
- **MongoDB Database Integration**
- **Cloudinary Media Storage**
- **Protected Routes for Students & Instructors**
- **Razorpay Integration (coming soon)**
- **Responsive React (Vite) Frontend**
- **RESTful Express Backend**

---

## 🗂️ Folder Structure

```
QuantVidya/
│
├── server/                # Backend (Node.js + Express + MongoDB)
│   ├── controllers/       # Request handlers
│   ├── routes/            # Express routes
│   ├── models/            # MongoDB schemas
│   ├── utils/             # Helper utilities
│   ├── .env               # Environment variables
│   ├── index.js           # Backend entry point
│   ├── package.json
│   └── node_modules/
│
├── src/                   # Frontend (React + Vite)
├── public/
├── package.json           # Frontend + concurrently scripts
├── vite.config.js
├── .gitignore
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React (Vite), Redux Toolkit, React Router, Tailwind CSS, Axios, React Hot Toast |
| **Backend** | Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt, Nodemailer, Cloudinary |
| **Utilities** | Concurrently (run client & server), CORS, Cookie-Parser, Dotenv, Razorpay |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/QuantVidya.git
cd QuantVidya
```

### 2️⃣ Install Dependencies

#### Frontend
```bash
npm install
```

#### Backend
```bash
cd server
npm install
cd ..
```

### 3️⃣ Create Environment Variables

Create a `.env` file inside the `server/` folder:

```bash
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MAIL_USER=your_email
MAIL_PASS=your_password
```

---

## 🧩 Running the Project

Run **both frontend and backend together** with:

```bash
npm run dev
```

> 🌀 Uses `concurrently` to start both:
> - Frontend → `vite` on port **5173**
> - Backend → `nodemon index.js` on port **4000**

---

### ▶️ Run Backend Only
```bash
npm run server
```

### 💻 Run Frontend Only
```bash
npm run client
```

---

## 🧠 Future Enhancements
- AI-based course recommendations  
- Payment and subscription system  
- Admin dashboard for management  
- Real-time chat between students and instructors  
- Video lectures & live class integration  

---

## 🤝 Contributing
Contributions are always welcome!

1. Fork this repository  
2. Create a new branch (`feature/your-feature-name`)  
3. Commit your changes  
4. Push your branch and create a Pull Request  

---

## 📜 License
This project is licensed under the **MIT License** — you’re free to use, modify, and distribute it with proper attribution.

---

## 👨‍💻 Author
**Manish Kumar**  
📧 [manishkumar77937@gmail.com]  
🔗 [GitHub](https://github.com/itsmk01) | [LinkedIn](https://www.linkedin.com/in/manish-kumar-8b4a74297/)
