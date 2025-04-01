const express = require("express");
const router = express.Router();
const authRoutes = require("../routes/authRoutes");
const categoryRoutes = require("../routes/categoryRoutes");
const bookRoutes = require("../routes/bookRoutes");
const orderRoutes = require("../routes/orderRoutes");

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/books", bookRoutes);
router.use("/orders", orderRoutes);

module.exports = router;
