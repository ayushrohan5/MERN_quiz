// RoomController.js
const Room = require('../models/Room');

exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ code: req.params.code })
      .populate({
        path: 'quiz',  // First, populate the quiz reference
        populate: {
          path: 'questions',  // Then, nested populate questions in quiz
          model: 'Question'   // Explicitly specify model (good practice)
        }
      })
      // Optional: If you want full player details (if players have refs)
      // .populate('players')  // But players is array of subdocs, no ref needed usually

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Debug log: Check if full questions are populated
    console.log('Fetched room quiz questions:', room.quiz?.questions?.[0]);  // Should show full object, not ID

    res.json(room);
  } catch (err) {
    console.error('Error fetching room:', err);  // Better logging
    res.status(500).json({ error: 'Something went wrong' });
  }
};