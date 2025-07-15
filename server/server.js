const express = require("express");
const http = require("http");
const cors = require("cors");
const { initSocket } = require("./socket/socket"); // ✅ Only once!

const app = express();
app.use(cors());
app.use(express.json());

// Optional basic route
app.get("/", (req, res) => {
  res.send("✅ Real-Time Chat Server Running");
});

// Create HTTP server and attach Socket.io
const server = http.createServer(app);

// ✅ Initialize Socket.io server
initSocket(server);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});




