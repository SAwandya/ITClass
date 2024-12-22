import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firedb } from "../FireBase/Firebase"; // Firestore config
import { collection, addDoc, setDoc, doc } from "firebase/firestore"; // Firestore imports
import axios from "axios";

const InstructorRegister = () => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !phoneNumber || !userID || !password) {
      toast.error("Please fill in all the fields.");
      return;
    }

    if (phoneNumber.length !== 10) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    if (!/^(in[0-9]+)$/.test(userID)) {
      toast.error("User ID must start with 'in' followed by numbers.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    try {
      // Create a unique email by appending a timestamp
      const uniqueEmail = `${userID}@example.com`;

      const data = {
        name: fullName,
        phone: phoneNumber,
        password,
        userId: userID,
        role: "instructor",
      };

      console.log("Instructer data:", data);

      const res = await axios.post("http://localhost:3000/api/users", data);

      console.log("Instructor registered:", res);

      // Reset input fields after successful registration
      setFullName("");
      setPhoneNumber("");
      setUserID("");
      setPassword("");

      toast.success("Instructor registered successfully!");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      console.error("Error registering instructor:", error);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gradient-to-bl from-blue-100 via-white to-gray-100 p-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <h2 className="text-3xl font-extrabold mb-2 text-center text-blue-600">
          Instructor Register
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Create your instructor account by filling in the details below.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="fullName"
              className="block text-gray-600 text-sm font-medium mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="phoneNumber"
              className="block text-gray-600 text-sm font-medium mb-2"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="0777 xxxxxx"
              pattern="[0-9]{10}"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <small className="text-red-500 text-xs">
              Phone number must be exactly 10 digits.
            </small>
          </div>

          <div className="mb-5">
            <label
              htmlFor="userID"
              className="block text-gray-600 text-sm font-medium mb-2"
            >
              User ID
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
              placeholder="At least 8 characters"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <small className="text-red-500 text-xs">
              Password must be at least 8 characters.
            </small>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Register
          </button>
        </form>
      </div>

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default InstructorRegister;
