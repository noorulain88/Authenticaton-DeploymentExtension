import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import { Login, Register } from "./pages/AuthPages";
import { StudentDashboard, InstructorDashboard, AdminDashboard } from "./pages/Dashboards";
import NotFound, { Unauthorized } from "./pages/NotFound";

function AppRoutes() {
  return <>
    <Navbar />
    <main className="main-content">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route element={<ProtectedRoute roles={["student"]} />}><Route path="/dashboard" element={<StudentDashboard />} /></Route>
        <Route element={<ProtectedRoute roles={["instructor"]} />}><Route path="/instructor" element={<InstructorDashboard />} /></Route>
        <Route element={<ProtectedRoute roles={["admin"]} />}><Route path="/admin" element={<AdminDashboard />} /></Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
    <footer className="site-footer"><div className="container footer-inner"><a className="brand" href="/"><span className="brand-mark">L</span><span>Learn<span className="brand-accent">Hub</span></span></a><span>Make room for your potential.</span><span>© {new Date().getFullYear()} LearnHub</span></div></footer>
  </>;
}

export default function App() {
  return <BrowserRouter><AuthProvider><AppRoutes /></AuthProvider></BrowserRouter>;
}
