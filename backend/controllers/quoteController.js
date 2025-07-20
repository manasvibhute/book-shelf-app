const Quote = require('../models/Quote');

// @desc    Get all quotes for the logged-in user
// @route   GET /api/quotes
// @access  Private
const getQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(quotes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch quotes', error });
  }
};

const createQuote = async (req, res) => {
  const { text, author, mood, bgColor } = req.body;

  if (!text || !author || !mood) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  try {
    const newQuote = new Quote({
      text,
      author,
      mood,
      bgColor: bgColor || '#fff7e6', // fallback
      isPinned: false,
      createdBy: req.user._id,
    });

    const savedQuote = await newQuote.save();

    console.log("🆕 New quote added:", {
      text: savedQuote.text,
      color: savedQuote.bgColor,
      mood: savedQuote.mood,
    });

    res.status(201).json(savedQuote);
  } catch (error) {
    console.error("❌ Failed to create quote:", error);
    res.status(500).json({ message: 'Failed to create quote', error });
  }
};

// PUT /api/quotes/:id
const updateQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).json({ error: "Quote not found" });

    if (!quote.createdBy.equals(req.user._id)) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    console.log("🎨 Original color:", quote.bgColor);
    console.log("🎯 New color from frontend:", req.body.bgColor);

    // Update fields
    quote.text = req.body.text;
    quote.author = req.body.author;
    quote.mood = req.body.mood;
    quote.bgColor = req.body.bgColor || quote.bgColor;

    const updated = await quote.save();
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


// @desc    Delete a quote
// @route   DELETE /api/quotes/:id
// @access  Private
const deleteQuote = async (req, res) => {
  const { id } = req.params;

  try {
    const quote = await Quote.findOne({ _id: id, createdBy: req.user._id });
    if (!quote) return res.status(404).json({ message: 'Quote not found' });

    await quote.remove();
    res.status(200).json({ message: 'Quote deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete quote', error });
  }
};

// @desc    Pin a quote (only one pinned per user)
// @route   PATCH /api/quotes/:id/pin
// @access  Private
const pinQuote = async (req, res) => {
  const { id } = req.params;

  try {
    // Unpin all other quotes for this user
    await Quote.updateMany({ createdBy: req.user._id }, { $set: { isPinned: false } });

    // Pin the selected quote
    const pinned = await Quote.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      { $set: { isPinned: true } },
      { new: true }
    );

    if (!pinned) return res.status(404).json({ message: 'Quote not found' });

    res.status(200).json(pinned);
  } catch (error) {
    res.status(500).json({ message: 'Failed to pin quote', error });
  }
};

module.exports = {
  getQuotes,
  createQuote,
  updateQuote,
  deleteQuote,
  pinQuote,
};
