import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccessMsg("");

    if (!/\S+@\S+\.\S+/.test(email)) {
      setServerError("Enter a valid email");
      return;
    }

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setSuccessMsg(
        "If this email exists, a reset link has been generated. (Check console log.)"
      );
      console.log("Reset link:", res.data.resetLink);
    } catch (err) {
      setServerError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Forgot Password
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
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded p-2"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Send reset link
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Remembered your password?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
