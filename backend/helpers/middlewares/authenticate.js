const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401);
    throw new Error("Access token is required");
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.status(403);
      throw new Error("Invalid or expired token");
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
