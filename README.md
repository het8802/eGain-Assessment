# Package Tracking Chatbot

A simple, user-friendly chatbot interface for tracking packages and handling lost package inquiries. The chatbot provides a conversational interface to check package status, file claims, and get support for delivery issues.

## Features

- Simple and intuitive chat interface
- Package tracking with mock data
- Smart tracking ID detection (works even in sentences)
- Natural conversation flow
- Modern, responsive design
- No dependencies - pure HTML, CSS, and JavaScript

## Setup Instructions

1. Clone this repository or download the files:
   - `index.html`
   - `styles.css`
   - `script.js`

2. No installation or build process required! Simply:
   - Double-click `index.html` to open in your browser, or
   - Use a local server (recommended for development):
     ```bash
     # Using Python 3
     python3 -m http.server 8000

     # Using Node.js
     npx http-server
     ```

3. For development, any modern code editor (VS Code, Sublime Text, etc.) will work.

## Implementation Approach

### Architecture

The implementation follows a simple, modular approach:

1. **Core Bot Logic (`PackageTrackingBot` class)**
   - State management for conversation flow
   - Mock database for package statuses
   - Input validation and processing
   - Configurable contact information

2. **User Interface**
   - Clean, responsive design
   - Real-time message updates
   - Smooth animations and transitions
   - End-of-conversation handling

### Key Design Decisions

1. **State Management**
   - Uses a simple state machine pattern
   - Tracks conversation step, package info, and chat status
   - Maintains conversation context

2. **Mock Database**
   - Simulates package tracking with sample data
   - Three status types: in_transit, delivered, lost
   - Easily expandable for real API integration

3. **User Experience**
   - Natural language processing for tracking IDs
   - Helpful error messages and guidance
   - Clear conversation flow
   - Smooth transitions and feedback

### Test Cases

You can test the chatbot with these scenarios:

1. **Valid Tracking IDs:**
   - TRK123456 (In Transit)
   - TRK789012 (Delivered)
   - TRK345678 (Lost)

2. **Natural Language Inputs:**
   - "My tracking number is TRK123456"
   - "I lost my package with ID TRK345678"
   - "Can you check TRK789012 for me?"

## Future Improvements

1. Integration with real tracking API
2. User authentication
3. Chat history persistence
4. Multiple language support
5. Rich media responses (maps, tracking timeline)
6. Analytics and feedback collection

## File Structure

```
package-tracking-chatbot/
├── index.html          # Main HTML file
├── styles.css         # Styling and animations
├── script.js         # Chatbot logic and UI handling
└── README.md        # Documentation
```

## Contact Information

For testing purposes, the chatbot uses these mock contact details:
- Email: support@example.com
- Phone: 1-800-SUPPORT
- Claims Portal: support.example.com/claims

To change these, modify the `CONFIG` object in `script.js`. 