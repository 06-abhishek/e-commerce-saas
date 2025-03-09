const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const reviewRoutes = require("./routes/reviewRoutes");

dotenv.config();
const app = express();
app.use(cors({ credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use("/api/reviews", reviewRoutes);

app.listen(process.env.PORT, async () => {
  await connectDB();
  console.log(`Review Service running on port ${process.env.PORT}`);
});
