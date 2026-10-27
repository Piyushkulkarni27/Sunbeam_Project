import { useEffect, useState } from "react";
import api from "../api/axiosClient";

export default function ProfilePage({ user }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // all posts by current user
    api
      .get("/posts")
      .then((res) => {
        const all = Array.isArray(res.data) ? res.data : [];
        setPosts(all.filter((p) => p.username === user.username));
      })
      .catch((err) => {
        console.error("Profile posts error:", err.response?.data);
      });
  }, [user.username]);

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Profile</h1>
      </header>

      <main className="max-w-3xl mx-auto p-4">
        {/* User info */}
        <div className="bg-white p-4 rounded shadow mb-4 flex items-center">
          <div className="w-20 h-20 bg-blue-200 rounded-full mr-4" />
          <div>
            <p className="font-bold text-lg">{user.username}</p>
            <p className="text-gray-600 text-sm">{user.email}</p>
            <p className="text-gray-500 text-xs mt-1">
              Posts: {posts.length}
            </p>
          </div>
        </div>

        {/* Posts grid */}
        <h2 className="font-semibold mb-2">Your Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-500 text-sm">You have not posted yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {posts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded shadow-sm overflow-hidden text-sm"
              >
                {p.image && (
                  <img
                    src={p.image}
                    alt="Post"
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-2">
                  <p className="font-medium truncate">{p.caption}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
