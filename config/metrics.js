// PACKAGE CONFIGURATION

const client = require("prom-client");

// COLLECT DEFAULT NODE.JS METRICS

client.collectDefaultMetrics();

const httpRequestDurationSeconds = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "http Request Duration Seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5],
});

module.exports = {
  client,
  httpRequestDurationSeconds,
};
