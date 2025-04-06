// components/forms/CategoryForm.jsx
import React from "react";

const CategoryForm = ({
  currentCategory,
  onChange,
  onSubmit,
  editMode,
  onCancel,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-control w-full py-1 mb-2">
        <label className="label py-1">
          <span className="label-text">Name</span>
        </label>
        <input
          type="text"
          name="name"
          value={currentCategory.name}
          onChange={onChange}
          placeholder="Category name"
          className="input input-bordered w-full input-sm sm:input-md"
          required
        />
      </div>
      <div className="form-control w-full py-2">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea
          name="description"
          value={currentCategory.description}
          onChange={onChange}
          placeholder="Category description"
          className="textarea textarea-bordered w-full textarea-sm sm:textarea-md"
          rows="3"
        ></textarea>
      </div>
      <div className="modal-action flex flex-col-reverse sm:flex-row gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="btn sm:btn-md w-full sm:w-auto"
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary w-full sm:w-auto">
          {editMode ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
