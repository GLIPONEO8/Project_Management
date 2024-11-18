// User storage in localStorage
const users = JSON.parse(localStorage.getItem('users')) || {};

// Switch between login and register forms
function switchForm(formId) {
    document.getElementById('registerForm').style.display = 
        formId === 'registerForm' ? 'block' : 'none';
    document.getElementById('loginForm').style.display = 
        formId === 'loginForm' ? 'block' : 'none';
    
    // Reset forms and hide messages
    document.querySelectorAll('form').forEach(form => form.reset());
    document.querySelectorAll('.error, .success-message').forEach(
        el => el.style.display = 'none'
    );
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === 'password' ? 'text' : 'password';
}

// Check password strength
function checkPasswordStrength(password) {
    let strength = 0;
    const requirements = [
        password.length >= 8,
        /[A-Z]/.test(password),
        /[a-z]/.test(password),
        /[0-9]/.test(password),
        /[^A-Za-z0-9]/.test(password)
    ];
    
    strength = requirements.filter(Boolean).length;
    
    const meter = document.getElementById('strengthMeter');
    const percentage = (strength / 5) * 100;
    meter.style.width = `${percentage}%`;
    
    if (strength <= 2) {
        meter.style.backgroundColor = '#dc3545';
    } else if (strength <= 4) {
        meter.style.backgroundColor = '#ffc107';
    } else {
        meter.style.backgroundColor = '#28a745';
    }
    
    return strength;
}

// Handle registration
function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    // Reset error messages
    document.querySelectorAll('.error').forEach(el => el.style.display = 'none');
    
    // Check if username exists
    if (users[username]) {
        document.getElementById('usernameError').style.display = 'block';
        return false;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
        document.getElementById('passwordError').style.display = 'block';
        return false;
    }
    
    // Check password strength
    if (checkPasswordStrength(password) < 4) {
        alert('Password is not strong enough. Please follow the requirements.');
        return false;
    }
    
    // Store user
    users[username] = {
        password: password, // In a real app, this should be hashed
        created: new Date().toISOString()
    };
    localStorage.setItem('users', JSON.stringify(users));
    
    // Show success message
    document.getElementById('registerSuccess').style.display = 'block';
    setTimeout(() => switchForm('loginForm'), 1500);
    
    return false;
}

// Handle login
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    // Reset error message
    document.getElementById('loginError').style.display = 'none';
    
    // Check credentials
    if (users[username]?.password === password) {
        document.getElementById('loginSuccess').style.display = 'block';
        // Redirect to dashboard.html after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
    
    return false;
}

// Add password strength meter functionality
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('regPassword').addEventListener('input', function(e) {
        checkPasswordStrength(e.target.value);
    });
});
