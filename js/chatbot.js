// Chatbot Functionality with Gemini AI

const GEMINI_API_KEY = 'AIzaSyDK2M4YWtEzdlipJp-SEqSsz2IBse3v8Io';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

function toggleChatbot() {
    const chatWindow = document.getElementById('chatbotWindow');
    chatWindow.classList.toggle('active');
    
    // Focus on input when opening
    if (chatWindow.classList.contains('active')) {
        document.getElementById('chatInput').focus();
    }
}

async function sendChatMessage() {
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

    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chat-message bot typing-indicator';
    typingIndicator.id = 'typingIndicator';
    typingIndicator.innerHTML = '<span></span><span></span><span></span>';
    messagesContainer.appendChild(typingIndicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Get AI response
    try {
        const response = await getGeminiResponse(message);
        
        // Remove typing indicator
        document.getElementById('typingIndicator')?.remove();
        
        // Add bot response
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'chat-message bot';
        botMessageDiv.textContent = response;
        messagesContainer.appendChild(botMessageDiv);
    } catch (error) {
        document.getElementById('typingIndicator')?.remove();
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'chat-message bot';
        botMessageDiv.textContent = 'Sorry, I encountered an error. ' + getFallbackResponse(message);
        messagesContainer.appendChild(botMessageDiv);
        console.error('Chatbot error:', error);
    }

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function getGeminiResponse(userMessage) {
    // Create context-aware prompt for campus assistant
    const systemPrompt = `You are a helpful campus assistant for KLH University's Smart Campus Portal. 
You help students, faculty, and staff with:
- Campus events and activities
- Lost and found items
- Feedback and grievances
- Student clubs and organizations (Tech Club, Cultural Club, Sports Club, Music Club, Art Club, Photography Club)
- Campus facilities and services
- General campus information

Be friendly, concise, and helpful. Keep responses brief (2-3 sentences).

Current campus info:
- Upcoming events: Tech Fest 2025 (Nov 5), Cultural Night (Nov 10), Career Fair (Nov 15), Sports Day (Nov 8), Hackathon (Nov 12), Music Concert (Nov 20)
- Active clubs: 6 clubs with 95-200 members each
- Campus hours: 8 AM - 6 PM (Library until 8 PM)

User question: ${userMessage}`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: systemPrompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 200,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        return aiResponse;
    } catch (error) {
        console.error('Gemini API Error:', error);
        // Fallback to simple responses if API fails
        return getFallbackResponse(userMessage);
    }
}

function getFallbackResponse(message) {
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
