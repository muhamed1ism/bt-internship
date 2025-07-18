/*
  Warnings:

  - A unique constraint covering the columns `[action,subject,conditionHash,fieldsHash]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "permissions_action_subject_conditions_fields_key";

-- AlterTable
ALTER TABLE "permissions" ADD COLUMN     "conditionHash" TEXT,
ADD COLUMN     "fieldsHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "permissions_action_subject_conditionHash_fieldsHash_key" ON "permissions"("action", "subject", "conditionHash", "fieldsHash");
