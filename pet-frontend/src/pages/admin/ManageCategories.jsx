import { useEffect, useState } from "react";
import * as categoryApi from "../../api/categoryApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import ConfirmModal from "../../components/common/ConfirmModal";
import FormField, { inputClass } from "../../components/common/FormField";
import { validateFields, isRequired } from "../../utils/validators";

const emptyForm = { id: null, name: "", description: "" };

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    categoryApi
      .getCategories()
      .then(setCategories)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const resetForm = () => {
    setForm(emptyForm);
    setErrors({});
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = validateFields(form, { name: [[isRequired, "Category name is required."]] });
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) return;

    setSaving(true);
    setFormError(null);
    try {
      const payload = { name: form.name, description: form.description };
      if (form.id) {
        await categoryApi.updateCategory(form.id, payload);
      } else {
        await categoryApi.addCategory(payload);
      }
      resetForm();
      load();
    } catch (e) {
      setFormError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await categoryApi.deleteCategory(toDelete.id);
      setToDelete(null);
      load();
    } catch (e) {
      setError(e.message);
      setToDelete(null);
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Manage categories</h1>
        <p className="mt-1 text-sm text-ink/60">Organize pets into browsable categories.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="rounded-stamp border border-forest-100 bg-surface p-5 shadow-card">
        <h2 className="font-display text-lg font-semibold text-ink">{form.id ? "Edit category" : "Add a category"}</h2>
        {formError && <ErrorMessage className="mt-3" message={formError} />}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <FormField label="Name" error={errors.name} required>
            <input className={inputClass(errors.name)} value={form.name} onChange={handleChange("name")} />
          </FormField>
          <FormField label="Description">
            <input className={inputClass(false)} value={form.description} onChange={handleChange("description")} />
          </FormField>
        </div>
        <div className="mt-5 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-stamp bg-forest-500 px-5 py-2 text-sm font-semibold text-white hover:bg-forest-600 disabled:opacity-60 focus-ring"
          >
            {saving ? "Saving…" : form.id ? "Save changes" : "Add category"}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-stamp border border-forest-100 px-5 py-2 text-sm font-medium text-ink/70 hover:bg-paper focus-ring"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading && <Loader fullscreen label="Loading categories…" />}
      {error && <ErrorMessage message={error} onRetry={load} />}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-stamp border border-forest-100 bg-surface shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-forest-100 text-ink/50">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-forest-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
                  <td className="px-4 py-3 text-ink/70">{c.description || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        setForm({ id: c.id, name: c.name, description: c.description || "" });
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="mr-3 text-sm font-medium text-forest-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button onClick={() => setToDelete(c)} className="text-sm font-medium text-brick-500 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-ink/50">
                    No categories yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={!!toDelete}
        title="Delete this category?"
        message={`This will remove "${toDelete?.name}". Pets in this category will become uncategorized.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
