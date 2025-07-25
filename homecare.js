// Home Care Page JavaScript Functionality

// Loading Screen Logic
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen after 2 seconds
    setTimeout(function() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            // Remove from DOM after animation completes
            setTimeout(function() {
                loadingScreen.remove();
            }, 500);
        }
    }, 2000);

    // Initialize home care form
    initializeHomeCareForm();
    
    // Set minimum date to today
    setMinimumDate();
    
    // Handle form validation
    setupFormValidation();
    
    // Handle form submission
    setupFormSubmission();
    
    // Setup WhatsApp functionality
    setupWhatsAppBooking();
    
    // Handle service-specific placeholders
    setupServiceSpecificContent();
    
    // Setup service type change handler
    setupServiceTypeHandler();
});

// Initialize home care form
function initializeHomeCareForm() {
    console.log('Home care form initialized');
    
    // Auto-focus first input
    const firstInput = document.getElementById('fullName');
    if (firstInput) {
        firstInput.focus();
    }
    
    // Format phone inputs
    setupPhoneInputs();
    
    // Setup date inputs
    setupDateInputs();
}

// Set minimum date to today for service booking
function setMinimumDate() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const dateInput = document.getElementById('preferredDate');
    
    if (dateInput) {
        dateInput.min = tomorrow.toISOString().split('T')[0];
        
        // Handle weekend restrictions
        dateInput.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            const dayOfWeek = selectedDate.getDay();
            
            // Update available time slots based on day
            updateAvailableTimeSlots(dayOfWeek);
        });
    }
}

// Setup phone input formatting
function setupPhoneInputs() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            
            // Add Kenya country code if not present
            if (value.length > 0 && !value.startsWith('254')) {
                if (value.startsWith('0')) {
                    value = '254' + value.substring(1);
                } else if (value.length === 9) {
                    value = '254' + value;
                }
            }
            
            // Format the number
            if (value.length >= 3) {
                value = '+' + value;
            }
            
            this.value = value;
        });
        
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

// Setup date inputs
function setupDateInputs() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    
    dateInputs.forEach(input => {
        input.addEventListener('change', function() {
            validateField(this);
        });
    });
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
            // Sunday: Limited hours (emergency/urgent only)
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

// Setup service-specific content
function setupServiceSpecificContent() {
    const serviceSelect = document.getElementById('serviceType');
    const reasonTextarea = document.getElementById('serviceReason');
    
    if (serviceSelect && reasonTextarea) {
        serviceSelect.addEventListener('change', function() {
            const serviceType = this.value;
            updateServicePlaceholder(serviceType, reasonTextarea);
        });
    }
}

// Update service reason placeholder based on selected service
function updateServicePlaceholder(serviceType, textarea) {
    const placeholders = {
        'general-consultation': 'Please describe your medical concerns and what type of consultation you need at home...',
        'couple-counselling': 'Please describe your relationship counselling needs and goals for the sessions...',
        'imaging-scans': 'Please specify what type of imaging or scans you need (X-ray, ultrasound, etc.) and the reason...',
        'lab-tests': 'Please list the specific lab tests you need and any doctor\'s orders or requirements...',
        'nursing-care': 'Please describe your nursing care needs (wound care, medication administration, post-op care, etc.)...',
        'drug-delivery': 'Please list the medications you need delivered and any special handling requirements...',
        'physiotherapy': 'Please describe your physiotherapy needs and any current mobility issues or rehabilitation goals...',
        'wound-care': 'Please describe the type of wound care needed and the current condition of the wound...'
    };
    
    if (placeholders[serviceType]) {
        textarea.placeholder = placeholders[serviceType];
    } else {
        textarea.placeholder = 'Please describe your medical needs, symptoms, or specific requirements for the home service...';
    }
}

// Setup service type handler for special options
function setupServiceTypeHandler() {
    const serviceSelect = document.getElementById('serviceType');
    
    if (serviceSelect) {
        serviceSelect.addEventListener('change', handleServiceTypeChange);
    }
}

