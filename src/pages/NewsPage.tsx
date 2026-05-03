import PublicLayout from "../components/PublicLayout/PublicLayout";
import NewsComponent from "../components/News/NewsComponent";

const NewsPage = () => (
  <PublicLayout showBack>
    <h1 className="text-2xl font-bold">Новости</h1>
    <NewsComponent />
  </PublicLayout>
);

export default NewsPage;
