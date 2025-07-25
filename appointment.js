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
    
    // Setup WhatsApp booking
    setupWhatsAppBooking();
    
    // Handle URL parameters for service pre-selection
    handleServicePreSelection();
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

// Setup WhatsApp booking functionality
function setupWhatsAppBooking() {
    const whatsappBtn = document.getElementById('whatsappBookingBtn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function() {
            const message = generateWhatsAppMessage();
            const phoneNumber = '+254796780345'; // Hospital's WhatsApp number
            const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    }
}

// Generate custom WhatsApp message based on service and form data
function generateWhatsAppMessage() {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceType = urlParams.get('service');
    
    // Get form data if available
    const firstName = document.getElementById('firstName')?.value || '';
    const lastName = document.getElementById('lastName')?.value || '';
    const phone = document.getElementById('phone')?.value || '';
    const department = document.getElementById('department')?.value || '';
    const appointmentType = document.getElementById('appointmentType')?.value || '';
    const reasonForVisit = document.getElementById('reasonForVisit')?.value || '';
    
    let message = '';
    
    // Service-specific message templates
    switch(serviceType) {
        case 'outpatient':
            message = `Hello Hopewell Hospital! 👋\n\nI would like to book an Out-Patient consultation.\n\n`;
            break;
        case 'obs-gynecology':
            message = `Hello Hopewell Hospital! 👋\n\nI would like to schedule an OBS & Gynecology appointment.\n\n`;
            break;
        case 'dental':
            message = `Hello Hopewell Hospital! 👋\n\nI would like to book a Dental Services appointment.\n\n`;
            break;
        case 'pediatrics':
            message = `Hello Hopewell Hospital! 👋\n\nI would like to schedule a Pediatrics consultation for my child.\n\n`;
            break;
        case 'inpatient':
            message = `Hello Hopewell Hospital! 👋\n\nI need information about In-Patient Care services.\n\n`;
            break;
        case 'minor-surgery':
            message = `Hello Hopewell Hospital! 👋\n\nI would like to schedule a Minor Surgery consultation.\n\n`;
            break;
        case 'psychiatrist':
            message = `Hello Hopewell Hospital! 👋\n\nI would like to book a consultation with Dr. Sarah Mitchell (Psychiatrist).\n\n`;
            break;
        case 'psychologist':
            message = `Hello Hopewell Hospital! 👋\n\nI would like to schedule an appointment with Dr. James Anderson (Psychologist).\n\n`;
            break;
        case 'therapist':
            message = `Hello Hopewell Hospital! 👋\n\nI would like to book a therapy session with Maria Rodriguez (Therapist).\n\n`;
            break;
        case 'counsellor':
            message = `Hello Hopewell Hospital! 👋\n\nI would like to schedule counselling with Michael Thompson (Counsellor).\n\n`;
            break;
        case 'home-consultation':
            message = `Hello Hopewell Hospital! 👋\n\nI would like to schedule a Home Consultation service.\n\n`;
            break;
        case 'home-counselling':
            message = `Hello Hopewell Hospital! 👋\n\nI would like to book Couple Home Counselling services.\n\n`;
            break;
        case 'home-imaging':
            message = `Hello Hopewell Hospital! 👋\n\nI would like to schedule Home Imaging & Test Scans services.\n\n`;
            break;
        case 'home-lab-tests':
            message = `Hello Hopewell Hospital! 👋\n\nI would like to book Home Lab Tests services.\n\n`;
            break;
        case 'home-nursing':
            message = `Hello Hopewell Hospital! 👋\n\nI would like to schedule Home Nursing Care services.\n\n`;
            break;
        case 'drug-delivery':
            message = `Hello Hopewell Hospital! 👋\n\nI would like to request Drug Delivery services.\n\n`;
            break;
        default:
            message = `Hello Hopewell Hospital! 👋\n\nI would like to book an appointment.\n\n`;
    }
    
    // Add patient details if available
    if (firstName || lastName) {
        message += `👤 **Patient Details:**\n`;
        message += `Name: ${firstName} ${lastName}\n`;
        if (phone) message += `Phone: ${phone}\n`;
        message += `\n`;
    }
    
    // Add appointment preferences if available
    if (department || appointmentType) {
        message += `📅 **Appointment Preferences:**\n`;
        if (department) message += `Department: ${department}\n`;
        if (appointmentType) message += `Type: ${appointmentType}\n`;
        message += `\n`;
    }
    
    // Add reason for visit if available
    if (reasonForVisit) {
        message += `📋 **Reason for Visit:**\n${reasonForVisit}\n\n`;
    }
    
    // Add professional closing
    message += `I would appreciate if someone could get back to me to confirm the appointment details and timing.\n\n`;
    message += `Thank you! 🙏\n\n`;
    message += `*This message was sent via Hopewell Hospital's appointment booking system.*`;
    
    return message;
}

