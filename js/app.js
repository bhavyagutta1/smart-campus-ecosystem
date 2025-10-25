// Main Application Logic

// Load dashboard when page is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize form handlers
    initializeFormHandlers();
});

const API_BASE = window.API_BASE || ''; // set to '' to use relative URL (e.g. http://localhost:4000)

function loadDashboard() {
    loadStats();
    loadModules();
    loadLostFound();
    loadEvents();
    loadFeedback();
    loadClubs();
    loadNotifications();
    startRealTimeUpdates();
}

function loadStats() {
    const stats = {
        student: [
            { value: '12', label: 'My Events' },
            { value: '3', label: 'Clubs Joined' },
            { value: '5', label: 'Pending Tasks' }
        ],
        faculty: [
            { value: '45', label: 'Total Students' },
            { value: '8', label: 'Courses' },
            { value: '15', label: 'Events Organized' }
        ],
        admin: [
            { value: '1,250', label: 'Total Students' },
            { value: '85', label: 'Faculty Members' },
            { value: '32', label: 'Active Events' }
        ]
    };

    const statsGrid = document.getElementById('statsGrid');
    statsGrid.innerHTML = stats[currentUser.role].map(stat => `
        <div class="stat-card">
            <h3>${stat.value}</h3>
            <p>${stat.label}</p>
        </div>
    `).join('');
}

function loadModules() {
    const modules = [
        { name: 'Lost & Found', icon: '📦', color: '#3b82f6', action: 'showLostFound' },
        { name: 'Events', icon: '📅', color: '#8b5cf6', action: 'showEvents' },
        { name: 'Feedback', icon: '💬', color: '#10b981', action: 'showFeedback' },
        { name: 'Clubs', icon: '🎯', color: '#f59e0b', action: 'showClubs' }
    ];

    const modulesGrid = document.getElementById('modulesGrid');
    modulesGrid.innerHTML = modules.map(module => `
        <div class="module-card" onclick="${module.action}()">
            <div class="module-icon" style="background: ${module.color}20; color: ${module.color};">
                ${module.icon}
            </div>
            <h3>${module.name}</h3>
            <p>Manage campus ${module.name.toLowerCase()}</p>
        </div>
    `).join('');
}

async function loadLostFound() {
    const table = document.getElementById('lostFoundTable');

    if (API_BASE) {
        try {
            const res = await fetch(`${API_BASE}/api/lostitems`);
            if (res.ok) {
                const items = await res.json();
                table.innerHTML = items.map(item => `
                    <tr>
                        <td>${item.item}</td>
                        <td>${item.category}</td>
                        <td>${item.location}</td>
                        <td><span class="status-badge status-${item.status === 'Found' ? 'found' : 'pending'}">${item.status}</span></td>
                        <td>${item.date}</td>
                        <td>${item.contact}</td>
                    </tr>
                `).join('');
                return;
            }
        } catch (e) {
            console.warn('API loadLostFound failed, falling back to sample data', e);
        }
    }

    // Fallback to client-side sample data
    table.innerHTML = sampleLostItems.map(item => `
        <tr>
            <td>${item.item}</td>
            <td>${item.category}</td>
            <td>${item.location}</td>
            <td><span class="status-badge status-${item.status === 'Found' ? 'found' : 'pending'}">${item.status}</span></td>
            <td>${item.date}</td>
            <td>${item.contact}</td>
        </tr>
    `).join('');
}

async function loadEvents() {
    const container = document.getElementById('eventsContainer');

    if (API_BASE) {
        try {
            const res = await fetch(`${API_BASE}/api/events`);
            if (res.ok) {
                const events = await res.json();
                container.innerHTML = events.map(event => `
                    <div class="event-card">
                        <div class="event-header">
                            <div>
                                <div class="event-title">${event.title}</div>
                                <div class="event-date">📅 ${event.date} at ${event.time}</div>
                            </div>
                            <span class="status-badge status-active">Upcoming</span>
                        </div>
                        <p style="color: var(--color-text-light); margin-bottom: 0.5rem;">${event.description}</p>
                        <div class="event-meta">
                            <span>📍 ${event.location}</span>
                            <span>👤 ${event.organizer}</span>
                        </div>
                    </div>
                `).join('');
                return;
            }
        } catch (e) {
            console.warn('API loadEvents failed, falling back to sample data', e);
        }
    }

    container.innerHTML = sampleEvents.map(event => `
        <div class="event-card">
            <div class="event-header">
                <div>
                    <div class="event-title">${event.title}</div>
                    <div class="event-date">📅 ${event.date} at ${event.time}</div>
                </div>
                <span class="status-badge status-active">Upcoming</span>
            </div>
            <p style="color: var(--color-text-light); margin-bottom: 0.5rem;">${event.description}</p>
            <div class="event-meta">
                <span>📍 ${event.location}</span>
                <span>👤 ${event.organizer}</span>
            </div>
        </div>
    `).join('');

    // Show create button only for faculty and admin
    const createBtn = document.getElementById('createEventBtn');
    if (createBtn) {
        createBtn.style.display = currentUser.role === 'student' ? 'none' : 'block';
    }
}

