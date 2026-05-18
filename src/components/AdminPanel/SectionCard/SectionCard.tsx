import { useState } from "react";
import { Trash2, GripVertical } from "lucide-react";
import { deleteSection } from "../../../queries";
import type { Section } from "../../../types/Section";
import EditSection from "../Modals/EditSection/EditSection";
import { isAdmin, getCurrentUserId } from "../../../utils/auth";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SectionCard = ({
  section,
  onDelete,
  onToggleVisible,
  isDraggable,
  isLast,
  authorName,
}: {
  section: Section;
  onDelete: () => void;
  onToggleVisible?: () => void;
  isDraggable?: boolean;
  isLast: boolean;
  authorName?: string;
}) => {
  const [removing, setRemoving] = useState(false);
  const canMutate = isAdmin() || section.author_id === getCurrentUserId();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id });

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
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-2 p-[var(--spacing-card)] ${!isLast ? "border-b border-border" : ""} ${isDragging ? "opacity-50 bg-bg z-50" : ""}`}
    >
      {isDraggable && (
        <button
          className="text-gray-400 hover:text-text cursor-grab active:cursor-grabbing shrink-0 touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={15} />
        </button>
      )}

      {onToggleVisible && canMutate && (
        <button
          onClick={onToggleVisible}
          title={section.is_visible ? "Скрыть" : "Показать"}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${
            section.is_visible ? "bg-primary" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
              section.is_visible ? "translate-x-[18px]" : "translate-x-0.5"
            }`}
          />
        </button>
      )}

      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className={`font-medium text-sm truncate flex-1 min-w-0 ${!section.is_visible ? "text-gray-400" : ""}`}>
            {section.name}
          </span>
          {canMutate && <EditSection section={section} onSaved={onDelete} />}
          {canMutate && (
            <button
              className="rounded-inner text-gray-400 hover:text-danger transition-colors cursor-pointer"
              onClick={handleDelete}
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
        <span className="text-xs text-gray-400">
          ID: {section.id}
          {section.parent_id ? ` · Родитель: ${section.parent_id}` : " · Корневой"}
          {authorName ? ` · ${authorName}` : ""}
        </span>
      </div>
    </div>
  );
};

export default SectionCard;
