import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import Alert from "../components/Alert";

const emptyForm = { title: "", description: "", price: "" };

export default function AdminDashboard() {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [createForm, setCreateForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [updating, setUpdating] = useState(false);

  const loadCourses = async () => {
    setError("");
    try {
      const data = await api.adminGetCourses(token);
      setCourses(Array.isArray(data.courses) ? data.courses : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setCreating(true);
    try {
      await api.adminCreateCourse(token, {
        title: createForm.title,
        description: createForm.description,
        price: Number(createForm.price),
      });
      setSuccess("Course created.");
      setCreateForm(emptyForm);
      loadCourses();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const startEditing = (course) => {
    setEditingId(course._id);
    setEditForm({
      title: course.title,
      description: course.description,
      price: String(course.price),
    });
    setSuccess("");
    setError("");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm(emptyForm);
  };

  const handleUpdate = async (e, courseId) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setUpdating(true);
    try {
      await api.adminUpdateCourse(token, courseId, {
        title: editForm.title,
        description: editForm.description,
        price: Number(editForm.price),
      });
      setSuccess("Course updated.");
      setEditingId(null);
      loadCourses();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Layout>
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-stone-900">My courses</h1>
        <p className="text-sm text-stone-500">Create and manage the courses you teach.</p>
      </div>

      <Alert>{error}</Alert>
      <Alert type="success">{success}</Alert>

      <div className="mb-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-stone-900">Create a new course</h2>
        <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-stone-700">Title</label>
            <input
              type="text"
              required
              value={createForm.title}
              onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-stone-700">Description</label>
            <textarea
              required
              rows={2}
              value={createForm.description}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Price (₹)</label>
            <input
              type="number"
              min="1"
              required
              value={createForm.price}
              onChange={(e) => setCreateForm({ ...createForm, price: e.target.value })}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={creating}
              className="w-full rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-stone-800 disabled:opacity-50"
            >
              {creating ? "Creating…" : "Create course"}
            </button>
          </div>
        </form>
      </div>

      <h2 className="mb-4 text-base font-semibold text-stone-900">Existing courses</h2>

      {loading ? (
        <p className="text-sm text-stone-500">Loading courses…</p>
      ) : courses.length === 0 ? (
        <p className="text-sm text-stone-500">You haven't created any courses yet.</p>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course._id}
              className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
            >
              {editingId === course._id ? (
                <form
                  onSubmit={(e) => handleUpdate(e, course._id)}
                  className="grid gap-4 sm:grid-cols-2"
                >
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-stone-700">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-stone-700">
                      Description
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({ ...editForm, description: e.target.value })
                      }
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-stone-700">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <button
                      type="submit"
                      disabled={updating}
                      className="flex-1 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-900 transition-colors hover:bg-amber-400 disabled:opacity-50"
                    >
                      {updating ? "Saving…" : "Save changes"}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="flex-1 rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-stone-900">{course.title}</h3>
                    <p className="mt-1 text-sm text-stone-500">{course.description}</p>
                    <p className="mt-2 text-sm font-semibold text-stone-900">₹{course.price}</p>
                  </div>
                  <button
                    onClick={() => startEditing(course)}
                    className="shrink-0 rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
