import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "./api";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:3000", {
  transports: ["websocket"],
});

function App() {
  const [logs, setLogs] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [winner, setWinner] = useState(null);

  // ---------- SOCKET EVENTS ----------
  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ WebSocket connected");
    });

    socket.on("USER_JOINED", (data) => {
      setLogs((prev) => [...prev, `🟢 User ${data.userId} joined`]);
      if (data.participants) setParticipants(data.participants);
    });

    socket.on("USER_ELIMINATED", (data) => {
      setLogs((prev) => [...prev, `❌ User ${data.userId} eliminated`]);
      if (data.remainingPlayers)
        setParticipants(data.remainingPlayers);
    });

    socket.on("WINNER_DECLARED", (data) => {
  setLogs((prev) => [
    ...prev,
    `🏆 Winner: User ${data.userId} won ${data.amount} coins`,
  ]);
});


    return () => {
      socket.off("USER_JOINED");
      socket.off("USER_ELIMINATED");
      socket.off("WINNER_DECLARED");
    };
  }, []);

  // ---------- API CALLS ----------
  const createWheel = async () => {
    const res = await fetch(`${API_BASE_URL}/spin-wheel/create`, {
      method: "POST",
    });
    const data = await res.json();
    alert(data.message || data.error);
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

  return (
    <div className="container">
      <h1>🎡 RoxStar Spin Wheel</h1>
      <p className="status">Backend: http://localhost:3000</p>
      <p className="status">Frontend: http://localhost:3002</p>

      <button onClick={createWheel}>Create Spin Wheel</button>

      <div className="buttons">
        <button onClick={() => joinWheel(1)}>Join as User 1</button>
        <button onClick={() => joinWheel(2)}>Join as User 2</button>
        <button onClick={() => joinWheel(3)}>Join as User 3</button>
      </div>

      <button onClick={startWheel}>Start Spin Wheel</button>

      <hr />

      <h3>👥 Active Participants</h3>
      <ul>
        {participants.map((p) => (
          <li key={p}>User {p}</li>
        ))}
      </ul>

      {winner && <h2 className="winner">🏆 Winner: User {winner}</h2>}

      <hr />

      <h3>📡 Live Game Events</h3>
      <ul className="logs">
        {logs.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
