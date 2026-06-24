let memory = {
    name: null,
    lastMessages: []
};

// load saved memory
if (localStorage.getItem("sageMemory")) {
    memory = JSON.parse(localStorage.getItem("sageMemory"));
}
function saveMemory() {
    localStorage.setItem("sageMemory", JSON.stringify(memory));
}
const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

/* ---------------- IMAGE INPUT ---------------- */
const imageInput = document.getElementById("imageInput");
let selectedImageBase64 = null;

if (imageInput) {
    imageInput.addEventListener("change", function () {
        const file = imageInput.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function () {
            selectedImageBase64 = reader.result.split(",")[1];
        };

        reader.readAsDataURL(file);
    });
}

/* ---------------- MESSAGE SYSTEM ---------------- */
function addMessage(text, type){
    const msg = document.createElement("div");
    msg.classList.add("message", type);
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

/* ---------------- VOICE INPUT ---------------- */
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        input.value = transcript;
    };
}

function startVoiceInput(){
    if (recognition) recognition.start();
    else alert("Voice input is not supported in this browser.");
}

/* ---------------- VOICE OUTPUT ---------------- */
function speak(text){
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
}

/* ---------------- GEMINI AI ---------------- */
async function generateReply(text) {

    const apiKey = "AQ.Ab8RN6KLHo4hDH21jlBkFId5Of21-NDgcMx12SYshJXldcRciA";

    let parts = [
    {
        text: `You are SAGE AI.

User name: ${memory.name || "unknown"}

Recent conversation:
${memory.lastMessages.slice(-5).join("\n")}

Instructions:
- Use conversation history to answer properly
- If user mentions name, remember it
- If user says "my name is X", extract and remember it.
- Be natural and conversational
`
    }
];

    
    if (selectedImageBase64) {
        parts.push({
            inline_data: {
                mime_type: "image/jpeg",
                data: selectedImageBase64
            }
        });
    }

    const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: parts
                    }
                ]
            })
        }
    );

    selectedImageBase64 = null;

    const data = await response.json();

    return data?.candidates?.[0]?.content?.parts?.[0]?.text
        || "I couldn't analyze the image.";
}

/* ---------------- SEND MESSAGE ---------------- */
async function sendMessage(){
    const text = input.value.trim();
    if (!text && !selectedImageBase64) return;

    addMessage(text || "📷 Image sent", "user");
    input.value = "";
    memory.lastMessages.push(text);

// keep only last 10 messages
if (memory.lastMessages.length > 10) {
    memory.lastMessages.shift();
}

saveMemory();

    const loadingMsg = document.createElement("div");
    loadingMsg.classList.add("message", "ai");
    loadingMsg.textContent = "SAGE is thinking...";
    chatBox.appendChild(loadingMsg);

    try {
        const reply = await generateReply(text);

        loadingMsg.remove();
        addMessage(reply, "ai");

        speak(reply);

    } catch (error) {
        loadingMsg.remove();
        addMessage("Error connecting to Gemini ❌", "ai");
    }
}

/* EVENTS */
sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

/* GLOBAL */
window.startVoiceInput = startVoiceInput;
window.addEventListener("load", () => {
    if (memory.name) {
        addMessage(`Welcome back ${memory.name} 👋`, "ai");
        speak(`Welcome back ${memory.name}`);
    } else {
        addMessage("Hello 👋 I am SAGE AI. What is your name?", "ai");
    }
});
