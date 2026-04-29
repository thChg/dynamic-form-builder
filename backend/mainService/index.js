const express = require("express");
const { requestLogger } = require("../helpers/middlewares/logger");

const app = express();
const MAIN_SERVICE_PORT = process.env.MAIN_SERVICE_PORT || 3001;

app.use(requestLogger);

app.get("/data", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

app.listen(MAIN_SERVICE_PORT, () => {
  console.log(`Server is running on http://localhost:${MAIN_SERVICE_PORT}`);
});
