import '../stylesheets/stars.css';
import React, { useState, useEffect } from 'react';
import { genres } from '../utils/genres';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, TextField, Button, MenuItem, Box } from '@mui/material';

const statuses = ['Want to Read', 'Reading', 'Finished'];

const inputStyles = {
    '& .MuiOutlinedInput-root': {
        height: 38,
        borderRadius: '12px',
        backgroundColor: '#fff',
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#ccc',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#888',
    },
    '& .MuiInputLabel-root': {
        fontSize: '13px',
        transform: 'translate(14px, 9px) scale(1)', // Centers the label vertically
        '&.MuiInputLabel-shrink': {
            transform: 'translate(14px, -9px) scale(0.75)', // Position when shrunk (focused/with value)
        },
    },
    '& input': {
        padding: '10px',
        fontSize: '14px',
    },
    marginBottom: '20px', // Adds 20px gap below each input
    '&:last-child': {
        marginBottom: '0', // Removes gap for the last element
    }
};

const initialFormData = {
    title: '',
    author: '',
    cover: '',
    genre: '',
    status: 'Want to Read',
    notes: '',
    review: '',
    rating: ''
};

export default function AddBookForm({ onAddBook, onUpdateBook, selectedBook, setSelectedBook }) {
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (selectedBook) {
            setFormData({
                title: selectedBook.title,
                author: selectedBook.author,
                cover: selectedBook.cover || '',
                genre: selectedBook.genre || '',
                status: selectedBook.status,
                notes: selectedBook.notes,
                review: selectedBook.review || '',
                rating: selectedBook.rating || ''
            });
        }
    }, [selectedBook]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const token = localStorage.getItem('token');
        const formDataImage = new FormData();
        formDataImage.append('cover', file);

        try {
            const res = await fetch('http://localhost:5000/api/books/upload', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataImage,
            });

            const data = await res.json();
            if (data.url) {
                setFormData((prev) => ({ ...prev, cover: data.url }));
            }
        } catch (err) {
            console.error('❌ Image upload failed:', err);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title) return alert('Title is required');

        selectedBook ? onUpdateBook(selectedBook._id, formData) : onAddBook(formData);

        setFormData(initialFormData);
        setSelectedBook?.(null);
    };

    const renderTextField = (name, label, props = {}) => (
        <TextField
            label={label}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            fullWidth
            margin="dense"
            sx={inputStyles}
            {...props}
        />
    );

    const renderSelectField = (name, label, options, props = {}) => (
        <TextField
            select
            label={label}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            fullWidth
            margin="dense"
            sx={inputStyles}
            {...props}
        >
            {options.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
        </TextField>
    );

    return (
        <Card sx={{
            maxWidth: 360, margin: '0 auto', p: 0, boxShadow: 3, borderRadius: 12, maxHeight: '75vh',       // ✅ Prevents page scroll
            overflowY: 'auto',
        }}>
            <CardContent sx={{ p: '16px 24px' }}>
                <Typography variant="h5" gutterBottom align="center">
                    Add a New Book
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    {renderTextField('title', 'Title', { required: true })}
                    {renderTextField('author', 'Author')}
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Upload Cover Image</Typography>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        style={{ marginBottom: '16px' }}
                    />
                    {formData.cover && (
                        <img
                            src={formData.cover}
                            alt="Book cover preview"
                            style={{
                                width: '100%',
                                borderRadius: '8px',
                                marginBottom: '16px',
                            }}
                        />
                    )}
                    {renderSelectField('genre', 'Genre', genres, { required: true })}
                    {renderSelectField('status', 'Status', statuses)}
                    {renderTextField('notes', 'Notes', { multiline: true, rows: 2 })}

                    {formData.status === 'Finished' && (
                        <>
                            {renderTextField('review', 'Review', {
                                multiline: true,
                                rows: 2,
                                placeholder: "Share your thoughts about the book..."
                            })}

                            <fieldset className="starability-basic" style={{ marginTop: '12px', transform: 'scale(0.7)', transformOrigin: 'left' }}>
                                <legend style={{ fontSize: '14px', marginBottom: '6px' }}>Rate this book:</legend>
                                {[1, 2, 3, 4, 5].map(val => (
                                    <React.Fragment key={val}>
                                        <input
                                            type="radio"
                                            id={`rate${val}`}
                                            name="rating"
                                            value={val}
                                            checked={formData.rating === val.toString()}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor={`rate${val}`} title={`${val} stars`} />
                                    </React.Fragment>
                                ))}
                            </fieldset>
                        </>
                    )}

                    <Box display="flex" justifyContent="center">
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{
                                mt: 2,
                                borderRadius: 12,
                                backgroundColor: "red",
                                width: '150px',
                                alignSelf: 'center'
                            }}
                        >
                            {selectedBook ? 'Update Book' : 'Add Book'}
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}