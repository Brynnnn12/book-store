const express = require("express");
const router = express.Router();
const authRoutes = require("../routes/authRoutes");
const categoryRoutes = require("../routes/categoryRoutes");
const bookRoutes = require("../routes/bookRoutes");
const orderRoutes = require("../routes/orderRoutes");

router.get("/", (req, res) => {
  res.json({ message: "API working!" });
});
router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/books", bookRoutes);
router.use("/orders", orderRoutes);

module.exports = router;
