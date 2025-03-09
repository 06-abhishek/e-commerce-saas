const express = require("express");
const http = require("http");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const { ApolloServer } = require("apollo-server-express");
const setupProxy = require("./services/proxyService");
const { initWebSocket } = require("./services/socketService");
const { buildGatewaySchema } = require("./services/graphqlService");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Initialize WebSocket
initWebSocket(server);

// Initialize GraphQL
(async () => {
  const schema = await buildGatewaySchema();
  const apolloServer = new ApolloServer({ schema });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: "/graphql" });
})();

// Dynamically proxy all microservices
setupProxy(app);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "🚀 API Gateway is running with WebSockets & GraphQL" });
});

// Start server
server.listen(PORT, () => console.log(`✅ API Gateway running on port ${PORT}`));
