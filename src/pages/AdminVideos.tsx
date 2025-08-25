import React, { useEffect, useState } from "react";
import { getAllVideos } from "../queries";
import VideoCard from "../components/AdminPanel/VideoCard/VideoCard";
import type { Video } from "../types/video";
import Stack from "@mui/material/Stack";
import AdminPage from "./AdminPage";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddVideo from "../components/AdminPanel/Modals/AddVideo/AddVideo";

const AdminVideos = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    getAllVideos()
      .then((response) => setVideos(response.data))
      .catch((error) => console.error(error));
  }, []);

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredVideos = videos
    .filter((video: Video) =>
      video.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a: Video, b: Video) => a.ID - b.ID);

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
        <AddVideo />
      </Stack>
      {filteredVideos.map((video: Video) => (
        <VideoCard key={video.ID} video={video} />
      ))}
    </AdminPage>
  );
};

export default AdminVideos;
