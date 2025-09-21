// Main JavaScript file for Vision 30 website
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollEffects();
    initAnimations();
    initInteractiveElements();
    initAccessibility();
    initFAQ();
    initAIChatbot();
    initV30Learnings(); // Add V30 learnings functionality
});

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // Navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinksArray = Array.from(navLinks);

    function highlightNavigation() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinksArray.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);
    highlightNavigation(); // Initial call
}

// Smooth scrolling for anchor links
function initScrollEffects() {
    // Smooth scroll for internal links
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    const heroAnimation = document.querySelector('.hero-animation');
    
    if (hero && heroAnimation) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroAnimation.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Animation functionality
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Stagger animation for grid items
                if (entry.target.classList.contains('about-grid') || 
                    entry.target.classList.contains('cta-grid') ||
                    entry.target.classList.contains('org-grid')) {
                    const items = entry.target.children;
                    Array.from(items).forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('animate-in');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(`
        .hero-content, .hero-visual, .section-header, 
        .about-grid, .about-card, .org-grid, .org-card,
        .cta-grid, .cta-card, .update-card, .footer-content
    `);

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    function animateCounters() {
        if (hasAnimated) return;
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.textContent);
            let count = 0;
            const increment = target / 80; 
            
            const timer = setInterval(() => {
                count += increment;
                if (count >= target) {
                    stat.textContent = target;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(count);
                }
            }, 40);
        });
        hasAnimated = true;
    }

    // Trigger counter animation when hero stats are visible
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(heroStats);
    }
}

// Interactive elements
function initInteractiveElements() {
    // Card hover effects
    const cards = document.querySelectorAll('.about-card, .org-card, .cta-card, .update-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Button ripple effect
    const buttons = document.querySelectorAll('.btn, .cta-button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                background-color: rgba(255, 255, 255, 0.7);
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple animation keyframes
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Image lazy loading
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Form validation and enhancement
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Add floating label effect
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });

            // Real-time validation
            input.addEventListener('input', function() {
                validateField(this);
            });
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(this)) {
                submitForm(this);
            }
        });
    });
}

// Accessibility enhancements
function initAccessibility() {
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Keyboard navigation for custom elements
    const interactiveElements = document.querySelectorAll('.nav-link, .btn, .cta-button, .card');
    interactiveElements.forEach(element => {
        if (!element.hasAttribute('tabindex') && element.tagName !== 'A' && element.tagName !== 'BUTTON') {
            element.setAttribute('tabindex', '0');
        }

        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // High contrast mode detection
    if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
        document.body.classList.add('high-contrast');
    }

    // Reduced motion detection
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduced-motion');
    }

    // Screen reader announcements
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Add screen reader announcements for dynamic content
    window.announceToScreenReader = announceToScreenReader;
}

