# 💪 Training Platform – Real-Time Web App for Fitness Management

This project is a dynamic, full-stack training management platform created for the **Web Protocols** university course (Protokoly Stosów Komunikacyjnych). It features secure JWT login, blazing-fast real-time updates via MQTT and WebSockets, and interactive dashboards tailored to user roles (Admin, Coach, Athlete).

---

## 🚀 Features Overview

### ✅ Authentication & Authorization (JWT)
- Secure login with JWT tokens stored in localStorage
- Middleware-powered protection using `verifyToken.js`
- Fine-grained access control (Admin, Coach, Athlete)

### ✅ Real-Time Communication
- **MQTT** for live calorie burn, heart rate, and user status
- **WebSocket (Socket.IO)** chat for seamless two-way messaging

### ✅ REST API
- CRUD endpoints for users, plans, and reviews
- Role-based access enforced via middleware

### ✅ Frontend
- Sleek React SPA styled with Material UI
- Charts (Chart.js) for heart rate monitoring
- Role-sensitive layouts and real-time interactivity

### ✅ Security
- **bcrypt** protects passwords with strong hashing
- No raw passwords – only encrypted data is stored
- CORS enabled for safe cross-origin communication

---

## 📁 Project Structure (Simplified)
```
backend/
├── app.js
├── config/
├── controllers/
├── middleware/
├── models/
├── mqtt/
├── routes/
└── logs/

frontend/
├── public/
├── src/
│   ├── components/
│   ├── mqtt/
│   ├── pages/
│   ├── services/
│   └── styles/

tests/
├── backend/
├── frontend/
└── e2e/
```

---

## 🛠️ Technologies Used
- **Frontend**: React, Material UI, Chart.js, Toastify
- **Backend**: Node.js, Express.js, Sequelize (PostgreSQL), JWT, MQTT
- **Real-Time**: HiveMQ Broker, Socket.IO
- **Security**: bcrypt, JWT, CORS
- **Protocols**: HTTP, WebSocket, MQTT

---

## 🔐 JWT & Auth Flow
1. User logs in → gets a JWT token
2. Token stored in `localStorage`
3. All protected API requests include the token
4. `verifyToken.js` middleware authenticates the request
5. `authorize.js` middleware validates role access (admin, coach, etc.)

> Example: Only `coach` can edit plans, `admin` manages users.

---

## 🧠 Database Logic (PostgreSQL + Sequelize)
- Sequelize models: `User`, `Plan`, `Review`
- Controllers handle data operations using Sequelize methods
- `sequelize.sync()` keeps schema in sync

> No raw SQL needed – all logic abstracted cleanly.

---

## 📡 Real-Time Features via MQTT + WebSocket
### MQTT:
- Publishes updates to topics like `progress/{athleteId}/calories`
- Subscribes to `heart-rate`, `status`, `notifications`
- Broadcast model: one-to-many

### WebSocket (Socket.IO):
- Used for 1:1 chat between coach and athlete
- Rooms are dynamically joined per athlete
- Messages are delivered instantly

---

## 🔥 Real-Time in Action
- **Ranking**: Calories published via MQTT → others get updates live
- **Heart Rate**: Chart updates via MQTT in real time
- **Chat**: Messages fly between users with WebSocket magic

---

## 🔐 Security Best Practices
- Passwords are never stored as plain text
- bcrypt hashes are irreversible and compared at login
- JWT avoids server-stored sessions → stateless & scalable

---

## ▶️ How to Run the App
### Backend
```bash
cd backend
npm install
npm start
```
### Frontend
```bash
cd frontend
npm install
npm start
```
- Backend: `http://localhost:3000`
- Frontend: `http://localhost:3001`

---

## 🪪 License
This project was developed as part of a university course on Web Protocols. It is intended for academic demonstration and evaluation purposes only. Redistribution or commercial use is not permitted.

---
> Created by **Łukasz Kulpaczyński** · 2025

