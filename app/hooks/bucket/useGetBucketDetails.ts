import { useQuery } from '@tanstack/react-query';
import { getAllCategoriesApi, getAllCategoryLevelsApi } from '@app/api/bucket-api';
import { BucketCategory, BucketLevel } from '@app/types/bucket';

interface TransformedLevel {
  id: string;
  levelNumber: number;
  title: string;
  status: 'current' | 'completed' | 'locked';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedTime: string;
  prerequisites: string[];
  expectations: string[];
  skills: string[];
  tools: string[];
  knowledge: string[];
  toAdvance: string[];
}

interface TransformedBucket {
  id: string;
  title: string;
  description: string;
  totalLevels: number;
  levels: TransformedLevel[];
}

const transformBucketLevel = (level: BucketLevel, userCurrentLevel: number): TransformedLevel => {
  const levelNumber = level.level;
  let status: 'current' | 'completed' | 'locked';
  
  if (levelNumber === userCurrentLevel) {
    status = 'current';
  } else if (levelNumber < userCurrentLevel) {
    status = 'completed';
  } else {
    status = 'locked';
  }

  return {
    id: level.id,
    levelNumber: level.level,
    title: `Level ${level.level}`,
    status,
    difficulty: level.level <= 2 ? 'beginner' : level.level <= 3 ? 'intermediate' : level.level <= 4 ? 'advanced' : 'expert',
    estimatedTime: `${level.level * 3}-${level.level * 6} months`,
    prerequisites: level.level > 1 ? [`Level ${level.level - 1}`] : [],
    expectations: level.expectations,
    skills: level.skills,
    tools: level.tools,
    knowledge: level.knowledge,
    toAdvance: level.toAdvance,
  };
};

const transformBucket = (category: BucketCategory, userCurrentLevel: number): TransformedBucket => {
  return {
    id: category.id,
    title: category.name,
    description: `${category.name} development expertise and progression path`,
    totalLevels: category.bucketLevels.length,
    levels: category.bucketLevels.map(level => transformBucketLevel(level, userCurrentLevel)),
  };
};

export const useGetBucketDetails = (categoryId: string, userCurrentLevel: number = 1) => {
  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ['bucket-categories'],
    queryFn: getAllCategoriesApi,
    retry: 1,
  });

  const {
    data: levels,
    isLoading: isLoadingLevels,
    error: levelsError,
  } = useQuery({
    queryKey: ['bucket-levels', categoryId],
    queryFn: () => getAllCategoryLevelsApi(categoryId),
    retry: 1,
    enabled: !!categoryId,
  });

  const category = categories?.find((cat: BucketCategory) => cat.id === categoryId);
  const bucket: TransformedBucket | undefined = category 
    ? transformBucket(category, userCurrentLevel)
    : undefined;

  return {
    bucket,
    isLoading: isLoadingCategories || isLoadingLevels,
    error: categoriesError || levelsError,
  };
}; 