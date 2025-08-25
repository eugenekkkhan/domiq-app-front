import ArticleCard from "../components/AdminPanel/ArticleCard/ArticleCard";
import AddArticle from "../components/AdminPanel/Modals/AddArticle/AddArticle";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { getAllArticles } from "../queries";
import type { ArtHeader } from "../types/ArtHeader";
import AdminPage from "./AdminPage";

const AdminArticles = () => {
  const [articles, setArticles] = useState<ArtHeader[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    getAllArticles()
      .then((response) => {
        setArticles(response.data);
      })
      .catch(() => {
        setArticles([{ header: "Empty", id: 0, type: "header" }]);
      });
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredArticles = articles
    .filter((article) =>
      article.header.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.id - b.id);

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
        <AddArticle />
      </Stack>
      {filteredArticles.map((article, index) => (
        <ArticleCard key={index} article={article} />
      ))}
    </AdminPage>
  );
};

export default AdminArticles;
