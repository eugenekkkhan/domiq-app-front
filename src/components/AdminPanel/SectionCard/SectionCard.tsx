import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteSection } from "../../../queries";
import type { Section } from "../../../types/Section";
import EditSection from "../Modals/EditSection/EditSection";

const SectionCard = ({
  section,
  onDelete,
  isLast,
}: {
  section: Section;
  onDelete: () => void;
  isLast: boolean;
}) => {
  const [removing, setRemoving] = useState(false);

  const handleDelete = () => {
    if (!confirm(`Удалить раздел «${section.name}»? Статьи внутри останутся.`))
      return;
    setRemoving(true);
    deleteSection(section.id)
      .then(onDelete)
      .catch(() => setRemoving(false));
  };

  if (removing) return null;

  return (
    <div
      className={`flex items-center gap-3 p-[var(--spacing-card)] ${!isLast ? "border-b border-border" : ""}`}
    >
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-sm truncate flex-1 min-w-0">
            {section.name}
          </span>
          <EditSection section={section} onSaved={onDelete} />
          <button
            className="rounded-inner text-gray-400 hover:text-danger transition-colors cursor-pointer"
            onClick={handleDelete}
          >
            <Trash2 size={13} />
          </button>
        </div>
        <span className="text-xs text-gray-400">
          ID: {section.id}
          {section.parent_id
            ? ` · Родитель: ${section.parent_id}`
            : " · Корневой"}
        </span>
      </div>
    </div>
  );
};

export default SectionCard;
