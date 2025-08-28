// Medical Tourism Page JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize medical tourism form
    initializeMedicalTourismForm();
    
    // Set form validation
    setupFormValidation();
    
    // Handle form submission
    setupFormSubmission();
    
    // Setup phone input formatting
    setupPhoneInputs();
    
    // Initialize file upload functionality
    initializeFileUpload();
});

// Initialize medical tourism form
function initializeMedicalTourismForm() {
    console.log('Medical tourism form initialized');
    
    // Auto-focus first input
    const firstInput = document.getElementById('fullName');
    if (firstInput) {
        firstInput.focus();
    }
}

// Setup phone input formatting
function setupPhoneInputs() {
    const phoneInput = document.getElementById('phone');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Remove all non-digit characters
            let value = e.target.value.replace(/\D/g, '');
            
            // Format for international numbers
            if (value.startsWith('254')) {
                value = '+' + value;
            } else if (value.startsWith('0')) {
                value = '+254' + value.substring(1);
            } else if (value.length > 0 && !value.startsWith('+')) {
                value = '+' + value;
            }
            
            e.target.value = value;
        });
    }
}

// File upload functionality
let uploadedFiles = [];

function initializeFileUpload() {
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('medicalReports');
    const uploadedFilesContainer = document.getElementById('uploadedFiles');
    
    if (!fileUploadArea || !fileInput) return;
    
    // Click to select files
    fileUploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Handle file selection
    fileInput.addEventListener('change', (e) => {
        handleFileSelection(e.target.files);
    });
    
    // Drag and drop functionality
    fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.classList.add('dragover');
    });
    
    fileUploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        fileUploadArea.classList.remove('dragover');
    });
    
    fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.classList.remove('dragover');
        handleFileSelection(e.dataTransfer.files);
    });
}

function handleFileSelection(files) {
    const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    
    Array.from(files).forEach(file => {
        // Validate file type
        if (!allowedTypes.includes(file.type)) {
            alert(`File type not allowed: ${file.name}. Please upload PDF, Word documents, or images only.`);
            return;
        }
        
        // Validate file size
        if (file.size > maxFileSize) {
            alert(`File too large: ${file.name}. Maximum size is 10MB.`);
            return;
        }
        
        // Check if file already exists
        if (uploadedFiles.some(f => f.name === file.name && f.size === file.size)) {
            alert(`File already uploaded: ${file.name}`);
            return;
        }
        
        // Add file to uploaded files array
        uploadedFiles.push(file);
        displayUploadedFile(file);
    });
}

