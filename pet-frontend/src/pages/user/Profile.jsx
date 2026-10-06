import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import * as userApi from "../../api/userApi";
import FormField, { inputClass } from "../../components/common/FormField";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { validateFields, isRequired, isEmail, minLength, maxLength, isValidUsername } from "../../utils/validators";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [values, setValues] = useState({ username: "", email: "", password: "", age: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    userApi
      .getUserById(user.id)
      .then((data) => {
        setProfile(data);
        setValues({ username: data.username || "", email: data.email || "", password: "", age: data.age || "" });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const handleChange = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaved(false);
    const fieldErrors = validateFields(values, {
      username: [
        [isRequired, "Username cannot be blank."],
        [(v) => minLength(v, 3), "Username must be at least 3 characters."],
        [(v) => maxLength(v, 50), "Username cannot exceed 50 characters."],
        [isValidUsername, "Username can only contain letters, numbers, spaces, hyphens, and underscores."],
      ],
      email: [[isEmail, "Enter a valid email address."]],
    });
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) return;

    setSaving(true);
    setError(null);
    try {
      const updated = await userApi.updateUser(user.id, {
        username: values.username,
        email: values.email,
        password: values.password || profile.password,
        age: Number(values.age || 0),
      });
      setProfile(updated);
      setSaved(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user?.id) return <Loader fullscreen label="Loading your profile…" />;
  if (loading) return <Loader fullscreen label="Loading your profile…" />;

  return (
    <div className="mx-auto max-w-md animate-fade-in">
      <h1 className="font-display text-3xl font-semibold text-ink">Your profile</h1>
      <p className="mt-1 text-sm text-ink/60">Keep your contact details up to date.</p>

      {error && <ErrorMessage className="mt-4" message={error} />}
      {saved && (
        <p className="mt-4 rounded-stamp border border-forest-100 bg-forest-50 px-4 py-2 text-sm text-forest-700">
          Profile updated.
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        <FormField label="Full name" error={errors.username} required>
          <input className={inputClass(errors.username)} value={values.username} onChange={handleChange("username")} />
        </FormField>
        <FormField label="Email" error={errors.email} required>
          <input
            type="email"
            className={inputClass(errors.email)}
            value={values.email}
            onChange={handleChange("email")}
          />
        </FormField>
        <FormField label="Age" error={errors.age}>
          <input
            type="number"
            min="1"
            className={inputClass(errors.age)}
            value={values.age}
            onChange={handleChange("age")}
          />
        </FormField>
        <FormField label="New password" hint="Leave blank to keep your current password.">
          <input
            type="password"
            className={inputClass(false)}
            value={values.password}
            onChange={handleChange("password")}
            autoComplete="new-password"
          />
        </FormField>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-stamp bg-forest-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-600 disabled:opacity-60 focus-ring"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
