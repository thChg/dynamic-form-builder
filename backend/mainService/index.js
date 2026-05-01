const express = require("express");
const cors = require("cors");
const { z } = require("zod");
const { requestLogger } = require("./helpers/middlewares/logger");
const errorHandler = require("./helpers/middlewares/errorHandler");
const validateRequest = require("./helpers/middlewares/validateRequest");
const { prisma } = require("./helpers/database/prismaClient");

const app = express();
const MAIN_SERVICE_PORT = process.env.MAIN_SERVICE_PORT || 3001;
const FRONTEND_PORT = process.env.VITE_PORT;

app.use(cors({ origin: `http://localhost:${FRONTEND_PORT}` }));

app.use(requestLogger);
app.use(express.json());

const fieldInputSchema = z.object({
  label: z.string().min(1),
  type: z.string().min(1),
  required: z.boolean(),
  options: z.string().optional().nullable(),
});

const formCreateSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().optional().nullable(),
    fields: z
      .union([
        z.array(fieldInputSchema).min(1),
        z.object({
          create: z.array(fieldInputSchema).min(1),
        }),
      ])
      .optional(),
  })
  .transform((data) => {
    if (Array.isArray(data.fields)) {
      return { ...data, fields: { create: data.fields } };
    }

    return data;
  });

app.post(
  "/data",
  validateRequest({ body: formCreateSchema }),
  async (req, res) => {
    console.log(req.body);
    try {
      const newData = await prisma.form.create({
        data: {
          ...req.body,
        },
      });
      res.json({ message: "Hello from the backend!", data: newData });
    } catch (error) {
      req.status(500);
      throw new Error(error);
    }
  },
);

app.use(errorHandler);

app.listen(MAIN_SERVICE_PORT, () => {
  console.log(`Server is running on http://localhost:${MAIN_SERVICE_PORT}`);
});
