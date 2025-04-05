import React from "react";
import { FaSave, FaUpload } from "react-icons/fa";

const BookForm = ({
  isEdit,
  onSubmit,
  formData,
  handleChange,
  handleFileChange,
  previewImage,
  categories,
  isSubmitting,
  closeModals,
  fileInputRef,
}) => {
  return (
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
};

export default BookForm;
