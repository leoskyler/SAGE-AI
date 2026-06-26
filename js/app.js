  /* ==========================
   SAGE AI
========================== */
let chats = JSON.parse(localStorage.getItem("sageChats")) || [];

let memory = {
    name: null,
    favoriteColor: null,
    occupation: null,
    country: null,
    language: null,
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
function updateMemoryFromText(text) {

    const lower = text.toLowerCase();

    if (lower.includes("my name is")) {

        const name = text.split(/my name is/i)[1]?.trim();

        if (name) {
            memory.name = name;
            saveMemory();
        }
if (lower.includes("my favorite color is")) {

    const color = text.split(/my favorite color is/i)[1]?.trim();

    if (color) {
        memory.favoriteColor = color;
        saveMemory();
    }

}

if (lower.includes("i live in")) {

    const country = text.split(/i live in/i)[1]?.trim();

    if (country) {
        memory.country = country;
        saveMemory();
    }

}

if (lower.includes("i am a")) {

    const job = text.split(/i am a/i)[1]?.trim();

    if (job) {
        memory.occupation = job;
        saveMemory();
    }

}

if (lower.includes("i speak")) {

    const language = text.split(/i speak/i)[1]?.trim();

    if (language) {
        memory.language = language;
        saveMemory();
    }

}
    }

    if (lower.includes("i am called")) {

        const name = text.split(/i am called/i)[1]?.trim();

        if (name) {
            memory.name = name;
            saveMemory();
        }

    }

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

const sidebar =
    document.getElementById("sidebar");

const menuBtn =
    document.getElementById("menuBtn");

const newChatBtn =
    document.getElementById("newChatBtn");
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
    saveCurrentChat();
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
function streamText(element, text, speed = 10) {

    let i = 0;

    let output = "";

    const interval = setInterval(() => {

        output += text.charAt(i);

       element.innerHTML = marked.parse(output);

element.querySelectorAll("pre").forEach((pre) => {

    if (!pre.querySelector(".copy-btn")) {

        const btn = document.createElement("button");

        btn.className = "copy-btn";
        btn.innerText = "📋 Copy";

        btn.onclick = function () {
            copyCode(btn);
        };

        pre.parentNode.insertBefore(btn, pre);

    }

});

element.querySelectorAll("pre code").forEach((block) => {
    hljs.highlightElement(block);
}); 

        scrollToBottom();

        i++;

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
        "AIzaSyAY4zcI7_zOvcXH1kxQi-Uu0yvnVTmOE6g";

    const body = {
    contents: [
        {
            parts: [
                {
                    text: `
You are SAGE AI, a smart, friendly and professional AI assistant.

User Profile

Name: ${memory.name || "Unknown"}
Occupation: ${memory.occupation || "Unknown"}
Country: ${memory.country || "Unknown"}
Favorite Color: ${memory.favoriteColor || "Unknown"}
Language: ${memory.language || "Unknown"}

Recent Conversation:
${memory.lastMessages.join("\n")}

User Message:
${message}
Recent conversation:
${memory.lastMessages.join("\n")}

User message:
${message}

Instructions:
- Answer naturally and accurately.
- Use the user's name if you know it.
- Format code inside Markdown code blocks.
- Use bullet points when helpful.
- If the user uploads an image, analyse it.
- If there is no image, simply answer the text normally.
- Never mention images unless one was uploaded.
`
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
  updateMemoryFromText(text);

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
function copyCode(button) {

    const code =
        button.parentElement.nextElementSibling.innerText;

    navigator.clipboard.writeText(code);

    button.innerText = "✅ Copied";

    setTimeout(() => {

        button.innerText = "📋 Copy";

    }, 2000);

}

window.startVoiceInput =
    startVoiceInput;  

/* ==========================
   SIDEBAR
========================== */

if (menuBtn) {

    menuBtn.addEventListener("click", () => {

        sidebar.classList.toggle("open");

    });

}

if (newChatBtn) {

    newChatBtn.addEventListener("click", () => {

        chatBox.innerHTML = "";

        hero.style.display = "block";

        memory.lastMessages = [];

        saveMemory();

        sidebar.classList.remove("open");

    });

}
/* ==========================
   CHAT HISTORY
========================== */

function saveCurrentChat() {

    const messages = [];

    document.querySelectorAll(".message").forEach(msg => {

        messages.push({

            text: msg.innerHTML,

            type: msg.classList.contains("user")
                ? "user"
                : "ai"

        });

    });

    if (messages.length === 0) return;

    chats[0] = {

        title: messages[0].text.replace(/<[^>]*>/g, "").substring(0, 30),

        messages

    };

    localStorage.setItem(

        "sageChats",

        JSON.stringify(chats)

    );

    renderChatHistory();

}

function renderChatHistory() {

    const history = document.getElementById("chatHistory");

    history.innerHTML = "";

    chats.forEach((chat, index) => {

        const item = document.createElement("div");

        item.className = "chat-item";

        item.innerText = chat.title || "New Chat";

        item.onclick = () => loadChat(index);

        history.appendChild(item);

    });

}

function loadChat(index) {

    chatBox.innerHTML = "";

    chats[index].messages.forEach(msg => {

        const div = document.createElement("div");

        div.className = "message " + msg.type;

        div.innerHTML = msg.text;

        chatBox.appendChild(div);

    });

    sidebar.classList.remove("open");

    scrollToBottom();

}

renderChatHistory();
