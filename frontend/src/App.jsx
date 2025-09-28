import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import HostCreateRoom from './pages/HostCreateRoom'
import JoinRoom from './pages/JoinRoom'
import RoomPage from './pages/RoomPages'

export default function App(){
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <div className="text-xl font-semibold">MERN Quiz</div>
        <nav className="space-x-3">
          <Link to="/host" className="px-3 py-1 rounded bg-blue-500 text-white">Host</Link>
          <Link to="/join" className="px-3 py-1 rounded border">Join</Link>
        </nav>
      </header>

      <main className="p-6 max-w-4xl mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/host" element={<HostCreateRoom />} />
          <Route path="/join" element={<JoinRoom />} />
          <Route path="/room/:code" element={<RoomPage />} />
        </Routes>
      </main>
    </div>
  )
}

function Home(){
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-2">Multiplayer Quiz</h2>
      <p>Host a quiz room or join with a room code. Host starts quiz — 20 questions. Leaderboard shows after quiz ends.</p>
    </div>
  )
}