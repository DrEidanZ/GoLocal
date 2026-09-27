const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET || "golocal-development-secret";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Access token is required.",
    });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      message: "Invalid authorization header.",
    });
  }

  const token = parts[1];

  if (!token) {
    return res.status(401).json({
      message: "Access token is required.",
    });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);

    req.user = user;

    next();
  } catch (error) {
    console.error("JWT verification failed:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);

    return res.status(403).json({
      message: "Invalid or expired token.",
    });
  }
};

module.exports = authenticateToken;