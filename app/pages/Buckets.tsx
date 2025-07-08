import BucketCard from '../components/layout/bucketCard/BucketCard.tsx';
import { Input } from "../components/ui/input.tsx";
import { useGetMyUserBuckets } from '@app/hooks/bucket';
import { Spinner } from '@app/components/ui/spinner';

export const Buckets = () => {
  const { buckets, isLoading, error } = useGetMyUserBuckets();

  if (isLoading) {
    return (
      <div className="flex w-full h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="large" />
          <p className="text-muted-foreground">Loading your buckets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-full h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <p className="text-destructive">Failed to load buckets</p>
          <p className="text-muted-foreground text-sm">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen flex-col flex-wrap items-center justify-start bg-gray-100 px-10 pt-10">
      <Input className="w-full h-[4%]" placeholder="Search Buckets..."/>
      <div className="flex w-full flex-wrap justify-between gap-y-10 px-10 pt-20">
        {buckets?.map((bucket) => (
          <BucketCard
            key={bucket.id}
            id={bucket.id}
            title={bucket.title}
            currentLevel={bucket.currentLevel}
            maxLevel={bucket.maxLevel}
            isActive={bucket.isActive}
          />
        ))}
      </div>
    </div>
  );
};
