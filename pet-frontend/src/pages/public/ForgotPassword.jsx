import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormField, { inputClass } from "../../components/common/FormField";
import ErrorMessage from "../../components/common/ErrorMessage";
import { validateFields, isEmail } from "../../utils/validators";
import { forgotPassword } from "../../api/authApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [serverError, setServerError] = useState(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    const errs = validateFields({ email }, { email: [[isEmail, "Enter a valid email address."]] });
    setError(errs.email || null);
    if (errs.email) return;

    setLoading(true);
    try {
      await forgotPassword(email);
      const token = Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
      setResetToken(token);
      setSent(true);
    } catch (err) {
      setServerError(err.message || "Failed to request password reset. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetUrl = `${window.location.origin}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
  const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent("PetHaven Password Reset Link")}&body=${encodeURIComponent(
    `Hello,\n\nYou requested a password reset for your PetHaven account.\n\nPlease click the link below to reset your password:\n${resetUrl}\n\nIf you did not request this, please ignore this email.`
  )}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(resetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="mx-auto max-w-md animate-fade-in">
      <h1 className="font-display text-3xl font-semibold text-ink">Forgot your password?</h1>
      <p className="mt-1 text-sm text-ink/60">
        Enter your email address and we will dispatch a password reset link to your inbox.
      </p>

      {sent ? (
        <div className="mt-6 rounded-stamp border border-forest-100 bg-surface p-6 shadow-card space-y-5 text-center">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-forest-50 text-forest-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>

          <div>
            <span className="stamp text-forest-600">Email Dispatched</span>
            <h2 className="mt-2 font-display text-xl font-semibold text-ink">Check your inbox</h2>
            <p className="mt-2 text-sm text-ink/70">
              Reset email addressed to <strong className="text-forest-700 font-mono">{email}</strong> has been generated.
            </p>
          </div>

          <div className="rounded-stamp border border-forest-100 bg-forest-50/50 p-4 text-left space-y-3">
            <p className="text-xs font-semibold text-forest-800 uppercase tracking-wider">Mail Delivery Options:</p>
            
            <a
              href={mailtoUrl}
              className="flex items-center justify-center gap-2 w-full rounded-stamp bg-forest-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-600 focus-ring"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13" />
                <path d="M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
              Open Email App to Send to {email}
            </a>

            <button
              onClick={() => navigate(`/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`)}
              className="flex items-center justify-center gap-2 w-full rounded-stamp border border-forest-500 px-4 py-2 text-sm font-medium text-forest-600 hover:bg-forest-50 focus-ring"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              Click Here to Reset Password Now
            </button>

            <div className="pt-1 flex items-center justify-between text-xs text-ink/60">
              <span className="truncate max-w-[220px] font-mono text-[11px] text-ink/50">{resetUrl}</span>
              <button onClick={handleCopy} className="text-forest-600 font-medium hover:underline shrink-0 ml-2">
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-between text-xs">
            <button
              onClick={() => {
                setSent(false);
              }}
              className="font-medium text-forest-600 hover:underline"
            >
              Send to another email
            </button>
            <Link to="/login" className="font-medium text-ink/60 hover:underline">
              Back to login
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          {serverError && <ErrorMessage message={serverError} />}

          <FormField label="Email" error={error} required>
            <input
              type="email"
              className={inputClass(error)}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </FormField>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-stamp bg-forest-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-600 disabled:opacity-60 focus-ring"
          >
            {loading ? "Sending reset email…" : "Send reset link"}
          </button>
        </form>
      )}

      {!sent && (
        <p className="mt-6 text-center text-sm text-ink/60">
          <Link to="/login" className="font-medium text-forest-600 hover:underline">
            Back to login
          </Link>
        </p>
      )}
    </div>
  );
}


