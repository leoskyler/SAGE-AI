import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
    getAuth,
    signInWithRedirect,
    getRedirectResult,
    GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAY4zcI7_zOvcXH1kxQi-Uu0yvnVTmOE6g",
  authDomain: "sage-ai-1e078.firebaseapp.com",
  projectId: "sage-ai-1e078",
  storageBucket: "sage-ai-1e078.firebasestorage.app",
  messagingSenderId: "831909949652",
  appId: "1:831909949652:web:298ce0788d3a3070bf8b41"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("loginBtn");

// Google Sign-in
// Sign in when button is tapped
loginBtn.addEventListener("click", () => {
    signInWithRedirect(auth, provider);
});

// After returning from Google
getRedirectResult(auth)
    .then((result) => {
        if (result) {
            const user = result.user;

            alert("Welcome " + user.displayName);

            // Save user information
            localStorage.setItem("sageUser", JSON.stringify({
                name: user.displayName,
                email: user.email,
                photo: user.photoURL
            }));

            // Go to chat page
            window.location.href = "chat.html";
        }
    })
    .catch((error) => {
        console.error(error);
        alert("Login failed: " + error.message);
    });
