export type RoleType = {
  id: string;
  name: string;
  permissions: {
    [category: string]: string[];
  };
};
