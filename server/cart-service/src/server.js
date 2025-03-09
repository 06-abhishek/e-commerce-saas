const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const cartRoutes = require("./routes/cartRoutes");
const socket = require("./config/websocket"); // Import WebSocket client

const app = express();
const PORT = process.env.PORT || 5004;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/api/cart", cartRoutes);

// WebSocket event listener for cart updates (Optional)
socket.on("cart-update", (data) => {
  console.log(`🛒 Cart Update: User ID ${data.userId} - Updated Cart`);
});

app.listen(PORT, async () => {
  await connectDB();
  console.log(`✅ Cart Service running on port ${PORT}`);
});
