import { useState, useEffect } from "react";
import axios from "axios";

const AddResult = () => {
  const [batches, setBatches] = useState([]);
  const [examsArray, setExamsArray] = useState([]);
  const [filterdExams, setFilterdExams] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [students, setStudents] = useState([]);
  const [studentsArray, setStudentsArray] = useState([]);
  const [marks, setMarks] = useState({});
  const [selectedBName, setSelectedBName] = useState("");

  // Fetch batches from the backend
  const fetchBatches = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/batch");
      setBatches(response.data); // Assuming response.data contains the batch array
    } catch (error) {
      console.error("Failed to fetch batches:", error);
    }
  };

  // Fetch exams from the backend
  const fetchExams = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/exam");
      setExamsArray(response.data); // Assuming response.data contains the exams array
    } catch (error) {
      console.error("Failed to fetch exams:", error);
    }
  };

  // Fetch students from the backend
  const fetchstudentsData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users");
      setStudentsArray(response.data); // Assuming response.data contains the students array
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  useEffect(() => {
    fetchBatches();
    fetchExams();
    fetchstudentsData();
  }, []);

  const handleBatchChange = (e) => {
    const batchId = e.target.value;

    const selectedBatch = batches.find((batch) => batch._id === batchId);
    if (selectedBatch) {
      const selectedBatchName = `${selectedBatch.year}-${selectedBatch.day}-${
        selectedBatch.medium || ""
      }`;
      setSelectedBatch(batchId);
      setSelectedBName(selectedBatchName);

      const filteredExams = examsArray.filter(
        (exam) => exam.batch?._id === batchId
      );
      setFilterdExams(filteredExams);

      console.log("filteredExams", filteredExams);

      setSelectedExam("");
      setStudents([]);
      setMarks({});
    }
  };

  const handleExamChange = (e) => {
    const examId = e.target.value;
    setSelectedExam(examId);

    if (studentsArray && selectedBName) {
      const studentsForBatch = studentsArray.filter(
        (student) => student.batch === selectedBName
      );
      setStudents(studentsForBatch);
    }
  };

  const handleMarksChange = (userID, value) => {
    setMarks({
      ...marks,
      [userID]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resultData = {
      examId: selectedExam,
      marks: marks,
    };

    try {
      await axios.post("http://localhost:5000/results", resultData);
      alert("Marks submitted successfully!");
    } catch (error) {
      console.error("Failed to submit marks:", error);
      alert("Error submitting marks.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-gray-100 p-8">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-600">
          Add Result
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="batch"
              className="block text-gray-600 text-sm font-medium mb-2"
            >
              Select Batch
            </label>
            <select
              id="batch"
              value={selectedBatch}
              onChange={handleBatchChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="" disabled>
                Select a batch
              </option>
              {batches.map((batch) => (
                <option key={batch._id} value={batch._id}>
                  {batch.year} {batch.day} {batch.medium}
                </option>
              ))}
            </select>
          </div>

          {selectedBatch && (
            <div className="mb-5">
              <label
                htmlFor="exam"
                className="block text-gray-600 text-sm font-medium mb-2"
              >
                Select Exam
              </label>
              <select
                id="exam"
                value={selectedExam}
                onChange={handleExamChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="" disabled>
                  Select an exam
                </option>
                {filterdExams?.map((exam) => (
                  <option key={exam._id} value={exam._id}>
                    {exam.examName} ({exam.examDate})
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedExam && students.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Students
              </h3>
              {students.map((student) => (
                <div key={student.userID} className="flex items-center mb-4">
                  <span className="flex-1 text-gray-600">
                    {student.userID} - {student.name}
                  </span>
                  <input
                    type="number"
                    value={marks[student.userID] || ""}
                    onChange={(e) =>
                      handleMarksChange(student.userID, e.target.value)
                    }
                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Marks"
                  />
                </div>
              ))}
            </div>
          )}

          {selectedExam && (
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Submit Marks
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddResult;
