import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import { Calendar, Clock, User, Star } from "lucide-react";

export default function AdminDashboard() {
  interface Event {
    _id: string;
    title: string;
    date: string;
    location: string;
  }

  interface RecentRegistration {
    id: string;
    userName: string;
    userEmail: string;
    eventTitle: string;
    eventDate: string;
    registeredAt: string;
  }

  interface Feedback {
    _id: string;
    userId: { username: string; email: string };
    eventId: { title: string };
    rating: number;
    comment: string;
    createdAt: string;
  }

  const [stats, setStats] = useState({ users: 0, events: 0, registrations: 0 });
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [recentRegistrations, setRecentRegistrations] = useState<RecentRegistration[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch admin stats and events
        const statsRes = await API.get("/admindashboard/stats");
        setStats({
          users: statsRes.data.users,
          events: statsRes.data.events,
          registrations: statsRes.data.registrations,
        });
        setUpcomingEvents(statsRes.data.upcomingEvents || []);

        // Fetch recent registrations
        const regRes = await API.get("/admindashboard/recent-registrations");
        setRecentRegistrations(regRes.data);

        // Fetch feedbacks
        const feedbackRes = await API.get("/admindashboard/feedbacks");
        setFeedbacks(feedbackRes.data);
      } catch (err) {
        console.error("Error fetching admin dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-50 space-y-10 ml-64">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-100 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">Total Users</h2>
            <p className="text-3xl font-bold">{stats.users}</p>
          </div>

          <div className="bg-green-100 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">Total Events</h2>
            <p className="text-3xl font-bold">{stats.events}</p>
          </div>

          <div className="bg-yellow-100 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">Total Registrations</h2>
            <p className="text-3xl font-bold">{stats.registrations}</p>
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Registrations</h2>
          {recentRegistrations.length === 0 ? (
            <p className="text-gray-500">No recent activity.</p>
          ) : (
            <div className="max-h-80 overflow-y-auto space-y-3">
              {recentRegistrations.map((act) => (
                <div
                  key={act.id}
                  className="flex flex-col md:flex-row md:justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-500" />
                    <p className="font-semibold">{act.userName}</p>
                    <span className="text-sm text-gray-400">({act.userEmail})</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <p className="text-sm">{act.eventTitle}</p>
                    <Clock className="w-4 h-4 text-gray-400" />
                    <p className="text-xs text-gray-400">
                      {new Date(act.registeredAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-white shadow-md rounded-xl p-4 border hover:shadow-lg transition"
                >
                  <h2 className="text-xl font-bold">{event.title}</h2>
                  <p className="text-sm text-gray-500">
                    📅 {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">📍 {event.location}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No upcoming events</p>
          )}
        </div>

        {/* Feedback Section */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Feedbacks</h2>
          {feedbacks.length === 0 ? (
            <p className="text-gray-500">No feedbacks yet.</p>
          ) : (
            <div className="max-h-96 overflow-y-auto space-y-4">
              {feedbacks.map((fb) => (
                <div
                  key={fb._id}
                  className="border-b pb-3 flex flex-col md:flex-row md:justify-between"
                >
                  <div>
                    <p className="font-semibold">{fb.userId?.username || "Unknown User"}</p>
                    <p className="text-sm text-gray-400">
                      Event: {fb.eventId?.title || "N/A"}
                    </p>
                    <p className="text-gray-700 mt-1">{fb.comment}</p>
                  </div>
                  <div className="text-right mt-2 md:mt-0">
                    <div className="flex justify-end text-yellow-500">
                      {Array.from({ length: fb.rating }, (_, i) => (
                        <Star key={i} size={16} fill="gold" stroke="gold" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(fb.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
