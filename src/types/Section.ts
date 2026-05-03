export type Section = {
  id: number;
  name: string;
  parent_id: number;
  children?: Section[];
  created_at: string;
  updated_at: string;
};
