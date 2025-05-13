// QuizContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { addQuestionToDB, fetchQuizzes, fetchQuestions } from '../services/api';

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState({});
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);

  // ✅ Load quizzes + questions on startup
  useEffect(() => {
    const loadQuizzesAndQuestions = async () => {
      const fetchedQuizzes = await fetchQuizzes();
      setQuizzes(fetchedQuizzes);

      const allQuestions = {};

      for (const quiz of fetchedQuizzes) {
        const questions = await fetchQuestions(quiz.id);
        console.log(`📥 Got questions for quiz ID ${quiz.id}:`, questions); // 🔍 NEW
        allQuestions[quiz.id] = questions;
      }

      setQuizQuestions(allQuestions);
      console.log("🧠 All loaded questions:", allQuestions);
    };

    loadQuizzesAndQuestions();
  }, []);

  useEffect(() => {
    console.log("Updated quizQuestions:", quizQuestions);
  }, [quizQuestions]);

  const updateQuiz = (oldName, newName) => {
    setQuizzes(prevQuizzes =>
      prevQuizzes.map(quiz => quiz === oldName ? newName : quiz)
    );
    setQuizQuestions(prev => {
      const updatedQuestions = { ...prev };
      updatedQuestions[newName] = updatedQuestions[oldName] || [];
      delete updatedQuestions[oldName];
      return updatedQuestions;
    });
  };

  const addQuestion = async (quizId, questionData) => {
    const response = await addQuestionToDB(quizId, questionData);
    if (!response || !response.success) {
      console.error("❌ Failed to save question to database");
      return;
    }

    const newQuestion = {
      ...questionData,
      id: response.id,
      quiz_id: quizId,
      correctAnswer: questionData.correctAnswer ?? '',
      wrongAnswers: questionData.wrongAnswers ?? [],
      answerContains: questionData.answerContains ?? '',
      answerEquals: questionData.answerEquals ?? '',
    };

    setQuizQuestions(prev => ({
      ...prev,
      [quizId]: [...(prev[quizId] || []), newQuestion]
    }));
  };

  const updateQuestion = (quizId, questionId, newQuestion, correctAnswer, wrongAnswers, answerContains, answerEquals) => {
    setQuizQuestions(prev => ({
      ...prev,
      [quizId]: prev[quizId]?.map(q =>
        q.id == questionId
          ? {
              ...q,
              question: newQuestion,
              correctAnswer: typeof correctAnswer === 'string' ? correctAnswer.trim() : q.correctAnswer,
              wrongAnswers: Array.isArray(wrongAnswers) ? wrongAnswers.map(ans => ans.trim()) : q.wrongAnswers,
              answerContains: typeof answerContains === 'string' ? answerContains.trim() : q.answerContains,
              answerEquals: typeof answerEquals === 'string' ? answerEquals.trim() : q.answerEquals
            }
          : q
      ) || []
    }));
  };

  const removeQuestion = (quizId, questionId) => {
    setQuizQuestions(prev => ({
      ...prev,
      [quizId]: prev[quizId]?.filter(q => q.id !== questionId) || []
    }));
  };

  const updateSelectedQuizzes = (newSelections) => {
    setSelectedQuizzes(newSelections);
  };

  return (
    <QuizContext.Provider value={{
      quizzes,
      setQuizzes,
      quizQuestions,
      setQuizQuestions,
      addQuestion,
      updateQuiz,
      updateQuestion,
      removeQuestion,
      selectedQuizzes,
      updateSelectedQuizzes
    }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => useContext(QuizContext);