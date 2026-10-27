const express = require("express");
//import dayjs from './../node_modules/dayjs/esm/index';
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const dayjs = require("dayjs");
const pool = require("../db");
const router = express.Router();
require("dotenv").config();

// Register
router.post(
  "/register",
  [
    body("username").isLength({ min: 3 }).withMessage("Username min 3 chars"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { username, email, password } = req.body;

    try {
      const [existing] = await pool.query(
        "SELECT id FROM Users WHERE email = ? OR username = ?",
        [email, username]
      );
      if (existing.length)
        return res.status(400).json({ message: "User already exists" });

      const hashed = await bcrypt.hash(password, 10);

      await pool.query(
        "INSERT INTO Users (username, password, email) VALUES (?,?,?)",
        [username, hashed, email]
      );

      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const [rows] = await pool.query("SELECT * FROM Users WHERE email = ?", [
        email,
      ]);
      if (!rows.length)
        return res.status(400).json({ message: "Invalid credentials" });

      const user = rows[0];
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res
        .cookie("token", token, {
          httpOnly: true,
          sameSite: "lax",
        })
        .json({
          message: "Logged in",
          user: { id: user.id, username: user.username, email: user.email },
        });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Current user
router.get("/me", require("../middleware/authMiddleware"), async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, username, email FROM Users WHERE id = ?", [
      req.user.id,
    ]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
});

module.exports = router;
