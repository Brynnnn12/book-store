const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then((conn) => console.log(`MongoDB Connected: ${conn.connection.host}`))
    .catch((error) => {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    });
};

module.exports = connectDB;
