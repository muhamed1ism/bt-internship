import { useBucketView } from '@app/features/buckets/hooks';
import { BucketHeader } from './BucketHeader';
import { BucketCreation } from './BucketCreation';
import { LevelSidebar } from './LevelSidebar';
import { LevelForm } from './LevelForm';
import { LevelDetails } from './LevelDetails';
import { UpdateBucketDialog } from './dialog/UpdateBucketDialog';
import { useState } from 'react';
import { useAbility } from '@casl/react';
import { AbilityContext } from '@app/casl/AbilityContext';
import { Navigate } from 'react-router-dom';
import routeNames from '@app/routes/route-names';

/**
 * BucketViewContainer is the main container component that manages
 * the bucket view functionality. It delegates rendering to appropriate
 * sub-components based on the current state.
 */
export const BucketViewContainer = () => {
  const ability = useAbility(AbilityContext);

  const {
    // Data
    bucket,
    hasLevels,
    currentLevel,
    maxLevel,

    // State
    selectedLevel,
    isEditingLevel,
    isCreatingLevel,
    editingLevel,

    // Actions
    navigateBack,
    handleLevelSelect,
    handleEditLevel,
    handleCreateLevel,
    handleCancelEdit,
    addListItem,
    updateListItem,
    removeListItem,
  } = useBucketView();

  const [isUpdateBucketOpen, setIsUpdateBucketOpen] = useState(false);

  const handleOpenUpdateBucket = () => {
    setIsUpdateBucketOpen(true);
  };

  const handleCloseUpdateBucket = () => {
    setIsUpdateBucketOpen(false);
  };

  // Loading or error states could be handled here
  if (!bucket) {
    return (
      <div className="bg-background min-h-screen">
        <BucketHeader onNavigateBack={navigateBack} title="Bucket Not Found" />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h2 className="text-foreground mb-2 text-2xl font-bold">Bucket Not Found</h2>
            <p className="text-muted-foreground">The requested bucket could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  // Render bucket creation view when no levels exist
  if (!hasLevels) {
    if (ability.cannot('create', 'BucketLevel')) {
      return <Navigate to={routeNames.notAuthorized()} />;
    }

    return (
      <div className="h-full bg-gray-100">
        <BucketHeader
          title={bucket.name}
          description={bucket.description}
          totalLevels={bucket.bucketLevels.length}
          onNavigateBack={navigateBack}
          onOpenUpdateBucket={handleOpenUpdateBucket}
          isEditingLevel={isEditingLevel}
          isCreatingLevel={isCreatingLevel}
        />

        <div className="container mx-auto px-6 py-8">
          {isCreatingLevel ? (
            <LevelForm
              bucketId={bucket.id}
              levelId={selectedLevel?.id}
              editingLevel={editingLevel}
              isCreating={isCreatingLevel}
              onCancel={handleCancelEdit}
              onAddListItem={addListItem}
              onUpdateListItem={updateListItem}
              onRemoveListItem={removeListItem}
            />
          ) : (
            <BucketCreation onCreateLevel={handleCreateLevel} />
          )}
        </div>

        <UpdateBucketDialog
          bucket={bucket}
          isOpen={isUpdateBucketOpen}
          onClose={handleCloseUpdateBucket}
        />
      </div>
    );
  }

  // Render editing/creating form view
  if (isEditingLevel || isCreatingLevel) {
    if (ability.cannot('create', 'BucketLevel') || ability.cannot('update', 'BucketLevel')) {
      return <Navigate to={routeNames.notAuthorized()} />;
    }

    return (
      <div className="h-full bg-gray-100">
        <BucketHeader
          title={bucket.name}
          description={bucket.description}
          totalLevels={bucket.bucketLevels.length}
          onNavigateBack={navigateBack}
          breadcrumb="Buckets"
          isEditingLevel={isEditingLevel}
          isCreatingLevel={isCreatingLevel}
        />

        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            <LevelSidebar
              name={bucket.name}
              currentLevel={currentLevel}
              levels={bucket.bucketLevels}
              selectedLevel={selectedLevel}
              maxLevel={maxLevel}
              onLevelSelect={handleLevelSelect}
              onCreateLevel={handleCreateLevel}
              showCreateButton={!isCreatingLevel}
            />
            <LevelForm
              bucketId={bucket.id}
              levelId={selectedLevel?.id}
              editingLevel={editingLevel}
              isCreating={isCreatingLevel}
              onCancel={handleCancelEdit}
              onAddListItem={addListItem}
              onUpdateListItem={updateListItem}
              onRemoveListItem={removeListItem}
            />
          </div>
        </div>
      </div>
    );
  }

  // Render main bucket view with levels
  return (
    <div className="h-full bg-gray-100">
      <BucketHeader
        title={bucket.name}
        description={bucket.description}
        totalLevels={bucket.bucketLevels.length}
        onNavigateBack={navigateBack}
        onOpenUpdateBucket={handleOpenUpdateBucket}
      />
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <LevelSidebar
            name={bucket.name}
            levels={bucket.bucketLevels}
            currentLevel={currentLevel}
            selectedLevel={selectedLevel}
            maxLevel={maxLevel}
            onLevelSelect={handleLevelSelect}
            onCreateLevel={handleCreateLevel}
          />
          {selectedLevel && (
            <LevelDetails
              name={bucket.name}
              currentLevel={currentLevel}
              level={selectedLevel}
              allLevels={bucket.bucketLevels}
              maxLevel={maxLevel}
              onEditLevel={handleEditLevel}
              onLevelSelect={handleLevelSelect}
            />
          )}
        </div>
      </div>

      <UpdateBucketDialog
        bucket={bucket}
        isOpen={isUpdateBucketOpen}
        onClose={handleCloseUpdateBucket}
      />
    </div>
  );
};
