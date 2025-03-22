// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "briickly-520c2.firebaseapp.com",
  projectId: "briickly-520c2",
  storageBucket: "briickly-520c2.firebasestorage.app",
  messagingSenderId: "418226533927",
  appId: "1:418226533927:web:8c1d09929be65848514002"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);