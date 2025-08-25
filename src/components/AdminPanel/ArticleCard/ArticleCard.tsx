import { useState } from "react";
import { deleteArticle } from "../../../queries";
import type { ArtHeader } from "../../../types/ArtHeader";
import Button from "@mui/material/Button";
import EditArticle from "../Modals/EditArticle/EditArticle";
import Stack from "@mui/material/Stack";

const ArticleCard = ({ article }: { article: ArtHeader }) => {
  const [isRemoved, setIsRemoved] = useState(false);
  return (
    <div
      style={{
        display: isRemoved ? "none" : "flex",
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
          ID: {article.id} Тип:{" "}
          {article.type === "article" ? "Статья" : "Раздел"}
        </p>
      </div>
      <Stack
        direction={{ xs: "column", md: "row" }}
        minWidth={{ xs: "160px", md: "360px" }}
        style={{
          gap: "12px",
          padding: "12px",
        }}
      >
        <EditArticle id={article.id} />
        <Button
          variant="outlined"
          fullWidth
          onClick={() =>
            deleteArticle(article.id.toString()).then(() => setIsRemoved(true))
          }
        >
          удалить
        </Button>
      </Stack>
    </div>
  );
};

export default ArticleCard;
