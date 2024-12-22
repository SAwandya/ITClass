import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { signOut } from "firebase/auth"; // Import signOut from Firebase
import { auth } from "../FireBase/Firebase"; // Firebase configuration

const AdminHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user from Firebase
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto flex flex-wrap justify-between items-center p-4">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link to="/">LMS</Link>
        </div>

        {/* Hamburger Menu for Smaller Screens */}
        <div className="block lg:hidden">
          <button
            className="text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 7.5h16.5M3.75 12h16.5m-16.5 4.5h16.5"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav
          className={`${
            isMenuOpen ? "block" : "hidden"
          } lg:flex flex-col lg:flex-row lg:items-center lg:space-x-8 mt-4 lg:mt-0 text-lg w-full lg:w-auto transition-all duration-300 ease-in-out`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 space-y-4 lg:space-y-0 w-full">
            <Link to="/overall-display" className="hover:text-blue-100 text-xl font-bold">
              Home
            </Link>
            <Link to="/batch-create" className="hover:text-blue-100 text-xl font-bold">
              Batch
            </Link>
            <Link to="/exam-create" className="hover:text-blue-100 text-xl font-bold">
              Exam
            </Link>
            <Link to="/show-result" className="hover:text-blue-100 text-xl font-bold">
              Result
            </Link>
            <Link to="/instructor-register" className="hover:text-blue-100 text-xl font-bold">
              Instructors
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md lg:ml-auto"
            >
              Logout
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default AdminHeader;
