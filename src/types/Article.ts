export type ArticleType = {
  content: string;
  header: string;
  id: number | null;
  parent_id: number | null;
  type: "article" | "section";
};
