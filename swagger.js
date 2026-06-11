// Generate an OpenAPI 3.0 spec. 3.0 (vs Swagger 2.0) is required so that
// `requestBody` annotations render as editable body fields in Swagger UI, and
// so multipart/form-data file uploads document correctly.
const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
  info: {
    title: 'Bingold Admin API',
    description: 'API for Bingold Admin Panel (RBAC, Blogs, News) and the BingoPay merchant payment layer on top of BinGold.',
  },
  // OpenAPI 3.0 uses `servers` instead of host/basePath/schemes.
  //  - Local/direct:      leave SWAGGER_SERVER_URL unset -> '/' (current origin)
  //  - Behind /api proxy: set SWAGGER_SERVER_URL=/api so "Try it out" hits the
  //    proxied path (origin + /api + /api/bingold/...).
  servers: [
    { url: process.env.SWAGGER_SERVER_URL || '/', description: 'Current origin' }
  ],
  tags: [
    { name: 'BingoPay - Customer Auth', description: 'SSO onboarding/login proxied to BinGold' },
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
