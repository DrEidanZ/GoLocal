const jwt = require("jsonwebtoken");

const JWT_SECRET = "golocal-secret-key";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Access token is required.",
    });
  }

  const token = authHeader.split(" ")[1];

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
    return res.status(403).json({
      message: "Invalid or expired token.",
    });
  }
};

module.exports = authenticateToken;