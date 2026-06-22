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

/* Security
 * CSP is kept ON (protects the API), but tuned so Swagger UI works:
 *  - script-src adds 'unsafe-inline' (swagger-ui-express injects an inline
 *    init script; without this the docs page renders blank).
 *  - 'upgrade-insecure-requests' is REMOVED so the page can be opened over
 *    plain http://<ip>:<port> without the browser forcing https
 *    (that forced upgrade is what caused ERR_SSL_PROTOCOL_ERROR).
 */
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "'unsafe-inline'"],
        "style-src": ["'self'", "https:", "'unsafe-inline'"],
        "img-src": ["'self'", "data:", "https:"],
        "connect-src": ["'self'", "ws:", "wss:"],
        "upgrade-insecure-requests": null,
      },
    },
  })
);

// Normalize the allow-list: trim whitespace/newlines from each entry and drop
// any trailing slash, so 'https://bingold.to/' in the env matches the browser's
// origin 'https://bingold.to'. Without this, a single stray space made the
// origin check fail and the preflight returned 500.
const stripSlash = (s) => s.replace(/\/+$/, "");
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "*")
  .split(",")
  .map((o) => stripSlash(o.trim()))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // No Origin header = same-origin, curl, or server-to-server → allow.
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(stripSlash(origin))) {
        return callback(null, true);
      }
      // Disallowed origin: reject WITHOUT throwing. Throwing here routed the
      // request to the error middleware and returned 500 on the OPTIONS
      // preflight; returning `false` lets cors respond normally (no CORS
      // headers) so the browser reports a clean CORS failure instead.
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
    optionsSuccessStatus: 204,
  })
);

app.use(express.json({
  limit: '10mb',
  // Stash the raw body so webhook handlers (e.g. Sumsub) can verify HMAC
  // signatures against the exact bytes that were sent.
  verify: (req, res, buf) => { req.rawBody = buf; }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

/* ─── Public routes (NO api-key, NO JWT) ─────────────────────────── */

// Health must be reachable without the api key (load balancers / uptime checks).
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Bingold Admin Backend is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

const publicAgentController = require('./controllers/public/agent.public.controller');
app.get('/verify/:code', publicAgentController.verifyAgentRedirect);
app.get('/verify', publicAgentController.verifyAgentRedirect);
app.get('/api/bingold/agents/verify/:code', publicAgentController.verifyAgentRedirect);

const sitemapController = require('./controllers/public/sitemap.public.controller');
app.get('/sitemap.xml', sitemapController.getSitemap);
app.get('/api/bingold/sitemap.xml', sitemapController.getSitemap);

const sumsubPublicController = require('./controllers/public/sumsub.public.controller');
app.post('/api/bingold/webhooks/sumsub',
  /*  #swagger.tags = ['BingoPay - Webhooks']
      #swagger.summary = 'Sumsub KYC webhook (authenticated by x-payload-digest HMAC; no api-key/JWT)'
      #swagger.security = [] */
  sumsubPublicController.handleWebhook);

// Swagger UI — public docs page, mounted BEFORE the api-key middleware so the
// browser can load it without an x-api-key header. The spec is bundled inline
// (no external swagger.json fetch). persistAuthorization keeps the entered
// x-api-key across reloads.
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger_output.json');
// Mounted at BOTH bases so the docs load whether or not the nginx /api reverse
// proxy strips the prefix: hitting it directly is /api-docs, and the public
// https://admin-blog.bingold.to/api/api-docs lands here too. Both sit ABOVE the
// api-key middleware, so neither path triggers "Invalid or missing API key".
app.use(
  ['/api-docs', '/api/api-docs'],
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      persistAuthorization: true,
    },
  })
);

/* ─── API-key protected ──────────────────────────────────────────── */
app.use(apiKeyMiddleware);

app.use("/api/bingold/auth", require("./routes/auth.routes"));

app.use("/api/bingold", require("./routes/public/public.routes"));

app.use("/api/bingold/bingopay", require("./routes/bingopay/customer.routes"));
app.use("/api/bingold/bingopay/merchant", require("./routes/bingopay/merchant.routes"));
app.use("/api/bingold/bingopay/pay", require("./routes/bingopay/pay.routes"));

// Partner/SSO-facing vendor surface — authed by x-api-key only (no JWT), so it
// is mounted before the JWT middleware below.
app.use("/api/v1/common/vendors", require("./routes/common/vendor-sso.routes"));

/* ─── JWT protected (admin) ──────────────────────────────────────── */
app.use("/api/bingold", jwtAuthMiddleware);
app.use("/api/bingold/admin", require("./routes/admin/admin.routes"));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

app.use(errorMiddleware);

module.exports = app;
