const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Web Scraper API",
      version: "1.0.0",
      description: "Documentation for the Web Scraper API",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
  },
  apis: ["./controllers/dataController.js"],
};


const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
