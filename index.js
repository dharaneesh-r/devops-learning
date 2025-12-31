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

// Validate MongoDB environment variables
const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_CLUSTER, MONGODB_DB } = process.env;
if (!MONGODB_USER || !MONGODB_PASSWORD || !MONGODB_CLUSTER || !MONGODB_DB) {
  logger.error("MongoDB environment variables are not properly set!");
  process.exit(1);
}

// Build MongoDB connection URL
const MONGODB_URL = `mongodb+srv://${encodeURIComponent(MONGODB_USER)}:${encodeURIComponent(
  MONGODB_PASSWORD
)}@${MONGODB_CLUSTER}/${MONGODB_DB}?retryWrites=true&w=majority`;

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(
  morgan("combined", { stream: { write: (msg) => logger.info(msg.trim()) } })
);

// MongoDB connection
mongoose
  .connect(MONGODB_URL) // No need for useNewUrlParser/useUnifiedTopology
  .then(() => logger.info("MongoDB connected successfully"))
  .catch((err) => logger.error(`MongoDB connection failed: ${err.message}`));

// Health check endpoint
app.get("/health", (_, res) => {
  logger.info("Health check endpoint hit");
  res.status(200).send("API is healthy");
});

// Metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// API ROUTES
app.use("/register", RegisterRouter);

// Metrics integration middleware
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
app.use((err, req, res, next) => {
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
