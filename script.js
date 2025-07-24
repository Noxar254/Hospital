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
