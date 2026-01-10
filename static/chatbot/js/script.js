document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const chatHistory = document.querySelector('.chat-history');

    const sidebar = document.querySelector('.sidebar');
    const bottomNavIcons = document.querySelectorAll('.bottom-nav i');

    // API Endpoint
    const API_URL = '/api/chat/';

    /* ================================================= */
    /* 🔊 VOICE (TTS) — ADDED WITHOUT REMOVING ANYTHING */
    /* ================================================= */
    let voiceEnabled = true;

    function speakBot(text) {
        if (!voiceEnabled) return;
        if (!window.speechSynthesis) return;

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-IN';
        utterance.rate = 1;
        utterance.pitch = 1;

        window.speechSynthesis.speak(utterance);
    }

    window.toggleVoice = () => {
        voiceEnabled = !voiceEnabled;
        addMessage('bot', voiceEnabled ? '🔊 Voice enabled' : '🔇 Voice muted');
    };
    /* ================================================= */

    function init() {
        setupEventListeners();
        loadChatHistory();
    }

    function setupEventListeners() {
        chatForm.addEventListener('submit', handleSubmit);

        userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
            }
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const message = userInput.value.trim();
        if (!message) return;

        userInput.value = '';
        addMessage('user', message);

        const lowerMsg = message.toLowerCase();

        /* ------------------------------------------------ */
        /*          LOCAL COMMAND RESPONSES                 */
        /* ------------------------------------------------ */

/* ------------------------------------------------ */
/*           AI BIHARI INFORMATION                  */
/* ------------------------------------------------ */

if (
    lowerMsg.includes("what is ai bihari") ||
    lowerMsg.includes("ai bihari kya hai") ||
    lowerMsg.includes("define ai bihari") ||
    lowerMsg.includes("tell me about ai bihari") ||
    lowerMsg.includes("about ai bihari") ||
    lowerMsg.includes("ai bihari information")
) {
    const reply =
`AI Bihari is an intelligent chatbot and digital assistant created by Saurav, a Class 11 student from Bihar.

It helps users with:
• Education & learning
• Programming & coding
• Technology guidance
• Daily problem solving
• Smart answers in simple language

AI Bihari is made especially for students and beginners.`;

    addMessage("bot", reply);
    speakBot(reply);
    return;
}

if (
    lowerMsg.includes("who created ai bihari") ||
    lowerMsg.includes("ai bihari ka creator") ||
    lowerMsg.includes("founder of ai bihari") ||
    lowerMsg.includes("ai bihari kisne banaya")
) {
    const reply =
"AI Bihari was created by Saurav, a Class 11 student from Bihar, India.";

    addMessage("bot", reply);
    speakBot(reply);
    return;
}

if (
    lowerMsg.includes("why ai bihari") ||
    lowerMsg.includes("purpose of ai bihari") ||
    lowerMsg.includes("ai bihari ka purpose")
) {
    const reply =
`The purpose of AI Bihari is to make learning easy and accessible for everyone.

It focuses on:
• Helping students
• Explaining topics simply
• Supporting self-learning
• Encouraging technology use in Bihar and India`;

    addMessage("bot", reply);
    speakBot(reply);
    return;
}

if (
    lowerMsg.includes("what can ai bihari do") ||
    lowerMsg.includes("features of ai bihari") ||
    lowerMsg.includes("ai bihari features") ||
    lowerMsg.includes("ai bihari kya karta hai")
) {
    const reply =
`AI Bihari can:
• Answer questions
• Help in studies (Physics, Chemistry, Math, IT)
• Assist in programming (HTML, CSS, JS, Python)
• Give tech guidance
• Chat in simple language
• Work without confusion`;

    addMessage("bot", reply);
    speakBot(reply);
    return;
}

if (
    lowerMsg.includes("is ai bihari free") ||
    lowerMsg.includes("ai bihari free hai") ||
    lowerMsg.includes("cost of ai bihari")
) {
    const reply =
"Yes, AI Bihari is free to use and made mainly for learning and educational purposes.";

    addMessage("bot", reply);
    speakBot(reply);
    return;
}

if (
    lowerMsg.includes("is ai bihari safe") ||
    lowerMsg.includes("ai bihari safe hai")
) {
    const reply =
"Yes, AI Bihari is safe to use. It does not promote harmful content and is designed for students.";

    addMessage("bot", reply);
    speakBot(reply);
    return;
}

/* ================================================= */
/*        AI BIHARI – SINGLE PAGE COMMANDS           */
/* ================================================= */

