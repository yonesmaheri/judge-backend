const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getAll(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        profilePic: true,
        role: true,
        username: true,
        createdAt: true,
      },
    });
    return res.json({ data: users });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

async function getOne(req, res) {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { getAll, getOne };
