import { useState } from "react";
import { deleteNews } from "../../../queries";
// import type { ArtHeader } from "../../../types/ArtHeader";
import Button from "@mui/material/Button";
// import EditArticle from "../Modals/EditArticle/EditArticle";
import Stack from "@mui/material/Stack";
import type { NewArticle } from "../../../types/NewArticle";
import { convertTimeStampToDateWithTime } from "../../../utils/convertTime";
import EditNews from "../Modals/EditNews/EditNews";

const NewsCard = ({ news }: { news: NewArticle }) => {
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
        <b>{news.short}</b>
        <p style={{ fontSize: "0.8em" }}>
          <b>ID: </b>
          {news.ID}</p>
        <Stack direction={"column"}>
          <p style={{ fontSize: "0.8em" }}>
            <b>Дата создания: </b>
            {news.CreatedAt && convertTimeStampToDateWithTime(news.CreatedAt)}
          </p>
          {news.CreatedAt !== news.UpdatedAt && (
            <p style={{ fontSize: "0.8em" }}>
              <b>Последнее обновление: </b>
              {news.UpdatedAt && convertTimeStampToDateWithTime(news.UpdatedAt)}
            </p>
          )}
        </Stack>
      </div>
      <Stack
        direction={{ xs: "column", md: "row" }}
        minWidth={{ xs: "160px", md: "360px" }}
        style={{
          gap: "12px",
          padding: "12px",
        }}
      >
        <EditNews id={news.ID} />
        <Button
          variant="outlined"
          fullWidth
          onClick={() =>
            deleteNews(news.ID.toString()).then(() => setIsRemoved(true))
          }
        >
          удалить
        </Button>
      </Stack>
    </div>
  );
};

export default NewsCard;
