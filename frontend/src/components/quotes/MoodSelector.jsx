import React from 'react';

export default function MoodSelector({ activeMood, setActiveMood }) {
  const moods = ['random', 'happy', 'sad', 'calm', 'inspired'];

  return (
    <div className="mood-selector">
      {moods.map((mood) => (
        <button
          key={mood}
          className={activeMood === mood ? 'mood-button active' : 'mood-button'}
          onClick={() => setActiveMood(mood)}
        >
          {getMoodEmoji(mood)} {mood}
        </button>
      ))}
    </div>
  );
}

// Optional: Emoji helper
function getMoodEmoji(mood) {
  const moodMap = {
    happy: '😊',
    sad: '😢',
    calm: '😌',
    inspired: '💡',
    random: '🎲',
  };
  return moodMap[mood] || '🎭';
}
