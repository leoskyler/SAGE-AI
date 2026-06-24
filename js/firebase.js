// Firebase SDK Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

const firebaseConfig = {
  apiKey:"AIzaSyAY4zcI7_zOvcXH1kxQi-Uu0yvnVTmOE6g"
  authDomain: "sage-ai-1e078.firebaseapp.com",
  projectId: "sage-ai-1e078",
  storageBucket: "sage-ai-1e078.firebasestorage.app",
  messagingSenderId: "831909949652",
  appId: "1:831909949652:web:298ce0788d3a3070bf8b41"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

console.log("Firebase Connected");