// Form validation functions
function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    let isValid = true;
    let message = '';

    // Remove existing error styling
    field.classList.remove('error');
    const errorElement = field.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }

    // Required field validation
    if (required && !value) {
        isValid = false;
        message = 'This field is required';
    }

    // Email validation
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            message = 'Please enter a valid email address';
        }
    }

    // Phone validation
    if (type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            message = 'Please enter a valid phone number';
        }
    }

    // Display error if invalid
    if (!isValid && value) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: var(--danger-color);
            font-size: var(--font-size-sm);
            margin-top: var(--spacing-xs);
        `;
        field.parentElement.appendChild(errorDiv);
    }

    return isValid;
}

function validateForm(form) {
    const fields = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;

    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

function submitForm(form) {
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;

    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        // Success state
        submitButton.textContent = 'Submitted!';
        submitButton.style.background = 'var(--secondary-color)';
        
        // Announce success to screen readers
        if (window.announceToScreenReader) {
            window.announceToScreenReader('Form submitted successfully');
        }

        // Reset form after delay
        setTimeout(() => {
            form.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            submitButton.style.background = '';
        }, 2000);
    }, 1500);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance optimizations
const debouncedResize = debounce(() => {
    // Handle window resize events
    window.dispatchEvent(new Event('optimizedResize'));
}, 250);

const throttledScroll = throttle(() => {
    // Handle scroll events
    window.dispatchEvent(new Event('optimizedScroll'));
}, 16);

window.addEventListener('resize', debouncedResize);
window.addEventListener('scroll', throttledScroll);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Could send error reports to analytics service
});

// Service worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Dark mode toggle (optional feature)
function initDarkMode() {
    const darkModeToggle = document.querySelector('#dark-mode-toggle');
    if (!darkModeToggle) return;

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        
        if (window.announceToScreenReader) {
            window.announceToScreenReader(`Switched to ${theme} mode`);
        }
    });
}

// Initialize dark mode if toggle exists
document.addEventListener('DOMContentLoaded', initDarkMode);

// Export functions for use in other scripts
window.VisionThirty = {
    validateField,
    validateForm,
    submitForm,
    announceToScreenReader: window.announceToScreenReader,
    debounce,
    throttle
};

// FAQ functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle i');
        
        question.addEventListener('click', function() {
            const isOpen = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherToggle = otherItem.querySelector('.faq-toggle i');
                    otherAnswer.style.maxHeight = '0';
                    otherToggle.className = 'fas fa-plus';
                }
            });
            
            // Toggle current item
            if (isOpen) {
                item.classList.remove('active');
                answer.style.maxHeight = '0';
                toggle.className = 'fas fa-plus';
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                toggle.className = 'fas fa-minus';
            }
            
            // Announce to screen readers
            if (window.announceToScreenReader) {
                const questionText = question.querySelector('h3').textContent;
                window.announceToScreenReader(
                    isOpen ? `Collapsed ${questionText}` : `Expanded ${questionText}`
                );
            }
        });
        
        // Add keyboard support
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
        
        // Make focusable
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
        
        // Update aria-expanded when state changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    const isExpanded = item.classList.contains('active');
                    question.setAttribute('aria-expanded', isExpanded);
                }
            });
        });
        
        observer.observe(item, { attributes: true });
    });
}

// AI-Powered Chatbot functionality
function initAIChatbot() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    
    if (!chatbotToggle) return; // Exit if chatbot elements don't exist
    
    let isOpen = false;
    let conversationHistory = [];
    
    // Toggle chatbot visibility
    function toggleChatbot() {
        isOpen = !isOpen;
        chatbotContainer.classList.toggle('active', isOpen);
        chatbotContainer.setAttribute('aria-hidden', !isOpen);
        
        if (isOpen) {
            chatbotInput.focus();
            announceToScreenReader('Chatbot opened. Type your message about Vision 30.');
        } else {
            chatbotToggle.focus();
            announceToScreenReader('Chatbot closed.');
        }
    }
    
    // Screen reader announcements
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.textContent = message;
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    // Event listeners
    chatbotToggle.addEventListener('click', toggleChatbot);
    chatbotClose.addEventListener('click', toggleChatbot);
    
    // Handle input changes
    chatbotInput.addEventListener('input', function() {
        const hasText = this.value.trim().length > 0;
        chatbotSend.disabled = !hasText;
    });
    
    // Handle sending messages
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addMessage(message, 'user');
        chatbotInput.value = '';
        chatbotSend.disabled = true;
        
        // Show typing indicator
        showTypingIndicator();
        
        // Process message with AI (simulated for now)
        setTimeout(() => {
            hideTypingIndicator();
            processAIResponse(message);
        }, 1500);
    }
    
    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Quick action buttons
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.dataset.action;
            const queries = {
                'tracks': 'Tell me about the Vision 30 program tracks.',
                'apply': 'How can I apply for Vision 30?',
                'eligibility': 'What are the eligibility criteria for Vision 30?',
                'accessibility': 'What accessibility features does Vision 30 provide?'
            };
            
            if (queries[action]) {
                chatbotInput.value = queries[action];
                chatbotSend.disabled = false;
                sendMessage();
            }
        });
    });
    
    // Add message to chat
    function addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        if (typeof content === 'string') {
            messageContent.innerHTML = `<p>${content}</p>`;
        } else {
            messageContent.appendChild(content);
        }
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        
        // Store in conversation history
        conversationHistory.push({ sender, content: typeof content === 'string' ? content : content.textContent });
        
        // Announce new message to screen readers
        if (sender === 'bot') {
            announceToScreenReader(`AI Assistant: ${typeof content === 'string' ? content : content.textContent}`);
        }
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <span>AI is thinking</span>
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Process AI response (enhanced with Vision 30 specific knowledge)
    function processAIResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        let response = '';
        
        // Vision 30 specific responses
        if (lowerMessage.includes('track') || lowerMessage.includes('program')) {
            response = `Vision 30 offers three specialized tracks:

