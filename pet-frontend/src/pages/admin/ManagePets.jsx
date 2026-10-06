import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as petApi from "../../api/petApi";
import * as categoryApi from "../../api/categoryApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import Pagination from "../../components/common/Pagination";
import ConfirmModal from "../../components/common/ConfirmModal";
import ImageUpload from "../../components/common/ImageUpload";
import FormField, { inputClass } from "../../components/common/FormField";
import VaccinationBadge from "../../components/common/VaccinationBadge";
import { validateFields, isRequired, isPositiveNumber } from "../../utils/validators";
import { resolveImageUrl, getSpeciesImage } from "../../utils/imageUrl";

const emptyForm = { petId: null, name: "", species: "", age: "", price: "", categoryId: "", vaccinationStatus: "Fully Vaccinated" };

export default function ManagePets() {
  const [page, setPage] = useState(0);
  const [data, setData] = useState({ content: [], totalPages: 0 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    Promise.all([petApi.getPets(page, 8), categoryApi.getCategories()])
      .then(([petsPage, cats]) => {
        setData(petsPage);
        setCategories(cats);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const startEdit = (pet) => {
    setForm({
      petId: pet.petId,
      name: pet.name,
      species: pet.species,
      age: pet.age,
      price: pet.price,
      categoryId: pet.category?.id || "",
      vaccinationStatus: pet.vaccinationStatus || (pet.isVaccinated === false ? "Not Vaccinated" : "Fully Vaccinated"),
    });
    setImageFile(null);
    setFormError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setImageFile(null);
    setErrors({});
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = validateFields(form, {
      name: [[isRequired, "Name is required."]],
      species: [[isRequired, "Species is required."]],
      age: [[isPositiveNumber, "Enter a valid age."]],
      price: [[isPositiveNumber, "Enter a valid price."]],
    });
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) return;

    setSaving(true);
    setFormError(null);
    try {
      const payload = {
        name: form.name,
        species: form.species,
        age: Number(form.age),
        price: Number(form.price),
        category: form.categoryId ? { id: Number(form.categoryId) } : null,
        vaccinationStatus: form.vaccinationStatus,
        isVaccinated: form.vaccinationStatus !== "Not Vaccinated",
      };

      let saved;
      if (form.petId) {
        saved = await petApi.updatePet(form.petId, payload);
      } else {
        saved = await petApi.addPet(payload);
      }

      if (imageFile && saved?.petId) {
        await petApi.uploadPetImage(saved.petId, imageFile);
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
      await petApi.deletePet(toDelete.petId);
      setToDelete(null);
      load();
    } catch (e) {
      setError(e.message);
      setToDelete(null);
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Manage pets</h1>
          <p className="mt-1 text-sm text-ink/60">Add new pets, update health records, and manage listings.</p>
        </div>
        <Link
          to="/admin/vaccinations"
          className="rounded-stamp border border-forest-500 bg-forest-50 px-4 py-2 text-sm font-semibold text-forest-700 hover:bg-forest-100 focus-ring"
        >
          💉 Manage Vaccine Records
        </Link>
      </div>

      <form onSubmit={handleSubmit} noValidate className="rounded-stamp border border-forest-100 bg-surface p-5 shadow-card">
        <h2 className="font-display text-lg font-semibold text-ink">{form.petId ? "Edit pet" : "Add a pet"}</h2>
        {formError && <ErrorMessage className="mt-3" message={formError} />}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <FormField label="Name" error={errors.name} required>
            <input className={inputClass(errors.name)} value={form.name} onChange={handleChange("name")} />
          </FormField>
          <FormField label="Species" error={errors.species} required>
            <input className={inputClass(errors.species)} value={form.species} onChange={handleChange("species")} />
          </FormField>
          <FormField label="Age (years)" error={errors.age} required>
            <input type="number" min="0" className={inputClass(errors.age)} value={form.age} onChange={handleChange("age")} />
          </FormField>
          <FormField label="Price (Rs)" error={errors.price} required>
            <input type="number" min="0" className={inputClass(errors.price)} value={form.price} onChange={handleChange("price")} />
          </FormField>
          <FormField label="Category">
            <select className={inputClass(false)} value={form.categoryId} onChange={handleChange("categoryId")}>
              <option value="">Uncategorized</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Vaccination Status">
            <select className={inputClass(false)} value={form.vaccinationStatus} onChange={handleChange("vaccinationStatus")}>
              <option value="Fully Vaccinated">Fully Vaccinated</option>
              <option value="Partially Vaccinated">Partially Vaccinated</option>
              <option value="Not Vaccinated">Not Vaccinated</option>
            </select>
          </FormField>
        </div>

        <div className="mt-4">
          <span className="mb-1 block text-sm font-medium text-ink">Photo</span>
          <ImageUpload onFileSelected={setImageFile} resolveUrl={resolveImageUrl} />
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-stamp bg-forest-500 px-5 py-2 text-sm font-semibold text-white hover:bg-forest-600 disabled:opacity-60 focus-ring"
          >
            {saving ? "Saving…" : form.petId ? "Save changes" : "Add pet"}
          </button>
          {form.petId && (
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

      {loading && <Loader fullscreen label="Loading pets…" />}
      {error && <ErrorMessage message={error} onRetry={load} />}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto rounded-stamp border border-forest-100 bg-surface shadow-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-forest-100 text-ink/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Photo</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Species</th>
                  <th className="px-4 py-3 font-medium">Age</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Vaccination</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.content.map((pet) => (
                  <tr key={pet.petId} className="border-b border-forest-100 last:border-0">
                    <td className="px-4 py-3">
                      <img
                        src={resolveImageUrl(pet.imageUrl, pet.species, pet.name || pet.petId)}
                        alt={pet.name}
                        className="h-10 w-10 rounded-stamp object-cover"
                        onError={(e) => {
                          e.currentTarget.src = getSpeciesImage(pet.species, pet.name || pet.petId);
                        }}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-ink">{pet.name}</td>
                    <td className="px-4 py-3 text-ink/70">{pet.species}</td>
                    <td className="px-4 py-3 text-ink/70">{pet.age}</td>
                    <td className="px-4 py-3 font-mono text-ink/70">Rs {Number(pet.price || 0).toFixed(0)}</td>
                    <td className="px-4 py-3 text-ink/70">{pet.category?.name || "—"}</td>
                    <td className="px-4 py-3">
                      <VaccinationBadge status={pet.vaccinationStatus || (pet.isVaccinated === false ? "Not Vaccinated" : "Fully Vaccinated")} />
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button onClick={() => startEdit(pet)} className="mr-3 text-sm font-medium text-forest-600 hover:underline">
                        Edit
                      </button>
                      <button onClick={() => setToDelete(pet)} className="text-sm font-medium text-brick-500 hover:underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {data.content.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-ink/50">
                      No pets yet. Add your first one above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={data.totalPages || 0} onPageChange={setPage} />
        </>
      )}

      <ConfirmModal
        open={!!toDelete}
        title="Delete this pet?"
        message={`This will permanently remove ${toDelete?.name || "this pet"} from the listing.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