// Handle service pre-selection from URL parameters
function handleServicePreSelection() {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceType = urlParams.get('service');
    
    if (serviceType) {
        // Pre-select department based on service
        const departmentSelect = document.getElementById('department');
        if (departmentSelect) {
            switch(serviceType) {
                case 'outpatient':
                    departmentSelect.value = 'general-medicine';
                    break;
                case 'obs-gynecology':
                    departmentSelect.value = 'obs-gynecology';
                    break;
                case 'dental':
                    departmentSelect.value = 'dental';
                    break;
                case 'pediatrics':
                    departmentSelect.value = 'pediatrics';
                    break;
                case 'psychiatrist':
                case 'psychologist':
                case 'therapist':
                case 'counsellor':
                    departmentSelect.value = 'mental-health';
                    break;
                case 'inpatient':
                    departmentSelect.value = 'general-medicine';
                    break;
                case 'minor-surgery':
                    departmentSelect.value = 'general-medicine';
                    break;
                case 'home-consultation':
                case 'home-counselling':
                case 'home-imaging':
                case 'home-lab-tests':
                case 'home-nursing':
                case 'drug-delivery':
                    // For home services, set appointment type to home visit
                    const appointmentTypeSelect = document.getElementById('appointmentType');
                    if (appointmentTypeSelect) {
                        appointmentTypeSelect.value = 'home-visit';
                    }
                    departmentSelect.value = 'general-medicine';
                    break;
            }
        }
        
        // Pre-fill reason for visit with service-specific placeholder
        const reasonTextarea = document.getElementById('reasonForVisit');
        if (reasonTextarea && !reasonTextarea.value) {
            switch(serviceType) {
                case 'outpatient':
                    reasonTextarea.placeholder = 'Please describe your symptoms or health concerns for the consultation...';
                    break;
                case 'obs-gynecology':
                    reasonTextarea.placeholder = 'Please describe your gynecological or maternity care needs...';
                    break;
                case 'dental':
                    reasonTextarea.placeholder = 'Please describe your dental concerns or treatment needs...';
                    break;
                case 'pediatrics':
                    reasonTextarea.placeholder = 'Please describe your child\'s symptoms or health concerns...';
                    break;
                case 'psychiatrist':
                    reasonTextarea.placeholder = 'Please describe your mental health concerns or symptoms...';
                    break;
                case 'psychologist':
                    reasonTextarea.placeholder = 'Please describe what you would like to discuss in therapy...';
                    break;
                case 'therapist':
                    reasonTextarea.placeholder = 'Please describe your therapeutic needs or goals...';
                    break;
                case 'counsellor':
                    reasonTextarea.placeholder = 'Please describe what you would like counselling support for...';
                    break;
                case 'home-consultation':
                    reasonTextarea.placeholder = 'Please describe your medical needs for the home consultation...';
                    break;
                case 'home-counselling':
                    reasonTextarea.placeholder = 'Please describe your relationship counselling needs...';
                    break;
                case 'home-imaging':
                    reasonTextarea.placeholder = 'Please specify what type of imaging or scans you need...';
                    break;
                case 'home-lab-tests':
                    reasonTextarea.placeholder = 'Please specify what lab tests you need...';
                    break;
                case 'home-nursing':
                    reasonTextarea.placeholder = 'Please describe your nursing care needs...';
                    break;
                case 'drug-delivery':
                    reasonTextarea.placeholder = 'Please list the medications you need delivered...';
                    break;
            }
        }
    }
}

// Setup WhatsApp booking functionality
function setupWhatsAppBooking() {
    const whatsappBtn = document.getElementById('whatsappBookingBtn');
    
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function() {
            const message = generateWhatsAppMessage();
            const phoneNumber = '+254796780345'; // Hospital WhatsApp number
            const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
            
            window.open(whatsappUrl, '_blank');
        });
    }
}

