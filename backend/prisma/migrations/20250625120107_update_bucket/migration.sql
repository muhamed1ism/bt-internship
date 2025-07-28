/*
  Warnings:

  - You are about to drop the `Bucket` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bucket" DROP CONSTRAINT "Bucket_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "UserBucket" DROP CONSTRAINT "UserBucket_bucketId_fkey";

-- DropTable
DROP TABLE "Bucket";

-- CreateTable
CREATE TABLE "BucketLevel" (
    "id" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "expectations" TEXT[],
    "skills" TEXT[],
    "tools" TEXT[],
    "knowledge" TEXT[],
    "toAdvance" TEXT[],
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "BucketLevel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BucketLevel_level_categoryId_key" ON "BucketLevel"("level", "categoryId");

-- AddForeignKey
ALTER TABLE "BucketLevel" ADD CONSTRAINT "BucketLevel_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BucketCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBucket" ADD CONSTRAINT "UserBucket_bucketId_fkey" FOREIGN KEY ("bucketId") REFERENCES "BucketLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
