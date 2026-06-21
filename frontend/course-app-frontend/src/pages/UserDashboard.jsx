import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import CourseCard from "../components/CourseCard";
import Alert from "../components/Alert";

export default function UserDashboard() {
  const { token, refreshProfile } = useAuth();
  const [courses, setCourses] = useState([]);
  const [purchasedIds, setPurchasedIds] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState(null);

  const loadData = async () => {
    setError("");
    try {
      const [coursesRes, purchasedRes] = await Promise.all([
        api.getCourses(token),
        api.getPurchased(token),
      ]);
      setCourses(coursesRes.courses || []);
      const ids = (purchasedRes.courses || []).map((c) => c._id);
      setPurchasedIds(ids);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Plain JS client-side search by course title as the user types.
  const filteredCourses = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return courses;
    return courses.filter((course) => course.title.toLowerCase().includes(term));
  }, [courses, query]);

  const handlePurchase = async (courseId) => {
    setError("");
    setSuccess("");
    setPurchasingId(courseId);
    try {
      await api.purchaseCourse(token, courseId);
      setSuccess("Course purchased successfully.");
      setPurchasedIds((prev) => [...prev, courseId]);
      refreshProfile();
    } catch (err) {
      setError(err.message);
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <Layout>
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-stone-900">Browse courses</h1>
        <p className="text-sm text-stone-500">Find something new to learn.</p>
      </div>

      <Alert>{error}</Alert>
      <Alert type="success">{success}</Alert>

      <input
        type="text"
        placeholder="Search courses by name…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-6 w-full max-w-md rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
      />

      {loading ? (
        <p className="text-sm text-stone-500">Loading courses…</p>
      ) : filteredCourses.length === 0 ? (
        <p className="text-sm text-stone-500">No courses match your search.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => {
            const owned = purchasedIds.includes(course._id);
            return (
              <CourseCard
                key={course._id}
                course={course}
                footer={
                  owned ? (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      Purchased
                    </span>
                  ) : (
                    <button
                      onClick={() => handlePurchase(course._id)}
                      disabled={purchasingId === course._id}
                      className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-stone-900 transition-colors hover:bg-amber-400 disabled:opacity-50"
                    >
                      {purchasingId === course._id ? "Purchasing…" : "Purchase"}
                    </button>
                  )
                }
              />
            );
          })}
        </div>
      )}
    </Layout>
  );
}
