// app.js
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const apiKeyMiddleware = require("./middleware/apiKey.middleware");
const jwtAuthMiddleware = require("./middleware/auth.middleware");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

app.set('trust proxy', 1);

/* Security */
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "connect-src": ["'self'", "ws:", "wss:"],
      },
    },
  })
);

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || ["*"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"]
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

app.use(apiKeyMiddleware);

app.use("/api/bingold/auth", require("./routes/auth.routes"));

// Public routes (no auth required)
app.use("/api/bingold", require("./routes/public/public.routes"));

app.use("/api/bingold", jwtAuthMiddleware);

app.use("/api/bingold/admin", require("./routes/admin/admin.routes"));

// Swagger documentation route
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger_output.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Bingold Admin Backend is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

app.use(errorMiddleware);

module.exports = app;