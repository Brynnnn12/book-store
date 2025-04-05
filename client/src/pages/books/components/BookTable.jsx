import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const BookTable = ({
  books,
  loading,
  currentPage,
  openEditModal,
  openDeleteModal,
}) => {
  if (loading) {
    return (
      <tr>
        <td colSpan="7" className="text-center py-4">
          <span className="loading loading-spinner loading-lg"></span>
        </td>
      </tr>
    );
  }

  if (books.length === 0) {
    return (
      <tr>
        <td colSpan="7" className="text-center py-4">
          Tidak ada buku yang ditemukan
        </td>
      </tr>
    );
  }

  return books.map((book, index) => (
    <tr key={book._id}>
      <td>{(currentPage - 1) * 10 + index + 1}</td>
      <td>
        <div className="avatar">
          <div className="w-16 h-20 rounded">
            <img
              src={book.coverImage || "/placeholder-book.png"}
              alt={book.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder-book.png";
              }}
              className="object-cover"
            />
          </div>
        </div>
      </td>
      <td>{book.title}</td>
      <td>{book.author}</td>
      <td>{book.categoryId?.name || "Tidak ada kategori"}</td>
      <td>Rp {book.price?.toLocaleString("id-ID") || "0"}</td>
      <td className="flex gap-2">
        <button
          onClick={() => openEditModal(book)}
          className="btn btn-sm btn-info"
        >
          <FaEdit />
        </button>
        <button
          onClick={() => openDeleteModal(book)}
          className="btn btn-sm btn-error"
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  ));
};

export default BookTable;
