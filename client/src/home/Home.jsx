import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import Freebook from "../components/Freebook";
import Footer from "../components/Footer";
import Login from "../components/Login";
import Signup from "../components/Signup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import toast from "react-hot-toast";

function Home({ showAuthModal, redirectPath }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    // Jika sudah login dan ada redirectPath, arahkan ke path tersebut
    if (isAuthenticated && redirectPath) {
      navigate(redirectPath);
      return;
    }
    if (showAuthModal) {
      // Tampilkan toast ketika modal login muncul
      toast("Silakan login terlebih dahulu", {
        icon: "🔒",
        position: "top-center",
        style: {
          background: "#f8f9fa",
          color: "#343a40",
          border: "1px solid #dee2e6",
        },
      });
    }
    // Buka modal ketika komponen mount atau showAuthModal berubah
    if (showAuthModal === "login") {
      document.getElementById("my_modal_3").showModal();
    } else if (showAuthModal === "signup") {
      document.getElementById("signup_modal").showModal();
    }
  }, [showAuthModal, redirectPath, isAuthenticated, navigate]);

  return (
    <>
      <Navbar />
      <Banner />
      <Freebook />
      <Footer />

      {/* Tambahkan modal di sini */}
      <Login />
      <Signup />
    </>
  );
}

export default Home;
