import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Settings, Calendar, Clock, History } from "lucide-react";
import API from "../../services/api";
import UserHeaderBar from "../../components/User/UserHeaderBar";

interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
}

function Userdashboard() {
  const [stats, setStats] = useState({ total: 0, upcoming: 0, past: 0 });
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const userName = localStorage.getItem("username") || "User"; // if you stored username at login

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/registration/my-events", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const registrations = res.data;
        const now = new Date();

        // Transform registration list into events
        const events: Event[] = registrations.map((reg: any) => ({
          _id: reg.eventId._id,
          title: reg.eventId.title,
          date: reg.eventId.date,
          location: reg.eventId.location,
        }));

        // Separate upcoming vs past
        const upcoming = events.filter((e) => new Date(e.date) >= now);
        const past = events.filter((e) => new Date(e.date) < now);

        setUpcomingEvents(upcoming);
        setPastEvents(past);
        setStats({
          total: events.length,
          upcoming: upcoming.length,
          past: past.length,
        });
      } catch (err) {
        console.error("Error fetching events", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div >
      <div className="fixed top-0 left-0 w-full z-50">
          <UserHeaderBar />
      </div>

      {/* Main Content */}
      <div className=" mx-auto p-6 pt-25">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Hello, {userName} !</h1>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Settings className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg text-center">
            <Calendar className="mx-auto mb-2 w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold">Total Events</h2>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <Clock className="mx-auto mb-2 w-6 h-6 text-green-600" />
            <h2 className="text-lg font-semibold">Upcoming</h2>
            <p className="text-2xl font-bold">{stats.upcoming}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <History className="mx-auto mb-2 w-6 h-6 text-gray-600" />
            <h2 className="text-lg font-semibold">Past</h2>
            <p className="text-2xl font-bold">{stats.past}</p>
          </div>
        </div>

        {/* Upcoming Events */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          {upcomingEvents.length === 0 ? (
            <p className="text-gray-500">No upcoming events</p>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event._id}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold">{event.title}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString()} • {event.location}
                    </p>
                  </div>
                  <Link
                    to={`/events/${event._id}`}
                    className="px-3 py-1 text-sm bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past Events */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Past Events</h2>
          {pastEvents.length === 0 ? (
            <p className="text-gray-500">No past events</p>
          ) : (
            <div className="space-y-4">
              {pastEvents.map((event) => (
                <div
                  key={event._id}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold">{event.title}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString()} • {event.location}
                    </p>
                  </div>
                  <Link
                    to={`/feedback/${event._id}`}
                    className="px-3 py-1 text-sm bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 rounded-lg"
                  >
                    View Feedback
                  </Link>

                </div>
              ))}
            </div>
            
          )}

        </section>
        {/* CTA */}
          <div className="text-center pt-6">
            <Link
              to="/browse-events"
              className="px-6 py-3 bg-cyan-700 text-white rounded-lg font-semibold hover:bg-cyan-800"
            >
              Browse Events
            </Link>
          </div>
      </div>
    </div>
  );
}

export default Userdashboard;
