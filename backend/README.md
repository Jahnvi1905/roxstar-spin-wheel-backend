# 🎡 RoxStar Real-Time Multiplayer Spin Wheel Game (Backend)

This project is a **production-ready backend system** developed as part of the **ROXSTAR ASSESSMENT TEST**.  
It implements a real-time multiplayer Spin Wheel game with safe coin handling, automatic elimination, and live WebSocket updates.

The system is designed to be **scalable, consistent, and database-driven**, avoiding in-memory state and handling concurrency correctly.

---

## 📌 Key Highlights

- Only ONE active spin wheel at a time
- Database-backed state (no in-memory logic)
- Transaction-safe coin distribution
- Automatic elimination every 7 seconds
- Real-time multiplayer updates using WebSockets
- Winner declaration and payout
- Production-style NestJS architecture

---

## 🧱 Tech Stack

- **Backend Framework:** NestJS
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Real-Time Communication:** Socket.IO (WebSockets)
- **Runtime:** Node.js
- **Testing:** Thunder Client, Browser Console

---

## 🎯 Core Features (As per RoxStar Assessment)

### 1️⃣ Spin Wheel Lifecycle

#### Initialize Spin Wheel
- Only admins can create a spin wheel
- Only **one active spin wheel** allowed at a time
- Initial status set to `WAITING`

#### Join Spin Wheel
- Users join by paying **10 coins**
- Entry fee distributed as:
  - Winner Pool: 70%
  - Admin Pool: 20%
  - App Pool: 10%
- Coin deduction and pool updates handled inside **Prisma transactions**
- Participants stored in database

#### Start Spin Wheel
- Minimum **3 participants required**
- Status changes from `WAITING` → `RUNNING`
- Automatic elimination timer starts

#### Process Eliminations
- One user eliminated every **7 seconds**
- Random elimination logic
- Eliminated users stored in DB
- Last remaining user declared as winner

---

## 💰 Coin Distribution System

### Entry Fee Distribution
- Entry fees distributed into winner, admin, and app pools
- Pool values stored and updated in database
- No hard-coded values in controller

### Final Payout
- Winner receives the full **Winner Pool**
- Spin wheel marked as `COMPLETED`
- All operations are atomic and safe

---

## 📡 Real-Time Communication (WebSockets)

| Event Name | Description |
|-----------|------------|
| USER_JOINED | User joined the spin wheel |
| USER_ELIMINATED | User eliminated |
| WINNER_DECLARED | Winner announced |

---

## ⚠️ Edge Cases Handled

- Concurrent joins handled via transactions
- Insufficient coin balance checks
- Duplicate spin wheel prevention
- Minimum participant validation
- Safe handling of server restarts
- Race conditions during elimination
- Guaranteed single winner payout

---

## 🚀 Scalability & Performance

- Stateless backend design
- Database as the single source of truth
- No in-memory arrays or objects
- WebSockets reduce client polling
- Prisma ensures optimized database access

---

## 🌟 Bonus Features

- Real-time multiplayer updates
- Automatic elimination scheduler
- Database-driven elimination state
- Clean separation of concerns (Controller / Service / Gateway)
- Interview & assessment-ready implementation

---

## 📂 Project Structure

backend/
├── prisma/
│ ├── schema.prisma
│ └── migrations/
├── src/
│ ├── prisma/
│ │ └── prisma.service.ts
│ ├── spin-wheel/
│ │ ├── spin-wheel.controller.ts
│ │ ├── spin-wheel.service.ts
│ │ └── spin-wheel.gateway.ts
│ ├── app.module.ts
│ └── main.ts
└── .env


---
## ⚙️ Backend Setup Instructions

```bash
npm install

```
```env
DATABASE_URL="postgresql://postgres:admin123@localhost:5432/jahnvi_19"
```
```bash
npx prisma migrate dev
```
```bash
npm run start:dev
```
```md
http://localhost:3000
```

## 🔌 API Endpoints
```
POST /spin-wheel/create
POST /spin-wheel/join/:userId
POST /spin-wheel/start
```

## 🧪 WebSocket Testing

```js
var s = document.createElement("script");
s.src = "https://cdn.socket.io/4.7.2/socket.io.min.js";
document.head.appendChild(s);

const socket = io("http://localhost:3000");
socket.on("USER_JOINED", console.log);
socket.on("USER_ELIMINATED", console.log);
socket.on("WINNER_DECLARED", console.log);
```

## 📸 Screenshots
Screenshots of API testing, WebSocket events, and database state are available in the `/screenshots` folder.

## 🧠 Architecture & Design
High-level architecture and design decisions are documented in the `/docs` folder.

## 🧠 Key Design Decisions

- Prisma transactions for atomic operations
- No in-memory state to support scalability
- Server-side elimination timer for fairness
- WebSockets for real-time updates


## 👩‍💻 Author

Jahnvi  
RoxStar Assessment Submission
