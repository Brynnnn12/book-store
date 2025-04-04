import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthProvider";

function Signup() {
  const { register } = useAuth(); // Ambil fungsi register dari AuthProvider
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await register(data);
      toast.success("Signup successful");

      // Redirect atau lakukan sesuatu setelah registrasi
    } catch (err) {
      toast.error(err.message); // Tampilkan pesan error yang lebih spesifik
      console.error("Signup error:", err);
    }
  };

  return (
    <dialog id="signup_modal" className="modal">
      <div className="modal-box dark:bg-slate-800 dark:text-white">
        {/* Tombol Close */}
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => document.getElementById("signup_modal").close()}
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-xl">
          <h3 className="font-bold text-lg">Signup</h3>
        </div>

        {/* Form Signup */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* name Input */}
          <div className="mt-4 space-y-2">
            <label htmlFor="name" className="block">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full px-3 py-1 border rounded-md outline-none dark:bg-slate-700"
              {...formRegister("name", {
                required: "name is required",
              })}
            />
            {errors.name && (
              <span className="text-sm text-red-500">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Email Input */}
          <div className="mt-4 space-y-2">
            <label htmlFor="email" className="block">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-1 border rounded-md outline-none dark:bg-slate-700"
              {...formRegister("email", { required: "Email is required" })}
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
              {...formRegister("password", {
                required: "Password is required",
              })}
            />
            {errors.password && (
              <span className="text-sm text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Tombol Signup */}
          <div className="flex justify-between items-center mt-6">
            <button
              type="submit"
              className="bg-pink-500 text-white rounded-md px-3 py-1 hover:bg-pink-700"
            >
              {isSubmitting ? "Signing up..." : "Signup"}
            </button>

            {/* Link ke Login */}
            <div className="text-sm">
              Already have an account?{" "}
              <button
                className="underline text-blue-500 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("signup_modal").close();
                  document.getElementById("my_modal_3").showModal();
                }}
              >
                Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
}

export default Signup;
