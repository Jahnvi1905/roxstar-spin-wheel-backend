# 🎡 RoxStar Real-Time Multiplayer Spin Wheel Game (Full Stack)

This project is a **full-stack, production-ready real-time multiplayer application** developed as part of the **ROXSTAR ASSESSMENT TEST**.

It implements a Spin Wheel game where multiple users can join, get eliminated in real-time, and a single winner is declared — with safe coin handling and live WebSocket updates.

---

## 📌 Key Highlights

- Full Stack application (Frontend + Backend)
- Only ONE active spin wheel at a time
- Database-backed state (no in-memory logic)
- Transaction-safe coin distribution
- Automatic elimination every 7 seconds
- Real-time multiplayer updates using WebSockets
- Winner declaration and payout
- Clean, scalable architecture
- Real-time UI updates using Socket.IO (no polling)

---

## 🧱 Tech Stack

### Backend
- NestJS (Node.js + TypeScript)
- PostgreSQL
- Prisma ORM
- Socket.IO (WebSockets)

### Frontend
- React (Create React App)
- REST APIs + WebSockets

---

## 🎯 Core Features

### Spin Wheel Lifecycle
- Admin creates a spin wheel
- Users join by paying coins
- Minimum 3 participants required
- Automatic elimination every 7 seconds
- Last remaining user wins


### Coin Distribution
- Entry fee split into:
  - Winner Pool
  - Admin Pool
  - App Pool
- All coin operations handled using Prisma transactions

### Real-Time Communication
- Live updates for:
  - User joined
  - User eliminated
  - Winner declared

---

## 📡 WebSocket Events

| Event | Description |
|------|------------|
| USER_JOINED | User joined the game |
| USER_ELIMINATED | User eliminated |
| WINNER_DECLARED | Winner announced |

---

## ⚠️ Edge Cases Handled

- Concurrent user joins
- Insufficient coin balance
- Duplicate spin wheel prevention
- Minimum participant validation
- Race conditions during elimination
- Guaranteed single winner payout
- Server restart safety (DB-driven state)

---

## 📂 Project Structure

```
roxstar-spin-wheel/
├── backend/
│   ├── prisma/
│   └── src/
├── frontend/
│   └── src/
├── screenshots/
├── docs/
└── README.md
```

---

## ⚙️ Local Setup Instructions

### Backend
```bash
cd backend
npm install
```

Create `.env` file:
```env
DATABASE_URL="postgresql://postgres:admin123@localhost:5432/jahnvi_19"
```

```bash
npx prisma migrate dev
npm run start:dev
```

Backend runs at:
```
http://localhost:3000
```

---

### Frontend
```bash
cd frontend
npm install
npm start
```

Frontend runs at:
```
http://localhost:3001
```

---

## 🔌 API Endpoints

```
POST /spin-wheel/create
POST /spin-wheel/join/:userId
POST /spin-wheel/start
```

---

## 🧪 Screenshots

Screenshots of frontend UI, API testing, backend logs, and WebSocket events are available in the `/screenshots` folder.

---

## 🧠 Design Decisions

- Stateless backend architecture
- Prisma transactions for atomic operations
- Database as single source of truth
- WebSockets for real-time multiplayer updates
- Separate frontend and backend services

---

## 👩‍💻 Author

**Jahnvi**  
RoxStar Assessment Submission
