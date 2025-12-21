const express = require("express");
const { body, validationResult } = require("express-validator");
const pool = require("../db");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Get feed (join Users, Posts similar to your HTML home feed)[file:11][file:13]
router.get("/", auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT Posts.id, Posts.caption, Posts.image, Posts.createdAt,
              Users.username
       FROM Posts
       JOIN Users ON Posts.userid = Users.id
       ORDER BY Posts.createdAt DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create post
router.post(
  "/",
  auth,
  [body("caption").isLength({ min: 1 }).withMessage("Caption required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { caption, image } = req.body; // image = URL or path

    try {
      const [result] = await pool.query(
        "INSERT INTO Posts (caption, image, userid) VALUES (?,?,?)",
        [caption, image || null, req.user.id]
      );
      res.status(201).json({ id: result.insertId, caption, image });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
