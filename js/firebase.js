import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { 
    getAuth, 
    signInWithPopup, 
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
loginBtn.addEventListener("click", async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        alert("Welcome " + user.displayName);
        console.log(user);

        // OPTIONAL: hide login button after sign-in
        loginBtn.style.display = "none";

    } catch (error) {
        console.error(error);
        alert("Login failed");
    }
});
