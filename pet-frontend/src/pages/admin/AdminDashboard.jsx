import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import * as petApi from "../../api/petApi";
import * as categoryApi from "../../api/categoryApi";
import * as userApi from "../../api/userApi";
import { getAllAdoptionRequests } from "../../api/adminAggregateApi";
import { getContactMessages, markMessageAsRead, deleteContactMessage } from "../../api/contactApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

const STATUS_COLORS = { PENDING: "#E8A33D", APPROVED: "#3D6E5D", REJECTED: "#C4574A" };

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ pets: 0, categories: 0, users: 0 });
  const [statusBreakdown, setStatusBreakdown] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [messages, setMessages] = useState([]);

  const loadData = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      petApi.getPets(0, 1),
      categoryApi.getCategories(),
      userApi.getAllUsers(),
      getAllAdoptionRequests(),
      petApi.getPets(0, 200),
      getContactMessages(),
    ])
      .then(([petsPage, categories, users, adoptions, petsSample, contactMsgs]) => {
        setStats({
          pets: petsPage.totalElements ?? petsSample.content.length,
          categories: categories.length,
          users: users.length,
        });
        setMessages(contactMsgs || []);

        const byStatus = {};
        adoptions.forEach((a) => {
          const key = (a.status || "UNKNOWN").toUpperCase();
          byStatus[key] = (byStatus[key] || 0) + 1;
        });
        setStatusBreakdown(Object.entries(byStatus).map(([name, value]) => ({ name, value })));

        const byCategory = {};
        petsSample.content.forEach((p) => {
          const key = p.category?.name || "Uncategorized";
          byCategory[key] = (byCategory[key] || 0) + 1;
        });
        setCategoryBreakdown(Object.entries(byCategory).map(([name, count]) => ({ name, count })));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkRead = async (id) => {
    const updated = await markMessageAsRead(id);
    setMessages(updated);
  };

  const handleDeleteMessage = async (id) => {
    const updated = await deleteContactMessage(id);
    setMessages(updated);
  };

  const unreadCount = messages.filter((m) => m.status === "UNREAD").length;

  if (loading) return <Loader fullscreen label="Loading dashboard…" />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Admin dashboard</h1>
        <p className="mt-1 text-sm text-ink/60">A snapshot of pets, people, messages, and adoptions.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          ["Total pets", stats.pets],
          ["Categories", stats.categories],
          ["Registered users", stats.users],
          ["User messages", `${messages.length} (${unreadCount} new)`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-stamp border border-forest-100 bg-surface p-5 shadow-card">
            <p className="font-display text-3xl font-semibold text-forest-600">{value}</p>
            <p className="mt-1 text-sm text-ink/60">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-stamp border border-forest-100 bg-surface p-5 shadow-card">
          <h2 className="font-display text-lg font-semibold text-ink">Adoption requests by status</h2>
          {statusBreakdown.length === 0 ? (
            <p className="mt-6 text-sm text-ink/50">No adoption requests yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={statusBreakdown} dataKey="value" nameKey="name" outerRadius={90} label>
                  {statusBreakdown.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#7FA089"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-stamp border border-forest-100 bg-surface p-5 shadow-card">
          <h2 className="font-display text-lg font-semibold text-ink">Pets by category</h2>
          {categoryBreakdown.length === 0 ? (
            <p className="mt-6 text-sm text-ink/50">No pets have been added yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categoryBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAF0EC" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3D6E5D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Received Messages Section */}
      <div className="rounded-stamp border border-forest-100 bg-surface p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">Messages Sent to Admin</h2>
            <p className="text-xs text-ink/60">Contact form submissions from users</p>
          </div>
          {unreadCount > 0 && (
            <span className="rounded-full bg-brick-500 px-3 py-1 text-xs font-semibold text-white">
              {unreadCount} Unread
            </span>
          )}
        </div>

        {messages.length === 0 ? (
          <p className="text-sm text-ink/50 py-4">No contact messages received yet.</p>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`rounded-stamp border p-4 transition ${
                  m.status === "UNREAD" ? "border-forest-500 bg-forest-50/40" : "border-forest-100 bg-surface"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-sm text-ink">
                      {m.name} <span className="font-normal text-ink/60">({m.email})</span>
                    </h3>
                    <p className="text-xs text-ink/40">{new Date(m.date).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {m.status === "UNREAD" && (
                      <button
                        onClick={() => handleMarkRead(m.id)}
                        className="rounded-stamp border border-forest-500 px-2.5 py-1 text-xs font-medium text-forest-600 hover:bg-forest-50"
                      >
                        Mark read
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteMessage(m.id)}
                      className="text-xs font-medium text-brick-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-sm text-ink/80 whitespace-pre-wrap bg-paper/60 p-3 rounded-stamp border border-forest-100/50">
                  {m.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

