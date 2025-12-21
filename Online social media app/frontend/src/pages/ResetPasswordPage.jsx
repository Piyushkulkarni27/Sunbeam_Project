import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axiosClient";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccessMsg("");

    if (password.length < 6) {
      setServerError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setServerError("Passwords do not match");
      return;
    }

    try {
      await api.post("/auth/reset-password", { token, password });
      setSuccessMsg("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setServerError(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Reset Password
        </h2>

        {serverError && (
          <p className="text-red-500 text-sm mb-3 text-center">
            {serverError}
          </p>
        )}
        {successMsg && (
          <p className="text-green-600 text-sm mb-3 text-center">
            {successMsg}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-medium mb-1">New Password</label>
            <input
              type="password"
              className="w-full border rounded p-2"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full border rounded p-2"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Reset password
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Back to{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
