import { UserBucketLevel } from '@app/types/bucket';
import { useMemo } from 'react';

export function useFilteredUserBuckets(
  buckets: UserBucketLevel[] | undefined,
  searchQuery: string,
) {
  const filteredUserBuckets = useMemo(() => {
    if (!searchQuery.trim()) return buckets;

    if (!buckets) return [];

    return buckets.filter((userBucket) => {
      const query = searchQuery.toLowerCase();

      return (
        userBucket.bucket.category.name.toLowerCase().includes(query) ||
        (userBucket.bucket.category.description &&
          userBucket.bucket.category.description.toLowerCase().includes(query))
      );
    });
  }, [buckets, searchQuery]);

  return { filteredUserBuckets };
}
