const { prisma } = require("../helpers/database/prismaClient");

const createFormController = async (req, res) => {
  try {
    const { title, description, fields, status } = req.body;
    const { userId } = req.user;

    if (!userId) {
      res.status(401);
      throw new Error("User ID is required");
    }

    const formCount = await prisma.form.count({
      where: { status },
    });

    const form = await prisma.form.create({
      data: {
        title,
        description,
        order: formCount,
        status,
        ownerId: userId,
        fields: {
          create: fields.map((field, index) => ({
            label: field.label,
            type: field.type,
            conditions: field.conditions || null,
            order: index,
          })),
        },
      },
      include: {
        fields: true, // Include related fields in response
      },
    });

    res.json(form);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const getFormsController = async (req, res) => {
  try {
    const { role, userId, adminId } = req.user;
    const conditions = {};

    if (role === "ADMIN") {
      conditions.where = {
        ownerId: userId,
        status: {
          not: "DELETED",
        },
      };
    } else {
      conditions.where = {
        ownerId: adminId,
        status: "PUBLISHED",
      };
    }

    const forms = await prisma.form.findMany({
      ...conditions,
      orderBy: [{ status: "asc" }, { order: "asc" }],
    });

    res.json(forms);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const reorderFormsController = async (req, res) => {
  try {
    const { published, draft } = req.body;
    const updates = [];

    published.forEach((id, order) => {
      updates.push(
        prisma.form.update({
          where: { id },
          data: { order },
        }),
      );
    });

    draft.forEach((id, order) => {
      updates.push(
        prisma.form.update({
          where: { id },
          data: { order },
        }),
      );
    });

    if (updates.length === 0) {
      return res.json({ message: "No forms to reorder", data: [] });
    }

    const updatedForms = await prisma.$transaction(updates);

    res.json({
      message: "Forms reordered successfully",
      data: updatedForms,
    });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const getFormByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const form = await prisma.form.findUnique({
      where: { id: parseInt(id) },
      include: { fields: true },
    });
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.json(form);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const deleteFormController = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedForm = await prisma.form.update({
      where: { id: parseInt(id) },
      data: { status: "DELETED" },
    });

    res.json({ message: "Form deleted successfully", data: deletedForm });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const updateFormController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, fields } = req.body;

    const formId = parseInt(id);

    // Use transaction to atomically update form and replace fields
    const updatedForm = await prisma.$transaction(async (tx) => {
      // Delete all existing fields for this form
      await tx.field.deleteMany({
        where: { formId },
      });

      // Update form and create new fields
      const form = await tx.form.update({
        where: { id: formId },
        data: {
          title,
          description,
          status,
          fields: {
            create: (fields || []).map((field, index) => ({
              label: field.label,
              type: field.type,
              conditions: field.conditions || null,
              order: index,
            })),
          },
        },
        include: {
          fields: true,
        },
      });

      return form;
    });

    res.json(updatedForm);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const submitFormController = async (req, res) => {
  try {
    const { id } = req.params;

    // Prefer validated payloads set by middleware
    const payload = req.validatedSimpleObject || req.body;

    if (!payload || typeof payload !== "object") {
      return res.status(400).json({ message: "Invalid submission payload" });
    }

    console.log("?///////", id);
    const formId = parseInt(id);
    if (Number.isNaN(formId)) {
      return res.status(400).json({ message: "Invalid form id" });
    }

    // Build rows for FieldResponse: expect payload to be simple object { fieldId: value }
    const rows = Object.entries(payload).map(([key, value]) => ({
      fieldId: Number(key),
      value: value === undefined || value === null ? "" : String(value),
    }));

    // Transaction: create submission, then create field responses
    const result = await prisma.$transaction(async (tx) => {
      const submission = await tx.submission.create({ data: { formId } });

      if (rows.length > 0) {
        // createMany for performance (no returned records)
        const createManyData = rows.map((r) => ({
          submissionId: submission.id,
          fieldId: r.fieldId,
          value: r.value,
        }));
        await tx.fieldResponse.createMany({ data: createManyData });
      }

      const saved = await tx.submission.findUnique({
        where: { id: submission.id },
        include: { responses: true },
      });
      return saved;
    });

    res.json({ message: "Form submitted successfully", data: result });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const getMySubmissionsController = async (req, res) => {
  try {
    const { role, userId, adminId } = req.user;

    const ownerId = role === "ADMIN" ? userId : adminId;

    const submissions = await prisma.submission.findMany({
      where: {
        form: {
          ownerId,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        form: {
          select: {
            id: true,
            title: true,
          },
        },
        responses: {
          include: {
            field: {
              select: {
                id: true,
                label: true,
                type: true,
              },
            },
          },
          orderBy: {
            id: "asc",
          },
        },
      },
    });

    res.json(submissions);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

module.exports = {
  createFormController,
  getFormsController,
  getFormByIdController,
  reorderFormsController,
  updateFormController,
  deleteFormController,
  submitFormController,
  getMySubmissionsController,
};
