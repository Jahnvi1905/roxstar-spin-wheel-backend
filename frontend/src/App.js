import React, { useEffect, useState, useRef } from "react";
import { API_BASE_URL } from "./api";
import { socket } from "./socket";
import "./App.css";

const COLORS = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];

function App() {
  const [logs, setLogs] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [winner, setWinner] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const logsEndRef = useRef(null);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // ---------- SOCKET EVENTS ----------
  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ WebSocket connected");
    });

    socket.on("USER_JOINED", (data) => {
      setLogs((prev) => [...prev, { type: "join", text: `User ${data.userId} joined the wheel` }]);
      setParticipants((prev) => {
        if (!prev.includes(data.userId)) return [...prev, data.userId];
        return prev;
      });
    });

    socket.on("USER_ELIMINATED", (data) => {
      setIsSpinning(true); // Ensure spinning visually starts if missed
      setLogs((prev) => [...prev, { type: "eliminate", text: `User ${data.userId} was eliminated` }]);
      setParticipants((prev) => prev.filter(id => id !== data.userId));
    });

    socket.on("WINNER_DECLARED", (data) => {
      setIsSpinning(false);
      setLogs((prev) => [
        ...prev,
        { type: "winner", text: `User ${data.userId} won ${data.amount} coins!` },
      ]);
      setWinner(data.userId);
    });

    return () => {
      socket.off("USER_JOINED");
      socket.off("USER_ELIMINATED");
      socket.off("WINNER_DECLARED");
    };
  }, []);

  // ---------- API CALLS ----------
  const createWheel = async () => {
    setWinner(null);
    setParticipants([]);
    setLogs([]);
    setIsSpinning(false);
    const res = await fetch(`${API_BASE_URL}/spin-wheel/create`, { method: "POST" });
    const data = await res.json();
    if (data.error) alert(data.error);
  };

  const joinWheel = async (userId) => {
    const res = await fetch(`${API_BASE_URL}/spin-wheel/join/${userId}`, { method: "POST" });
    const data = await res.json();
    if (data.error) alert(data.error);
  };

  const startWheel = async () => {
    if (participants.length < 3) {
      alert("Minimum 3 users required to start");
      return;
    }
    setWinner(null);
    setIsSpinning(true);
    const res = await fetch(`${API_BASE_URL}/spin-wheel/start`, { method: "POST" });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
      setIsSpinning(false);
    }
  };

  // ---------- DYNAMIC WHEEL SLICES ----------
  const generateWheelGradient = () => {
    if (participants.length === 0) return "conic-gradient(from 0deg, #1e293b, #0f172a)";
    if (participants.length === 1) return `conic-gradient(from 0deg, ${COLORS[participants[0] % COLORS.length]} 0deg 360deg)`;
    
    const sliceAngle = 360 / participants.length;
    let gradientParts = [];
    
    participants.forEach((p, index) => {
      const color = COLORS[p % COLORS.length]; 
      const startAngle = index * sliceAngle;
      const endAngle = (index + 1) * sliceAngle;
      gradientParts.push(`${color} ${startAngle}deg ${endAngle}deg`);
    });
    
    return `conic-gradient(${gradientParts.join(", ")})`;
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">RoxStar Casino</h1>
        <p className="status">Connected to: {API_BASE_URL}</p>
      </header>

      <div className="main-content">
        
        {/* LEFT PANEL: CONTROLS */}
        <section className="glass-panel">
          <h2 className="panel-title">Game Controls</h2>
          
          <div className="btn-group">
            <button className="btn-primary" onClick={createWheel}>
              🎲 Create New Wheel
            </button>
            
            <div className="join-buttons">
              <button className="btn-secondary" onClick={() => joinWheel(1)}>Join as User 1</button>
              <button className="btn-secondary" onClick={() => joinWheel(2)}>Join as User 2</button>
              <button className="btn-secondary" onClick={() => joinWheel(3)}>Join as User 3</button>
            </div>

            <button className="btn-accent" onClick={startWheel}>
              ⚡ SPIN THE WHEEL
            </button>
          </div>
        </section>

        {/* CENTER PANEL: THE WHEEL & WINNER */}
        <section className="glass-panel center-display">
          
          <div className="wheel-container">
            <div className="wheel-pointer">▼</div>
            <div 
              className={`wheel-placeholder ${isSpinning ? "fast-spin" : ""}`}
              style={{ background: generateWheelGradient() }}
            >
              <div className="wheel-inner">
                {isSpinning ? "🎰" : "🎡"}
              </div>
            </div>
          </div>

          <h2 className="panel-title" style={{ textAlign: "center", width: "100%", border: "none" }}>
            Active Players
          </h2>
          
          <div className="participant-grid">
            {participants.length === 0 ? (
              <p style={{ opacity: 0.5 }}>Waiting for players...</p>
            ) : (
              participants.map((p) => (
                <div key={p} className="participant-badge" style={{ borderColor: COLORS[p % COLORS.length], color: COLORS[p % COLORS.length], backgroundColor: `${COLORS[p % COLORS.length]}20` }}>
                  User {p}
                </div>
              ))
            )}
          </div>

          {winner && (
            <div className="winner-display">
              🏆 Winner: User {winner}
            </div>
          )}
        </section>

        {/* RIGHT PANEL: LIVE LOGS */}
        <section className="glass-panel">
          <h2 className="panel-title">Live Events</h2>
          <ul className="logs-list">
            {logs.length === 0 ? (
              <p style={{ opacity: 0.5, textAlign: "center", marginTop: "20px" }}>No events yet</p>
            ) : (
              logs.map((log, index) => (
                <li key={index} className={`log-item ${log.type}`}>
                  {log.type === "join" && "🟢"}
                  {log.type === "eliminate" && "❌"}
                  {log.type === "winner" && "🏆"}
                  {log.text}
                </li>
              ))
            )}
            <div ref={logsEndRef} />
          </ul>
        </section>

      </div>
    </div>
  );
}

export default App;
