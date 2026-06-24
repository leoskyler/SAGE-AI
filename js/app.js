const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

/* MESSAGE SYSTEM */
function addMessage(text, type){
    const msg = document.createElement("div");
    msg.classList.add("message", type);
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

/* AI LOGIC */
function generateReply(text) {
    const msg = text.toLowerCase().trim();

    if (msg.includes("hello") || msg.includes("hi")) {
        return "Hello 👋 I am SAGE AI. How can I help you today?";
    }

    if (msg.includes("who are you")) {
        return "I am SAGE AI, your personal assistant built to help you.";
    }

    if (msg.includes("time")) {
        return "Current time is: " + new Date().toLocaleTimeString();
    }

    if (msg.includes("date") || msg.includes("day")) {
        return "Today is " + new Date().toDateString();
    }

    if (msg.includes("help")) {
        return "Ask me anything and I will try to respond.";
    }

    return "I’m still learning 🤖. Try asking something else!";
}

/* SEND BUTTON */
sendBtn.addEventListener("click", () => {
    const text = input.value.trim();
    if(!text) return;

    addMessage(text, "user");
    input.value = "";

    setTimeout(() => {
        const reply = generateReply(text);
        addMessage(reply, "ai");
    }, 600);
});
