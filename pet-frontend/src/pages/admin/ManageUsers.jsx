import { useEffect, useState } from "react";
import * as userApi from "../../api/userApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import ConfirmModal from "../../components/common/ConfirmModal";
import StatusStamp from "../../components/common/StatusStamp";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    userApi
      .getAllUsers()
      .then(setUsers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async () => {
    try {
      await userApi.deleteUser(toDelete.id);
      setToDelete(null);
      load();
    } catch (e) {
      setError(e.message);
      setToDelete(null);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Manage users</h1>
        <p className="mt-1 text-sm text-ink/60">Everyone with an account on PetHaven.</p>
      </div>

      {loading && <Loader fullscreen label="Loading users…" />}
      {error && <ErrorMessage message={error} onRetry={load} />}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-stamp border border-forest-100 bg-surface shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-forest-100 text-ink/50">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Age</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-forest-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{u.username}</td>
                  <td className="px-4 py-3 text-ink/70">{u.email}</td>
                  <td className="px-4 py-3 text-ink/70">{u.age ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusStamp status={(u.role || "").replace("ROLE_", "")} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setToDelete(u)} className="text-sm font-medium text-brick-500 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-ink/50">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={!!toDelete}
        title="Delete this user?"
        message={`This will permanently remove ${toDelete?.username || "this user"}'s account.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
