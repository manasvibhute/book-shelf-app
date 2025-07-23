import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Grid, Modal, Button, Typography } from '@mui/material';
import { AuthContext } from '../AuthContext';
import MoodSelector from './MoodSelector';
import DailyCard from './DailyCard';
import PinnedCard from './PinnedCard';
import AddQuoteForm from './AddQuoteForm';
import QuoteStrip from './QuoteStrip';
import QuoteModal from './QuoteModal'; // adjust path if needed
import '../quotes/quoteCard.css'; // or wherever your CSS is
import BlurredStrip from './QuoteStrip';

export default function Qdashboard() {
    const [quotes, setQuotes] = useState([]); //All user setQuotes
    const { user } = useContext(AuthContext);
    const [activeMood, setActiveMood] = useState('random');
    const [showIdx, setShowIdx] = useState(0); //to toggle show another
    const [pinnedQuote, setPinnedQuote] = useState(null);
    const [selectedQuote, setSelectedQuote] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [formQuote, setFormQuote] = useState(null); // For editing a quote
    const [openForm, setOpenForm] = useState(false);  // For AddQuoteForm modal
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);
    const setUser = () => { };
    const setBooks = () => { };

    const moodQuotes = activeMood === 'random'
        ? quotes : quotes.filter(q => q.mood === activeMood);

    const mainQuote = moodQuotes[showIdx % moodQuotes.length] || null;
    const anotherQuote = moodQuotes[(showIdx + 1) % moodQuotes.length] || null;

    const handlePinQuote = (quote) => {
        setPinnedQuote({
            ...quote,
        });
    };

    const handleAddOrUpdateQuote = async (newQuote) => {
        if (!newQuote.text || !newQuote.author || !newQuote.mood) return;

        // If it's an edit (quote already exists)
        if (newQuote._id) {
            // PUT to backend to update it
            console.log("Frontend Token:", localStorage.getItem('token'));
            try {
                const res = await fetch(`/api/quotes/${newQuote._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(newQuote)
                });

                const updated = await res.json();

                setQuotes(prev =>
                    prev.map(q => q._id === updated._id ? updated : q)
                );

                if (pinnedQuote?._id === updated._id) {
                    setPinnedQuote(updated);
                }
            } catch (err) {
                console.error('Failed to update quote:', err);
            }

        } else {
            // It's a new quote — POST to backend!
            try {
                const res = await fetch('/api/quotes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(newQuote)
                });

                const saved = await res.json();

                setQuotes(prev => [saved, ...prev]);
            } catch (err) {
                console.error('Failed to add quote:', err);
            }
        }

        setOpenForm(false);
        setFormQuote(null);
    };

    const handleUpdateQuote = async (updatedQuote) => {
        console.log("🟡 Updating quote with color:", updatedQuote.bgColor);

        // 🛑 If quote has no real MongoDB ID, don't send to backend
        const isTemporary = !updatedQuote._id || updatedQuote._id.length < 24;
        if (isTemporary) {
            console.warn("⚠️ Skipping backend update for temp quote:", updatedQuote);
            // Update locally only
            setQuotes(prev =>
                prev.map(q => q._id === updatedQuote._id ? updatedQuote : q)
            );
            setSelectedQuote(null);
            return;
        }

        try {
            const res = await fetch(`/api/quotes/${updatedQuote._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updatedQuote)
            });

            const saved = await res.json();
            console.log("✅ Server responded:", saved);

            setQuotes(prev =>
                prev.map(q => q._id === saved._id ? saved : q)
            );

            if (pinnedQuote?._id === saved._id) {
                setPinnedQuote(saved);
            }

            setSelectedQuote(null);
        } catch (err) {
            console.error("❌ Failed to update quote:", err);
        }
    };

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [darkMode]);

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log("📦 Frontend is sending token:", token);
                const response = await fetch('/api/quotes', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch quotes');
                }

                const data = await response.json();
                setQuotes(data);
            } catch (error) {
                console.error('Error fetching quotes:', error);
            }
        };

        fetchQuotes();
    }, []);

    console.log("Quotes:", quotes);
    console.log("Mood:", activeMood);
    console.log("MoodQuotes:", moodQuotes);
    console.log("mainQuote:", mainQuote);

    return (
        <>
            <header className="dashboard-header">
                <div className="navbar">
                    <div className="top-bar">
                        <div className='nav-links'>
                            <Link to="/" className="home">Home</Link>
                            <Link to="/dashboard" className='dashboard'>Dashboard</Link>
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
            <Box
                px={{ xs: 2, sm: 4, md: 6 }}
                py={{ xs: 3, sm: 4 }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={2}
                    mb={2}
                >
                    <MoodSelector activeMood={activeMood} setActiveMood={setActiveMood} />
                    <Button
                        variant="outlined"
                        color="error"
                        sx={{ borderRadius: '20px' }}
                        onClick={() => {
                            setFormQuote(null); // blank form
                            setOpenForm(true);  // open modal
                        }}
                    >
                        Add a quote
                    </Button>
                </Box>
                <Box
                    display="flex"
                    gap={4}
                    mt={2}
                    flexWrap="wrap"
                    flexDirection={{ xs: 'column', md: 'row' }}
                    sx={{ mx: { xs: 1, sm: 2, md: 4 }, minHeight: 300 }}
                >
                    <Box flex={1} minWidth="300px" display="flex" flexDirection="column">
                        {mainQuote ? (
                            <DailyCard
                                mainQuote={mainQuote}
                                anotherQuote={anotherQuote}
                                onPin={handlePinQuote}
                                onShowNext={() => setShowIdx(prev => prev + 1)}
                            />
                        ) : (
                            <Typography variant="body1" color="textSecondary">
                                No quotes available for this mood.
                            </Typography>
                        )}
                    </Box>

                    <Box flex={1} minWidth="300px" display="flex" flexDirection="column">
                        {pinnedQuote ? (
                            <PinnedCard pinnedQuote={pinnedQuote} onDelete={() => setPinnedQuote(null)} />
                        ) : (
                            <p>❌ No pinned quote yet</p>
                        )}
                    </Box>
                </Box>
                <QuoteStrip quotes={quotes} onQuoteClick={(quote) => setSelectedQuote(quote)} />
            </Box>
            <QuoteModal
                open={!!selectedQuote}
                quote={selectedQuote}
                onClose={() => setSelectedQuote(null)}
                onEdit={(quote) => {
                    setFormQuote(quote);
                    setSelectedQuote(null);
                    setOpenForm(true);
                }}
                onSave={handleUpdateQuote}
                onPin={handlePinQuote}
                onDelete={(quote) => {
                    setQuotes(prev => prev.filter(q => q._id !== quote._id));
                    if (pinnedQuote?._id === quote._id) setPinnedQuote(null);
                    setSelectedQuote(null);
                }}
            />
            <Modal open={openForm} onClose={() => setOpenForm(false)}>
                <Box
                    className="add-quote-modal"
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        borderRadius: 2,
                        p: 4,
                        width: 400,
                    }}
                >
                    <AddQuoteForm
                        initialData={formQuote}
                        onClose={() => setOpenForm(false)}
                        onAddQuote={handleAddOrUpdateQuote}
                    />
                </Box>
            </Modal>
        </>
    );
}