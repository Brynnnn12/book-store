import React from "react";

const Pagination = ({ currentPage, totalPages, paginate }) => {
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

  return (
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
  );
};

export default Pagination;
