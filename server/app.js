const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const serverless = require("serverless-http");

const routes = require("./routes");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Load env
dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: "*" }));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api", routes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Jalankan app.listen hanya di mode development
if (process.env.NODE_ENV === "development") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running in development mode on port ${PORT}`);
  });
}

// Export untuk Vercel
module.exports = app;
module.exports.handler = serverless(app);
