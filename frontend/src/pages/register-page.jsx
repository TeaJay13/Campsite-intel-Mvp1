import React from "react";

import { useAuth } from "../contexts/auth-context.jsx";

export default function RegisterPage({ onNavigate }) {
  const { register } = useAuth();

  const [form, setForm] = React.useState({ email: "", displayName: "", password: "" });
  const [error, setError] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);

  function handleChange(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await register({ email: form.email, displayName: form.displayName, password: form.password });
      onNavigate("/trails");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-page">
      <h1 className="page-title">Create an account</h1>

      {error && (
        <div className="state-box state-error" role="alert">
          {error}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <label className="field-label" htmlFor="displayName">
          Display name
        </label>
        <input
          id="displayName"
          className="field-input"
          type="text"
          name="displayName"
          value={form.displayName}
          onChange={handleChange}
          autoComplete="nickname"
          required
          minLength={2}
          maxLength={50}
        />

        <label className="field-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          className="field-input"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />

        <label className="field-label" htmlFor="password">
          Password
          <span className="field-hint"> (min 8 characters)</span>
        </label>
        <input
          id="password"
          className="field-input"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          required
          minLength={8}
        />

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Creating account…" : "Sign up"}
        </button>
      </form>

      <p className="auth-switch">
        Already have an account?{" "}
        <a data-nav="spa" href="/login">
          Log in
        </a>
      </p>
    </section>
  );
}
