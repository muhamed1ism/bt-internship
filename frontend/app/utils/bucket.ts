import type { Level, LevelStatus, LevelDifficulty } from '@app/types/bucket';

/**
 * Gets the appropriate CSS classes for a level's status
 */
export const getStatusClasses = (status: any): string => {
  switch (status) {
    case 'current':
      return 'bg-blue-100 text-blue-600';
    case 'completed':
      return 'bg-green-100 text-green-600';
    case 'locked':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

/**
 * Gets the appropriate CSS classes for a level's difficulty
 */
export const getDifficultyClasses = (difficulty: LevelDifficulty): string => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'intermediate':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'advanced':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'expert':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Capitalizes the first letter of a string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Formats a level title for display
 */
export const formatLevelTitle = (level: Level): string => {
  return `Level ${level.levelNumber}`;
};

/**
 * Determines if a level is selectable based on its status
 */
export const isLevelSelectable = (level: Level): boolean => {
  return level.status !== 'locked';
};

/**
 * Gets the appropriate background color for a section based on the content type
 */
export const getSectionBackground = (sectionType: string): string => {
  switch (sectionType) {
    case 'expectations':
      return 'bg-purple-50 border-purple-100';
    case 'skills':
      return 'bg-blue-50 border-blue-100';
    case 'knowledge':
      return 'bg-orange-50 border-orange-100';
    default:
      return 'bg-accent/5';
  }
};

/**
 * Validates if a level has all required fields
 */
export const validateLevel = (level: Partial<Level>): boolean => {
  return !!(
    level.title &&
    level.expectations?.length &&
    level.skills?.length &&
    level.tools?.length &&
    level.knowledge?.length &&
    level.toAdvance?.length
  );
};

/**
 * Generates a unique ID for new levels
 */
export const generateLevelId = (): string => {
  return `level_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Calculates the progress percentage for a bucket
 */
export const calculateBucketProgress = (levels: Level[]): number => {
  const completedLevels = levels.filter((level) => level.status === 'completed').length;
  return levels.length > 0 ? (completedLevels / levels.length) * 100 : 0;
};
