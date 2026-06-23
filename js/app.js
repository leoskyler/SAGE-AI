// SAGE AI Animated Background

const particles = document.createElement("div");
particles.className = "particles";
document.body.appendChild(particles);

for (let i = 0; i < 50; i++) {
    const dot = document.createElement("span");

    dot.style.left = Math.random() * 100 + "vw";
    dot.style.top = Math.random() * 100 + "vh";
    dot.style.animationDelay = Math.random() * 5 + "s";

    particles.appendChild(dot);
}
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatBox = document.querySelector(".chat-box");

if (sendBtn) {
    sendBtn.addEventListener("click", () => {

        const message = userInput.value.trim();

        if (!message) return;

        const userMessage = document.createElement("p");
        userMessage.innerHTML = "<strong>You:</strong> " + message;

        chatBox.appendChild(userMessage);

setTimeout(() => {

    const aiMessage = document.createElement("p");

   let reply = "";

if (message.toLowerCase().includes("hello")) {
    reply = "Hello! I am SAGE AI. How can I help you today?";
} 
else if (message.toLowerCase().includes("who are you")) {
    reply = "I am SAGE AI, your futuristic assistant built for learning and creation.";
} 
else if (message.toLowerCase().includes("help")) {
    reply = "Sure! You can ask me anything or try uploading an image later.";
} 
else {
    reply = "I understand: " + message;
}

aiMessage.innerHTML = "<strong>SAGE AI:</strong> " + reply; 
        

    chatBox.appendChild(aiMessage);

}, 800);

userInput.value = "";
    });
}
