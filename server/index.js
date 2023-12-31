const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swaggerDef.js");
const routes = require("./routes");
const cors = require("cors");

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
