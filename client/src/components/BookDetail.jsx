import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/axiosConfig";
import Navbar from "./Navbar";
import Footer from "./Footer";
import OrderModal from "./OrderModal";

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/books/${id}`);
        setBook(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching book:", error);
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!book) return <div>Book not found</div>;

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-16 mb-10 p-4">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 md:w-2/3">
              <h1 className="text-2xl font-bold mb-2 dark:text-white">
                {book.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                by {book.author}
              </p>
              <div className="flex items-center mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                  {book.category}
                </span>
                <span className="ml-4 text-xl font-bold text-gray-900 dark:text-white">
                  ${book.price}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {book.description || "No description available"}
              </p>

              <button
                onClick={() => setShowModal(true)}
                className="px-3 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-md transition-colors duration-200"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <OrderModal
        showModal={showModal}
        setShowModal={setShowModal}
        item={book} // Mengirim data buku sebagai prop item
      />

      <Footer />
    </>
  );
}

export default BookDetail;
