const Quiz = require('../models/Quiz');
const Question = require('../models/Question');


exports.createQuiz = async (req, res) => {
try {
const { title, questions } = req.body;
const savedQuestions = await Question.insertMany(questions);
const quiz = await Quiz.create({ title, questions: savedQuestions.map(q => q._id) });
res.json(quiz);
} catch (err) {
res.status(500).json({ message: err.message });
}
};


exports.getAllQuizzes = async (req, res) => {
const quizzes = await Quiz.find().populate('questions');
res.json(quizzes);
};