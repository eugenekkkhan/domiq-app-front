export type Section = {
  id: number;
  name: string;
  parent_id: number | null;
  is_visible: boolean;
  index: number;
  author_id: number;
  show_author: boolean;
  children?: Section[];
  created_at: string;
  updated_at: string;
};
