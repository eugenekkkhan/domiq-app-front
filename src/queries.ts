import axios from "axios";
import type { ArticleType } from "./types/Article";
import { getCookie } from "./utils/utils";

// Axios instance used across requests
const withHeader = axios.create();

// Helper to safely read Telegram WebApp user id from SDK
const getTelegramUserId = (): string | null => {
  try {
    const tg = (window as any)?.Telegram?.WebApp;
    const id = tg?.initDataUnsafe?.user?.id ?? tg?.initData?.user?.id;
    return typeof id !== "undefined" && id !== null ? String(id) : null;
  } catch {
    return null;
  }
};

// Attach Telegram user id to every request if available
withHeader.interceptors.request.use((config) => {
  const userId = getTelegramUserId();
  if (userId) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)["X-User-ID"] = userId;
  }
  return config;
});

const auth = (username: string, password: string) =>
  withHeader.post(
    import.meta.env.VITE_APPLICATION_API_LINK + "private/auth",
    {},
    {
      headers: {
        Authorization: "Basic " + btoa(`${username}:${password}`),
      },
    }
  );

const getAllArticles = () =>
  withHeader.get(
    import.meta.env.VITE_APPLICATION_API_LINK + "public/all_art_headers",
    {}
  );

//public
const getAllVideos = () =>
  withHeader.get(
    import.meta.env.VITE_APPLICATION_API_LINK + "public/pbVideo/get_all_videos"
  );

const getVideoData = (source: string) =>
  withHeader.get(import.meta.env.VITE_API_LINK + source, {
    headers: {
      Accept: "video/mp4;charset=UTF-8",
    },
    responseType: "blob",
  });

const getThumbnailFromVideo = (source: string) =>
  withHeader.get(import.meta.env.VITE_API_LINK + source, {
    responseType: "arraybuffer",
  });

const createArticle = (article: ArticleType) =>
  withHeader.post(
    import.meta.env.VITE_APPLICATION_API_LINK + "private/create_article",
    {
      content: article.content,
      header: article.header,
      parent_id: article.parent_id,
      type: article.type,
    },
    { headers: { Authorization: "Basic " + getCookie("token") } }
  );

const getArticle = (id: string) =>
  withHeader.get(
    import.meta.env.VITE_APPLICATION_API_LINK + "public/get_article",
    {
      params: { id },
    }
  );

const getArticlesByParentId = (id: string) =>
  withHeader.get(
    import.meta.env.VITE_APPLICATION_API_LINK +
      "public/get_articles_by_parent_id",
    {
      params: { id },
    }
  );

const getAllSections = () =>
  withHeader.get(
    import.meta.env.VITE_APPLICATION_API_LINK + "private/get_all_sections",
    {
      headers: { Authorization: "Basic " + getCookie("token") },
    }
  );

const deleteArticle = (id: string) => {
  return withHeader.delete(
    import.meta.env.VITE_APPLICATION_API_LINK + "private/delete_article",
    {
      headers: { Authorization: "Basic " + getCookie("token") },
      data: { id: parseInt(id) },
    }
  );
};

const updateArticle = (article: ArticleType) =>
  withHeader.post(
    import.meta.env.VITE_APPLICATION_API_LINK + "private/update_article",
    {
      content: article.content,
      header: article.header,
      parent_id: parseInt(article.parent_id?.toString() as string),
      id: parseInt(article.id?.toString() as string),
      type: article.type,
    },
    { headers: { Authorization: "Basic " + getCookie("token") } }
  );

const uploadMedia = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return withHeader.post(
    import.meta.env.VITE_APPLICATION_API_LINK + "private/upload_media",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Basic " + getCookie("token"),
      },
    }
  );
};

const getUsersDevices = () =>
  withHeader.get(
    import.meta.env.VITE_APPLICATION_API_LINK + "private/get_devices_fl",
    {
      headers: { Authorization: "Basic " + getCookie("token") },
    }
  );

const getAllUsersData = () =>
  withHeader.get(
    import.meta.env.VITE_APPLICATION_API_LINK + "private/get_all_users_fl",
    {
      headers: { Authorization: "Basic " + getCookie("token") },
    }
  );

const sendMailing = (message: string) =>
  withHeader.post(
    import.meta.env.VITE_APPLICATION_API_LINK + "private/mailing",
    { mailingText: message },
    {
      headers: { Authorization: "Basic " + getCookie("token") },
    }
  );

const createVideo = ({
  name,
  videoLink,
}: {
  name: string;
  videoLink: string;
}) =>
  withHeader.post(
    import.meta.env.VITE_APPLICATION_API_LINK + "private/videos/create_video",
    {
      name,
      source: videoLink,
    },
    { headers: { Authorization: "Basic " + getCookie("token") } }
  );

const updateVideo = ({
  id,
  name,
  videoLink,
  CreatedAt,
  thumbnail,
  duration,
}: {
  id: string;
  name: string;
  videoLink: string;
  CreatedAt: string;
  thumbnail: string;
  duration: number;
}) =>
  withHeader.post(
    import.meta.env.VITE_APPLICATION_API_LINK + "private/videos/update_video",
    {
      ID: parseInt(id),
      name,
      source: videoLink,
      CreatedAt,
      thumbnail,
      duration,
    },
    { headers: { Authorization: "Basic " + getCookie("token") } }
  );

const deleteVideo = (id: string) =>
  withHeader.delete(
    import.meta.env.VITE_APPLICATION_API_LINK + "private/videos/delete_video",
    {
      headers: { Authorization: "Basic " + getCookie("token") },
      params: { videoID: parseInt(id) },
    }
  );

const createNews = ({ content }: { content: string }) =>
  withHeader.post(
    import.meta.env.VITE_APPLICATION_API_LINK + "private/news/create",
    { content },
    {
      headers: { Authorization: "Basic " + getCookie("token") },
    }
  );

const getAllNews = () =>
  withHeader.get(
    import.meta.env.VITE_APPLICATION_API_LINK + "public/news/get_all",
    {
      headers: { Authorization: "Basic " + getCookie("token") },
    }
  );

const updateNews = ({
  id,
  createdAt,
  content,
}: {
  id: string;
  createdAt: string;
  content: string;
}) =>
  withHeader.patch(
    import.meta.env.VITE_APPLICATION_API_LINK + "private/news/update",
    {
      id: parseInt(id),
      createdAt,
      content,
    },
    { headers: { Authorization: "Basic " + getCookie("token") } }
  );

const deleteNews = (id: string) =>
  withHeader.delete(
    import.meta.env.VITE_APPLICATION_API_LINK + "private/news/delete",
    {
      headers: { Authorization: "Basic " + getCookie("token") },
      params: { id: parseInt(id) },
    }
  );

const getNewsById = (id: string) =>
  withHeader.get(
    import.meta.env.VITE_APPLICATION_API_LINK + "public/news/get",
    {
      headers: { Authorization: "Basic " + getCookie("token") },
      params: { id: parseInt(id) },
    }
  );

export {
  auth,
  getAllArticles,
  getAllVideos,
  getVideoData,
  getThumbnailFromVideo,
  createArticle,
  getArticle,
  getArticlesByParentId,
  getAllSections,
  deleteArticle,
  updateArticle,
  uploadMedia,
  getUsersDevices,
  getAllUsersData,
  sendMailing,
  createVideo,
  updateVideo,
  deleteVideo,
  createNews,
  getAllNews,
  updateNews,
  deleteNews,
  getNewsById,
};
