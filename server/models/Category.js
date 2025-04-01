// server/models/Category.js
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const categorySchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4, // UUID sebagai default _id
    },
    name: {
      type: String,
      required: true,
      unique: true, // Ensure category names are unique
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", categorySchema);
