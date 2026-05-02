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
    const { role } = req.user;
    const conditions = {};

    if (role === "ADMIN") {
      conditions.where = {
        status: {
          not: "DELETED",
        },
      };
    } else {
      conditions.where = {
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

module.exports = {
  createFormController,
  getFormsController,
  getFormByIdController,
  reorderFormsController,
  updateFormController,
  deleteFormController,
};
