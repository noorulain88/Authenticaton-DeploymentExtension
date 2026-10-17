import { Link } from "react-router-dom";
export function Unauthorized() {
  return <section className="container page-section not-found"><div className="not-found-number">403</div><div className="eyebrow">ACCESS RESTRICTED</div><h1>This space isn't yours yet.</h1><p>Your current account doesn't have permission to open this page.</p><Link className="btn btn-primary" to="/">Back home ↗</Link></section>;
}
export default function NotFound() {
  return <section className="container page-section not-found"><div className="not-found-number">404</div><div className="eyebrow">WRONG TURN?</div><h1>This page took a little detour.</h1><p>We couldn't find the page you're looking for.</p><Link className="btn btn-primary" to="/">Back home ↗</Link></section>;
}
