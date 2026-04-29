const CONSTANTS = require("../../constants/errorCode");

const errorHandler = (err, req, res, next) => {
  const STATUSCODE = res.statusCode || 500;
  res.status(500);
  
  switch (STATUSCODE) {
    case CONSTANTS.NOT_FOUND:
      res.json({
        title: "NOT FOUND",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case CONSTANTS.FORBIDDEN:
      res.json({
        title: "FORBIDDEN",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case CONSTANTS.UNAUTHORIZED:
      res.json({
        title: "UNAUTHORIZED",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case CONSTANTS.VALIDATION_ERROR:
      res.json({
        title: "VALIDATION_ERROR",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    default:
      res.json({
        title: "SERVER ERROR",
        message: err.message,
        stackTrace: err.stack,
      });
  }

  next();
};

module.exports = errorHandler;
