import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import axios from "axios";
import BookCards from "./BookCard";

function Freebook() {
  const [book, setBook] = useState([]);

  useEffect(() => {
    const getBook = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/books");
        const data = res.data.data.books;
        console.log(data);
        setBook(data);
      } catch (error) {
        console.log(error);
      }
    };

    getBook();
  }, []);

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <div className="max-w-screen-2xl container mx-auto md:px-20 px-4">
        <div>
          <h1 className="font-semibold text-xl pb-2">
            Buku Gratis & Penawaran Spesial
          </h1>
          <p>
            Dapatkan berbagai buku menarik secara gratis dan nikmati penawaran
            spesial hanya di toko buku online kami! Mulai dari buku digital,
            voucher diskon, hingga bundling buku pilihan—semua tersedia untuk
            kamu yang gemar membaca dan berburu promo.
          </p>
        </div>

        <div>
          <Slider {...settings}>
            {book.map((item) => (
              <BookCards item={item} key={item.id} />
            ))}
          </Slider>
        </div>

        {/* Tambahkan link "Lihat Semua Buku" di sini */}
        <div className="flex justify-center mt-4 mb-4">
          <Link
            to="/course"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Lihat Semua Buku
          </Link>
        </div>
      </div>
    </>
  );
}

export default Freebook;
