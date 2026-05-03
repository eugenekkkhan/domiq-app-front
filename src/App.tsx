import { NavLink } from "react-router";
import Banner from "./components/Banner/Banner";
import MainMenu from "./components/MainMenu/MainMenu";
import NewsComponent from "./components/News/NewsComponent";
import PublicLayout from "./components/PublicLayout/PublicLayout";

const App = () => {
  return (
    <PublicLayout>
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg">Новости</h2>
        <NavLink to="/news" className="text-primary text-sm font-medium">
          Все →
        </NavLink>
      </div>
      <NewsComponent limit={4} scroll />

      <Banner />

      <div>
        <h2 className="font-bold text-lg mb-3">Разделы</h2>
        <MainMenu />
      </div>
    </PublicLayout>
  );
};

export default App;
