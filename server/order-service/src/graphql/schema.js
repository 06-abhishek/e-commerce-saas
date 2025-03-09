const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Order {
    id: ID!
    userId: ID!
    products: [ProductOrder!]!
    totalAmount: Float!
    address: String!
    status: String!
  }

  type ProductOrder {
    productId: ID!
    quantity: Int!
  }

  type Query {
    getOrders: [Order!]!
    getOrderById(id: ID!): Order
  }

  type Mutation {
    createOrder(products: [ProductOrderInput!]!, totalAmount: Float!, address: String!): Order!
    updateOrderStatus(id: ID!, status: String!): Order!
    deleteOrder(id: ID!): String!
  }

  input ProductOrderInput {
    productId: ID!
    quantity: Int!
  }
`;

module.exports = typeDefs;