// Handle service type change to show/hide additional options
function handleServiceTypeChange() {
    const serviceType = document.getElementById('serviceType');
    const serviceOptionsContainer = document.getElementById('serviceOptionsContainer');
    
    if (serviceType && serviceOptionsContainer) {
        const selectedValue = serviceType.value;
        
        // Clear existing options
        serviceOptionsContainer.innerHTML = '';
        serviceOptionsContainer.style.display = 'none';
        
        if (selectedValue === 'drug-delivery') {
            showDrugDeliveryOptions();
        } else if (selectedValue === 'lab-tests') {
            showLabTestOptions();
        }
    }
}

// Show drug delivery specific options
function showDrugDeliveryOptions() {
    const serviceOptionsContainer = document.getElementById('serviceOptionsContainer');
    
    const optionsHTML = `
        <div class="service-options-header">
            <h4><i class="fas fa-pills"></i> Drug Delivery Options</h4>
            <p>Choose how you'd like to proceed with your medication needs:</p>
        </div>
        <div class="service-options-grid">
            <div class="option-card" data-option="upload-prescription">
                <div class="option-icon">
                    <i class="fas fa-upload"></i>
                </div>
                <h5>Upload Prescription</h5>
                <p>Have a valid prescription? Upload it here for quick processing.</p>
                <button type="button" class="option-btn" onclick="showPrescriptionUpload()">
                    <i class="fas fa-file-medical"></i>
                    Upload Prescription
                </button>
            </div>
            <div class="option-card" data-option="consult-doctor">
                <div class="option-icon">
                    <i class="fas fa-user-md"></i>
                </div>
                <h5>Consult a Doctor</h5>
                <p>Need a prescription? Consult with our licensed doctors first.</p>
                <button type="button" class="option-btn" onclick="consultDoctor('drug-delivery')">
                    <i class="fas fa-video"></i>
                    Consult Doctor
                </button>
            </div>
        </div>
        <div id="prescriptionUploadSection" class="upload-section" style="display: none;">
            <div class="upload-container">
                <h5><i class="fas fa-file-upload"></i> Upload Your Prescription</h5>
                <div class="file-upload-area" id="prescriptionUpload">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Drag and drop your prescription here or click to browse</p>
                    <input type="file" id="prescriptionFile" name="prescriptionFile" accept=".pdf,.jpg,.jpeg,.png" multiple>
                    <small>Supported formats: PDF, JPG, PNG (Max 5MB per file)</small>
                </div>
                <div id="uploadedFiles" class="uploaded-files"></div>
            </div>
        </div>
    `;
    
    serviceOptionsContainer.innerHTML = optionsHTML;
    serviceOptionsContainer.style.display = 'block';
}

// Show lab test specific options
function showLabTestOptions() {
    const serviceOptionsContainer = document.getElementById('serviceOptionsContainer');
    
    const optionsHTML = `
        <div class="service-options-header">
            <h4><i class="fas fa-vial"></i> Lab Test Options</h4>
            <p>Choose how you'd like to proceed with your lab test requirements:</p>
        </div>
        <div class="service-options-grid">
            <div class="option-card" data-option="upload-lab-request">
                <div class="option-icon">
                    <i class="fas fa-upload"></i>
                </div>
                <h5>Upload Lab Request</h5>
                <p>Have a lab request form from your doctor? Upload it here.</p>
                <button type="button" class="option-btn" onclick="showLabRequestUpload()">
                    <i class="fas fa-file-medical-alt"></i>
                    Upload Lab Request
                </button>
            </div>
            <div class="option-card" data-option="consult-doctor">
                <div class="option-icon">
                    <i class="fas fa-user-md"></i>
                </div>
                <h5>Consult a Doctor</h5>
                <p>Need lab tests prescribed? Consult with our doctors first.</p>
                <button type="button" class="option-btn" onclick="consultDoctor('lab-tests')">
                    <i class="fas fa-video"></i>
                    Consult Doctor
                </button>
            </div>
        </div>
        <div id="labRequestUploadSection" class="upload-section" style="display: none;">
            <div class="upload-container">
                <h5><i class="fas fa-file-upload"></i> Upload Your Lab Request Form</h5>
                <div class="file-upload-area" id="labRequestUpload">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Drag and drop your lab request form here or click to browse</p>
                    <input type="file" id="labRequestFile" name="labRequestFile" accept=".pdf,.jpg,.jpeg,.png" multiple>
                    <small>Supported formats: PDF, JPG, PNG (Max 5MB per file)</small>
                </div>
                <div id="uploadedLabFiles" class="uploaded-files"></div>
            </div>
        </div>
    `;
    
    serviceOptionsContainer.innerHTML = optionsHTML;
    serviceOptionsContainer.style.display = 'block';
}

