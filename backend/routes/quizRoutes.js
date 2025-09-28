const express = require('express');
const { createQuiz, getAllQuizzes } = require('../controllers/quizController');
const router = express.Router();
router.post('/', createQuiz);
router.get('/', getAllQuizzes);
module.exports = router;