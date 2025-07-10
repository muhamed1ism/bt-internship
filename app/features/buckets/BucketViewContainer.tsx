import { useBucketView } from '@app/features/buckets/hooks/useBucketView';
import { BucketHeader, LevelSidebar, LevelDetails, LevelForm, BucketCreation } from './components';
import { useGetUserCategoryLevel } from '@app/hooks/bucket';

/**
 * BucketViewContainer is the main container component that manages
 * the bucket view functionality. It delegates rendering to appropriate
 * sub-components based on the current state.
 */
export const BucketViewContainer = () => {
  const {
    // Data
    bucket,
    hasLevels,
    currentLevel,

    // State
    selectedLevel,
    isEditingLevel,
    isCreatingLevel,
    bucketTitle,
    editingLevel,

    // Actions
    navigateBack,
    handleLevelSelect,
    handleEditLevel,
    handleCreateLevel,
    handleCancelEdit,
    updateBucketTitle,
    addListItem,
    updateListItem,
    removeListItem,
    handleSaveBucket,
  } = useBucketView();

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
    return (
      <div className="min-h-screen bg-gray-100">
        <BucketHeader
          title={bucket.name}
          description={bucket.description}
          totalLevels={bucket.bucketLevels.length}
          onNavigateBack={navigateBack}
        />
        <div className="container mx-auto px-6 py-8">
          <BucketCreation
            bucketTitle={bucketTitle}
            onUpdateTitle={updateBucketTitle}
            onCreateLevel={handleCreateLevel}
            onSaveBucket={handleSaveBucket}
          />
        </div>
      </div>
    );
  }

  // Render editing/creating form view
  if (isEditingLevel || isCreatingLevel) {
    return (
      <div className="min-h-screen bg-gray-100">
        <BucketHeader
          title={bucket.name}
          description={bucket.description}
          totalLevels={bucket.bucketLevels.length}
          onNavigateBack={navigateBack}
          breadcrumb="Buckets"
        />
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            <LevelSidebar
              name={bucket.name}
              currentLevel={currentLevel}
              levels={bucket.bucketLevels}
              selectedLevel={selectedLevel}
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
    <div className="min-h-screen bg-gray-100">
      <BucketHeader
        title={bucket.name}
        description={bucket.description}
        totalLevels={bucket.bucketLevels.length}
        onNavigateBack={navigateBack}
      />
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <LevelSidebar
            name={bucket.name}
            levels={bucket.bucketLevels}
            currentLevel={currentLevel}
            selectedLevel={selectedLevel}
            onLevelSelect={handleLevelSelect}
            onCreateLevel={handleCreateLevel}
          />
          {selectedLevel && (
            <LevelDetails
              name={bucket.name}
              currentLevel={currentLevel}
              level={selectedLevel}
              onEditLevel={handleEditLevel}
            />
          )}
        </div>
      </div>
    </div>
  );
};
