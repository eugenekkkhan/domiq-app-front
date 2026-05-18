export type Article = {
  id: number;
  title: string;
  content_markdown: string;
  section_id: number;
  author_id: number;
  show_author: boolean;
  is_visible: boolean;
  index: number;
  created_at: string;
  updated_at: string;
};