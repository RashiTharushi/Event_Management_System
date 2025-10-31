// src/components/AdminSidebar.js
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/admin-dashboard" },
    { name: "Event Management", path: "/manage-events" },
    { name: "User Management", path: "/registered-users" },
  ];

  const handleLogout = () => {
    // Clear auth token
    localStorage.removeItem("token");
    localStorage.removeItem("username"); // if you store username
    navigate("/"); // redirect to admin login
  };

  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-6 flex flex-col fixed top-0 left-0">
      <div>
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <nav className="flex flex-col gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-lg font-medium transition ${
                location.pathname === item.path
                  ? "bg-gray-700"
                  : "hover:bg-gray-700"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full mt-6 px-3 py-2 bg-cyan-600 rounded-lg font-medium hover:bg-cyan-700 transition"
      >
        Logout
      </button>
    </div>
  );
}
