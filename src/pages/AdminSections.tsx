import { useEffect, useState, useCallback } from "react";
import { getSections, toggleSectionVisible, reorderSections } from "../queries";
import { useUsers } from "../hooks/useUsers";
import type { Section } from "../types/Section";
import SectionCard from "../components/AdminPanel/SectionCard/SectionCard";
import AddSection from "../components/AdminPanel/Modals/AddSection/AddSection";
import AdminPage from "./AdminPage";
import AsyncView from "../components/AsyncView/AsyncView";
import { useToast } from "../contexts/ToastContext";
import { isAdmin, getCurrentUserId } from "../utils/auth";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

const AdminSections = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const { addToast } = useToast();
  const users = useUsers();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    getSections()
      .then((res) => setSections(res.data as Section[]))
      .catch(() => setError("Не удалось загрузить разделы"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleToggleVisible = (section: Section) => {
    const newVisible = !section.is_visible;
    setSections((prev) =>
      prev.map((s) => s.id === section.id ? { ...s, is_visible: newVisible } : s)
    );
    toggleSectionVisible(section.id, newVisible).catch(() => {
      addToast("Не удалось изменить видимость раздела", "error");
      load();
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const sorted = [...sections].sort((a, b) => a.index - b.index || a.id - b.id);
    const activeSection = sorted.find((s) => s.id === active.id);

    if (!isAdmin() && activeSection && activeSection.author_id !== getCurrentUserId()) {
      addToast("Это не ваш раздел", "error");
      return;
    }

    const oldIndex = sorted.findIndex((s) => s.id === active.id);
    const newIndex = sorted.findIndex((s) => s.id === over.id);
    const newList = arrayMove(sorted, oldIndex, newIndex);
    const items = newList.map((s, i) => ({ id: s.id, index: i }));
    setSections(newList.map((s, i) => ({ ...s, index: i })));
    reorderSections(items).catch(() => {
      addToast("Не удалось изменить порядок разделов", "error");
      load();
    });
  };

  const sorted = [...sections].sort((a, b) => a.index - b.index || a.id - b.id);
  const filtered = sorted.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );
  const searching = search.trim().length > 0;

  return (
    <AdminPage>
      <div className="flex gap-2 flex-wrap">
        <input
          className="input flex-1 min-w-40"
          placeholder="Поиск по названию"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="btn btn-secondary" onClick={() => setSearch("")}>Сброс</button>
        )}
        {isAdmin() && <AddSection onSaved={load} />}
      </div>
      <AsyncView loading={loading} error={error} onRetry={load}>
        {filtered.length > 0 ? (
          <div className="card overflow-hidden">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filtered.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                {filtered.map((section, i) => (
                  <SectionCard
                    key={section.id}
                    section={section}
                    onDelete={load}
                    onToggleVisible={() => handleToggleVisible(section)}
                    isDraggable={!searching}
                    isLast={i === filtered.length - 1}
                    authorName={users.get(section.author_id)?.nickname}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">Разделы не найдены</p>
        )}
      </AsyncView>
    </AdminPage>
  );
};

export default AdminSections;
