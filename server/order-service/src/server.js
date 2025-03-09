const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const socket = require("./config/websocket"); // Import WebSocket client

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());

async function startApolloServer() {
  await connectDB();
  
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  // WebSocket event listener for order updates (Optional)
  socket.on("order-update", (data) => {
    console.log(`Order Update: Order ID ${data.orderId} - Status: ${data.status}`);
  });

  app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
    console.log(`GraphQL Endpoint: http://localhost:${PORT}/graphql`);
  });
}

startApolloServer();
