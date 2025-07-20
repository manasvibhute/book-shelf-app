import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../stylesheets/home.css'; // External CSS file

const books = [
  { id: 1, cover: 'https://th.bing.com/th/id/OIP.0qxWWiv5uAS-T2OK11jpawHaLZ?r=0&rs=1&pid=ImgDetMain&cb=idpwebp1&o=7&rm=3' },
  { id: 2, cover: 'https://marketplace.canva.com/EAFXKFIDad4/1/0/1003w/canva-brown-mystery-novel-book-cover-cSu1pdo96zA.jpg' },
  { id: 3, cover: 'https://static-cse.canva.com/blob/142533/Red-and-Beige-Cute-Illustration-Young-Adult-Book-Cover.jpg' },
  { id: 4, cover: 'https://i.pinimg.com/originals/ec/56/6c/ec566cd3279d74143efe432d0647f44b.jpg' },
];

export default function BookShelfApp() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard'); // ✅ Already logged in
    } else {
      navigate('/login'); // ❌ Not logged in yet
    }
  };

  return (
    <div className="bookshelf-page">
      <div className="book-grid">
        {/* Top row - Full covers */}
        {books.slice(0, 3).map((book) => (
          <div className="book-full" key={book.id}>
            <img src={book.cover} alt="Book cover" />
          </div>
        ))}

        {/* Center overlay card */}
        <div className="overlay-card">
          <h1>BookShelf</h1>
          <p>
            Track your reading. Reflect your journey.
            <br />
            Your personal bookshelf, anytime, anywhere.
          </p>
          <button className="get-started-button" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>

        {/* Bottom row - Slightly taller covers */}
        {books.slice(3).map((book) => (
          <div className="book-half" key={book.id}>
            <img src={book.cover} alt="Book cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
