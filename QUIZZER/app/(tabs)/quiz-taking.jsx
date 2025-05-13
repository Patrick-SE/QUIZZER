import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useQuiz } from '../../context/QuizContext';

export default function QuizTakingScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    let selectedQuizzes = [];
    try {
        selectedQuizzes = JSON.parse(params.quizzes);
    } catch (e) {
        selectedQuizzes = Array.isArray(params.quizzes) ? params.quizzes : [params.quizzes];
    }

    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [wrongAnswers, setWrongAnswers] = useState([]);

    const { quizQuestions, quizzes } = useQuiz();

    const selectedQuizNames = quizzes
        ?.filter(q => selectedQuizzes.includes(q.id))
        .map(q => q.name);

    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [locked, setLocked] = useState(false);

    const [userAnswer, setUserAnswer] = useState('');
    const [isCorrect, setIsCorrect] = useState(null);

    const [allQuestions, setAllQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const currentQuestion = allQuestions[currentQuestionIndex] || null;

    const [showFullAnswer, setShowFullAnswer] = useState(false);

    const questions = params.questions
        ? JSON.parse(params.questions)
        : selectedQuizzes.flatMap(quiz => quizQuestions[quiz] || []);

    useEffect(() => {
        if (allQuestions.length > 0) return;

        if (params.questions) {
            const parsed = JSON.parse(params.questions);
            setAllQuestions(parsed);
        } else if (selectedQuizzes.length) {
            const newQuestions = selectedQuizzes.flatMap(quiz => quizQuestions[quiz] || []);
            if (newQuestions.length > 0) {
                setAllQuestions(newQuestions);
            }
        }
    }, []);

    const handleAnswerSelection = (answer) => {
        if (!locked) {
            setSelectedAnswer(answer);
            setLocked(true);
        }
    };

    const handleCheckAnswer = () => {
        if (!currentQuestion) {
            console.error("currentQuestion is undefined");
            setIsCorrect(false);
            return;
        }

        const userInput = userAnswer.trim().toLowerCase();
        const correctEquals = currentQuestion.answerEquals?.trim().toLowerCase() === userInput;

        const correctContains = currentQuestion.answerContains
            ? [...currentQuestion.answerContains.trim().toLowerCase()].some(char => userInput.includes(char))
            : false;

        setIsCorrect(correctEquals || correctContains);

        setShowFullAnswer(!correctEquals && correctContains);
    };

    const handleNextQuestion = () => {
        const current = {
            ...currentQuestion,
            userAnswer: currentQuestion.type === 'short-text' ? userAnswer : selectedAnswer
        };

        const isCorrectNow =
            currentQuestion.type === 'short-text'
                ? (currentQuestion.answerEquals?.trim().toLowerCase() === userAnswer.trim().toLowerCase() ||
                    (currentQuestion.answerContains &&
                        [...currentQuestion.answerContains.trim().toLowerCase()].some(char =>
                            userAnswer.toLowerCase().includes(char))))
                : selectedAnswer === currentQuestion.correctAnswer;

        if (isCorrectNow) {
            setCorrectAnswers(prev => [...prev, current]);
        } else {
            setWrongAnswers(prev => [...prev, current]);
        }

        if (currentQuestionIndex < allQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setLocked(false);
            setUserAnswer('');
            setIsCorrect(null);
            setShowFullAnswer(false);
        } else {
            setTimeout(() => {
                router.push({
                    pathname: '/(tabs)/quiz-summary',
                    params: {
                        correctAnswers: JSON.stringify(isCorrectNow ? [...correctAnswers, current] : correctAnswers),
                        wrongAnswers: JSON.stringify(!isCorrectNow ? [...wrongAnswers, current] : wrongAnswers),
                        allAnswers: JSON.stringify([...correctAnswers, ...wrongAnswers, current])
                    }
                });
            }, 100);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.quizName}>{selectedQuizNames.join(', ')}</Text>
                <Text style={styles.questionCount}>{`Question ${currentQuestionIndex + 1}/${allQuestions.length}`}</Text>
            </View>

            {/* Question Display */}
            {currentQuestion ? (
                <>
                    <Text style={styles.questionText}>{currentQuestion.question}</Text>

                    {/* Render Different Question Types */}
                    {currentQuestion.type === 'multiple-choice' && (
                        <View style={styles.answersContainer}>
                            {currentQuestion.wrongAnswers.concat(currentQuestion.correctAnswer).sort().map((answer, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.answerOption,
                                        locked && selectedAnswer === answer && (selectedAnswer === currentQuestion.correctAnswer ? styles.correctAnswer : styles.wrongAnswer),
                                        locked && answer === currentQuestion.correctAnswer ? styles.correctAnswer : null
                                    ]}
                                    onPress={() => handleAnswerSelection(answer)}
                                >
                                    <Text style={[styles.answerText, locked && selectedAnswer === answer && { color: 'white' }]}>
                                        {answer}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Short Text */}
                    {currentQuestion.type === 'short-text' && (
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[
                                    styles.input,
                                    isCorrect !== null && (isCorrect ? styles.correctAnswer : styles.wrongAnswer)
                                ]}
                                placeholder="Enter answer"
                                value={userAnswer}
                                onChangeText={setUserAnswer}
                                editable={isCorrect === null}
                            />

                            {/* Show full correct answer if user answered wrong OR had a partial match */}
                            {showFullAnswer && (
                                <View style={styles.answerRow}>
                                    <Text style={styles.fullAnswerText}>
                                        The correct answer is: {currentQuestion.answerContains || currentQuestion.answerEquals}
                                    </Text>
                                    <Ionicons name="checkmark-circle" size={24} color="green" />
                                </View>
                            )}

                            <TouchableOpacity
                                onPress={handleCheckAnswer}
                                disabled={!userAnswer.trim()}
                                style={[
                                    styles.checkButton,
                                    !userAnswer.trim() && { backgroundColor: '#ccc' }
                                ]}
                            >
                                <Text style={styles.checkButtonText}>Check Answer</Text>
                            </TouchableOpacity>

                        </View>
                    )}

                    {/* True or False */}
                    {currentQuestion.type === 'true-false' && (
                        <View style={styles.trueFalseContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.trueFalseOption,
                                    locked && selectedAnswer === 'True' && (selectedAnswer === currentQuestion.correctAnswer ? styles.correctAnswer : styles.wrongAnswer),
                                    locked && currentQuestion.correctAnswer === 'True' ? styles.correctAnswer : null
                                ]}
                                onPress={() => handleAnswerSelection('True')}
                            >
                                <Text style={[styles.trueFalseText, selectedAnswer === 'True' && { color: 'white' }]}>True</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.trueFalseOption,
                                    locked && selectedAnswer === 'False' && (selectedAnswer === currentQuestion.correctAnswer ? styles.correctAnswer : styles.wrongAnswer),
                                    locked && currentQuestion.correctAnswer === 'False' ? styles.correctAnswer : null
                                ]}
                                onPress={() => handleAnswerSelection('False')}
                            >
                                <Text style={[styles.trueFalseText, selectedAnswer === 'False' && { color: 'white' }]}>False</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Next Button */}
                    <TouchableOpacity
                        onPress={handleNextQuestion}
                        style={[
                            styles.nextButton,
                            (
                                (currentQuestion?.type === 'short-text' && !userAnswer.trim()) ||
                                (currentQuestion?.type !== 'short-text' && selectedAnswer === null)
                            ) && { backgroundColor: '#ccc' } // disable look
                        ]}
                        disabled={
                            (currentQuestion?.type === 'short-text' && !userAnswer.trim()) ||
                            (currentQuestion?.type !== 'short-text' && selectedAnswer === null)
                        }
                    >
                        <Text style={styles.nextButtonText}>Next</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <Text style={styles.noQuestions}>No questions available.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    quizName: { fontSize: 20, fontWeight: 'bold', color: '#009688' },
    questionCount: { fontSize: 16, color: '#666' },
    questionText: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
    // Multiple Choice Enhancements
    answersContainer: { marginTop: 20, gap: 15 },
    answerOption: {
        paddingVertical: 16,
        borderWidth: 2,
        borderColor: '#009688',
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2
    },
    answerText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    // Short Text Enhancements
    inputContainer: { alignItems: 'center', marginTop: 20 },
    input: {
        width: '100%',
        padding: 12,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#009688',
        borderRadius: 8,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2
    },
    checkButton: {
        marginTop: 15,
        backgroundColor: '#009688',
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderRadius: 8,
        alignItems: 'center'
    },
    checkButtonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
    highlightText: {
        color: '#DC3545',
    },
    answerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10
    },
    fullAnswerText: {
        margin: 10,
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold'
    },
    // True/False Enhancements
    trueFalseContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 30
    },
    trueFalseOption: {
        width: '45%',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#009688',
        backgroundColor: '#f9f9f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    correctAnswer: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    wrongAnswer: {
        backgroundColor: '#F44336',
        borderColor: '#F44336',
    },
    trueFalseText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333'
    },
    // Next Button
    nextButton: {
        backgroundColor: '#009688',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20
    },
    nextButtonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
    noQuestions: { fontSize: 18, color: '#666', textAlign: 'center' }
});