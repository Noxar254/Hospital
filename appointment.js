// Appointment Page JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize appointment form
    initializeAppointmentForm();
    
    // Set minimum date to today
    setMinimumDate();
    
    // Handle form validation
    setupFormValidation();
    
    // Handle form submission
    setupFormSubmission();
    
    // Handle telemedicine consent visibility
    setupTelemedicineConsentVisibility();
    
    // Handle urgency color coding
    setupUrgencyColorCoding();
});

// Initialize appointment form
function initializeAppointmentForm() {
    console.log('Appointment form initialized');
    
    // Auto-focus first input
    const firstInput = document.getElementById('firstName');
    if (firstInput) {
        firstInput.focus();
    }
    
    // Format phone inputs
    setupPhoneInputs();
    
    // Setup date inputs
    setupDateInputs();
}

// Set minimum date to today for appointment booking
function setMinimumDate() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const dateInput = document.getElementById('preferredDate');
    const dobInput = document.getElementById('dateOfBirth');
    
    if (dateInput) {
        dateInput.min = tomorrow.toISOString().split('T')[0];
        
        // Set max date to 3 months from now
        const maxDate = new Date(today);
        maxDate.setMonth(today.getMonth() + 3);
        dateInput.max = maxDate.toISOString().split('T')[0];
    }
    
    if (dobInput) {
        // Set max date to today for date of birth
        dobInput.max = today.toISOString().split('T')[0];
        
        // Set min date to 120 years ago
        const minDate = new Date(today);
        minDate.setFullYear(today.getFullYear() - 120);
        dobInput.min = minDate.toISOString().split('T')[0];
    }
}

// Setup phone input formatting
function setupPhoneInputs() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            // Remove all non-digit characters
            let value = e.target.value.replace(/\D/g, '');
            
            // Format for Kenyan phone numbers
            if (value.startsWith('254')) {
                value = '+' + value;
            } else if (value.startsWith('0')) {
                value = '+254' + value.substring(1);
            } else if (value.length > 0 && !value.startsWith('+')) {
                value = '+254' + value;
            }
            
            e.target.value = value;
        });
    });
}

// Setup date inputs
function setupDateInputs() {
    const preferredDate = document.getElementById('preferredDate');
    const preferredTime = document.getElementById('preferredTime');
    
    if (preferredDate) {
        preferredDate.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            const dayOfWeek = selectedDate.getDay();
            
            // Disable certain times on weekends
            if (preferredTime) {
                updateAvailableTimeSlots(dayOfWeek);
            }
        });
    }
}

// Update available time slots based on day of week
function updateAvailableTimeSlots(dayOfWeek) {
    const timeSelect = document.getElementById('preferredTime');
    const options = timeSelect.querySelectorAll('option');
    
    options.forEach(option => {
        if (option.value === '') return; // Skip placeholder option
        
        const time = option.value;
        const hour = parseInt(time.split(':')[0]);
        
        // Weekend restrictions (Saturday = 6, Sunday = 0)
        if (dayOfWeek === 0) { // Sunday
            // Sunday: Emergency only (limited hours)
            if (hour < 10 || hour > 16) {
                option.disabled = true;
                option.style.color = '#ccc';
            } else {
                option.disabled = false;
                option.style.color = '';
            }
        } else if (dayOfWeek === 6) { // Saturday
            // Saturday: Half day (morning only)
            if (hour > 13) {
                option.disabled = true;
                option.style.color = '#ccc';
            } else {
                option.disabled = false;
                option.style.color = '';
            }
        } else {
            // Weekdays: Full hours
            option.disabled = false;
            option.style.color = '';
        }
    });
}

