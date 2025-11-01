import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import AdminSidebar from "../../components/Admin/AdminSidebar"; // adjust path if needed

interface User {
  _id: string;
  username: string;
  email: string;
  phone?: string;
}

interface Registration {
  _id: string;
  userId: User;
  registeredAt: string;
}

interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
  capacity: number;
}

function RegisteredUsers() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
      fetchRegistrations();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const res = await API.get(`/events/${eventId}`);
      setEvent(res.data);
    } catch (err) {
      console.error("Failed to fetch event", err);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const res = await API.get(`/registration/${eventId}`);
      setRegistrations(res.data);
    } catch (err) {
      console.error("Failed to fetch registrations", err);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 ml-64">
        <h1 className="text-2xl font-bold mb-6">Registered Users</h1>

        {/* Event Info */}
        {event && (
          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold">{event.title}</h2>
            <p>
              {new Date(event.date).toLocaleDateString()} • {event.location}
            </p>
            <p className="text-sm text-gray-600">
              {registrations.length}/{event.capacity} users registered
            </p>
          </div>
        )}

        {/* Users Table */}
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full border-b-teal-600 border-2">
            <thead className="bg-cyan-300">
              <tr>
                <th className="p-3 border text-left">#</th>
                <th className="p-3 border text-left">Username</th>
                <th className="p-3 border text-left">Email</th>
                <th className="p-3 border text-left">Registered At</th>
              </tr>
            </thead>
            <tbody>
              {registrations.length > 0 ? (
                registrations.map((reg, index) => (
                  <tr key={reg._id} className=" bg-gray-100 hover:bg-gray-200">
                    <td className="p-3 border">{index + 1}</td>
                    <td className="p-3 border">{reg.userId.username}</td>
                    <td className="p-3 border">{reg.userId.email}</td>
                    <td className="p-3 border">
                      {new Date(reg.registeredAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="p-4 text-center text-gray-500 border"
                  >
                    No registered users
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RegisteredUsers;