if (
    lowerMsg.includes("who are you") ||
    lowerMsg.includes("introduce yourself") ||
    lowerMsg.includes("what are you")
) {
    addMessage(
        "bot",
        "I am AI Bihari 🤖 — a smart, student-focused AI assistant built to help in learning, technology, and problem solving."
    );
    return;
}

/* ---------- WHAT IS AI BIHARI ---------- */
if (
    lowerMsg.includes("what is ai bihari") ||
    lowerMsg.includes("ai bihari kya hai") ||
    lowerMsg.includes("define ai bihari")
) {
    addMessage(
        "bot",
        `AI Bihari is a student-friendly AI assistant created to make learning simple and clear.

It helps with:
• Studies
• Programming
• Technology guidance
• Daily problem solving

It focuses on simple explanations instead of complex words.`
    );
    return;
}

/* ---------- WHO CREATED AI BIHARI ---------- */
if (
    lowerMsg.includes("who made you") ||
    lowerMsg.includes("who created ai bihari") ||
    lowerMsg.includes("ai bihari kisne banaya")
) {
    addMessage(
        "bot",
        "AI Bihari was created by Saurav, a Class 11 student from Bihar who is passionate about AI, programming, and technology."
    );
    return;
}

/* ---------- ABOUT CREATOR ---------- */
if (
    lowerMsg.includes("who is saurav") ||
    lowerMsg.includes("tell me about saurav") ||
    lowerMsg.includes("about your creator")
) {
    addMessage(
        "bot",
        `Saurav is a Class 11 student and the creator of AI Bihari.

He is interested in:
• Programming & web development
• Artificial intelligence
• Building helpful tools for students
• Learning new technologies`
    );
    return;
}

/* ---------- PURPOSE / VISION ---------- */
if (
    lowerMsg.includes("purpose of ai bihari") ||
    lowerMsg.includes("vision of ai bihari") ||
    lowerMsg.includes("goal of ai bihari")
) {
    addMessage(
        "bot",
        `The purpose of AI Bihari is to support students with clear and honest guidance.

Its vision is to:
• Reduce study confusion
• Encourage self-learning
• Promote technology awareness
• Help students from every background`
    );
    return;
}

/* ---------- FEATURES ---------- */
if (
    lowerMsg.includes("features of ai bihari") ||
    lowerMsg.includes("what can ai bihari do") ||
    lowerMsg.includes("how can ai bihari help me")
) {
    addMessage(
        "bot",
        `AI Bihari can:
• Explain study concepts
• Help in exam preparation
• Guide in programming (HTML, CSS, JS, Python)
• Suggest project ideas
• Answer technology questions`
    );
    return;
}

/* ---------- LIMITATIONS ---------- */
if (
    lowerMsg.includes("limitations of ai bihari") ||
    lowerMsg.includes("what you cannot do")
) {
    addMessage(
        "bot",
        `AI Bihari cannot:
• Replace teachers
• Do illegal or harmful tasks
• Access private data
• Make decisions for you

It is designed to assist learning, not misuse.`
    );
    return;
}

/* ---------- SAFETY & TRUST ---------- */
if (
    lowerMsg.includes("is ai bihari safe") ||
    lowerMsg.includes("can i trust ai bihari")
) {
    addMessage(
        "bot",
        "Yes 🙂 AI Bihari is safe and made for educational use. Important decisions should still be verified with teachers or experts."
    );
    return;
}

/* ---------- WHY THE NAME ---------- */
if (
    lowerMsg.includes("why ai bihari") ||
    lowerMsg.includes("meaning of ai bihari")
) {
    addMessage(
        "bot",
        `The name “AI Bihari” represents intelligence with simplicity and honesty.

It reflects:
• Local identity
• Student-friendly nature
• Simple explanations
• Helping mindset`
    );
    return;
}

