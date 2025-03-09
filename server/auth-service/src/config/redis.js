const Redis = require("ioredis");

const redisClient = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: (times) => Math.min(times * 50, 2000), // Auto-reconnect
});

redisClient.on("connect", () => console.log("Connected to Redis"));
redisClient.on("error", (err) => console.error("Redis Error:", err));

const setCache = async (key, value, expiry) => {
  try {
    await redisClient.setex(key, expiry, JSON.stringify(value));
  } catch (error) {
    console.error("Redis SET Error:", error);
  }
};

const getCache = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Redis GET Error:", error);
    return null;
  }
};

const deleteCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error("Redis DEL Error:", error);
  }
};

module.exports = { redisClient, setCache, getCache, deleteCache };
