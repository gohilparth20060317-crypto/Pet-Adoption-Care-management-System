import { useState } from "react";
import FormField, { inputClass } from "../../components/common/FormField";
import ErrorMessage from "../../components/common/ErrorMessage";
import { validateFields, isEmail, isRequired } from "../../utils/validators";
import { sendContactMessage } from "../../api/contactApi";

export default function Contact() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState(null);

  const handleChange = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    const fieldErrors = validateFields(values, {
      name: [[isRequired, "Please tell us your name."]],
      email: [[isEmail, "Enter a valid email address."]],
      message: [[isRequired, "Please write a short message."]],
    });
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) return;

    setSubmitting(true);
    try {
      await sendContactMessage(values);
      setSent(true);
    } catch (err) {
      setServerError(err.message || "Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md animate-fade-in">
      <h1 className="font-display text-3xl font-semibold text-ink">Get in touch</h1>
      <p className="mt-1 text-sm text-ink/60">Questions about adoption? We'd love to help.</p>

      {sent ? (
        <div className="mt-6 rounded-stamp border border-forest-100 bg-surface p-6 text-center shadow-card space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-forest-50 text-forest-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="font-display text-xl font-semibold text-forest-700">Message Sent to Admin</h2>
          <p className="text-sm text-ink/70">
            Thank you, <strong>{values.name}</strong>! Your message has been sent directly to the PetHaven Admin.
            We will get back to you at <strong>{values.email}</strong> shortly.
          </p>
          <button
            onClick={() => {
              setSent(false);
              setValues({ name: "", email: "", message: "" });
            }}
            className="mt-4 text-xs font-medium text-forest-600 hover:underline"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          {serverError && <ErrorMessage message={serverError} />}

          <FormField label="Name" error={errors.name} required>
            <input className={inputClass(errors.name)} value={values.name} onChange={handleChange("name")} />
          </FormField>
          <FormField label="Email" error={errors.email} required>
            <input
              type="email"
              className={inputClass(errors.email)}
              value={values.email}
              onChange={handleChange("email")}
            />
          </FormField>
          <FormField label="Message" error={errors.message} required>
            <textarea
              rows={4}
              className={inputClass(errors.message)}
              value={values.message}
              onChange={handleChange("message")}
            />
          </FormField>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-stamp bg-forest-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-600 disabled:opacity-60 focus-ring"
          >
            {submitting ? "Sending to Admin…" : "Send message"}
          </button>
        </form>
      )}
    </div>
  );
}

