// src/components/Terminal.jsx
import React, { useState, useEffect, useRef } from "react";
import "./styles.css"; // CSS ni alohida faylga olib qo'yamiz

export default function Terminal() {
  const [count, setCount] = useState(0);
  const [lineCount, setLineCount] = useState(1);
  const [curStatus, setCurStatus] = useState(0);
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

  const consoleRef = useRef(null);

  const status = [
    { id: 0, m: "Status: Connecting to server...", type: 0, loop: false },
    { id: 58, m: "Status: Successfully connected to: ", type: 0, loop: false },
    { id: 83, m: "Status: Reading IP address table...", type: 0, loop: false },
    { id: 140, m: "Status: Found 420 active IP addresses on server: ", type: 0, loop: false },
    { id: 198, m: "Status: Scanning IP address table...", type: 0, loop: false },
    { id: 204, m: "Status: Connecting to current IP address: ", type: 0, loop: true },
    { id: 860, m: "Status: Preparing DDoS attack on IP address: ", type: 0, loop: false },
    { id: 1023, m: "Status: Initiating stage 1 DDoS attack...", type: 0, loop: false },
    { id: 1030, m: "Status: Sending traffic to", type: 0, loop: true },
    { id: 1850, m: "Error: Server closed the connection unexpectedly", type: 1, loop: false },
    { id: 1860, m: "Status: Closing server connection...", type: 0, loop: false },
  ];

  const rand = () => Math.floor(Math.random() * 1000);
  const genIp = () => `${rand()}.${Math.floor(rand() / 2)}.${rand() * 3}.${Math.floor(rand() / 4)}`;

  const newLine = (txt, type) => {
    const line = { text: `$ ${txt}`, type };
    setLines(prev => [...prev, line]);
    setLineCount(prev => prev + 1);

    setTimeout(() => {
      setLines(prev => prev.filter(l => l !== line));
    }, 15000);
  };

  useEffect(() => {
    if (loading) return;

    const interval = setInterval(() => {
      if (status[curStatus] !== undefined) {
        if (status[curStatus].id < count) {
          if (status[curStatus].loop) {
            const loopTimer = setInterval(() => {
              if (count < status[curStatus + 1]?.id) {
                if (curStatus === 7) setShowAlert(true);

                newLine(status[curStatus].m + " " + genIp(), status[curStatus].type);
                setCount(c => c + 1);
              } else {
                setCurStatus(cs => cs + 1);
                clearInterval(loopTimer);
              }
            }, 100);
          } else {
            newLine(status[curStatus].m + " " + (curStatus === 1 ? genIp() : ""), status[curStatus].type);
            setCount(c => c + 1);
            setCurStatus(cs => cs + 1);
          }
        } else {
          setCount(c => c + 1);
        }
      } else {
        setShowAlert(false);
        newLine("End", 0);
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [loading, count, curStatus]);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <div className="terminal">
        {loading && <div className="loader">LOADING...</div>}
        {showAlert && <div className="alert">Access Denied...</div>}
        <div className="toolbar">
          <span className="button"></span>
          <span className="button"></span>
          <span className="button"></span>
        </div>
        <div className="console" ref={consoleRef}>
          {lines.map((line, idx) => (
            <span key={idx} className={line.type === 1 ? "danger" : ""}>
              {line.text}
            </span>
          ))}
        </div>
      </div>
      <br />
      <ul>
        <li>Time: <span>{count}</span></li>
        <li>Line count: <span>{lineCount}</span></li>
      </ul>
    </div>
  );
}
