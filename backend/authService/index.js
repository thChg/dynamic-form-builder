const express = require("express");
const { requestLogger } = require("../helpers/middlewares/logger");

const app = express();
const AUTH_SERVICE_PORT = process.env.AUTH_SERVICE_PORT || 3002;

app.use(requestLogger);

app.get("/data", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

app.listen(AUTH_SERVICE_PORT, () => {
  console.log(`Server is running on http://localhost:${AUTH_SERVICE_PORT}`);
});
