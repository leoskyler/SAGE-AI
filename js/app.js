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
                                text: "You are SAGE AI, a smart helpful assistant. Reply clearly and naturally."
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

    return data.candidates?.[0]?.content?.parts?.[0]?.text 
        || "Sorry, I couldn't respond.";
}


/* SEND BUTTON (UPDATED FOR AI) */
sendBtn.addEventListener("click", async () => {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    addMessage("SAGE is thinking...", "ai");

    try {
        const reply = await generateReply(text);

        chatBox.lastChild.remove(); // remove "thinking..."
        addMessage(reply, "ai");

    } catch (error) {
        chatBox.lastChild.remove();
        addMessage("Error connecting to Gemini ❌", "ai");
    }
});
