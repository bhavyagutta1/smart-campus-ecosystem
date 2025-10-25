// Authentication and User Management

let currentUser = {
    role: 'student',
    name: 'John Doe',
    email: 'john@klh.edu'
};

// Login Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
});

function handleLogin() {
    const role = document.getElementById('userRole').value;
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simple validation (in production, this would be server-side)
    if (email && password) {
        currentUser.role = role;
        currentUser.email = email;
        currentUser.name = getRoleDisplayName(role);
        
        login();
    } else {
        alert('Please enter valid credentials');
    }
}

function getRoleDisplayName(role) {
    const names = {
        'student': 'Student User',
        'faculty': 'Faculty Member',
        'admin': 'Administrator'
    };
    return names[role] || 'User';
}

function login() {
    // Hide login page, show dashboard
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('dashboardPage').classList.remove('hidden');
    document.getElementById('chatbotToggle').style.display = 'flex';
    
    // Update user info in navbar
    updateUserInfo();
    
    // Load dashboard data
    if (typeof loadDashboard === 'function') {
        loadDashboard();
    }
}

function logout() {
    // Show login page, hide dashboard
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('dashboardPage').classList.add('hidden');
    document.getElementById('chatbotToggle').style.display = 'none';
    
    // Reset form
    document.getElementById('loginForm').reset();
    
    // Reset user data
    currentUser = {
        role: 'student',
        name: 'John Doe',
        email: 'john@klh.edu'
    };
}

function updateUserInfo() {
    const avatar = currentUser.name.charAt(0).toUpperCase();
    document.getElementById('userAvatar').textContent = avatar;
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('welcomeName').textContent = currentUser.name;
}

// Check user role for permissions
function hasPermission(action) {
    const permissions = {
        'student': ['view', 'submit'],
        'faculty': ['view', 'submit', 'create', 'edit'],
        'admin': ['view', 'submit', 'create', 'edit', 'delete', 'manage']
    };
    
    return permissions[currentUser.role]?.includes(action) || false;
}
