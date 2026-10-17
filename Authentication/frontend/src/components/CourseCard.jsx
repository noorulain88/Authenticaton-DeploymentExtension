import { Link } from "react-router-dom";

const palettes = [
  "course-art-violet", "course-art-blue", "course-art-orange", "course-art-green"
];

export default function CourseCard({ course, index = 0 }) {
  const instructorName = course.instructor?.name || "LearnHub Instructor";
  return (
    <article className="course-card">
      <div className={`course-art ${palettes[index % palettes.length]}`}>
        <span className="course-art-label">{course.category || "Learning"}</span>
        <span className="course-art-icon">{["✦", "◈", "⌘", "◎"][index % 4]}</span>
        <span className="course-art-lines" />
      </div>
      <div className="course-card-body">
        <div className="course-meta"><span>{course.category}</span><span>{Number(course.price) === 0 ? "Free" : `$${Number(course.price).toFixed(2)}`}</span></div>
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <div className="course-card-footer">
          <span className="instructor-avatar">{instructorName.charAt(0).toUpperCase()}</span>
          <span className="instructor-name">{instructorName}</span>
          <Link className="arrow-link" to={`/courses/${course._id}`} aria-label={`View ${course.title}`}>↗</Link>
        </div>
      </div>
    </article>
  );
}
