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
        url: "https://webscraper01-e3942cf1e1f6.herokuapp.com/",
        description: "Development server",
      },
    ],
  },
  apis: ["./controllers/dataController.js"],
};


const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
