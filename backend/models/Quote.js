const mongoose = require('mongoose');
const quoteSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    mood: {
        type: String,
        enum: ['happy', 'sad', 'calm', 'inspired', 'random'],
        required: true,
    },
    isPinned: {
        type: Boolean,
        default: false,
    },
    bgColor: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // assumes you have a User model
        required: true,
    },
},
    {
        timestamps: true, // adds createdAt and updatedAt fields
    }
);

module.exports = mongoose.model('Quote', quoteSchema);