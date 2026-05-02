const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const { requestLogger } = require("./helpers/middlewares/logger");
const errorHandler = require("./helpers/middlewares/errorHandler");
const authRoute = require("./routes/authRoute");
const { swaggerSpec } = require("./swagger");

const app = express();
const AUTH_SERVICE_PORT = process.env.AUTH_SERVICE_PORT || 3002;
const FRONTEND_PORT = process.env.VITE_PORT;

app.use(cors({ origin: `http://localhost:${FRONTEND_PORT}` }));
app.use(requestLogger);
app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(authRoute);

app.use(errorHandler);

app.listen(AUTH_SERVICE_PORT, () => {
  console.log(`Server is running on http://localhost:${AUTH_SERVICE_PORT}`);
});
