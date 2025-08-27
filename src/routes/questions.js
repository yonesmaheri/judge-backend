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

const router = express.Router();

router.get("/", getQuestions);
router.get("/:id", getQuestionById);
router.post("/", authMiddleware, createQuestion);
router.get("/:id/submissions", authMiddleware, getSubmissions);
router.post(
  "/:id/submissions",
  authMiddleware,
  upload.single("file"),
  submission
);
router.put("/:id", authMiddleware, updateQuestion);
router.delete("/:id", authMiddleware, deleteQuestion);

module.exports = router;
