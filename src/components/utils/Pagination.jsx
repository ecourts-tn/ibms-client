import React from 'react';

const Pagination = ({ page, setPage, count, pageSize }) => {
    const totalPages = Math.ceil(count / pageSize);

    // Calculate the range of items to display
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, count);

    // Generate an array of page numbers for the pagination
    const pageNumbers = [...Array(totalPages).keys()].map((n) => n + 1);

    return (
        <div className="row d-flex justify-content-between">
            <div className="col-md-6">
                <div style={{ fontWeight: 'bold' }}>
                    Showing {start} - {end} of {count} entries
                </div>
            </div>
            <div className="col-md-6">
                <ul className="pagination justify-content-end">
                    {/* Previous Button */}
                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                        <button
                        className="page-link"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        >
                        Previous
                        </button>
                    </li>
                    {/* Page Number Buttons */}
                    {pageNumbers.map((pageNum) => (
                        <li
                        key={pageNum}
                        className={`page-item ${page === pageNum ? 'active' : ''}`}
                        >
                        <button
                            className="page-link"
                            onClick={() => setPage(pageNum)}
                        >
                            {pageNum}
                        </button>
                        </li>
                    ))}

                    {/* Next Button */}
                    <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                        <button
                        className="page-link"
                        onClick={() => setPage((p) => (p * pageSize < count ? p + 1 : p))}
                        disabled={page * pageSize >= count}
                        >
                        Next
                        </button>
                    </li>
                </ul>
            </div>
        </div>
  );
};

export default Pagination;

