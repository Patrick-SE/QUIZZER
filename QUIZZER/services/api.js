import axios from 'axios';

const BASE_URL = "http://192.168.1.13/quizzer_backend";

export const addQuiz = async (quizName) => {
    try {
      const response = await axios.post(`${BASE_URL}/add-quiz.php`, 
        { name: quizName },
        { headers: { "Content-Type": "application/json" } } // ✅ Explicitly set headers
      );
      return response.data.success;
    } catch (error) {
      console.error("Error adding quiz:", error);
      return false;
    }
};

export const fetchQuizzes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/get-quizzes.php`, {
        headers: { "Content-Type": "application/json" }, // ✅ Explicitly set headers
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      return [];
    }
};

export const updateQuiz = async (quizId, newName) => {
  try {
    const response = await axios.post(`${BASE_URL}/update-quiz.php`,
      { id: quizId, name: newName },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("Raw API Response:", response.data); // ✅ Debugging log
    return response.data.success; // ✅ Extracting success flag
  } catch (error) {
    console.error("Error updating quiz:", error);
    return false;
  }
}; 

export const deleteQuiz = async (quizId) => {
    try {
      const response = await axios.post(`${BASE_URL}/delete-quiz.php`,
        { id: quizId },
        { headers: { "Content-Type": "application/json" } } // ✅ Explicitly set headers
      );
      return response.data.success;
    } catch (error) {
      console.error("Error deleting quiz:", error);
      return false;
    }
};  


export const addQuestionToDB = async (quizId, questionData) => {
  try {
    const response = await axios.post(`${BASE_URL}/add-question.php`, {
      quiz_id: quizId,
      ...questionData
    }, {
      headers: { "Content-Type": "application/json" }
    });

    return response.data; // returns { success: true, id: 123 }
  } catch (error) {
    console.error("Error adding question:", error);
    return { success: false };
  }
};

// // Fetch questions by quiz ID
// export const fetchQuestions = async (quizId) => {
//   try {
//     const response = await axios.get(`${BASE_URL}/get-questions.php?quiz_id=${quizId}`);
//     return response.data; // ✅ Just return the questions
//   } catch (error) {
//     console.error('Error fetching questions:', error);
//     return [];
//   }
// };

// Fetch all questions for a specific quiz
export async function fetchQuestions(quizId) {
  try {
    const res = await fetch(`${BASE_URL}/get-questions.php?id=${quizId}`);
    return await res.json();
  } catch (err) {
    console.error(`❌ Failed to fetch questions for quiz ${quizId}:`, err);
    return [];
  }
};

// Delete a question
export const deleteQuestion = async (questionId) => {
  try {
    const response = await axios.post(`${BASE_URL}/delete-question.php`,
      { id: questionId },
      { headers: { "Content-Type": "application/json", }, }
    );
    return response.data.success;
  } catch (error) {
    console.error("Error deleting question:", error);
    return false;
  }
};

// Update a question
export async function updateQuestionInDB(id, questionData) {
  try {
    const res = await fetch(`${BASE_URL}/update-question.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...questionData }),
    });

    return await res.json();
  } catch (err) {
    console.error('Error updating question in DB:', err);
    return { success: false };
  }
}