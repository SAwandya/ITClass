import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { firedb } from "../FireBase/Firebase";
import {
  getAuth,
  onAuthStateChanged,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const StudentProfile = () => {
  const [studentDetails, setStudentDetails] = useState({
    fullName: "",
    userID: "",
    school: "",
    phoneNumber: "",
    batch: "",
    email: "",
  });

  const [editableDetails, setEditableDetails] = useState({
    fullName: "",
    userID: "",
    school: "",
    phoneNumber: "",
    batch: "",
    email: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchStudentDetails = async () => {
    try {
      if (!user) {
        setError("No user is signed in");
        setLoading(false);
        return;
      }

      const userUID = user.uid;
      const usersRef = collection(firedb, "students");
      const q = query(usersRef, where("uid", "==", userUID));

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const data = userDoc.data();
        setStudentDetails(data);
        setEditableDetails(data); // Initial editable data
      } else {
        setError("No such document!");
      }
    } catch (err) {
      setError("Failed to fetch data");
      console.error("Error fetching student details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    console.log("auth", auth);  
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Redirect unauthenticated users
        navigate("/profile");
      }
    });
  
    return () => unsubscribe();
  }, []);
  

  useEffect(() => {
    if (user) {
      fetchStudentDetails();
    }
  }, [user]);

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setEditableDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const userUID = user.uid;
      const studentDocRef = doc(firedb, "students", userUID);

      await updateDoc(studentDocRef, editableDetails);

      setStudentDetails(editableDetails);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving student details:", error);
      setError("Failed to save details.");
    }
  };

  const handleCancel = () => {
    setEditableDetails(studentDetails);
    setIsEditing(false);
  };

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetError, setResetError] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(null);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match");
      return;
    }

    try {
      const auth = getAuth();
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setResetSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setResetError("Failed to update password. Please try again.");
      console.error("Password reset error:", error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-100 bg-opacity-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
      </div>
    );
  }
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-gray-100 p-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Student Profile Card */}
        <div className="w-full">
          <h2 className="text-3xl font-extrabold mb-6 text-blue-600">
            Student Profile
          </h2>
          <form
            onSubmit={handleSave}
            className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-8"
          >
            <h3 className="text-2xl font-semibold text-blue-500 mb-4">
              Personal Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="userID">
                  Register ID
                </label>
                <input
                  type="text"
                  id="userID"
                  name="userID"
                  value={studentDetails.userID}
                  className="w-full border-gray-300 rounded-md p-2 bg-gray-100"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="fullName">
                  Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={studentDetails.fullName}
                  className="w-full border-gray-300 rounded-md p-2 bg-gray-100"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editableDetails.email}
                  onChange={handleDetailsChange}
                  className={`w-full border-gray-300 rounded-md p-2 ${
                    isEditing ? "bg-white" : "bg-gray-100"
                  }`}
                  disabled={!isEditing}
                />
              </div>
              {/* Other profile fields */}
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="batch">
                  Batch
                </label>
                <input
                  type="text"
                  id="batch"
                  name="batch"
                  value={editableDetails.batch}
                  onChange={handleDetailsChange}
                  className={`w-full border-gray-300 rounded-md p-2 ${
                    isEditing ? "bg-white" : "bg-gray-100"
                  }`}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="school">
                  School
                </label>
                <input
                  type="text"
                  id="school"
                  name="school"
                  value={editableDetails.school}
                  onChange={handleDetailsChange}
                  className={`w-full border-gray-300 rounded-md p-2 ${
                    isEditing ? "bg-white" : "bg-gray-100"
                  }`}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 mb-1"
                  htmlFor="phoneNumber"
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={editableDetails.phoneNumber}
                  onChange={handleDetailsChange}
                  className={`w-full border-gray-300 rounded-md p-2 ${
                    isEditing ? "bg-white" : "bg-gray-100"
                  }`}
                  disabled={!isEditing}
                />
              </div>
              {isEditing ? (
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Save Details
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Password Reset Card */}
        <div className="w-full">
          <h2 className="text-3xl font-extrabold mb-6 text-blue-600">
            Reset Password
          </h2>
          <form
            onSubmit={handlePasswordReset}
            className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-8"
          >
            <h3 className="text-2xl font-semibold text-blue-500 mb-4">
              Password Reset
            </h3>
            <div className="space-y-4">
              {resetError && (
                <div className="text-red-500 text-sm">{resetError}</div>
              )}
              {resetSuccess && (
                <div className="text-green-500 text-sm">{resetSuccess}</div>
              )}

              <div>
                <label
                  className="block text-gray-700 mb-1"
                  htmlFor="currentPassword"
                >
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border-gray-300 rounded-md p-2 bg-gray-100"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 mb-1"
                  htmlFor="newPassword"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border-gray-300 rounded-md p-2 bg-gray-100"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 mb-1"
                  htmlFor="confirmPassword"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border-gray-300 rounded-md p-2 bg-gray-100"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
