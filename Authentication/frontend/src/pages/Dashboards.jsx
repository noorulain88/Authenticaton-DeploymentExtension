import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errorMessage } from "../services/api";
import { useAuth } from "../context/AuthContext";
import CourseCard from "../components/CourseCard";
import { Alert, EmptyState, Loading } from "../components/Feedback";

function DashboardHeader({ eyebrow, title, description, action }) {
  return <div className="dashboard-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}<span>.</span></h1><p>{description}</p></div>{action}</div>;
}

function CourseForm({ initial, onSave, onCancel, busy }) {
  const [form, setForm] = useState(initial || { title: "", description: "", category: "Web Development", price: "0" });
  const [error, setError] = useState("");
  const submit = async e => {
    e.preventDefault(); setError("");
    if (form.title.trim().length < 3) return setError("Title must contain at least 3 characters.");
    if (form.description.trim().length < 10) return setError("Description must contain at least 10 characters.");
    if (!form.category.trim()) return setError("Category is required.");
    if (!Number.isFinite(Number(form.price)) || Number(form.price) < 0) return setError("Price must be zero or greater.");
    try { await onSave({ ...form, price: Number(form.price) }); }
    catch (err) { setError(errorMessage(err)); }
  };
  return <form className="panel-form" onSubmit={submit}><Alert>{error}</Alert><div className="form-two-col"><label>Course title<input required minLength="3" maxLength="120" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Modern JavaScript" /></label><label>Category<input required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Web Development" /></label></div><label>Description<textarea required minLength="10" maxLength="5000" rows="4" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What will students learn?" /></label><label>Price (USD)<input type="number" min="0" step="0.01" required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></label><div className="form-actions"><button className="btn btn-primary" disabled={busy}>{busy ? "Saving…" : "Save course ↗"}</button><button className="btn btn-ghost" type="button" onClick={onCancel}>Cancel</button></div></form>;
}

export function StudentDashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [progressBusy, setProgressBusy] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    api.get("/enroll/my-courses").then(({ data }) => { setItems(data); setError(""); })
      .catch(err => setError(errorMessage(err))).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const updateProgress = async item => {
    const next = Math.min(100, Number(item.progress || 0) + 10);
    setProgressBusy(item._id);
    try {
      await api.patch(`/enroll/${item._id}/progress`, { progress: next });
      setItems(current => current.map(row => row._id === item._id ? { ...row, progress: next } : row));
    } catch (err) { setError(errorMessage(err)); }
    finally { setProgressBusy(""); }
  };

  return <section className="container dashboard-page"><DashboardHeader eyebrow={`STUDENT SPACE · ${user?.role.toUpperCase()}`} title={`Keep going, ${user?.name.split(" ")[0]}`} description="Every lesson is a small step toward something bigger." action={<Link className="btn btn-primary" to="/courses">Explore courses ↗</Link>} /><div className="stat-row"><div className="stat-card"><span>MY COURSES</span><strong>{items.length}</strong><small>Your learning library</small></div><div className="stat-card"><span>IN PROGRESS</span><strong>{items.filter(x => x.progress < 100).length}</strong><small>Keep your momentum</small></div><div className="stat-card"><span>COMPLETED</span><strong>{items.filter(x => x.progress >= 100).length}</strong><small>Skills you've finished</small></div></div><div className="dashboard-section-heading"><div><h2>My learning</h2><p>Your enrolled courses in one place.</p></div><button className="btn btn-ghost btn-small" onClick={load}>↻ Refresh</button></div>{error && <Alert>{error}</Alert>}{loading ? <Loading text="Loading your courses…" /> : items.length ? <div className="enrolled-grid">{items.map(item => item.course && <article className="enrolled-card" key={item._id}><div className="enrolled-card-top"><span className="enrolled-category">{item.course.category}</span><span className="progress-percent">{item.progress}%</span></div><h3>{item.course.title}</h3><p>{item.course.description}</p><div className="progress-track enrolled-progress"><span style={{ width: `${item.progress}%` }} /></div><div className="enrolled-footer"><Link className="text-link" to={`/courses/${item.course._id}`}>Open course →</Link><button className="btn btn-ghost btn-small" disabled={progressBusy === item._id || item.progress >= 100} onClick={() => updateProgress(item)}>{item.progress >= 100 ? "Completed ✓" : progressBusy === item._id ? "Saving…" : "Mark progress +10%"}</button></div></article>)}</div> : <EmptyState title="Your learning space is waiting" description="Enroll in a course to see it here and track your progress." action={<Link className="btn btn-primary" to="/courses">Browse courses ↗</Link>} />}</section>;
}

