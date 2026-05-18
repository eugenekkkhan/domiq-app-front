import type { Image } from "./Image";

export type News = {
  id: number;
  title: string;
  content: string;
  short: string;
  preview_image_id?: number;
  preview_image?: Image;
  author_id: number;
  show_author: boolean;
  created_at: string;
  updated_at: string;
};
