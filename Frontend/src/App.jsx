import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Adjust the path
import AppLayout from "./AppLayout"; // Adjust as necessary
import Routes from "./Routes"; // Ensure your Routes file is correct

const App = () => (
  <AuthProvider>
    <Router>
      <AppLayout>
        <Routes />
      </AppLayout>
    </Router>
  </AuthProvider>
);

export default App;
