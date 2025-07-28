/*
  Warnings:

  - The primary key for the `user_buckets` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bucketId` on the `user_buckets` table. All the data in the column will be lost.
  - Added the required column `bucketLevelId` to the `user_buckets` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_buckets" DROP CONSTRAINT "user_buckets_bucketId_fkey";

-- AlterTable
ALTER TABLE "user_buckets" DROP CONSTRAINT "user_buckets_pkey",
DROP COLUMN "bucketId",
ADD COLUMN     "bucketLevelId" TEXT NOT NULL,
ADD CONSTRAINT "user_buckets_pkey" PRIMARY KEY ("userId", "bucketLevelId");

-- AddForeignKey
ALTER TABLE "user_buckets" ADD CONSTRAINT "user_buckets_bucketLevelId_fkey" FOREIGN KEY ("bucketLevelId") REFERENCES "bucket_levels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
