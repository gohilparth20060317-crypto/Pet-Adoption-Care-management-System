import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import FormField, { inputClass } from "../../components/common/FormField";
import ErrorMessage from "../../components/common/ErrorMessage";
import { validateFields, isEmail, isRequired, minLength, maxLength, isValidUsername } from "../../utils/validators";

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", email: "", password: "", age: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    const fieldErrors = validateFields(values, {
      username: [
        [isRequired, "Username cannot be blank."],
        [(v) => minLength(v, 3), "Username must be at least 3 characters."],
        [(v) => maxLength(v, 50), "Username cannot exceed 50 characters."],
        [isValidUsername, "Username can only contain letters, numbers, spaces, hyphens, and underscores."],
      ],
      email: [[isEmail, "Enter a valid email address."]],
      password: [
        [(v) => minLength(v, 10), "Password must be between 10 and 50 characters."],
        [(v) => (v || "").length <= 50, "Password must be between 10 and 50 characters."],
      ],
      age: [[(v) => v === "" || Number(v) > 0, "Enter a valid age."]],
    });
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) return;

    try {
      await register({ ...values, age: Number(values.age || 0) });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setServerError(err.message || "Registration failed. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-md animate-fade-in rounded-stamp border border-forest-100 bg-surface p-8 text-center shadow-card">
        <span className="stamp text-forest-600">Account created</span>
        <h1 className="mt-4 font-display text-2xl font-semibold text-ink">Check your email</h1>
        <p className="mt-2 text-sm text-ink/60">
          We've sent a verification link to <strong>{values.email}</strong>. Verify your email before
          logging in. Redirecting you to the login page…
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md animate-fade-in">
      <h1 className="font-display text-3xl font-semibold text-ink">Create an account</h1>
      <p className="mt-1 text-sm text-ink/60">Sign up to browse pets and request adoptions.</p>

      {serverError && <ErrorMessage className="mt-4" message={serverError} />}

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        <FormField label="Username / Full name" error={errors.username} hint="3–50 characters." required>
          <input
            className={inputClass(errors.username)}
            value={values.username}
            onChange={handleChange("username")}
            placeholder="Jamie Rivera"
            autoComplete="name"
          />
        </FormField>
        <FormField label="Email" error={errors.email} required>
          <input
            type="email"
            className={inputClass(errors.email)}
            value={values.email}
            onChange={handleChange("email")}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </FormField>
        <FormField label="Password" error={errors.password} hint="10–50 characters." required>
          <input
            type="password"
            className={inputClass(errors.password)}
            value={values.password}
            onChange={handleChange("password")}
            placeholder="••••••••••"
            autoComplete="new-password"
          />
        </FormField>
        <FormField label="Age" error={errors.age}>
          <input
            type="number"
            min="1"
            className={inputClass(errors.age)}
            value={values.age}
            onChange={handleChange("age")}
            placeholder="28"
          />
        </FormField>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-stamp bg-forest-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-600 disabled:opacity-60 focus-ring"
        >
          {loading ? "Creating account…" : "Sign up"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-forest-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
