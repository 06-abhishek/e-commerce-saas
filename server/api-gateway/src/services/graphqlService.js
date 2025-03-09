const { ApolloGateway } = require("@apollo/gateway");
const { ApolloServer } = require("apollo-server-express");
const services = require("../config/gatewayConfig");

async function buildGatewaySchema() {
  try {
    const gateway = new ApolloGateway({
      serviceList: Object.entries(services).map(([name, url]) => ({
        name,
        url: `${url}/graphql`,
      })),
    });
    return gateway.load();
  } catch (error) {
    console.error("Error building GraphQL Gateway schema:", error);
    throw new Error("Failed to build GraphQL schema");
  }
}

module.exports = { buildGatewaySchema };
