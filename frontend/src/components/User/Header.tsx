import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">Event Manager</h1>
      <nav className="flex gap-4">
        <Link to="/home" className="hover:underline">Home</Link>
        <Link to="/my-events" className="hover:underline">My Events</Link>
        <Link to="/login" className="hover:underline">Logout</Link>
      </nav>
    </header>
  );
};

export default Header;
