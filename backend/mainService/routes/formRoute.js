const authenticateToken = require("../helpers/middlewares/authenticate");
const {
  createFormController,
  getFormsController,
  getFormByIdController,
  reorderFormsController,
  updateFormController,
  deleteFormController,
  submitFormController,
  getMySubmissionsController,
} = require("../controllers/formController");
const {
  validateRequest,
  validateWithDbConditions,
} = require("../helpers/middlewares/validateRequest");
const {
  createFormSchema,
  reorderFormsSchema,
  updateFormSchema,
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

route.get("/submissions", authenticateToken, getMySubmissionsController);

route.get("/:id", authenticateToken, getFormByIdController);

route.post(
  "/:id/submit",
  authenticateToken,
  validateWithDbConditions("field"),
  submitFormController,
);

route.put(
  "/:id",
  authenticateToken,
  validateRequest(updateFormSchema),
  updateFormController,
);

route.delete("/:id", authenticateToken, deleteFormController);

module.exports = route;
