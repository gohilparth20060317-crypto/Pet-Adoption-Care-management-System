import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import * as petApi from "../../api/petApi";
import * as vaccinationApi from "../../api/vaccinationApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import VaccinationBadge from "../../components/common/VaccinationBadge";
import FormField, { inputClass } from "../../components/common/FormField";

export default function Vaccinations() {
  const { user } = useAuth();
  const location = useLocation();

  const [pets, setPets] = useState([]);
  const [vaccineLogs, setVaccineLogs] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("passports"); // "passports" | "appointments"
  const [showModal, setShowModal] = useState(false);

  // Appointment Form
  const [bookingForm, setBookingForm] = useState({
    petId: "",
    vaccineType: "Rabies Vaccine",
    preferredDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
    preferredTime: "10:00 AM",
    clinic: "Central City Pet Hospital",
    notes: "",
  });
  const [bookingSaving, setBookingSaving] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [petsRes, allLogs, userAppts] = await Promise.all([
        petApi.getPets(0, 50),
        vaccinationApi.getAllVaccinations(),
        vaccinationApi.getVaccineAppointments(user?.id),
      ]);
      setPets(petsRes.content || []);
      setVaccineLogs(allLogs || []);
      setAppointments(userAppts || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (location.state?.openModal) {
      if (location.state?.selectedPetId) {
        setBookingForm((f) => ({ ...f, petId: String(location.state.selectedPetId) }));
      }
      setShowModal(true);
    }
  }, [location.state]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingForm.petId) {
      setBookingError("Please select a pet.");
      return;
    }
    setBookingSaving(true);
    setBookingError(null);
    setBookingSuccess(null);

    const selectedPetObj = pets.find((p) => String(p.petId) === String(bookingForm.petId));
    try {
      await vaccinationApi.scheduleVaccineAppointment({
        ...bookingForm,
        petId: Number(bookingForm.petId),
        petName: selectedPetObj?.name || "Pet #" + bookingForm.petId,
        userId: user?.id || 1,
        userName: user?.username || user?.email || "Pet Owner",
      });
      setBookingSuccess("Vaccination appointment requested successfully!");
      setBookingForm({
        petId: "",
        vaccineType: "Rabies Vaccine",
        preferredDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
        preferredTime: "10:00 AM",
        clinic: "Central City Pet Hospital",
        notes: "",
      });
      loadData();
      setTimeout(() => setShowModal(false), 1500);
    } catch (err) {
      setBookingError(err.message);
    } finally {
      setBookingSaving(false);
    }
  };

  if (loading) return <Loader fullscreen label="Loading vaccination tracker…" />;
  if (error) return <ErrorMessage message={error} onRetry={loadData} />;

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-forest-100 pb-5">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink flex items-center gap-2.5">
            <span>💉</span> Pet Vaccination Hub
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            Track pet immunization passports, booster schedules, and book vaccination appointments.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-stamp bg-forest-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-forest-600 focus-ring shadow-sm transition"
        >
          + Book Vaccination Appointment
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-forest-100">
        <button
          onClick={() => setActiveTab("passports")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            activeTab === "passports"
              ? "border-forest-600 text-forest-700"
              : "border-transparent text-ink/60 hover:text-ink"
          }`}
        >
          🐾 Health Passports & Records ({pets.length})
        </button>
        <button
          onClick={() => setActiveTab("appointments")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            activeTab === "appointments"
              ? "border-forest-600 text-forest-700"
              : "border-transparent text-ink/60 hover:text-ink"
          }`}
        >
          📅 Scheduled Appointments ({appointments.length})
        </button>
      </div>

      {/* TAB 1: Passports & Pet Records */}
      {activeTab === "passports" && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => {
            const petVaccines = vaccineLogs.filter((v) => String(v.petId) === String(pet.petId));
            const isVac = pet.isVaccinated ?? pet.vaccinated ?? (petVaccines.length > 0);
            const statusStr = pet.vaccinationStatus || (isVac ? "Fully Vaccinated" : "Not Vaccinated");

            return (
              <div
                key={pet.petId}
                className="rounded-stamp border border-forest-100 bg-surface p-5 shadow-card space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display text-xl font-semibold text-ink">{pet.name}</h3>
                      <p className="text-xs text-ink/60">{pet.species} · {pet.age} yrs old</p>
                    </div>
                    <VaccinationBadge status={statusStr} isVaccinated={isVac} />
                  </div>

                  <div className="mt-4 border-t border-forest-100 pt-3 space-y-2">
                    <h4 className="text-xs font-semibold uppercase text-ink/50">Administered Vaccines</h4>
                    {petVaccines.length === 0 ? (
                      <p className="text-xs text-ink/50 italic">No specific vaccine logs logged yet.</p>
                    ) : (
                      <ul className="space-y-1.5 text-xs text-ink/80">
                        {petVaccines.map((v) => (
                          <li key={v.id} className="flex justify-between items-center bg-forest-50/50 p-2 rounded">
                            <span className="font-medium">{v.vaccineName}</span>
                            <span className="text-forest-600 font-mono">{v.nextDueDate ? `Due ${v.nextDueDate}` : "Done"}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-forest-100 flex gap-2">
                  <button
                    onClick={() => {
                      setBookingForm((f) => ({ ...f, petId: String(pet.petId) }));
                      setShowModal(true);
                    }}
                    className="w-full rounded-stamp border border-forest-500 py-1.5 text-xs font-semibold text-forest-600 hover:bg-forest-50 focus-ring text-center"
                  >
                    Request Vaccine
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: Appointments */}
      {activeTab === "appointments" && (
        <div className="rounded-stamp border border-forest-100 bg-surface p-5 shadow-card">
          <h2 className="font-display text-lg font-semibold text-ink mb-4">Your Vaccination Appointments</h2>
          {appointments.length === 0 ? (
            <p className="text-sm text-ink/50 py-6 text-center">No upcoming vaccination appointments scheduled yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-forest-100 text-xs text-ink/50 font-semibold uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Pet</th>
                    <th className="py-2.5 px-3">Vaccine</th>
                    <th className="py-2.5 px-3">Preferred Date & Time</th>
                    <th className="py-2.5 px-3">Clinic</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-50">
                  {appointments.map((app) => (
                    <tr key={app.id}>
                      <td className="py-3 px-3 font-semibold text-ink">{app.petName || "Pet #" + app.petId}</td>
                      <td className="py-3 px-3 text-ink/80">{app.vaccineType}</td>
                      <td className="py-3 px-3 font-mono text-xs text-ink/70">
                        {app.preferredDate} at {app.preferredTime}
                      </td>
                      <td className="py-3 px-3 text-ink/70">{app.clinic || "Vet Hospital"}</td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal for Booking Appointment */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-stamp border border-forest-100 bg-surface p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-forest-100 pb-3">
              <h3 className="font-display text-xl font-semibold text-ink flex items-center gap-2">
                <span>💉</span> Book Vaccination Appointment
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-ink/40 hover:text-ink text-xl font-bold px-2"
              >
                &times;
              </button>
            </div>

            {bookingSuccess && (
              <p className="rounded-stamp border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                {bookingSuccess}
              </p>
            )}
            {bookingError && <ErrorMessage message={bookingError} />}

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-sm">
              <FormField label="Select Pet" required>
                <select
                  className={inputClass(false)}
                  value={bookingForm.petId}
                  onChange={(e) => setBookingForm({ ...bookingForm, petId: e.target.value })}
                >
                  <option value="">-- Select Pet --</option>
                  {pets.map((p) => (
                    <option key={p.petId} value={p.petId}>
                      {p.name} ({p.species})
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Vaccine Type" required>
                <select
                  className={inputClass(false)}
                  value={bookingForm.vaccineType}
                  onChange={(e) => setBookingForm({ ...bookingForm, vaccineType: e.target.value })}
                >
                  <option value="Rabies Vaccine">Rabies Vaccine</option>
                  <option value="DHPP (Distemper/Parvo)">DHPP (Distemper/Parvo)</option>
                  <option value="FVRCP (Feline Core Vaccine)">FVRCP (Feline Core Vaccine)</option>
                  <option value="Bordetella (Kennel Cough)">Bordetella (Kennel Cough)</option>
                  <option value="Lyme Disease Vaccine">Lyme Disease Vaccine</option>
                  <option value="General Health Check & Booster">General Health Check & Booster</option>
                </select>
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Preferred Date" required>
                  <input
                    type="date"
                    className={inputClass(false)}
                    value={bookingForm.preferredDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, preferredDate: e.target.value })}
                  />
                </FormField>

                <FormField label="Preferred Time" required>
                  <select
                    className={inputClass(false)}
                    value={bookingForm.preferredTime}
                    onChange={(e) => setBookingForm({ ...bookingForm, preferredTime: e.target.value })}
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                  </select>
                </FormField>
              </div>

              <FormField label="Clinic / Veterinary Center">
                <input
                  type="text"
                  className={inputClass(false)}
                  value={bookingForm.clinic}
                  onChange={(e) => setBookingForm({ ...bookingForm, clinic: e.target.value })}
                />
              </FormField>

              <FormField label="Additional Notes or Medical History">
                <textarea
                  rows={2}
                  className={inputClass(false)}
                  value={bookingForm.notes}
                  placeholder="e.g. Needs gentle handling, allergic to penicillin..."
                  onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                />
              </FormField>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-stamp border border-forest-100 px-4 py-2 text-sm font-medium text-ink/70 hover:bg-paper"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingSaving}
                  className="rounded-stamp bg-forest-500 px-5 py-2 text-sm font-semibold text-white hover:bg-forest-600 disabled:opacity-60"
                >
                  {bookingSaving ? "Submitting…" : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
