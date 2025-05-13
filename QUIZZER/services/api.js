import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getHost = () => {
  const fallback = 'localhost';

  // Try newer manifest2 (used in SDK 49+ with Expo Go)
  const manifestDebuggerHost = Constants.manifest2?.extra?.expoGo?.debuggerHost;

  // Fallback to old manifest for older SDKs
  const legacyHost = Constants.manifest?.debuggerHost;

  const fullHost = manifestDebuggerHost || legacyHost;

  if (!fullHost) return fallback;

  return fullHost.split(':')[0]; // extract just the IP
};

const BASE_URL = `http://${getHost()}/quizzer_backend`;
console.log("🔗 BASE_URL:", BASE_URL);

// const BASE_URL = "http://192.168.1.13:8081/quizzer_backend";

console.log(BASE_URL);

export const addQuiz = async (quizName) => {
    try {
      const response = await axios.post(`${BASE_URL}/add-quiz.php`, 
        { name: quizName },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data.success;
    } catch (error) {
      console.error("Error adding quiz:", error);
      return false; 
    }
};

// export const fetchQuizzes = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/get-quizzes.php`, {
//         headers: { "Content-Type": "application/json" },
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching quizzes:", error);
//       return [];
//     }
// };

export const fetchQuizzes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/get-quizzes.php`);
    return response.data;
  } catch (error) {
    console.error("❌ Full Axios error:", error.toJSON?.() || error);
    return [];
  }
};

export const updateQuiz = async (quizId, newName) => {
  try {
    const response = await axios.post(`${BASE_URL}/update-quiz.php`,
      { id: quizId, name: newName },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("Raw API Response:", response.data);
    return response.data.success;
  } catch (error) {
    console.error("Error updating quiz:", error);
    return false;
  }
}; 

export const deleteQuiz = async (quizId) => {
    try {
      const response = await axios.post(`${BASE_URL}/delete-quiz.php`,
        { id: quizId },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("🔁 deleteQuiz response:", response.data);
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

    return response.data;
  } catch (error) {
    console.error("Error adding question:", error);
    return { success: false };
  }
};

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