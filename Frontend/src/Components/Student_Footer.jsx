import React from "react";
import { Link } from "react-router-dom";
import youtubeIcon from "../assets/youtube.png"; // Adjust the path as necessary
import facebookIcon from "../assets/facebook.png"; // Adjust the path as necessary
import whatsappIcon from "../assets/whatsapp.png"; // Adjust the path as necessary
import mailIcon from "../assets/mail.png"; // Adjust the path as necessary

const StudentFooter = () => {
  return (
    <footer className="bg-white text-white shadow-md mt-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center p-4">
        {/* Logo */}
        <div className="text-2xl font-bold mb-4 md:mb-0">
          <Link to="/" className="text-blue-600">
            Student LMS
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8 mb-4 md:mb-0 text-lg md:text-xl">
          <Link
            to="/student-dashboard"
            className="hover:text-blue-300 text-blue-600 font-bold"
          >
            Home
          </Link>
          <Link
            to="/profile"
            className="hover:text-blue-300 text-blue-600 font-bold"
          >
            Profile
          </Link>
        </nav>

        {/* Social Media Links */}
        <div className="flex space-x-4">
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={youtubeIcon} alt="YouTube" className="w-8 h-8" />
          </a>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={facebookIcon} alt="Facebook" className="w-8 h-8" />
          </a>
          <a href="/" target="_blank" rel="noopener noreferrer">
            <img src={whatsappIcon} alt="WhatsApp" className="w-8 h-8" />
          </a>
          <a href="/" target="_blank" rel="noopener noreferrer">
            <img src={mailIcon} alt="Mail" className="w-8 h-8" />
          </a>
        </div>
      </div>

    

      <div className="text-sm text-center bg-sky-100 py-2 text-black">
        © {new Date().getFullYear()} Student LMS
      </div>
    </footer>
  );
};

export default StudentFooter;
