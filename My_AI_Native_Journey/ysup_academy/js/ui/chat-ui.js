// Chat UI functions
const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

export function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.innerHTML = text; // Use innerHTML for rendered Markdown/HTML
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll to bottom
}

export function clearChat() {
    chatWindow.innerHTML = '';
}

export function setInputEnabled(enabled) {
    userInput.disabled = !enabled;
    sendButton.disabled = !enabled;
}

export function clearInput() {
    userInput.value = '';
}

export function focusInput() {
    userInput.focus();
}

export function initializeChatUI() {
    // Event Listeners
    sendButton.addEventListener('click', () => {
        const input = userInput.value.trim();
        if (input) {
            // Import and call processUserInput dynamically to avoid circular dependencies
            import('../game/game-logic.js').then(module => {
                module.processUserInput(input);
            });
            clearInput();
        }
    });

    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && userInput.value.trim()) {
            const input = userInput.value.trim();
            import('../game/game-logic.js').then(module => {
                module.processUserInput(input);
            });
            clearInput();
        }
    });

    // Initialize input state
    setInputEnabled(true);
} 