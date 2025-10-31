import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { Pencil, Trash2, Plus, Users, X } from "lucide-react";
import AdminSidebar from "../../components/Admin/AdminSidebar"; // adjust path if needed

interface Event {
  _id: string;
  title: string;
  description?: string;
  date: string;
  location: string;
  capacity: number;
}

function ManageEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [newEvent, setNewEvent] = useState<Omit<Event, "_id">>({
    title: "",
    description: "",
    date: "",
    location: "",
    capacity: 0,
  });
  const [editEvent, setEditEvent] = useState<Event | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async (): Promise<void> => {
    try {
      const res = await API.get<Event[]>("/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events", err);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await API.delete(`/events/${id}`);
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Error deleting event", err);
    }
  };

  const handleAddEvent = async (): Promise<void> => {
    try {
      const res = await API.post("/events", newEvent);
      setEvents((prev) => [...prev, res.data.event]);
      setShowAddModal(false);
      setNewEvent({
        title: "",
        description: "",
        date: "",
        location: "",
        capacity: 0,
      });
    } catch (err) {
      console.error("Error adding event", err);
    }
  };

  const handleEdit = (event: Event): void => {
    setEditEvent(event);
    setShowEditModal(true);
  };

  const handleUpdateEvent = async (): Promise<void> => {
    if (!editEvent) return;
    try {
      const res = await API.put(`/events/${editEvent._id}`, editEvent);
      setEvents((prev) =>
        prev.map((e) => (e._id === editEvent._id ? res.data : e))
      );
      setShowEditModal(false);
      setEditEvent(null);
    } catch (err) {
      console.error("Error updating event", err);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Events</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
          >
            <Plus size={18} /> Add Event
          </button>
        </div>

        {/* Events Table */}
        <div className="overflow-x-auto bg-white shadow rounded-xl">
          <table className="w-full border-collapse">
            <thead className="bg-blue-200">
              <tr>
                <th className="p-3 border text-left">#</th>
                <th className="p-3 border text-left">Title</th>
                <th className="p-3 border text-left">Date</th>
                <th className="p-3 border text-left">Location</th>
                <th className="p-3 border text-left">Capacity</th>
                <th className="p-3 border text-center">Users</th>
                <th className="p-3 border text-center">Edit</th>
                <th className="p-3 border text-center">Remove</th>
              </tr>
            </thead>
            <tbody>
              {events.length > 0 ? (
                events.map((event, index) => (
                  <tr key={event._id} className="bg-gray-100 hover:bg-gray-200">
                    <td className="p-3 border">{index + 1}</td>
                    <td className="p-3 border">{event.title}</td>
                    <td className="p-3 border">
                      {new Date(event.date).toLocaleDateString()}
                    </td>
                    <td className="p-3 border">{event.location}</td>
                    <td className="p-3 border">{event.capacity}</td>
                    <td className="p-3 border text-center">
                      <button
                        onClick={() => navigate(`/admin/events/${event._id}/users`)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Users size={18} />
                      </button>
                    </td>
                    <td className="p-3 border text-center">
                      <button
                        onClick={() => handleEdit(event)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={18} />
                      </button>
                    </td>
                    <td className="p-3 border text-center">
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="p-4 text-center text-gray-500 border"
                  >
                    No events available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Event Modal */}
        {showAddModal && (
          <EventModal
            title="Add Event"
            eventData={newEvent}
            setEventData={setNewEvent}
            onClose={() => setShowAddModal(false)}
            onSave={handleAddEvent}
          />
        )}

        {/* Edit Event Modal */}
        {showEditModal && editEvent && (
          <EventModal
            title="Edit Event"
            eventData={editEvent}
            setEventData={(updater) =>
              setEditEvent((prev) =>
                prev ? (typeof updater === "function" ? updater(prev) : updater) : prev
              )
            }
            onClose={() => {
              setShowEditModal(false);
              setEditEvent(null);
            }}
            onSave={handleUpdateEvent}
          />
        )}
      </div>
    </div>
  );
}

/* ---------- Reusable Modal Component ---------- */
interface ModalProps<T> {
  title: string;
  eventData: T;
  setEventData: React.Dispatch<React.SetStateAction<T>>;
  onClose: () => void;
  onSave: () => void;
}

function EventModal<
  T extends { title: string; description?: string; date: string; location: string; capacity: number }
>({
  title,
  eventData,
  setEventData,
  onClose,
  onSave,
}: ModalProps<T>) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title"
            value={eventData.title}
            onChange={(e) =>
              setEventData((prev) => ({ ...prev, title: e.target.value }))
            }
            className="border p-2 rounded"
          />
          <textarea
            placeholder="Description"
            value={eventData.description}
            onChange={(e) =>
              setEventData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={eventData.date}
            onChange={(e) =>
              setEventData((prev) => ({ ...prev, date: e.target.value }))
            }
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Location"
            value={eventData.location}
            onChange={(e) =>
              setEventData((prev) => ({ ...prev, location: e.target.value }))
            }
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Capacity"
            value={eventData.capacity}
            onChange={(e) =>
              setEventData((prev) => ({
                ...prev,
                capacity: Number(e.target.value),
              }))
            }
            className="border p-2 rounded"
          />
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManageEventsPage;
