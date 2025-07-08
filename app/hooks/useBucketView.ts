import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Level, Bucket, BucketViewState, EditableField } from '@app/types/bucket';
import { DEFAULT_EDITING_LEVEL } from '@app/constants/bucket';
import { useGetBucketDetails } from '@app/hooks/bucket';
import { useGetMyUserBuckets } from '@app/hooks/bucket';

export const useBucketView = () => {
  const navigate = useNavigate();
  const { bucketId } = useParams();

  // Get user's current buckets to find the user's level for this category
  const { buckets: userBuckets } = useGetMyUserBuckets();
  
  // Find the user's current level for this bucket category
  const userBucket = userBuckets?.find(bucket => bucket.id === bucketId);
  const userCurrentLevel = userBucket?.currentLevel || 1;

  // Get real bucket data from API
  const { bucket, isLoading, error } = useGetBucketDetails(bucketId || '', userCurrentLevel);
  const hasLevels = bucket && bucket.levels.length > 0;

  // State management
  const [state, setState] = useState<BucketViewState>({
    selectedLevel: hasLevels ? bucket.levels[0] : null,
    isEditingLevel: false,
    isCreatingLevel: false,
    bucketTitle: bucket?.title || '',
    editingLevel: DEFAULT_EDITING_LEVEL,
  });

  // Navigation actions
  const navigateBack = () => navigate('/buckets');

  // Level selection
  const handleLevelSelect = (level: Level) => {
    setState((prev) => ({
      ...prev,
      selectedLevel: level,
      isEditingLevel: false,
      isCreatingLevel: false,
    }));
  };

  // Level editing
  const handleEditLevel = (level: Level) => {
    setState((prev) => ({
      ...prev,
      editingLevel: {
        ...level,
        expectations: level.expectations.length > 0 ? level.expectations : [''],
        skills: level.skills.length > 0 ? level.skills : [''],
        tools: level.tools.length > 0 ? level.tools : [''],
        knowledge: level.knowledge.length > 0 ? level.knowledge : [''],
        toAdvance: level.toAdvance.length > 0 ? level.toAdvance : [''],
      },
      isEditingLevel: true,
      isCreatingLevel: false,
    }));
  };

  // Level creation
  const handleCreateLevel = () => {
    setState((prev) => ({
      ...prev,
      editingLevel: DEFAULT_EDITING_LEVEL,
      isCreatingLevel: true,
      isEditingLevel: false,
    }));
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setState((prev) => ({
      ...prev,
      isEditingLevel: false,
      isCreatingLevel: false,
    }));
  };

  // Update bucket title
  const updateBucketTitle = (title: string) => {
    setState((prev) => ({ ...prev, bucketTitle: title }));
  };

  // Update editing field
  const updateEditingField = (field: keyof Level, value: string | string[]) => {
    setState((prev) => ({
      ...prev,
      editingLevel: { ...prev.editingLevel, [field]: value },
    }));
  };

  // Add list item
  const addListItem = (field: EditableField) => {
    const currentArray = (state.editingLevel[field] as string[]) || [];
    updateEditingField(field, [...currentArray, '']);
  };

  // Update list item
  const updateListItem = (field: EditableField, index: number, value: string) => {
    const currentArray = (state.editingLevel[field] as string[]) || [];
    const newArray = [...currentArray];
    newArray[index] = value;
    updateEditingField(field, newArray);
  };

  // Remove list item
  const removeListItem = (field: EditableField, index: number) => {
    const currentArray = (state.editingLevel[field] as string[]) || [];
    if (currentArray.length > 1) {
      updateEditingField(
        field,
        currentArray.filter((_, i) => i !== index),
      );
    }
  };

  // Save handlers (placeholder for actual API calls)
  const handleSaveLevel = () => {
    // TODO: Implement API call to save level
    console.log('Saving level:', state.editingLevel);
    handleCancelEdit();
  };

  const handleSaveBucket = () => {
    // TODO: Implement API call to save bucket
    console.log('Saving bucket:', state.bucketTitle);
  };

  return {
    // Data
    bucket,
    hasLevels,
    isLoading,
    error,

    // State
    ...state,

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
  };
};
