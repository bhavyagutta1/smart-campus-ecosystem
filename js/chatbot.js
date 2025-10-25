// Chatbot Functionality

function toggleChatbot() {
    const chatWindow = document.getElementById('chatbotWindow');
    chatWindow.classList.toggle('active');
    
    // Focus on input when opening
    if (chatWindow.classList.contains('active')) {
        document.getElementById('chatInput').focus();
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;

    const messagesContainer = document.getElementById('chatMessages');
    
    // Add user message
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'chat-message user';
    userMessageDiv.textContent = message;
    messagesContainer.appendChild(userMessageDiv);

    // Clear input
    input.value = '';
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Simulate bot typing
    setTimeout(() => {
        const response = getBotResponse(message);
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'chat-message bot';
        botMessageDiv.textContent = response;
        messagesContainer.appendChild(botMessageDiv);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 500);
}

function getBotResponse(message) {
    const msg = message.toLowerCase();
    
    // Event-related queries
    if (msg.includes('event') || msg.includes('fest') || msg.includes('program')) {
        return 'You can view all upcoming events in the Events section. Tech Fest 2025 is coming up on November 5th at the Auditorium!';
    } 
    
    // Lost & Found queries
    else if (msg.includes('lost') || msg.includes('found') || msg.includes('item')) {
        return 'Check the Lost & Found section to report or search for items. We currently have several items listed including electronics and books.';
    } 
    
    // Feedback queries
    else if (msg.includes('feedback') || msg.includes('complaint') || msg.includes('grievance') || msg.includes('issue')) {
        return 'You can submit feedback or grievances through the Feedback section. We review all submissions within 48 hours and prioritize based on urgency.';
    } 
    
    // Club queries
    else if (msg.includes('club') || msg.includes('join') || msg.includes('organization')) {
        return 'We have 6 active student clubs: Tech, Cultural, Sports, Music, Art, and Photography. Visit the Clubs section to explore and join!';
    } 
    
    // Time/hours queries
    else if (msg.includes('hour') || msg.includes('time') || msg.includes('open') || msg.includes('close')) {
        return 'Campus hours are 8:00 AM - 6:00 PM. Library is open until 8:00 PM on weekdays and 2:00 PM on weekends.';
    } 
    
    // Contact queries
    else if (msg.includes('contact') || msg.includes('help') || msg.includes('support')) {
        return 'For assistance, contact the admin office at admin@klh.edu or call +91-XXX-XXX-XXXX during office hours.';
    } 
    
    // Location queries
    else if (msg.includes('where') || msg.includes('location') || msg.includes('find')) {
        return 'You can find locations for all campus facilities in the interactive map section. What specific location are you looking for?';
    } 
    
    // Greetings
    else if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
        return 'Hello! How can I assist you with campus information today?';
    } 
    
    // Thanks
    else if (msg.includes('thank') || msg.includes('thanks')) {
        return 'You\'re welcome! Let me know if you need anything else.';
    } 
    
    // Default response
    else {
        return 'I can help you with events, lost & found, feedback, clubs, campus hours, and general campus information. What would you like to know?';
    }
}

// Allow Enter key to send message
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
});
