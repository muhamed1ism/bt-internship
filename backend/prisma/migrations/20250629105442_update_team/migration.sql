/*
  Warnings:

  - The `status` column on the `Team` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TeamStatus" AS ENUM ('PENDING_APPROVAL', 'PLANNING', 'DESIGN', 'NOT_STARTED', 'IN_PROGRESS', 'IN_REVIEW', 'IN_TESTING', 'ON_HOLD', 'REWORK_NEEDED', 'READY_TO_RELEASE', 'DEPLOYED_TO_STAGING', 'RELEASED', 'MONITORING', 'COMPLETED', 'CANCELED');

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "status",
ADD COLUMN     "status" "TeamStatus" NOT NULL DEFAULT 'IN_PROGRESS';
