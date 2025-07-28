/*
  Warnings:

  - You are about to drop the column `sender` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `assignedBy` on the `tickets` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "messages" DROP COLUMN "sender",
DROP COLUMN "timestamp";

-- AlterTable
ALTER TABLE "tickets" DROP COLUMN "assignedBy",
ADD COLUMN     "authorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
