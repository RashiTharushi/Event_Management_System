import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarSearch,
  CalendarCheck2,
  User,
  LogOut,
} from "lucide-react";

function UserHeaderBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="w-full bg-gradient-to-r from-sky-600 to-sky-900 text-white shadow-md px-8 py-5 flex items-center justify-between h-20">
      {/* Logo / Brand */}
      <h1 className="text-3xl font-bold tracking-wide">Eventify</h1>

      {/* Nav Items */}
      <nav className="flex items-center gap-4">
        <Link
          to="/user-dashboard"
          className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-sky-400 transition font-medium"
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/browse-events"
          className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-sky-400 transition font-medium"
        >
          <CalendarSearch className="w-5 h-5" />
          <span>Browse Events</span>
        </Link>
        <Link
          to="/my-events"
          className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-sky-400 transition font-medium"
        >
          <CalendarCheck2 className="w-5 h-5" />
          <span>My Events</span>
        </Link>
        <Link
          to="/profile"
          className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-sky-400 transition font-medium"
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </Link>
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-700 transition font-medium"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </header>
  );
}

export default UserHeaderBar;
