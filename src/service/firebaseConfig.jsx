import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDySEHvFVxpsP1m5gSXtdY1U_a0MOg17JE",
  authDomain: "trip-planner-a14b1.firebaseapp.com",
  projectId: "trip-planner-a14b1",
  storageBucket: "trip-planner-a14b1.firebasestorage.app",
  messagingSenderId: "243837120779",
  appId: "1:243837120779:web:e2cf81d46b75369a5bb20e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);