• **V30-GEN**: General skill building for Classes 8-10 students (₹12.5 Lacs/year)
• **V30-STEM**: Focused STEM development for Classes 8-10 (₹34 Lacs/year)
• **V30-HED**: Higher education support for Classes 11-12 (₹85,000/student/year)

Each track is designed to meet students at their educational stage. Would you like to know more about a specific track?`;
        } else if (lowerMessage.includes('apply') || lowerMessage.includes('application')) {
            response = `To apply for Vision 30:

1. **School Nomination**: Students are nominated from ~10-15 select special schools
2. **Academic Assessment**: Above-average performance in Science & Math required
3. **Baseline Testing**: Assessment in Aptitude, English, Math, Science, and Computer Science
4. **Motivation Review**: Demonstration of self-drive and commitment

Applications are currently being accepted. Visit our Apply page for detailed instructions!`;
        } else if (lowerMessage.includes('eligib') || lowerMessage.includes('criteria')) {
            response = `Vision 30 eligibility criteria:

• **Students**: Classes 8-12 from special schools for visually impaired
• **Academic Performance**: Above-average grades in Science and Mathematics
• **Commitment**: Willingness to dedicate extra time for preparation
• **School Support**: Teacher and principal recommendations required

We welcome students with visual impairments who are passionate about STEM fields!`;
        } else if (lowerMessage.includes('accessib') || lowerMessage.includes('blind') || lowerMessage.includes('vision')) {
            response = `Vision 30 prioritizes accessibility:

• **Screen Reader Compatible**: All materials work with NVDA, JAWS
• **Specialized Labs**: Accessible science equipment and tools
• **Assistive Technology**: Latest tools for STEM learning
• **Accessible Formats**: Braille, audio, and tactile materials
• **Trained Instructors**: Teachers skilled in inclusive education

Our program is designed specifically for blind and low-vision students!`;
        } else if (lowerMessage.includes('cost') || lowerMessage.includes('fee') || lowerMessage.includes('budget')) {
            response = `Vision 30 program costs:

• **V30-GEN**: ₹12.5 Lacs per year
• **V30-STEM**: ₹34 Lacs per year (for 6 students)
• **V30-HED**: ₹85,000 per student per year

We work with funding partners and may offer scholarships. Financial assistance options are available for deserving students.`;
        } else if (lowerMessage.includes('organization') || lowerMessage.includes('vision empower') || lowerMessage.includes('i-stem')) {
            response = `Vision 30 is a collaboration between:

• **Vision Empower (VE)**: Founded 2017, supports 145 special schools across 15 states
• **I-Stem**: Digital inclusion platform making 96%+ of content accessible

Together, we're creating an inclusive STEM education ecosystem for visually impaired students across India.`;
        } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            response = `Hello! I'm the Vision 30 AI Assistant. I'm here to help you learn about our transformative STEM education program for blind and low-vision students. What would you like to know?`;
        } else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
            response = `You're welcome! I'm always here to help with Vision 30 questions. Feel free to ask about our programs, application process, or accessibility features anytime!`;
        } else {
            // General response for unrecognized queries
            response = `I'd be happy to help you with information about Vision 30! I can assist with:

• Program tracks and details
• Application process
• Eligibility criteria  
• Accessibility features
• Organizations involved
• Costs and funding

What specific aspect would you like to learn about?`;
        }
        
        // Add response to chat
        addMessage(response, 'bot');
    }
    
    // Keyboard navigation for accessibility
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isOpen) {
            toggleChatbot();
        }
    });
    
    // Focus management
    chatbotContainer.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            const focusableElements = chatbotContainer.querySelectorAll(
                'button, input, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
    
    // Close chatbot when clicking outside
    document.addEventListener('click', function(e) {
        if (isOpen && !chatbotContainer.contains(e.target) && !chatbotToggle.contains(e.target)) {
            toggleChatbot();
        }
    });
}

