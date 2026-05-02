export const fieldConfigurations = {
  text: {
    required: "boolean",
    maxLength: "number",
    minLength: "number",
  },
  number: {
    required: "boolean",
    maxNumber: "number",
    minNumber: "number",
  },
  email: {
    required: "boolean",
  },
  date: {
    required: "boolean",
    minDate: "date",
    maxDate: "date",
  },
  color: {
    required: "boolean",
  },
  select: {
    required: "boolean",
    options: "array",
  },
};
