// server/server.js
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors"); // Import CORS
const helmet = require("helmet"); // Import Helmet
const routes = require("./routes");
const connectDB = require("./config/db");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware untuk mengizinkan CORS
app.use(cors()); // Mengizinkan semua permintaan CORS

// Middleware untuk keamanan
app.use(helmet()); // Menambahkan header keamanan

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Development logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // Logging untuk mode pengembangan
}

// API Routes
app.use("/api", routes);

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
