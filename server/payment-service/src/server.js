const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const paymentRoutes = require("./routes/paymentRoutes");

dotenv.config();
const app = express();
app.use(cors({ credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use("/api/payment", paymentRoutes);

app.listen(process.env.PORT, async () => {
  await connectDB();
  console.log(`Payment Service running on port ${process.env.PORT}`);
});
