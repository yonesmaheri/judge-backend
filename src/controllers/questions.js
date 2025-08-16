const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { execFile } = require("child_process");

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
  const { title, description, difficulty } = req.body;
  try {
    const question = await prisma.question.create({
      data: { title, description, difficulty },
    });
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
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

// نسخه داخلی run که بدون درخواست جداگانه اجرا میشه
// async function runSubmissionInternal(submission) {
//   const submissionWithTests = await prisma.submission.findUnique({
//     where: { id: submission.id },
//     include: { question: { include: { testCases: true } } },
//   });

//   const results = [];
//   let passCount = 0;

//   for (const testCase of submissionWithTests.question.testCases) {
//     const execResult = await executePythonFile(
//       submissionWithTests.filePath,
//       testCase.input
//     );
//     const passed = execResult.trim() === testCase.expected.trim();
//     if (passed) passCount++;
//     results.push({
//       input: testCase.input,
//       expected: testCase.expected,
//       output: execResult,
//       passed,
//     });
//   }

//   const successRate = Math.round(
//     (passCount / submissionWithTests.question.testCases.length) * 100
//   );

//   return prisma.submission.update({
//     where: { id: submission.id },
//     data: {
//       results,
//       successRate,
//       status: successRate === 100 ? "SUCCESS" : "FAILED",
//     },
//   });
// }

async function submission(req, res) {
  try {
    const { id } = req.params;
    const file = req.file;
    if (!file) return res.status(400).json({ message: "فایل دریافت نشد" });
    const questionIdNum = Number(id);

    if (isNaN(questionIdNum)) {
      return res.status(400).json({ message: "questionId معتبر نیست" });
    }

    // 1. ایجاد سابمیشن با وضعیت PENDING
    const submission = await prisma.submission.create({
      data: {
        userId: req.user.id,
        questionId: questionIdNum,
        filePath: file.path,
        status: "PENDING",
      },
    });

    res.status(201).json({ submission });

    // 2. بعد از ارسال پاسخ به کاربر، شروع خودکار تست‌ها
    (async () => {
      try {
        const subWithTests = await prisma.submission.findUnique({
          where: { id: submission.id },
          include: { question: { include: { testCases: true } } },
        });

        const results = [];
        let passCount = 0;

        for (const testCase of subWithTests.question.testCases) {
          const execResult = await executePythonFile(subWithTests.filePath, testCase.input);
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
    console.error(err);
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
};
