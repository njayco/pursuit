import { lessons, welcomeMessage } from '../data/lessons.js';
import { showModal } from '../utils/modal.js';
import { generateQuestionGuidance, generateAnswerHint } from '../utils/gemini-api.js';
import { 
    getGameState, 
    setGameState, 
    resetGameState, 
    setCurrentQuestion, 
    setCurrentLessonContent, 
    setGameStarted, 
    incrementStudentScore, 
    incrementTeacherScore, 
    nextLesson, 
    setQuestionAsked 
} from './game-state.js';
import { addMessage } from '../ui/chat-ui.js';

export async function processUserInput(input) {
    addMessage(input, 'user');
    
    const state = getGameState();
    
    if (!state.gameStarted) {
        if (input.toLowerCase().includes('yes')) {
            setGameStarted(true);
            addMessage("Great! Let's dive into our first lesson.", 'bot');
            startLesson();
        } else {
            addMessage("Please type 'Yes' to start the game after reviewing the rules.", 'bot');
        }
        return;
    }

    // Check if the user is asking a question or answering
    if (isAskingQuestion(input)) {
        setQuestionAsked(true);
        incrementTeacherScore(25); // Teacher gets points for being asked a question
        
        const guidance = await generateQuestionGuidance(input, state.currentLessonContent);
        addMessage(guidance, 'bot');
    } else if (state.currentQuestion) {
        await handleAnswer(input, state.currentQuestion, state.currentLessonContent);
    } else {
        addMessage("I'm not sure how to respond to that. Are you asking a question about the lesson, or trying to answer a previous question?", 'bot');
    }
}

function isAskingQuestion(input) {
    const questionKeywords = [
        'what is', 'tell me about', 'explain', 'how does', 
        'who is', 'when is', 'where is'
    ];
    return questionKeywords.some(keyword => input.toLowerCase().includes(keyword));
}

async function handleAnswer(input, question, lessonContent) {
    const correctAnswer = Array.isArray(question.a) ? question.a.map(a => a.toLowerCase()) : [question.a.toLowerCase()];
    const userAnswer = input.toLowerCase().trim();

    let isCorrect = false;
    if (Array.isArray(question.a)) {
        isCorrect = correctAnswer.some(answer => userAnswer.includes(answer));
    } else {
        isCorrect = userAnswer.includes(correctAnswer[0]);
    }

    if (isCorrect) {
        addMessage("That's correct! Well done! You earned 10 YBUCKS for your team.", 'bot');
        incrementStudentScore(10);
        setCurrentQuestion(null);
        
        // If a question was asked by the user, award assistance points to the team
        if (getGameState().hasAskedQuestionThisRound) {
            addMessage("100 YBUCKS awarded for assisting your learning!", 'bot');
            incrementStudentScore(100);
            setQuestionAsked(false);
        }
        
        setTimeout(askNextQuestion, 1500);
    } else {
        const hint = await generateAnswerHint(input, question.q, question.a, lessonContent);
        addMessage(`Not quite. ${hint}`, 'bot');
        incrementTeacherScore(10);
    }
}

export function askNextQuestion() {
    const state = getGameState();
    
    if (state.currentLessonIndex < lessons.length) {
        const lesson = lessons[state.currentLessonIndex];
        if (lesson.questions.length > 0) {
            const randomIndex = Math.floor(Math.random() * lesson.questions.length);
            const question = lesson.questions[randomIndex];
            setCurrentQuestion(question);
            addMessage(`Time for a recall question: ${question.q}`, 'bot');
        } else {
            addMessage(`We've covered everything for Lesson ${state.currentLessonIndex + 1}. Moving to the next lesson!`, 'bot');
            nextLesson();
            setTimeout(startLesson, 1500);
        }
    } else {
        endGame();
    }
}

export function startLesson() {
    const state = getGameState();
    
    if (state.currentLessonIndex < lessons.length) {
        const lesson = lessons[state.currentLessonIndex];
        setCurrentLessonContent(lesson.content);
        addMessage(`--- Starting Lesson ${state.currentLessonIndex + 1}: ${lesson.topic} ---`, 'bot');
        addMessage(lesson.content, 'bot');
        setTimeout(askNextQuestion, 2000);
    } else {
        endGame();
    }
}

function endGame() {
    const state = getGameState();
    addMessage("Congratulations! You've completed all the lessons and mastered the YsUp AI-Native Academy content!", 'bot');
    showModal(`Game Over! Final Scores:<br>Student YBUCKS: ${state.studentScore}<br>Teacher YBUCKS: ${state.teacherScore}`, "Play Again?", true, () => {
        resetGame();
    });
    
    // Disable input
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    userInput.disabled = true;
    sendButton.disabled = true;
}

export function resetGame() {
    resetGameState();
    
    const chatWindow = document.getElementById('chat-window');
    chatWindow.innerHTML = `<div class="message bot">${welcomeMessage}</div>`;
    
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    userInput.disabled = false;
    sendButton.disabled = false;
}

export function initializeGame(savedState = null) {
    if (savedState) {
        setGameState(savedState);
        
        const userInput = document.getElementById('user-input');
        const sendButton = document.getElementById('send-button');
        
        if (savedState.gameStarted) {
            userInput.disabled = false;
            sendButton.disabled = false;
            
            if (savedState.currentLessonIndex < lessons.length) {
                addMessage(`Welcome back! Let's continue with Lesson ${savedState.currentLessonIndex + 1}.`);
                const lesson = lessons[savedState.currentLessonIndex];
                setCurrentLessonContent(lesson.content);
                addMessage(lesson.content, 'bot');
                askNextQuestion();
            } else {
                addMessage("You've completed all lessons! Well done!");
            }
        } else {
            addMessage("No previous game found. Type 'Yes' to start the first lesson after reading the rules.", 'bot');
            userInput.disabled = false;
            sendButton.disabled = false;
        }
    } else {
        addMessage(welcomeMessage, 'bot');
        const userInput = document.getElementById('user-input');
        const sendButton = document.getElementById('send-button');
        userInput.disabled = false;
        sendButton.disabled = false;
    }
} 