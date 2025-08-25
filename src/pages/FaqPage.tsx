import { useEffect, useState } from "react";
import MainMenu from "../components/MainMenu/MainMenu";
import { useBackButton } from "../customHooks/useBackButton";
import type { MenuItem } from "../types/MenuItem";
import axios from "axios";

// const menuElems: MenuItem[] = [
//   {
//     text: "Проблемы с подключением",
//     link: "/connection-problems",
//   },
//   {
//     text: "Вопросы по работе камеры",
//     link: "/faq",
//   },
//   {
//     text: "Полезные функции",
//     link: "/features",
//     isLast: true,
//   },
// ];

const dataPreparation = (elems: MenuItem[]) => {
  elems.forEach((element, index) => {
    element.link = "/article/" + element.id;
    if (index === elems.length - 1) element.isLast = true;
  });
  return elems;
};

const Faq = () => {
  useBackButton();

  const [menuElems, setMenuElems] = useState<MenuItem[]>([]);
  useEffect(() => {
    axios
      .get(
        import.meta.env.VITE_APPLICATION_API_LINK +
          "public/get_articles_by_parent_id",
        { params: { id: 2 } }
      )
      .then((res) => {
        setMenuElems(dataPreparation(res.data as MenuItem[]));
      });
  }, []);
  return (
    <div>
      <h1>
        Часто задаваемые<br />вопросы
      </h1>
      <MainMenu initialValues={menuElems} />
    </div>
  );
};

export default Faq;