/* ================================================= */
/*        END – AI BIHARI SINGLE PAGE COMMANDS        */
/* ================================================= */
        if (
            lowerMsg.includes("who made you") ||
            lowerMsg.includes("who created you") ||
            lowerMsg.includes("your creator") ||
            lowerMsg.includes("who is your developer") ||
            lowerMsg.includes("who create you") ||
            lowerMsg.includes("who  creates you") ||
            lowerMsg.includes("tumko kaun banaya") ||
            lowerMsg.includes("who is your owner") ||
            lowerMsg.includes("name your owner")
        ) {
            const reply =
                "I was created by Saurav, a Class 11 student who is passionate about AI, programming, and technology.";
            addMessage("bot", reply);
            speakBot(reply);
            return;
        }

        if (
            lowerMsg.includes("who is saurav") ||
            lowerMsg.includes("tell me about saurav") ||
            lowerMsg.includes("about your creator") ||
            lowerMsg.includes("ye saurav kaun hai")
        ) {
            const reply =
`Saurav is a Class 11 student from Bihar and the creator of AI Bihari.
He enjoys learning programming, building AI projects, and exploring new technologies.`;
            addMessage("bot", reply);
            speakBot(reply);
            return;
        }

        if (
            lowerMsg.includes("saurav details") ||
            lowerMsg.includes("full details of saurav") ||
            lowerMsg.includes("creator details")
        ) {
            const reply =
`Here are the details of my creator:

Name: Saurav
Class: 11
Village: Palaki Sultani
Post Office: Guraru
District: Gaya
State: Bihar`;
            addMessage("bot", reply);
            speakBot(reply);
            return;
        }

        if (
            lowerMsg.includes("who is rishi") ||
            lowerMsg.includes("rishi kaun hai")
        ) {
            const reply =
                "Rishi is a small boy of Palaki Sultani and a memorable friend of Saurav.";
            addMessage("bot", reply);
            speakBot(reply);
            return;
        }

        /* ------------------------------------------------ */
        /*              NORMAL AI FLOW                     */
        /* ------------------------------------------------ */

        const typingIndicator = showTypingIndicator();

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken') || ''
                },
                body: JSON.stringify({ message })
            });

            typingIndicator.remove();

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.reply) {
                addMessage('bot', data.reply);
                speakBot(data.reply);
            } else if (data.error) {
                addMessage('bot', `Error: ${data.error}`);
            }

            saveToHistory(message, data.reply || data.error);

        } catch (error) {
            console.error('Error:', error);
            typingIndicator.remove();
            addMessage('bot', 'Sorry, there was an error processing your request.');
        }
    }

    function addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `${sender}-message message`;

        const formattedText = text.replace(/\n/g, '<br>');

        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="message-text">
                        <p>${formattedText}</p>
                    </div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="bot-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-text">
                        <p>${formattedText}</p>
                    </div>
                </div>
            `;
        }

        chatMessages.appendChild(messageDiv);
        scrollToBottom();
        userInput.focus();
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'bot-message message';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="bot-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="typing-indicator">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
        return typingDiv;
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function saveToHistory(userMessage, botReply) {
        const history = JSON.parse(localStorage.getItem('tuni_chat_history') || '[]');

        history.unshift({
            user: userMessage,
            bot: botReply,
            timestamp: new Date().toISOString()
        });

        if (history.length > 20) history.pop();

        localStorage.setItem('tuni_chat_history', JSON.stringify(history));
        updateChatHistory(history);
    }

    function loadChatHistory() {
        const history = JSON.parse(localStorage.getItem('tuni_chat_history') || '[]');
        updateChatHistory(history);
    }

    function updateChatHistory(history) {
        chatHistory.innerHTML = '';

        if (history.length === 0) {
            chatHistory.innerHTML = '<p class="empty-history">No chat history yet</p>';
            return;
        }

        history.forEach(chat => {
            const item = document.createElement('div');
            item.className = 'history-item';

            const preview = chat.user.length > 50
                ? chat.user.substring(0, 50) + '...'
                : chat.user;

            item.innerHTML = `
                <div class="history-preview">${preview}</div>
                <div class="history-time">${formatTime(chat.timestamp)}</div>
            `;

            item.addEventListener('click', () => loadConversation(chat));
            chatHistory.appendChild(item);
        });
    }

    function loadConversation(chat) {
        chatMessages.innerHTML = '';
        addMessage('user', chat.user);
        addMessage('bot', chat.bot);
        speakBot(chat.bot);
    }

    function formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie) {
            document.cookie.split(';').forEach(cookie => {
                cookie = cookie.trim();
                if (cookie.startsWith(name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                }
            });
        }
        return cookieValue;
    }

    // UI helpers
    window.toggleSidebar = () => sidebar.classList.toggle('hidden');
    window.toggleDarkMode = () => document.body.classList.toggle('dark-mode');
    window.startNewChat = () => {
        chatMessages.innerHTML = '';
        const msg = 'New chat started! How can I help you?';
        addMessage('bot', msg);
        speakBot(msg);
    };

    bottomNavIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            bottomNavIcons.forEach(i => i.classList.remove('active'));
            icon.classList.add('active');
        });
    });

    init();
});