// Generate WhatsApp message based on selected service and form data
function generateWhatsAppMessage() {
    const urlParams = new URLSearchParams(window.location.search);
    const service = urlParams.get('service') || 'general';
    
    // Get form data for personalization (if filled)
    const firstName = document.getElementById('firstName')?.value || '';
    const lastName = document.getElementById('lastName')?.value || '';
    const phone = document.getElementById('phone')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const appointmentType = document.getElementById('appointmentType')?.value || '';
    const preferredDate = document.getElementById('preferredDate')?.value || '';
    const preferredTime = document.getElementById('preferredTime')?.value || '';
    const reasonForVisit = document.getElementById('reasonForVisit')?.value || '';
    
    let serviceName = getServiceName(service);
    let customMessage = getServiceSpecificMessage(service);
    
    // Base message
    let message = `🏥 *Hopewell Hospital Appointment Request*\n\n`;
    message += `Hello! I would like to book an appointment for *${serviceName}*.\n\n`;
    message += `${customMessage}\n\n`;
    
    // Add personal details if provided
    if (firstName && lastName) {
        message += `👤 *Patient Details:*\n`;
        message += `• Name: ${firstName} ${lastName}\n`;
        if (phone) message += `• Phone: ${phone}\n`;
        if (email) message += `• Email: ${email}\n`;
        message += `\n`;
    }
    
    // Add appointment preferences if provided
    if (appointmentType || preferredDate || preferredTime) {
        message += `📅 *Appointment Preferences:*\n`;
        if (appointmentType) message += `• Type: ${getAppointmentTypeText(appointmentType)}\n`;
        if (preferredDate) message += `• Date: ${formatDate(preferredDate)}\n`;
        if (preferredTime) message += `• Time: ${formatTime(preferredTime)}\n`;
        message += `\n`;
    }
    
    // Add reason if provided
    if (reasonForVisit) {
        message += `📝 *Reason for Visit:*\n${reasonForVisit}\n\n`;
    }
    
    message += `Please confirm my appointment and let me know the next steps.\n\n`;
    message += `Thank you! 🙏`;
    
    return message;
}

// Get service name from service code
function getServiceName(service) {
    const serviceNames = {
        'outpatient': 'Out-Patient Services',
        'obs-gynecology': 'OBS & Gynecology',
        'dental': 'Dental Services',
        'pediatrics': 'Pediatrics',
        'inpatient': 'In-Patient Care',
        'minor-surgery': 'Minor Surgery',
        'psychiatrist': 'Psychiatrist Consultation',
        'psychologist': 'Psychologist Consultation',
        'therapist': 'Therapy Session',
        'counsellor': 'Counselling Session',
        'home-consultation': 'Home Medical Consultation',
        'home-counselling': 'Home Counselling',
        'home-imaging': 'Home Imaging & Test Scans',
        'home-lab-tests': 'Home Lab Tests',
        'home-nursing': 'Home Nursing Care',
        'drug-delivery': 'Drug Delivery Service',
        'general': 'General Medical Consultation'
    };
    
    return serviceNames[service] || 'Medical Consultation';
}

// Get service-specific message
function getServiceSpecificMessage(service) {
    const serviceMessages = {
        'outpatient': '🩺 I need a same-day consultation for outpatient services. Please help me schedule an appointment at your convenience.',
        
        'obs-gynecology': '🤱 I would like to book an appointment for women\'s health and maternity care services. I need professional gynecological consultation.',
        
        'dental': '🦷 I need dental care services and would like to schedule an appointment with your dental team for oral health consultation.',
        
        'pediatrics': '👶 I need to book a pediatric appointment for specialized children\'s medical care. Please help me schedule with a pediatrician.',
        
        'inpatient': '🏥 I require in-patient care services with 24/7 hospital monitoring. Please help me understand the admission process.',
        
        'minor-surgery': '🔬 I need consultation for minor surgery procedures. Please schedule me with the appropriate surgical team.',
        
        'psychiatrist': '🧠 I would like to schedule a consultation with Dr. Sarah Mitchell for psychiatric evaluation and mental health treatment.',
        
        'psychologist': '💭 I need to book a session with Dr. James Anderson for psychological assessment and therapy.',
        
        'therapist': '🤝 I would like to schedule a therapy session with Maria Rodriguez for therapeutic intervention and support.',
        
        'counsellor': '💬 I need counselling services with Michael Thompson for guidance and personal growth support.',
        
        'home-consultation': '🏠 I would like to book a home medical consultation. Please arrange for a doctor to visit my home for professional medical assessment.',
        
        'home-counselling': '💝 I need home counselling services for relationship/couple therapy in the privacy of my home.',
        
        'home-imaging': '📱 I require portable imaging and diagnostic scan services at home. Please arrange for X-rays/ultrasounds at my location.',
        
        'home-lab-tests': '🧪 I need home laboratory testing services. Please arrange for professional sample collection at my home.',
        
        'home-nursing': '👩‍⚕️ I require professional nursing care services at home for post-operative care or chronic condition management.',
        
        'drug-delivery': '💊 I need prescription drugs and medications delivered to my home safely and securely.',
        
        'general': '🩺 I would like to book a general medical consultation. Please help me schedule an appointment with your healthcare team.'
    };
    
    return serviceMessages[service] || serviceMessages['general'];
}

