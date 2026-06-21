import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const linkBase =
  "block rounded-lg px-4 py-2 text-sm font-medium transition-colors";
const linkActive = "bg-amber-500 text-stone-900";
const linkIdle = "text-stone-300 hover:bg-stone-800 hover:text-white";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const userLinks = [
    { to: "/dashboard", label: "Browse courses" },
    { to: "/purchases", label: "My purchases" },
    { to: "/wallet", label: "Wallet" },
    { to: "/profile", label: "Profile" },
  ];

  const adminLinks = [
    { to: "/admin", label: "My courses" },
    { to: "/profile", label: "Profile" },
  ];

  const links = user?.role === "admin" ? adminLinks : userLinks;

  return (
    <div className="flex min-h-screen bg-stone-50">
      <aside className="flex w-64 flex-col justify-between bg-stone-900 px-4 py-6">
        <div>
          <div className="mb-8 px-2">
            <p className="text-lg font-semibold text-white">Coursehouse</p>
            <p className="text-xs text-stone-400">
              {user?.role === "admin" ? "Instructor console" : "Learner console"}
            </p>
          </div>
          <nav className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkIdle}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="space-y-3 px-2">
          <div className="rounded-lg bg-stone-800 px-3 py-2">
            <p className="truncate text-sm font-medium text-white">{user?.username}</p>
            <p className="text-xs capitalize text-stone-400">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full rounded-lg border border-stone-700 px-4 py-2 text-sm font-medium text-stone-300 transition-colors hover:bg-stone-800 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
