import React, { useState, useEffect } from "react";
import API from "../../services/api"; // your axios instance
import { useParams } from "react-router-dom";

interface Feedback {
  _id: string;
  userId: { username: string; email: string };
  rating: number;
  comment: string;
  createdAt: string;
}

const FeedbackPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const fetchFeedback = async () => {
    try {
      const res = await API.get(`/feedback/${eventId}`);
      setFeedbacks(res.data);
    } catch (err) {
      console.error("Error fetching feedback", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post(`/feedback/${eventId}`, { rating, comment });
      setRating(0);
      setComment("");
      fetchFeedback();
    } catch (err) {
      console.error("Error submitting feedback", err);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [eventId]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Event Feedback</h1>

      {/* Submit Feedback */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 mb-8"
      >
        <label className="block mb-2 font-medium">Rating</label>
        <div className="flex space-x-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              className={`text-2xl ${
                rating >= star ? "text-yellow-500" : "text-gray-400"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <label className="block mb-2 font-medium">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
          rows={3}
          placeholder="Share your thoughts..."
        />

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onChange={handleSubmit}
        >
          Submit Feedback
        </button>
      </form>

      {/* Feedback List */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">What others said</h2>
        {feedbacks.length > 0 ? (
          <ul className="space-y-4">
            {feedbacks.map((fb) => (
              <li key={fb._id} className="border-b pb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{fb.userId.username}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(fb.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-yellow-500">
                  {"★".repeat(fb.rating)}{" "}
                  <span className="text-gray-400">
                    {"★".repeat(5 - fb.rating)}
                  </span>
                </div>
                <p className="text-gray-700">{fb.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No feedback yet.</p>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
