// Firebase Form Handlers for Index Page
import { db, collection, addDoc, serverTimestamp } from './firebase-config.js';

// Contact Form Handler
async function handleContactForm(event) {
    event.preventDefault();
    
    const submitBtn = event.target.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    try {
        // Show loading state
        submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        
        // Get form data
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            service: document.getElementById('service').value,
            message: document.getElementById('message').value,
            timestamp: serverTimestamp(),
            formType: 'contact',
            source: 'index-page'
        };
        
        // Add to Firestore
        const docRef = await addDoc(collection(db, "contact-submissions"), formData);
        console.log("Contact form submitted with ID: ", docRef.id);
        
        // Show success message
        submitBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
        submitBtn.style.backgroundColor = '#10b981';
        
        // Reset form after 2 seconds
        setTimeout(() => {
            event.target.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.style.backgroundColor = '';
            submitBtn.disabled = false;
            
            // Show success notification
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        }, 2000);
        
    } catch (error) {
        console.error("Error submitting contact form: ", error);
        
        // Show error state
        submitBtn.innerHTML = '<span>Error - Try Again</span><i class="fas fa-exclamation-triangle"></i>';
        submitBtn.style.backgroundColor = '#ef4444';
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.backgroundColor = '';
            submitBtn.disabled = false;
        }, 3000);
        
        // Show error notification
        showNotification('Error sending message. Please try again.', 'error');
    }
}

// Newsletter Subscription Handler
async function handleNewsletterForm(event) {
    event.preventDefault();
    
    const submitBtn = event.target.querySelector('.newsletter-cta-btn');
    const emailInput = document.getElementById('newsletterEmail');
    const originalText = submitBtn.innerHTML;
    
    try {
        // Show loading state
        submitBtn.innerHTML = '<span>Subscribing...</span><i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        
        // Get form data
        const formData = {
            email: emailInput.value,
            timestamp: serverTimestamp(),
            formType: 'newsletter',
            source: 'index-page'
        };
        
        // Add to Firestore
        const docRef = await addDoc(collection(db, "newsletter-subscriptions"), formData);
        console.log("Newsletter subscription submitted with ID: ", docRef.id);
        
        // Show success message
        submitBtn.innerHTML = '<span>Subscribed!</span><i class="fas fa-check"></i>';
        submitBtn.style.backgroundColor = '#10b981';
        
        // Reset form after 2 seconds
        setTimeout(() => {
            emailInput.value = '';
            submitBtn.innerHTML = originalText;
            submitBtn.style.backgroundColor = '';
            submitBtn.disabled = false;
            
            // Show success notification
            showNotification('Successfully subscribed to our newsletter!', 'success');
        }, 2000);
        
    } catch (error) {
        console.error("Error submitting newsletter subscription: ", error);
        
        // Show error state
        submitBtn.innerHTML = '<span>Error - Try Again</span><i class="fas fa-exclamation-triangle"></i>';
        submitBtn.style.backgroundColor = '#ef4444';
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.backgroundColor = '';
            submitBtn.disabled = false;
        }, 3000);
        
        // Show error notification
        showNotification('Error subscribing. Please try again.', 'error');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.firebase-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `firebase-notification firebase-notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add animation keyframes if not already added
    if (!document.querySelector('#firebase-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'firebase-notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                margin-left: auto;
                padding: 4px;
                border-radius: 4px;
                transition: background 0.2s;
            }
            .notification-close:hover {
                background: rgba(255,255,255,0.2);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Initialize form handlers when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Newsletter form (handle both form submit and button click)
    const newsletterInput = document.getElementById('newsletterEmail');
    const newsletterBtn = document.querySelector('.newsletter-cta-btn');
    
    if (newsletterInput && newsletterBtn) {
        // Handle button click
        newsletterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const fakeEvent = {
                preventDefault: () => {},
                target: { querySelector: (selector) => newsletterBtn }
            };
            handleNewsletterForm(fakeEvent);
        });
        
        // Handle enter key in input
        newsletterInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const fakeEvent = {
                    preventDefault: () => {},
                    target: { querySelector: (selector) => newsletterBtn }
                };
                handleNewsletterForm(fakeEvent);
            }
        });
    }
});

// Export handlers for external use
export { handleContactForm, handleNewsletterForm, showNotification };
