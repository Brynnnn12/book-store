import React, { useState, useEffect, useRef } from "react";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-hot-toast";
import api from "../../utils/axiosConfig";
import BookTable from "./components/BookTable";
import BookForm from "./components/BookForm";
import Pagination from "./components/Pagination";
import SearchFilter from "./components/SearchFilter";
import DeleteConfirmationModal from "./components/DeleteModal";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const Books = () => {
  // State management
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
    setCurrentPage(1);
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

  // Modal handlers
  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

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

  const openDeleteModal = (book) => {
    setBookToDelete(book);
    setIsDeleteModalOpen(true);
  };

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

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    resetForm();
  };

  // CRUD operations
  const createBook = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
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

  const updateBook = async (e) => {
    e.preventDefault();
    if (!bookToEdit) return;

    try {
      setIsSubmitting(true);
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

  // Pagination handler
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mx-auto pt-24 mb-10 px-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manajemen Buku</h1>
          <button onClick={openCreateModal} className="btn btn-primary">
            <FaPlus className="mr-2" /> Tambah Buku
          </button>
        </div>

        <SearchFilter
          keyword={keyword}
          setKeyword={setKeyword}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          handleSearch={handleSearch}
          setCurrentPage={setCurrentPage}
        />

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
              <BookTable
                books={books}
                loading={loading}
                currentPage={currentPage}
                openEditModal={openEditModal}
                openDeleteModal={openDeleteModal}
              />
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
          />
        )}

        {/* Modals */}
        {isCreateModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
              <h3 className="font-bold text-lg">Tambah Buku Baru</h3>
              <div className="py-4">
                <BookForm
                  isEdit={false}
                  onSubmit={createBook}
                  formData={formData}
                  handleChange={handleChange}
                  handleFileChange={handleFileChange}
                  previewImage={previewImage}
                  categories={categories}
                  isSubmitting={isSubmitting}
                  closeModals={closeModals}
                  fileInputRef={fileInputRef}
                />
              </div>
            </div>
            <div className="modal-backdrop" onClick={closeModals}></div>
          </div>
        )}

        {isEditModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
              <h3 className="font-bold text-lg">Edit Buku</h3>
              <div className="py-4">
                <BookForm
                  isEdit={true}
                  onSubmit={updateBook}
                  formData={formData}
                  handleChange={handleChange}
                  handleFileChange={handleFileChange}
                  previewImage={previewImage}
                  categories={categories}
                  isSubmitting={isSubmitting}
                  closeModals={closeModals}
                  fileInputRef={fileInputRef}
                />
              </div>
            </div>
            <div className="modal-backdrop" onClick={closeModals}></div>
          </div>
        )}

        <DeleteConfirmationModal
          bookToDelete={bookToDelete}
          closeModals={closeModals}
          deleteBook={deleteBook}
          isDeleteModalOpen={isDeleteModalOpen}
        />
      </div>
      <Footer />
    </>
  );
};

export default Books;
