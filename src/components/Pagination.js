import React from 'react';
import { Pagination as BootstrapPagination } from 'react-bootstrap';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange,
  hasNextPage,
  hasPrevPage 
}) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="d-flex justify-content-between align-items-center mt-4">
      <div className="pagination-info">
        <span className="text-muted">
          Showing {startItem} to {endItem} of {totalItems} entries
        </span>
      </div>
      
      <BootstrapPagination className="mb-0 custom-pagination">
        {/* First Page */}
        <BootstrapPagination.Item
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="pagination-nav"
        >
          <FiChevronsLeft />
        </BootstrapPagination.Item>

        {/* Previous Page */}
        <BootstrapPagination.Item
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          className="pagination-nav"
        >
          <FiChevronLeft />
        </BootstrapPagination.Item>

        {/* Page Numbers */}
        {visiblePages.map((page, index) => (
          page === '...' ? (
            <BootstrapPagination.Ellipsis key={`ellipsis-${index}`} />
          ) : (
            <BootstrapPagination.Item
              key={page}
              active={page === currentPage}
              onClick={() => onPageChange(page)}
              className="pagination-number"
            >
              {page}
            </BootstrapPagination.Item>
          )
        ))}

        {/* Next Page */}
        <BootstrapPagination.Item
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="pagination-nav"
        >
          <FiChevronRight />
        </BootstrapPagination.Item>

        {/* Last Page */}
        <BootstrapPagination.Item
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="pagination-nav"
        >
          <FiChevronsRight />
        </BootstrapPagination.Item>
      </BootstrapPagination>
    </div>
  );
};

export default Pagination;