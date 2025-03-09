const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    category: String!
    image: String
  }

  type Query {
    getProduct(id: ID!): Product
    getProducts: [Product]
  }

  type Mutation {
    createProduct(name: String!, description: String!, price: Float!, category: String!, image: String): Product
    updateProduct(id: ID!, name: String, description: String, price: Float, category: String, image: String): Product
    deleteProduct(id: ID!): String
  }
`;

module.exports = typeDefs;
