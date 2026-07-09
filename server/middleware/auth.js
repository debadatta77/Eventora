const jwt = require("jsonwebtoken");
const User = require("../models/user");

// User authentication middleware
const protect = async (req, res, next) => {
  let token =
    req.headers.authorization && req.headers.authorization.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null;

  // Check if the token exists
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res
          .status(401)
          .json({ error: "Not authorized, user not found" });
      }
      // If the user is found, proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ error: "Not authorized, token failed" });
    }
    // If the token is valid, attach the user to the request object and proceed to the next middleware or route handler
  } else {
    res.status(401).json({ error: "Not authorized, no token" });
  }
};

//Middleware to check if the user is an admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Not authorized as an admin" });
  }
};

module.exports = { protect, admin };
