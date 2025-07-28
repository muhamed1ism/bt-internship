/*
  Warnings:

  - You are about to drop the `BucketCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BucketLevel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserBucket` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RolePermissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BucketLevel" DROP CONSTRAINT "BucketLevel_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "UserBucket" DROP CONSTRAINT "UserBucket_bucketId_fkey";

-- DropForeignKey
ALTER TABLE "UserBucket" DROP CONSTRAINT "UserBucket_userId_fkey";

-- DropForeignKey
ALTER TABLE "_RolePermissions" DROP CONSTRAINT "_RolePermissions_A_fkey";

-- DropForeignKey
ALTER TABLE "_RolePermissions" DROP CONSTRAINT "_RolePermissions_B_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_roleId_fkey";

-- DropTable
DROP TABLE "BucketCategory";

-- DropTable
DROP TABLE "BucketLevel";

-- DropTable
DROP TABLE "UserBucket";

-- DropTable
DROP TABLE "_RolePermissions";

-- DropTable
DROP TABLE "permissions";

-- DropTable
DROP TABLE "roles";

-- DropTable
DROP TABLE "users";

-- DropEnum
DROP TYPE "UserStatus";
