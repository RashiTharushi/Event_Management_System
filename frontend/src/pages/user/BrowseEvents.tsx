import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { Calendar, MapPin, Users, CheckCircle } from "lucide-react";
import UserHeaderBar from "../../components/User/UserHeaderBar";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  registrantsCount: number;
}

function BrowseEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6; // items per page

  useEffect(() => {
    fetchEvents();
    fetchMyEvents();
  }, [search, location, date, page]);

  const fetchEvents = async () => {
    try {
      const { data } = await API.get("/events", {
        params: { search, location, date, page, limit },
      });

      // Assuming backend sends `events` array and `totalCount`
      setEvents(data.events || data); 
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const fetchMyEvents = async () => {
    try {
      const { data } = await API.get("/registration/my-events");
      const ids = data.map((r: any) => r.eventId._id);
      setRegisteredEventIds(ids);
    } catch (err) {
      console.error("Error fetching my events:", err);
    }
  };

  const handleRegister = async (eventId: string) => {
    try {
      await API.post(`/registration/${eventId}`);
      alert("Successfully registered!");
      fetchEvents();
      fetchMyEvents();
    } catch (err: any) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div>
        <div className="fixed top-0 left-0 w-full z-50">
          <UserHeaderBar />
        </div>
        <div className=" mx-auto p-6 pt-25">
        <h1 className="text-2xl font-bold mb-6">Browse Events</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const isFull = event.registrantsCount >= event.capacity;
          const isRegistered = registeredEventIds.includes(event._id);
          const status = isRegistered ? "Registered" : isFull ? "Full" : "Open";

          return (
            <div
              key={event._id}
              className="bg-white rounded-lg shadow p-5 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-bold mb-2">{event.title}</h2>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {event.location}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Users className="w-4 h-4" /> {event.registrantsCount}/{event.capacity}
                </p>
              </div>

              <span
                className={`inline-block mt-3 px-3 py-1 text-xs font-semibold rounded-full w-fit ${
                  status === "Open"
                    ? "bg-green-100 text-green-700"
                    : status === "Registered"
                    ? "bg-blue-100 text-blue-700 flex items-center gap-1"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {status === "Registered" && <CheckCircle className="w-4 h-4" />}
                {status}
              </span>

              <div className="mt-4 flex gap-2">
                {status === "Open" ? (
                  <button
                    onClick={() => handleRegister(event._id)}
                    className="flex-1 bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-700 transition"
                  >
                    Register
                  </button>
                ) : status === "Registered" ? (
                  <button
                    disabled
                    className="flex-1 bg-blue-300 text-blue-700 py-2 rounded-lg cursor-not-allowed"
                  >
                    Registered
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex-1 bg-gray-300 text-gray-600 py-2 rounded-lg cursor-not-allowed"
                  >
                    Full
                  </button>
                )}
                <Link
                  to={`/events/${event._id}`}
                  className="flex-1 bg-cyan-400 text-gray-700 py-2 rounded-lg hover:bg-cyan-500 transition text-center"
                >
                  View Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className={`px-4 py-2 rounded-lg ${
            page === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          Prev
        </button>
        <span className="px-4 py-2 font-semibold">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className={`px-4 py-2 rounded-lg ${
            page === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
    </div>
  );
}

export default BrowseEvents;
