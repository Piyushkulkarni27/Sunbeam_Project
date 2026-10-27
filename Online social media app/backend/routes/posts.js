import { Router } from "express";
import { body, validationResult } from "express-validator";
import { query } from "../db";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

// GET /api/posts
router.get("/", authMiddleware, async (req, res) => {
  try {
    const [rows] = await query(
      `SELECT Posts.id,
              Posts.caption,
              Posts.image,
              Posts.createdAt,
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

// POST /api/posts
router.post(
  "/",
  authMiddleware,
  [body("caption").isLength({ min: 1 }).withMessage("Caption required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { caption, image } = req.body;

    try {
      const [result] = await query(
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

export default router;
