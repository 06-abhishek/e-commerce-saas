const { io } = require("socket.io-client");

const SOCKET_GATEWAY_URL = process.env.SOCKET_GATEWAY_URL || "http://localhost:5000";

const socket = io(SOCKET_GATEWAY_URL, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

socket.on("connect", () => {
  console.log("✅ Connected to API Gateway WebSocket");
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected from WebSocket");
});

module.exports = socket;
