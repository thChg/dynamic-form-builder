const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Dynamic Form Builder Auth API",
      version: "1.0.0",
      description: "API documentation for authentication and user identity.",
    },
    servers: [
      {
        url: "http://localhost:3000/api/auth-service",
        description: "Gateway",
      },
      {
        url: "http://localhost:3002",
        description: "Auth service direct",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        RegisterInput: {
          type: "object",
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "employee@company.com",
            },
            password: { type: "string", example: "StrongPassword123" },
            role: {
              type: "string",
              enum: ["ADMIN", "EMPLOYEE"],
              example: "EMPLOYEE",
            },
          },
          required: ["email", "password", "role"],
        },
        LoginInput: {
          type: "object",
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "admin@company.com",
            },
            password: { type: "string", example: "StrongPassword123" },
          },
          required: ["email", "password"],
        },
      },
    },
    paths: {
      "/login": {
        post: {
          tags: ["Auth"],
          summary: "Login and receive JWT token",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginInput" },
              },
            },
          },
          responses: {
            200: { description: "Login successful" },
            401: { description: "Invalid credentials" },
          },
        },
      },
      "/register": {
        post: {
          tags: ["Auth"],
          summary: "Register user (ADMIN only)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegisterInput" },
              },
            },
          },
          responses: {
            200: { description: "User created" },
            403: { description: "Only ADMIN can create users" },
          },
        },
      },
      "/user-info": {
        get: {
          tags: ["Auth"],
          summary: "Get current user info",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Current user" },
            401: { description: "Token required" },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerSpec };
