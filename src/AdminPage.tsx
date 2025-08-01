import { useEffect, useState } from "react";
import AdminPageNavbar from "./AdminPageNavbar";
import { getAllArticles } from "./queries";
import { getCookie } from "./utils";

type ArtHeader = {
  Header: string;
  SysHeader: string;
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
        setArticles([{ Header: "ewdjewoi", SysHeader: "dfwiohwio" }]);
      });
  }, []);
  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        minWidth: "640px",
        flexDirection: "column",
        top: "calc(64px + 12px)",
        position: "relative",
      }}
    >

      <AdminPageNavbar />
      <div style={{ display: "flex", justifyContent: "end" }}>
        <button
          style={{
            width: "120px",
          }}
        >
          add article
        </button>
      </div>
      {articles.map((article, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "20px",
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
            <b>{article.Header}</b>
            <p>{article.SysHeader}</p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
            }}
          >
            <button style={{ height: "100%" }}>edit</button>
            <button style={{ height: "100%" }}>delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminPage;
