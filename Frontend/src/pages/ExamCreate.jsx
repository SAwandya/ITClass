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

  const fetchExams = async () => {
    try {
      const querySnapshot = await getDocs(collection(firedb, "exams"));
      const examsArray = [];
      querySnapshot.forEach((doc) => {
        examsArray.push({ id: doc.id, ...doc.data() });
      });
      setExams(examsArray);
    } catch (error) {
      toast.error("Failed to fetch exams.");
    }
  };

  const fetchBatches = async () => {
    try {
      const querySnapshot = await getDocs(collection(firedb, "batches"));
      const batchesArray = [];
      querySnapshot.forEach((doc) => {
        batchesArray.push({ id: doc.id, ...doc.data() });
      });
      console.log("Batches:", batchesArray);
      setBatchArray(batchesArray);
    } catch (error) {
      toast.error("Failed to fetch batches.");
    }
  };

  useEffect(() => {
    fetchBatches();
    fetchExams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newExam = { examName, batch, topics, examDate, additionalInfo };

    if (isEditing) {
      const examRef = doc(firedb, "exams", exams[editingIndex].id);
      await updateDoc(examRef, newExam);
      const updatedExams = [...exams];
      updatedExams[editingIndex] = { ...newExam, id: exams[editingIndex].id };
      setExams(updatedExams);
      setIsEditing(false);
    } else {
      const docRef = await addDoc(collection(firedb, "exams"), newExam);
      setExams([...exams, { id: docRef.id, ...newExam }]);
    }

    resetForm();
  };

  const handleDelete = async (index) => {
    const examToDelete = exams[index];
    await deleteDoc(doc(firedb, "exams", examToDelete.id));
    const newExams = exams.filter((_, i) => i !== index);
    setExams(newExams);
  };

  const handleEdit = (index) => {
    const examToEdit = exams[index];
    setExamName(examToEdit.examName);
    setBatch(examToEdit.batch);
    setTopics(examToEdit.topics);
    setExamDate(examToEdit.examDate);
    setAdditionalInfo(examToEdit.additionalInfo);
    setIsEditing(true);
    setEditingIndex(index);
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
              onChange={(e) =>
                setBatch(batchArray.find((b) => b.id === e.target.value))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="" disabled>
                Select batch
              </option>

              {batchArray.map((batch) => (
                <option value={batch.id} key={batch.id}>
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
          {exams.map((exam, index) => (
            <li
              key={exam.id}
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
                  onClick={() => handleEdit(index)}
                  className="mr-2 bg-yellow-400 text-white py-1 px-3 rounded-lg shadow hover:bg-yellow-500 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(index)}
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
