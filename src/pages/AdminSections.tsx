import { useEffect, useState, useCallback } from "react";
import { getSections } from "../queries";
import type { Section } from "../types/Section";
import SectionCard from "../components/AdminPanel/SectionCard/SectionCard";
import AddSection from "../components/AdminPanel/Modals/AddSection/AddSection";
import AdminPage from "./AdminPage";

const AdminSections = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [search, setSearch] = useState("");

  const load = useCallback(() => {
    getSections().then((res) => setSections(res.data as Section[]));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = sections
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.id - b.id);

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
        <AddSection onSaved={load} />
      </div>
      {filtered.map((section) => (
        <SectionCard key={section.id} section={section} onDelete={load} />
      ))}
      {filtered.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">Разделы не найдены</p>
      )}
    </AdminPage>
  );
};

export default AdminSections;
