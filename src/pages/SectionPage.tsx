import { useParams, NavLink } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  getSection,
  getSectionChildren,
  getArticlesBySection,
} from "../queries";
import type { Section } from "../types/Section";
import type { Article } from "../types/Article";
import { PageSpinner } from "../components/Spinner/Spinner";
import { ChevronRight } from "lucide-react";
import PublicLayout from "../components/PublicLayout/PublicLayout";

const SectionPage = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const id = Number(sectionId);

  const { data: section, isLoading } = useQuery({
    queryKey: ["section", sectionId],
    queryFn: () => getSection(id).then((r) => r.data as Section),
    enabled: !!sectionId,
  });

  const { data: children = [] } = useQuery({
    queryKey: ["section-children", sectionId],
    queryFn: () => getSectionChildren(id).then((r) => r.data as Section[]),
    enabled: !!sectionId,
  });

  const { data: articles = [] } = useQuery({
    queryKey: ["section-articles", sectionId],
    queryFn: () => getArticlesBySection(id).then((r) => r.data as Article[]),
    enabled: !!sectionId,
  });

  return (
    <PublicLayout showBack>
      {isLoading || !section ? (
        <PageSpinner />
      ) : (
        <>
          <h1 className="text-2xl font-bold">{section.name}</h1>

          {children.length > 0 || articles.length > 0 ? (
            <div className="card overflow-hidden">
              {children.map((child, i) => (
                <NavLink
                  key={child.id}
                  to={`/sections/${child.id}`}
                  className={`flex items-center justify-between p-[var(--spacing-card)] ${
                    i < children.length - 1 || articles.length > 0
                      ? "border-b border-border"
                      : ""
                  }`}
                >
                  <span className="text-[15px]">{child.name}</span>
                  <ChevronRight size={18} className="text-gray-300" />
                </NavLink>
              ))}
              {articles.map((article, i) => (
                <NavLink
                  key={article.id}
                  to={`/articles/${article.id}`}
                  className={`flex items-center justify-between p-[var(--spacing-card)] ${
                    i < articles.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <span className="text-[15px]">{article.title}</span>
                  <ChevronRight size={18} className="text-gray-300" />
                </NavLink>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">
              Раздел пуст
            </p>
          )}
        </>
      )}
    </PublicLayout>
  );
};

export default SectionPage;
