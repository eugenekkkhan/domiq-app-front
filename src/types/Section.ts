export type Section = {
  id: number;
  name: string;
  parent_id: number | null;
  position: number;
  enabled: boolean;
  children?: Section[];
  created_at: string;
  updated_at: string;
};
