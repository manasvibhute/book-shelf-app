import React, { useState, useEffect } from 'react';
import {
    Modal, Box, Typography, IconButton, Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import PushPinIcon from '@mui/icons-material/PushPin';
import DeleteIcon from '@mui/icons-material/Delete';

const pastelColors = ['#ffa4ac', '#ffbdf8', '#ffdac1', '#e4fcbcff', '#b5ead7', '#c7ceea'];

export default function QuoteModal({ open, onClose, quote, onEdit, onSave, onPin, onDelete }) {
    const [bgColor, setBgColor] = useState(quote?.bgColor || '#fff7e6');

    useEffect(() => {
        if (quote?.bgColor) {
            setBgColor(quote.bgColor);
        }
    }, [quote]);

    if (!quote) return null;

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 420,
                    height: 300,
                    bgcolor: bgColor,
                    borderRadius: 4,
                    boxShadow: 24,
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                {/* 🔼 Action Buttons */}
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        position: 'absolute',
                        top: 8,
                        px: 2,
                    }}
                >
                    <Box display="flex" gap={1}>
                        <Tooltip title="Edit">
                            <IconButton onClick={() => onEdit({ ...quote, bgColor })}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Pin this quote">
                            <IconButton onClick={() => onPin({ ...quote, bgColor })}>
                                <PushPinIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <Tooltip title="Delete Quote">
                        <IconButton
                            onClick={() => {
                                if (window.confirm("Are you sure you want to delete this quote?")) {
                                    onDelete(quote);
                                }
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* 🎨 Color Picker - Top Center */}
                <Box mt={5} display="flex" gap={1} justifyContent="center">
                    {pastelColors.map(color => (
                        <Box
                            key={color}
                            onClick={() => setBgColor(color)}
                            sx={{
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                backgroundColor: color,
                                border: bgColor === color ? '2px solid black' : '1px solid #ccc',
                                cursor: 'pointer',
                            }}
                        />
                    ))}
                </Box>

                {/* 💬 Quote in center */}
                <Box textAlign="center">
                    <Typography variant="h6" fontStyle="italic">
                        "{quote.text}"
                    </Typography>
                    <Typography variant="body2" mt={1}>
                        - {quote.author}
                    </Typography>
                </Box>

                {/* ✅ Save Button */}
                <Box alignSelf="flex-end" mt={1}>
                    <Tooltip title="Save and Close">
                        <IconButton
                            onClick={() => {
                                if (onSave) {
                                    onSave({ ...quote, bgColor });  // ✅ send updated quote
                                }
                                onClose(); // close modal
                            }}
                        >
                            <CheckIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
        </Modal>
    );
}
