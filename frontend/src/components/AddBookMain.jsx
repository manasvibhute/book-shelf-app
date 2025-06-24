import { useEffect, useState } from 'react';
import AddBookForm from './AddBookForm';
import '../stylesheets/stars.css';
import { genres } from '../utils/genres';
import Dashboard from './Dashboard'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../stylesheets/addbook.css';


function AddBookMain() {
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const location = useLocation();
    const bookToEdit = location.state?.bookToEdit || null;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            const res = await fetch('http://localhost:5000/api/books');
            const data = await res.json();
            if (Array.isArray(data)) {
                setBooks(data);
            } else {
                console.error('Books fetch returned non-array:', data);
                setBooks([]);
            }
        };
        fetchBooks();
    }, []);

    const handleAddBook = async (newBook) => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        try {
            const res = await fetch('http://localhost:5000/api/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newBook),
            });

            const savedBook = await res.json();
            setBooks((prev) => [...prev, savedBook]);
        } catch (err) {
            console.error('Error adding book:', err);
        }
    };



    const handleDelete = async (id) => {
        const res = await fetch(`http://localhost:5000/api/books/${id}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            setBooks((prev) => prev.filter((book) => book._id !== id));
        }
    };

    const updateBook = async (id, updatedBook) => {
        const token = localStorage.getItem('token');
        console.log("📤 Updating Book ID:", id);
        console.log("📦 Data being sent:", updatedBook);
        try {
            const res = await fetch(`http://localhost:5000/api/books/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(updatedBook),
            });
            const data = await res.json();
            console.log('✅ Updated response:', data);
            setBooks((prev) => Array.isArray(prev)
                ? prev.map((book) => (book._id === id ? data : book))
                : []);
            setSelectedBook(null);
            requestAnimationFrame(() => {
                navigate('/dashboard');
            });
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

    return (
        <div className="add-book-container">
            <header className="top-bar">
                <div className="left-links">
                    <Link to="/" className="header-link">Home</Link>
                    <Link to="/dashboard" className="header-link">Dashboard</Link>
                </div>
                <button className="logout-button" onClick={() => {
                    localStorage.removeItem('token');
                    navigate('/login');
                }}>
                    Logout
                </button>
            </header>

            <h1 className="page-title">📚 My Reading Tracker</h1>

            <AddBookForm
                onAddBook={handleAddBook}
                onUpdateBook={updateBook}
                selectedBook={bookToEdit}
                setSelectedBook={setSelectedBook}
            />
        </div>
    );

}

export default AddBookMain;
