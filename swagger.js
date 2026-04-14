const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Bingold Admin API',
    description: 'API for Bingold Admin Panel, including RBAC, Blogs and News',
  },
  host: 'localhost:3000',
  basePath: '/',
  schemes: ['http', 'https'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Enter your bearer token in the format **Bearer <token>**'
    }
  },
  security: [{ bearerAuth: [] }]
};

const outputFile = './swagger_output.json';
const routes = ['./src/app.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc).then(() => {
    console.log('Swagger generated successfully');
});
