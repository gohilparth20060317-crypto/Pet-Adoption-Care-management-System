import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import FormField, { inputClass } from "../../components/common/FormField";
import ErrorMessage from "../../components/common/ErrorMessage";
import { validateFields, minLength, maxLength } from "../../utils/validators";
import { resetPassword } from "../../api/authApi";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "demo_token";
  const targetEmail = searchParams.get("email") || "";
  const navigate = useNavigate();

  const [values, setValues] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    const fieldErrors = validateFields(values, {
      password: [
        [(v) => minLength(v, 10), "Password must be between 10 and 50 characters."],
        [(v) => maxLength(v, 50), "Password must be between 10 and 50 characters."],
      ],
      confirmPassword: [
        [(v) => v === values.password, "Passwords do not match."],
      ],
    });
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) return;

    setLoading(true);
    try {
      await resetPassword({ token, email: targetEmail, newPassword: values.password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setServerError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-md animate-fade-in rounded-stamp border border-forest-100 bg-surface p-8 text-center shadow-card space-y-3">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-forest-50 text-forest-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-semibold text-ink">Password Reset Complete</h1>
        <p className="text-sm text-ink/70">
          Your password has been successfully updated! Redirecting you to the login page…
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md animate-fade-in">
      <h1 className="font-display text-3xl font-semibold text-ink">Reset Your Password</h1>
      <p className="mt-1 text-sm text-ink/60">
        {targetEmail ? `Set a new password for ${targetEmail}` : "Enter a new password for your account."}
      </p>

      {serverError && <ErrorMessage className="mt-4" message={serverError} />}

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        <FormField label="New Password" error={errors.password} hint="10–50 characters." required>
          <input
            type="password"
            className={inputClass(errors.password)}
            value={values.password}
            onChange={handleChange("password")}
            placeholder="••••••••••"
            autoComplete="new-password"
          />
        </FormField>
        <FormField label="Confirm New Password" error={errors.confirmPassword} required>
          <input
            type="password"
            className={inputClass(errors.confirmPassword)}
            value={values.confirmPassword}
            onChange={handleChange("confirmPassword")}
            placeholder="••••••••••"
            autoComplete="new-password"
          />
        </FormField>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-stamp bg-forest-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-600 disabled:opacity-60 focus-ring"
        >
          {loading ? "Updating password…" : "Reset Password"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        <Link to="/login" className="font-medium text-forest-600 hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
