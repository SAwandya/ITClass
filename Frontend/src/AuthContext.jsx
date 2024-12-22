import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { firedb } from "./FireBase/Firebase"; // Adjust as per your project structure

// Create AuthContext
const AuthContext = createContext();

// Provide context to components
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userDocRef = doc(firedb, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        console.log("UserDoc:", userDoc.data());
        if (userDoc.exists()) {
          setRole(userDoc.data().userRole || "guest");
        } else {
          setRole("guest");
        }
      } else {
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  console.log("User:", role);

  return (
    <AuthContext.Provider value={{ user, role, loading, setUser, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming AuthContext
export const useAuth = () => useContext(AuthContext);
