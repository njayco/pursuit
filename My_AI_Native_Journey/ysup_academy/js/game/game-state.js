import { saveGameState as saveToFirebase, loadGameState as loadFromFirebase } from '../config/firebase-config.js';

// Game state variables
export let studentScore = 0;
export let teacherScore = 0;
export let gameStarted = false;
export let currentQuestion = null;
export let currentLessonIndex = 0;
export let hasAskedQuestionThisRound = false;
export let currentLessonContent = "";

// DOM elements
const studentScoreSpan = document.getElementById('student-score');
const teacherScoreSpan = document.getElementById('teacher-score');

export function updateScores() {
    studentScoreSpan.textContent = studentScore;
    teacherScoreSpan.textContent = teacherScore;
    saveGameState();
}

export function setGameState(newState) {
    studentScore = newState.studentScore || 0;
    teacherScore = newState.teacherScore || 0;
    currentLessonIndex = newState.currentLessonIndex || 0;
    gameStarted = newState.gameStarted || false;
    updateScores();
}

export function resetGameState() {
    studentScore = 0;
    teacherScore = 0;
    currentLessonIndex = 0;
    gameStarted = false;
    currentQuestion = null;
    hasAskedQuestionThisRound = false;
    currentLessonContent = "";
    updateScores();
}

export function setCurrentQuestion(question) {
    currentQuestion = question;
}

export function setCurrentLessonContent(content) {
    currentLessonContent = content;
}

export function setGameStarted(started) {
    gameStarted = started;
    saveGameState();
}

export function incrementStudentScore(points) {
    studentScore += points;
    updateScores();
}

export function incrementTeacherScore(points) {
    teacherScore += points;
    updateScores();
}

export function nextLesson() {
    currentLessonIndex++;
    saveGameState();
}

export function setQuestionAsked(asked) {
    hasAskedQuestionThisRound = asked;
}

export async function saveGameState() {
    const gameData = {
        studentScore,
        teacherScore,
        currentLessonIndex,
        gameStarted
    };
    await saveToFirebase(gameData);
}

export async function loadGameState() {
    const savedState = await loadFromFirebase();
    if (savedState) {
        setGameState(savedState);
        return savedState;
    }
    return null;
}

export function getGameState() {
    return {
        studentScore,
        teacherScore,
        currentLessonIndex,
        gameStarted,
        currentQuestion,
        hasAskedQuestionThisRound,
        currentLessonContent
    };
} 