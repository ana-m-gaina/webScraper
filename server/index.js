const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const routes = require("./routes");
const cors = require("cors");

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(routes);

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