// Setup telemedicine consent visibility
function setupTelemedicineConsentVisibility() {
    const appointmentType = document.getElementById('appointmentType');
    const telemedicineConsent = document.getElementById('telemedicineConsent').closest('.consent-item');
    
    if (appointmentType && telemedicineConsent) {
        appointmentType.addEventListener('change', function() {
            if (this.value === 'telemedicine' || this.value === 'phone-consultation') {
                telemedicineConsent.style.display = 'block';
                document.getElementById('telemedicineConsent').required = true;
            } else {
                telemedicineConsent.style.display = 'none';
                document.getElementById('telemedicineConsent').required = false;
            }
        });
        
        // Initial check
        appointmentType.dispatchEvent(new Event('change'));
    }
}

// Setup urgency color coding
function setupUrgencyColorCoding() {
    const urgencySelect = document.getElementById('urgency');
    
    if (urgencySelect) {
        urgencySelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const color = selectedOption.getAttribute('data-color');
            
            if (color) {
                this.style.color = color;
                this.style.fontWeight = '600';
            } else {
                this.style.color = '';
                this.style.fontWeight = '';
            }
            
            // Show urgency warning for urgent/emergency
            showUrgencyWarning(this.value);
        });
    }
}

// Show urgency warning
function showUrgencyWarning(urgencyLevel) {
    // Remove existing warning
    const existingWarning = document.querySelector('.urgency-warning');
    if (existingWarning) {
        existingWarning.remove();
    }
    
    if (urgencyLevel === 'urgent' || urgencyLevel === 'emergency') {
        const urgencyGroup = document.getElementById('urgency').closest('.form-group');
        const warning = document.createElement('div');
        warning.className = 'urgency-warning';
        warning.innerHTML = `
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 1rem; margin-top: 0.5rem; color: #dc2626;">
                <i class="fas fa-exclamation-triangle" style="margin-right: 0.5rem;"></i>
                ${urgencyLevel === 'emergency' 
                    ? '<strong>Emergency:</strong> For life-threatening situations, please call our emergency hotline immediately at <a href="tel:+254796780345" style="color: #dc2626; font-weight: bold;">+254 796 780 345</a> or dial 911.'
                    : '<strong>Urgent:</strong> We will prioritize your appointment and contact you within 2-4 hours to schedule.'}
            </div>
        `;
        urgencyGroup.appendChild(warning);
    }
}

// Setup form validation
function setupFormValidation() {
    const form = document.getElementById('appointmentForm');
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('invalid')) {
                validateField(this);
            }
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    field.classList.remove('invalid', 'valid');
    
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
    }
    
    // Email validation
    else if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }
    
    // Phone validation
    else if (fieldType === 'tel' && value) {
        const phoneRegex = /^\+254\d{9}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid Kenyan phone number (+254XXXXXXXXX).';
        }
    }
    
    // Date validation
    else if (fieldType === 'date' && value) {
        if (fieldName === 'preferredDate') {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate <= today) {
                isValid = false;
                errorMessage = 'Please select a future date.';
            }
        }
    }
    
    // Age validation for date of birth
    else if (fieldName === 'dateOfBirth' && value) {
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 0 || age > 120) {
            isValid = false;
            errorMessage = 'Please enter a valid date of birth.';
        }
    }
    
    if (isValid) {
        field.classList.add('valid');
    } else {
        field.classList.add('invalid');
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    field.parentNode.appendChild(errorDiv);
}

// Setup form submission
function setupFormSubmission() {
    const form = document.getElementById('appointmentForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all fields
            const isFormValid = validateForm();
            
            if (isFormValid) {
                submitAppointmentForm();
            } else {
                showFormErrors();
            }
        });
    }
}

// Validate entire form
function validateForm() {
    const form = document.getElementById('appointmentForm');
    const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Check required checkboxes
    const requiredCheckboxes = form.querySelectorAll('input[type="checkbox"][required]');
    requiredCheckboxes.forEach(checkbox => {
        if (!checkbox.checked) {
            isValid = false;
            const label = checkbox.closest('.consent-item');
            if (label) {
                label.style.borderColor = '#ef4444';
                label.style.backgroundColor = '#fef2f2';
            }
        } else {
            const label = checkbox.closest('.consent-item');
            if (label) {
                label.style.borderColor = '#e2e8f0';
                label.style.backgroundColor = '#f8fafc';
            }
        }
    });
    
    return isValid;
}

