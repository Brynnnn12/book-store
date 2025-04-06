import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthProvider"; // Import useAuth
import api from "../utils/axiosConfig";

function Login() {
  const { login } = useAuth(); // Gunakan fungsi login dari AuthProvider
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await api.post("/auth/login", data);

      // Panggil fungsi login dari AuthProvider
      await login(response.data.data.token);

      toast.success("Login successful");
      document.getElementById("my_modal_3").close();

      // Tidak perlu reload halaman, AuthProvider akan menangani perubahan state
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      toast.error(errorMessage);
    }
  };
  return (
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box dark:bg-slate-800 dark:text-white">
        {/* Close button */}
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => document.getElementById("my_modal_3").close()}
        >
          ✕
        </button>

        <div className="text-xl">
          <h3 className="font-bold text-lg">Login</h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email Input */}
          <div className="mt-4 space-y-2">
            <label htmlFor="email" className="block">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-1 border rounded-md outline-none dark:bg-slate-700"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <span className="text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password Input */}
          <div className="mt-4 space-y-2">
            <label htmlFor="password" className="block">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-1 border rounded-md outline-none dark:bg-slate-700"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <span className="text-sm text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Login button */}
          <div className="flex justify-between items-center mt-6">
            <button
              type="submit"
              className="bg-pink-500 text-white rounded-md px-3 py-1 hover:bg-pink-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>

            <div className="text-sm">
              Already have an account?{" "}
              <button
                className="underline text-blue-500 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault(); // Mencegah submit form
                  document.getElementById("my_modal_3").close();
                  document.getElementById("signup_modal").showModal();
                }}
              >
                Register
              </button>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
}

export default Login;
