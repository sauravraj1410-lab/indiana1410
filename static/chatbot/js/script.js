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

        // Who made you
        if (
            lowerMsg.includes("who made you") ||
            lowerMsg.includes("who created you") ||
            lowerMsg.includes("your creator") ||
            lowerMsg.includes("who is your developer")
            lowerMsg.includes("whi create you")
            lowerMsg.includes("who  creates you")
            lowerMsg.includes("Tumko kaun banaya")
            lowerMsg.includes("who is your owner")
            lowerMsg.includes("Name your owner")
            
        ) {
            addMessage(
                "bot",
                "I was created by Saurav, a Class 11 student who is passionate about AI, programming, and technology."
            );
            return;
        }

        // About Saurav (general)
        if (
            lowerMsg.includes("who is saurav") ||
            lowerMsg.includes("tell me about saurav") ||
            lowerMsg.includes("about your creator")
            lowerMsg.includes("ye saurav kaun hai")
        ) {
            addMessage(
                "bot",
                `Saurav is a Class 11 student from Bihar and the creator of AI Bihari.
He enjoys learning programming, building AI projects, and exploring new technologies.`
            );
            return;
        }

        // Detailed creator info (only when explicitly asked)
        if (
            lowerMsg.includes("saurav details") ||
            lowerMsg.includes("full details of saurav") ||
            lowerMsg.includes("creator details")
        ) {
            addMessage(
                "bot",
                `Here are the details of my creator:

Name: Saurav  
Class: 11  

Village: Palaki Sultani  
Post Office: Guraru  
District: Gaya  
State: Bihar  

Father: Ajay Yadav  
Mother: Arti Kumari Anshu  
Brother: Sachin  
Sister: Supriya  
Friend: Rishi`
            );
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
        addMessage('bot', 'New chat started! How can I help you?');
    };

    bottomNavIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            bottomNavIcons.forEach(i => i.classList.remove('active'));
            icon.classList.add('active');
        });
    });

    init();
});
