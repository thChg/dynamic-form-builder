const { prisma } = require("../database/prismaClient");
const { z } = require("zod");

const validateRequest = (schema) => {
  return (req, res, next) => {
    if (!schema) {
      res.status(500);
      throw new Error("Validation schema is required");
    }
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = JSON.parse(result.error.message)[0].message;
      res.status(400);
      throw new Error(message);
    }

    next();
  };
};

/**
 * validateWithDbConditionsFromSimpleObject(tableName, bodyKey = null)
 * - tableName: Prisma model name that contains field records (e.g. 'field')
 * - bodyKey: optional key in req.body that contains the simple object; if null, req.body itself must be the object
 *
 * Expects a payload like: { "12": "value", "13": "value2" }
 */
const validateWithDbConditions = (tableName, bodyKey = null) => {
  return async (req, res, next) => {
    try {
      if (!tableName || typeof tableName !== "string") {
        return res
          .status(500)
          .json({ message: "Table name is required for validation" });
      }

      const payload = bodyKey ? req.body[bodyKey] : req.body;
      if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
        return res.status(400).json({
          message: "Invalid payload: expected a simple object of id->value",
        });
      }

      const fieldIds = Object.keys(payload)
        .map((k) => Number(k))
        .filter((n) => !Number.isNaN(n));
      if (fieldIds.length === 0) {
        return res
          .status(400)
          .json({ message: "No valid ids found in payload" });
      }

      if (
        !prisma[tableName] ||
        typeof prisma[tableName].findMany !== "function"
      ) {
        return res
          .status(500)
          .json({ message: `Prisma model '${tableName}' not found` });
      }

      const records = await prisma[tableName].findMany({
        where: { id: { in: fieldIds } },
      });
      const recordsById = records.reduce((acc, rec) => {
        acc[String(rec.id)] = rec;
        return acc;
      }, {});

      const errors = [];

      for (const rawKey of Object.keys(payload)) {
        const idNum = Number(rawKey);
        const id = String(idNum);
        if (Number.isNaN(idNum)) {
          errors.push({
            fieldId: rawKey,
            issues: [`Invalid id key: ${rawKey}`],
          });
          continue;
        }

        const record = recordsById[id];
        if (!record) {
          errors.push({
            fieldId: id,
            issues: [`Record with id ${id} not found`],
          });
          continue;
        }

        const dbType = record.type;
        const conditions = record.conditions || {};
        const value = payload[rawKey];

        let schema;
        const isRequired = Boolean(conditions.required);

        switch (dbType) {
          case "number": {
            // build inner numeric schema first so we can call min/max on it
            let inner = z.number({
              invalid_type_error: "Value must be a number",
            });
            if (conditions.minNumber !== undefined)
              inner = inner.min(Number(conditions.minNumber), {
                message: `Must be >= ${conditions.minNumber}`,
              });
            if (conditions.maxNumber !== undefined)
              inner = inner.max(Number(conditions.maxNumber), {
                message: `Must be <= ${conditions.maxNumber}`,
              });

            schema = z.preprocess((v) => {
              if (v === "" || v === null || v === undefined) return undefined;
              const n = Number(v);
              return Number.isNaN(n) ? v : n;
            }, inner);
            if (!isRequired) schema = schema.optional();
            break;
          }

          case "date": {
            // build inner date schema first and apply range refinements
            let innerDate = z.date({
              invalid_type_error: "Value must be a valid date",
            });
            if (conditions.minDate) {
              const min = new Date(conditions.minDate);
              innerDate = innerDate.refine((d) => d === undefined || d >= min, {
                message: `Date must be on or after ${min.toISOString()}`,
              });
            }
            if (conditions.maxDate) {
              const max = new Date(conditions.maxDate);
              innerDate = innerDate.refine((d) => d === undefined || d <= max, {
                message: `Date must be on or before ${max.toISOString()}`,
              });
            }

            schema = z.preprocess((v) => {
              if (v === "" || v === null || v === undefined) return undefined;
              const d = new Date(v);
              return isNaN(d.getTime()) ? v : d;
            }, innerDate);

            if (!isRequired) schema = schema.optional();
            break;
          }

          case "email":
            schema = z.string({ invalid_type_error: "Value must be a string" });
            schema = schema.refine(
              (v) =>
                v === undefined ||
                v === "" ||
                z.string().email().safeParse(v).success,
              { message: "Invalid email address" },
            );
            if (conditions.minLength !== undefined)
              schema = schema.refine(
                (v) =>
                  v === undefined || v.length >= Number(conditions.minLength),
                { message: `Minimum length is ${conditions.minLength}` },
              );
            if (conditions.maxLength !== undefined)
              schema = schema.refine(
                (v) =>
                  v === undefined || v.length <= Number(conditions.maxLength),
                { message: `Maximum length is ${conditions.maxLength}` },
              );
            if (!isRequired) schema = schema.optional();
            break;

          case "select":
            schema = z.string({ invalid_type_error: "Value must be a string" });
            let options = conditions.options;
            if (typeof options === "string" && options.trim()) {
              try {
                const parsed = JSON.parse(options);
                if (Array.isArray(parsed)) options = parsed;
              } catch (err) {
                options = options
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean);
              }
            }
            if (Array.isArray(options) && options.length > 0)
              schema = schema.refine(
                (v) => v === undefined || v === "" || options.includes(v),
                { message: `Must be one of: ${options.join(", ")}` },
              );
            if (!isRequired) schema = schema.optional();
            break;

          case "color":
            schema = z.string({ invalid_type_error: "Value must be a string" });
            schema = schema.refine(
              (v) =>
                v === undefined ||
                v === "" ||
                /^#([0-9A-Fa-f]{3}){1,2}$/.test(v),
              { message: "Invalid color value" },
            );
            if (!isRequired) schema = schema.optional();
            break;

          default:
            schema = z.string({ invalid_type_error: "Value must be a string" });
            if (conditions.minLength !== undefined)
              schema = schema.min(Number(conditions.minLength), {
                message: `Minimum length is ${conditions.minLength}`,
              });
            if (conditions.maxLength !== undefined)
              schema = schema.max(Number(conditions.maxLength), {
                message: `Maximum length is ${conditions.maxLength}`,
              });
            if (!isRequired) schema = schema.optional();
            break;
        }

        try {
          schema.parse(value);
        } catch (e) {
          errors.push({ fieldId: id, issues: e.errors || e.message });
        }
      }

      if (errors.length > 0)
        throw new Error(errors.map((e) => e.issues[0].message));

      req.validatedSimpleObject = payload;
      next();
    } catch (err) {
      res.status(400);
      throw new Error(err.message || "Validation error");
    }
  };
};

module.exports = {
  validateRequest,
  validateWithDbConditions,
};
