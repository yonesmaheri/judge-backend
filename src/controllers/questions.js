const path = require("path");
const fs = require("fs");
const { execFile } = require("child_process");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getQuestions(req, res) {
  try {
    const questions = await prisma.question.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        difficulty: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

async function getQuestionById(req, res) {
  const { id } = req.params;
  try {
    const question = await prisma.question.findUnique({
      where: { id: parseInt(id) },
    });
    if (!question)
      return res.status(404).json({ message: "Question not found" });
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

async function createQuestion(req, res) {
  const { title, description, difficulty, testCases } = req.body;
  try {
    const question = await prisma.question.create({
      data: {
        title,
        description,
        difficulty,
        testCases: {
          create: testCases,
        },
      },
    });
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteQuestion(req, res) {
  try {
    const { id } = req.params;
    console.log(id);

    await prisma.question.delete({
      where: { id: Number(id) },
    });

    res.json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete question" });
  }
}

async function updateQuestion(req, res) {
  try {
    const { id } = req.params;
    const { title, description, input, output } = req.body;

    const updatedQuestion = await prisma.question.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        input,
        output,
      },
    });

    res.json({
      success: true,
      message: "Question updated successfully",
      data: updatedQuestion,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update question" });
  }
}

function executePythonFile(filePath, input) {
  return new Promise((resolve, reject) => {
    const process = execFile(
      "python3",
      [filePath],
      { timeout: 5000 },
      (err, stdout, stderr) => {
        if (err) return resolve(stderr || err.message);
        resolve(stdout);
      }
    );

    if (input) {
      process.stdin.write(input);
    }
    process.stdin.end();
  });
}

async function submission(req, res) {
  try {
    const { id } = req.params;
    const file = req.file;
    if (!file) return res.status(400).json({ message: "فایل دریافت نشد" });

    const questionIdNum = Number(id);
    if (isNaN(questionIdNum))
      return res.status(400).json({ message: "questionId معتبر نیست" });

    const filePath = path.join("/app/uploads", path.basename(file.path));

    if (!fs.existsSync(filePath)) {
      console.error("File not found at path:", filePath);
      return res.status(500).json({ message: "فایل آپلود نشد یا پیدا نشد" });
    }

    let submission;
    try {
      submission = await prisma.submission.create({
        data: {
          userId: req.user.id,
          questionId: questionIdNum,
          filePath,
          fileName: file.originalname,
          status: "PENDING",
        },
      });
    } catch (err) {
      console.error("Prisma create error:", err);
      return res.status(500).json({ message: "خطای دیتابیس" });
    }

    res.status(201).json({ submission });

    (async () => {
      try {
        const subWithTests = await prisma.submission.findUnique({
          where: { id: submission.id },
          include: { question: { include: { testCases: true } } },
        });

        if (!subWithTests?.question?.testCases?.length) return;

        const results = [];
        let passCount = 0;

        for (const testCase of subWithTests.question.testCases) {
          const execResult = await executePythonFile(filePath, testCase.input);
          const passed = execResult.trim() === testCase.expected.trim();
          if (passed) passCount++;
          results.push({
            input: testCase.input,
            expected: testCase.expected,
            output: execResult,
            passed,
          });
        }

        const successRate = Math.round(
          (passCount / subWithTests.question.testCases.length) * 100
        );

        await prisma.submission.update({
          where: { id: submission.id },
          data: {
            results,
            successRate,
            status: successRate === 100 ? "SUCCESS" : "FAILED",
          },
        });
      } catch (err) {
        console.error("Error running submission:", err);
      }
    })();
  } catch (err) {
    console.error("Submission handler error:", err);
    res.status(500).json({ message: "خطای سرور" });
  }
}

async function getSubmissions(req, res) {
  try {
    const questionIdNum = Number(req.params.id);
    if (isNaN(questionIdNum)) {
      return res.status(400).json({ message: "questionId معتبر نیست" });
    }

    const submissions = await prisma.submission.findMany({
      where: {
        userId: req.user.id,
        questionId: questionIdNum,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(submissions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطای سرور" });
  }
}

module.exports = {
  getQuestions,
  getQuestionById,
  createQuestion,
  submission,
  getSubmissions,
  updateQuestion,
  deleteQuestion,
};
