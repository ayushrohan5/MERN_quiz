import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function HostCreateRoom() {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [quizzes, setQuizzes] = useState([])
  const [selectedQuiz, setSelectedQuiz] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchQuizzes() {
      const { data } = await api.get('/quiz')
      setQuizzes(data)
    }
    fetchQuizzes()
  }, [])

  async function createRoom(e) {
    e.preventDefault()
    localStorage.setItem('isHost', 'true')
    try {
      const { data } = await api.post('/room', {
        code,
        host: name || 'Host',
        quizId: selectedQuiz,
      })
      navigate(`/room/${data.code}`)
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || err.message)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-6">
      <h3 className="text-xl mb-4">Create Room</h3>
      <form onSubmit={createRoom} className="space-y-3">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" className="w-full p-2 border rounded" />
        <input value={code} onChange={e=>setCode(e.target.value)} placeholder="Room code" className="w-full p-2 border rounded" />
        <select value={selectedQuiz} onChange={e=>setSelectedQuiz(e.target.value)} className="w-full p-2 border rounded">
          <option value="">Select Quiz</option>
          {quizzes.map(q=>(
            <option key={q._id} value={q._id}>{q.title}</option>
          ))}
        </select>
        <button className="w-full py-2 bg-blue-600 text-white rounded">Create Room</button>
      </form>
    </div>
  )
}
