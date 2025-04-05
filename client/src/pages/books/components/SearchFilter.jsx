import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchFilter = ({
  keyword,
  setKeyword,
  selectedCategory,
  setSelectedCategory,
  categories,
  handleSearch,
  setCurrentPage,
}) => {
  return (
    <div className="bg-base-200 p-4 rounded-lg mb-6">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
        <div className="form-control flex-1">
          <div className="input-group">
            <input
              type="text"
              placeholder="Cari judul buku..."
              className="input input-bordered "
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
            setCurrentPage(1);
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
  );
};

export default SearchFilter;
