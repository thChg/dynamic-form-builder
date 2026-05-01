const validateRequest = (schema) => {
  return (req, res, next) => {
    if (!schema) {
      res.status(500);
      throw new Error("Validation schema is required");
    }
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = JSON.parse(result.error.message)[0].message;
      res.status(400);
      throw new Error(message);
    }

    next();
  };
};

module.exports = validateRequest;
