import React, { useState, useEffect, useRef } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaSave,
  FaUpload,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import api from "../../utils/axiosConfig";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    categoryId: "",
    price: "",
    coverImage: null,
  });

  // Ref for file input
  const fileInputRef = useRef(null);

  // Fetch books with pagination and filtering
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      queryParams.append("pageNumber", currentPage);

      if (keyword) {
        queryParams.append("keyword", keyword);
      }

      if (selectedCategory) {
        queryParams.append("category", selectedCategory);
      }

      const res = await api.get(`/books?${queryParams.toString()}`);
      const { books, pages } = res.data.data;

      setBooks(books);
      setTotalPages(pages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("Gagal memuat data buku");
      setLoading(false);
    }
  };

  // Fetch categories for filter dropdown
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Gagal memuat data kategori");
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, [currentPage, keyword, selectedCategory]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchBooks();
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" ? parseFloat(value) || "" : value,
    });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        coverImage: file,
      });

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open create modal
  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (book) => {
    setBookToEdit(book);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      categoryId: book.categoryId?._id || book.categoryId,
      price: book.price,
      coverImage: null,
    });
    setPreviewImage(book.coverImage);
    setIsEditModalOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (book) => {
    setBookToDelete(book);
    setIsDeleteModalOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      description: "",
      categoryId: "",
      price: "",
      coverImage: null,
    });
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Close modals
  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    resetForm();
  };

  // Create book
  const createBook = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      // Create FormData object for file upload
      const bookFormData = new FormData();
      bookFormData.append("title", formData.title);
      bookFormData.append("author", formData.author);
      bookFormData.append("description", formData.description);
      bookFormData.append("categoryId", formData.categoryId);
      bookFormData.append("price", formData.price);

      if (formData.coverImage) {
        bookFormData.append("coverImage", formData.coverImage);
      }

      await api.post("/books", bookFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Buku berhasil ditambahkan");
      closeModals();
      fetchBooks();
    } catch (error) {
      console.error("Error creating book:", error);
      toast.error(error.response?.data?.message || "Gagal menambahkan buku");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update book
  const updateBook = async (e) => {
    e.preventDefault();

    if (!bookToEdit) return;

    try {
      setIsSubmitting(true);

      // Create FormData object for file upload
      const bookFormData = new FormData();
      bookFormData.append("title", formData.title);
      bookFormData.append("author", formData.author);
      bookFormData.append("description", formData.description);
      bookFormData.append("categoryId", formData.categoryId);
      bookFormData.append("price", formData.price);

      if (formData.coverImage) {
        bookFormData.append("coverImage", formData.coverImage);
      }

      await api.put(`/books/${bookToEdit._id}`, bookFormData);

      toast.success("Buku berhasil diperbarui");
      closeModals();
      fetchBooks();
    } catch (error) {
      console.error("Error updating book:", error);
      toast.error(error.response?.data?.message || "Gagal memperbarui buku");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete book
  const deleteBook = async () => {
    if (!bookToDelete) return;

    try {
      await api.delete(`/books/${bookToDelete._id}`);
      toast.success("Buku berhasil dihapus");
      closeModals();
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Gagal menghapus buku");
    }
  };

  // Handle pagination
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`join-item btn ${currentPage === i ? "btn-active" : ""}`}
        >
          {i}
        </button>
      );
    }
    return items;
  };

  // Book form for both create and edit modals
  const BookForm = ({ isEdit, onSubmit }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Judul Buku</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Masukkan judul buku"
          className="input input-bordered w-full"
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Penulis</span>
        </label>
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="Masukkan nama penulis"
          className="input input-bordered w-full"
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Kategori</span>
        </label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="select select-bordered w-full"
          required
        >
          <option value="" disabled>
            Pilih kategori
          </option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Harga</span>
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Masukkan harga buku"
          className="input input-bordered w-full"
          required
          min="0"
          step="1000"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Deskripsi</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="textarea textarea-bordered h-24"
          placeholder="Tuliskan deskripsi buku"
          required
        ></textarea>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Cover Buku</span>
        </label>
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="flex-1">
            <label className="btn btn-outline w-full">
              <FaUpload className="mr-2" />
              {isEdit ? "Ganti Cover" : "Upload Cover"}
              <input
                type="file"
                name="coverImage"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                ref={fileInputRef}
              />
            </label>
            <p className="text-xs mt-2 text-gray-500">
              Format: JPG, PNG, WebP. Max: 2MB.
            </p>
          </div>

          {previewImage && (
            <div className="w-24 h-32 relative border rounded-md overflow-hidden">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <div className="modal-action">
        <button type="button" className="btn btn-ghost" onClick={closeModals}>
          Batal
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <>
              <FaSave className="mr-2" /> Simpan
            </>
          )}
        </button>
      </div>
    </form>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Buku</h1>
        <button onClick={openCreateModal} className="btn btn-primary">
          <FaPlus className="mr-2" /> Tambah Buku
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-base-200 p-4 rounded-lg mb-6">
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="form-control flex-1">
            <div className="input-group">
              <input
                type="text"
                placeholder="Cari judul buku..."
                className="input input-bordered w-full"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button type="submit" className="btn btn-square btn-primary">
                <FaSearch />
              </button>
            </div>
          </div>

          <select
            className="select select-bordered w-full md:w-64"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1); // Reset to first page when changing category
            }}
          >
            <option value="">Semua Kategori</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </form>
      </div>

      {/* Book Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>No.</th>
              <th>Cover</th>
              <th>Judul</th>
              <th>Penulis</th>
              <th>Kategori</th>
              <th>Harga</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  <span className="loading loading-spinner loading-lg"></span>
                </td>
              </tr>
            ) : books.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  Tidak ada buku yang ditemukan
                </td>
              </tr>
            ) : (
              books.map((book, index) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="join">
            <button
              className="join-item btn"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              «
            </button>
            {renderPaginationItems()}
            <button
              className="join-item btn"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg">Tambah Buku Baru</h3>
            <div className="py-4">
              <BookForm isEdit={false} onSubmit={createBook} />
            </div>
          </div>
          <div className="modal-backdrop" onClick={closeModals}></div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg">Edit Buku</h3>
            <div className="py-4">
              <BookForm isEdit={true} onSubmit={updateBook} />
            </div>
          </div>
          <div className="modal-backdrop" onClick={closeModals}></div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Konfirmasi Hapus</h3>
            <p className="py-4">
              Apakah Anda yakin ingin menghapus buku "{bookToDelete?.title}"?
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="modal-action">
              <button className="btn btn-outline" onClick={closeModals}>
                Batal
              </button>
              <button className="btn btn-error" onClick={deleteBook}>
                Hapus
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={closeModals}></div>
        </div>
      )}
    </div>
  );
};

export default Books;
