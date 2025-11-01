import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Userdashboard from "./pages/user/Userdashboard";
import Admindashboard from "./pages/admin/Admindashboard";
import MyEvents from "./pages/user/MyEvents";
import ManageEventPage from "./pages/admin/ManageEventsPage";
import RegisteredUsers from "./pages/admin/RegisteredUsers";
import BrowseEvents from "./pages/user/BrowseEvents";
import Profile from "./pages/user/Profile";
import FeedbackPage from "./pages/user/FeedbackPage";
import EventDetails from "./pages/user/EventDetails";
import AddEventPage from "./components/Admin/AddEventPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/user-dashboard" element={<Userdashboard />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-events" element={<MyEvents/>} />
        <Route path="/browse-events" element={<BrowseEvents />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/events/:eventId" element={<EventDetails />} />
        <Route path="/admin-dashboard" element={<Admindashboard />} />
        <Route path="/manage-events" element={<ManageEventPage/>} />
        <Route path="/admin/events/:eventId/users" element={<RegisteredUsers />} />
        <Route path="/feedback/:eventId" element={<FeedbackPage />} />
        <Route path="/add-user-event" element={<AddEventPage />} />

      </Routes>
    </Router>
  );
}

export default App;
