class PackageTrackingBot {
    // Configuration for contact information
    static CONFIG = {
        SUPPORT_EMAIL: 'support@example.com',
        SUPPORT_PHONE: '1-800-SUPPORT',
        CLAIMS_PORTAL: 'support.example.com/claims'
    };

    constructor() {
        this.state = {
            currentStep: 'greeting',
            trackingId: null,
            packageStatus: null,
            isEnded: false
        };
        
        // Mock database of package statuses
        this.packageDatabase = {
            'TRK123456': { status: 'in_transit', date: '2024-03-25', location: null },
            'TRK789012': { status: 'delivered', date: '2024-03-20', location: '123 Main St' },
            'TRK345678': { status: 'lost', date: null, location: null }
        };
    }

    // Validate tracking ID format (simple example)
    isValidTrackingId(input) {
        // Split the input into words and check each word
        const words = input.split(/\s+/);
        for (const word of words) {
            if (/^TRK\d{6}$/.test(word)) {
                return word; // Return the actual tracking ID if found
            }
        }
        return null; // Return null if no valid tracking ID is found
    }

    // Mock API call to get package status
    lookupPackage(trackingId) {
        return this.packageDatabase[trackingId] || null;
    }

    processUserInput(input) {
        if (this.state.isEnded) {
            return null; // Don't process any more inputs if chat has ended
        }

        input = input.trim();
        
        switch (this.state.currentStep) {
            case 'greeting':
                if (input.toLowerCase().includes('lost') && input.toLowerCase().includes('package')) {
                    this.state.currentStep = 'ask_tracking';
                    return "I'm sorry to hear that. Can you please provide your order number or tracking ID?";
                } else {
                    this.state.currentStep = 'ask_tracking';
                    return "I can help with lost packages. Could you please tell me your tracking ID?";
                }

            case 'ask_tracking':
                if (!input) {
                    return "To help you, I need the order or tracking number. Could you please provide that?";
                }

                const trackingId = this.isValidTrackingId(input);
                if (!trackingId) {
                    return "That doesn't look like a valid ID. Please provide an ID in the format 'TRKxxxxxx'.";
                }

                this.state.trackingId = trackingId;
                const packageInfo = this.lookupPackage(trackingId);

                if (!packageInfo) {
                    this.state.currentStep = 'ask_tracking';
                    return "Sorry, I couldn't find any order with that ID. Please verify it or contact customer support.";
                }

                this.state.packageStatus = packageInfo.status;
                this.state.currentStep = 'status_handling';

                switch (packageInfo.status) {
                    case 'in_transit':
                        this.state.currentStep = 'end';
                        return `Your package is currently in transit and is expected to arrive by ${packageInfo.date}. Would you like help with anything else?`;
                    case 'delivered':
                        this.state.currentStep = 'delivery_confirmation';
                        return `It shows your package was delivered on ${packageInfo.date} at ${packageInfo.location}.\n\nDid you receive it?`;
                    case 'lost':
                        this.state.currentStep = 'offer_help';
                        return "It looks like the package is delayed or lost. I can help you file a missing package claim or connect you with a support agent.";
                }
                break;

            case 'delivery_confirmation':
                if (input.toLowerCase().includes('yes')) {
                    this.state.currentStep = 'end';
                    return "Great! Do you need help with something else?";
                } else if (input.toLowerCase().includes('no')) {
                    this.state.currentStep = 'offer_help';
                    return "I'm sorry to hear that. I can help you file a missing package claim. Would you like to:\n1. File a claim\n2. Contact support\n3. Request a refund";
                }
                return "I didn't understand. Did you receive the package? Please answer yes or no.";

            case 'offer_help':
                if (input.includes('1') || input.toLowerCase().includes('file') || input.toLowerCase().includes('claim')) {
                    this.state.currentStep = 'end';
                    return `I'll help you file a claim. Please visit our claims portal at ${PackageTrackingBot.CONFIG.CLAIMS_PORTAL} and use your tracking number. Is there anything else I can help you with?`;
                } else if (input.includes('2') || input.toLowerCase().includes('contact') || input.toLowerCase().includes('support')) {
                    this.state.currentStep = 'end';
                    return `I'll connect you with our support team. Please call ${PackageTrackingBot.CONFIG.SUPPORT_PHONE} or email ${PackageTrackingBot.CONFIG.SUPPORT_EMAIL}. Is there anything else I can help you with?`;
                } else if (input.includes('3') || input.toLowerCase().includes('refund')) {
                    this.state.currentStep = 'end';
                    return "I'll help you process a refund. Please allow 3-5 business days for the refund to appear in your account. Is there anything else I can help you with?";
                }
                return "Please choose one of the options:\n1. File a claim\n2. Contact support\n3. Request a refund";

            case 'end':
                if (input.toLowerCase().includes('yes')) {
                    this.state.currentStep = 'greeting';
                    return "How can I help you?";
                } else if (input.toLowerCase().includes('no')) {
                    this.state.isEnded = true;
                    return "Thank you for using our package tracking service. Have a great day!";
                }
                return "Would you like help with anything else? Please answer yes or no.";
        }
    }
}

// Initialize the chat interface
document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const bot = new PackageTrackingBot();

    // Function to add a message to the chat
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to end chat
    function endChat() {
        userInput.disabled = true;
        sendButton.disabled = true;
        userInput.placeholder = "Chat ended";
        
        // Create and show the thank you popup
        const popup = document.createElement('div');
        popup.className = 'thank-you-popup';
        popup.innerHTML = `
            <div class="popup-content">
                <h2>Thank You!</h2>
                <p>Thank you for using our package tracking service.</p>
                <p>Have a great day!</p>
                <button onclick="window.location.reload()">I need help with something else</button>
            </div>
        `;
        document.body.appendChild(popup);
        
        // Add fade-in effect
        setTimeout(() => popup.classList.add('show'), 100);
    }

    // Send initial greeting
    addMessage("Hi! How can I help you today?");

    // Handle send button click
    function handleSend() {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, true);
            const response = bot.processUserInput(message);
            if (response) {
                addMessage(response);
                if (bot.state.isEnded) {
                    endChat();
                }
            }
            userInput.value = '';
        }
    }

    sendButton.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    });
}); 