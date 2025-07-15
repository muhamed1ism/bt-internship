import { BucketCategory, UserBucketLevel } from '@app/types/bucket';
import { useMemo } from 'react';

export const useFilteredBuckets = (
  buckets: BucketCategory[] | undefined,
  userBuckets: UserBucketLevel[] | undefined,
  searchQuery: string,
) => {
  const filteredBuckets = useMemo(() => {
    if (!buckets) return [];

    const usedCategoryIds = new Set((userBuckets ?? []).map((ubl) => ubl.bucket.categoryId));

    const query = searchQuery.trim().toLowerCase();

    return buckets.filter((bucket) => {
      const matchesSearch =
        !query ||
        bucket.name.toLowerCase().includes(query) ||
        (bucket.description && bucket.description.toLowerCase().includes(query));
      const isUsed = usedCategoryIds.has(bucket.id);

      return matchesSearch && !isUsed;
    });
  }, [buckets, userBuckets, searchQuery]);

  return { filteredBuckets };
};
