document.addEventListener('DOMContentLoaded', () => {
    /* ================================================= */
    /* DOM ELEMENTS                                      */
    /* ================================================= */
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const chatHistory = document.querySelector('.chat-history');
    const sidebar = document.querySelector('.sidebar');
    const bottomNavIcons = document.querySelectorAll('.bottom-nav i');

    const API_URL = '/api/chat/';

    /* ================================================= */
    /* 💾 LAST TOPIC MEMORY (ADD)                         */
    /* ================================================= */
    let lastTopic = null;

    /* ================================================= */
    /* 🔄 QUICK QUESTION SENDER (ADD)                     */
    /* ================================================= */
    window.sendQuickQuestion = function (text) {
        userInput.value = text;
        chatForm.dispatchEvent(
            new Event('submit', { bubbles: true, cancelable: true })
        );
    };

    /* ================================================= */
    /* 🧠 TOPIC DETECTION (ADD)                           */
    /* ================================================= */
    function detectTopic(text) {
        const t = text.toLowerCase();

        if (t.includes('ai bihari')) return 'ai_bihari';
        if (t.includes('creator') || t.includes('made you') || t.includes('saurav'))
            return 'creator';
        if (t.includes('study') || t.includes('class') || t.includes('exam'))
            return 'study';
        if (
            t.includes('code') ||
            t.includes('programming') ||
            t.includes('javascript') ||
            t.includes('python')
        )
            return 'programming';
        if (t.includes('help') || t.includes('can you')) return 'general_help';

        return lastTopic;
    }

    /* ================================================= */
    /* 🔄 DYNAMIC SUGGESTIONS (ADD)                       */
    /* ================================================= */
    function getDynamicSuggestions(text) {
        lastTopic = detectTopic(text);

        if (lastTopic === 'ai_bihari') {
            return [
                'Who created AI Bihari?',
                'Why was AI Bihari created?',
                'Is AI Bihari free?'
            ];
        }

        if (lastTopic === 'creator') {
            return [
                'Tell me more about Saurav',
                'What is AI Bihari?',
                'How was AI Bihari built?'
            ];
        }

        if (lastTopic === 'study') {
            return [
                'Help me with Class 11 Physics',
                'Explain a concept simply',
                'How should I study effectively?'
            ];
        }

        if (lastTopic === 'programming') {
            return [
                'Teach me JavaScript basics',
                'Help me learn Python',
                'Give me a project idea'
            ];
        }

        return [
            'What is AI Bihari?',
            'Who made you?',
            'What can you do?'
        ];
    }

    function addSuggestions(messageDiv, suggestions) {
        const container = document.createElement('div');
        container.className = 'suggested-questions';

        suggestions.forEach(q => {
            const chip = document.createElement('div');
            chip.className = 'question-chip';
            chip.textContent = q;
            chip.onclick = () => sendQuickQuestion(q);
            container.appendChild(chip);
        });

        messageDiv.appendChild(container);
    }

    /* ================================================= */
    /* INIT                                             */
    /* ================================================= */
    function init() {
        setupEventListeners();
        loadChatHistory();
    }

    function setupEventListeners() {
        chatForm.addEventListener('submit', handleSubmit);

        userInput.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
            }
        });
    }

    /* ================================================= */
    /* MAIN SUBMIT HANDLER                               */
    /* ================================================= */
    async function handleSubmit(e) {
        e.preventDefault();

        const message = userInput.value.trim();
        if (!message) return;

        userInput.value = '';
        addMessage('user', message);

        const lowerMsg = message.toLowerCase();

        /* ---------- LOCAL COMMANDS ---------- */

        if (lowerMsg.includes('who made you') || lowerMsg.includes('who created you')) {
            addMessage(
                'bot',
                'I was created by Saurav, a Class 11 student passionate about AI and technology.'
            );
            return;
        }

        if (lowerMsg.includes('what is ai bihari')) {
            addMessage(
                'bot',
                'AI Bihari is a smart assistant made to help students with learning, technology, and problem solving.'
            );
            return;
        }

        /* ---------- NORMAL AI FLOW ---------- */

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

    /* ================================================= */
    /* MESSAGE RENDERING                                */
    /* ================================================= */
    function addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `${sender}-message message`;

        const formattedText = text.replace(/\n/g, '<br>');

        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="message-text"><p>${formattedText}</p></div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="bot-avatar"><i class="fas fa-robot"></i></div>
                    <div class="message-text"><p>${formattedText}</p></div>
                </div>
            `;
        }

        chatMessages.appendChild(messageDiv);

        if (sender === 'bot') {
            const suggestions = getDynamicSuggestions(text);
            addSuggestions(messageDiv, suggestions);
        }

        scrollToBottom();
        userInput.focus();
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'bot-message message';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="bot-avatar"><i class="fas fa-robot"></i></div>
                <div class="typing-indicator">
                    <span></span><span></span><span></span>
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

    /* ================================================= */
    /* CHAT HISTORY                                     */
    /* ================================================= */
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
        if (!history.length) {
            chatHistory.innerHTML = '<p class="empty-history">No chat history yet</p>';
            return;
        }

        history.forEach(chat => {
            const item = document.createElement('div');
            item.className = 'history-item';
            item.textContent = chat.user;
            item.onclick = () => loadConversation(chat);
            chatHistory.appendChild(item);
        });
    }

    function loadConversation(chat) {
        chatMessages.innerHTML = '';
        addMessage('user', chat.user);
        addMessage('bot', chat.bot);
    }

    /* ================================================= */
    /* HELPERS                                          */
    /* ================================================= */
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

    /* ================================================= */
    /* UI HELPERS                                       */
    /* ================================================= */
    window.toggleSidebar = () => sidebar.classList.toggle('hidden');
    window.toggleDarkMode = () => document.body.classList.toggle('dark-mode');

    window.startNewChat = () => {
        lastTopic = null;
        chatMessages.innerHTML = '';
        addMessage('bot', 'Hello! 🥰 How can I help you today?');
    };

    bottomNavIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            bottomNavIcons.forEach(i => i.classList.remove('active'));
            icon.classList.add('active');
        });
    });

    init();
});