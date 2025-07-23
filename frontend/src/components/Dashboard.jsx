import React, { useState, useEffect, useContext } from 'react';
import '../stylesheets/Dashboard.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from 'react-router-dom';
import BookModal from './BookModal';
import { Box, Button } from '@mui/material';
import { AuthContext } from './AuthContext';
import { genres } from '../utils/genres'; // adjust path if needed
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import ChatbotModal from './Chatbot';
import { display, flex } from '@mui/system';

export default function Dashboard() {
    const { darkMode, setDarkMode } = useTheme();
    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext);
    const [modalBook, setModalBook] = useState(null);
    const [books, setBooks] = useState([]);
    const [activeTab, setActiveTab] = useState('Want to Read');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedRating, setSelectedRating] = useState('');
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [activeFilterType, setActiveFilterType] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const toggleChat = () => {
        if (!chatOpen) {
            setChatOpen(true);
            setTimeout(() => setShowModal(true), 400); // wait for rotation
        } else {
            setShowModal(false);
            setTimeout(() => setChatOpen(false), 400); // wait for modal to disappear
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/books/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
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

    const filteredBooks = Array.isArray(books) ? books.filter((book) => {
        const matchesTab = book.status === activeTab;
        const matchesSearch = (
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const matchesGenre = selectedGenre ? book.genre === selectedGenre : true;
        const matchesRating =
            activeTab === 'Finished'
                ? selectedRating
                    ? book.rating === selectedRating
                    : true
                : true;
        const matchesFavorite = showFavoritesOnly ? book.favorite : true;

        return matchesTab && matchesSearch && matchesGenre && matchesRating && matchesFavorite;
    }) : [];

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
                        Authorization: `Bearer ${token}`
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
        <>
            <header className="dashboard-header">
                <div className="navbar">
                    <div className="top-bar">
                        <div className="nav-links">
                            <Link to="/" className="home">Home</Link>
                            <Link to="/quotes" className="quotes">Quotes</Link>
                        </div>
                        <div className="top-right">
                            <button
                                className="icon-button"
                                onClick={() => setDarkMode(!darkMode)}
                                title="Toggle Theme"
                            >
                                <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
                            </button>
                            <button
                                className="logout-button"
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    localStorage.removeItem('userId');
                                    localStorage.removeItem('userEmail');
                                    setUser(null);
                                    setBooks([]);
                                    navigate('/');
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="dashboard-container">
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
                        <div
                            className={`circle-icon ${showFilters ? 'active' : ''}`}
                            onClick={() => setShowFilters(prev => !prev)}
                            title="Toggle Filters"
                        >
                            <i className="fas fa-filter" style={{ color: darkMode ? 'white' : 'gray' }}></i>
                        </div>

                        <div
                            className="circle-icon"
                            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                            title="Toggle Favorites"
                        >
                            <i
                                className={`fa${showFavoritesOnly ? 's' : 'r'} fa-heart`}
                                style={{
                                    color: showFavoritesOnly ? 'red' : (darkMode ? 'white' : 'gray'),
                                }}
                            />
                        </div>
                    </div>
                </div>

                {showFilters && (
                    <div className="filters-container">
                        <select
                            value={selectedGenre}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            className="filter-dropdown"
                        >
                            <option value="">All Genres</option>
                            {genres.map((g) => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>

                        {activeTab === 'Finished' && (
                            <select
                                value={selectedRating}
                                onChange={(e) => setSelectedRating(e.target.value)}
                                className="filter-dropdown"
                            >
                                <option value="">All Ratings</option>
                                {[1, 2, 3, 4, 5].map((r) => (
                                    <option key={r} value={r}>{`${r} Stars`}</option>
                                ))}
                            </select>
                        )}
                    </div>
                )}

                <div className="book-addbook">
                    <h2 className="books-heading">Books</h2>
                    <Button
                        variant="outlined"
                        color="error"
                        sx={{ borderRadius: '20px' }}
                        onClick={() => navigate('/add-book')}
                    >
                        Add a Book
                    </Button>
                </div>

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
                    {/* Chatbot */}
                    <button
                        className={`chatbot-toggle ${chatOpen ? "rotated" : ""}`}
                        onClick={toggleChat}
                    >
                        🤖
                    </button>

                    {showModal && (
                        <div className="chatbot-modal-container">
                            <ChatbotModal onClose={toggleChat} />
                        </div>
                    )}

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
        </>
    );
}