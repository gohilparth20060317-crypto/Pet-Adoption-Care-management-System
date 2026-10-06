import { useEffect, useState } from "react";
import * as petApi from "../../api/petApi";
import * as vaccinationApi from "../../api/vaccinationApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import FormField, { inputClass } from "../../components/common/FormField";
import ConfirmModal from "../../components/common/ConfirmModal";
import VaccinationBadge from "../../components/common/VaccinationBadge";

const emptyLogForm = {
  id: null,
  petId: "",
  petName: "",
  vaccineName: "",
  dateAdministered: new Date().toISOString().split("T")[0],
  nextDueDate: new Date(Date.now() + 86400000 * 365).toISOString().split("T")[0],
  veterinarian: "Dr. Sarah Jenkins",
  status: "Up to date",
  notes: "",
};

export default function ManageVaccinations() {
  const [pets, setPets] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("records"); // "records" | "appointments"
  const [logForm, setLogForm] = useState(emptyLogForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [petsRes, vacsRes, apptsRes] = await Promise.all([
        petApi.getPets(0, 100),
        vaccinationApi.getAllVaccinations(),
        vaccinationApi.getVaccineAppointments(),
      ]);
      setPets(petsRes.content || []);
      setVaccines(vacsRes || []);
      setAppointments(apptsRes || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePetChange = (e) => {
    const pId = e.target.value;
    const petObj = pets.find((p) => String(p.petId) === String(pId));
    setLogForm((f) => ({
      ...f,
      petId: pId,
      petName: petObj?.name || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!logForm.petId || !logForm.vaccineName) {
      setFormError("Pet selection and Vaccine Name are required.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      if (logForm.id) {
        await vaccinationApi.updateVaccinationRecord(logForm.id, logForm);
      } else {
        await vaccinationApi.addVaccinationRecord(logForm);
      }
      setLogForm(emptyLogForm);
      loadData();
    } catch (e) {
      setFormError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (rec) => {
    setLogForm(rec);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await vaccinationApi.deleteVaccinationRecord(toDelete.id);
      setToDelete(null);
      loadData();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleApptStatus = async (apptId, status) => {
    try {
      await vaccinationApi.updateAppointmentStatus(apptId, status);
      loadData();
    } catch (e) {
      alert("Failed to update status: " + e.message);
    }
  };

  if (loading) return <Loader fullscreen label="Loading vaccination records…" />;
  if (error) return <ErrorMessage message={error} onRetry={loadData} />;

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink flex items-center gap-2.5">
          <span>💉</span> Admin - Manage Pet Vaccinations
        </h1>
        <p className="mt-1 text-sm text-ink/60">
          Log immunizations, update pet health records, and process vaccination appointment requests.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-forest-100">
        <button
          onClick={() => setActiveTab("records")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            activeTab === "records"
              ? "border-forest-600 text-forest-700"
              : "border-transparent text-ink/60 hover:text-ink"
          }`}
        >
          📋 Immunization Logs ({vaccines.length})
        </button>
        <button
          onClick={() => setActiveTab("appointments")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            activeTab === "appointments"
              ? "border-forest-600 text-forest-700"
              : "border-transparent text-ink/60 hover:text-ink"
          }`}
        >
          📅 Vaccination Requests ({appointments.length})
        </button>
      </div>

      {activeTab === "records" && (
        <>
          {/* Add / Edit Form */}
          <form onSubmit={handleSubmit} noValidate className="rounded-stamp border border-forest-100 bg-surface p-5 shadow-card space-y-4">
            <h2 className="font-display text-lg font-semibold text-ink">
              {logForm.id ? "Edit Vaccination Log" : "Log New Pet Vaccination"}
            </h2>
            {formError && <ErrorMessage message={formError} />}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FormField label="Select Pet" required>
                <select className={inputClass(false)} value={logForm.petId} onChange={handlePetChange}>
                  <option value="">-- Choose Pet --</option>
                  {pets.map((p) => (
                    <option key={p.petId} value={p.petId}>
                      {p.name} ({p.species})
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Vaccine Name" required>
                <input
                  type="text"
                  placeholder="e.g. Rabies, DHPP, FVRCP"
                  className={inputClass(false)}
                  value={logForm.vaccineName}
                  onChange={(e) => setLogForm({ ...logForm, vaccineName: e.target.value })}
                />
              </FormField>

              <FormField label="Status">
                <select
                  className={inputClass(false)}
                  value={logForm.status}
                  onChange={(e) => setLogForm({ ...logForm, status: e.target.value })}
                >
                  <option value="Up to date">Up to date</option>
                  <option value="Booster Due">Booster Due</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </FormField>

              <FormField label="Date Administered">
                <input
                  type="date"
                  className={inputClass(false)}
                  value={logForm.dateAdministered}
                  onChange={(e) => setLogForm({ ...logForm, dateAdministered: e.target.value })}
                />
              </FormField>

              <FormField label="Next Due Date">
                <input
                  type="date"
                  className={inputClass(false)}
                  value={logForm.nextDueDate}
                  onChange={(e) => setLogForm({ ...logForm, nextDueDate: e.target.value })}
                />
              </FormField>

              <FormField label="Veterinarian / Clinic">
                <input
                  type="text"
                  className={inputClass(false)}
                  value={logForm.veterinarian}
                  onChange={(e) => setLogForm({ ...logForm, veterinarian: e.target.value })}
                />
              </FormField>
            </div>

            <FormField label="Notes">
              <input
                type="text"
                placeholder="Batch number or clinic observations"
                className={inputClass(false)}
                value={logForm.notes}
                onChange={(e) => setLogForm({ ...logForm, notes: e.target.value })}
              />
            </FormField>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-stamp bg-forest-500 px-5 py-2 text-sm font-semibold text-white hover:bg-forest-600 disabled:opacity-60"
              >
                {saving ? "Saving…" : logForm.id ? "Save Record Changes" : "Log Vaccination"}
              </button>
              {logForm.id && (
                <button
                  type="button"
                  onClick={() => setLogForm(emptyLogForm)}
                  className="rounded-stamp border border-forest-100 px-5 py-2 text-sm font-medium text-ink/70 hover:bg-paper"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Table of Vaccination Records */}
          <div className="overflow-x-auto rounded-stamp border border-forest-100 bg-surface shadow-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-forest-100 text-ink/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Pet Name</th>
                  <th className="px-4 py-3 font-medium">Vaccine Name</th>
                  <th className="px-4 py-3 font-medium">Date Administered</th>
                  <th className="px-4 py-3 font-medium">Next Booster Due</th>
                  <th className="px-4 py-3 font-medium">Veterinarian</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-50">
                {vaccines.map((v) => (
                  <tr key={v.id}>
                    <td className="px-4 py-3 font-semibold text-ink">{v.petName || "Pet #" + v.petId}</td>
                    <td className="px-4 py-3 font-medium text-ink">{v.vaccineName}</td>
                    <td className="px-4 py-3 font-mono text-xs text-ink/70">{v.dateAdministered || "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs text-ink/70">{v.nextDueDate || "—"}</td>
                    <td className="px-4 py-3 text-ink/70">{v.veterinarian || "—"}</td>
                    <td className="px-4 py-3">
                      <VaccinationBadge status={v.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEdit(v)} className="mr-3 text-sm font-medium text-forest-600 hover:underline">
                        Edit
                      </button>
                      <button onClick={() => setToDelete(v)} className="text-sm font-medium text-brick-500 hover:underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {vaccines.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-ink/50">
                      No vaccination logs recorded yet. Add your first log above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === "appointments" && (
        <div className="overflow-x-auto rounded-stamp border border-forest-100 bg-surface shadow-card p-5 space-y-4">
          <h2 className="font-display text-lg font-semibold text-ink">User Vaccination Appointment Requests</h2>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-forest-100 text-xs text-ink/50 font-semibold uppercase">
              <tr>
                <th className="py-2.5 px-3">Pet & User</th>
                <th className="py-2.5 px-3">Vaccine</th>
                <th className="py-2.5 px-3">Preferred Time</th>
                <th className="py-2.5 px-3">Clinic / Notes</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-50">
              {appointments.map((app) => (
                <tr key={app.id}>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-ink">{app.petName || "Pet #" + app.petId}</div>
                    <div className="text-xs text-ink/60">Requested by: {app.userName || "User #" + app.userId}</div>
                  </td>
                  <td className="py-3 px-3 text-ink/80 font-medium">{app.vaccineType}</td>
                  <td className="py-3 px-3 font-mono text-xs text-ink/70">
                    {app.preferredDate} at {app.preferredTime}
                  </td>
                  <td className="py-3 px-3 text-ink/70 text-xs">
                    <div>{app.clinic}</div>
                    {app.notes && <div className="italic text-ink/50">"{app.notes}"</div>}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        app.status === "Completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : app.status === "Cancelled"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-sky-100 text-sky-800"
                      }`}
                    >
                      {app.status || "Scheduled"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    {app.status !== "Completed" && (
                      <button
                        onClick={() => handleApptStatus(app.id, "Completed")}
                        className="mr-2 text-xs font-semibold rounded bg-emerald-600 px-2.5 py-1 text-white hover:bg-emerald-700"
                      >
                        Complete
                      </button>
                    )}
                    {app.status !== "Cancelled" && (
                      <button
                        onClick={() => handleApptStatus(app.id, "Cancelled")}
                        className="text-xs font-semibold rounded bg-stone-200 px-2.5 py-1 text-stone-700 hover:bg-stone-300"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-ink/50">
                    No appointment requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={!!toDelete}
        title="Delete Vaccination Log?"
        message={`Remove log for ${toDelete?.vaccineName} (${toDelete?.petName})?`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
