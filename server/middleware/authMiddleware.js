// server/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({
        status: false,
        message: "Tidak terautentikasi, token tidak valid",
      });
    }
  } else {
    res.status(401).json({
      status: false,
      message: "Tidak terautentikasi, tidak ada token",
    });
  }
});

const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({
      status: false,
      message: "Tidak terautentikasi sebagai admin",
    });
  }
});

module.exports = { protect, admin };