// Show form errors
function showFormErrors() {
    const firstError = document.querySelector('.invalid, .consent-item[style*="border-color: rgb(239, 68, 68)"]');
    if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Show general error message
    showNotification('Please correct the errors in the form before submitting.', 'error');
}

// Submit appointment form
function submitAppointmentForm() {
    const form = document.getElementById('appointmentForm');
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Booking Appointment...</span>';
    submitBtn.disabled = true;
    form.classList.add('form-loading');
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Collect form data
        const formData = new FormData(form);
        const appointmentData = {};
        
        for (let [key, value] of formData.entries()) {
            appointmentData[key] = value;
        }
        
        console.log('Appointment Data:', appointmentData);
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        form.classList.remove('form-loading');
        
    }, 2000);
}

// Show success message
function showSuccessMessage() {
    const successModal = document.createElement('div');
    successModal.className = 'success-modal';
    successModal.innerHTML = `
        <div class="success-modal-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Appointment Request Submitted!</h3>
            <p>Thank you for booking with Hopewell Hospital. We have received your appointment request and will contact you within 24 hours to confirm your appointment details.</p>
            <div class="success-details">
                <p><strong>What's Next?</strong></p>
                <ul>
                    <li>Check your email for a confirmation message</li>
                    <li>Our team will call you to confirm your appointment</li>
                    <li>You'll receive appointment reminders via SMS</li>
                </ul>
            </div>
            <div class="success-actions">
                <button onclick="closeSuccessModal()" class="success-btn">Continue</button>
                <a href="index.html" class="success-link">Return to Home</a>
            </div>
        </div>
        <div class="success-overlay" onclick="closeSuccessModal()"></div>
    `;
    
    document.body.appendChild(successModal);
    
    // Add CSS for modal
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .success-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        }
        
        .success-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
        }
        
        .success-modal-content {
            background: white;
            border-radius: 20px;
            padding: 3rem 2rem;
            max-width: 500px;
            width: 100%;
            text-align: center;
            position: relative;
            z-index: 1;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        }
        
        .success-icon {
            font-size: 4rem;
            color: #10b981;
            margin-bottom: 1rem;
        }
        
        .success-modal-content h3 {
            color: var(--primary-blue);
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }
        
        .success-modal-content p {
            color: var(--gray-dark);
            line-height: 1.6;
            margin-bottom: 1.5rem;
        }
        
        .success-details {
            background: #f0f9ff;
            padding: 1.5rem;
            border-radius: 12px;
            margin-bottom: 2rem;
            text-align: left;
        }
        
        .success-details ul {
            margin-top: 0.5rem;
            padding-left: 1.5rem;
        }
        
        .success-details li {
            margin-bottom: 0.5rem;
        }
        
        .success-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .success-btn {
            background: var(--primary-blue);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .success-btn:hover {
            background: var(--secondary-blue);
        }
        
        .success-link {
            color: var(--primary-blue);
            text-decoration: none;
            padding: 1rem 2rem;
            font-weight: 600;
        }
        
        .success-link:hover {
            text-decoration: underline;
        }
    `;
    document.head.appendChild(modalStyles);
}

// Close success modal
function closeSuccessModal() {
    const modal = document.querySelector('.success-modal');
    if (modal) {
        modal.remove();
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add notification styles
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 1rem;
            z-index: 9999;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            animation: slideIn 0.3s ease;
        }
        
        .notification-error {
            border-left: 4px solid #ef4444;
        }
        
        .notification-info {
            border-left: 4px solid #3b82f6;
        }
        
        .notification-content {
            padding: 1rem 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .notification-error .notification-content i {
            color: #ef4444;
        }
        
        .notification-info .notification-content i {
            color: #3b82f6;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(notificationStyles);
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Make closeSuccessModal globally available
window.closeSuccessModal = closeSuccessModal;
