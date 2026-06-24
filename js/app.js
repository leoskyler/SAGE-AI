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
function updateMemoryFromText(text) {
    const msg = text.toLowerCase();

    if (msg.includes("my name is")) {
        const name = text.split("is")[1]?.trim();
        if (name) {
            memory.name = name;
            saveMemory();
        }
    }

    if (msg.includes("i am called")) {
        const name = text.split("called")[1]?.trim();
        if (name) {
            memory.name = name;
            saveMemory();
        }
    }
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

USER PROFILE:
- Name: ${memory.name || "unknown"}

RECENT CHAT:
${memory.lastMessages.slice(-10).join("\n")}

RULES:
- If the user has a name, use it naturally in replies
- Be friendly and conversational
- Remember past context from recent chat
- Do NOT ask for name if already known
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
    updateMemoryFromText(text);

// keep only last 10 messages
if (memory.lastMessages.length > 10) {
    memory.lastMessages.shift();
}

saveMemory();

    const loadingMsg = showTyping();

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
        addMessage(
            `Welcome back ${memory.name} 👋 I remember you.`,
            "ai"
        );
        speak(`Welcome back ${memory.name}. I remember you.`);
    } else {
        addMessage(
            "Hello 👋 I am SAGE AI. What is your name?",
            "ai"
        );
    }

    // show last session preview (optional but powerful)
    if (memory.lastMessages.length > 0) {
        addMessage(
            "I also remember our last conversation 👍",
            "ai"
        );
    }
});
function showTyping() {
    const loadingMsg = document.createElement("div");
    loadingMsg.classList.add("message", "ai");

    loadingMsg.innerHTML = `
        <div class="typing">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;

    chatBox.appendChild(loadingMsg);
    chatBox.scrollTop = chatBox.scrollHeight;

    return loadingMsg;
}
