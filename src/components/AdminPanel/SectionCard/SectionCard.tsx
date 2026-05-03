import { useState } from "react";
import { deleteSection } from "../../../queries";
import type { Section } from "../../../types/Section";
import EditSection from "../Modals/EditSection/EditSection";

const SectionCard = ({
  section,
  onDelete,
}: {
  section: Section;
  onDelete: () => void;
}) => {
  const [removing, setRemoving] = useState(false);

  const handleDelete = () => {
    if (!confirm(`Удалить раздел «${section.name}»? Статьи внутри останутся.`)) return;
    setRemoving(true);
    deleteSection(section.id).then(onDelete).catch(() => setRemoving(false));
  };

  if (removing) return null;

  return (
    <div className="card flex items-center justify-between p-3 gap-3">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="font-medium text-sm truncate">{section.name}</span>
        <span className="text-xs text-gray-400">
          ID: {section.id}
          {section.parent_id ? ` · Родитель: ${section.parent_id}` : " · Корневой"}
        </span>
      </div>
      <div className="flex gap-2 shrink-0">
        <EditSection section={section} onSaved={onDelete} />
        <button className="btn btn-danger text-xs px-3 py-1.5" onClick={handleDelete}>
          Удалить
        </button>
      </div>
    </div>
  );
};

export default SectionCard;
