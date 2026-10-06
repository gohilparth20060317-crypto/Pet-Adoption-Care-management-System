import axiosClient from "./axiosClient";

const STORAGE_KEY = "pms_admin_contact_messages";

export const sendContactMessage = async ({ name, email, message }) => {
  const newMessage = {
    id: Date.now(),
    name,
    email,
    message,
    date: new Date().toISOString(),
    status: "UNREAD",
  };

  // Try posting to server backend endpoints
  try {
    await axiosClient.post("/api/contact", newMessage);
  } catch (err) {
    try {
      await axiosClient.post("/contact", newMessage);
    } catch (e) {
      // Graceful fallback if backend endpoint isn't present
    }
  }

  // Store in local storage for Admin Dashboard access
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const updated = [newMessage, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return newMessage;
};

export const getContactMessages = async () => {
  try {
    const res = await axiosClient.get("/api/contact");
    if (Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch (e) {
    // fallback
  }
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
};

export const markMessageAsRead = async (id) => {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const updated = existing.map((m) => (m.id === id ? { ...m, status: "READ" } : m));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteContactMessage = async (id) => {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const updated = existing.filter((m) => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};
