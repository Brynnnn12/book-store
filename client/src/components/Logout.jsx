import React from "react";
import { useAuth } from "../context/AuthProvider";
import toast from "react-hot-toast";

function Logout() {
  const { logout } = useAuth(); // Assuming your AuthProvider has a logout function

  const handleLogout = async () => {
    try {
      await logout(); // Use the logout function from AuthProvider
      toast.success("Logged out successfully");

      // No need for reload - the auth state change should update the UI automatically
      // If you need to redirect, use navigate('/') instead of reload
    } catch (error) {
      toast.error(`Logout failed: ${error.message}`);
    }
  };

  return (
    <button
      className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors duration-200"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}

export default Logout;
