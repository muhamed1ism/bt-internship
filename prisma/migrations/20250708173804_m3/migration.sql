/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `tickets` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tickets_title_key" ON "tickets"("title");
