import React, { useEffect, useState } from "react";
import API from "../../services/api";

interface Feedback {
  _id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  userId: { name: string; email: string };
  eventId: { title: string; date: string };
}

const FeedbackTable: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await API.get("/feedback");
        setFeedbacks(res.data);
      } catch (err) {
        console.error("Error fetching feedback:", err);
      }
    };
    fetchFeedbacks();
  }, []);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Event Feedback & Ratings</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2">User</th>
              <th className="border border-gray-300 px-4 py-2">Event</th>
              <th className="border border-gray-300 px-4 py-2">Rating</th>
              <th className="border border-gray-300 px-4 py-2">Comment</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((f) => (
              <tr key={f._id}>
                <td className="border border-gray-300 px-4 py-2">
                  {f.userId?.name} <br />
                  <span className="text-sm text-gray-500">{f.userId?.email}</span>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {f.eventId?.title} <br />
                  <span className="text-sm text-gray-500">
                    {new Date(f.eventId?.date).toLocaleDateString()}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  ⭐ {f.rating}/5
                </td>
                <td className="border border-gray-300 px-4 py-2">{f.comment || "-"}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(f.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeedbackTable;
