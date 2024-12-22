import React, { useState } from 'react';

const ShowResult = () => {
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [students, setStudents] = useState([]);
  const [editStudent, setEditStudent] = useState(null);
  const [editedResult, setEditedResult] = useState('');

  // Dummy data
  const batches = ['25SE', '24SM', '23SE'];
  const exams = {
    '25SE': ['Operating Systems', 'Monthly Exam', 'Revision Exam 1'],
    '24SM': ['Data Structures', 'Monthly Exam', 'Revision Exam 1'],
    '23SE': ['Database Systems', 'Monthly Exam', 'Revision Exam 1']
  };
  const studentsData = {
    '25SE': [
      { userID: '1001', name: 'John Doe', result: '85' },
      { userID: '1002', name: 'Jane Smith', result: '90' }
    ],
    '24SM': [
      { userID: '1003', name: 'Alice Brown', result: '78' },
      { userID: '1004', name: 'Bob Johnson', result: '82' }
    ],
    '23SE': [
      { userID: '1005', name: 'Charlie Davis', result: '88' },
      { userID: '1006', name: 'Diana Evans', result: '76' }
    ]
  };

  const handleBatchChange = (e) => {
    const batch = e.target.value;
    setSelectedBatch(batch);
    setSelectedExam('');
    setStudents([]);
  };

  const handleExamChange = (e) => {
    const exam = e.target.value;
    setSelectedExam(exam);
    setStudents(studentsData[selectedBatch] || []);
  };

  const handleEdit = (student) => {
    setEditStudent(student);
    setEditedResult(student.result);
  };

  const handleResultChange = (e) => {
    setEditedResult(e.target.value);
  };

  const handleSave = () => {
    if (editStudent) {
      const updatedStudents = students.map((student) =>
        student.userID === editStudent.userID ? { ...student, result: editedResult } : student
      );
      setStudents(updatedStudents);
      setEditStudent(null);
    }
  };

  const handleClose = () => {
    setEditStudent(null);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-gray-100 p-8">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-600">Show Results</h2>

        <div className="mb-5">
          <label htmlFor="batch" className="block text-gray-600 text-sm font-medium mb-2">
            Select Batch
          </label>
          <select
            id="batch"
            value={selectedBatch}
            onChange={handleBatchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="" disabled>Select a batch</option>
            {batches.map((batch) => (
              <option key={batch} value={batch}>
                {batch}
              </option>
            ))}
          </select>
        </div>

        {selectedBatch && (
          <div className="mb-5">
            <label htmlFor="exam" className="block text-gray-600 text-sm font-medium mb-2">
              Select Exam
            </label>
            <select
              id="exam"
              value={selectedExam}
              onChange={handleExamChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="" disabled>Select an exam</option>
              {exams[selectedBatch]?.map((exam) => (
                <option key={exam} value={exam}>
                  {exam}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedExam && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Students</h3>
            {students.map((student) => (
              <div key={student.userID} className="flex items-center mb-4">
                <span className="flex-1 text-gray-600">{student.userID} - {student.name}</span>
                <span className="w-20 text-gray-600 text-center">{student.result}</span>
                <button
                  type="button"
                  onClick={() => handleEdit(student)}
                  className="ml-4 px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}

        {editStudent && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Edit Result</h3>
              <div className="mb-4">
                <label className="block text-gray-600 text-sm font-medium mb-2">Student ID</label>
                <input
                  type="text"
                  value={editStudent.userID}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={editStudent.name}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 text-sm font-medium mb-2">Result</label>
                <input
                  type="number"
                  value={editedResult}
                  onChange={handleResultChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowResult;
