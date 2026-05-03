import { NavLink } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getNews } from "./queries";
import { getSections } from "./queries";
import type { News } from "./types/NewArticle";
import type { Section } from "./types/Section";
import Banner from "./components/Banner/Banner";
import MainMenu from "./components/MainMenu/MainMenu";
import NewsComponent from "./components/News/NewsComponent";
import PublicLayout from "./components/PublicLayout/PublicLayout";
import { PageSpinner } from "./components/Spinner/Spinner";

const App = () => {
  const { isLoading: newsLoading } = useQuery({
    queryKey: ["news"],
    queryFn: () => getNews().then((r) => (r.data as News[]).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )),
  });

  const { isLoading: sectionsLoading } = useQuery({
    queryKey: ["sections"],
    queryFn: () => getSections().then((r) => r.data as Section[]),
    staleTime: Infinity,
  });

  return (
    <PublicLayout>
      {newsLoading || sectionsLoading ? (
        <PageSpinner />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">Новости</h2>
            <NavLink to="/news" className="text-primary text-sm font-medium">
              Все →
            </NavLink>
          </div>
          <NewsComponent limit={4} scroll />

          <Banner />

          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-lg">Разделы</h2>
            <MainMenu />
          </div>
        </>
      )}
    </PublicLayout>
  );
};

export default App;