export function InstructorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [lessonCourse, setLessonCourse] = useState(null);
  const [lesson, setLesson] = useState({ title: "", url: "", description: "" });

  const load = useCallback(() => {
    setLoading(true);
    api.get("/courses").then(({ data }) => setCourses(data.filter(c => c.instructor?._id === user?.id || c.instructor?._id === user?._id)))
      .catch(err => setError(errorMessage(err))).finally(() => setLoading(false));
  }, [user]);
  useEffect(() => { load(); }, [load]);

  const saveCourse = async form => {
    setBusy(true);
    try {
      if (editing) await api.put(`/courses/${editing._id}`, form);
      else await api.post("/courses", form);
      setShowForm(false); setEditing(null); setNotice(editing ? "Course updated successfully." : "Course published successfully."); setError(""); load();
    } catch (err) { throw err; }
    finally { setBusy(false); }
  };
  const deleteCourse = async course => {
    if (!window.confirm(`Delete "${course.title}"? Enrollments for this course will also be removed.`)) return;
    try { await api.delete(`/courses/${course._id}`); setCourses(current => current.filter(c => c._id !== course._id)); setNotice("Course deleted."); }
    catch (err) { setError(errorMessage(err)); }
  };
  const addLesson = async e => {
    e.preventDefault();
    try { await api.post(`/courses/${lessonCourse._id}/lessons`, lesson); setNotice("Lesson added successfully."); setLessonCourse(null); setLesson({ title: "", url: "", description: "" }); load(); }
    catch (err) { setError(errorMessage(err)); }
  };

  return <section className="container dashboard-page"><DashboardHeader eyebrow="INSTRUCTOR STUDIO" title={`Create, ${user?.name.split(" ")[0]}`} description="Share what you know. Help someone take their next step." action={<button className="btn btn-primary" onClick={() => { setEditing(null); setShowForm(v => !v); }}>＋ New course</button>} /><div className="stat-row"><div className="stat-card"><span>YOUR COURSES</span><strong>{courses.length}</strong><small>Published by you</small></div><div className="stat-card"><span>LESSONS</span><strong>{courses.reduce((sum, c) => sum + (c.lessons?.length || 0), 0)}</strong><small>Learning resources</small></div><div className="stat-card"><span>ROLE</span><strong className="role-stat">Instructor</strong><small>Keep sharing knowledge</small></div></div>{notice && <Alert type="success">{notice}</Alert>}{error && <Alert>{error}</Alert>}{showForm && <div className="form-panel"><h2>{editing ? "Edit course" : "Publish a new course"}</h2><CourseForm key={editing?._id || "new"} initial={editing ? { title: editing.title, description: editing.description, category: editing.category, price: String(editing.price) } : undefined} onSave={saveCourse} onCancel={() => { setShowForm(false); setEditing(null); }} busy={busy} /></div>}{lessonCourse && <div className="form-panel"><h2>Add lesson to {lessonCourse.title}</h2><form className="panel-form" onSubmit={addLesson}><label>Lesson title<input required value={lesson.title} onChange={e => setLesson({ ...lesson, title: e.target.value })} /></label><label>Lesson URL<input required type="url" value={lesson.url} onChange={e => setLesson({ ...lesson, url: e.target.value })} placeholder="https://…" /></label><label>Description<input value={lesson.description} onChange={e => setLesson({ ...lesson, description: e.target.value })} /></label><div className="form-actions"><button className="btn btn-primary">Add lesson</button><button type="button" className="btn btn-ghost" onClick={() => setLessonCourse(null)}>Cancel</button></div></form></div>}<div className="dashboard-section-heading"><div><h2>Your courses</h2><p>Manage the courses you have published.</p></div><button className="btn btn-ghost btn-small" onClick={load}>↻ Refresh</button></div>{loading ? <Loading text="Loading your courses…" /> : courses.length ? <div className="manage-course-list">{courses.map((course, index) => <article className="manage-course" key={course._id}><div className={`manage-course-icon ${["violet","blue","orange"][index%3]}`}>✦</div><div className="manage-course-info"><span>{course.category} · {Number(course.price) === 0 ? "Free" : `$${Number(course.price).toFixed(2)}`}</span><h3>{course.title}</h3><p>{course.description}</p><small>{course.lessons?.length || 0} lessons</small></div><div className="manage-course-actions"><button className="btn btn-ghost btn-small" onClick={() => { setEditing(course); setShowForm(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Edit</button><button className="btn btn-ghost btn-small" onClick={() => setLessonCourse(course)}>＋ Lesson</button><button className="btn btn-danger btn-small" onClick={() => deleteCourse(course)}>Delete</button><Link className="arrow-link" to={`/courses/${course._id}`}>↗</Link></div></article>)}</div> : <EmptyState title="Publish your first course" description="Share your expertise by creating a course for students." action={<button className="btn btn-primary" onClick={() => setShowForm(true)}>＋ Create a course</button>} />}</section>;
}

export function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [a, u, c] = await Promise.all([api.get("/admin/analytics"), api.get("/admin/users"), api.get("/courses")]);
      setAnalytics(a.data); setUsers(u.data); setCourses(c.data);
    } catch (err) { setError(errorMessage(err)); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const changeRole = async (user, role) => {
    try {
      await api.patch(`/admin/users/${user._id || user.id}/role`, { role });
      setUsers(current => current.map(u => (u._id || u.id) === (user._id || user.id) ? { ...u, role } : u));
      setNotice(`Updated ${user.name}'s role to ${role}.`);
    } catch (err) { setError(errorMessage(err)); }
  };

  return <section className="container dashboard-page"><DashboardHeader eyebrow="ADMIN CONTROL ROOM" title="The big picture" description="Monitor the learning community and manage access." action={<button className="btn btn-ghost" onClick={load}>↻ Refresh data</button>} />{error && <Alert>{error}</Alert>}{notice && <Alert type="success">{notice}</Alert>}{loading ? <Loading text="Loading analytics…" /> : <><div className="stat-row"><div className="stat-card"><span>TOTAL USERS</span><strong>{analytics?.users ?? 0}</strong><small>Registered accounts</small></div><div className="stat-card"><span>COURSES</span><strong>{analytics?.courses ?? 0}</strong><small>Published learning</small></div><div className="stat-card"><span>ENROLLMENTS</span><strong>{analytics?.enrollments ?? 0}</strong><small>Student sign-ups</small></div><div className="stat-card"><span>INSTRUCTORS</span><strong>{analytics?.instructors ?? 0}</strong><small>Knowledge sharers</small></div></div><div className="dashboard-section-heading"><div><h2>User management</h2><p>Assign roles to control access.</p></div></div><div className="users-table-wrap"><table className="users-table"><thead><tr><th>User</th><th>Email</th><th>Current role</th><th>Change role</th></tr></thead><tbody>{users.map(user => <tr key={user._id || user.id}><td><div className="table-user"><span className="instructor-avatar">{user.name?.charAt(0).toUpperCase()}</span><strong>{user.name}</strong></div></td><td>{user.email}</td><td><span className={`role-badge role-${user.role}`}>{user.role}</span></td><td><select value={user.role} onChange={e => changeRole(user, e.target.value)} aria-label={`Change role for ${user.name}`}><option value="student">Student</option><option value="instructor">Instructor</option><option value="admin">Admin</option></select></td></tr>)}</tbody></table></div><div className="dashboard-section-heading"><div><h2>Course library</h2><p>All courses currently available on LearnHub.</p></div></div>{courses.length ? <div className="course-grid">{courses.map((course, index) => <CourseCard key={course._id} course={course} index={index} />)}</div> : <p className="muted">No courses have been published yet.</p>}</>}</section>;
}
