import { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import FormField, { inputClass } from "../../components/common/FormField";
import ErrorMessage from "../../components/common/ErrorMessage";
import { validateFields, isEmail, isRequired } from "../../utils/validators";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);

  const sessionExpired = searchParams.get("sessionExpired");

  const handleChange = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    const fieldErrors = validateFields(values, {
      email: [[isEmail, "Enter a valid email address."]],
      password: [[isRequired, "Password is required."]],
    });
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) return;

    try {
      await login(values);
      const dest = location.state?.from?.pathname || "/dashboard";
      navigate(dest, { replace: true });
    } catch (err) {
      setServerError(err.message || "Invalid email or password.");
    }
  };

  return (
    <div className="mx-auto max-w-md animate-fade-in">
      <h1 className="font-display text-3xl font-semibold text-ink">Welcome back</h1>
      <p className="mt-1 text-sm text-ink/60">Log in to browse pets and manage your adoptions.</p>

      {sessionExpired && (
        <ErrorMessage className="mt-4" message="Your session expired. Please log in again." />
      )}
      {serverError && <ErrorMessage className="mt-4" message={serverError} />}

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
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
        <FormField label="Password" error={errors.password} required>
          <input
            type="password"
            className={inputClass(errors.password)}
            value={values.password}
            onChange={handleChange("password")}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </FormField>

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs font-medium text-forest-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-stamp bg-forest-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-600 disabled:opacity-60 focus-ring"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        Don't have an account?{" "}
        <Link to="/register" className="font-medium text-forest-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