async function loadFeedback() {
    const table = document.getElementById('feedbackTable');

    if (API_BASE) {
        try {
            const res = await fetch(`${API_BASE}/api/feedback`);
            if (res.ok) {
                const items = await res.json();
                table.innerHTML = items.map(item => `
                    <tr>
                        <td>${item.subject}</td>
                        <td>${item.category}</td>
                        <td>${item.priority}</td>
                        <td><span class="status-badge status-pending">${item.status}</span></td>
                        <td>${item.date}</td>
                    </tr>
                `).join('');
                return;
            }
        } catch (e) {
            console.warn('API loadFeedback failed, falling back to sample data', e);
        }
    }

    table.innerHTML = sampleFeedback.map(item => `
        <tr>
            <td>${item.subject}</td>
            <td>${item.category}</td>
            <td>${item.priority}</td>
            <td><span class="status-badge status-pending">${item.status}</span></td>
            <td>${item.date}</td>
        </tr>
    `).join('');
}

async function loadClubs() {
    const grid = document.getElementById('clubsGrid');

    if (API_BASE) {
        try {
            const res = await fetch(`${API_BASE}/api/clubs`);
            if (res.ok) {
                const clubs = await res.json();
                grid.innerHTML = clubs.map(club => `
                    <div class="module-card">
                        <div class="module-icon" style="background: ${club.color}20; color: ${club.color};">
                            ${club.icon}
                        </div>
                        <h3>${club.name}</h3>
                        <p>${club.members} members</p>
                        <button class="btn btn-primary btn-sm" style="margin-top: 1rem;" onclick="joinClub('${club.name}')">Join Club</button>
                    </div>
                `).join('');
                return;
            }
        } catch (e) {
            console.warn('API loadClubs failed, falling back to sample data', e);
        }
    }

    grid.innerHTML = sampleClubs.map(club => `
        <div class="module-card">
            <div class="module-icon" style="background: ${club.color}20; color: ${club.color};">
                ${club.icon}
            </div>
            <h3>${club.name}</h3>
            <p>${club.members} members</p>
            <button class="btn btn-primary btn-sm" style="margin-top: 1rem;" onclick="joinClub('${club.name}')">Join Club</button>
        </div>
    `).join('');
}

async function loadNotifications() {
    const container = document.getElementById('notificationsContainer');

    if (API_BASE) {
        try {
            const res = await fetch(`${API_BASE}/api/notifications`);
            if (res.ok) {
                const notifs = await res.json();
                container.innerHTML = notifs.map(notif => `
                    <div class="notification-item ${notif.unread ? 'unread' : ''}">
                        <div class="notification-icon" style="background: ${notif.color}20; color: ${notif.color};">
                            ${notif.icon}
                        </div>
                        <div class="notification-content" style="flex: 1;">
                            <h4>${notif.title}</h4>
                            <p>${notif.message}</p>
                            <span class="notification-time">${notif.time}</span>
                        </div>
                    </div>
                `).join('');

                const unreadCount = notifs.filter(n => n.unread).length;
                document.getElementById('notifBadge').textContent = unreadCount;
                return;
            }
        } catch (e) {
            console.warn('API loadNotifications failed, falling back to sample data', e);
        }
    }

    container.innerHTML = sampleNotifications.map(notif => `
        <div class="notification-item ${notif.unread ? 'unread' : ''}">
            <div class="notification-icon" style="background: ${notif.color}20; color: ${notif.color};">
                ${notif.icon}
            </div>
            <div class="notification-content" style="flex: 1;">
                <h4>${notif.title}</h4>
                <p>${notif.message}</p>
                <span class="notification-time">${notif.time}</span>
            </div>
        </div>
    `).join('');

    const unreadCount = sampleNotifications.filter(n => n.unread).length;
    document.getElementById('notifBadge').textContent = unreadCount;
}

// Navigation Functions
function showDashboard() {
    hideAllSections();
    document.getElementById('mainDashboard').classList.remove('hidden');
}

function showLostFound() {
    hideAllSections();
    document.getElementById('lostFoundSection').classList.remove('hidden');
}

