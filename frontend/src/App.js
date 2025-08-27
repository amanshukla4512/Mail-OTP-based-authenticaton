import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Welcome } from "./pages/Welcome";
import { useSelector } from "react-redux";
import AuthPage from "./pages/AuthPage";
import Navbar from "./pages/Navbar";

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.people.token);
  console.log("token", token);
  return token !== null ? children : <Navigate to="/login" />;
};

// Wrap the logic of Navbar visibility inside this component
const AppContent = () => {
  const location = useLocation();

  return (
    <>
      {/* Conditionally render Navbar only when the current route is not "/login" */}
      {location.pathname === "/main" && <Navbar />}

      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route
          path="/main"
          element={
            <ProtectedRoute>
              <Welcome />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
};

export const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
