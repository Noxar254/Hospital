// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdowns = document.querySelectorAll('.dropdown');

    // Mobile menu toggle
    mobileToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        // Prevent background scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
        // Add animation delay for menu items
        const menuItems = navMenu.querySelectorAll('.nav-item');
        menuItems.forEach((item, index) => {
            if (navMenu.classList.contains('active')) {
                item.style.animationDelay = `${index * 0.1}s`;
                item.style.animation = 'slideInLeft 0.3s ease forwards';
            } else {
                item.style.animation = '';
            }
        });
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                // Don't close if it's a dropdown toggle
                if (!this.parentElement.classList.contains('dropdown')) {
                    mobileToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            }
        });
    });

    // Handle dropdown menus on mobile
    dropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('.nav-link');
        
        dropdownLink.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
                
                // Close other dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
            }
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerOffset = 120; // Account for fixed header
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Update active nav link
                    updateActiveNavLink(this);
                }
            }
        });
    });

    // Update active navigation link based on scroll position
    function updateActiveNavLink(clickedLink = null) {
        if (clickedLink) {
            navLinks.forEach(link => link.classList.remove('active'));
            clickedLink.classList.add('active');
            return;
        }

        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    // Handle scroll events
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                updateActiveNavLink();
                handleNavbarScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Navbar scroll effect
    function handleNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        const scrollTop = window.pageYOffset;

        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const isClickInsideNav = navMenu.contains(e.target) || mobileToggle.contains(e.target);
        
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            // Reset mobile menu state on desktop
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
            
            // Reset dropdown states
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    // Initialize page
    updateActiveNavLink();
    
    // Add loading animation
    const navbar = document.querySelector('.navbar');
    navbar.style.transform = 'translateY(-100%)';
    
    setTimeout(() => {
        navbar.style.transition = 'transform 0.5s ease';
        navbar.style.transform = 'translateY(0)';
    }, 100);
});

// Add some interactive animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for animation
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
});

// Add CSS animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .navbar.scrolled {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
    }
    
    .navbar.scrolled .nav-top {
        display: none;
    }
    
    .navbar.scrolled .nav-bottom {
        border-bottom: 1px solid rgba(37, 99, 235, 0.2);
    }
`;

document.head.appendChild(style);

// Emergency number functionality
const emergencyNumber = document.querySelector('.emergency-number');
    
if (emergencyNumber) {
    emergencyNumber.addEventListener('click', function(e) {
        // Add click effect
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
        
        // Show confirmation on desktop (since tel: links work automatically on mobile)
        if (window.innerWidth > 768) {
            const confirmCall = confirm('Do you want to call the emergency number +254 796 780 345?');
            if (!confirmCall) {
                e.preventDefault();
            }
        }
    });

    // Add hover effect
    emergencyNumber.addEventListener('mouseenter', function() {
        this.style.color = 'var(--pink-accent)';
        this.style.transform = 'translateX(5px)';
    });

    emergencyNumber.addEventListener('mouseleave', function() {
        this.style.color = 'var(--gray-dark)';
        this.style.transform = 'translateX(0)';
    });
}

// View All Services functionality (Mobile)
const viewAllServicesBtn = document.getElementById('viewAllServicesBtn');
    
if (viewAllServicesBtn) {
    viewAllServicesBtn.addEventListener('click', function() {
        const desktopCards = document.querySelectorAll('.desktop-card');
        const btnIcon = this.querySelector('i');
        const btnText = this.querySelector('span');
        
        if (this.classList.contains('expanded')) {
            // Hide additional cards
            desktopCards.forEach(card => {
                card.classList.remove('show-mobile');
                card.style.animation = 'slideOut 0.3s ease forwards';
            });
            
            setTimeout(() => {
                desktopCards.forEach(card => {
                    card.style.display = 'none';
                    card.style.animation = '';
                });
            }, 300);
            
            btnText.textContent = 'View All Services';
            btnIcon.className = 'fas fa-chevron-down';
            this.classList.remove('expanded');
        } else {
            // Show additional cards
            desktopCards.forEach((card, index) => {
                card.style.display = 'block';
                card.classList.add('show-mobile');
                card.style.animation = `slideIn 0.4s ease ${index * 0.1}s forwards`;
            });
            
            btnText.textContent = 'Show Less';
            btnIcon.className = 'fas fa-chevron-up';
            this.classList.add('expanded');
        }
    });
}

// Add animation styles
if (!document.querySelector('#service-animations')) {
    const animationStyle = document.createElement('style');
    animationStyle.id = 'service-animations';
    animationStyle.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideOut {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-20px);
            }
        }
    `;
    document.head.appendChild(animationStyle);
}

