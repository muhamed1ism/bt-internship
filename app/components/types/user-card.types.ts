export interface Skill {
  title: string;
  level: number;
}

export interface Goal {
  title: string;
  level: number;
}

export interface UserCardProps {
  name: string;
  avatarUrl: string;
  skills: Skill[];
  currentGoals: Goal[];
}
