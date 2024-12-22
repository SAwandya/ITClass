import React, { useEffect, useState } from 'react';
import { firedb } from '../FireBase/Firebase'; // Adjust path as necessary
import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';

const CreateBatch = () => {
  const [year, setYear] = useState('');
  const [day, setDay] = useState('');
  const [medium, setMedium] = useState('');
  const [batches, setBatches] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // Track which index is being edited

  useEffect(() => {
    // Fetch batches from Firestore on component mount
    const fetchBatches = async () => {
      const querySnapshot = await getDocs(collection(firedb, 'batches'));
     
      const batchesArray = [];
      querySnapshot.forEach((doc) => {
        batchesArray.push({ id: doc.id, ...doc.data() });
      });
      setBatches(batchesArray);
    };

    fetchBatches();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const batch = { year, day, medium };

    if (isEditing) {
      // If editing, update the existing batch in Firestore
      const batchRef = doc(firedb, 'batches', batches[editingIndex].id);
      await updateDoc(batchRef, batch);
      const updatedBatches = [...batches];
      updatedBatches[editingIndex] = { ...batch, id: batches[editingIndex].id };
      setBatches(updatedBatches);
      setIsEditing(false);
    } else {
      // If creating a new batch, add to Firestore
      const docRef = await addDoc(collection(firedb, 'batches'), batch);
      setBatches([...batches, { id: docRef.id, ...batch }]);
    }
    resetForm(); // Reset form fields
  };

  const handleDelete = async (index) => {
    // Delete batch from Firestore
    const batchToDelete = batches[index];
    await deleteDoc(doc(firedb, 'batches', batchToDelete.id));
    const newBatches = batches.filter((_, i) => i !== index);
    setBatches(newBatches);
  };

  const handleEdit = (index) => {
    const batchToEdit = batches[index];
    setYear(batchToEdit.year);
    setDay(batchToEdit.day);
    setMedium(batchToEdit.medium);
    setIsEditing(true); // Set editing mode to true
    setEditingIndex(index); // Save the index of the batch being edited
  };

  const resetForm = () => {
    setYear('');
    setDay('');
    setMedium('');
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start min-h-screen p-8">
      {/* Left Side - Batch Creation Form */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8 lg:mb-0 lg:mr-8">
        <h2 className="text-3xl font-extrabold mb-2 text-center text-blue-600">
          {isEditing ? "Edit Batch" : "Create Batch"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="year" className="block text-gray-600 text-sm font-medium mb-2">
              Year
            </label>
            <input
              type="number"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
              placeholder="e.g., 2025"
            />
          </div>
          <div className="mb-5">
            <label htmlFor="day" className="block text-gray-600 text-sm font-medium mb-2">
              Day
            </label>
            <select
              id="day"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            >
              <option value="" disabled>Select day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>
          <div className="mb-8">
            <label htmlFor="medium" className="block text-gray-600 text-sm font-medium mb-2">
              Medium
            </label>
            <select
              id="medium"
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            >
              <option value="" disabled>Select medium</option>
              <option value="English">English</option>
              <option value="Sinhala">Sinhala</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {isEditing ? "Update Batch" : "Create Batch"}
          </button>
        </form>
      </div>

      {/* Right Side - List of Created Batches */}
      <div className="w-full max-w-lg">
        <h2 className="text-3xl font-extrabold mb-2 text-center text-blue-600">Created Batches</h2>
        <ul>
          {batches.map((batch, index) => (
            <li key={batch.id} className="flex justify-between items-center bg-gray-100 p-4 mb-3 rounded-lg shadow">
              <span>{`${batch.year} ${batch.day} ${batch.medium} Medium`}</span>
              <div>
                <button
                  onClick={() => handleEdit(index)}
                  className="mr-2 bg-yellow-400 text-white py-1 px-3 mb-2 rounded-lg shadow hover:bg-yellow-500 transition"
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

export default CreateBatch;