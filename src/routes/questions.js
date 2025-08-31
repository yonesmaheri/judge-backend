const express = require("express");
const { authMiddleware } = require("../middlewares/auth");
const {
  submission,
  getQuestions,
  getQuestionById,
  createQuestion,
  getSubmissions,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/questions");
const { upload } = require("../middlewares/upload");
const requireAdmin = require("../middlewares/requireAdmin");

const router = express.Router();

router.get("/", getQuestions);
router.get("/:id", getQuestionById);
router.get("/:id/submissions", authMiddleware, getSubmissions);
router.post(
  "/:id/submissions",
  authMiddleware,
  upload.single("file"),
  submission
);
router.post("/", requireAdmin, createQuestion);
router.put("/:id", requireAdmin, updateQuestion);
router.delete("/:id", requireAdmin, deleteQuestion);

module.exports = router;
