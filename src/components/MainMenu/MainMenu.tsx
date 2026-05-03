import { useQuery } from "@tanstack/react-query";
import { getSections } from "../../queries";
import type { Section } from "../../types/Section";
import MainMenuElement from "./MainMenuElement/MainMenuElement";

const MainMenu = () => {
  const { data } = useQuery({
    queryKey: ["sections"],
    queryFn: () => getSections().then((r) => r.data as Section[]),
    staleTime: Infinity,
  });

  const sections = (data ?? []).filter((s) => !s.parent_id);

  if (sections.length === 0) return null;

  return (
    <div className="card overflow-hidden">
      {sections.map((section, i) => (
        <MainMenuElement
          key={section.id}
          text={section.name}
          to={`/sections/${section.id}`}
          isLast={i === sections.length - 1}
        />
      ))}
    </div>
  );
};

export default MainMenu;
