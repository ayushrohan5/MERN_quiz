const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  host: { type: String},
  players: [
    {
      name: String,
      score: { type: Number, default: 0 },
      socketId: String,
      currentQuestionIndex: { type: Number, default: 0 },
      answeredIndex: { type: Number, default: -1 }  // track progress individually
    }
  ],
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  isQuizActive: { type: Boolean, default: false }
});

module.exports = mongoose.model('Room', RoomSchema);