function displayUploadedFile(file) {
    const uploadedFilesContainer = document.getElementById('uploadedFiles');
    
    const fileElement = document.createElement('div');
    fileElement.className = 'uploaded-file';
    fileElement.dataset.fileName = file.name;
    
    const fileIcon = getFileIcon(file.type);
    const fileSize = formatFileSize(file.size);
    
    fileElement.innerHTML = `
        <div class="file-info">
            <i class="${fileIcon} file-icon"></i>
            <div class="file-details">
                <h4>${file.name}</h4>
                <small>${fileSize}</small>
            </div>
        </div>
        <button type="button" class="file-remove" onclick="removeUploadedFile('${file.name}')">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    uploadedFilesContainer.appendChild(fileElement);
}

function getFileIcon(fileType) {
    if (fileType.includes('pdf')) return 'fas fa-file-pdf';
    if (fileType.includes('word') || fileType.includes('document')) return 'fas fa-file-word';
    if (fileType.includes('image')) return 'fas fa-file-image';
    return 'fas fa-file';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function removeUploadedFile(fileName) {
    // Remove from uploaded files array
    uploadedFiles = uploadedFiles.filter(file => file.name !== fileName);
    
    // Remove from display
    const fileElement = document.querySelector(`[data-file-name="${fileName}"]`);
    if (fileElement) {
        fileElement.remove();
    }
}

// Setup form validation
function setupFormValidation() {
    const form = document.getElementById('medicalTourismForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    
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
    let isValid = true;
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        isValid = phoneRegex.test(value) && value.length >= 10;
    }
    
    // Age validation
    if (field.type === 'number' && field.id === 'age' && value) {
        const age = parseInt(value);
        isValid = age >= 1 && age <= 120;
    }
    
    // Update field appearance
    if (isValid) {
        field.classList.remove('invalid');
        field.classList.add('valid');
    } else {
        field.classList.remove('valid');
        field.classList.add('invalid');
    }
    
    return isValid;
}

// Setup form submission
function setupFormSubmission() {
    const form = document.getElementById('medicalTourismForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all fields
            const isFormValid = validateForm();
            
            if (isFormValid) {
                submitMedicalTourismForm();
            } else {
                showFormErrors();
            }
        });
    }
}

// Validate entire form
function validateForm() {
    const form = document.getElementById('medicalTourismForm');
    const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Check required checkboxes
    const privacyConsent = document.getElementById('privacyConsent');
    if (privacyConsent && !privacyConsent.checked) {
        isValid = false;
        const consentSection = privacyConsent.closest('.consent-section');
        if (consentSection) {
            consentSection.style.borderColor = '#ef4444';
            consentSection.style.backgroundColor = '#fef2f2';
        }
    } else if (privacyConsent) {
        const consentSection = privacyConsent.closest('.consent-section');
        if (consentSection) {
            consentSection.style.borderColor = '#e5e7eb';
            consentSection.style.backgroundColor = '#f8fafc';
        }
    }
    
    return isValid;
}

// Show form errors
function showFormErrors() {
    const firstError = document.querySelector('.invalid, .consent-section[style*="border-color: rgb(239, 68, 68)"]');
    if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Show error notification
    showNotification('Please correct the errors in the form before submitting.', 'error');
}

// Submit medical tourism form
function submitMedicalTourismForm() {
    const form = document.getElementById('medicalTourismForm');
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Submitting...</span>';
    submitBtn.disabled = true;
    form.classList.add('form-loading');
    
    // Use Firebase if available, otherwise fallback to simulation
    if (window.firebase && window.firebase.db) {
        submitToFirebase();
    } else {
        // Fallback to simulation
        simulateFormSubmission();
    }
    
    async function submitToFirebase() {
        try {
            // Collect comprehensive form data
            const formData = {
                // Personal Information
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                country: document.getElementById('country').value,
                age: document.getElementById('age')?.value || '',
                
                // Medical Information
                medicalCondition: document.getElementById('medicalCondition').value,
                urgency: document.getElementById('urgency').value,
                destination: document.getElementById('destination')?.value || '',
                additionalInfo: document.getElementById('additionalInfo')?.value || '',
                
                // Uploaded Files Information
                uploadedFiles: uploadedFiles.map(file => ({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    lastModified: file.lastModified
                })),
                totalFiles: uploadedFiles.length,
                
                // Consent
                privacyConsent: document.getElementById('privacyConsent')?.checked || false,
                communicationConsent: document.getElementById('communicationConsent')?.checked || false,
                
                // Metadata
                timestamp: window.firebase.serverTimestamp(),
                formType: 'medical-tourism',
                source: 'medical-tourism-page',
                status: 'pending'
            };
            
            console.log("🏥 Medical tourism inquiry to submit:", formData);
            
            // Add to Firestore
            const docRef = await window.firebase.addDoc(
                window.firebase.collection(window.firebase.db, "medical-tourism-inquiries"), 
                formData
            );
            
            console.log("✅ Medical tourism inquiry submitted successfully with ID: ", docRef.id);
            
            // Show success message
            submitBtn.innerHTML = '<i class="fas fa-check"></i> <span>✓ Submitted</span>';
            submitBtn.style.backgroundColor = '#10b981';
            
            // Show success modal after short delay
            setTimeout(() => {
                showSuccessMessage();
                
                // Reset form and clear uploaded files
                form.reset();
                uploadedFiles = [];
                document.getElementById('uploadedFiles').innerHTML = '';
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.style.backgroundColor = '';
                submitBtn.disabled = false;
                form.classList.remove('form-loading');
            }, 2000);
            
        } catch (error) {
            console.error("❌ Detailed error submitting medical tourism inquiry:");
            console.error("Error code:", error.code);
            console.error("Error message:", error.message);
            console.error("Full error:", error);
            
            // Show specific error state
            let errorText = '✗ Error';
            if (error.code === 'permission-denied') {
                errorText = '✗ Permission';
                console.error("🔒 PERMISSION DENIED: Check Firebase security rules!");
            } else if (error.code === 'unavailable') {
                errorText = '✗ Offline';
            } else if (error.code === 'invalid-argument') {
                errorText = '✗ Invalid';
            }
            
            submitBtn.innerHTML = `<i class="fas fa-exclamation-triangle"></i> <span>${errorText}</span>`;
            submitBtn.style.backgroundColor = '#ef4444';
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.backgroundColor = '';
                submitBtn.disabled = false;
                form.classList.remove('form-loading');
            }, 3000);
            
            // Show error notification
            showNotification('❌ Error submitting inquiry. Please try again or contact us directly.', 'error');
        }
    }
    
    function simulateFormSubmission() {
        // Original simulation code for fallback
        setTimeout(() => {
            // Collect form data
            const formData = new FormData(form);
            const tourismData = {};
            
            for (let [key, value] of formData.entries()) {
                tourismData[key] = value;
            }
            
            console.log('Medical Tourism Data:', tourismData);
            
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
}

// Show success message
function showSuccessMessage() {
    const successModal = document.createElement('div');
    successModal.className = 'success-modal';
    successModal.innerHTML = `
        <div class="success-modal-content">
            <div class="success-icon">
                <i class="fas fa-paper-plane"></i>
            </div>
            <h3>Your Medical Journey Begins!</h3>
            <p>Thank you for choosing Hopewell Hospital for your medical tourism needs. We have received your inquiry and our specialists will contact you within 24 hours.</p>
            <div class="success-details">
                <p><strong>What happens next?</strong></p>
                <ul>
                    <li>Our medical tourism specialist will review your case</li>
                    <li>We'll provide personalized treatment recommendations</li>
                    <li>You'll receive detailed cost estimates and hospital options</li>
                    <li>We'll assist with travel and accommodation arrangements</li>
                    <li>Complete support throughout your medical journey</li>
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
                -webkit-backdrop-filter: blur(5px);
            }
            
            .success-modal-content {
                background: white;
                border-radius: 20px;
                padding: 3rem 2rem;
                max-width: 500px;
                width: 100%;
                text-align: center;
                position: relative;
                z-index: 2;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: slideUp 0.3s ease;
            }
            
            @keyframes slideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .success-icon {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #2563eb 0%, #ec4899 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 1.5rem;
                animation: pulse 2s ease-in-out infinite;
            }
            
            .success-icon i {
                font-size: 2rem;
                color: white;
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            .success-modal-content h3 {
                color: #1e293b;
                font-size: 1.5rem;
                margin-bottom: 1rem;
            }
            
            .success-modal-content p {
                color: #64748b;
                margin-bottom: 1.5rem;
                line-height: 1.6;
            }
            
            .success-details {
                background: #f8fafc;
                padding: 1.5rem;
                border-radius: 15px;
                margin-bottom: 2rem;
                text-align: left;
            }
            
            .success-details p {
                margin-bottom: 1rem;
                font-weight: 600;
                color: #374151;
            }
            
            .success-details ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .success-details li {
                padding: 0.5rem 0;
                color: #6b7280;
                position: relative;
                padding-left: 1.5rem;
            }
            
            .success-details li::before {
                content: '✓';
                position: absolute;
                left: 0;
                color: #10b981;
                font-weight: bold;
            }
            
            .success-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .success-btn {
                background: linear-gradient(135deg, #2563eb 0%, #ec4899 100%);
                color: white;
                border: none;
                padding: 0.75rem 2rem;
                border-radius: 10px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.3s ease;
                font-family: 'Montserrat', sans-serif;
            }
            
            .success-btn:hover {
                transform: translateY(-2px);
            }
            
            .success-link {
                color: #6b7280;
                text-decoration: none;
                padding: 0.75rem 2rem;
                border-radius: 10px;
                border: 2px solid #e5e7eb;
                transition: all 0.3s ease;
            }
            
            .success-link:hover {
                border-color: #2563eb;
                color: #2563eb;
            }
        `;
        document.head.appendChild(modalStyles);
    }
}

// Close success modal
function closeSuccessModal() {
    const modal = document.querySelector('.success-modal');
    if (modal) {
        modal.remove();
    }
}

// Show notification function
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add notification styles if not already present
    if (!document.querySelector('#notificationStyles')) {
        const notificationStyles = document.createElement('style');
        notificationStyles.id = 'notificationStyles';
        notificationStyles.textContent = `
            .notification {
                position: fixed;
                top: 2rem;
                right: 2rem;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                z-index: 9999;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                animation: slideIn 0.3s ease;
                max-width: 300px;
            }
            
            .notification-error {
                border-left: 4px solid #ef4444;
                color: #dc2626;
            }
            
            .notification-success {
                border-left: 4px solid #10b981;
                color: #059669;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(notificationStyles);
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}
