-- CreateTable
CREATE TABLE "BucketCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "BucketCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bucket" (
    "id" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "expectations" TEXT[],
    "skills" TEXT[],
    "tools" TEXT[],
    "knowledge" TEXT[],
    "toAdvance" TEXT[],
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Bucket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBucket" (
    "userId" TEXT NOT NULL,
    "bucketId" TEXT NOT NULL,

    CONSTRAINT "UserBucket_pkey" PRIMARY KEY ("userId","bucketId")
);

-- CreateIndex
CREATE UNIQUE INDEX "BucketCategory_name_key" ON "BucketCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Bucket_level_categoryId_key" ON "Bucket"("level", "categoryId");

-- AddForeignKey
ALTER TABLE "Bucket" ADD CONSTRAINT "Bucket_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BucketCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBucket" ADD CONSTRAINT "UserBucket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBucket" ADD CONSTRAINT "UserBucket_bucketId_fkey" FOREIGN KEY ("bucketId") REFERENCES "Bucket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
