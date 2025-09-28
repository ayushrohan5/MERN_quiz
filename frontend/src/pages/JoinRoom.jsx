import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function JoinRoom() {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()

  // 👉 पेज लोड होते ही host flag हटा दो
  useEffect(() => {
    localStorage.removeItem('isHost')
  }, [])

  async function join(e) {
    e.preventDefault()
    setMsg('')
    try {
      // आप चाहे तो user नाम भी स्टोर कर सकते हैं
      localStorage.setItem('user', JSON.stringify({ name: name || 'Guest' }))
      navigate(`/room/${code}`)
    } catch (err) {
      setMsg(err.response?.data?.message || err.message)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h3 className="text-xl mb-4">Join Room as Player</h3>
      <form onSubmit={join} className="space-y-3">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
          className="w-full p-2 border rounded"
        />
        <input
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Room code"
          className="w-full p-2 border rounded"
        />
        <button className="w-full py-2 bg-green-600 text-white rounded">
          Join Room
        </button>
      </form>
      {msg && <div className="mt-3 text-red-600">{msg}</div>}
    </div>
  )
}
