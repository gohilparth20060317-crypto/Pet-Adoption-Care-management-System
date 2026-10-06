import axiosClient from "./axiosClient";

const VACCINATIONS_KEY = "pms_vaccinations";
const APPOINTMENTS_KEY = "pms_vaccine_appointments";

// Helper for local initial mock records
const getStoredVaccinations = () => {
  try {
    const data = localStorage.getItem(VACCINATIONS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Error reading stored vaccinations", e);
  }
  // Default mock dataset for smooth out-of-box presentation
  const initial = [
    {
      id: 1,
      petId: 1,
      petName: "Max",
      vaccineName: "Rabies Vaccine",
      dateAdministered: "2026-01-15",
      nextDueDate: "2027-01-15",
      veterinarian: "Dr. Sarah Jenkins",
      status: "Up to date",
      notes: "Annual rabies vaccination completed cleanly.",
    },
    {
      id: 2,
      petId: 1,
      petName: "Max",
      vaccineName: "DHPP (Distemper, Hepatitis, Parvovirus)",
      dateAdministered: "2025-11-10",
      nextDueDate: "2026-11-10",
      veterinarian: "Dr. Sarah Jenkins",
      status: "Up to date",
      notes: "Core booster administered.",
    },
    {
      id: 3,
      petId: 2,
      petName: "Luna",
      vaccineName: "FVRCP (Feline Viral Rhinotracheitis)",
      dateAdministered: "2026-03-01",
      nextDueDate: "2027-03-01",
      veterinarian: "Dr. Mark Thorne",
      status: "Up to date",
      notes: "Cat booster shot given.",
    },
  ];
  localStorage.setItem(VACCINATIONS_KEY, JSON.stringify(initial));
  return initial;
};

const getStoredAppointments = () => {
  try {
    const data = localStorage.getItem(APPOINTMENTS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Error reading stored appointments", e);
  }
  const initial = [
    {
      id: 101,
      petId: 1,
      petName: "Max",
      userId: 1,
      userName: "John Doe",
      vaccineType: "Bordetella (Kennel Cough)",
      preferredDate: "2026-08-10",
      preferredTime: "10:30 AM",
      clinic: "City Vet Hospital",
      notes: "Need booster before boarding next month.",
      status: "Scheduled",
      createdAt: "2026-07-28",
    },
  ];
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(initial));
  return initial;
};

// GET vaccinations for pet
export const getVaccinationsByPetId = async (petId) => {
  try {
    const response = await axiosClient.get(`/api/vaccinations/pet/${petId}`);
    return response.data;
  } catch (e) {
    // Fallback to local storage dataset
    const all = getStoredVaccinations();
    return all.filter((v) => String(v.petId) === String(petId));
  }
};

// GET all vaccinations for Admin
export const getAllVaccinations = async () => {
  try {
    const response = await axiosClient.get("/api/vaccinations");
    return response.data;
  } catch (e) {
    return getStoredVaccinations();
  }
};

// POST add vaccination record
export const addVaccinationRecord = async (record) => {
  try {
    const response = await axiosClient.post("/api/vaccinations", record);
    return response.data;
  } catch (e) {
    const all = getStoredVaccinations();
    const newRecord = {
      ...record,
      id: Date.now(),
      status: record.status || "Up to date",
    };
    const updated = [newRecord, ...all];
    localStorage.setItem(VACCINATIONS_KEY, JSON.stringify(updated));
    return newRecord;
  }
};

// PUT update vaccination record
export const updateVaccinationRecord = async (id, record) => {
  try {
    const response = await axiosClient.put(`/api/vaccinations/${id}`, record);
    return response.data;
  } catch (e) {
    const all = getStoredVaccinations();
    const index = all.findIndex((v) => String(v.id) === String(id));
    if (index !== -1) {
      all[index] = { ...all[index], ...record };
      localStorage.setItem(VACCINATIONS_KEY, JSON.stringify(all));
      return all[index];
    }
    return record;
  }
};

// DELETE vaccination record
export const deleteVaccinationRecord = async (id) => {
  try {
    const response = await axiosClient.delete(`/api/vaccinations/${id}`);
    return response.data;
  } catch (e) {
    const all = getStoredVaccinations();
    const filtered = all.filter((v) => String(v.id) !== String(id));
    localStorage.setItem(VACCINATIONS_KEY, JSON.stringify(filtered));
    return { success: true };
  }
};

// GET user vaccine appointments
export const getVaccineAppointments = async (userId) => {
  try {
    const response = await axiosClient.get(`/api/vaccinations/appointments`, {
      params: { userId },
    });
    return response.data;
  } catch (e) {
    const all = getStoredAppointments();
    if (userId) {
      return all.filter((a) => String(a.userId) === String(userId));
    }
    return all;
  }
};

// POST schedule vaccination appointment
export const scheduleVaccineAppointment = async (appointmentData) => {
  try {
    const response = await axiosClient.post("/api/vaccinations/appointments", appointmentData);
    return response.data;
  } catch (e) {
    const all = getStoredAppointments();
    const newAppointment = {
      ...appointmentData,
      id: Date.now(),
      status: "Scheduled",
      createdAt: new Date().toISOString().split("T")[0],
    };
    const updated = [newAppointment, ...all];
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
    return newAppointment;
  }
};

// PUT update appointment status (Admin)
export const updateAppointmentStatus = async (id, status) => {
  try {
    const response = await axiosClient.put(`/api/vaccinations/appointments/${id}/status`, null, {
      params: { status },
    });
    return response.data;
  } catch (e) {
    const all = getStoredAppointments();
    const index = all.findIndex((a) => String(a.id) === String(id));
    if (index !== -1) {
      all[index].status = status;
      localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(all));
      return all[index];
    }
    return { id, status };
  }
};
