import React, { useState, useEffect } from "react";
import socket from "../socket/socket";

const ChatRoom = ({ username, roomId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socket.emit("joinRoom", { username, roomId });

    socket.on("newMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("userTyping", (sender) => {
      setTyping(`${sender} is typing...`);
      setTimeout(() => setTyping(""), 2000);
    });

    socket.on("userJoined", ({ username }) => {
      setOnlineUsers((prev) => [...new Set([...prev, username])]);
    });

    socket.on("userLeft", (username) => {
      setOnlineUsers((prev) => prev.filter((user) => user !== username));
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, username]);

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit("chatMessage", { roomId, message, sender: username });
    setMessage("");
  };

  const handleTyping = () => {
    socket.emit("typing", { roomId, sender: username });
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "1rem" }}>
      <h2>Room: {roomId}</h2>
      <p><strong>Online:</strong> {onlineUsers.join(", ")}</p>

      <div style={{ height: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "0.5rem" }}>
        {messages.map((msg, idx) => (
          <p key={idx}><strong>{msg.sender}:</strong> {msg.message}</p>
        ))}
        {typing && <p><i>{typing}</i></p>}
      </div>

      <input
        type="text"
        value={message}
        placeholder="Type your message..."
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleTyping}
        style={{ width: "80%", padding: "0.5rem" }}
      />
      <button onClick={sendMessage} style={{ padding: "0.5rem", marginLeft: "0.5rem" }}>
        Send
      </button>
    </div>
  );
};

export default ChatRoom;
