/*
  Warnings:

  - You are about to drop the `BucketCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BucketLevel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Report` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Technology` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserBucket` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BucketLevel" DROP CONSTRAINT "BucketLevel_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_userId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserBucket" DROP CONSTRAINT "UserBucket_bucketId_fkey";

-- DropForeignKey
ALTER TABLE "UserBucket" DROP CONSTRAINT "UserBucket_userId_fkey";

-- DropForeignKey
ALTER TABLE "_TeamTechnologies" DROP CONSTRAINT "_TeamTechnologies_A_fkey";

-- DropForeignKey
ALTER TABLE "_TeamTechnologies" DROP CONSTRAINT "_TeamTechnologies_B_fkey";

-- DropTable
DROP TABLE "BucketCategory";

-- DropTable
DROP TABLE "BucketLevel";

-- DropTable
DROP TABLE "Report";

-- DropTable
DROP TABLE "Team";

-- DropTable
DROP TABLE "TeamMember";

-- DropTable
DROP TABLE "Technology";

-- DropTable
DROP TABLE "UserBucket";

-- CreateTable
CREATE TABLE "bucket_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "bucket_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bucket_levels" (
    "id" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "expectations" TEXT[],
    "skills" TEXT[],
    "tools" TEXT[],
    "knowledge" TEXT[],
    "toAdvance" TEXT[],
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "bucket_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_buckets" (
    "userId" TEXT NOT NULL,
    "bucketId" TEXT NOT NULL,

    CONSTRAINT "user_buckets_pkey" PRIMARY KEY ("userId","bucketId")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "status" "TeamStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "projectDescription" TEXT NOT NULL,
    "documentation" TEXT NOT NULL,
    "githubLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technologies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "technologies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bucket_categories_name_key" ON "bucket_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "bucket_levels_level_categoryId_key" ON "bucket_levels"("level", "categoryId");

-- CreateIndex
CREATE INDEX "reports_userId_idx" ON "reports"("userId");

-- CreateIndex
CREATE INDEX "reports_authorId_idx" ON "reports"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "technologies_name_key" ON "technologies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "team_members_userId_teamId_key" ON "team_members"("userId", "teamId");

-- AddForeignKey
ALTER TABLE "bucket_levels" ADD CONSTRAINT "bucket_levels_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "bucket_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_buckets" ADD CONSTRAINT "user_buckets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_buckets" ADD CONSTRAINT "user_buckets_bucketId_fkey" FOREIGN KEY ("bucketId") REFERENCES "bucket_levels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamTechnologies" ADD CONSTRAINT "_TeamTechnologies_A_fkey" FOREIGN KEY ("A") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamTechnologies" ADD CONSTRAINT "_TeamTechnologies_B_fkey" FOREIGN KEY ("B") REFERENCES "technologies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
