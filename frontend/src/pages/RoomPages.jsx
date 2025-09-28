import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { createSocket } from '../socket';

export default function RoomPage() {
  const { code } = useParams();
  const [connected, setConnected] = useState(false);
  const [players, setPlayers] = useState([]);
  const [question, setQuestion] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const socketRef = useRef(null);
  const [quizEnded, setQuizEnded] = useState(false);

useEffect(() => {
  const ended = localStorage.getItem(`quizEnded_${code}`) === 'true';
  setQuizEnded(ended);
}, [code]);

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const nameRef = useRef(user?.name || 'Guest');
  const isHost = localStorage.getItem('isHost') === 'true';

  // ---------------- SOCKET CONNECT ----------------
  function connectSocket() {
    if (socketRef.current) return;
    const socket = createSocket();
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('joinRoom', { roomCode: code, playerName: nameRef.current });
    });

    socket.on('playerList', list => setPlayers(list));

    socket.on('quizStarted', questions => {
      setQuizQuestions(questions); // ✅ save all questions
      setCurrentIndex(0);
      setQuestion(questions[0]);
    });

    socket.on('nextQuestion', nextQ => {
      setCurrentIndex(prev => prev + 1);
      setQuestion(nextQ);
    });

    socket.on('quizEnded', () => {
      setQuestion(null);
      setQuizEnded(true);
      localStorage.setItem(`quizEnded_${code}`, 'true');
      localStorage.removeItem(`currentIndex_${code}_${nameRef.current}`);
  localStorage.removeItem(`quizQuestions_${code}`);
    });

    socket.on('leaderboard', lb => setLeaderboard(lb));

    socket.on('disconnect', () => setConnected(false));
  }

  // ---------------- AUTO CONNECT HOST ----------------
  useEffect(() => {
    if (isHost) connectSocket();
  }, [code, isHost]);

useEffect(() => {
  // Load saved question index if available
  const savedIndex = localStorage.getItem(`currentIndex_${code}_${nameRef.current}`);
  if (savedIndex) {
    setCurrentIndex(Number(savedIndex));
  }

  const savedQuestions = localStorage.getItem(`quizQuestions_${code}`);
  if (savedQuestions) {
    setQuizQuestions(JSON.parse(savedQuestions));
    setQuestion(JSON.parse(savedQuestions)[savedIndex || 0]);
  }
}, [code]);


useEffect(() => {
  if (question) {
    localStorage.setItem(`currentIndex_${code}_${nameRef.current}`, currentIndex);
    localStorage.setItem(`quizQuestions_${code}`, JSON.stringify(quizQuestions));
  }
}, [currentIndex, question, code, quizQuestions]);

  // ---------------- START QUIZ (HOST) ----------------
  function startAsHost() {
    if (!socketRef.current) return;
    socketRef.current.emit('startQuiz', { roomCode: code });
  }

  // ---------------- SEND ANSWER ----------------
  function sendAnswer(index) {
    if (!question || !socketRef.current) return;
    socketRef.current.emit('submitAnswer', {
      roomCode: code,
      playerName: nameRef.current,
      answerIndex: index,
    });
  }

  // ---------------- NEXT QUESTION ----------------
 

  return (
    <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto mt-6">
      <h3 className="text-xl mb-2 font-bold">Room: {code}</h3>

      <div className="mb-3">
        <span className="font-semibold">Players:</span>{' '}
        {players.length > 0 ? players.map(p => p.name).join(', ') : 'No players yet'}
      </div>

      {/* ---------- Guests Connect UI ---------- */}
      {!connected && !isHost && !quizEnded && (
        <div className="flex gap-2 items-center mb-4">
          <input
            defaultValue={nameRef.current}
            onChange={e => (nameRef.current = e.target.value)}
            placeholder="Your Name"
            className="p-2 border rounded flex-1"
          />
          <button
            onClick={connectSocket}
            className="px-4 py-2 bg-emerald-500 text-white rounded"
          >
            Connect
          </button>
        </div>
      )}

      {/* ---------- Connected UI ---------- */}
      {connected && (
        <div>
          {/* Host: Start Quiz */}
          {isHost && !question && !quizEnded &&  (
            <button
              onClick={startAsHost}
              className="px-4 py-2 bg-green-600 text-white rounded mb-4"
            >
              Start Quiz
            </button>
          )}

         

          {/* Quiz Question */}
          {question ? (
            <div className="border p-4 rounded mb-4">
              <h4 className="font-semibold">
                Q{currentIndex + 1}: {question.text}
              </h4>
              <div className="mt-3 grid gap-2">
                {question.options ? (
                  question.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => sendAnswer(i)}
                      className="text-left p-2 border rounded hover:bg-gray-100"
                    >
                      {opt}
                    </button>
                  ))
                ) : (
                  <p>No options available</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center font-semibold text-lg mb-4">
              {quizQuestions.length > 0
                ? 'Quiz Ended! See Leaderboard Below'
                : 'Waiting for host to start the quiz...'}
            </div>
          )}

          {/* Leaderboard */}
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Leaderboard</h4>
            {leaderboard.length === 0 ? (
              <p>No scores yet</p>
            ) : (
              <ol className="list-decimal pl-6">
                {leaderboard.map((p, i) => (
                  <li key={i}>
                    {p.name} — {p.score}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
