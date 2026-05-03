import type { Image } from "./Image";

export type Video = {
  id: number;
  name: string;
  mime: string;
  bucket: string;
  object_key: string;
  duration_sec: number;
  thumbnail_image_id?: number;
  thumbnail_image?: Image;
  created_at: string;
  updated_at: string;
};
