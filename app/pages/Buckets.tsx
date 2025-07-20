import BucketCard from '../features/buckets/components/BucketCard.tsx';
import { Input } from '../components/ui/input.tsx';
import { useGetCategories, useGetMyUserBuckets } from '@app/hooks/bucket/index.ts';
import { BucketCategory, UserBucketLevel } from '@app/types/bucket.ts';
import { useState } from 'react';
import { LayoutGrid, List, Plus, Search } from 'lucide-react';
import { Button } from '@app/components/ui/button.tsx';
import { useFilteredBuckets } from '@app/features/buckets/hooks/useFilteredBuckets.ts';
import { useFilteredUserBuckets } from '@app/features/buckets/hooks/useFilteredUserBuckets.ts';
import { AddBucketDialog } from '@app/features/buckets/components/AddBucketDialog.tsx';
import { useAbility } from '@casl/react';
import { AbilityContext, Can } from '@app/casl/AbilityContext.ts';

function getMaxLevelForCategory(categories: BucketCategory[] | undefined, categoryId: string) {
  const category = categories && categories.find((cat) => cat.id === categoryId);
  if (!category) return 0;
  return category.bucketLevels.length;
}

export const Buckets = () => {
  const ability = useAbility(AbilityContext);

  const { userBuckets, isLoading } = useGetMyUserBuckets();
  const { categories } = useGetCategories();

  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddBucketOpen, setIsAddBucketOpen] = useState(false);

  const toggleButtonActive = 'text-secondary bg-primary';
  const toggleButtonInactive = 'text-primary bg-card hover:bg-primary/10';

  const handleOpenAddBucketModal = () => {
    setIsAddBucketOpen(true);
  };

  const handleCloseAddBucketModal = () => {
    setIsAddBucketOpen(false);
  };

  const handleSetGridMode = () => {
    setViewMode('grid');
  };

  const handleSetListMode = () => {
    setViewMode('list');
  };

  const { filteredUserBuckets } = useFilteredUserBuckets(userBuckets, searchQuery);
  const { filteredBuckets } = useFilteredBuckets(categories, userBuckets, searchQuery);

  return (
    <div className="flex h-full w-full flex-col items-center bg-gray-100 px-24 pt-12">
      {/* Header */}
      <div className="mb-8 w-full">
        <h1 className="text-foreground mb-2 text-3xl font-bold">Buckets</h1>
        <p className="text-muted-foreground">Manage and view all buckets in your organization</p>
      </div>

      <div className="mb-8 flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search Bar */}
        <div className="relative w-full flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search buckets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-card h-9 pl-10"
          />
        </div>

        {/* Create Bucket Button and View Mode Toggle */}
        <div className="ml-auto flex items-center justify-end gap-3">
          <div className="flex rounded-lg border-1">
            <Button
              size="icon"
              onClick={handleSetListMode}
              className={`rounded-r-none ${viewMode === 'list' ? toggleButtonActive : toggleButtonInactive}`}
            >
              <List className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              onClick={handleSetGridMode}
              className={`rounded-l-none ${viewMode === 'grid' ? toggleButtonActive : toggleButtonInactive}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>

          <Can I="create" a="BucketCategory" ability={ability}>
            <Button onClick={handleOpenAddBucketModal} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Bucket
            </Button>
          </Can>
        </div>
      </div>

      {/* User Buckets  */}
      <h1 className="w-full text-start text-2xl font-semibold">User Buckets</h1>
      <div className="mt-12 w-full">
        {isLoading && <p>Loading...</p>}

        {!filteredUserBuckets && (
          <h1 className="w-full text-center text-2xl text-red-600">Failed to load user buckets</h1>
        )}

        {filteredUserBuckets?.length === 0 && (
          <h1 className="text-muted w-full text-center text-2xl">No assigned user buckets</h1>
        )}

        <div
          className={` ${
            viewMode === 'grid'
              ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'flex flex-col gap-4'
          } `}
        >
          {filteredUserBuckets &&
            filteredUserBuckets.map((userBucket: UserBucketLevel) => {
              const maxLevel = getMaxLevelForCategory(categories, userBucket.bucket.categoryId);
              const category = categories?.find((cat) => cat.id === userBucket.bucket.categoryId);

              return (
                <BucketCard
                  key={userBucket.bucketLevelId}
                  id={userBucket.bucket.categoryId}
                  title={userBucket.bucket.category.name}
                  currentLevel={userBucket.bucket.level}
                  isActive={true}
                  maxLevel={maxLevel}
                  allLevels={category?.bucketLevels}
                  viewMode={viewMode}
                />
              );
            })}
        </div>
      </div>

      {/* All Buckets */}
      <h1 className="mt-8 w-full text-start text-2xl font-semibold">All Buckets</h1>
      <div className="my-12 w-full">
        {isLoading && <p>Loading...</p>}

        {!filteredBuckets && (
          <h1 className="w-full text-center text-2xl text-red-600">Failed to load user buckets</h1>
        )}

        {filteredBuckets?.length === 0 && (
          <h1 className="text-muted w-full text-center text-2xl">No assigned user buckets</h1>
        )}

        <div
          className={` ${
            viewMode === 'grid'
              ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'flex flex-col gap-4'
          } `}
        >
          {filteredBuckets &&
            filteredBuckets.map((bucket: BucketCategory) => {
              const maxLevel = getMaxLevelForCategory(categories, bucket.id);

              return (
                <BucketCard
                  key={bucket.id}
                  id={bucket.id}
                  title={bucket.name}
                  isActive={false}
                  maxLevel={maxLevel}
                  viewMode={viewMode}
                />
              );
            })}
        </div>
      </div>

      <AddBucketDialog isOpen={isAddBucketOpen} onClose={handleCloseAddBucketModal} />
    </div>
  );
};
