import type { Image } from "../types/Image";

const MINIO = import.meta.env.VITE_MINIO_URL as string;

export const mediaUrl = (bucket: string, objectKey: string): string =>
  `${MINIO}/${bucket}/${objectKey}`;

export const imageUrl = (
  image: Image,
  size: "original" | "large" | "medium" | "mini" | "thumbnail" = "medium"
): string => {
  const key =
    size === "original"
      ? image.object_key_original
      : size === "large"
      ? image.object_key_large
      : size === "mini"
      ? image.object_key_mini
      : size === "thumbnail"
      ? image.object_key_thumbnail
      : image.object_key_medium;
  return mediaUrl(image.bucket, key);
};
