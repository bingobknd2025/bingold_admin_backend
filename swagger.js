const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Bingold Admin API',
    description: 'API for Bingold Admin Panel (RBAC, Blogs, News) and the BingoPay merchant payment layer on top of BinGold.',
  },
  // Omit host so Swagger UI sends "Try it out" requests to the same origin the
  // docs are opened from (works locally and on the server). Override with
  // SWAGGER_HOST (e.g. "api.bingold.to") if you need a fixed target.
  host: process.env.SWAGGER_HOST || undefined,
  // Behind a reverse proxy that adds a path prefix (e.g. nginx maps
  // /api -> node root), set SWAGGER_BASE_PATH=/api so "Try it out" targets the
  // proxied URL. Defaults to '/' for direct/local access.
  basePath: process.env.SWAGGER_BASE_PATH || '/',
  schemes: ['http', 'https'],
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
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Bearer token. Admin endpoints: the admin JWT. BingoPay customer/merchant endpoints: the user\'s BinGold session token. Format: **Bearer <token>**'
    },
    apiKeyAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'x-api-key',
      description: 'Global API key (PDA_API_KEY). Required on every endpoint except the public webhook.'
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
