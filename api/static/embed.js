(function () {
    // var config = window.embeddedChatbotConfig || {};
    var threadId = null;
    var botname = "Ai Integrations"
    var welcome_message = "Welcome to Ai Integrations. How can I help you?"
    var chatWindowOpen = false;  // Flag to track if chat window is open
    var chatWindow = null;       // Variable to store chat window element
    var messagesContainer = null; // Variable to store messages container

     // Add Typing Indicator Styles
     var style = document.createElement('style');
     style.textContent = `
     .typing-indicator {
         display: flex;
         justify-content: center;
         align-items: center;
     }
     .typing-bubble {
         display: inline-block;
         width: 8px;
         height: 8px;
         background-color: #007bff;
         border-radius: 50%;
         margin: 0 2px;
         animation: bubble 1s linear infinite;
     }
     @keyframes bubble {
         0%, 100% { transform: translateY(0); }
         50% { transform: translateY(-10px); }
     }`;
     document.head.appendChild(style);
 
     // Function to Show Typing Indicator
     function showTypingIndicator() {
         var typingIndicator = document.createElement('div');
         typingIndicator.className = 'typing-indicator';
         for (var i = 0; i < 3; i++) {
             var bubble = document.createElement('div');
             bubble.className = 'typing-bubble';
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
        messagesContainer.style.overflowY = 'auto';
        messagesContainer.style.flexGrow = '1';

        var welcomeMessageContainer = document.createElement('div');

        // Create a span for the bot name to make it bold
        var botnameSpan = document.createElement('span');
        botnameSpan.textContent = botname;
        botnameSpan.style.fontWeight = 'bold'; // Set the font weight to bold

        // Append botname span to the welcome message container
        welcomeMessageContainer.appendChild(botnameSpan);

        // Add the rest of the message
        var messageText = document.createTextNode(": " + welcome_message);
        welcomeMessageContainer.appendChild(messageText);

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

    // Add Typing Indicator Styles
    var style = document.createElement('style');
    style.textContent = `
    .typing-bubble {
        display: inline-block;
        width: 8px;
        height: 8px;
        background-color: #007bff;
        border-radius: 50%;
        margin: 0 2px;
        animation: bubble 1s linear infinite;
    }
    @keyframes bubble {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }`;
    document.head.appendChild(style);

    // Function to Show Typing Indicator
    function showTypingIndicator() {
        var typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        for (var i = 0; i < 3; i++) {
            var bubble = document.createElement('div');
            bubble.className = 'typing-bubble';
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

    // Function to send a message
    function sendMessage(message, messagesContainer) {
        var userMessageContainer = document.createElement('div');

        // Create a span for "You" to make it bold
        var youSpan = document.createElement('span');
        youSpan.textContent = 'You';
        youSpan.style.fontWeight = 'bold'; // Set the font weight to bold

        // Append the "You" span to the message container
        userMessageContainer.appendChild(youSpan);

        // Add the rest of the message
        var messageText = document.createTextNode(": " + message);
        userMessageContainer.appendChild(messageText);

        // Append the entire message container to messages container
        messagesContainer.appendChild(userMessageContainer);

        showTypingIndicator();

        fetch('http://localhost:8000/chat/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ thread_id: threadId, message: message })
        }).then(response => response.json())
            .then(data => {
                removeTypingIndicator();
                messagesContainer.removeChild(messagesContainer.lastChild);
                var botMessageContainer = document.createElement('div');

                // Create a span for the bot name to make it bold
                var botnameSpan = document.createElement('span');
                botnameSpan.textContent = botname;
                botnameSpan.style.fontWeight = 'bold'; // Set the font weight to bold

                // Append botname span to the bot message container
                botMessageContainer.appendChild(botnameSpan);

                // Add the rest of the message
                var messageText = document.createTextNode(": " + data.response);
                botMessageContainer.appendChild(messageText);

                // Append the entire bot message container to messages container
                messagesContainer.appendChild(botMessageContainer);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            })
            .catch(error => {
                removeTypingIndicator(); // Remove typing indicator in case of error
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
            // welcome_message = data.welcome_message
        })
        .catch(error => {
            console.error('Error fetching thread ID:', error);
        });

    // Initialize the chat bubble
    createChatBubble();
})();



// (function() {
//     // Configuration from the embedded script
//     var config = window.embeddedChatbotConfig || {};
//     var threadId = null; // Variable to store the thread ID

// // Function to create the chat bubble
// function createChatBubble() {
//     var chatBubble = document.createElement('div');
//     chatBubble.id = 'chat-bubble';
//     chatBubble.textContent = '💬'; // Using an emoji as the chat icon
//     chatBubble.style.position = 'fixed';
//     chatBubble.style.bottom = '20px';
//     chatBubble.style.right = '20px';
//     chatBubble.style.background = '#007bff'; // A pleasant blue
//     chatBubble.style.color = 'white';
//     chatBubble.style.padding = '15px';
//     chatBubble.style.borderRadius = '50%';
//     chatBubble.style.zIndex = '20';
//     chatBubble.style.cursor = 'pointer';
//     chatBubble.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
//     chatBubble.style.display = 'flex';
//     chatBubble.style.justifyContent = 'center';
//     chatBubble.style.alignItems = 'center';
//     chatBubble.style.fontSize = '20px';
//     document.body.appendChild(chatBubble);

//         chatBubble.addEventListener('click', initializeChat);
//     }

// // Function to initialize chat and open chat window
// function initializeChat() {
//     if (!threadId) {
//         // Fetch thread ID from /start/ endpoint
//         console.log("Fetching Thread Id. Here is the domain used: ", config.domain)
//         // fetch(config.domain + '/start/')
//         // .then(response => response.json())
//         // .then(data => {
//         //     threadId = data.thread_id; // Store the received thread ID
//         //     openChatWindow(); // Open the chat window after getting thread ID
//         // })
//         // .catch(error => console.error('Error fetching thread ID:', error));
//         fetch('http://localhost:8000/start/')
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             return response.json();
//         })
//         .then(data => {
//             threadId = data.thread_id; // Store the received thread ID
//             openChatWindow(); // Open the chat window after getting thread ID
//         })
//         .catch(error => {
//             console.error('Error fetching thread ID:', error);
//         });
//     } else {
//         console.log("Thread Id exists, opening chat window")
//         openChatWindow(); // Open chat window if thread ID already exists
//     }
// }

// // Function to create the chat window
// function openChatWindow() {
//     console.log("MBA got thread id: ", threadId)
//     var chatWindow = document.createElement('div');
//     chatWindow.id = 'chat-window';
//     chatWindow.style.position = 'fixed';
//     chatWindow.style.bottom = '60px';
//     chatWindow.style.right = '20px';
//     chatWindow.style.width = '300px';
//     chatWindow.style.height = '400px';
//     chatWindow.style.zIndex = '20';
//     chatWindow.style.background = 'white';
//     chatWindow.style.border = '1px solid #ddd';
//     chatWindow.style.padding = '10px';
//     chatWindow.style.borderRadius = '8px';
//     chatWindow.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
//     chatWindow.style.overflow = 'auto';
//     chatWindow.style.display = 'flex';
//     chatWindow.style.flexDirection = 'column';
//     chatWindow.style.justifyContent = 'space-between';

//     var messagesContainer = document.createElement('div');
//     messagesContainer.style.overflowY = 'auto';
//     messagesContainer.style.flexGrow = '1';

//     var messageInput = document.createElement('input');
//     messageInput.type = 'text';
//     messageInput.style.width = '100%';
//     messageInput.style.boxSizing = 'border-box';
//     messageInput.style.padding = '10px';
//     messageInput.style.border = '1px solid #ddd';
//     messageInput.style.borderRadius = '4px';
//     messageInput.style.marginTop = '10px';

//     messageInput.addEventListener('keypress', function(e) {
//         if (e.key === 'Enter') {
//             sendMessage(messageInput.value, messagesContainer);
//             messageInput.value = '';
//         }
//     });

//     chatWindow.appendChild(messagesContainer);
//     chatWindow.appendChild(messageInput);
//     document.body.appendChild(chatWindow);
// }

//     // Function to send a message
// // Function to send a message
// function sendMessage(message, messagesContainer) {
//     var userMessage = document.createElement('div');
//     userMessage.textContent = 'You: ' + message;
//     messagesContainer.appendChild(userMessage);

//     console.log("about to call the chat endpoint");
//     console.log("MBA threadid: ", threadId);
//     console.log("MBA message: ", message);

//     fetch('http://localhost:8000/chat/', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ thread_id: threadId, message: message })
//     }).then(response => response.json())
//     .then(data => {
//         botMessage = document.createElement('div');
//         botMessage.textContent = 'Bot: ' + data.response;
//         messagesContainer.appendChild(botMessage);
//         messagesContainer.scrollTop = messagesContainer.scrollHeight;
//     })
//     .catch(error => console.error('Error:', error));

//     // // Send the message to the server with thread ID
//     // fetch(config.domain + '/chat/', {
//     //     method: 'POST',
//     //     headers: {
//     //         'Content-Type': 'application/json',
//     //         'Accept': 'application/json'
//     //     },
//     //     body: JSON.stringify({ thread_id: threadId, message: message })
//     // })
//     // .then(response => {
//     //     if (!response.ok) {
//     //         console.error('HTTP error, status = ' + response.status);
//     //         throw new Error('Network response was not ok ' + response.statusText);
//     //     }
//     //     console.log(response.json());
//     //     return response.json();
//     // })
//     // .then(data => {
//     //     console.log("MBA got to this blalasdf");
//     //     var botMessage = document.createElement('div');
//     //     botMessage.textContent = 'Bot: ' + data.response;
//     //     messagesContainer.appendChild(botMessage);
//     //     messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the latest message
//     // })
//     // .catch(error => {
//     //     console.error('Error and got into catch:', error);
//     //     var errorMessage = document.createElement('div');
//     //     errorMessage.textContent = 'Error: Could not send message';
//     //     messagesContainer.appendChild(errorMessage);
//     // });
// }

//     // Initialize the chat bubble
//     createChatBubble();
// })();
