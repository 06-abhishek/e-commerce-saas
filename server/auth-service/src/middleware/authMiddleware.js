const jwt = require("jsonwebtoken");
const { getCache, setCache } = require("../config/redis");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // Check Redis Cache
    const cachedUser = await getCache(`auth:${token}`);

    if (cachedUser) {
      req.user = cachedUser;
      return next();
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Extract token expiration
    const expiry = decoded.exp
      ? decoded.exp - Math.floor(Date.now() / 1000)
      : 3600;

    // Cache user session in Redis
    await setCache(`auth:${token}`, decoded, expiry);

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
