const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // پاک کردن داده‌های قبلی (اختیاری)
  await prisma.testCase.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.question.deleteMany();

  // نمونه سوالات
  const questions = [
    {
      title: "جمع دو عدد",
      description:
        "یک تابع بنویسید که دو عدد را دریافت کرده و جمعشان را برگرداند.",
      difficulty: "EASY",
      testCases: [
        { input: "1 2", expected: "3" },
        { input: "5 7", expected: "12" },
      ],
    },
    {
      title: "مقدار بزرگتر",
      description:
        "یک تابع بنویسید که دو عدد را گرفته و بزرگترینشان را برگرداند.",
      difficulty: "MEDIUM",
      testCases: [
        { input: "3 9", expected: "9" },
        { input: "10 2", expected: "10" },
      ],
    },
    {
      title: "چک کردن عدد اول",
      description: "یک تابع بنویسید که بررسی کند آیا یک عدد اول است یا خیر.",
      difficulty: "HARD",
      testCases: [
        { input: "7", expected: "true" },
        { input: "8", expected: "false" },
      ],
    },
  ];

  for (const q of questions) {
    const question = await prisma.question.create({
      data: {
        title: q.title,
        description: q.description,
        difficulty: q.difficulty,
        testCases: {
          create: q.testCases,
        },
      },
    });
    console.log(`Question created: ${question.title}`);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
