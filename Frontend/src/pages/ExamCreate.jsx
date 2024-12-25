import React, { useEffect, useState } from "react";
import { firedb } from "../FireBase/Firebase"; // Adjust path as necessary
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import toast from "react-hot-toast/headless";
import useBatches from "../hooks/useBatches";
import axios from "axios";
import useExams from "../hooks/useExams";

const ExamCreate = () => {
  const [examName, setExamName] = useState("");
  const [batch, setBatch] = useState({});
  const [topics, setTopics] = useState("");
  const [examDate, setExamDate] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [exams, setExams] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [batchArray, setBatchArray] = useState([]);
  const [error, setError] = useState(null); // State to handle errors
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [updateExamId, setUpdateExamId] = useState(null);

  const { data: allexam } = useExams();

  const { data, isLoading } = useBatches();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing) {
      const examToEdit = {
        additionalInfo: additionalInfo,
        examDate: examDate,
        examName: examName,
        topics: topics,
        batch: batch._id,
      };

      axios
        .put(`http://localhost:3000/api/exam/${updateExamId}`, examToEdit)
        .then((res) => {
          console.log("exam response: ", res);
        })
        .catch((err) => {
          console.log("exam error: ", err);
        });

      setIsEditing(false);
    } else {
      const newExam = { examName, batch, topics, examDate, additionalInfo };

      axios
        .post("http://localhost:3000/api/exam", newExam)
        .then((res) => {
          console.log("exam response: ", res);
        })
        .catch((err) => {
          console.log("exam error: ", err);
        });
    }

    resetForm();
  };

  const handleDelete = async (id) => {
    axios
      .delete(`http://localhost:3000/api/exam/${id}`)
      .then((res) => {
        console.log("exam response: ", res);
      })
      .catch((err) => {
        console.log("exam error: ", err);
      });
  };

  const handleEdit = (exam) => {
    const convertedDate = new Date(exam.examDate).toISOString().split("T")[0];

    setUpdateExamId(exam._id);
    setExamName(exam.examName);
    setBatch(exam.batch);
    setTopics(exam.topics);
    setExamDate(convertedDate);
    setAdditionalInfo(exam.additionalInfo);
    setIsEditing(true);
  };

  const resetForm = () => {
    setExamName("");
    setBatch({});
    setTopics("");
    setExamDate("");
    setAdditionalInfo("");
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start min-h-screen p-8">
      {/* Left Side - Exam Creation Form */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8 lg:mb-0 lg:mr-8">
        <h2 className="text-3xl font-extrabold mb-2 text-center text-blue-600">
          {isEditing ? "Edit Exam" : "Create Exam"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="examName"
              className="block text-gray-600 text-sm font-medium mb-2"
            >
              Exam Name
            </label>
            <input
              type="text"
              id="examName"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
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
              aria-placeholder="Select batch"
              onChange={(e) => setBatch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="" disabled>
                Select batch
              </option>

              {data?.map((batch) => (
                <option value={batch._id} key={batch._id}>
                  {batch.year} {batch.day} {batch.medium}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-5">
            <label
              htmlFor="topics"
              className="block text-gray-600 text-sm font-medium mb-2"
            >
              Topics
            </label>
            <textarea
              id="topics"
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="examDate"
              className="block text-gray-600 text-sm font-medium mb-2"
            >
              Exam Date
            </label>
            <input
              type="date"
              id="examDate"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-8">
            <label
              htmlFor="additionalInfo"
              className="block text-gray-600 text-sm font-medium mb-2"
            >
              Additional Information
            </label>
            <textarea
              id="additionalInfo"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {isEditing ? "Update Exam" : "Create Exam"}
          </button>
        </form>
      </div>

      {/* Right Side - List of Created Exams */}
      <div className="w-full max-w-lg">
        <h2 className="text-3xl font-extrabold mb-2 text-center text-blue-600">
          Created Exams
        </h2>
        <ul>
          {allexam?.map((exam, index) => (
            <li
              key={exam._id}
              className="bg-gray-100 p-4 mb-3 rounded-lg shadow"
            >
              <div className="mb-2">
                <strong>Exam Name:</strong> {exam.examName}
              </div>
              <div className="mb-2">
                <strong>Batch: </strong> {exam.batch?.year} {exam.batch?.day}{" "}
                {exam.batch?.medium}
              </div>
              <div className="mb-2">
                <strong>Topics:</strong> {exam.topics}
              </div>
              <div className="mb-2">
                <strong>Exam Date:</strong>{" "}
                {new Date(exam.examDate).toLocaleDateString()}
              </div>
              <div className="mb-2">
                <strong>Additional Info:</strong> {exam.additionalInfo || "N/A"}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => handleEdit(exam)}
                  className="mr-2 bg-yellow-400 text-white py-1 px-3 rounded-lg shadow hover:bg-yellow-500 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(exam._id)}
                  className="bg-red-500 text-white py-1 px-3 rounded-lg shadow hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExamCreate;