// Show prescription upload section
function showPrescriptionUpload() {
    const uploadSection = document.getElementById('prescriptionUploadSection');
    if (uploadSection) {
        uploadSection.style.display = 'block';
        uploadSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setupFileUpload('prescriptionUpload', 'prescriptionFile', 'uploadedFiles');
    }
}

// Show lab request upload section
function showLabRequestUpload() {
    const uploadSection = document.getElementById('labRequestUploadSection');
    if (uploadSection) {
        uploadSection.style.display = 'block';
        uploadSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setupFileUpload('labRequestUpload', 'labRequestFile', 'uploadedLabFiles');
    }
}

// Setup file upload functionality
function setupFileUpload(uploadAreaId, fileInputId, uploadedFilesId) {
    const uploadArea = document.getElementById(uploadAreaId);
    const fileInput = document.getElementById(fileInputId);
    const uploadedFilesContainer = document.getElementById(uploadedFilesId);
    
    if (!uploadArea || !fileInput) return;
    
    // Click to upload
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Drag and drop functionality
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        handleFileUpload(files, uploadedFilesContainer);
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        handleFileUpload(files, uploadedFilesContainer);
    });
}

// Handle file upload
function handleFileUpload(files, container) {
    Array.from(files).forEach(file => {
        if (validateFile(file)) {
            displayUploadedFile(file, container);
        }
    });
}

// Validate uploaded file
function validateFile(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    
    if (file.size > maxSize) {
        showNotification('File size must be less than 5MB', 'error');
        return false;
    }
    
    if (!allowedTypes.includes(file.type)) {
        showNotification('Only PDF, JPG, and PNG files are allowed', 'error');
        return false;
    }
    
    return true;
}

// Display uploaded file
function displayUploadedFile(file, container) {
    const fileItem = document.createElement('div');
    fileItem.className = 'uploaded-file-item';
    
    const fileIcon = file.type === 'application/pdf' ? 'fas fa-file-pdf' : 'fas fa-file-image';
    const fileSize = (file.size / 1024 / 1024).toFixed(2);
    
    fileItem.innerHTML = `
        <div class="file-info">
            <i class="${fileIcon}"></i>
            <div class="file-details">
                <span class="file-name">${file.name}</span>
                <span class="file-size">${fileSize} MB</span>
            </div>
        </div>
        <button type="button" class="remove-file-btn" onclick="removeFile(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(fileItem);
    showNotification('File uploaded successfully', 'success');
}

// Remove uploaded file
function removeFile(button) {
    const fileItem = button.closest('.uploaded-file-item');
    if (fileItem) {
        fileItem.remove();
        showNotification('File removed', 'info');
    }
}

// Consult doctor function
function consultDoctor(serviceType) {
    const consultMessage = serviceType === 'drug-delivery' 
        ? 'I need a consultation for medication prescription. Can you help me get the right prescription for my condition?'
        : 'I need a consultation for lab tests. Can you help me determine what tests I need and provide a lab request form?';
    
    const whatsappUrl = `https://wa.me/254796780345?text=${encodeURIComponent(consultMessage)}`;
    window.open(whatsappUrl, '_blank');
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Setup form validation
function setupFormValidation() {
    const form = document.getElementById('homecareForm');
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
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate <= today) {
            isValid = false;
            errorMessage = 'Please select a future date.';
        }
    }
    
    // Age validation
    else if (fieldName === 'age' && value) {
        const age = parseInt(value);
        if (age < 1 || age > 120) {
            isValid = false;
            errorMessage = 'Please enter a valid age.';
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
    const form = document.getElementById('homecareForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all fields
            const isFormValid = validateForm();
            
            if (isFormValid) {
                submitHomeCareForm();
            } else {
                showFormErrors();
            }
        });
    }
}

