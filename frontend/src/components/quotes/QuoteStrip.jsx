import React from 'react';
import './quoteStrip.css';

const QuoteStrip = ({ quotes = [], onQuoteClick }) => {
    return (
        <div className='quote-strip-container'>
            <div className='quote-strip'>
                {quotes.map((quote, index) => (
                    <div
                        key={index}
                        className="quote-box"
                        style={{ backgroundColor: quote.bgColor || '#fff7e6' }}
                        onClick={() => onQuoteClick(quote)}
                    >
                        <p className='quote-text'>"{quote.text}"</p>
                        <p className='quote-text'>- {quote.author}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuoteStrip;
