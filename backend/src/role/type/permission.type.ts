export type Permission = {
  id: string;
  action: string;
  subject: string;
  conditions?: any | null;
  fields?: string[];
  createdAt: Date;
  updatedAt: Date;
};
