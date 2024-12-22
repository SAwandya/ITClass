import { useState, useEffect } from "react";
import { firedb } from "../FireBase/Firebase";
import { collection, getDocs } from "firebase/firestore";

const AddResult = () => {
  const [batches, setBatches] = useState([]);
  const [examsArray, setExamsArray] = useState([]);
  const [filterdExams, setFilterdExams] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [students, setStudents] = useState([]);
  const [studentsArray, setStudentsArray] = useState([]);
  // const[filterdStudents, setFilteredStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [selectedBName, setSelectedBName] = useState("");

  const fetchBatches = async () => {
    try {
      const querySnapshot = await getDocs(collection(firedb, "batches"));
      const batchesArray = [];
      querySnapshot.forEach((doc) => {
        batchesArray.push({ id: doc.id, ...doc.data() });
      });
      setBatches(batchesArray);
    } catch (error) {
      console.error("Failed to fetch batches:", error);
    }
  };

  const fetchExams = async () => {
    try {
      const querySnapshot = await getDocs(collection(firedb, "exams"));
      const examsArray = [];
      querySnapshot.forEach((doc) => {
        examsArray.push({ id: doc.id, ...doc.data() });
      });
      setExamsArray(examsArray);
    } catch (error) {
      console.error("Failed to fetch exams:", error);
    }
  };

  const fetchstudentsData = async () => {
    try{
      const querySnapshot = await getDocs(collection(firedb, "students"));
      const studentsArray = [];
      querySnapshot.forEach((doc) => {
        studentsArray.push({ id: doc.id, ...doc.data() });
      });
      console.log("Fetched students:", studentsArray); // Add this log
      setStudentsArray(studentsArray);
      // return studentsArray;
    }catch(error){
      console.error("Failed to fetch students:", error);
    }
  }

  useEffect(() => {
    fetchBatches();
    fetchExams();
    fetchstudentsData();
  }, []);
  useEffect(() => {
    console.log("Selected batch updated:", selectedBatch);
  }, [selectedBatch]); // Log whenever selectedBatch changes


  const handleBatchChange = (e) => {
    const batchId = e.target.value;
    console.log("batchID: ", batchId);

    // Find the selected batch object from the batches array
    const selectedBatch = batches.find(batch => batch.id === batchId);

    if (selectedBatch) {
      const selectedBatchName = `${selectedBatch.year}-${selectedBatch.day}-${selectedBatch.medium || ''}`;
      console.log("selectedBatchName:", selectedBatchName);

      // Update the selected batch state with the batch ID (not the batch name)
      setSelectedBatch(batchId);
      setSelectedBName(selectedBatchName)
      // Filter exams based on the selected batch id
      const filteredExams = examsArray.filter(
        (exam) => exam.batch?.id === batchId // Use batch ID to filter exams
      );
      setFilterdExams(filteredExams);

      // Clear other selections and data
      setSelectedExam("");
      setStudents([]); // Clear students when batch changes
      setMarks({}); // Clear marks when batch changes
    }
  };

const handleExamChange = (e) => {
  const examId = e.target.value;
  setSelectedExam(examId);

  // Check if studentsArray is populated and selectedBatch exists
  if (studentsArray && selectedBName) {
    // Filter students based on the selected batch ID, not batch name
    console.log("students array: ", studentsArray)
    console.log("selecetd B Name: ", selectedBName)
    const studentsForBatch = studentsArray.filter(
      (student) => student.batch === selectedBName // Ensure batch ID is used for comparison
    );

    console.log(studentsForBatch); // Log filtered students
    setStudents(studentsForBatch); // Set filtered students
  }
};




  // const handleExamChange = (e) => {
  //   const exam = e.target.value;
  //   setSelectedExam(exam);
  //   // setStudents(studentsArray[selectedBatch]);
  //   // Check if studentsArray is populated and selectedBatch exists
  //   if (studentsArray && selectedBatch) {
  //     const studentsForBatch = studentsArray.filter(
  //       (student) => student.batch === selectedBatch
  //     );
  //     console.log(studentsArray)
  //     console.log(selectedBatch)
  //     console.log(studentsForBatch)
  //     setStudents(studentsForBatch);
  //   }
  // };

  const handleMarksChange = (userID, value) => {
    setMarks({
      ...marks,
      [userID]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Marks:", marks);
    // Add submission logic here
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
                <option key={batch.id} value={batch.id}>
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
                {filterdExams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.examName} ({exam.examDate})
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedExam && students.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Students</h3>
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