// Home Care View More/Less functionality
const viewMoreHomeCareBtn = document.getElementById('viewMoreHomeCareBtn');
if (viewMoreHomeCareBtn) {
    viewMoreHomeCareBtn.addEventListener('click', function() {
        const hiddenCards = document.querySelectorAll('.home-care-card.mobile-hidden');
        const btnText = this.querySelector('span');
        const btnIcon = this.querySelector('i');
        
        if (!this.classList.contains('expanded')) {
            // Show more cards
            hiddenCards.forEach((card, index) => {
                card.classList.add('show');
                card.style.animation = `slideDown 0.3s ease ${index * 0.1}s forwards`;
            });
            
            btnText.textContent = 'View Less Services';
            btnIcon.className = 'fas fa-chevron-up';
            this.classList.add('expanded');
        } else {
            // Hide cards
            hiddenCards.forEach((card, index) => {
                card.style.animation = `slideUp 0.3s ease ${index * 0.1}s forwards`;
                setTimeout(() => {
                    card.classList.remove('show');
                }, 300 + (index * 100));
            });
            
            btnText.textContent = 'View More Services';
            btnIcon.className = 'fas fa-chevron-down';
            this.classList.remove('expanded');
        }
    });
}

// Add animation styles for home care
if (!document.querySelector('#home-care-animations')) {
    const homeCareAnimationStyle = document.createElement('style');
    homeCareAnimationStyle.id = 'home-care-animations';
    homeCareAnimationStyle.textContent = `
        @keyframes slideUp {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-20px);
            }
        }
    `;
    document.head.appendChild(homeCareAnimationStyle);
}

// Desktop Horizontal Scroll functionality for Home Care
const scrollLeftBtn = document.getElementById('scrollLeft');
const scrollRightBtn = document.getElementById('scrollRight');
const homeCareGrid = document.getElementById('homeCareGrid');

if (scrollLeftBtn && scrollRightBtn && homeCareGrid) {
    // Scroll amount - about one card width
    const scrollAmount = 365; // updated card width + gap
    
    scrollLeftBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent any card click events
        homeCareGrid.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });
    
    scrollRightBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent any card click events
        homeCareGrid.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
    
    // Update button states based on scroll position
    function updateScrollButtons() {
        if (window.innerWidth > 768) { // Only on desktop
            const scrollLeft = homeCareGrid.scrollLeft;
            const maxScroll = homeCareGrid.scrollWidth - homeCareGrid.clientWidth;
            
            const leftBtn = document.getElementById('scrollLeft');
            const rightBtn = document.getElementById('scrollRight');
            
            if (leftBtn) {
                leftBtn.style.opacity = scrollLeft <= 0 ? '0.3' : '1';
                leftBtn.style.pointerEvents = scrollLeft <= 0 ? 'none' : 'auto';
            }
            
            if (rightBtn) {
                rightBtn.style.opacity = scrollLeft >= maxScroll - 1 ? '0.3' : '1';
                rightBtn.style.pointerEvents = scrollLeft >= maxScroll - 1 ? 'none' : 'auto';
            }
        }
    }
    
    // Listen for scroll events to update button states
    homeCareGrid.addEventListener('scroll', updateScrollButtons);
    
    // Initial update
    updateScrollButtons();
    
    // Update on window resize
    window.addEventListener('resize', updateScrollButtons);
}

// ===============================
// CONTACT FORM FUNCTIONALITY
// ===============================

// Contact form submission handling
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const formObject = {};
        
        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            formObject[key] = value;
        }
        
        // Validate form
        if (validateContactForm(formObject)) {
            // Show loading state
            showFormLoading(true);
            
            // Simulate form submission (replace with actual submission logic)
            setTimeout(() => {
                showFormLoading(false);
                showFormSuccess();
                contactForm.reset();
            }, 2000);
        }
    });
}

// Form validation function
function validateContactForm(data) {
    let isValid = true;
    const errors = [];
    
    // Required fields validation
    const requiredFields = ['fullName', 'email', 'phone', 'service', 'message'];
    
    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            isValid = false;
            errors.push(`${getFieldLabel(field)} is required`);
            highlightField(field, false);
        } else {
            highlightField(field, true);
        }
    });
    
    // Email validation
    if (data.email && !isValidEmail(data.email)) {
        isValid = false;
        errors.push('Please enter a valid email address');
        highlightField('email', false);
    }
    
    // Phone validation
    if (data.phone && !isValidPhone(data.phone)) {
        isValid = false;
        errors.push('Please enter a valid phone number');
        highlightField('phone', false);
    }
    
    // Privacy checkbox validation
    if (!data.privacy) {
        isValid = false;
        errors.push('Please accept the privacy policy');
        highlightField('privacy', false);
    }
    
    // Show errors if any
    if (!isValid) {
        showFormErrors(errors);
    }
    
    return isValid;
}

