import { useState } from "react";
import { Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { deleteSection } from "../../../queries";
import type { Section } from "../../../types/Section";
import EditSection from "../Modals/EditSection/EditSection";

const SectionCard = ({
  section,
  onDelete,
  onMoveUp,
  onMoveDown,
  onToggleEnabled,
  isLast,
  isFirst,
}: {
  section: Section;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onToggleEnabled?: () => void;
  isLast: boolean;
  isFirst?: boolean;
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

  const showReorder = onMoveUp !== undefined || onMoveDown !== undefined;

  return (
    <div
      className={`flex items-center gap-2 p-[var(--spacing-card)] ${!isLast ? "border-b border-border" : ""}`}
    >
      {showReorder && (
        <div className="flex flex-col shrink-0">
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            className="text-gray-400 hover:text-text disabled:opacity-20 cursor-pointer disabled:cursor-default transition-colors"
          >
            <ChevronUp size={15} />
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            className="text-gray-400 hover:text-text disabled:opacity-20 cursor-pointer disabled:cursor-default transition-colors"
          >
            <ChevronDown size={15} />
          </button>
        </div>
      )}

      {onToggleEnabled && (
        <button
          onClick={onToggleEnabled}
          title={section.enabled ? "Скрыть" : "Показать"}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${
            section.enabled ? "bg-primary" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
              section.enabled ? "translate-x-[18px]" : "translate-x-0.5"
            }`}
          />
        </button>
      )}

      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className={`font-medium text-sm truncate flex-1 min-w-0 ${!section.enabled ? "text-gray-400" : ""}`}>
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
          {section.parent_id ? ` · Родитель: ${section.parent_id}` : " · Корневой"}
        </span>
      </div>
    </div>
  );
};

export default SectionCard;
