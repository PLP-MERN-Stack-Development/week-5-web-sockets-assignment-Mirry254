const { Server } = require("socket.io");

let users = {};

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Your React frontend port
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("joinRoom", ({ roomId, username }) => {
      socket.join(roomId);
      users[socket.id] = { username, roomId };
      io.to(roomId).emit("userJoined", { username });
    });

    socket.on("chatMessage", ({ roomId, message, sender }) => {
      io.to(roomId).emit("newMessage", { message, sender });
    });

    socket.on("typing", ({ roomId, sender }) => {
      socket.to(roomId).emit("userTyping", sender);
    });

    socket.on("disconnect", () => {
      const user = users[socket.id];
      if (user) {
        socket.to(user.roomId).emit("userLeft", user.username);
        delete users[socket.id];
      }
      console.log("❌ User disconnected:", socket.id);
    });
  });
};

module.exports = { initSocket };
