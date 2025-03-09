const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const addressRoutes = require("./routes/addressRoutes");

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/api/address", addressRoutes);

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Address Service running on port ${PORT}`);
});
