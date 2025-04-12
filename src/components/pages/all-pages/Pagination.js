import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav className="d-flex justify-content-center my-4">
      {/* Custom CSS za sivu paginaciju */}
      <style>
        {`
          .pagination .page-link {
            color: #495057;
            background-color: #fff;
            border-color: #dee2e6;
          }
          
          .pagination .page-link:hover {
            color: #212529;
            background-color: #e9ecef;
            border-color: #dee2e6;
          }
          
          .pagination .page-item.active .page-link {
            color: #fff;
            background-color: #6c757d;
            border-color: #6c757d;
          }
          
          .pagination .page-item.disabled .page-link {
            color: #ced4da;
          }
          
          .pagination .page-link:focus {
            box-shadow: 0 0 0 0.25rem rgba(108, 117, 125, 0.25);
          }
        `}
      </style>

      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>
            &laquo;
          </button>
        </li>

        {pages.map((page) => (
          <li key={page} className={`page-item ${page === currentPage ? "active" : ""}`}>
            <button className="page-link" onClick={() => onPageChange(page)}>
              {page}
            </button>
          </li>
        ))}

        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;