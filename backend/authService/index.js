const express = require("express");
const { requestLogger } = require("./helpers/middlewares/logger");
const errorHandler = require("./helpers/middlewares/errorHandler");
const { prisma } = require("./helpers/database/prismaClient");
const validateRequest = require("./helpers/middlewares/validateRequest");

const app = express();
const AUTH_SERVICE_PORT = process.env.AUTH_SERVICE_PORT || 3002;

app.use(requestLogger);
app.use(express.json());

app.get("/data", validateRequest(), async (req, res) => {
  try {
    const newUser = await prisma.user.create({
      data: {
        email: "user@example.com",
        password: "password123",
        role: "ADMIN",
      },
    });
    res.json({ message: "User created successfully!", data: newUser });
  } catch (error) {
    throw new Error(error);
  }
});

app.use(errorHandler);

app.listen(AUTH_SERVICE_PORT, () => {
  console.log(`Server is running on http://localhost:${AUTH_SERVICE_PORT}`);
});
