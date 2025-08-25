import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { getAllNews } from "../queries";

import AdminPage from "./AdminPage";
import type { NewArticle } from "../types/NewArticle";
import NewsCard from "../components/AdminPanel/NewsCard/NewsCard";
import AddNews from "../components/AdminPanel/Modals/AddNews/AddNews";

const AdminNews = () => {
  const [news, setNews] = useState<NewArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    getAllNews()
      .then((response) => {
        setNews(response.data);
      })
      .catch(() => {
        setNews([]);
      });
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredNews = news
    .filter((article) =>
      article.short.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.ID - b.ID);

  return (
    <AdminPage>
      <Stack spacing={"12px"} direction={{ xs: "column", md: "row" }}>
        <TextField
          label="Поиск"
          variant="outlined"
          size="small"
          onChange={handleSearch}
          value={searchTerm}
          sx={{ flex: 3 }}
          fullWidth
        />
        {searchTerm !== "" && (
          <Button variant="outlined" onClick={() => setSearchTerm("")}>
            Сброс поиска
          </Button>
        )}
        <AddNews />
      </Stack>
      {filteredNews.map((news, index) => (
        <NewsCard key={index} news={news} />
      ))}
    </AdminPage>
  );
};

export default AdminNews;
