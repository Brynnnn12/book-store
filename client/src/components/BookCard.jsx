import React from "react";
import { Link } from "react-router-dom";

function BookCards({ item }) {
  return (
    <div className="mt-4 my-3 p-3">
      <div className="hover:scale-105 duration-200 card w-full max-w-xs bg-base-100 shadow-lg hover:shadow-xl transition-shadow dark:bg-slate-900 dark:text-white dark:border dark:border-gray-700">
        <figure className="overflow-hidden">
          <img
            src={item.coverImage}
            alt={item.title}
            className="object-cover w-full h-48"
          />
        </figure>
        <div className="card-body p-4">
          <h2 className="card-title text-lg font-semibold">
            {item.title}
            <div className="badge badge-secondary ml-2">{item.category}</div>
          </h2>
          <p className="text-gray-700 dark:text-gray-300">{item.author}</p>
          <div className="card-actions justify-between mt-4">
            <div className="badge badge-outline">${item.price}</div>
            <Link
              to={`/books/${item._id}`} // Menggunakan ID buku dalam URL
              className="cursor-pointer px-3 py-1 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition duration-200"
            >
              Lihat Detail Buku
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookCards;