// Format appointment type for display
function getAppointmentTypeText(type) {
    const types = {
        'telemedicine': 'Telemedicine (Video Call)',
        'in-person': 'In-Person Visit',
        'phone-consultation': 'Phone Consultation',
        'home-visit': 'Home Visit'
    };
    
    return types[type] || type;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format time for display
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Handle URL parameters for service pre-selection
function handleServicePreSelection() {
    const urlParams = new URLSearchParams(window.location.search);
    const service = urlParams.get('service');
    
    if (service) {
        // Pre-select department based on service
        const departmentSelect = document.getElementById('department');
        if (departmentSelect) {
            const departmentMapping = {
                'outpatient': 'general-medicine',
                'obs-gynecology': 'obs-gynecology',
                'dental': 'dental',
                'pediatrics': 'pediatrics',
                'inpatient': 'general-medicine',
                'minor-surgery': 'general-medicine',
                'psychiatrist': 'mental-health',
                'psychologist': 'mental-health',
                'therapist': 'mental-health',
                'counsellor': 'mental-health',
                'home-consultation': 'general-medicine',
                'home-counselling': 'mental-health',
                'home-imaging': 'general-medicine',
                'home-lab-tests': 'general-medicine',
                'home-nursing': 'general-medicine',
                'drug-delivery': 'general-medicine'
            };
            
            const mappedDepartment = departmentMapping[service];
            if (mappedDepartment) {
                departmentSelect.value = mappedDepartment;
            }
        }
        
        // Pre-select appointment type for home services
        const appointmentTypeSelect = document.getElementById('appointmentType');
        if (appointmentTypeSelect && service.startsWith('home-')) {
            appointmentTypeSelect.value = 'home-visit';
            // Trigger change event to show telemedicine consent if needed
            appointmentTypeSelect.dispatchEvent(new Event('change'));
        }
        
        // Pre-fill reason for visit with service context
        const reasonTextarea = document.getElementById('reasonForVisit');
        if (reasonTextarea && !reasonTextarea.value) {
            const serviceContext = getServiceReasonContext(service);
            if (serviceContext) {
                reasonTextarea.placeholder = serviceContext;
            }
        }
    }
}

// Get service-specific reason context
function getServiceReasonContext(service) {
    const contexts = {
        'outpatient': 'Please describe your symptoms or health concerns for the outpatient consultation...',
        'obs-gynecology': 'Please describe your women\'s health concerns or maternity care needs...',
        'dental': 'Please describe your dental concerns or oral health issues...',
        'pediatrics': 'Please describe your child\'s symptoms or health concerns...',
        'inpatient': 'Please describe why you need in-patient care and monitoring...',
        'minor-surgery': 'Please describe the type of minor surgery you need...',
        'psychiatrist': 'Please describe your mental health concerns for psychiatric evaluation...',
        'psychologist': 'Please describe what you\'d like to address in psychological therapy...',
        'therapist': 'Please describe the therapeutic support you\'re seeking...',
        'counsellor': 'Please describe the areas you\'d like guidance and counselling support...',
        'home-consultation': 'Please describe your medical concerns for the home consultation...',
        'home-counselling': 'Please describe the counselling support needed at home...',
        'home-imaging': 'Please describe what type of imaging or diagnostic scans you need...',
        'home-lab-tests': 'Please describe what laboratory tests you need...',
        'home-nursing': 'Please describe the nursing care services you require at home...',
        'drug-delivery': 'Please list the medications you need delivered...'
    };
    
    return contexts[service] || null;
}
