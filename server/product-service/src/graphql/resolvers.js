const Product = require("../models/Product");

const resolvers = {
  Query: {
    getProduct: async (_, { id }) => {
      return await Product.findById(id);
    },
    getProducts: async () => {
      return await Product.find();
    },
  },
  Mutation: {
    createProduct: async (_, { name, description, price, category, image }) => {
      const product = new Product({ name, description, price, category, image });
      await product.save();
      return product;
    },
    updateProduct: async (_, { id, name, description, price, category, image }) => {
      return await Product.findByIdAndUpdate(id, { name, description, price, category, image }, { new: true });
    },
    deleteProduct: async (_, { id }) => {
      await Product.findByIdAndDelete(id);
      return "Product deleted successfully";
    },
  },
};

module.exports = resolvers;
