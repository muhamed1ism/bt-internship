/*
  Warnings:

  - You are about to drop the `_RolePermissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TeamTechnologies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bucket_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bucket_levels` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reports` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `team_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `technologies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_buckets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_RolePermissions" DROP CONSTRAINT "_RolePermissions_A_fkey";

-- DropForeignKey
ALTER TABLE "_RolePermissions" DROP CONSTRAINT "_RolePermissions_B_fkey";

-- DropForeignKey
ALTER TABLE "_TeamTechnologies" DROP CONSTRAINT "_TeamTechnologies_A_fkey";

-- DropForeignKey
ALTER TABLE "_TeamTechnologies" DROP CONSTRAINT "_TeamTechnologies_B_fkey";

-- DropForeignKey
ALTER TABLE "bucket_levels" DROP CONSTRAINT "bucket_levels_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_authorId_fkey";

-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_userId_fkey";

-- DropForeignKey
ALTER TABLE "team_members" DROP CONSTRAINT "team_members_teamId_fkey";

-- DropForeignKey
ALTER TABLE "team_members" DROP CONSTRAINT "team_members_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_buckets" DROP CONSTRAINT "user_buckets_bucketLevelId_fkey";

-- DropForeignKey
ALTER TABLE "user_buckets" DROP CONSTRAINT "user_buckets_userId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_roleId_fkey";

-- DropTable
DROP TABLE "_RolePermissions";

-- DropTable
DROP TABLE "_TeamTechnologies";

-- DropTable
DROP TABLE "bucket_categories";

-- DropTable
DROP TABLE "bucket_levels";

-- DropTable
DROP TABLE "permissions";

-- DropTable
DROP TABLE "reports";

-- DropTable
DROP TABLE "roles";

-- DropTable
DROP TABLE "team_members";

-- DropTable
DROP TABLE "teams";

-- DropTable
DROP TABLE "technologies";

-- DropTable
DROP TABLE "user_buckets";

-- DropTable
DROP TABLE "users";

-- DropEnum
DROP TYPE "TeamStatus";

-- DropEnum
DROP TYPE "UserStatus";
