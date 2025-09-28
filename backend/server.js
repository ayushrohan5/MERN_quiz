const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const Room = require('./models/Room');
const Quiz = require('./models/Quiz');
const quizRoutes = require('./routes/quizRoutes');
const roomRoutes = require('./routes/roomRoutes');

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' }, transports: ['polling'] });

app.use(cors());
app.use(express.json());
app.use('/api/quiz', quizRoutes);
app.use('/api/room', roomRoutes);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'));

// ---------------- SOCKET.IO -----------------
io.on('connection', socket => {
  console.log('New socket connected:', socket.id);

  // ---------- Join Room ----------
  socket.on('joinRoom', async ({ roomCode, playerName }) => {
    socket.join(roomCode);

    let room = await Room.findOne({ code: roomCode });
    if (!room) {
      console.log('Room not found:', roomCode);
      return;
    }

    // Add player if not exists
    if (!room.players.some(p => p.name === playerName)) {
      room.players.push({
        name: playerName,
        score: 0,
        socketId: socket.id,
        currentQuestionIndex: 0
      });
      await room.save();
    }

    io.to(roomCode).emit('playerList', room.players);
  });

  // ---------- Start Quiz (Host) ----------
  socket.on('startQuiz', async ({ roomCode }) => {
    const room = await Room.findOne({ code: roomCode }).populate({
      path: 'quiz',
      populate: { path: 'questions' }
    });

    if (!room || !room.quiz) return;
    room.isQuizActive = true;
    await room.save();

    // Send all questions to everyone
    io.to(roomCode).emit('quizStarted', room.quiz.questions);
  });

  // ---------- Submit Answer ----------
  // ---------- Submit Answer ----------
socket.on('submitAnswer', async ({ roomCode, playerName, answerIndex }) => {
  const room = await Room.findOne({ code: roomCode }).populate({
    path: 'quiz',
    populate: { path: 'questions' }
  });
  if (!room) return;

  const player = room.players.find(p => p.name === playerName);
  if (!player) return;

  if (player.answeredIndex === player.currentQuestionIndex) return;

  player.answeredIndex = player.currentQuestionIndex;

  const currentQ = room.quiz.questions[player.currentQuestionIndex];
  if (currentQ.correctAnswer === answerIndex) {
    player.score += 10;
  }

  player.currentQuestionIndex += 1; // advance for this player only
  await room.save();

  // Send leaderboard update to everyone in the room
  io.to(roomCode).emit('leaderboard',
    room.players.sort((a, b) => b.score - a.score)
  );

  // Send next question ONLY to this specific player (using their socket ID)
  if (player.currentQuestionIndex < room.quiz.questions.length) {
    io.to(socket.id).emit(
      'nextQuestion',
      room.quiz.questions[player.currentQuestionIndex]
    );
  } else {
    // Send quiz ended ONLY to this specific player
    io.to(socket.id).emit('quizEnded');
  }
});




  

  socket.on('disconnect', async () => {
    console.log('Socket disconnected:', socket.id);
    // Optional: remove player from room.players
  });
});

app.get('/', (req, res) => res.send('Hello World!'));

// ---------------- START SERVER -----------------
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on ${PORT}`));
