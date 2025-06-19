// Gemini API utility functions
export async function callGemini(prompt) {
    const loadingIndicator = document.getElementById('loading-indicator');
    loadingIndicator.style.display = 'flex'; // Show loading
    
    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = { contents: chatHistory };
    const apiKey = ""; // Add your API key here
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await response.json();
        
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            return result.candidates[0].content.parts[0].text;
        } else {
            console.error("Gemini API response structure unexpected:", result);
            return "I'm having a little trouble understanding that. Could you rephrase?";
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "I'm sorry, I couldn't process your request right now. Please try again.";
    } finally {
        loadingIndicator.style.display = 'none'; // Hide loading
    }
}

export async function generateQuestionGuidance(userQuestion, lessonContent) {
    const questionPrompt = `The user asked: "${userQuestion}". Based on the following lesson content, provide a helpful hint, example, or a related question to guide them to the answer, WITHOUT directly giving the answer. If the question is outside the scope of the provided lesson, gently redirect them.
    <br><br>
    Lesson Content: ${lessonContent}`;
    
    return await callGemini(questionPrompt);
}

export async function generateAnswerHint(userAnswer, question, correctAnswer, lessonContent) {
    const hintPrompt = `The user provided the answer: "${userAnswer}" to the question: "${question}". The correct answer is: "${Array.isArray(correctAnswer) ? correctAnswer.join(' or ') : correctAnswer}".
    <br><br>
    Without giving away the direct answer, provide a hint, a clarifying question, or a related example to help the user understand why their answer might be incorrect and guide them closer to the right answer. Focus on the core concept of the question.
    <br><br>
    Lesson Content: ${lessonContent}`;
    
    return await callGemini(hintPrompt);
} 