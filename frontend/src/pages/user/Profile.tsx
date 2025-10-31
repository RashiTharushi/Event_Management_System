import { useEffect, useState } from "react";
import API from "../../services/api";
import defaultAvatar from "../../assets/default-profile.png"; // default image
import { Calendar, MapPin, Clock } from "lucide-react";
import UserHeaderBar from "../../components/User/UserHeaderBar";

interface User {
  _id: string;
  username: string;
  email: string;
  profileImage?: string;
}

interface Activity {
  _id: string;
  eventId: {
    _id: string;
    title: string;
    date: string;
    location: string;
  };
  createdAt: string;
}

function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState<{ username: string; email: string; profileImage?: File | null }>({
    username: "",
    email: "",
    profileImage: null,
  });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });

  useEffect(() => {
    fetchProfile();
    fetchActivity();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get("/profile");
      setUser(data);
      setFormData({ username: data.username, email: data.email, profileImage: null });
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const fetchActivity = async () => {
    try {
      const { data } = await API.get("/profile/activity");
      setActivities(data);
    } catch (err) {
      console.error("Error fetching activity:", err);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const form = new FormData();
      form.append("name", formData.username);
      form.append("email", formData.email);
      if (formData.profileImage) form.append("profileImage", formData.profileImage);

      const { data } = await API.put("/profile", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(data.user);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleChangePassword = async () => {
    try {
      await API.put("/profile/change-password", passwordData);
      alert("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "" });
      setShowPasswordForm(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "Error changing password");
    }
  };

  const completeness = (["name", "email", "profileImage"].filter((f) => (user as any)?.[f])?.length / 3) * 100;

  if (!user) return <div>Loading...</div>;

  return (
    <div>
        <UserHeaderBar/>
        <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>

      {/* Profile Card */}
      <div className="bg-white shadow rounded-lg p-6 relative hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center gap-6">
          <img
            src={user.profileImage || defaultAvatar}
            alt="Profile"
            className="w-28 h-28 rounded-full border-2 border-indigo-500 transition-transform duration-300 hover:scale-105"
          />
          <div>
            <p className="text-gray-700">
              <span className="font-semibold">Name:</span> {user.username}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
          </div>
        </div>

        {/* Profile Completeness */}
        <div className="mt-4">
          <p className="text-sm text-gray-500">Profile Completeness</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${completeness}%` }}></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            {showPasswordForm ? "Cancel" : "Change Password"}
          </button>
        </div>

        {/* Edit Profile Form */}
        {isEditing && (
          <div className="mt-6 space-y-3 border-t pt-4">
            <label className="block text-gray-700 font-medium">Name</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <label className="block text-gray-700 font-medium">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, profileImage: e.target.files?.[0] || null })}
            />

            <button
              onClick={handleUpdateProfile}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        )}

        {/* Change Password Form */}
        {showPasswordForm && (
          <div className="mt-6 space-y-3 border-t pt-4">
            <label className="block text-gray-700 font-medium">Current Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <label className="block text-gray-700 font-medium">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <button
              onClick={handleChangePassword}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Update Password
            </button>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        {activities.length === 0 ? (
          <p className="text-gray-600">No recent activity.</p>
        ) : (
          <ul className="space-y-4">
            {activities.map((act) => {
              const isUpcoming = new Date(act.eventId.date) > new Date();
              return (
                <li
                  key={act._id}
                  className={`p-4 rounded-lg border ${
                    isUpcoming ? "bg-green-50 border-green-300" : "bg-gray-50 border-gray-300"
                  }`}
                >
                  <h3 className="font-semibold">{act.eventId.title}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(act.eventId.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {act.eventId.location}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Registered on {new Date(act.createdAt).toLocaleDateString()}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
    </div>
  );
}

export default Profile;
