const { Server } = require("socket.io");

let io;

const initWebSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected to API Gateway WebSocket");

    socket.on("disconnect", () => {
      console.log("Client disconnected from API Gateway WebSocket");
    });
  });
};

// Emit real-time order updates
const emitOrderUpdate = (orderId, status) => {
  if (io) {
    io.emit("order-update", { orderId, status });
  }
};

// Emit real-time cart updates
const emitCartUpdate = (userId, cart) => {
  if (io) {
    io.emit("cart-update", { userId, cart });
  }
};

module.exports = { initWebSocket, emitOrderUpdate, emitCartUpdate };
