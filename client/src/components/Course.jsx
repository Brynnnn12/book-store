import React, { useEffect, useState } from "react";
import Cards from "./Cards";
import { Link } from "react-router-dom";
import api from "../utils/axiosConfig";
function Course() {
  const [book, setBook] = useState([]);
  useEffect(() => {
    const getBook = async () => {
      try {
        const res = await api.get("/books");
        console.log(res.data.data.books);
        setBook(res.data.data.books);
      } catch (error) {
        console.log(error);
      }
    };
    getBook();
  }, []);
  return (
    <>
      <div className="max-w-screen-2xl container mx-auto md:px-20 px-4">
        <div className="pt-18 items-center justify-center text-center">
          <h1 className="text-2xl md:text-4xl font-bold">
            Selamat Datang di{" "}
            <span className="text-pink-500">Toko Buku Online!</span>
          </h1>
          <p className="mt-12 text-gray-700">
            Temukan berbagai macam buku favoritmu di sini! Kami menyediakan
            koleksi buku terbaru dari berbagai genre seperti fiksi, non-fiksi,
            pendidikan, hingga pengembangan diri. Proses belanja mudah, cepat,
            dan aman — semua bisa kamu lakukan hanya dalam beberapa klik. Yuk
            mulai jelajahi dan temukan buku impianmu!
          </p>
          <Link to="/">
            <button className="mt-6 bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-700 duration-300">
              Kembali ke Beranda
            </button>
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {book.map((item) => (
            <div key={item._id} className="flex justify-center">
              <Cards
                item={item}
                className="w-full max-w-xs transition-transform transform hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Course;
