const { z } = require("zod");

const optionalDateCondition = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }

    return value;
  },
  z.coerce
    .date({
      invalid_type_error: "Date condition must be a valid date.",
    })
    .optional(),
);

const optionsCondition = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  if (!value.trim()) {
    return undefined;
  }

  try {
    const parsedValue = JSON.parse(value);
    return Array.isArray(parsedValue) ? parsedValue : value;
  } catch (error) {
    return value;
  }
}, z.array(z.string()).optional());

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
  maxDate: optionalDateCondition,
  minDate: optionalDateCondition,
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
  options: optionsCondition,
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

const updateFormSchema = createFormSchema.partial();

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


module.exports = { createFormSchema, saveDraftSchema, reorderFormsSchema, updateFormSchema };
