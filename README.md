# Hopewell Hospital Website

A modern, responsive hospital website built with HTML, CSS, and JavaScript featuring a professional two-tier navigation system and smooth animations.

## Features

### Navigation
- **Desktop**: Two-tier navigation bar
  - Top tier: Logo with hospital name and social media icons
  - Bottom tier: Main navigation menu with dropdown services
- **Mobile**: Single-tier with hamburger menu and logo
- Smooth scroll-to-section functionality
- Active link highlighting based on scroll position

### Design
- **Typography**: Montserrat font family
- **Colors**: 
  - Primary: Blue (#2563eb)
  - Accent: Pink (#ec4899) for buttons and highlights
  - Professional healthcare color palette
- **Animations**: 
  - Smooth transitions and hover effects
  - Mobile menu slide animations
  - Intersection observer for section reveals
  - Pulsing logo animation

### Responsive Design
- Mobile-first approach
- Breakpoint at 768px
- Touch-friendly mobile navigation
- Optimized for all screen sizes

## Navigation Structure

### Main Menu Items
- Home
- About Us
- Services (with dropdown)
  - Emergency Care
  - Surgery
  - Cardiology
  - Pediatrics
- Mental Health
- Home Care
- Medical Tourism
- Contact (styled as CTA button)

### Social Media Links
- Facebook
- Twitter
- Instagram
- LinkedIn
- YouTube

## File Structure

```
Hopewell Hospital/
├── index.html          # Main HTML file
├── style.css           # Stylesheet with responsive design
├── script.js           # JavaScript for navigation functionality
├── README.md           # Project documentation
└── .github/
    └── copilot-instructions.md
```

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Safari-specific webkit prefixes included

## Usage

1. Open `index.html` in a web browser
2. Navigate through sections using the menu
3. Test responsive design by resizing the browser window
4. On mobile, use the hamburger menu to access navigation

## Customization

- Colors can be modified in CSS custom properties (`:root` variables)
- Navigation items can be added/removed in the HTML
- Social media links can be updated with actual URLs
- Content sections can be expanded with real hospital information

## Future Enhancements

- Appointment booking system
- Doctor profiles and scheduling
- Patient portal integration
- Blog/news section
- Multi-language support
- Contact forms with validation
