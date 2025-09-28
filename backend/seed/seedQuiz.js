// seed/seedQuiz.js - real GK questions
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

dotenv.config();

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Remove old data
  await Quiz.deleteMany();
  await Question.deleteMany();

  // 20 real GK questions
  const questions = [
    {
      text: "Who is the current President of the United States?",
      options: ["Joe Biden", "Donald Trump", "Barack Obama", "George Bush"],
      correctAnswer: 0
    },
    {
      text: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
      correctAnswer: 1
    },
    {
      text: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Madrid"],
      correctAnswer: 0
    },
    {
      text: "Who wrote the play 'Romeo and Juliet'?",
      options: ["William Shakespeare", "Leo Tolstoy", "Charles Dickens", "Mark Twain"],
      correctAnswer: 0
    },
    {
      text: "Which gas do plants absorb from the atmosphere?",
      options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
      correctAnswer: 1
    },
    {
      text: "Which is the largest ocean on Earth?",
      options: ["Atlantic", "Indian", "Pacific", "Arctic"],
      correctAnswer: 2
    },
    {
      text: "Who painted the Mona Lisa?",
      options: ["Leonardo da Vinci", "Vincent Van Gogh", "Pablo Picasso", "Claude Monet"],
      correctAnswer: 0
    },
    {
      text: "What is the chemical symbol for gold?",
      options: ["Au", "Ag", "Gd", "Go"],
      correctAnswer: 0
    },
    {
      text: "Which country hosted the 2020 Summer Olympics?",
      options: ["China", "Japan", "Brazil", "UK"],
      correctAnswer: 1
    },
    {
      text: "How many continents are there on Earth?",
      options: ["5", "6", "7", "8"],
      correctAnswer: 2
    },
    {
      text: "Who is known as the Father of Computers?",
      options: ["Alan Turing", "Charles Babbage", "Steve Jobs", "Bill Gates"],
      correctAnswer: 1
    },
    {
      text: "Which element has the atomic number 1?",
      options: ["Oxygen", "Hydrogen", "Helium", "Carbon"],
      correctAnswer: 1
    },
    {
      text: "What is the largest mammal in the world?",
      options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
      correctAnswer: 1
    },
    {
      text: "Which country is known as the Land of the Rising Sun?",
      options: ["China", "Japan", "Thailand", "South Korea"],
      correctAnswer: 1
    },
    {
      text: "Who discovered penicillin?",
      options: ["Marie Curie", "Alexander Fleming", "Louis Pasteur", "Isaac Newton"],
      correctAnswer: 1
    },
    {
      text: "Which is the smallest country in the world?",
      options: ["Monaco", "Maldives", "Vatican City", "San Marino"],
      correctAnswer: 2
    },
    {
      text: "Which planet is closest to the Sun?",
      options: ["Mercury", "Venus", "Earth", "Mars"],
      correctAnswer: 0
    },
    {
      text: "Which language has the most native speakers worldwide?",
      options: ["English", "Mandarin Chinese", "Spanish", "Hindi"],
      correctAnswer: 1
    },
    {
      text: "In which year did India gain independence?",
      options: ["1945", "1947", "1950", "1952"],
      correctAnswer: 1
    },
    {
      text: "Which is the fastest land animal?",
      options: ["Lion", "Cheetah", "Horse", "Tiger"],
      correctAnswer: 1
    }
  ];

  const savedQuestions = await Question.insertMany(questions);
  const quiz = await Quiz.create({ title: 'General Knowledge Quiz', questions: savedQuestions.map(q => q._id) });

  console.log('Seeded quiz id:', quiz._id);
  process.exit();
})();
