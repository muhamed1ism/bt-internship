import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Level, BucketViewState, EditableField, BucketLevel } from '@app/types/bucket';
import { DEFAULT_EDITING_LEVEL } from '@app/constants/bucket';
import { useGetCategoryById, useGetUserCategoryLevel } from '../../../hooks/bucket';

export const useBucketView = () => {
  const navigate = useNavigate();
  const { bucketId } = useParams();

  const { category: bucket } = useGetCategoryById(bucketId || '');
  const maxLevel = bucket?.bucketLevels.length ?? 0;
  const hasLevels = maxLevel > 0;
  const { level } = useGetUserCategoryLevel(bucketId || '');

  const currentLevel =
    bucket?.bucketLevels.find((bucketLevel) => bucketLevel.id === level?.bucketLevelId) || null;

  // State management
  const [state, setState] = useState<BucketViewState>({
    selectedLevel: currentLevel,
    isEditingLevel: false,
    isCreatingLevel: false,
    bucketTitle: bucket?.name || '',
    editingLevel: DEFAULT_EDITING_LEVEL,
  });

  useEffect(() => {
    if (bucket && level) {
      const currentLevel =
        bucket.bucketLevels.find((bucketLevel) => bucketLevel.id === level.bucketLevelId) || null;

      setState((prev) => ({
        ...prev,
        selectedLevel: currentLevel,
        bucketTitle: bucket.name,
      }));
    }
  }, [bucket, level]);

  // Navigation actions
  const navigateBack = () => navigate('/buckets');

  // Level selection
  const handleLevelSelect = (level: BucketLevel | null) => {
    setState((prev) => ({
      ...prev,
      selectedLevel: level,
      isEditingLevel: false,
      isCreatingLevel: false,
    }));
  };

  // Level editing
  const handleEditLevel = (level: BucketLevel) => {
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

  return {
    // Data
    bucket,
    hasLevels,
    currentLevel,
    maxLevel,

    // State
    ...state,

    // Actions
    navigateBack,
    handleLevelSelect,
    handleEditLevel,
    handleCreateLevel,
    handleCancelEdit,
    addListItem,
    updateListItem,
    removeListItem,
  };
};
