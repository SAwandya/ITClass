import React, { useState, useEffect } from 'react';
import { firedb } from '../FireBase/Firebase';
import { collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// Function to determine the status based on marks
const getStatus = (marks) => {
  if (marks >= 90) return 'Excellent';
  if (marks >= 80) return 'Very Good';
  if (marks >= 70) return 'Good';
  if (marks >= 60) return 'Average';
  if (marks >= 50) return 'Below Average';
  if (marks >= 40) return 'Poor';
  return 'Fail';
};

const StudentDashboard = () => {
  // States for upcoming and previous exams
  const [upcomingExamsArray, setUpcomingExamsArray] = useState([]);
  const [previousExamsArray, setPreviousExamsArray] = useState([]);

  // Fetch upcoming exams
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const querySnapshot = await getDocs(collection(firedb, "upcomingExams"));
        const exams = [];
        querySnapshot.forEach((doc) => {
          exams.push({ id: doc.id, ...doc.data() });
        });
        setUpcomingExamsArray(exams);
        console.log(exams)
      } catch (error) {
        console.error("Failed to fetch exams:", error);
      }
    };

    fetchExams();
  }, []);

  // Fetch previous exams
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const auth = getAuth();
            console.log("auth", auth.currentUser);  
        const querySnapshot = await getDocs(collection(firedb, "previousExams"));
        const exams = [];
        querySnapshot.forEach((doc) => {
          exams.push({ id: doc.id, ...doc.data() });
        });
        setPreviousExamsArray(exams);
      } catch (error) {
        console.error("Failed to fetch exams:", error);
      }
    };

    fetchExams();
  }, []);

  // // Mock data for previous exams
  // const previousExamMarks = [
  //   { name: 'Spot Test 1', subject: 'Operating Systems', marks: 85 },
  //   { name: 'Monthly Test 2', subject: 'Python Basics', marks: 90 },
  //   { name: 'Monthly Test 1', subject: 'Web Development', marks: 70 },
  //   { name: 'Quiz 1', subject: 'Mathematics', marks: 65 },
  //   { name: 'Quiz 2', subject: 'History', marks: 50 },
  // ];

  // Calculate highest and lowest marks
// Calculate highest and lowest marks safely
const highestMark = previousExamsArray.length > 0 
  ? Math.max(...previousExamsArray.map((exam) => exam.marks)) 
  : null;

const lowestMark = previousExamsArray.length > 0 
  ? Math.min(...previousExamsArray.map((exam) => exam.marks)) 
  : null;

const averageMark = previousExamsArray.length > 0 
  ? previousExamsArray.reduce((acc, exam) => acc + exam.marks, 0) / previousExamsArray.length 
  : null;

const highestMarkExam = highestMark !== null 
  ? previousExamsArray.find((exam) => exam.marks === highestMark) 
  : null;

const lowestMarkExam = lowestMark !== null 
  ? previousExamsArray.find((exam) => exam.marks === lowestMark) 
  : null;


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-gray-100 p-8">
      <div className="container mx-auto">
        {/* Overall Status */}
        <h2 className="text-3xl font-extrabold mb-6 text-blue-600">Student Overview</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Overall Status */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 text-ce">
            <h3 className="text-xl font-semibold text-blue-500 mb-2">Overall Status</h3>
            <p className="text-gray-700 mb-2">
              <strong>Average Marks:</strong> {averageMark !== null ? averageMark.toFixed(2) : "No data available"}
            </p>
            <p className={`text-gray-700 ${
              averageMark !== null && averageMark >= 90 ? 'text-green-600' : 
              averageMark >= 80 ? 'text-green-500' : 
              averageMark >= 70 ? 'text-yellow-600' : 
              averageMark >= 60 ? 'text-yellow-400' : 
              averageMark >= 50 ? 'text-orange-600' : 
              averageMark >= 40 ? 'text-red-600' : 
              'text-red-800'
            }`}>
              <strong>Status:</strong> {averageMark !== null ? getStatus(averageMark) : "N/A"}
            </p>
          </div>

          {/* Highest Marks */}
          <div className="bg-green-500 text-white rounded-lg shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold mb-2">Highest Marks</h3>
            {highestMarkExam ? (
              <>
                <p className="text-gray-100 mb-2">
                  <strong>Exam Name:</strong> {highestMarkExam.name}
                </p>
                <p className="text-gray-100 mb-2">
                  <strong>Marks:</strong> {highestMark}
                </p>
              </>
            ) : (
              <p className="text-gray-100">No data available</p>
            )}
          </div>

          {/* Lowest Marks */}
          <div className="bg-red-500 text-white rounded-lg shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold mb-2">Lowest Marks</h3>
            {lowestMarkExam ? (
              <>
                <p className="text-gray-100 mb-2">
                  <strong>Exam Name:</strong> {lowestMarkExam.name}
                </p>
                <p className="text-gray-100 mb-2">
                  <strong>Marks:</strong> {lowestMark}
                </p>
              </>
            ) : (
              <p className="text-gray-100">No data available</p>
            )}
          </div>

        </div>

        {/* Upcoming Exams */}
        <h2 className="text-3xl font-extrabold mt-12 mb-6 text-blue-600">Upcoming Exams</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcomingExamsArray.map((exam) => (
            <div key={exam.id} className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-blue-500 mb-2">Exam Name: {exam.name}</h3>
              <p className="text-gray-700 mb-2"><strong>Date:</strong> {exam.date}</p>
              <p className="text-gray-700 mb-2"><strong>Topics:</strong> {exam.topics}</p>
              <p className="text-gray-700 mb-2"><strong>Special Notice:</strong> {exam.notice}</p>
            </div>
          ))}
        </div>

        {/* Previous Exam Marks */}
        <h2 className="text-3xl font-extrabold mt-12 mb-6 text-blue-600">Previous Exam Marks</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {previousExamsArray.map((exam, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-blue-500 mb-2">Exam Name: {exam.name}</h3>
              <p className="text-gray-700 mb-2"><strong>Subject:</strong> {exam.subject}</p>
              <p className="text-gray-700 mb-2"><strong>Marks:</strong> {exam.marks}</p>
              <p className={`text-gray-700 ${exam.marks >= 90 ? 'text-green-600' : exam.marks >= 80 ? 'text-green-500' : exam.marks >= 70 ? 'text-yellow-600' : exam.marks >= 60 ? 'text-yellow-400' : exam.marks >= 50 ? 'text-orange-600' : exam.marks >= 40 ? 'text-red-600' : 'text-red-800'}`}>
                <strong>Status:</strong> {getStatus(exam.marks)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
