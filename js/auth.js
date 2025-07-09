// Authentication and form handling for Staxiom

document.addEventListener('DOMContentLoaded', function() {
    // Check which form we're on
    const registrationForm = document.getElementById('registrationForm');
    const signinForm = document.getElementById('signinForm');
    const googleBtn = document.querySelector('.social-btn') || document.getElementById('googleSignIn');
    
    // Form elements
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const termsCheckbox = document.getElementById('terms');

    // Registration form submission
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            if (!validateRegistrationForm()) {
                return;
            }

            // Store user data (in real app, this would be sent to server)
            const userData = {
                name: nameInput.value,
                email: emailInput.value,
                timestamp: new Date().toISOString()
            };
            
            localStorage.setItem('staxiom_user', JSON.stringify(userData));
            
            // Redirect to company info page
            window.location.href = 'pages/company-info.html';
        });
    }

    // Sign-in form submission
    if (signinForm) {
        signinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            if (!validateSigninForm()) {
                return;
            }

            // In a real app, this would authenticate with server
            // For demo, we'll just check if email exists
            const userData = {
                email: emailInput.value,
                timestamp: new Date().toISOString()
            };
            
            localStorage.setItem('staxiom_user', JSON.stringify(userData));
            
            // Redirect to company info page
            window.location.href = 'pages/company-info.html';
        });
    }

    // Google OAuth simulation
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            // In production, this would initiate actual OAuth flow
            console.log('Google OAuth would be initiated here');
            
            // For demo purposes, simulate successful auth
            const mockGoogleUser = {
                name: 'Google User',
                email: 'user@gmail.com',
                timestamp: new Date().toISOString(),
                authMethod: 'google'
            };
            
            localStorage.setItem('staxiom_user', JSON.stringify(mockGoogleUser));
            
            // Show loading state
            googleBtn.disabled = true;
            googleBtn.textContent = 'Signing in...';
            
            // Simulate API call delay
            setTimeout(() => {
                window.location.href = 'pages/company-info.html';
            }, 1500);
        });
    }

    // Registration form validation
    function validateRegistrationForm() {
        let isValid = true;
        
        // Clear previous errors
        clearErrors();
        
        // Name validation
        if (!nameInput.value.trim()) {
            showError(nameInput, 'Please enter your name');
            isValid = false;
        }
        
        // Email validation
        if (!emailInput.value.trim()) {
            showError(emailInput, 'Please enter your email');
            isValid = false;
        } else if (!isValidEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email');
            isValid = false;
        }
        
        // Password validation
        if (!passwordInput.value) {
            showError(passwordInput, 'Please create a password');
            isValid = false;
        } else if (passwordInput.value.length < 8) {
            showError(passwordInput, 'Password must be at least 8 characters');
            isValid = false;
        }
        
        // Terms validation
        if (!termsCheckbox.checked) {
            showError(termsCheckbox.parentElement, 'You must agree to the terms');
            isValid = false;
        }
        
        return isValid;
    }

    // Sign-in form validation
    function validateSigninForm() {
        let isValid = true;
        
        // Clear previous errors
        clearErrors();
        
        // Email validation
        if (!emailInput.value.trim()) {
            showError(emailInput, 'Please enter your email');
            isValid = false;
        } else if (!isValidEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email');
            isValid = false;
        }
        
        // Password validation
        if (!passwordInput.value) {
            showError(passwordInput, 'Please enter your password');
            isValid = false;
        }
        
        return isValid;
    }

    // Email validation regex
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Show error message
    function showError(element, message) {
        const formGroup = element.closest('.form-group') || element.closest('.checkbox-group');
        if (formGroup) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            formGroup.appendChild(errorDiv);
            element.classList.add('error');
        }
    }

    // Clear all error messages
    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    }

    // Real-time validation
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !isValidEmail(this.value)) {
                clearErrors();
                showError(this, 'Please enter a valid email');
            }
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            if (this.value && this.value.length < 8) {
                this.style.borderColor = 'var(--error-color)';
            } else {
                this.style.borderColor = '';
            }
        });
    }
});