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

export interface Bucket {
  id: string;
  title: string;
  description: string;
  totalLevels: number;
  levels: Level[];
}

export interface BucketViewState {
  selectedLevel: Level | null;
  isEditingLevel: boolean;
  isCreatingLevel: boolean;
  bucketTitle: string;
  editingLevel: Partial<Level>;
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
