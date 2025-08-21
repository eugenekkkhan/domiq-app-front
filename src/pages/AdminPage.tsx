import { useEffect, useState } from "react";
import AdminPageNavbar from "../AdminPageNavbar";
import { getAllArticles } from "../queries";
import { getCookie } from "../utils/utils";
import Button from "@mui/material/Button";
import { themeParams } from "@telegram-apps/sdk";

type ArtHeader = {
  header: string;
  id: number;
  type: "header" | "article";
};

const AdminPage = () => {
  const [articles, setArticles] = useState<ArtHeader[]>([]);
  useEffect(() => {
    console.log(getCookie("token"));
    getAllArticles()
      .then((response) => {
        console.log(response.data);
        setArticles(response.data);
      })
      .catch(() => {
        setArticles([{ header: "Empty", id: 0, type: "header" }]);
      });
  }, []);
  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        flexDirection: "column",
        top: "calc(64px + 12px)",
        position: "relative",
      }}
    >
      <AdminPageNavbar />
      <div style={{ display: "flex", justifyContent: "end" }}>
        <Button
          style={{
            width: "120px",
          }}
        >
          add article
        </Button>
      </div>
      {articles.map((article, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "16px",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              padding: "12px",
            }}
          >
            <b>{article.header}</b>
            <p style={{ fontSize: "0.8em" }}>
              id: {article.id} type: {article.type}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
            }}
          >
            <Button
              style={{
                height: "100%",
                background: themeParams.buttonColor(),
                color: themeParams.buttonTextColor(),
              }}
            >
              редактировать
            </Button>
            <Button
              style={{
                height: "100%",
                background: themeParams.buttonColor(),
                color: themeParams.buttonTextColor(),
              }}
            >
              удалить
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminPage;
