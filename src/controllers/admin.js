const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const signJwt = (user) =>
  jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || "7d" }
  );

async function login(req, res) {
  try {
    const { username, password } = req.body || {};
    if (!username || !password)
      return res
        .status(400)
        .json({ message: "username and password are required" });

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ message: "User Not Found" });

    if (user.role !== "admin")
      return res.status(403).json({ message: "Access denied: not an admin" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signJwt(user);

    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ message: "Logged in successfuly" });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function logout(req, res) {
  res.clearCookie(process.env.COOKIE_NAME, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    domain: ".yonesma.ir",
    path: "/",
  });
  res.json({ message: "logged out" });
}

module.exports = { login, logout };
