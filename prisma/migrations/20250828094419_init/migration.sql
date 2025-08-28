-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "profilePic" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';
