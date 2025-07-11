import BucketCard from '../components/layout/bucketCard/BucketCard.tsx';
import { Input } from '../components/ui/input.tsx';
import { useGetCategories, useGetMyUserBuckets } from '@app/hooks/bucket/index.ts';
import { BucketCategory, UserBucketLevel } from '@app/types/bucket.ts';

function getMaxLevelForCategory(categories: BucketCategory[] | undefined, categoryId: string) {
  const category = categories && categories.find((cat) => cat.id === categoryId);
  if (!category) return 0;
  return category.bucketLevels.length;
}

export const Buckets = () => {
  const { userBuckets, isLoading } = useGetMyUserBuckets();
  const { categories } = useGetCategories();

  return (
    <div className="flex h-full w-full flex-col items-center bg-gray-100 px-24 pt-12">
      <Input className="bg-primary-foreground h-9 w-full" placeholder="Search Buckets..." />
      <div className="flex w-full justify-center">
        <div className="mx-2 grid w-full grid-cols-4 gap-x-8 gap-y-10 pt-14">
          {isLoading && <p>Loading...</p>}
          {userBuckets &&
            userBuckets.map((userBucket: UserBucketLevel) => {
              const maxLevel = getMaxLevelForCategory(categories, userBucket.bucket.categoryId);

              return (
                <BucketCard
                  key={userBucket.bucketLevelId}
                  id={userBucket.bucket.categoryId}
                  title={userBucket.bucket.category.name}
                  currentLevel={userBucket.bucket.level}
                  isActive={true}
                  maxLevel={maxLevel}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};
