const gatewayLogger = (req, res, next) => {
  console.log(`[Gateway]: ${req.method} ${req.url}`);
  next();
};

const requestLogger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

module.exports = { gatewayLogger, requestLogger };
