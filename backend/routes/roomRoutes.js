const express = require('express')
const router = express.Router()
const Room = require('../models/Room')
const Quiz = require('../models/Quiz')

// Create room
router.post('/', async (req, res) => {
  try {
    const { code, host, quizId } = req.body
    const quiz = await Quiz.findById(quizId)
    if (!quiz) return res.status(400).json({ message: 'Quiz not found' })

    const room = await Room.create({ code, host, quiz: quiz._id })
    res.json(room)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
