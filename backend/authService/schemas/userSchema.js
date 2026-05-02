const { z } = require("zod");

const UserRegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be text",
    })
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
  role: z.enum(["EMPLOYEE", "ADMIN"], "Role must be either USER or ADMIN"),
  adminID: z.number().optional().nullable(),
});

const UserLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be text",
  }),
});

module.exports = { UserRegisterSchema, UserLoginSchema };
