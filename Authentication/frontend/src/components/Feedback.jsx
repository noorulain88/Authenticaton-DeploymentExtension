export function Alert({ type = "error", children }) {
  if (!children) return null;
  return <div className={`alert alert-${type}`} role={type === "error" ? "alert" : "status"}>{children}</div>;
}

export function Loading({ text = "Loading…" }) {
  return <div className="page-state"><span className="spinner" />{text}</div>;
}

export function EmptyState({ title, description, action }) {
  return <div className="empty-state"><span className="empty-icon">✦</span><h3>{title}</h3><p>{description}</p>{action}</div>;
}
