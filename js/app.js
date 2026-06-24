  /* ==========================
   SAGE AI
========================== */

let memory = {
    name: null,
    lastMessages: []
};

/* ==========================
   MEMORY
========================== */

const savedMemory = localStorage.getItem("sageMemory");

if (savedMemory) {
    memory = JSON.parse(savedMemory);
}

function saveMemory() {
    localStorage.setItem(
        "sageMemory",
        JSON.stringify(memory)
    );
}

/* ==========================
   ELEMENTS
========================== */

const chatBox =
    document.getElementById("chatBox");

const userInput =
    document.getElementById("userInput");

const sendBtn =
    document.getElementById("sendBtn");

const imageInput =
    document.getElementById("imageInput");

const suggestions =
    document.getElementById("suggestions");

const hero =
    document.querySelector(".hero");

/* ==========================
   FILE UPLOAD
========================== */

let selectedImageBase64 = null;

if (imageInput) {

    imageInput.addEventListener(
        "change",
        function () {

            const file =
                imageInput.files[0];

            if (!file) return;

            const reader =
                new FileReader();

            reader.onload = function () {

                selectedImageBase64 =
                    reader.result.split(",")[1];

                addMessage(
                    "📷 Image attached",
                    "user"
                );

            };

            reader.readAsDataURL(file);

        }
    );

}

/* ==========================
   CHAT MESSAGES
========================== */

function addMessage(text, type) {

    const div =
        document.createElement("div");

    div.classList.add(
        "message",
        type
    );

    div.textContent = text;

    chatBox.appendChild(div);

    scrollToBottom();

}

function scrollToBottom() {

    chatBox.scrollTop =
        chatBox.scrollHeight;

}

/* ==========================
   TYPING
========================== */

function showTyping() {

    const div =
        document.createElement("div");

    div.classList.add(
        "message",
        "ai"
    );

    div.innerHTML = `
        <div class="typing">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;

    chatBox.appendChild(div);

    scrollToBottom();

    return div;

}

/* ==========================
   STREAM EFFECT
========================== */

function streamText(
    element,
    text,
    speed = 15
) {

    element.textContent = "";

    let i = 0;

    const interval =
        setInterval(() => {

            element.textContent +=
                text.charAt(i);

            i++;

            scrollToBottom();

            if (i >= text.length) {
                clearInterval(interval);
            }

        }, speed);

}

/* ==========================
   GEMINI
========================== */

async function generateReply(message) {

    const apiKey =
        "PASTE_YOUR_REAL_GEMINI_KEY_HERE";

    const body = {
        contents: [
            {
                parts: [
                    {
                        text: message
                    }
                ]
            }
        ]
    };

    const response =
        await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(body)
            }
        );

    const data =
        await response.json();

    console.log(data);

    return (
        data?.candidates?.[0]
            ?.content?.parts?.[0]
            ?.text
        ||
        "Sorry, I couldn't generate a response."
    );

}

/* ==========================
   SEND
========================== */

async function sendMessage() {

    const text =
        userInput.value.trim();

    if (!text) return;

    hero.style.display = "none";

    addMessage(
        text,
        "user"
    );

    userInput.value = "";

    memory.lastMessages.push(text);

    if (
        memory.lastMessages.length > 10
    ) {

        memory.lastMessages.shift();

    }

    saveMemory();

    const loading =
        showTyping();

    try {

        const reply =
            await generateReply(text);

        loading.remove();

        const aiMessage =
            document.createElement("div");

        aiMessage.classList.add(
            "message",
            "ai"
        );

        chatBox.appendChild(aiMessage);

        streamText(
            aiMessage,
            reply
        );

    }

    catch (error) {

        console.error(error);

        loading.remove();

        addMessage(
            "❌ Failed to contact Gemini.",
            "ai"
        );

    }

}

/* ==========================
   EVENTS
========================== */

sendBtn.addEventListener(
    "click",
    sendMessage
);

userInput.addEventListener(
    "keydown",
    (e) => {

        if (
            e.key === "Enter"
        ) {

            sendMessage();

        }

    }
);

/* ==========================
   VOICE INPUT
========================== */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

let recognition;

if (SpeechRecognition) {

    recognition =
        new SpeechRecognition();

    recognition.lang =
        "en-US";

    recognition.onresult =
        (event) => {

            userInput.value =
                event.results[0][0]
                    .transcript;

        };

}

function startVoiceInput() {

    if (recognition) {

        recognition.start();

    }

}

/* ==========================
   GLOBAL
========================== */

window.startVoiceInput =
    startVoiceInput;  