function showEvents() {
    hideAllSections();
    document.getElementById('eventsSection').classList.remove('hidden');
}

function showFeedback() {
    hideAllSections();
    document.getElementById('feedbackSection').classList.remove('hidden');
}

function showClubs() {
    hideAllSections();
    document.getElementById('clubsSection').classList.remove('hidden');
}

function showNotifications() {
    hideAllSections();
    document.getElementById('notificationsSection').classList.remove('hidden');
}

function hideAllSections() {
    document.getElementById('mainDashboard').classList.add('hidden');
    document.getElementById('lostFoundSection').classList.add('hidden');
    document.getElementById('eventsSection').classList.add('hidden');
    document.getElementById('feedbackSection').classList.add('hidden');
    document.getElementById('clubsSection').classList.add('hidden');
    document.getElementById('notificationsSection').classList.add('hidden');
}

// Form Toggle Functions
function showReportItemForm() {
    document.getElementById('reportItemForm').classList.toggle('hidden');
}

function showCreateEventForm() {
    document.getElementById('createEventForm').classList.toggle('hidden');
}

function showFeedbackForm() {
    document.getElementById('feedbackFormContainer').classList.toggle('hidden');
}

// Initialize Form Handlers
function initializeFormHandlers() {
    // Lost & Found Form
    const lostFoundForm = document.getElementById('lostFoundForm');
    if (lostFoundForm) {
        lostFoundForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const itemType = this.querySelector('select').value;
            const itemName = this.querySelectorAll('input[type="text"]')[0].value;
            const itemCategory = this.querySelectorAll('select')[1].value;
            const itemLocation = this.querySelectorAll('input[type="text"]')[1].value;
            
            // Create new item
            const newItem = {
                item: itemName,
                category: itemCategory,
                location: itemLocation,
                status: itemType === 'lost' ? 'Lost' : 'Found',
                date: new Date().toISOString().split('T')[0],
                contact: currentUser.email
            };
            
            // Add to beginning of array so it shows first
            sampleLostItems.unshift(newItem);
            
            // If API is available, also save to backend
            if (API_BASE) {
                fetch(`${API_BASE}/api/lostitems`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newItem)
                }).catch(err => console.log('API save failed, using local data only'));
            }
            
            alert('Item reported successfully! You will be notified when there is an update.');
            this.reset();
            showReportItemForm();
            loadLostFound();
        });
    }

    // Event Form
    const eventForm = document.getElementById('eventForm');
    if (eventForm) {
        eventForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const newEvent = {
                title: this.querySelectorAll('input[type="text"]')[0].value,
                date: this.querySelector('input[type="date"]').value,
                time: this.querySelector('input[type="time"]').value,
                location: this.querySelectorAll('input[type="text"]')[1].value,
                organizer: currentUser.name,
                description: this.querySelector('textarea').value
            };
            
            // Add to beginning of array
            sampleEvents.unshift(newEvent);
            
            // If API is available, also save to backend
            if (API_BASE) {
                fetch(`${API_BASE}/api/events`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newEvent)
                }).catch(err => console.log('API save failed, using local data only'));
            }
            
            alert('Event created successfully! Notifications will be sent to all users.');
            this.reset();
            showCreateEventForm();
            loadEvents();
        });
    }

    // Feedback Form
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const newFeedback = {
                subject: this.querySelectorAll('input[type="text"]')[0].value,
                category: this.querySelectorAll('select')[0].value,
                priority: this.querySelectorAll('select')[1].value,
                status: 'Pending',
                date: new Date().toISOString().split('T')[0]
            };
            
            // Add to beginning of array
            sampleFeedback.unshift(newFeedback);
            
            // If API is available, also save to backend
            if (API_BASE) {
                fetch(`${API_BASE}/api/feedback`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newFeedback)
                }).catch(err => console.log('API save failed, using local data only'));
            }
            
            alert('Feedback submitted successfully! We will review it shortly.');
            this.reset();
            showFeedbackForm();
            loadFeedback();
        });
    }
}

// Club Actions
function joinClub(clubName) {
    alert(`Successfully joined ${clubName}! You will receive updates about club activities.`);
}

// Real-time Updates Simulation
function startRealTimeUpdates() {
    setInterval(() => {
        // Simulate real-time notifications
        const currentBadge = parseInt(document.getElementById('notifBadge').textContent);
        // Randomly show new notifications for demo (5% chance every 5 seconds)
        if (Math.random() > 0.95) {
            document.getElementById('notifBadge').textContent = currentBadge + 1;
        }
    }, 5000);
}
