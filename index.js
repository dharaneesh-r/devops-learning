const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoose = require("mongoose");
const logger = require("./config/logger");
const morgan = require("morgan");

// METRICS CONFIGURATION

const { client, httpRequestDurationSeconds } = require("./config/metrics");

// API IMPORTS CONFIGURE
const RegisterRouter = require("./view/registerView");

// Load environment variables
dotenv.config();

// Validate environment variables
if (!process.env.MONGODB_URL) {
  logger.error("MONGODB_URL is not set!");
  process.exit(1);
}

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(
  morgan("combined", { stream: { write: (msg) => logger.info(msg.trim()) } })
);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => logger.info("MongoDB connected successfully"))
  .catch((err) => logger.error(`MongoDB connection failed: ${err.message}`));

// Health check
app.get("/health", (_, res) => {
  logger.info("Health check endpoint hit");
  res.status(200).send("API is healthy");
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// API CALLING IN MAIN FILE

app.use("/register", RegisterRouter);

// ROUTE INTEGRATION FOR THE METRICS

app.use((req, res, next) => {
  const end = httpRequestDurationSeconds.startTimer();

  res.on("finish", () => {
    end({
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode,
    });
  });
  next();
});

// Centralized error handler
app.use((err, res) => {
  logger.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  logger.info(`Server running on PORT - ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.disconnect();
  logger.info("MongoDB disconnected, server shutting down");
  server.close(() => process.exit(0));
});
