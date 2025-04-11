// firebase.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "briickly-520c2.firebaseapp.com",
  projectId: "briickly-520c2",
  storageBucket: "briickly-520c2.appspot.com", 
  messagingSenderId: "418226533927",
  appId: "1:418226533927:web:8c1d09929be65848514002"
};

export const app = initializeApp(firebaseConfig);
