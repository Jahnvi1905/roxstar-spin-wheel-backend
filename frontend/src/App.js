import React from "react";
import { API_BASE_URL } from "./api";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import "./App.css";


function App() {
  const createWheel = async () => {
    const res = await fetch(`${API_BASE_URL}/spin-wheel/create`, {
      method: "POST",
    });
    const data = await res.json();
    alert(data.message);
  };

  const joinWheel = async (userId) => {
    const res = await fetch(`${API_BASE_URL}/spin-wheel/join/${userId}`, {
      method: "POST",
    });
    const data = await res.json();
    alert(data.message || data.error);
  };

  const startWheel = async () => {
    const res = await fetch(`${API_BASE_URL}/spin-wheel/start`, {
      method: "POST",
    });
    const data = await res.json();
    alert(data.message || data.error);
  };

   const [logs, setLogs] = useState([]);
useEffect(() => {
  const socket = io("http://localhost:3000");

  socket.on("connect", () => {
    console.log("✅ WebSocket connected");
  });

  socket.on("USER_JOINED", (data) => {
    setLogs((prev) => [...prev, `🟢 User Joined: ${data.userId}`]);
  });

  socket.on("USER_ELIMINATED", (data) => {
    setLogs((prev) => [...prev, `🔴 User Eliminated: ${data.userId}`]);
  });

  socket.on("WINNER_DECLARED", (data) => {
    setLogs((prev) => [...prev, `🏆 Winner: ${data.userId}`]);
  });

  return () => socket.disconnect();
}, []);

  return (
    <div className = "container">
      <h1>🎡 RoxStar Spin Wheel</h1>
      <h4 className="status">Status: Live Game</h4>
<p>Backend: http://localhost:3000</p>
<p>Frontend: http://localhost:3002</p>

      <button onClick={createWheel}>Create Spin Wheel</button>
      <br /><br />

      <button onClick={() => joinWheel(1)}>Join as User 1</button>
      <button onClick={() => joinWheel(2)}>Join as User 2</button>
      <button onClick={() => joinWheel(3)}>Join as User 3</button>
      <br /><br />

      <button onClick={startWheel}>Start Spin Wheel</button>

      <hr />

<h3>📡 Live Game Events</h3>

<ul>
  {logs.map((log, index) => (
    <li key={index}>{log}</li>
  ))}
</ul>

    </div>
  );
}

export default App;
