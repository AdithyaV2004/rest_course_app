import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import CourseCard from "../components/CourseCard";
import Alert from "../components/Alert";

export default function PurchasesDashboard() {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getPurchased(token)
      .then((data) => setCourses(data.courses || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <Layout>
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-stone-900">My purchases</h1>
        <p className="text-sm text-stone-500">Courses you already own.</p>
      </div>

      <Alert>{error}</Alert>

      {loading ? (
        <p className="text-sm text-stone-500">Loading your courses…</p>
      ) : courses.length === 0 ? (
        <p className="text-sm text-stone-500">
          You haven't purchased any courses yet. Head to Browse courses to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </Layout>
  );
}
