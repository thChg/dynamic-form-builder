const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { prisma } = require("../helpers/database/prismaClient");

const registerController = async (req, res) => {
  try {
    const { userId, role: reqUserRole } = req.user;

    if (reqUserRole !== "ADMIN") {
      res.status(403);
      throw new Error("Only ADMIN can create new users");
    }

    const { email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser = { email, password: hashedPassword, role };
    newUser.adminId = role === "EMPLOYEE" ? userId : null;

    await prisma.user.create({
      data: newUser,
    });

    res.json({ message: "User created successfully!" });
  } catch (error) {
    throw new Error(error);
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, adminId: user.adminId },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.json({
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        adminId: user.adminId,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
};

const userInfoController = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        adminId: true,
      },
    });

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  registerController,
  loginController,
  userInfoController
};
