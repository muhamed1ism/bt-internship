import {
  CheckCircle2,
  Clock,
  Star,
  Target,
  Wrench,
  BookOpen,
  Brain,
  TrendingUp,
} from 'lucide-react';
import type { DifficultyColorMap } from '@app/types/bucket';

// These are configuration constants, not mock data, so they stay here
export const DIFFICULTY_COLORS: DifficultyColorMap = {
  beginner: 'bg-green-100 text-green-800 border-green-200',
  intermediate: 'bg-blue-100 text-blue-800 border-blue-200',
  advanced: 'bg-orange-100 text-orange-800 border-orange-200',
  expert: 'bg-purple-100 text-purple-800 border-purple-200',
};

export const STATUS_ICONS = {
  current: Clock,
  completed: CheckCircle2,
  locked: Star,
};

export const SECTION_ICONS = {
  expectations: Target,
  skills: Wrench,
  tools: BookOpen,
  knowledge: Brain,
  toAdvance: TrendingUp,
};

// Mock data has been moved to app/__mocks__/buckets.ts
// Please update your imports to use the new location:
// import { MOCK_BUCKETS, DEFAULT_EDITING_LEVEL } from '@app/__mocks__/buckets';

// Backward compatibility re-exports
export { MOCK_BUCKETS, DEFAULT_EDITING_LEVEL, FAKE_BUCKET } from '@app/__mocks__/buckets';
