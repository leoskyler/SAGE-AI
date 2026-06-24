const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
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
    if (recognition) {
        recognition.start();
    } else {
        alert("Voice input is not supported in this browser.");
    }
}
/* ---------------- MESSAGE SYSTEM ---------------- */
function addMessage(text, type){
    const msg = document.createElement("div");
    msg.classList.add("message", type);
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

/* ---------------- VOICE OUTPUT ---------------- */
function speak(text){
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.cancel(); // stop previous speech
    window.speechSynthesis.speak(speech);
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
    else alert("Voice input not supported in this browser.");
}

/* ---------------- GEMINI AI ---------------- */
async function generateReply(text) {
    const apiKey = "AQ.Ab8RN6KLHo4hDH21jlBkFId5Of21-NDgcMx12SYshJXldcRciA";

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
                        parts: [
                            {
                                text: "You are SAGE AI, a helpful, smart assistant. Reply clearly and naturally."
                            },
                            {
                                text: text
                            }
                        ]
                    }
                ]
            })
        }
    );

    const data = await response.json();

    return data?.candidates?.[0]?.content?.parts?.[0]?.text 
        || "Sorry, I couldn't respond.";
}
function speak(text){
    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.cancel(); // stop previous speech
    window.speechSynthesis.speak(speech);
}
/* ---------------- SEND MESSAGE ---------------- */
async function sendMessage(){
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    // typing indicator
    const loadingMsg = document.createElement("div");
    loadingMsg.classList.add("message", "ai");
    loadingMsg.textContent = "SAGE is thinking...";
    chatBox.appendChild(loadingMsg);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const reply = await generateReply(text);

        loadingMsg.remove();
        addMessage(reply, "ai");

        speak(reply); // voice output

    } catch (error) {
        loadingMsg.remove();
        addMessage("Error connecting to Gemini ❌", "ai");
    }
}

/* BUTTON CLICK */
sendBtn.addEventListener("click", sendMessage);

/* ENTER KEY SUPPORT */
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});

/* MAKE VOICE FUNCTION GLOBAL */
window.startVoiceInput = startVoiceInput;
