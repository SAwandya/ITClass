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
  const [batch, setBatch] = useState("");
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
      const examsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExams(examsArray);
    } catch (error) {
      toast.error("Failed to fetch exams.");
    }
  };

  const fetchBatches = async () => {
    try {
      const querySnapshot = await getDocs(collection(firedb, "batches"));
      const batchesArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
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
      setExams((prevExams) =>
        prevExams.map((exam, i) =>
          i === editingIndex ? { ...newExam, id: exam.id } : exam
        )
      );
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
    setExams(exams.filter((_, i) => i !== index));
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
    setBatch("");
    setTopics("");
    setExamDate("");
    setAdditionalInfo("");
  };

  return (
    <div className="flex flex-wrap justify-center items-start min-h-screen p-8">
      {/* Left Side - Exam Creation Form */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200 p-8 mr-8">
        <h2 className="text-3xl font-extrabold mb-2 text-center text-blue-600">
          {isEditing ? "Edit Exam" : "Create Exam"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Form inputs for exam details */}
          {/* Remaining form code (same as before) */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {isEditing ? "Update Exam" : "Create Exam"}
          </button>
        </form>
      </div>

      {/* Right Side - Display Exams as Cards */}
      <div className="w-full max-w-lg grid grid-cols-1 md:grid-cols-2 gap-4">
        <h2 className="text-3xl font-extrabold mb-2 text-center text-blue-600">
          Created Exams
        </h2>
        {exams.map((exam, index) => (
          <div
            key={exam.id}
            className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
          >
            <h3 className="text-2xl font-semibold text-blue-500 mb-2">
              {exam.examName}
            </h3>
            <p>
              <strong>Batch:</strong> {exam.batch}
            </p>
            <p>
              <strong>Topics:</strong> {exam.topics}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(exam.examDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Additional Info:</strong> {exam.additionalInfo || "N/A"}
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(index)}
                className="bg-yellow-400 text-white py-1 px-3 rounded-lg shadow hover:bg-yellow-500"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="bg-red-500 text-white py-1 px-3 rounded-lg shadow hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamCreate;
