import { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import { Alert, EmptyState, Loading } from "../components/Feedback";
import api, { errorMessage } from "../services/api";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get("/courses", { params: { search: search || undefined, category: category !== "All" ? category : undefined } })
      .then(({ data }) => { setCourses(data); setError(""); })
      .catch(err => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [search, category]);

  const categories = ["All", ...new Set(courses.map(course => course.category).filter(Boolean))];

  return (
    <section className="page-section container">
      <div className="page-heading"><div className="eyebrow">FIND YOUR NEXT SKILL</div><h1>All courses<span>.</span></h1><p>Browse the library and find something worth learning.</p></div>
      <div className="filter-bar"><label className="search-field"><span>⌕</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses…" aria-label="Search courses" /></label><label className="select-field"><span>Category</span><select value={category} onChange={e => setCategory(e.target.value)}>{categories.map(item => <option key={item} value={item}>{item}</option>)}</select></label></div>
      {error && <Alert>{error}</Alert>}
      {loading ? <Loading text="Loading courses…" /> : courses.length ? <><div className="results-line">{courses.length} {courses.length === 1 ? "course" : "courses"} to explore</div><div className="course-grid">{courses.map((course, index) => <CourseCard key={course._id} course={course} index={index} />)}</div></> : <EmptyState title="No courses found" description="Try another search, or check back when new courses are added." />}
    </section>
  );
}
