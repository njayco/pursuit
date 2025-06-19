import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot, collection, query, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Firebase configuration (provided globally by the environment)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Initialize Firebase
let app;
let db;
let auth;
let userId = null;
let isAuthReady = false;

export function initializeFirebase() {
    if (Object.keys(firebaseConfig).length > 0) {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);

        // Authenticate and set up auth listener
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                userId = user.uid;
                console.log("Firebase authenticated. User ID:", userId);
                isAuthReady = true;
                // Trigger auth ready event
                window.dispatchEvent(new CustomEvent('firebaseAuthReady'));
            } else {
                // Sign in anonymously if no user is found and no custom token is provided
                if (initialAuthToken) {
                    try {
                        await signInWithCustomToken(auth, initialAuthToken);
                        console.log("Signed in with custom token.");
                    } catch (error) {
                        console.error("Error signing in with custom token:", error);
                        await signInAnonymously(auth); // Fallback to anonymous
                        console.log("Signed in anonymously (fallback).");
                    }
                } else {
                    await signInAnonymously(auth);
                    console.log("Signed in anonymously.");
                }
                isAuthReady = true; // Mark as ready even if anonymous
                window.dispatchEvent(new CustomEvent('firebaseAuthReady'));
            }
        });
    } else {
        console.error("Firebase config not available. Running in a limited mode without persistence.");
        isAuthReady = true; // For local testing without firebase
        window.dispatchEvent(new CustomEvent('firebaseAuthReady'));
    }
}

export function getFirebaseState() {
    return {
        isAuthReady,
        userId,
        db,
        appId,
        serverTimestamp
    };
}

export async function saveGameState(gameData) {
    if (!isAuthReady || !userId) {
        console.log("Firebase not ready or no user ID, skipping save.");
        return;
    }
    try {
        const gameDocRef = doc(db, `artifacts/${appId}/public/data/ysupGameStates`, 'globalGameState');
        await setDoc(gameDocRef, {
            ...gameData,
            lastUpdatedBy: userId,
            timestamp: serverTimestamp()
        }, { merge: true });
        console.log("Game state saved!");
    } catch (error) {
        console.error("Error saving game state:", error);
    }
}

export async function loadGameState() {
    if (!isAuthReady || !userId) {
        console.log("Firebase not ready or no user ID, skipping load.");
        return null;
    }
    try {
        const gameDocRef = doc(db, `artifacts/${appId}/public/data/ysupGameStates`, 'globalGameState');
        const docSnap = await getDoc(gameDocRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("Game state loaded:", data);
            return data;
        } else {
            console.log("No game state found, starting new game.");
            return null;
        }
    } catch (error) {
        console.error("Error loading game state:", error);
 