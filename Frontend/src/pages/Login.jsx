import React, { useState } from "react";
import studyImage from "../assets/study.jpg";
import { auth } from "../FireBase/Firebase"; // Firebase config
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast"; // Import toast for notifications
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Loader from "../Components/preloader"; // Import your preloader component
import axios from "axios";

const Login = () => {
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // State to manage loader visibility
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader when the login process starts

    // Create a unique email based on the UserID
    const uniqueEmail = `${userID}@example.com`;

    try {
      // Sign in the user with Firebase Authentication
      const res = await axios.post("http://localhost:3000/api/auth", {
        email: userID,
        password: password,
      });
      console.log("Login successful:", res);
      toast.success("Login successful!"); // Notify the user
      
      // Redirect the user after successful login
      // navigate("/dashboard"); 
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your credentials and try again."); // Notify the user of the error
    } finally {
      setLoading(false); // Hide loader after the process is complete
    }
  };

  const handleRegister = () => {
    // Redirect to the registration page
    navigate("/register");
  };

  return (
    <div className="flex min-h-screen relative">
      {/* Display Loader */}
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-100 bg-opacity-50">
          <Loader />
        </div>
      )}
      {/* Left side - Login Form */}
      <div className="flex justify-center items-center w-full md:w-1/2 bg-gradient-to-br from-blue-100 via-white to-gray-100 p-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-3xl font-extrabold mb-2 text-center text-blue-600">
            Login
          </h2>

          {/* Welcome Message */}
          <p className="text-center text-gray-500 text-sm mb-6">
            Welcome back! Please log in to your account.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
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
            <div className="mb-8">
              <label
                htmlFor="password"
                className="block text-gray-600 text-sm font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <div className="text-right text-sm mt-3 ">
                <a href="/forgot-password">Forget Password</a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Login
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-4 text-center text-gray-600">
            No account yet?{" "}
            <span
              onClick={handleRegister}
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
      {/* Right side - Image */}
      <div className="hidden md:flex md:w-1/2">
        <img
          src={studyImage}
          alt="Login illustration"
          className="w-full max-h-screen object-cover"
        />
      </div>
      <Toaster position="top-right" reverseOrder={false} />{" "}
      {/* Toast notifications */}
    </div>
  );
};

export default Login;
