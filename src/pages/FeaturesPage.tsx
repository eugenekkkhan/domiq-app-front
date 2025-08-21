import { useEffect, useState } from "react";
import MainMenu from "../components/MainMenu/MainMenu";
import { useBackButton } from "../customHooks/useBackButton";
import type { MenuItem } from "../types/MenuItem";
import axios from "axios";

const dataPreparation = (elems: MenuItem[]) => {
  elems.forEach((element, index) => {
    element.link = "/article/" + element.id;
    if (index === elems.length - 1) element.isLast = true;
  });
  return elems;
};

const Features = () => {
  useBackButton();

  const [menuElems, setMenuElems] = useState<MenuItem[]>([]);
  useEffect(() => {
    axios
      .get(
        import.meta.env.VITE_APPLICATION_API_LINK +
          "public/get_articles_by_parent_id",
        { params: { id: 3 } }
      )
      .then((res) => {
        setMenuElems(dataPreparation(res.data as MenuItem[]));
        console.log(res.data);
      });
  }, []);
  return (
    <div>
      <h1>
        Полезные функции
      </h1>
      <MainMenu initialValues={menuElems} />
    </div>
  );
};

export default Features;
