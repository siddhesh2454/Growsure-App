// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // <-- ADD THIS

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgADWIz3ooB7fixnVr9IHNzW2dB0rV9d4",
  authDomain: "chatbot-support-7ddd0.firebaseapp.com",
  projectId: "chatbot-support-7ddd0",
  storageBucket: "chatbot-support-7ddd0.appspot.com",
  messagingSenderId: "634858041379",
  appId: "1:634858041379:web:be94fcb4770817070b8196"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and export it
export const db = getFirestore(app);
