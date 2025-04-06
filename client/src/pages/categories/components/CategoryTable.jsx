import { useState, useEffect } from "react";
import api from "../../../utils/axiosConfig";
import { toast } from "react-hot-toast";
import ConfirmModal from "../../../components/ConfirmModal"; // pastikan ini sesuai path kamu
import { FaEye } from "react-icons/fa";
import { RiDeleteBin2Fill } from "react-icons/ri";
import CategoryForm from "./CategoryForm";

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [currentCategory, setCurrentCategory] = useState({
    _id: "",
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch categories");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: currentCategory.name,
        description: currentCategory.description,
      };

      if (editMode) {
        await api.put(`/categories/${currentCategory._id}`, payload);
        toast.success("Category updated successfully");
      } else {
        await api.post("/categories", payload);
        toast.success("Category created successfully");
      }

      fetchCategories();
      setModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (category) => {
    setCurrentCategory(category);
    setEditMode(true);
    setModalOpen(true);
  };

  const openDeleteModal = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedCategoryId) return;
    setIsDeleting(true);
    try {
      await toast.promise(api.delete(`/categories/${selectedCategoryId}`), {
        loading: "Deleting category...",
        success: "Category deleted successfully!",
        error: "Failed to delete category.",
      });
      fetchCategories();
    } finally {
      setDeleteModalOpen(false);
      setSelectedCategoryId(null);
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setCurrentCategory({
      _id: "",
      name: "",
      description: "",
    });
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-2">
        <h1 className="text-xl md:text-2xl font-bold">Category Management</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="btn btn-primary btn-sm md:btn-md w-full md:w-auto"
        >
          Add New Category
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          {/* Header tetap sama */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category._id}>
                  <td className="truncate max-w-[100px] md:max-w-none">
                    {category.name}
                  </td>
                  <td className="truncate max-w-[150px] md:max-w-none">
                    {category.description}
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      <button
                        onClick={() => handleEdit(category)}
                        className="btn btn-xs md:btn-sm btn-warning"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => openDeleteModal(category._id)}
                        className="btn btn-xs md:btn-sm btn-error"
                      >
                        <RiDeleteBin2Fill />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah/Edit */}
      <dialog open={modalOpen} className="modal px-4 modal-middle">
        <div className="modal-box max-w-full md:max-w-lg">
          <h3 className="font-bold text-lg">
            {editMode ? "Edit Category" : "Add New Category"}
          </h3>
          <CategoryForm
            currentCategory={currentCategory}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            editMode={editMode}
            onCancel={() => {
              setModalOpen(false);
              resetForm();
            }}
          />
        </div>
      </dialog>

      {/* Modal Konfirmasi Delete */}
      <ConfirmModal
        open={deleteModalOpen}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSelectedCategoryId(null);
        }}
        loading={isDeleting}
      />
    </div>
  );
};

export default CategoryTable;
