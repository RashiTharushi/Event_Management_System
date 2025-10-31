import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../services/api";
import { Calendar, MapPin, Users, Star, CheckCircle } from "lucide-react";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  registrantsCount: number;
  imageUrl?: string;
  avgRating?: number;
}

const EventDetails: React.FC = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [status, setStatus] = useState<"Open" | "Registered" | "Full">("Open");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.get(`/events/${eventId}`);
        setEvent(res.data);

        // Example status logic
        if (res.data.registrantsCount >= res.data.capacity) {
          setStatus("Full");
        } else {
          setStatus("Open");
        }
      } catch (err) {
        console.error("Error fetching event:", err);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleRegister = async (eventId: string) => {
    try {
      await API.post(`/registration/${eventId}`);
      setStatus("Registered");
      alert("Successfully registered!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  if (!event) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-gray-600">Loading event...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Banner */}
      <div className="relative w-full h-60">
        <img
          src={
            event.imageUrl ||
            "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
          }
          alt={event.title}
          className="w-full h-full object-cover rounded-b-3xl"
        />
        <div className="absolute inset-0 bg-cyan-600 bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg text-center">
            {event.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 mt-10 bg-white shadow-lg rounded-2xl p-8 space-y-6">
        {/* Date */}
        <div className="flex items-center gap-3 text-gray-700">
          <Calendar className="w-6 h-6 text-blue-600" />
          <p className="text-lg font-medium">
            {new Date(event.date).toLocaleDateString()}{" "}
            {new Date(event.date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Location */}
        <div className="flex items-center gap-3 text-gray-700">
          <MapPin className="w-6 h-6 text-red-600" />
          <p className="text-lg font-medium">{event.location}</p>
        </div>

        {/* Registrations */}
        <div className="flex items-center gap-3 text-gray-700">
          <Users className="w-6 h-6 text-green-600" />
          <p className="text-lg">
            {event.registrantsCount}/{event.capacity} Registered
          </p>
        </div>

        {/* Rating */}
        {event.avgRating && (
          <div className="flex items-center gap-3 text-yellow-500">
            <Star className="w-6 h-6" />
            <p className="text-lg">{event.avgRating.toFixed(1)} / 5</p>
          </div>
        )}

        {/* Description */}
        <div>
          <h2 className="text-xl font-semibold mb-2">About this Event</h2>
          <p className="text-gray-700 leading-relaxed justify-center">{event.description}</p>
        </div>

        {/* Status Badge */}
        <span
          className={`inline-block mt-3 px-3 py-1 text-sm font-semibold rounded-full w-fit ${
            status === "Open"
              ? "bg-green-100 text-green-700"
              : status === "Registered"
              ? "bg-blue-100 text-blue-700 flex items-center gap-1"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status === "Registered" && <CheckCircle className="w-4 h-4 inline" />}{" "}
          {status}
        </span>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          {status === "Open" ? (
            <button
              onClick={() => handleRegister(event._id)}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Register
            </button>
          ) : status === "Registered" ? (
            <button
              disabled
              className="flex-1 bg-blue-200 text-blue-700 py-3 rounded-lg cursor-not-allowed"
            >
              Registered
            </button>
          ) : (
            <button
              disabled
              className="flex-1 bg-gray-300 text-gray-600 py-3 rounded-lg cursor-not-allowed"
            >
              Full
            </button>
          )}

          <Link
            to={`/feedback/${event._id}`}
            className="flex-1 text-center px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          >
            Leave Feedback
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
