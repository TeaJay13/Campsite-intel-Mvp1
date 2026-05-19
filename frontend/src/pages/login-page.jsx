import React from "react";

import { useAuth } from "../contexts/auth-context.jsx";

export default function LoginPage({ onNavigate }) {
  const { login } = useAuth();

  const [form, setForm] = React.useState({ email: "", password: "" });
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
      await login({ email: form.email, password: form.password });
      onNavigate("/trails");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-page">
      <h1 className="page-title">Log in</h1>

      {error && (
        <div className="state-box state-error" role="alert">
          {error}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
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
        </label>
        <input
          id="password"
          className="field-input"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
          required
        />

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="auth-switch">
        Don&apos;t have an account?{" "}
        <a data-nav="spa" href="/register">
          Sign up
        </a>
      </p>
    </section>
  );
}
