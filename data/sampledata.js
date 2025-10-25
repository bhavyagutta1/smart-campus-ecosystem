// Sample Data for Smart Campus Portal

const sampleLostItems = [
    { item: 'Blue Backpack', category: 'Accessories', location: 'Library', status: 'Lost', date: '2025-10-20', contact: 'john@klh.edu' },
    { item: 'iPhone 13', category: 'Electronics', location: 'Cafeteria', status: 'Found', date: '2025-10-22', contact: 'admin@klh.edu' },
    { item: 'Physics Textbook', category: 'Books', location: 'Block A', status: 'Lost', date: '2025-10-24', contact: 'student@klh.edu' },
    { item: 'Black Wallet', category: 'Accessories', location: 'Sports Ground', status: 'Found', date: '2025-10-23', contact: 'faculty@klh.edu' }
];

const sampleEvents = [
    { 
        title: 'Tech Fest 2025', 
        date: '2025-11-05', 
        time: '10:00 AM', 
        location: 'Auditorium', 
        organizer: 'Tech Club', 
        description: 'Annual technology festival with coding competitions, hackathons, and tech talks.' 
    },
    { 
        title: 'Cultural Night', 
        date: '2025-11-10', 
        time: '06:00 PM', 
        location: 'Open Ground', 
        organizer: 'Cultural Committee', 
        description: 'Showcase of music, dance, and drama performances.' 
    },
    { 
        title: 'Career Fair', 
        date: '2025-11-15', 
        time: '09:00 AM', 
        location: 'Convention Hall', 
        organizer: 'Placement Cell', 
        description: 'Meet recruiters from top companies.' 
    }
];

const sampleFeedback = [
    { subject: 'Library Hours Extension', category: 'Facilities', priority: 'High', status: 'Pending', date: '2025-10-20' },
    { subject: 'WiFi Connectivity Issues', category: 'Infrastructure', priority: 'Medium', status: 'In Progress', date: '2025-10-22' },
    { subject: 'New Course Suggestions', category: 'Academic', priority: 'Low', status: 'Under Review', date: '2025-10-24' }
];

const sampleClubs = [
    { name: 'Tech Club', members: 150, icon: '💻', color: '#3b82f6' },
    { name: 'Cultural Club', members: 200, icon: '🎭', color: '#8b5cf6' },
    { name: 'Sports Club', members: 180, icon: '⚽', color: '#10b981' },
    { name: 'Music Club', members: 120, icon: '🎵', color: '#f59e0b' },
    { name: 'Art Club', members: 95, icon: '🎨', color: '#ec4899' },
    { name: 'Photography Club', members: 110, icon: '📸', color: '#06b6d4' }
];

const sampleNotifications = [
    { 
        title: 'Event Reminder: Tech Fest', 
        message: 'Tech Fest 2025 is happening in 10 days!', 
        time: '2 hours ago', 
        unread: true, 
        icon: '📅', 
        color: '#3b82f6' 
    },
    { 
        title: 'Lost Item Found', 
        message: 'Your reported item "Blue Backpack" might have been found.', 
        time: '5 hours ago', 
        unread: true, 
        icon: '📦', 
        color: '#10b981' 
    },
    { 
        title: 'New Announcement', 
        message: 'Campus will be closed on 28th Oct for maintenance.', 
        time: '1 day ago', 
        unread: false, 
        icon: '📢', 
        color: '#f59e0b' 
    }
];
