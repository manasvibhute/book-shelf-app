import React, { useState, useEffect, useContext } from 'react';
import '../stylesheets/Dashboard.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from 'react-router-dom';
import BookModal from './BookModal';
import { AuthContext } from './AuthContext';
import { genres } from '../utils/genres'; // adjust path if needed
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Dashboard() {
    const { darkMode, setDarkMode } = useTheme();
    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext); /*user gives you the current logged-in user's info (like user.name)
                                                        setUser(null) will log them out*/
    const [modalBook, setModalBook] = useState(null);
    const [books, setBooks] = useState([]);
    const [activeTab, setActiveTab] = useState('Want to Read');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedRating, setSelectedRating] = useState('');
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);  // 👈 ADD HERE


    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/books/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}` // ✅ Add token header
                }
            });
            setBooks(prev => prev.filter(book => book._id !== id));
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const handleEdit = (book) => {
        navigate('/add-book', { state: { bookToEdit: book } });
    };

    const filteredBooks = books.filter((book) => {
        const matchesTab = book.status === activeTab;
        const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGenre = selectedGenre ? book.genre === selectedGenre : true;
        const matchesRating = selectedRating ? book.rating === selectedRating : true;
        const matchesFavorite = showFavoritesOnly ? book.favorite : true;

        return matchesTab && matchesSearch && matchesGenre && matchesRating && matchesFavorite;
    });

    const toggleFavorite = async (book) => {
        try {
            const token = localStorage.getItem('token');
            const updated = { ...book, favorite: !book.favorite };
            const res = await fetch(`http://localhost:5000/api/books/${book._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(updated),
            });
            const updatedBook = await res.json();
            setBooks(prev => prev.map(b => (b._id === book._id ? updatedBook : b)));
            setModalBook(updatedBook);
        } catch (err) {
            console.error('Error toggling favorite:', err);
        }
    };


    useEffect(() => {
        setSearchTerm('');
        setSelectedGenre('');
        setSelectedRating('');
    }, [activeTab]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const res = await fetch('http://localhost:5000/api/books', {
                    headers: {
                        Authorization: `Bearer ${token}` // ✅ pass token
                    }
                });
                const data = await res.json();
                setBooks(data);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        fetchBooks();
    }, [user]);

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="top-bar">
                    <Link to="/" className="home">Home</Link>
                    <div className="top-right">
                        <button
                            className="icon-button"
                            onClick={() => setDarkMode(!darkMode)}
                            title="Toggle Theme"
                        >
                            <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
                        </button>
                        <button className="logout-button" onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('userId');
                            localStorage.removeItem('userEmail');
                            setUser(null);
                            setBooks([]);
                            navigate('/');
                        }}>
                            Logout
                        </button>
                    </div>
                </div>
                <div className="user-greeting">
                    <span className="greeting">Hi, {user?.name || 'Reader'} 👋</span>
                </div>
                <div className="search-bar">
                    <div className="search-input-wrapper">
                        <i className="fas fa-search search-icon"></i>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="icons">
                        <div className="circle-icon">
                            <i className="fas fa-filter"></i>
                        </div>
                        <div
                            className="circle-icon"
                            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                            title="Toggle Favorites"
                        >
                            <i className={`fa${showFavoritesOnly ? 's' : 'r'} fa-heart ${showFavoritesOnly ? 'active' : ''}`} />
                        </div>

                    </div>
                </div>
            </header>

            <h2 className="books-heading">Books</h2>

            <div className="book-section-wrapper">
                <div className="tabs">
                    {['Want to Read', 'Reading', 'Finished'].map((tab) => (
                        <button
                            key={tab}
                            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {filteredBooks.length === 0 ? (
                    searchTerm || selectedGenre || selectedRating ? (
                        <p className="no-books">No books found matching the criteria.</p>
                    ) : (
                        <p className="no-books">No books in {activeTab} yet.</p>
                    )
                ) : (
                    <div className="books-grid-scroll">
                        <div className="books-grid">
                            {filteredBooks.map((book) => (
                                <div key={book._id} className="book-card" onClick={() => setModalBook(book)}>
                                    <img
                                        src={book.cover || 'https://via.placeholder.com/150x220.png?text=No+Image'}
                                        alt={book.title}
                                    />

                                    <div className="book-details">
                                        <p className="book-title">{book.title}</p>
                                        <p className="book-meta"><strong>Author:</strong> {book.author}</p>
                                        <p className="book-meta"><strong>Genre:</strong> {book.genre}</p>
                                        <p className="book-meta"><strong>Status:</strong> {book.status}</p>

                                        {book.review && (
                                            <p className="book-review">💬 {book.review}</p>
                                        )}

                                        {book.rating && (
                                            <div
                                                className="starability-result"
                                                data-rating={book.rating}
                                                style={{
                                                    marginTop: '4px',
                                                    transform: 'scale(0.55)',
                                                    transformOrigin: 'left'
                                                }}
                                            ></div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                )}

                <Link to="/add-book" className="floating-add-button">
                    <i className="fas fa-plus"></i>
                </Link>


                {modalBook && (
                    <BookModal
                        book={modalBook}
                        onClose={() => setModalBook(null)}
                        onEdit={() => handleEdit(modalBook)}
                        onDelete={() => {
                            handleDelete(modalBook._id);
                            setModalBook(null);
                        }}
                        onToggleFavorite={toggleFavorite}
                    />
                )}
            </div>

        </div>
    );
}
