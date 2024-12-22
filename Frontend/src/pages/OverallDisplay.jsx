import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import ExamCreate from './ExamCreate'; // Ensure you have this import
import BatchCreate from './BatchCreate';
import InstructorCreate from './InstructorCreate';

// Register required components with ChartJS
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Mock data for scheduled exams
const scheduledExams = [
  { id: 1, name: 'Spot Test 1', date: '2024-09-10', topics: 'Operating Systems up to 4th Lesson', notice: 'Bring your own laptop' },
  { id: 2, name: 'Monthly Test 3', date: '2024-09-15', topics: 'Python Basics, Advanced Python', notice: 'Prepare for group project' },
  { id: 3, name: 'Spot Test 2', date: '2024-09-20', topics: 'Web Development, APIs', notice: 'Ensure all assignments are submitted' },
];

// Mock data for batches
const batches = ['25SE', '24SM', '23SE'];

// Random names for 10 students in each batch
const studentNames = {
  '25SE': ['Alice', 'Bob', 'Charlie', 'David', 'Eva', 'Frank', 'Grace', 'Hannah', 'Ian', 'Jill'],
  '24SM': ['Karen', 'Leo', 'Maria', 'Nathan', 'Olivia', 'Paul', 'Quincy', 'Rachel', 'Steve', 'Tina'],
  '23SE': ['Uma', 'Victor', 'Wendy', 'Xander', 'Yara', 'Zane', 'Abby', 'Brian', 'Clara', 'Derek'],
};

// Mock data for 10 students' marks per batch
const examMarks = {
  '25SE': [85, 90, 78, 88, 92, 74, 80, 85, 70, 75],
  '24SM': [82, 70, 88, 91, 84, 76, 79, 85, 88, 77],
  '23SE': [76, 90, 85, 82, 79, 88, 91, 77, 84, 90],
};

// Function to get the top N indices from a list of numbers
const getTopNIndices = (arr, N) => {
  const sortedIndices = arr
    .map((value, index) => ({ value, index }))
    .sort((a, b) => b.value - a.value)
    .slice(0, N)
    .map(item => item.index);
  return sortedIndices;
};

// Function to create data for each bar chart
const createBarChartData = (batchName) => {
  const marks = examMarks[batchName];

  // Get indices for top 3 highest marks
  const top3Indices = getTopNIndices(marks, 3);

  // Reverse the marks array and get indices for top 3 lowest marks in the reversed array
  const lowest3Indices = getTopNIndices(marks.slice().reverse(), 3).map(i => marks.length - 1 - i);

  return {
    labels: marks.map(() => ''), // Empty labels to hide the student names on the X-axis
    datasets: [
      {
        label: 'Marks',
        data: marks,
        backgroundColor: marks.map((mark, index) => {
          if (top3Indices.includes(index)) return 'rgba(144, 238, 144, 0.5)'; // Light green for top 3 highest
          if (lowest3Indices.includes(index)) return 'rgba(255, 99, 132, 0.5)'; // Light red for top 3 lowest
          return 'rgba(75, 192, 192, 0.2)'; // Default color
        }),
        borderColor: marks.map((mark, index) => {
          if (top3Indices.includes(index)) return 'rgba(144, 238, 144, 1)'; // Dark green for top 3 highest
          if (lowest3Indices.includes(index)) return 'rgba(255, 99, 132, 1)'; // Dark red for top 3 lowest
          return 'rgba(75, 192, 192, 1)'; // Default color
        }),
        borderWidth: 1,
        hoverBackgroundColor: marks.map((mark, index) => {
          if (top3Indices.includes(index)) return 'rgba(144, 238, 144, 0.7)'; // Darker green for top 3 highest on hover
          if (lowest3Indices.includes(index)) return 'rgba(255, 99, 132, 0.7)'; // Darker red for top 3 lowest on hover
          return 'rgba(75, 192, 192, 0.4)'; // Default hover color
        }),
        hoverBorderColor: marks.map((mark, index) => {
          if (top3Indices.includes(index)) return 'rgba(144, 238, 144, 1)'; // Dark green for top 3 highest on hover
          if (lowest3Indices.includes(index)) return 'rgba(255, 99, 132, 1)'; // Dark red for top 3 lowest on hover
          return 'rgba(75, 192, 192, 1)'; // Default hover color
        }),
      },
    ],
  };
};

const OverallDisplay = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-gray-100 p-8">
      <div className="container mx-auto">
        {/* Scheduled Exams */}
        <h2 className="text-3xl font-extrabold mb-6 text-blue-600 text-center">Scheduled Exams</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {scheduledExams.map((exam) => (
            <div key={exam.id} className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-blue-500 mb-2">Exam Name: {exam.name}</h3>
              <p className="text-gray-700 mb-2"><strong>Date:</strong> {exam.date}</p>
              <p className="text-gray-700 mb-2"><strong>Topics:</strong> {exam.topics}</p>
              <p className="text-gray-700 mb-2"><strong>Special Notice:</strong> {exam.notice}</p>
            </div>
          ))}
        </div>

        {/* Batch Bar Charts */}
        <h2 className="text-3xl font-extrabold mb-6 text-blue-600 text-center">Batch Performance</h2>
        <div className="space-y-12">
          {batches.map((batch) => (
            <div key={batch} className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 flex flex-col items-center">
              <h3 className="text-xl font-semibold text-blue-500 mb-4">Performance of Batch {batch}</h3>
              
              {/* Center the Bar Chart Horizontally */}
              <div className="w-full max-w-3xl mx-auto mb-6">
                <div style={{ height: '500px' }}>
                  <Bar 
                    data={createBarChartData(batch)} 
                    options={{ 
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          display: true,
                          position: 'top',
                        },
                        title: {
                          display: true,
                          text: `Marks of Students in Batch ${batch}`,
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              const studentIndex = context.dataIndex;
                              const studentName = studentNames[batch][studentIndex];
                              const mark = context.dataset.data[studentIndex];
                              return `${studentName}: ${mark}`;
                            },
                          },
                        },
                      },
                      scales: {
                        x: {
                          title: {
                            display: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                        y: {
                          title: {
                            display: true,
                            text: 'Marks'
                          },
                          beginAtZero: true
                        }
                      }
                    }} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Exam Section */}
        <div className="mt-12">
          
          <ExamCreate />
        </div>
      </div>
    </div>
  );
};

export default OverallDisplay;
