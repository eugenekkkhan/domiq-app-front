import axios from "axios";

const auth = (username: string, password: string) =>
  axios.post(
    import.meta.env.VITE_APPLICATION_API_LINK + "private/auth",
    {},
    {
      headers: {
        Authorization: "Basic " + btoa(`${username}:${password}`),
      },
    }
  );

const getAllArticles = () =>
  axios.get(
    import.meta.env.VITE_APPLICATION_API_LINK + "public/all_art_headers",
    {}
  );

//public
const getAllVideos = () =>
  axios.get(
    import.meta.env.VITE_APPLICATION_API_LINK + "public/pbVideo/get_all_videos"
  );

const getVideoData = (source: string) =>
  axios.get(import.meta.env.VITE_API_LINK + source, {
    headers: {
      Accept: "video/mp4;charset=UTF-8",
    },
    responseType: "blob",
  });

const getThumbnailFromVideo = (source: string) =>
  axios.get(import.meta.env.VITE_API_LINK + source, {
    responseType: "arraybuffer",
  });

export {
  auth,
  getAllArticles,
  getAllVideos,
  getVideoData,
  getThumbnailFromVideo,
};
