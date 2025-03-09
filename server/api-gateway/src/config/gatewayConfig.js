require("dotenv").config();

const services = {
  auth: process.env.AUTH_SERVICE_URL,
  product: process.env.PRODUCT_SERVICE_URL,
  order: process.env.ORDER_SERVICE_URL,
  cart: process.env.CART_SERVICE_URL,
  address: process.env.ADDRESS_SERVICE_URL,
  payment: process.env.PAYMENT_SERVICE_URL,
  review: process.env.REVIEW_SERVICE_URL,
  search: process.env.SEARCH_SERVICE_URL,
  feature: process.env.FEATURE_SERVICE_URL,
};

module.exports = services;
