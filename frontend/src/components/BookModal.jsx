import React from 'react';
import '../stylesheets/BookModal.css'; // Create this stylesheet too

export default function BookModal({ book, onClose, onEdit, onDelete, onToggleFavorite }) {
  if (!book) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <img
          src={book.cover || 'https://via.placeholder.com/150x220?text=No+Image'}
          alt={book.title}
          className="modal-book-cover"
        />

        <h2>{book.title}</h2>
        <p><strong>Author:</strong> {book.author}</p>
        <p><strong>Genre:</strong> {book.genre}</p>
        <p><strong>Status:</strong> {book.status}</p>
        {book.notes && <p><strong>Notes:</strong> {book.notes}</p>}

        {/* Show review and rating only if status is "Finished" */}
        {book.status === 'Finished' && (
          <>
            {book.review && <p><strong>Review:</strong> {book.review}</p>}
            {book.rating && (
              <div
                className="starability-result"
                data-rating={book.rating}
                style={{ transform: 'scale(0.65)', transformOrigin: 'left' }}
              ></div>
            )}
          </>
        )}

        <div className="modal-buttons">
          <button onClick={onEdit} className="edit-btn">Edit</button>
          <button onClick={onDelete} className="delete-btn">Delete</button>
          <i
            className={`fas fa-heart ${book.favorite ? 'favorited' : ''}`}
            onClick={() => onToggleFavorite(book)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '60px',
              fontSize: '22px',
              color: book.favorite ? 'red' : 'gray',
              cursor: 'pointer',
            }}
          ></i>

        </div>
      </div>
    </div>
  );
}
