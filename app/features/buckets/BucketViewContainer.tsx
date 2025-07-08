import { useBucketView } from '@app/hooks/useBucketView';
import { BucketHeader, LevelSidebar, LevelDetails, LevelForm, BucketCreation } from './components';

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
    isLoading,
    error,

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
    updateEditingField,
    addListItem,
    updateListItem,
    removeListItem,
    handleSaveLevel,
    handleSaveBucket,
  } = useBucketView();

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-background min-h-screen">
        <BucketHeader onNavigateBack={navigateBack} title="Loading..." />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-foreground mb-2 text-2xl font-bold">Loading Bucket</h2>
            <p className="text-muted-foreground">Please wait while we fetch the bucket details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-background min-h-screen">
        <BucketHeader onNavigateBack={navigateBack} title="Error" />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h2 className="text-foreground mb-2 text-2xl font-bold">Failed to Load Bucket</h2>
            <p className="text-muted-foreground">There was an error loading the bucket details. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  // Bucket not found
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
      <div className="bg-background min-h-screen">
        <BucketHeader bucket={bucket} onNavigateBack={navigateBack} showBucketInfo={false} />
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
      <div className="bg-background min-h-screen">
        <BucketHeader bucket={bucket} onNavigateBack={navigateBack} breadcrumb="Buckets" />
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            <LevelSidebar
              levels={bucket.levels}
              selectedLevel={selectedLevel}
              onLevelSelect={handleLevelSelect}
              onCreateLevel={handleCreateLevel}
              showCreateButton={!isCreatingLevel}
            />
            <LevelForm
              editingLevel={editingLevel}
              isCreating={isCreatingLevel}
              onCancel={handleCancelEdit}
              onSave={handleSaveLevel}
              onUpdateField={updateEditingField}
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
    <div className="bg-background min-h-screen">
      <BucketHeader bucket={bucket} onNavigateBack={navigateBack} showBucketInfo={true} />
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <LevelSidebar
            levels={bucket.levels}
            selectedLevel={selectedLevel}
            onLevelSelect={handleLevelSelect}
            onCreateLevel={handleCreateLevel}
          />
          {selectedLevel && <LevelDetails level={selectedLevel} onEditLevel={handleEditLevel} />}
        </div>
      </div>
    </div>
  );
};
