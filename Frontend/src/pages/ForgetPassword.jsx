import React, { useState } from "react";
import studyImage from "../assets/study.jpg";
import { auth } from "../FireBase/Firebase"; // Firebase config
import { sendPasswordResetEmail } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast"; // Toast notifications
import Loader from "../Components/preloader"; // Loader component

const ForgotPassword = () => {
  const [userID, setUserID] = useState("");
  const [loading, setLoading] = useState(false); // Manage loader visibility

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader during the process

    if (!userID) {
      toast.error("Please enter your UserID.");
      setLoading(false);
      return;
    }

    const uniqueEmail = `${userID}@example.com`; // Construct email using UserID

    try {
      await sendPasswordResetEmail(auth, uniqueEmail);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      console.error("Error sending reset email:", error);
      toast.error("Failed to send password reset email. Try again later.");
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <div className="flex min-h-screen relative">
      {/* Loader Overlay */}
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-100 bg-opacity-50">
          <Loader />
        </div>
      )}
      {/* Left side - Forgot Password Form */}
      <div className="flex justify-center items-center w-full md:w-1/2 bg-gradient-to-br from-blue-100 via-white to-gray-100 p-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-3xl font-extrabold mb-2 text-center text-blue-600">
            Forgot Password
          </h2>

          <p className="text-center text-gray-500 text-sm mb-6">
            Enter your UserID to receive a password reset email.
          </p>

          <form onSubmit={handleResetPassword}>
            <div className="mb-6">
              <label
                htmlFor="userID"
                className="block text-gray-600 text-sm font-medium mb-2"
              >
                UserID
              </label>
              <input
                type="text"
                id="userID"
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Send Reset Email
            </button>
          </form>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden md:flex md:w-1/2">
        <img
          src={studyImage}
          alt="Reset Password illustration"
          className="w-full max-h-screen object-cover"
        />
      </div>
      <Toaster position="top-right" reverseOrder={false} /> {/* Toast Notifications */}
    </div>
  );
};

export default ForgotPassword;