// Enhanced V30 Learnings Section Functionality
function initV30Learnings() {
    // Initialize AOS (Animate On Scroll) if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            disable: false
        });
        document.body.classList.add('aos-animate');
    } else {
        // Fallback: show all content immediately if AOS doesn't load
        const learningCards = document.querySelectorAll('.learning-card');
        learningCards.forEach(card => {
            card.classList.add('revealed');
        });
    }

    // Enhanced counter animation with slower pace as per memory
    const statNumbers = document.querySelectorAll('.v30-learnings .stat-number[data-target]');
    let hasAnimatedStats = false;

    function animateStatCounters() {
        if (hasAnimatedStats) return;
        
        statNumbers.forEach((stat, index) => {
            const target = parseInt(stat.getAttribute('data-target'));
            let count = 0;
            const increment = target / 80; // Using memory specification: divisor of 80
            
            setTimeout(() => {
                const timer = setInterval(() => {
                    count += increment;
                    if (count >= target) {
                        stat.textContent = target;
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.floor(count);
                    }
                }, 60); // Using memory specification: 60ms interval
            }, index * 200); // Stagger each counter
        });
        hasAnimatedStats = true;
    }

    // Progress bar animations
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.v30-learnings .progress-bar[data-progress]');
        
        progressBars.forEach((bar, index) => {
            const progress = parseInt(bar.getAttribute('data-progress'));
            
            setTimeout(() => {
                bar.style.width = progress + '%';
            }, index * 150);
        });
    }

    // Enhanced card interactions with accessibility
    const learningCards = document.querySelectorAll('.learning-card');
    
    learningCards.forEach((card, index) => {
        // Ensure card is visible by default
        if (!card.classList.contains('revealed')) {
            card.classList.add('revealed');
        }

        // Add keyboard navigation
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });

        // Enhanced hover effects with border transitions (per memory)
        card.addEventListener('mouseenter', function() {
            this.style.borderLeftColor = '#3b82f6'; // Blue on hover
            this.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.borderLeftColor = 'transparent';
            this.style.transform = 'translateY(-4px)';
        });

        // Focus states for accessibility
        card.addEventListener('focus', function() {
            this.style.borderLeftColor = '#10b981'; // Green on focus/active
            this.style.outline = '2px solid #10b981';
            this.style.outlineOffset = '2px';
        });

        card.addEventListener('blur', function() {
            this.style.borderLeftColor = 'transparent';
            this.style.outline = 'none';
        });

        // Click interactions
        card.addEventListener('click', function(e) {
            // Add ripple effect
            createRippleEffect(this, e);
            
            // Temporary active state
            this.style.borderLeftColor = '#10b981';
            setTimeout(() => {
                this.style.borderLeftColor = 'transparent';
            }, 300);
        });
    });

    // Intersection Observer for triggering animations
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };

    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStatCounters();
                animateProgressBars();
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe the stats section
    const statsSection = document.querySelector('.v30-learnings .summary-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Card reveal animation on scroll (fallback for AOS)
    const cardObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    // Only use card observer if AOS is not available
    if (typeof AOS === 'undefined') {
        learningCards.forEach(card => {
            cardObserver.observe(card);
        });
    }

    // Ripple effect function
    function createRippleEffect(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple-effect');
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Keyboard navigation for takeaways
    const takeawayItems = document.querySelectorAll('.takeaway-item');
    takeawayItems.forEach(item => {
        item.setAttribute('tabindex', '0');
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            }
        });
    });

    // Enhanced scroll-triggered animations for decorative elements
    const decorativeElements = document.querySelectorAll('.section-decorations .deco-circle, .section-decorations .deco-line');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.002;
        
        decorativeElements.forEach((element, index) => {
            const direction = index % 2 === 0 ? 1 : -1;
            element.style.transform = `translate(${rate * direction * 20}px, ${rate * 10}px) rotate(${rate * direction * 45}deg)`;
        });
    });

    console.log('V30 Learnings section initialized with enhanced interactions and accessibility');
}