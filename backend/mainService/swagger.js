const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Dynamic Form Builder API",
      version: "1.0.0",
      description: "API documentation for the main service.",
    },
    servers: [
      {
        url: "http://localhost:3000/api/main-service",
        description: "Gateway",
      },
      {
        url: "http://localhost:3001",
        description: "Main service direct",
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
        FieldInput: {
          type: "object",
          properties: {
            label: { type: "string", example: "Full name" },
            type: { type: "string", example: "text" },
            conditions: {
              type: "object",
              nullable: true,
              additionalProperties: true,
            },
          },
          required: ["label", "type"],
        },
        FormInput: {
          type: "object",
          properties: {
            title: { type: "string", example: "Employee profile" },
            description: {
              type: "string",
              nullable: true,
              example: "Please fill all required fields",
            },
            status: {
              type: "string",
              enum: ["DRAFT", "PUBLISHED"],
              example: "DRAFT",
            },
            fields: {
              type: "array",
              items: { $ref: "#/components/schemas/FieldInput" },
            },
          },
          required: ["title", "status", "fields"],
        },
        ReorderFormsInput: {
          type: "object",
          properties: {
            published: {
              type: "array",
              items: { type: "integer" },
              example: [1, 3, 5],
            },
            draft: {
              type: "array",
              items: { type: "integer" },
              example: [2, 4],
            },
          },
          required: ["published", "draft"],
        },
        SubmissionInput: {
          type: "object",
          additionalProperties: {
            oneOf: [
              { type: "string" },
              { type: "number" },
              { type: "boolean" },
            ],
          },
          example: {
            11: "John Doe",
            12: "john@example.com",
            13: "2026-05-03",
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      "/forms": {
        get: {
          tags: ["Forms"],
          summary: "Get forms",
          responses: {
            200: { description: "List of forms" },
          },
        },
        post: {
          tags: ["Forms"],
          summary: "Create a new form",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/FormInput" },
              },
            },
          },
          responses: {
            200: { description: "Form created" },
          },
        },
      },
      "/forms/reorder": {
        put: {
          tags: ["Forms"],
          summary: "Reorder forms",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ReorderFormsInput" },
              },
            },
          },
          responses: {
            200: { description: "Forms reordered" },
          },
        },
      },
      "/forms/{id}": {
        get: {
          tags: ["Forms"],
          summary: "Get form by id",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Form details" },
          },
        },
        put: {
          tags: ["Forms"],
          summary: "Update form",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/FormInput" },
              },
            },
          },
          responses: {
            200: { description: "Form updated" },
          },
        },
        delete: {
          tags: ["Forms"],
          summary: "Delete form",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Form deleted" },
          },
        },
      },
      "/forms/{id}/submit": {
        post: {
          tags: ["Submissions"],
          summary: "Submit form answers",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SubmissionInput" },
              },
            },
          },
          responses: {
            200: { description: "Submitted successfully" },
          },
        },
      },
      "/forms/submissions": {
        get: {
          tags: ["Submissions"],
          summary: "Get submissions list",
          responses: {
            200: { description: "Submissions list" },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerSpec };
