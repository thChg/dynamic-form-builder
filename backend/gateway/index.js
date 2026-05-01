const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const { gatewayLogger } = require("./helpers/middlewares/logger");

const app = express();
const GATEWAY_PORT = process.env.GATEWAY_PORT || 3000;
const MAIN_SERVICE_PORT = process.env.MAIN_SERVICE_PORT || 3001;
const AUTH_SERVICE_PORT = process.env.AUTH_SERVICE_PORT || 3002;
const FRONTEND_PORT = process.env.VITE_PORT;

app.use(cors({ origin: `http://localhost:${FRONTEND_PORT}` }));

app.use(gatewayLogger);

app.use(
  "/api/main-service",
  createProxyMiddleware({
    target: `http://main-service:${MAIN_SERVICE_PORT}`,
    changeOrigin: true,
    pathRewrite: {
      "^/main-service": "",
    },
  }),
);

app.use(
  "/api/auth-service",
  createProxyMiddleware({
    target: `http://auth-service:${AUTH_SERVICE_PORT}`,
    changeOrigin: true,
    pathRewrite: {
      "^/auth-service": "",
    },
  }),
);

app.listen(GATEWAY_PORT, () => {
  console.log(`Gateway is running on http://localhost:${GATEWAY_PORT}`);
});
