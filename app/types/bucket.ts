import { UserBucketLevelType } from '@app/hooks/bucket';

export type LevelStatus = 'current' | 'completed' | 'locked';
export type LevelDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Level {
  id: string;
  levelNumber: number;
  title: string;
  status: LevelStatus;
  difficulty: LevelDifficulty;
  estimatedTime: string;
  prerequisites: string[];
  expectations: string[];
  skills: string[];
  tools: string[];
  knowledge: string[];
  toAdvance: string[];
}

export interface BucketLevel {
  id: string;
  level: number;
  expectations: string[];
  skills: string[];
  tools: string[];
  knowledge: string[];
  toAdvance: string[];
  categoryId: string;
  category: BucketCategory;
}

export interface BucketCategory {
  id: string;
  name: string;
  description: string;
  bucketLevels: BucketLevel[];
}

export interface Bucket {
  id: string;
  title: string;
  description: string;
  totalLevels: number;
  levels: Level[];
}

export interface UserBucket {
  id: string;
  level: number;
  categoryId: string;
  category: BucketCategory;
}

export interface UserBucketLevel {
  userId: string;
  bucketLevelId: string;
  bucket: UserBucket;
}

export interface BucketViewState {
  selectedLevel: BucketLevel | null;
  isEditingLevel: boolean;
  isCreatingLevel: boolean;
  bucketTitle: string;
  editingLevel: Partial<BucketLevel>;
}

export type EditableField = 'expectations' | 'skills' | 'tools' | 'knowledge' | 'toAdvance';

export type DifficultyColorMap = {
  [key in LevelDifficulty]: string;
};

export type StatusIconMap = {
  [key in LevelStatus]: React.ReactNode;
};

export type SectionIconMap = {
  [key: string]: React.ReactNode;
};
