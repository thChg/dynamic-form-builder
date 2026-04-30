const express = require("express");
const { requestLogger } = require("./helpers/middlewares/logger");
const { prisma } = require("./helpers/database/prismaClient");

const app = express();
const MAIN_SERVICE_PORT = process.env.MAIN_SERVICE_PORT || 3001;

app.use(requestLogger);

app.get("/data", async (req, res) => {
  try {
    const newData = await prisma.field.create({
      data: {
        label: "Sample Field",
        type: "text",
        required: true,
        formId: 1,
      },
    });
    res.json({ message: "Hello from the backend!", data: newData });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(MAIN_SERVICE_PORT, () => {
  console.log(`Server is running on http://localhost:${MAIN_SERVICE_PORT}`);
});
