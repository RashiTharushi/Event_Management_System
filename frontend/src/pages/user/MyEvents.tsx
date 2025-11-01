import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { Calendar, MapPin, Clock, Trash2 } from "lucide-react";
import UserHeaderBar from "../../components/User/UserHeaderBar";

interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
  registeredAt: string;
}

function MyEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(6); // events per page

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const { data } = await API.get("/registration/my-events");
      // Flatten event + registration info and sort by date descending
      const flattened = data
        .map((r: any) => ({
          ...r.eventId,
          registeredAt: r.registeredAt,
        }))
        .sort((a: Event, b: Event) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setEvents(flattened);
    } catch (err) {
      console.error("Error fetching my events:", err);
    }
  };

  const handleCancel = async (eventId: string) => {
    if (!window.confirm("Are you sure you want to cancel registration?")) return;

    try {
      await API.delete(`/registration/${eventId}`);
      alert("Registration cancelled successfully!");
      fetchMyEvents();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to cancel registration");
    }
  };

  // Filter by Upcoming / Past
  const filteredEvents = events
    .filter((e) => {
      const eventDate = new Date(e.date);
      const now = new Date();
      if (filter === "upcoming") return eventDate >= now;
      if (filter === "past") return eventDate < now;
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // recent first

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / limit);
  const startIndex = (page - 1) * limit;
  const currentPageEvents = filteredEvents.slice(startIndex, startIndex + limit);

  return (
    <div>
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-full z-50">
        <UserHeaderBar />
      </div>

      {/* Main Content */}
      <div className="mx-auto p-6 pt-24">
        <h1 className="text-2xl font-bold mb-6">My Events</h1>

        {/* Filters */}
        <div className="flex gap-4 pb-5">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-semibold ${
              filter === "all" ? "bg-indigo-600 text-white" : "bg-white border"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={`px-4 py-2 rounded-lg font-semibold ${
              filter === "upcoming" ? "bg-indigo-600 text-white" : "bg-white border"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter("past")}
            className={`px-4 py-2 rounded-lg font-semibold ${
              filter === "past" ? "bg-indigo-600 text-white" : "bg-white border"
            }`}
          >
            Past
          </button>
        </div>

        {/* Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPageEvents.map((event) => {
            const eventDate = new Date(event.date);
            const now = new Date();
            const isUpcoming = eventDate >= now;
            const status = isUpcoming ? "Upcoming" : "Completed";

            return (
              <div
                key={event._id}
                className={`rounded-lg shadow p-5 flex flex-col justify-between transition ${
                  isUpcoming
                    ? "bg-green-50 border border-green-200"
                    : "bg-gray-100 border border-gray-300"
                }`}
              >
                <div>
                  <h2 className="text-lg font-bold mb-2">{event.title}</h2>
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> {eventDate.toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> {event.location}
                  </p>
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Registered:{" "}
                    {new Date(event.registeredAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Status */}
                <span
                  className={`inline-block mt-3 px-3 py-1 text-xs font-semibold rounded-full w-fit ${
                    isUpcoming ? "bg-green-200 text-green-800" : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {status}
                </span>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  {isUpcoming && (
                    <button
                      onClick={() => handleCancel(event._id)}
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Cancel
                    </button>
                  )}
                  <Link
                    to={`/events/${event._id}`}
                    className="flex-1 bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-700 transition text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
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
        )}
      </div>
    </div>
  );
}

export default MyEvents;
