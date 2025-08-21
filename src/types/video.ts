export type Video = {
  ID: number;
  CreatedAt: string | null;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  name: string;
  source: string;
  thumbnail: string;
  duration: number;
};
