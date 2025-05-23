import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import Login from "./Login";
import Logout from "./Logout";
import { Link } from "react-router-dom";

function Navbar() {
  const { isAuthenticated, user } = useAuth();

  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = (
    <>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/course">Course</Link>
      </li>
      {isAuthenticated && (
        <>
          <li>
            <Link to="/orders">Orders</Link>
          </li>
          {user?.role === "admin" && (
            <>
              <li>
                <Link to="/books">Books</Link>
              </li>
              <li>
                <Link to="/categories">Categories</Link>
              </li>
            </>
          )}
        </>
      )}
    </>
  );

  return (
    <div
      className={`max-w-screen-2xl container mx-auto md:px-20 px-4 dark:bg-slate-800 dark:text-white sticky top-0 z-50 ${
        sticky
          ? "shadow-md bg-base-200 dark:bg-slate-700 duration-300 transition-all ease-in-out"
          : "bg-white dark:bg-slate-800"
      }`}
    >
      <div className="navbar h-16">
        {" "}
        {/* Tambahkan height tetap */}
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              {navItems}
            </ul>
          </div>
          <a className="text-2xl font-bold cursor-pointer">bookStore</a>
        </div>
        <div className="navbar-end space-x-3">
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">{navItems}</ul>
          </div>

          <div className="hidden md:block">
            <label className="px-3 py-2 border rounded-md flex items-center gap-2">
              <input
                type="text"
                className="grow outline-none rounded-md px-1 dark:bg-slate-900 dark:text-white"
                placeholder="Search"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
          </div>

          {isAuthenticated ? (
            <Logout />
          ) : (
            <div className="flex items-center">
              <button
                className="bg-black text-white px-3 py-2 rounded-md hover:bg-slate-800 duration-300"
                onClick={() =>
                  document.getElementById("my_modal_3").showModal()
                }
              >
                Login
              </button>
              <Login />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
