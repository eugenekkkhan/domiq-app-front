import axios from "axios";
import { getCookie } from "./utils";

const auth = (username: string, password: string) =>
  axios.post(import.meta.env.VITE_APPLICATION_API_LINK + "private/auth", {},
    {
        headers: {
            'Authorization': 'Basic ' + btoa(`${username}:${password}`),
          },
    }
  );

const getAllArticles = () =>
    axios.get(import.meta.env.VITE_APPLICATION_API_LINK + "private/all_art_headers", {
        headers: {
            'Authorization': 'Basic ' + getCookie("token"),
        },
    });
export { auth, getAllArticles };
