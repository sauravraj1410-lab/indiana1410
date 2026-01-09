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

    /* ===================== ADD START ===================== */
    /* 🔄 DYNAMIC SUGGESTIONS LOGIC (ADD ONLY) */

    function sendQuickQuestion(text) {
        userInput.value = text;
        chatForm.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    }

    function getDynamicSuggestions(text) {
        const t = text.toLowerCase();

        if (t.includes("ai bihari")) {
            return [
                "Who created AI Bihari?",
                "What can AI Bihari do?",
                "Is AI Bihari free?"
            ];
        }

        if (t.includes("created") || t.includes("saurav")) {
            return [
                "What is AI Bihari?",
                "Why was AI Bihari created?",
                "What are features of AI Bihari?"
            ];
        }

        if (t.includes("help") || t.includes("can")) {
            return [
                "Can you help in studies?",
                "Can you help in programming?",
                "Are you safe for students?"
            ];
        }

        return [
            "What is AI Bihari?",
            "Who made you?",
            "What can you do?"
        ];
    }

    function addSuggestions(messageDiv, suggestions) {
        const container = document.createElement("div");
        container.className = "suggested-questions";

        suggestions.forEach(q => {
            const chip = document.createElement("div");
            chip.className = "question-chip";
            chip.textContent = q;
            chip.onclick = () => sendQuickQuestion(q);
            container.appendChild(chip);
        });

        messageDiv.appendChild(container);
    }

    /* ===================== ADD END ===================== */

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

        /* ---- YOUR EXISTING LOCAL COMMANDS STAY SAME ---- */

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

            const data = await response.json();

            if (data.reply) {
                addMessage('bot', data.reply);
            } else if (data.error) {
                addMessage('bot', `Error: ${data.error}`);
            }

            saveToHistory(message, data.reply || data.error);

        } catch (error) {
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

        /* ===================== ADD START ===================== */
        if (sender === "bot") {
            const suggestions = getDynamicSuggestions(text);
            addSuggestions(messageDiv, suggestions);
        }
        /* ===================== ADD END ===================== */

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
            item.innerHTML = `<div>${chat.user}</div>`;
            item.addEventListener('click', () => loadConversation(chat));
            chatHistory.appendChild(item);
        });
    }

    function loadConversation(chat) {
        chatMessages.innerHTML = '';
        addMessage('user', chat.user);
        addMessage('bot', chat.bot);
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

    window.toggleSidebar = () => sidebar.classList.toggle('hidden');
    window.toggleDarkMode = () => document.body.classList.toggle('dark-mode');

    init();
});