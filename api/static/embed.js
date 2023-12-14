(function () {
    // var config = window.embeddedChatbotConfig || {};
    var threadId = null;
    var botname = "Ai Integrations"
    var welcome_message = "Welcome to Ai Integrations. How can I help you?"
    var chatWindowOpen = false;  // Flag to track if chat window is open
    var chatWindow = null;       // Variable to store chat window element
    var messagesContainer = null; // Variable to store messages container
    var botMessageBgColor = "grey";
    var botResponseTextColor = "white";
    var chatBubbleBorderRadius = "8px";
    var chatBubbleTextPadding = ".5rem"

    // Add Typing Indicator Styles
    var style = document.createElement('style');
    style.textContent = `
     .typing-indicator {
        margin-top: 1rem;
        margin-bottom: 1rem;
     }
     .typing-bubble {
         display: inline-block;
         width: 8px;
         height: 8px;
         background-color: ${botMessageBgColor};
         border-radius: 50%;
         margin: 0 5px;
         animation: bubble 1s linear infinite;
     }
     .messagesContainer {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        flex-grow: 1;
    }
     .welcomeMessageContainer {
        background-color: ${botMessageBgColor};
        border-radius: ${chatBubbleBorderRadius};
        text-align: left;
        max-width: 90%;
        color: ${botResponseTextColor};
        padding: ${chatBubbleTextPadding};
     }
     .userMessageContainer {
        background-color: blue;
        border-radius: ${chatBubbleBorderRadius};
        color: white;
        margin-top: 1rem;
        padding: ${chatBubbleTextPadding};
        display: inline-block;
        max-width: 90%;
        margin-left: auto;
    }
     .botResponse {
        background-color: ${botMessageBgColor};
        border-radius: ${chatBubbleBorderRadius};
        text-align: left;
        max-width: 90%;
        color: ${botResponseTextColor};
        padding: ${chatBubbleTextPadding};
        margin-top: 1rem;
     }
     .typing-bubble2 {
        animation: bubble2 1s linear infinite;
     }
     @keyframes bubble {
         0%, 100% { transform: translateY(0); }
         50% { transform: translateY(-10px); }
     }
     @keyframes bubble2 {
        0%, 100% { transform: translateY(0); }
        25% { transform: translateY(-10px); }
     }`;
    document.head.appendChild(style);

    // Function to Show Typing Indicator
    function showTypingIndicator() {
        var typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        for (var i = 0; i < 3; i++) {
            var bubble = document.createElement('div');
            bubble.className = 'typing-bubble';
            if (i == 1) {
                bubble.className += ' typing-bubble2';
            }
            typingIndicator.appendChild(bubble);
        }
        messagesContainer.appendChild(typingIndicator);
    }

    // Function to Remove Typing Indicator
    function removeTypingIndicator() {
        var typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            messagesContainer.removeChild(typingIndicator);
        }
    }

    // Function to create the chat bubble
    function createChatBubble() {
        var chatBubble = document.createElement('div');
        chatBubble.id = 'chat-bubble';
        chatBubble.textContent = '💬'; // Using an emoji as the chat icon
        chatBubble.style.position = 'fixed';
        chatBubble.style.bottom = '20px';
        chatBubble.style.right = '20px';
        chatBubble.style.background = '#007bff'; // A pleasant blue
        chatBubble.style.color = 'white';
        chatBubble.style.padding = '15px';
        chatBubble.style.borderRadius = '50%';
        chatBubble.style.zIndex = '20';
        chatBubble.style.cursor = 'pointer';
        chatBubble.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        chatBubble.style.display = 'flex';
        chatBubble.style.justifyContent = 'center';
        chatBubble.style.alignItems = 'center';
        chatBubble.style.fontSize = '20px';
        document.body.appendChild(chatBubble);

        chatBubble.addEventListener('click', toggleChatWindow);
    }

    // Function to toggle chat window
    function toggleChatWindow() {

        if (chatWindowOpen) {
            chatWindow.style.display = 'none';
            chatWindowOpen = false;
        } else {
            if (!chatWindow) {

                openChatWindow();
            }
            chatWindow.style.display = 'flex';
            chatWindowOpen = true;
        }
    }

    // Function to create the chat window
    function openChatWindow() {
        chatWindow = document.createElement('div');
        chatWindow.id = 'chat-window';
        chatWindow.style.position = 'fixed';
        chatWindow.style.bottom = '60px';
        chatWindow.style.right = '20px';
        chatWindow.style.width = '300px';
        chatWindow.style.height = '400px';
        chatWindow.style.zIndex = '20';
        chatWindow.style.background = 'white';
        chatWindow.style.border = '1px solid #ddd';
        chatWindow.style.padding = '10px';
        chatWindow.style.borderRadius = '8px';
        chatWindow.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        chatWindow.style.overflow = 'auto';
        chatWindow.style.display = 'flex';
        chatWindow.style.flexDirection = 'column';
        chatWindow.style.justifyContent = 'space-between';

        messagesContainer = document.createElement('div');
        messagesContainer.className = "messagesContainer"

        var welcomeMessageContainer = document.createElement('div');

        // Add the rest of the message
        var messageText = document.createTextNode(welcome_message);
        welcomeMessageContainer.appendChild(messageText);
        welcomeMessageContainer.className = "welcomeMessageContainer"

        // Append the entire welcome message container to messages container
        messagesContainer.appendChild(welcomeMessageContainer);

        var messageInput = document.createElement('input');
        messageInput.type = 'text';
        messageInput.style.width = '100%';
        messageInput.style.boxSizing = 'border-box';
        messageInput.style.padding = '10px';
        messageInput.style.border = '1px solid #ddd';
        messageInput.style.borderRadius = '4px';
        messageInput.style.marginTop = '10px';

        messageInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                sendMessage(messageInput.value, messagesContainer);
                messageInput.value = '';
            }
        });

        chatWindow.appendChild(messagesContainer);
        chatWindow.appendChild(messageInput);
        document.body.appendChild(chatWindow);
    }

    function sendMessage(message, messagesContainer) {
        var userMessageContainer = document.createElement('div');

        // // Add the rest of the message
        var messageText = document.createTextNode(message);
        userMessageContainer.appendChild(messageText);
        userMessageContainer.className = "userMessageContainer"

        // Append the entire message container to messages container
        messagesContainer.appendChild(userMessageContainer);
        showTypingIndicator();
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        fetch('http://localhost:8000/chat/', {
        // fetch('http://localhost:8000/testResponseOnUi/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ thread_id: threadId, message: message })
        }).then(response => response.json())
            .then(data => {
                removeTypingIndicator();
                var botMessageContainer = document.createElement('div');
                botMessageContainer.className = "botResponse"

                // Add the rest of the message
                var messageText = document.createTextNode(data.response);
                botMessageContainer.appendChild(messageText);

                // Append the entire bot message container to messages container
                messagesContainer.appendChild(botMessageContainer);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            })
            .catch(error => {
                removeTypingIndicator(); // Remove typing indicator in case of error
                var botMessageContainer = document.createElement('div');
                botMessageContainer.className = "botResponse"

                // Add the rest of the message
                var messageText = document.createTextNode("Internal Server Error");
                botMessageContainer.appendChild(messageText);

                // Append the entire bot message container to messages container
                messagesContainer.appendChild(botMessageContainer);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                console.error('Error:', error);
            });
    }

    // When client page loads, initialize Thread
    fetch('http://localhost:8000/start/')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            threadId = data.thread_id; // Store the received thread ID
        })
        .catch(error => {
            console.error('Error fetching thread ID:', error);
        });

    // Initialize the chat bubble
    createChatBubble();
})();