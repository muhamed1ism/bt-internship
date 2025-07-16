/*
  Warnings:

  - A unique constraint covering the columns `[action,subject,conditions,fields]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "permissions_action_subject_key";

-- CreateIndex
CREATE UNIQUE INDEX "permissions_action_subject_conditions_fields_key" ON "permissions"("action", "subject", "conditions", "fields");
