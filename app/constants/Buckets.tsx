import BucketCard from '../components/layout/bucketCard/BucketCard.tsx';
import { Input } from '../components/ui/input.tsx';
import { mockBuckets } from '@app/constants/constants';

export const Buckets = () => {
  return (
    <div className="flex h-screen w-full flex-col flex-wrap items-center justify-start bg-gray-100 px-10 pt-10">
      <Input className="h-[4%] w-full" placeholder="Search Buckets..." />
      <div className="flex w-full flex-wrap justify-between gap-y-10 px-10 pt-20">
        {mockBuckets.map((bucket) => (
          <BucketCard
            key={bucket.id}
            id={bucket.id}
            title={bucket.title}
            currentLevel={bucket.currentLevel}
            isActive={bucket.isActive}
          />
        ))}
      </div>
    </div>
  );
};
