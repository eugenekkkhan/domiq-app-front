import { useState, useCallback, useEffect } from "react";
import { registerSupervisor, listSupervisors, removeSupervisor, updateSupervisor } from "../queries";
import AdminPage from "./AdminPage";
import { useToast } from "../contexts/ToastContext";
import { Trash2, Pencil, X, Check } from "lucide-react";

type Moderator = { id: number; nickname: string; created_at: string };

const AdminSupervisors = () => {
  const { addToast } = useToast();

  const [mods, setMods] = useState<Moderator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [addForm, setAddForm] = useState({ nickname: "", password: "" });
  const [adding, setAdding] = useState(false);

  const [removingId, setRemovingId] = useState<number | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ nickname: "", password: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    listSupervisors()
      .then((res) => setMods(res.data))
      .catch(() => setError("Не удалось загрузить список модераторов"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = () => {
    if (!addForm.nickname || !addForm.password) return;
    setAdding(true);
    registerSupervisor(addForm.nickname, addForm.password)
      .then((res) => {
        addToast(`Модератор «${addForm.nickname}» создан`, "success");
        setAddForm({ nickname: "", password: "" });
        setMods((prev) => [...prev, res.data]);
      })
      .catch((e) => {
        const msg = e?.response?.data?.error ?? "Не удалось создать модератора";
        addToast(msg, "error");
      })
      .finally(() => setAdding(false));
  };

  const handleRemove = (mod: Moderator) => {
    if (!confirm(`Удалить модератора «${mod.nickname}»?`)) return;
    setRemovingId(mod.id);
    removeSupervisor(mod.id)
      .then(() => {
        addToast(`Модератор «${mod.nickname}» удалён`, "success");
        setMods((prev) => prev.filter((m) => m.id !== mod.id));
      })
      .catch((e) => {
        const msg = e?.response?.data?.error ?? "Не удалось удалить модератора";
        addToast(msg, "error");
      })
      .finally(() => setRemovingId(null));
  };

  const startEdit = (mod: Moderator) => {
    setEditingId(mod.id);
    setEditForm({ nickname: mod.nickname, password: "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ nickname: "", password: "" });
  };

  const handleSave = (mod: Moderator) => {
    setSaving(true);
    updateSupervisor(mod.id, editForm.nickname, editForm.password)
      .then((res) => {
        addToast(`Модератор «${res.data.nickname}» обновлён`, "success");
        setMods((prev) => prev.map((m) => (m.id === mod.id ? res.data : m)));
        cancelEdit();
      })
      .catch((e) => {
        const msg = e?.response?.data?.error ?? "Не удалось обновить модератора";
        addToast(msg, "error");
      })
      .finally(() => setSaving(false));
  };

  return (
    <AdminPage>
      <h2 className="font-semibold text-base">Управление модераторами</h2>

      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2 px-1">
          Добавить модератора
        </p>
        <div className="card overflow-hidden">
          <div className="p-[var(--spacing-card)] border-b border-border">
            <label className="text-xs text-gray-400 font-medium uppercase tracking-wide block mb-1.5">
              Никнейм
            </label>
            <input
              className="w-full text-sm bg-transparent outline-none"
              placeholder="supervisor_name"
              value={addForm.nickname}
              onChange={(e) => setAddForm({ ...addForm, nickname: e.target.value })}
            />
          </div>
          <div className="p-[var(--spacing-card)]">
            <label className="text-xs text-gray-400 font-medium uppercase tracking-wide block mb-1.5">
              Пароль
            </label>
            <input
              type="password"
              className="w-full text-sm bg-transparent outline-none"
              placeholder="••••••••"
              value={addForm.password}
              onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
              onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
            />
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <button
            className="btn btn-primary"
            disabled={adding || !addForm.nickname || !addForm.password}
            onClick={handleAdd}
          >
            {adding ? "Создание…" : "Создать модератора"}
          </button>
        </div>
      </div>

      <div className="mt-2">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2 px-1">
          Модераторы
        </p>
        {loading ? (
          <div className="card p-[var(--spacing-card)] text-sm text-gray-400">Загрузка…</div>
        ) : error ? (
          <div className="card p-[var(--spacing-card)] text-sm text-red-400">
            {error}{" "}
            <button className="underline" onClick={load}>Повторить</button>
          </div>
        ) : mods.length === 0 ? (
          <div className="card p-[var(--spacing-card)] text-sm text-gray-400">
            Нет модераторов
          </div>
        ) : (
          <div className="card overflow-hidden">
            {mods.map((mod, i) => (
              <div key={mod.id} className={i < mods.length - 1 ? "border-b border-border" : ""}>
                {editingId === mod.id ? (
                  <div className="p-[var(--spacing-card)] flex flex-col gap-2">
                    <div>
                      <label className="text-xs text-gray-400 font-medium uppercase tracking-wide block mb-1">
                        Никнейм
                      </label>
                      <input
                        className="w-full text-sm bg-transparent outline-none border-b border-border pb-1"
                        value={editForm.nickname}
                        onChange={(e) => setEditForm({ ...editForm, nickname: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 font-medium uppercase tracking-wide block mb-1">
                        Новый пароль
                      </label>
                      <input
                        type="password"
                        className="w-full text-sm bg-transparent outline-none border-b border-border pb-1"
                        placeholder="оставьте пустым, чтобы не менять"
                        value={editForm.password}
                        onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                        onKeyDown={(e) => { if (e.key === "Enter") handleSave(mod); if (e.key === "Escape") cancelEdit(); }}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button className="btn btn-icon" onClick={cancelEdit} title="Отмена">
                        <X size={14} />
                      </button>
                      <button
                        className="btn btn-primary btn-icon"
                        disabled={saving || !editForm.nickname || (editForm.nickname === mod.nickname && !editForm.password)}
                        onClick={() => handleSave(mod)}
                        title="Сохранить"
                      >
                        <Check size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-[var(--spacing-card)]">
                    <span className="text-sm">{mod.nickname}</span>
                    <div className="flex items-center gap-1">
                      <button
                        className="btn btn-icon"
                        onClick={() => startEdit(mod)}
                        title="Редактировать"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className="btn btn-danger btn-icon"
                        disabled={removingId === mod.id}
                        onClick={() => handleRemove(mod)}
                        title="Удалить"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminPage>
  );
};

export default AdminSupervisors;
