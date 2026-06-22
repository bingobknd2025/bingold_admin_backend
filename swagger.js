// Generate an OpenAPI 3.0 spec. 3.0 (vs Swagger 2.0) is required so that
// `requestBody` annotations render as editable body fields in Swagger UI, and
// so multipart/form-data file uploads document correctly.
// Load .env so SWAGGER_SERVER_URL (e.g. '/api' behind the nginx proxy) is honored.
require('dotenv').config();
const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
  info: {
    title: 'Bingold Admin API',
    description: 'API for Bingold Admin Panel (RBAC, Blogs, News) and the BingoPay merchant payment layer on top of BinGold.',
  },
  // OpenAPI 3.0 uses `servers` instead of host/basePath/schemes.
  // The PUBLIC domain sits behind an outer reverse proxy mounted at '/api' that
  // strips that one segment before forwarding to the backend. The app's own
  // routes already carry an '/api/bingold/...' prefix, so the real public URL is
  // DOUBLE: e.g. https://admin-blog.bingold.to/api/api/bingold/blogs.
  //   server base '/api'  +  path '/api/bingold/blogs'  =  /api/api/bingold/blogs
  // That doubling is intentional — it's what makes Swagger "Try it out" hit the
  // live endpoints. Set SWAGGER_SERVER_URL to override (e.g. '' for direct/local
  // access with no proxy).
  servers: [{
    url: process.env.SWAGGER_SERVER_URL ?? '/api',
    description: 'Production (behind the /api reverse proxy)'
  }],
  tags: [
    { name: 'Vendor SSO', description: 'Partner/SSO-facing vendor flow: QR handoff, register/login, KYC/KYB (x-api-key only, vendors addressed by uuid)' },
    { name: 'BingoPay - Customer Auth', description: 'SSO onboarding/login proxied to BinGold' },
    { name: 'BingoPay - Marketplace', description: 'Server-to-server BIGOD money movement for the marketplace: order pay/refund + balance add/deduct (x-api-key)' },
    { name: 'BingoPay - Wallet', description: 'Balance / ledger / withdraw (forwards the BinGold token)' },
    { name: 'BingoPay - Merchant', description: 'Vendor self-service: onboarding, QR, KYC, dashboard, withdraw' },
    { name: 'BingoPay - Pay', description: 'Customer QR payment flow: resolve, quote, confirm' },
    { name: 'BingoPay - Webhooks', description: 'Inbound provider webhooks (Sumsub)' },
    { name: 'BingoPay Admin - Users', description: 'Admin: BingoPay user mappings' },
    { name: 'BingoPay Admin - Vendors', description: 'Admin: vendor onboarding, approval, KYC (online + offline)' },
    { name: 'BingoPay Admin - QR', description: 'Admin: merchant payment QR oversight' },
    { name: 'BingoPay Admin - Payments', description: 'Admin: payment transaction oversight' },
    { name: 'BingoPay Admin - Settlements', description: 'Admin: vendor settlement batches' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Admin endpoints: the admin JWT. BingoPay customer/merchant endpoints: the user\'s BinGold session token.'
      },
      apiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'x-api-key',
        description: 'Global API key (PDA_API_KEY). Required on every endpoint except the public webhook.'
      }
    }
  },
  security: [{ apiKeyAuth: [] }, { bearerAuth: [] }]
};

const outputFile = './swagger_output.json';
const routes = ['./src/app.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc).then(() => {
    console.log('Swagger generated successfully');
});
