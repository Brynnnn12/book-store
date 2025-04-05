import React, { useRef, useState } from "react";
import toast from "react-hot-toast";

const OrderForm = ({ books, loading, onCreateOrder }) => {
  const [formData, setFormData] = useState({
    bookId: "",
    totalPrice: 0,
  });
  const [paymentProof, setPaymentProof] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "bookId") {
      const selectedBook = books.find((book) => book._id === value);
      if (selectedBook) {
        setFormData((prev) => ({
          ...prev,
          totalPrice: selectedBook.price,
        }));
      }
    }
  };

  const handleFileChange = (e) => {
    setPaymentProof(e.target.files[0]);
  };
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onCreateOrder({ ...formData, paymentProof });
      setFormData({ bookId: "", totalPrice: 0 });
      setPaymentProof(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
      toast.success("Pesanan berhasil dibuat!");
    } catch (error) {
      toast.error(error.message || "Gagal membuat pesanan");
    }
  };

  return (
    <div className=" shadow-md rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Buat Pesanan Baru</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Pilih Buku:</label>
          <select
            name="bookId"
            value={formData.bookId}
            onChange={handleChange}
            className="w-full border rounded py-2 px-3"
            required
          >
            <option value="">-- Pilih Buku --</option>
            {books.map((book) => (
              <option key={book._id} value={book._id}>
                {book.title} - Rp {book.price.toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Total Harga:</label>
          <input
            type="number"
            name="totalPrice"
            value={formData.totalPrice}
            onChange={handleChange}
            className="w-full border rounded py-2 px-3"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Bukti Pembayaran:</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full py-2"
            ref={fileInputRef}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? "Memproses..." : "Buat Pesanan"}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
