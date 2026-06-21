import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";

export default function ProfilePage() {
  const { user } = useAuth();

  const fields = [
    { label: "Username", value: user?.username },
    { label: "Role", value: user?.role, capitalize: true },
    { label: "Wallet balance", value: user?.role === "user" ? `₹${user?.wallet ?? 0}` : "—" },
    { label: "User ID", value: user?.id },
  ];

  return (
    <Layout>
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-stone-900">Profile</h1>
        <p className="text-sm text-stone-500">Your account details.</p>
      </div>

      <div className="max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="divide-y divide-stone-100">
          {fields.map((field) => (
            <div key={field.label} className="flex items-center justify-between py-3">
              <span className="text-sm text-stone-500">{field.label}</span>
              <span
                className={`text-sm font-medium text-stone-900 ${
                  field.capitalize ? "capitalize" : ""
                }`}
              >
                {field.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
