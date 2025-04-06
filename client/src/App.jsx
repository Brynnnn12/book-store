import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Courses from "./courses/Courses";
import { Toaster } from "react-hot-toast";
import Home from "./home/Home";
import { useAuth } from "./context/AuthProvider";
import BookDetail from "./components/BookDetail";
import Books from "./pages/books/Books";
import Order from "./pages/orders/Order";
import CategoryPage from "./pages/categories/Category";

function App() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

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
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route
          path="/course"
          element={
            isAuthenticated ? (
              <Courses />
            ) : (
              <Home showAuthModal="login" redirectPath="/course" />
            )
          }
        />
        <Route
          path="/books/"
          element={
            isAuthenticated ? (
              <Books />
            ) : (
              <Home showAuthModal="login" redirectPath={location.pathname} />
            )
          }
        />
        <Route
          path="/orders"
          element={
            isAuthenticated ? (
              <Order />
            ) : (
              <Home showAuthModal="login" redirectPath={location.pathname} />
            )
          }
        />
        <Route
          path="/books/:id"
          element={
            isAuthenticated ? (
              <BookDetail />
            ) : (
              <Home showAuthModal="login" redirectPath={location.pathname} />
            )
          }
        />
        <Route
          path="/categories"
          element={
            isAuthenticated ? (
              <CategoryPage />
            ) : (
              <Home showAuthModal="login" redirectPath={location.pathname} />
            )
          }
        />

        <Route path="*" element={<Home />} />
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
