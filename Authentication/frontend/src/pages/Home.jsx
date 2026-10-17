import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errorMessage } from "../services/api";
import CourseCard from "../components/CourseCard";
import { Alert, Loading } from "../components/Feedback";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/courses")
      .then(({ data }) => setCourses(data.slice(0, 3)))
      .catch(err => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-glow hero-glow-one" /><div className="hero-glow hero-glow-two" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> YOUR NEXT CHAPTER STARTS HERE</div>
            <h1>Learn something<br />that <span>moves you.</span></h1>
            <p className="hero-description">Practical courses. Brilliant instructors. A learning experience built around the future you want to create.</p>
            <div className="hero-actions"><Link className="btn btn-primary btn-large" to="/courses">Explore courses <span>↗</span></Link><Link className="text-link" to="/register">Start learning for free <span>→</span></Link></div>
            <div className="hero-proof"><div className="avatar-stack"><span>J</span><span>A</span><span>M</span><span>+</span></div><div><strong>Build skills that matter</strong><small>Learn at your own pace, anywhere.</small></div></div>
          </div>
          <div className="hero-visual">
            <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
            <div className="learning-card main-learning-card">
              <div className="mini-card-top"><span className="mini-icon">✦</span><span className="live-tag">LEARNING PATH</span></div>
              <div className="visual-title">Make room for<br /><span>your potential.</span></div>
              <div className="progress-label"><span>Your progress</span><strong>78%</strong></div>
              <div className="progress-track"><span /></div>
              <div className="visual-bottom"><span className="play-icon">▶</span><div><strong>Keep the momentum</strong><small>One lesson at a time</small></div><span className="visual-arrow">↗</span></div>
            </div>
            <div className="floating-note note-top"><span className="note-icon">✧</span><div><strong>Stay curious</strong><small>Grow every day</small></div></div>
            <div className="floating-note note-bottom"><span className="note-icon note-pink">✓</span><div><strong>Skills unlocked</strong><small>Progress feels good</small></div></div>
            <div className="visual-spark spark-one">✦</div><div className="visual-spark spark-two">✧</div>
          </div>
        </div>
        <div className="container hero-stats"><div><strong>Learn on your terms</strong><span>Flexible, focused, friendly</span></div><div><strong>Practical by design</strong><span>Knowledge you can use</span></div><div><strong>Made for progress</strong><span>Small steps, big goals</span></div></div>
      </section>
      <section className="section container">
        <div className="section-heading"><div><div className="eyebrow">A GOOD PLACE TO BEGIN</div><h2>Explore popular courses<span>.</span></h2><p>Find a skill that sparks your curiosity.</p></div><Link className="text-link" to="/courses">View all courses <span>→</span></Link></div>
        {error && <Alert>{error}</Alert>}
        {loading ? <Loading text="Finding courses…" /> : courses.length ? <div className="course-grid">{courses.map((course, index) => <CourseCard key={course._id} course={course} index={index} />)}</div> : <div className="empty-strip"><span>✦</span><div><strong>Your learning journey starts here</strong><p>No courses have been added yet. Instructors can sign in and publish the first course.</p></div><Link className="btn btn-dark" to="/courses">Browse courses</Link></div>}
      </section>
      <section className="cta-section container"><div className="cta-inner"><div className="cta-decoration">✦</div><div><div className="eyebrow">YOUR FUTURE IS A WORK IN PROGRESS</div><h2>Curiosity looks good on you.</h2><p>Pick a course, learn a little, and keep going.</p></div><Link className="btn btn-light" to="/register">Create your account <span>↗</span></Link></div></section>
    </>
  );
}