// Validate entire form
function validateForm() {
    const form = document.getElementById('homecareForm');
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
                label.style.borderColor = '';
                label.style.backgroundColor = '';
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

// Submit home care form
function submitHomeCareForm() {
    const form = document.getElementById('homecareForm');
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Scheduling Service...</span>';
    submitBtn.disabled = true;
    form.classList.add('form-loading');
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Collect form data
        const formData = new FormData(form);
        const homecareData = {};
        
        for (let [key, value] of formData.entries()) {
            homecareData[key] = value;
        }
        
        console.log('Home Care Data:', homecareData);
        
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
            <h3>Home Care Service Scheduled!</h3>
            <p>Thank you for choosing Hopewell Hospital's home care services. We have received your request and our team will contact you within 2 hours to confirm the service details.</p>
            <div class="success-details">
                <p><strong>What's Next?</strong></p>
                <ul>
                    <li>Our team will call you to confirm service details</li>
                    <li>We'll verify your address and requirements</li>
                    <li>You'll receive a confirmation with the assigned healthcare professional</li>
                    <li>We'll send service reminders via SMS</li>
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
    
    // Add CSS for modal (if not already added)
    if (!document.querySelector('#successModalStyles')) {
        const modalStyles = document.createElement('style');
        modalStyles.id = 'successModalStyles';
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
}

// Setup WhatsApp booking
function setupWhatsAppBooking() {
    const whatsappBtn = document.getElementById('homecareWhatsAppBtn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function() {
            const message = generateHomeCareWhatsAppMessage();
            const phoneNumber = '+254796780345'; // Hospital's WhatsApp number
            const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    }
}

// Generate WhatsApp message for home care
function generateHomeCareWhatsAppMessage() {
    // Get form data if available
    const fullName = document.getElementById('fullName')?.value || '';
    const phone = document.getElementById('phone')?.value || '';
    const serviceType = document.getElementById('serviceType')?.value || '';
    const address = document.getElementById('address')?.value || '';
    const urgency = document.getElementById('urgency')?.value || '';
    
    let message = `Hello Hopewell Hospital! 👋\n\nI would like to schedule a Home Care Service.\n\n`;
    
    // Add patient details if available
    if (fullName) {
        message += `👤 **Patient Details:**\n`;
        message += `Name: ${fullName}\n`;
        if (phone) message += `Phone: ${phone}\n`;
        message += `\n`;
    }
    
    // Add service details if available
    if (serviceType || urgency) {
        message += `🏠 **Service Request:**\n`;
        if (serviceType) {
            const serviceNames = {
                'general-consultation': 'General Consultation',
                'couple-counselling': 'Couple Home Counselling',
                'imaging-scans': 'Imaging & Test Scans',
                'lab-tests': 'Lab Tests',
                'nursing-care': 'Nursing Care',
                'drug-delivery': 'Drug Delivery',
                'physiotherapy': 'Physiotherapy',
                'wound-care': 'Wound Care'
            };
            message += `Service: ${serviceNames[serviceType] || serviceType}\n`;
        }
        if (urgency) {
            const urgencyNames = {
                'routine': 'Routine (2-3 days)',
                'priority': 'Priority (Next day)',
                'urgent': 'Urgent (Same day)'
            };
            message += `Urgency: ${urgencyNames[urgency] || urgency}\n`;
        }
        message += `\n`;
    }
    
    // Add address if available
    if (address) {
        message += `📍 **Service Address:**\n${address}\n\n`;
    }
    
    // Add professional closing
    message += `I would appreciate if someone could contact me to discuss the service details and schedule the appointment.\n\n`;
    message += `Thank you! 🙏\n\n`;
    message += `*This message was sent via Hopewell Hospital's home care booking system.*`;
    
    return message;
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
    
    // Add notification styles if not already added
    if (!document.querySelector('#notificationStyles')) {
        const notificationStyles = document.createElement('style');
        notificationStyles.id = 'notificationStyles';
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
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Close success modal
function closeSuccessModal() {
    const modal = document.querySelector('.success-modal');
    if (modal) {
        modal.remove();
    }
}

// Make closeSuccessModal globally available
window.closeSuccessModal = closeSuccessModal;
