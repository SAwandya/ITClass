import React from "react";
import { useLocation } from "react-router-dom";

import AdminHeader from "./Components/Admin_Header";
import AdminFooter from "./Components/Admin_Footer";
import InstructorHeader from "./Components/Instructor_header";
import InstructorFooter from "./Components/Instructor_Footer";
import StudentHeader from "./Components/Student_Header";
import StudentFooter from "./Components/Student_Footer";
import { useAuth } from "./context/AuthContext";

const AppLayout = ({ children }) => {

  const { getCurrentUser } = useAuth();

  const role = getCurrentUser().role;
  
  const location = useLocation();

  const noHeaderFooterRoutes = ["/login", "/register"];
  const hideHeaderFooter = noHeaderFooterRoutes.includes(location.pathname);

  // if (loading) {
  //   return (
  //     <div className="fixed inset-0 flex justify-center items-center bg-gray-100 bg-opacity-50">
  //       <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
  //     </div>
  //   );
  // }

  return (
    <>
      {!hideHeaderFooter && (
        <>
          {role === "admin" && <AdminHeader />}
          {role === "instructor" && <InstructorHeader />}
          {role === "student" && <StudentHeader />}
        </>
      )}
      {children}
      {!hideHeaderFooter && (
        <>
          {role === "admin" && <AdminFooter />}
          {role === "instructor" && <InstructorFooter />}
          {role === "student" && <StudentFooter />}
        </>
      )}
    </>
  );
};

export default AppLayout;
