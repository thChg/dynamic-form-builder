const authenticateToken = require("../helpers/middlewares/authenticate");
const {
  createFormController,
  getFormsController,
  getFormByIdController,
  reorderFormsController,
  updateFormController,
  deleteFormController,
} = require("../controllers/formController");
const validateRequest = require("../helpers/middlewares/validateRequest");
const {
  createFormSchema,
  reorderFormsSchema,
} = require("../schemas/formSchema");
const route = require("express").Router();

route.post(
  "/",
  authenticateToken,
  validateRequest(createFormSchema),
  createFormController,
);

route.put(
  "/reorder",
  authenticateToken,
  validateRequest(reorderFormsSchema),
  reorderFormsController,
);

route.get("/", authenticateToken, getFormsController);

route.get("/:id", authenticateToken, getFormByIdController);

route.put(
  "/:id",
  authenticateToken,
  validateRequest(createFormSchema),
  updateFormController,
);

route.delete("/:id", authenticateToken, deleteFormController);

module.exports = route;
