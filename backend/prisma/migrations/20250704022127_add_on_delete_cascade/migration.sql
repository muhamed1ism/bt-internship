-- DropForeignKey
ALTER TABLE "bucket_levels" DROP CONSTRAINT "bucket_levels_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "team_members" DROP CONSTRAINT "team_members_teamId_fkey";

-- DropForeignKey
ALTER TABLE "user_buckets" DROP CONSTRAINT "user_buckets_bucketLevelId_fkey";

-- AddForeignKey
ALTER TABLE "bucket_levels" ADD CONSTRAINT "bucket_levels_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "bucket_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_buckets" ADD CONSTRAINT "user_buckets_bucketLevelId_fkey" FOREIGN KEY ("bucketLevelId") REFERENCES "bucket_levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
