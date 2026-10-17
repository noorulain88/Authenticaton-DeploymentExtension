import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api, { errorMessage } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Alert } from "../components/Feedback";

function AuthLayout({ eyebrow, title, subtitle, children, footer }) {
  return <section className="auth-page"><div className="auth-decoration auth-decoration-one" /><div className="auth-decoration auth-decoration-two" /><div className="auth-card"><Link to="/" className="brand auth-brand"><span className="brand-mark">L</span><span>Learn<span className="brand-accent">Hub</span></span></Link><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p className="auth-subtitle">{subtitle}</p>{children}<div className="auth-footer">{footer}</div></div><div className="auth-side-note"><span>✦</span> Make learning part of your story.</div></section>;
}

export function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async e => {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      const { data } = await api.post("/auth/login", form);
      login(data);
      const target = location.state?.from?.pathname;
      navigate(target || (data.user.role === "admin" ? "/admin" : data.user.role === "instructor" ? "/instructor" : "/dashboard"), { replace: true });
    } catch (err) { setError(errorMessage(err)); }
    finally { setBusy(false); }
  };

  return <AuthLayout eyebrow="WELCOME BACK" title="Good to see you." subtitle="Log in to pick up where your curiosity left off." footer={<>New to LearnHub? <Link to="/register">Create an account</Link></>}>
    <form className="auth-form" onSubmit={submit}>
      <Alert>{error}</Alert>
      <label>Email address<input type="email" autoComplete="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>
      <label>Password<input type="password" autoComplete="current-password" required minLength="8" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Enter your password" /></label>
      <button className="btn btn-primary btn-full btn-large" disabled={busy}>{busy ? "Signing in…" : "Log in to LearnHub ↗"}</button>
    </form>
  </AuthLayout>;
}

export function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      const { data } = await api.post("/auth/register", form);
      login(data);
      navigate(data.user.role === "instructor" ? "/instructor" : "/dashboard", { replace: true });
    } catch (err) { setError(errorMessage(err)); }
    finally { setBusy(false); }
  };

  return <AuthLayout eyebrow="YOUR NEXT CHAPTER" title="Make it happen." subtitle="Create an account and start building your skills." footer={<>Already have an account? <Link to="/login">Log in</Link></>}>
    <form className="auth-form" onSubmit={submit}>
      <Alert>{error}</Alert>
      <label>Full name<input autoComplete="name" required minLength="2" maxLength="80" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" /></label>
      <label>Email address<input type="email" autoComplete="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>
      <label>Password<input type="password" autoComplete="new-password" required minLength="8" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" /><small className="field-help">Use at least 8 characters.</small></label>
      <label>I want to join as<select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}><option value="student">Student</option><option value="instructor">Instructor</option></select></label>
      <button className="btn btn-primary btn-full btn-large" disabled={busy}>{busy ? "Creating account…" : "Create account ↗"}</button>
      <p className="form-note">Admin access is assigned securely by an existing administrator.</p>
    </form>
  </AuthLayout>;
}
