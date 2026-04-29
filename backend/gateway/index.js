const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { gatewayLogger } = require("./helpers/middlewares/logger");

const app = express();
const GATEWAY_PORT = process.env.GATEWAY_PORT || 3000;

app.use(gatewayLogger);

app.use(
  "/api/main-service",
  createProxyMiddleware({
    target: "http://main-service:3001",
    changeOrigin: true,
    pathRewrite: {
      "^/main-service": "",
    },
  }),
);

app.use(
  "/api/auth-service",
  createProxyMiddleware({
    target: "http://auth-service:3002",
    changeOrigin: true,
    pathRewrite: {
      "^/auth-service": "",
    },
  }),
);

app.listen(GATEWAY_PORT, () => {
  console.log(`Gateway is running on http://localhost:${GATEWAY_PORT}`);
});
