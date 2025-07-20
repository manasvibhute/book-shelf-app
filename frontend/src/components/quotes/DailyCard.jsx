import React from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import PushPinIcon from '@mui/icons-material/PushPin';
import '../quotes/quoteCard.css'; // Optional: for your custom styles

export default function DailyCard({ mainQuote, anotherQuote, onPin, onShowNext }) {
  if (!mainQuote) return null;

  return (
    <Card
      className="quote-card daily-quote"
      style={{
        height: '100%',
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: mainQuote.bgColor || '#fff7e6'
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
        <Typography variant="h6" className="quote-text" fontStyle="italic">
          "{mainQuote.text}"
        </Typography>
        <Typography variant="body2" className="quote-author" mt={1}>
          - {mainQuote.author}
        </Typography>

        {/* Button group */}
        <div className="card-buttons" style={{ marginTop: '32px' }}>
          <IconButton onClick={onShowNext} title="Show Another">
            <ReplayIcon />
          </IconButton>
          <IconButton onClick={() => onPin(mainQuote)} title="Pin Quote">
            <PushPinIcon />
          </IconButton>
        </div>
      </CardContent>
    </Card>
  );
}
