/**
 * Yasar Arafath J - Portfolio Website
 * JavaScript for animations and interactivity
 */

(function() {
    'use strict';

    // ===================================
    // DOM Elements
    // ===================================
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('.section');
    const revealElements = document.querySelectorAll('.project-card, .skill-category, .stat-item, .contact-item, .about-text');

    // ===================================
    // Mobile Navigation
    // ===================================
    function toggleMobileNav() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');

        // Update ARIA attribute
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
    }

    function closeMobileNav() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    }

    // Event Listeners for mobile nav
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileNav);
    }

    // Close mobile nav when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            closeMobileNav();
        }
    });

    // ===================================
    // Smooth Scrolling
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===================================
    // Navbar Scroll Effect
    // ===================================
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNavbar() {
        const scrollY = window.scrollY;

        // Add/remove background opacity based on scroll
        if (scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 11, 0.95)';
        } else {
            navbar.style.background = 'rgba(10, 10, 11, 0.8)';
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });

    // ===================================
    // Scroll Reveal Animation
    // ===================================
    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('reveal', 'active');
            }
        });
    }

    // Add reveal class to elements
    revealElements.forEach(element => {
        element.classList.add('reveal');
    });

    // Initial check and scroll listener
    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('load', revealOnScroll);

    // ===================================
    // Active Navigation Link Highlighting
    // ===================================
    function highlightActiveNav() {
        const scrollY = window.scrollY;
        const navHeight = navbar ? navbar.offsetHeight : 0;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveNav);

    // ===================================
    // Intersection Observer for Performance
    // ===================================
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Optionally stop observing after animation
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(element => {
            observer.observe(element);
        });
    }

    // ===================================
    // Staggered Animation for Project Cards
    // ===================================
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // ===================================
    // Skill Tags Hover Effect
    // ===================================
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // ===================================
    // Contact Items Animation
    // ===================================
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });

    // ===================================
    // Keyboard Navigation Support
    // ===================================
    document.addEventListener('keydown', (e) => {
        // Close mobile nav on Escape key
        if (e.key === 'Escape') {
            closeMobileNav();
        }
    });

    // ===================================
    // Performance: Debounce Function
    // ===================================
    function debounce(func, wait = 20) {
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

    // Apply debouncing to scroll handlers
    const debouncedReveal = debounce(revealOnScroll);
    const debouncedHighlight = debounce(highlightActiveNav);

    // ===================================
    // Console Welcome Message
    // ===================================
    console.log('%c Welcome to Yasar Arafath J\'s Portfolio!',
        'background: #06b6d4; color: #0a0a0b; padding: 10px 20px; font-size: 16px; font-weight: bold; border-radius: 4px;');
    console.log('%c Built with vanilla HTML, CSS & JavaScript',
        'color: #a1a1aa; padding: 5px 0;');

    // ===================================
    // Date Time Display
    // ===================================
    const datetimeDisplay = document.getElementById('datetime-display');
    const currentTimeEl = document.getElementById('current-time');
    const currentDateEl = document.getElementById('current-date');

    function updateDateTime() {
        const now = new Date();

        // Format time (HH:MM:SS)
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        const timeString = now.toLocaleTimeString('en-US', timeOptions);

        // Format date (Day, Month DD, YYYY)
        const dateOptions = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        const dateString = now.toLocaleDateString('en-US', dateOptions);

        if (currentTimeEl) currentTimeEl.textContent = timeString;
        if (currentDateEl) currentDateEl.textContent = dateString;
    }

    function toggleDateTimeDisplay() {
        if (datetimeDisplay) {
            if (window.scrollY > 100) {
                datetimeDisplay.classList.add('visible');
            } else {
                datetimeDisplay.classList.remove('visible');
            }
        }
    }

    // Update time every second
    if (currentTimeEl && currentDateEl) {
        updateDateTime();
        setInterval(updateDateTime, 1000);
    }

    // Show/hide based on scroll
    window.addEventListener('scroll', toggleDateTimeDisplay);

    // ===================================
    // Page Load Complete
    // ===================================
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');

        // Trigger initial animations
        setTimeout(() => {
            revealOnScroll();
        }, 100);

        // Initial check for datetime display
        toggleDateTimeDisplay();
    });

    // ===================================
    // Contact Form Validation & Submission
    // ===================================
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        const emailInput = document.getElementById('email');
        const nameInput = document.getElementById('name');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');
        const submitBtn = contactForm.querySelector('.btn-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        // Email validation regex
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        // Validate individual field
        function validateField(input, errorId, validationFn, errorMessage) {
            const errorElement = document.getElementById(errorId);
            const value = input.value.trim();

            if (!value) {
                input.classList.remove('success', 'error');
                errorElement.textContent = '';
                return false;
            }

            if (validationFn(value)) {
                input.classList.remove('error');
                input.classList.add('success');
                errorElement.textContent = '';
                return true;
            } else {
                input.classList.remove('success');
                input.classList.add('error');
                errorElement.textContent = errorMessage;
                return false;
            }
        }

        // Validation functions
        function validateEmail(value) {
            return emailRegex.test(value);
        }

        function validateName(value) {
            return value.length >= 2;
        }

        function validateSubject(value) {
            return value.length >= 3;
        }

        function validateMessage(value) {
            return value.length >= 10;
        }

        // Real-time validation on input
        emailInput.addEventListener('input', () => {
            validateField(emailInput, 'email-error', validateEmail, 'Please enter a valid email address');
        });

        nameInput.addEventListener('input', () => {
            validateField(nameInput, 'name-error', validateName, 'Name must be at least 2 characters');
        });

        subjectInput.addEventListener('input', () => {
            validateField(subjectInput, 'subject-error', validateSubject, 'Subject must be at least 3 characters');
        });

        messageInput.addEventListener('input', () => {
            validateField(messageInput, 'message-error', validateMessage, 'Message must be at least 10 characters');
        });

        // Validate all fields
        function validateForm() {
            const isEmailValid = validateField(emailInput, 'email-error', validateEmail, 'Please enter a valid email address');
            const isNameValid = validateField(nameInput, 'name-error', validateName, 'Name must be at least 2 characters');
            const isSubjectValid = validateField(subjectInput, 'subject-error', validateSubject, 'Subject must be at least 3 characters');
            const isMessageValid = validateField(messageInput, 'message-error', validateMessage, 'Message must be at least 10 characters');

            return isEmailValid && isNameValid && isSubjectValid && isMessageValid;
        }

        // Form submission
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Clear previous status
            formStatus.textContent = '';
            formStatus.className = 'form-status';

            // Validate all fields
            if (!validateForm()) {
                formStatus.textContent = 'Please fix the errors above';
                formStatus.classList.add('error');
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';

            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success
                    formStatus.textContent = 'Thank you! Your message has been sent. I will reply to your email soon.';
                    formStatus.classList.add('success');
                    contactForm.reset();

                    // Remove success classes from inputs
                    [emailInput, nameInput, subjectInput, messageInput].forEach(input => {
                        input.classList.remove('success', 'error');
                    });
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                formStatus.textContent = 'Oops! Something went wrong. Please try again or email me directly.';
                formStatus.classList.add('error');
                console.error('Form submission error:', error);
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
            }
        });
    }

})();
