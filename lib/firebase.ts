import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAzarY141vtYUD0Kb1A97VT3C4fPjuqF4I",
    authDomain: "quantgoal-ai.firebaseapp.com",
    projectId: "quantgoal-ai",
    storageBucket: "quantgoal-ai.firebasestorage.app",
    messagingSenderId: "989108768956",
    appId: "1:989108768956:web:40aab722facc9b91fdc0b9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
