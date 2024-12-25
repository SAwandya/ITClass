import React, { useEffect, useState } from "react";
import studyImage from "../assets/study.jpg";
import { toast, Toaster } from "react-hot-toast";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firedb } from "../FireBase/Firebase"; // Firestore config
import { collection, addDoc, doc, getDoc, setDoc } from "firebase/firestore"; // Firestore imports
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Loader from "../Components/preloader"; // Import your preloader component
import { getDocs } from "firebase/firestore";
import axios from "axios";
const Register = () => {
  const [fullName, setFullName] = useState("");
  const [batch, setBatch] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [school, setSchool] = useState(""); // New state for school
  const [email, setEmail] = useState(""); // New state for email
  const [batches, setBatchArray] = useState([]);
  const [userID, setUserID] = useState("");
  const [loading, setLoading] = useState(false); // State to manage loader visibility
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const fetchBatches = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/batch");
      setBatchArray(response.data); // Assuming response.data contains the batch array
    } catch (error) {
      console.error("Failed to fetch batches:", error);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const generateUserID = async (batch) => {
    const batchDetails = batch.split("-");
    const year = batchDetails[0].slice(2);
    const day = batchDetails[1].slice(0, 3);
    const medium = batchDetails[2].charAt(0);

    const userIDPrefix = `${year}${day}${medium}`;

    const batchCounterRef = doc(firedb, "batchCounters", `${userIDPrefix}`);

    try {
      const batchCounterDoc = await getDoc(batchCounterRef);
      let newUserID;

      if (batchCounterDoc.exists()) {
        const lastUserID = batchCounterDoc.data().lastUserID || 0;
        const nextID = lastUserID + 1;
        newUserID = `${userIDPrefix}${nextID.toString().padStart(3, "0")}`;
        await setDoc(batchCounterRef, { lastUserID: nextID });
      } else {
        newUserID = `${userIDPrefix}001`;
        await setDoc(batchCounterRef, { lastUserID: 1 });
      }

      setUserID(newUserID);
      return newUserID;
    } catch (error) {
      console.error("Error generating userID:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !batch || !phoneNumber || !password || !school || !email) {
      toast.error("Please fill in all the fields.");
      return;
    }

    if (phoneNumber.length !== 10) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Please provide a valid email address.");
      return;
    }

    const generatedUserID = await generateUserID(batch);

    const data = {
      userId: generatedUserID,
      name: fullName,
      email,
      password,
      school,
      batch,
      phone: phoneNumber,
    };

    try {
      const uniqueEmail = `${generatedUserID}@example.com`;

      const res = await axios.post("http://localhost:3000/api/users", data)

      console.log("Response:", res);

      setFullName("");
      setBatch("");
      setPhoneNumber("");
      setPassword("");
      setSchool("");
      setEmail("");
      setUserID("");

      toast.success("User registered successfully!");

      navigate("/profile");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      console.error("Error registering user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-100 bg-opacity-50">
          <Loader />
        </div>
      )}

      <div className="hidden md:flex md:w-1/2">
        <img
          src={studyImage}
          alt="Register illustration"
          className="w-full max-h-screen object-cover"
        />
      </div>

      <div className="flex justify-center items-center w-full md:w-1/2 bg-gradient-to-bl from-blue-100 via-white to-gray-100 p-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-3xl font-extrabold mb-2 text-center text-blue-600">
            Register
          </h2>
          <p className="text-center text-gray-500 text-sm mb-6">
            Create your account by filling in the details below.
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
                htmlFor="school"
                className="block text-gray-600 text-sm font-medium mb-2"
              >
                School
              </label>
              <input
                type="text"
                id="school"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-gray-600 text-sm font-medium mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="batch"
                className="block text-gray-600 text-sm font-medium mb-2"
              >
                Batch
              </label>
              <select
                id="batch"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="" disabled>
                  Select your batch
                </option>
                {batches?.map((batch) => (
                  <option
                    value={`${batch.year}-${batch.day}-${batch.medium}`}
                    key={batch._id}
                  >
                    {batch.year} {batch.day} {batch.medium}
                  </option>
                ))}
              </select>
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
                placeholder="********"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 hover:bg-blue-700"
            >
              Register
            </button>
          </form>
          <Toaster />
        </div>
      </div>
    </div>
  );
};

export default Register;
