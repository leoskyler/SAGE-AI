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
const particlesContainer = document.querySelector(".particles");

function createParticle(){
    const particle = document.createElement("span");

    particle.style.left = Math.random() * 100 + "vw";
    particle.style.animationDuration = (3 + Math.random() * 5) + "s";
    particle.style.opacity = Math.random();

    particlesContainer.appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 8000);
}

setInterval(createParticle, 200);
const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

function addMessage(text, type){
    const msg = document.createElement("div");
    msg.classList.add("message", type);
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function botReply(userText){
    let reply = "I am still learning... 🤖";

    if(userText.toLowerCase().includes("hello")){
        reply = "Hello 👋 I am SAGE AI.";
    }
    else if(userText.toLowerCase().includes("who are you")){
        reply = "I am SAGE AI, your assistant.";
    }

    setTimeout(() => {
        addMessage(reply, "ai");
    }, 600);
}

sendBtn.addEventListener("click", () => {
    const text = input.value.trim();
    if(!text) return;

    addMessage(text, "user");
    input.value = "";

    botReply(text);
});
