import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

export default function AddQuoteForm({ onClose, onAddQuote, initialData }) {
    initialData = initialData || {};
    const safeData = initialData || {};

    const [text, setText] = useState(safeData.text || '');
    const [author, setAuthor] = useState(safeData.author || '');
    const [mood, setMood] = useState(safeData.mood || '');
    const [bgColor, setBgColor] = useState(safeData.bgColor || '#fff7e6');


    const handleSubmit = (e) => {
        e.preventDefault();
        if (text && author && mood) {
            const newQuote = {
                ...initialData, // if editing, preserve _id or other info
                text,
                author,
                mood,
                bgColor,
            };
            onAddQuote(newQuote); // call parent
            onClose();            // close modal
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Quote"
                fullWidth
                value={text}
                onChange={(e) => setText(e.target.value)}
                margin="normal"
                required
            />
            <TextField
                label="Author"
                fullWidth
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                margin="normal"
                required
            />
            <FormControl fullWidth margin="normal" required>
                <InputLabel>Mood</InputLabel>
                <Select
                    value={mood}
                    label="Mood"
                    onChange={(e) => setMood(e.target.value)}
                >
                    <MenuItem value="inspired">Inspired</MenuItem>
                    <MenuItem value="calm">Calm</MenuItem>
                    <MenuItem value="happy">Happy</MenuItem>
                    <MenuItem value="sad">Sad</MenuItem>
                    <MenuItem value="motivated">Motivated</MenuItem>
                </Select>
            </FormControl>
            <div style={{ marginTop: '12px' }}>
                <label>Choose Background Color:</label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    {['#ffa4ac', '#ffbdf8', '#fdd2b6ff', '#e1ffb0', '#b1fce0ff', '#a7ebf9ff'].map(color => (
                        <div
                            key={color}
                            onClick={() => setBgColor(color)}
                            style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: color,
                                border: bgColor === color ? '2px solid black' : '1px solid #ccc',
                                cursor: 'pointer',
                            }}
                        />
                    ))}
                </div>
            </div>
            <Button type="submit" variant="contained" color="primary">
                {initialData.text ? 'Update Quote' : 'Add Quote'}
            </Button>
        </form>
    );
}
