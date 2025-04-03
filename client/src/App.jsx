import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Courses from "./courses/Courses";
import Signup from "./components/Signup";
import { Toaster } from "react-hot-toast";
import Home from "./Home/Home";
import { useAuth } from "./context/AuthProvider";
import Login from "./components/Login";
import BookDetail from "./components/BookDetail";

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen dark:bg-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dark:bg-slate-900 dark:text-white min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/course" replace /> : <Login />
          }
        />
        <Route
          path="/course"
          element={
            isAuthenticated ? <Courses /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? <Navigate to="/course" replace /> : <Signup />
          }
        />
        <Route
          path="/books/:id"
          element={
            isAuthenticated ? <BookDetail /> : <Navigate to="/login" replace />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
          },
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "#ff3333",
              color: "#fff",
            },
          },
        }}
      />
    </div>
  );
}

export default App;
