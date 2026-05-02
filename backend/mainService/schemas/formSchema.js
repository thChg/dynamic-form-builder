const { z } = require("zod");

const fieldConditionsSchema = z.object({
  maxLength: z
    .number({
      invalid_type_error: "maxLength must be a number.",
    })
    .optional(),
  minLength: z
    .number({
      invalid_type_error: "minLength must be a number.",
    })
    .optional(),
  maxDate: z
    .date({
      invalid_type_error: "maxDate must be a date.",
    })
    .optional(),
  minDate: z
    .date({
      invalid_type_error: "minDate must be a date.",
    })
    .optional(),
  maxNumber: z
    .number({
      invalid_type_error: "maxNumber must be a number.",
    })
    .optional(),
  minNumber: z
    .number({
      invalid_type_error: "minNumber must be a number.",
    })
    .optional(),
  required: z
    .boolean({
      invalid_type_error: "required must be a boolean.",
    })
    .optional(),
  options: z.array(z.string()).optional(),
});

const fieldSchema = z.array(
  z.object({
    label: z
      .string({
        required_error: "Field label is required.",
        invalid_type_error: "Field label must be a string.",
      })
      .min(1, "Field label must not be empty."),
    type: z.string({
      required_error: "Field type is required.",
      invalid_type_error: "Field type must be a string.",
    }),
    conditions: fieldConditionsSchema.optional().nullable(),
  }),
);

const createFormSchema = z.object({
  title: z.string({
    required_error: "Title is required.",
    invalid_type_error: "Title must be a string.",
  }),
  description: z.string({
    invalid_type_error: "Description must be a string.",
  }),
  fields: fieldSchema,
  status: z.enum(["DRAFT", "PUBLISHED", "DELETED"], {
    required_error: "Status is required.",
    invalid_type_error:
      "Status must be one of 'DRAFT', 'PUBLISHED', or 'DELETED'.",
  }),
});

const saveDraftSchema = createFormSchema.partial();

const reorderFormsSchema = z.object({
  published: z.array(
    z
      .number({
        required_error: "Published form id is required.",
        invalid_type_error: "Published form id must be a number.",
      })
      .int()
      .positive(),
  ),
  draft: z.array(
    z
      .number({
        required_error: "Draft form id is required.",
        invalid_type_error: "Draft form id must be a number.",
      })
      .int()
      .positive(),
  ),
});

module.exports = { createFormSchema, saveDraftSchema, reorderFormsSchema };
