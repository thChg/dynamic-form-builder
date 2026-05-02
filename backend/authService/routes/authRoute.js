const authenticateToken = require("../helpers/middlewares/authenticate");
const {
  registerController,
  loginController,
  userInfoController,
} = require("../controllers/authControllers");
const { validateRequest } = require("../helpers/middlewares/validateRequest");
const {
  UserRegisterSchema,
  UserLoginSchema,
} = require("../schemas/userSchema");

const route = require("express").Router();

route.post(
  "/register",
  authenticateToken,
  validateRequest(UserRegisterSchema),
  registerController,
);

route.post("/login", validateRequest(UserLoginSchema), loginController);

route.get("/user-info", authenticateToken, userInfoController);

module.exports = route;
