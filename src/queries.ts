import axios from "axios";
import { getToken, removeToken } from "./utils/auth";

const BASE = import.meta.env.VITE_API_URL as string;

// Axios instance that injects the JWT token on every request
const api = axios.create({ baseURL: BASE });
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      removeToken();
      window.location.href = "/admin";
    }
    return Promise.reject(err);
  },
);

// ---------- Auth ----------

export const login = (nickname: string, password: string) =>
  axios.post(`${BASE}/auth/login`, { nickname, password });

// ---------- Sections ----------

export const getSections = () => axios.get(`${BASE}/sections`);
export const getSection = (id: number) => axios.get(`${BASE}/sections/${id}`);
export const getSectionChildren = (id: number) =>
  axios.get(`${BASE}/sections/${id}/children`);
export const createSection = (name: string, parentId?: number) =>
  api.post("/sections", { name, parent_id: parentId ?? null });
export const updateSection = (id: number, name: string, parentId?: number, isVisible?: boolean) =>
  api.patch(`/sections/${id}`, {
    name,
    parent_id: parentId ?? null,
    ...(isVisible !== undefined && { is_visible: isVisible }),
  });
export const deleteSection = (id: number) => api.delete(`/sections/${id}`);
export const toggleSectionVisible = (id: number, is_visible: boolean) =>
  api.patch(`/sections/${id}/visible`, { is_visible });
export const reorderSections = (items: { id: number; index: number }[]) =>
  api.put("/sections/reorder", items);

// ---------- Articles ----------

export const getArticles = () => axios.get(`${BASE}/articles`);
export const getArticle = (id: number) => axios.get(`${BASE}/articles/${id}`);
export const getArticlesBySection = (sectionId: number) =>
  axios.get(`${BASE}/sections/${sectionId}/articles`);
export const createArticle = (
  title: string,
  contentMarkdown: string,
  sectionId: number,
) =>
  api.post("/articles", {
    title,
    content_markdown: contentMarkdown,
    section_id: sectionId,
  });
export const updateArticle = (
  id: number,
  title: string,
  contentMarkdown: string,
  sectionId: number,
) =>
  api.patch(`/articles/${id}`, {
    title,
    content_markdown: contentMarkdown,
    section_id: sectionId,
  });
export const deleteArticle = (id: number) => api.delete(`/articles/${id}`);

// ---------- News ----------

export const getNews = () => axios.get(`${BASE}/news`);
export const getNewsItem = (id: number) => axios.get(`${BASE}/news/${id}`);
export const createNews = (
  title: string,
  content: string,
  previewImageId?: number,
) =>
  api.post("/news", {
    title,
    content,
    ...(previewImageId !== undefined && { preview_image_id: previewImageId }),
  });
export const updateNews = (
  id: number,
  title: string,
  content: string,
  previewImageId?: number,
) =>
  api.patch(`/news/${id}`, {
    title,
    content,
    ...(previewImageId !== undefined && { preview_image_id: previewImageId }),
  });
export const deleteNews = (id: number) => api.delete(`/news/${id}`);

// ---------- Media ----------

export const getMedia = (type: "images" | "videos" | "all" = "all") =>
  axios.get(`${BASE}/media`, { params: { type } });
export const getImage = (id: number) => axios.get(`${BASE}/images/${id}`);
export const getVideo = (id: number) => axios.get(`${BASE}/videos/${id}`);
export const renameImage = (id: number, name: string) =>
  api.patch(`/images/${id}`, { name });
export const deleteImage = (id: number) => api.delete(`/images/${id}`);
export const renameVideo = (id: number, name: string) =>
  api.patch(`/videos/${id}`, { name });
export const deleteVideo = (id: number) => api.delete(`/videos/${id}`);

export const uploadImage = (file: File, name?: string) => {
  const fd = new FormData();
  fd.append("file", file);
  if (name) fd.append("name", name);
  return api.post("/media/images", fd);
};

// ---------- Theme ----------

export const getTheme = () => axios.get(`${BASE}/theme`);
export const updateTheme = (theme: object) => api.patch("/theme", theme);

// ---------- Settings ----------

export const getSettingsQuery = () => axios.get(`${BASE}/settings`);
export const updateSettings = (settings: object) =>
  api.patch("/settings", settings);

// ---------- Supervisors ----------

export const registerSupervisor = (nickname: string, password: string) =>
  api.post("/auth/register_supervisor", { nickname, password });
export const listSupervisors = () => api.get("/auth/supervisors");
export const listUsers = () => api.get("/auth/users");
export const removeSupervisor = (id: number) =>
  api.delete("/auth/remove_supervisor", { data: { id } });
export const updateSupervisor = (id: number, nickname: string, password: string) =>
  api.patch(`/auth/supervisors/${id}`, { nickname, password });

export const uploadVideo = (
  file: File,
  name?: string,
  thumbnailImageId?: number,
) => {
  const fd = new FormData();
  fd.append("file", file);
  if (name) fd.append("name", name);
  if (thumbnailImageId !== undefined)
    fd.append("thumbnail_image_id", thumbnailImageId.toString());
  return api.post("/media/videos", fd);
};
