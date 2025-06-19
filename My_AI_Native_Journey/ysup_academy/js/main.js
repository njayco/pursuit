import { initializeFirebase } from './config/firebase-config.js';
import { initializeModal } from './utils/modal.js';
import { initializeChatUI } from './ui/chat-ui.js';
import { loadGameState } from './game/game-state.js';
import { initializeGame } from './game/game-logic.js';

// Initialize the application
async function initializeApp() {
    console.log("Initializing YsUp AI-Native Academy...");
    
    // Initialize Firebase
    initializeFirebase();
    
    // Initialize UI components
    initializeModal();
    initializeChatUI();
    
    // Wait for Firebase auth to be ready
    window.addEventListener('firebaseAuthReady', async () => {
        console.log("Firebase auth ready, loading game state...");
        
        // Load saved game state
        const savedState = await loadGameState();
        
        // Initialize game with saved state
        initializeGame(savedState);
        
        console.log("YsUp AI-Native Academy initialized successfully!");
    });
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp); 