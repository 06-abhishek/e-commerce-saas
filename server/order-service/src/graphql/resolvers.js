const Order = require("../models/Order");

const resolvers = {
  Query: {
    getOrders: async (_, __, { user }) => {
      return await Order.find({ userId: user.id });
    },
    getOrderById: async (_, { id }) => {
      return await Order.findById(id);
    },
  },
  Mutation: {
    createOrder: async (_, { products, totalAmount, address }, { user }) => {
      if (!products || products.length === 0) {
        throw new Error("Products are required");
      }

      const order = new Order({
        userId: user.id,
        products,
        totalAmount,
        address,
        status: "pending",
      });

      await order.save();
      return order;
    },
    updateOrderStatus: async (_, { id, status }) => {
      return await Order.findByIdAndUpdate(id, { status }, { new: true });
    },
    deleteOrder: async (_, { id }) => {
      await Order.findByIdAndDelete(id);
      return "Order deleted successfully";
    },
  },
};

module.exports = resolvers;
