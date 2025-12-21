import { useEffect, useState } from "react";
import api from "../api/axiosClient";

export default function HomePage({ user }) {
  const [posts, setPosts] = useState([]);   // always an array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/posts")
      .then((res) => {
        // backend returns an array of posts
        setPosts(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Error loading posts:", err);
        setPosts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4">Loading feed...</div>;

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Social Media App</h1>
        <span className="text-sm">Hi, {user.username}</span>
      </header>

      <main className="max-w-2xl mx-auto p-4">
        {posts.length === 0 && (
          <p className="text-gray-500 text-sm">No posts yet.</p>
        )}

        {posts.map((p) => (
          <div
            key={p.id}
            className="bg-white p-4 mb-4 rounded shadow border border-gray-100"
          >
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-blue-200 rounded-full mr-2" />
              <div>
                <p className="font-semibold text-sm">{p.username}</p>
                {p.createdAt && (
                  <p className="text-xs text-gray-500">
                    {new Date(p.createdAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            <p className="mb-2 text-sm">{p.caption}</p>
            {p.image && (
              <img
                src={p.image}
                alt="Post"
                className="w-full rounded mb-2 max-h-80 object-cover"
              />
            )}
          </div>
        ))}
      </main>
    </div>
  );
}
