import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosClient";

export default function HomePage({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    api
      .get("/posts")
      .then((res) => setPosts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await api.post("/auth/logout");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen w-screen bg-gray-100 font-sans pb-16">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Social Media App</h1>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search..."
            className="p-2 rounded-lg text-black"
          />
          <div className="w-10 h-10 bg-white rounded-full" />
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-3 py-1 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {loading && (
          <p className="text-gray-500 text-sm mb-2">Loading feed...</p>
        )}
        {!loading && posts.length === 0 && (
          <p className="text-gray-500 text-sm">No posts yet.</p>
        )}
        {/* your posts map here */}
      </main>

      <nav className="bg-blue-600 text-white p-4 fixed bottom-0 w-full flex justify-around">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/stories" className="hover:underline">
          Stories
        </Link>
        <span>Chats</span>
        <span>reels</span>
        <Link to="/profile" className="hover:underline">
          Profile
        </Link>
      </nav>
    </div>
  );
}
