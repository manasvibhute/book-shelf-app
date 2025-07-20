import React from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import '../quotes/quoteCard.css';

export default function PinnedCard({ pinnedQuote, onDelete }) {
  if (!pinnedQuote) return null;

  return (
    <Card
      className="quote-card pinned-quote"
      style={{
        height: '100%',
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: pinnedQuote.bgColor || '#fff7e6'
      }}
    >
      <CardContent
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', // vertical center
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" fontStyle="italic" sx={{ color: '#444' }}>
          "{pinnedQuote.text}"
        </Typography>
        <Typography variant="body2" mt={1} sx={{ color: '#666' }}>
          - {pinnedQuote.author}
        </Typography>

        {/* Button group */}
        <div className="card-buttons" style={{ marginTop: '32px' }}>
          <IconButton onClick={onDelete} title="Remove Pinned Quote">
            <DeleteIcon />
          </IconButton>
        </div>
      </CardContent>
    </Card>
  );
}
