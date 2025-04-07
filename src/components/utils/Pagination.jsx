import React from 'react';

const Pagination = ({ page, setPage, count, pageSize }) => {
  const totalPages = Math.ceil(count / pageSize);

  return (
    <div style={styles.container}>
      <button
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
        style={{ 
          ...styles.button, 
          ...(page === 1 && styles.disabledButton) 
        }}
      >
        Previous
      </button>

      <span style={styles.pageText}>Page {page} of {totalPages}</span>

      <button
        onClick={() => setPage((p) => (p * pageSize < count ? p + 1 : p))}
        disabled={page * pageSize >= count}
        style={{
          ...styles.button,
          ...(page * pageSize >= count && styles.disabledButton)
        }}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '2rem',
    fontFamily: 'Roboto, sans-serif',
  },
  button: {
    padding: '6px 16px',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  disabledButton: {
    backgroundColor: '#90caf9',
    cursor: 'not-allowed',
  },
  pageText: {
    fontWeight: 'bold',
    color: '#333',
  }
};
