import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { errorMessage } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Alert, Loading } from "../components/Feedback";

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    api.get(`/courses/${id}`).then(({ data }) => setCourse(data))
      .catch(err => setError(errorMessage(err))).finally(() => setLoading(false));
  }, [id]);

  const handleEnroll = async () => {
    if (!user) return navigate("/login", { state: { from: { pathname: `/courses/${id}` } } });
    if (user.role !== "student") return setError("Only student accounts can enroll in courses.");
    setBusy(true); setError(""); setSuccess("");
    try {
      const { data } = await api.post("/enroll", { courseId: id });
      setSuccess(data.message || "You are enrolled!"); 
    } catch (err) { setError(errorMessage(err)); }
    finally { setBusy(false); }
  };

  if (loading) return <Loading text="Loading course…" />;
  if (!course) return <section className="container page-section"><Alert>{error || "Course not found."}</Alert><Link className="text-link" to="/courses">← Back to courses</Link></section>;

  return (
    <section className="container page-section detail-layout">
      <div className="detail-main">
        <Link className="back-link" to="/courses">← All courses</Link>
        <div className="detail-art course-art-violet"><span className="course-art-label">{course.category}</span><span className="detail-art-symbol">✦</span><span className="course-art-lines" /></div>
        <div className="eyebrow detail-eyebrow">LEARN SOMETHING NEW</div>
        <h1>{course.title}</h1>
        <p className="detail-description">{course.description}</p>
        <div className="detail-instructor"><span className="instructor-avatar large">{(course.instructor?.name || "L").charAt(0).toUpperCase()}</span><div><small>Created by</small><strong>{course.instructor?.name || "LearnHub Instructor"}</strong></div></div>
        <div className="lessons-panel"><h2>Course lessons</h2>{course.lessons?.length ? course.lessons.map((lesson, i) => <div className="lesson-row" key={lesson._id || i}><span className="lesson-number">{String(i + 1).padStart(2, "0")}</span><div><strong>{lesson.title}</strong><small>{lesson.description || "Course lesson"}</small></div><a className="lesson-open" href={lesson.url} target="_blank" rel="noreferrer">Open ↗</a></div>) : <p className="muted">Lessons will appear here when the instructor adds them.</p>}</div>
      </div>
      <aside className="enroll-card"><div className="eyebrow">YOUR NEXT STEP</div><div className="detail-price">{Number(course.price) === 0 ? "Free" : `$${Number(course.price).toFixed(2)}`}</div><p>Start learning at your own pace.</p><button className="btn btn-primary btn-full" onClick={handleEnroll} disabled={busy}>{busy ? "Enrolling…" : "Enroll in course ↗"}</button>{error && <Alert>{error}</Alert>}{success && <Alert type="success">{success} <Link to="/dashboard">Go to My Courses →</Link></Alert>}<div className="enroll-divider" /><div className="includes-title">WHAT'S INCLUDED</div><div className="include-item"><span>✓</span> Course access</div><div className="include-item"><span>✓</span> Learn at your own pace</div><div className="include-item"><span>✓</span> Track your progress</div></aside>
    </section>
  );
}