// Helper functions
function getFieldLabel(field) {
    const labels = {
        fullName: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        service: 'Service Type',
        message: 'Message'
    };
    return labels[field] || field;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

function highlightField(fieldName, isValid) {
    const field = document.getElementById(fieldName);
    if (field) {
        field.classList.remove('error', 'success');
        field.classList.add(isValid ? 'success' : 'error');
        
        // Remove highlight after 3 seconds
        setTimeout(() => {
            field.classList.remove('error', 'success');
        }, 3000);
    }
}

function showFormLoading(show) {
    const submitBtn = document.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('span');
    const btnIcon = submitBtn.querySelector('i');
    
    if (show) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        btnText.textContent = 'Sending...';
        btnIcon.className = 'fas fa-spinner fa-spin';
    } else {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        btnText.textContent = 'Send Message';
        btnIcon.className = 'fas fa-paper-plane';
    }
}

function showFormSuccess() {
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success-message';
    successMessage.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h4>Message Sent Successfully!</h4>
            <p>Thank you for contacting Hopewell Hospital. We'll get back to you within 24 hours.</p>
        </div>
    `;
    
    // Add success message styles
    successMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        z-index: 10000;
        text-align: center;
        animation: successSlideIn 0.3s ease;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes successSlideIn {
            from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .success-content i {
            color: #10b981;
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        .success-content h4 {
            color: #1f2937;
            margin-bottom: 0.5rem;
            font-size: 1.2rem;
        }
        .success-content p {
            color: #6b7280;
            margin: 0;
        }
        .form-success-message {
            backdrop-filter: blur(5px);
            background: rgba(255,255,255,0.95);
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(successMessage);
    
    // Remove after 4 seconds
    setTimeout(() => {
        successMessage.remove();
        style.remove();
    }, 4000);
}

function showFormErrors(errors) {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'form-error-message';
    errorMessage.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-triangle"></i>
            <h4>Please fix the following errors:</h4>
            <ul>${errors.map(error => `<li>${error}</li>`).join('')}</ul>
        </div>
    `;
    
    errorMessage.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fef2f2;
        border: 1px solid #fecaca;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 20px rgba(239,68,68,0.1);
        z-index: 10000;
        max-width: 400px;
        animation: errorSlideIn 0.3s ease;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes errorSlideIn {
            from { opacity: 0; transform: translateX(100%); }
            to { opacity: 1; transform: translateX(0); }
        }
        .error-content i {
            color: #ef4444;
            margin-right: 0.5rem;
        }
        .error-content h4 {
            color: #b91c1c;
            margin: 0 0 0.5rem 0;
            font-size: 1rem;
        }
        .error-content ul {
            color: #991b1b;
            margin: 0;
            padding-left: 1.2rem;
        }
        .error-content li {
            margin-bottom: 0.25rem;
            font-size: 0.9rem;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(errorMessage);
    
    setTimeout(() => {
        errorMessage.remove();
        style.remove();
    }, 5000);
}

// Add form field error/success styles
const formStyle = document.createElement('style');
formStyle.textContent = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .form-group input.success,
    .form-group select.success,
    .form-group textarea.success {
        border-color: #10b981;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }
`;
document.head.appendChild(formStyle);

// Floating Contact Button functionality
document.addEventListener('DOMContentLoaded', function() {
    const floatingBtn = document.getElementById('floatingContactBtn');
    
    if (floatingBtn) {
        // Add pulse animation after page load
        setTimeout(() => {
            floatingBtn.classList.add('pulse');
        }, 3000);
        
        // WhatsApp functionality
        floatingBtn.addEventListener('click', function() {
            this.classList.remove('pulse');
            
            // Open WhatsApp with hospital number
            const phoneNumber = '254796780345'; // Hospital phone number
            const message = 'Hello! I would like to inquire about your medical services at Hopewell Hospital.';
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            
            window.open(whatsappUrl, '_blank');
        });
        
        // Show/hide based on scroll position
        let lastScrollTop = 0;
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            // Hide when at the bottom of the page (near footer)
            if (scrollTop + windowHeight >= documentHeight - 200) {
                floatingBtn.style.opacity = '0.7';
                floatingBtn.style.transform = 'translateY(5px)';
            } else {
                floatingBtn.style.opacity = '1';
                floatingBtn.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
        
        // Add floating button entrance animation
        setTimeout(() => {
            floatingBtn.style.opacity = '1';
            floatingBtn.style.transform = 'translateY(0)';
            floatingBtn.style.visibility = 'visible';
        }, 1000);
        
        // Initial state
        floatingBtn.style.opacity = '0';
        floatingBtn.style.transform = 'translateY(100px)';
        floatingBtn.style.visibility = 'hidden';
        floatingBtn.style.transition = 'opacity 0.5s ease, transform 0.5s ease, visibility 0.5s ease';
    }
});
