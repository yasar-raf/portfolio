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
    // Contact Form with reCAPTCHA & OTP Verification
    // ===================================
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const BACKEND_URL = 'https://portfolio-production-91f1.up.railway.app/'; // Railway backend URL

    if (contactForm) {
        // Form elements
        const emailInput = document.getElementById('email');
        const nameInput = document.getElementById('name');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');
        const otpInput = document.getElementById('otp');

        // Section elements
        const emailVerificationSection = document.getElementById('email-verification-section');
        const otpVerificationSection = document.getElementById('otp-verification-section');
        const formSection = document.getElementById('form-section');

        // Button elements
        const sendOtpBtn = document.getElementById('send-otp-btn');
        const verifyOtpBtn = document.getElementById('verify-otp-btn');
        const resendOtpLink = document.getElementById('resend-otp-link');
        const submitBtn = contactForm.querySelector('.btn-submit');

        // State
        let verifiedEmail = null;
        let isOtpVerified = false;

        // Email validation regex
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        // Helper: Show status message
        function showStatus(message, type = 'info') {
            formStatus.textContent = message;
            formStatus.className = `form-status ${type}`;
        }

        // Helper: Set button loading state
        function setButtonLoading(btn, isLoading) {
            const btnText = btn.querySelector('.btn-text');
            const btnLoading = btn.querySelector('.btn-loading');
            btn.disabled = isLoading;
            if (isLoading) {
                btnText.style.display = 'none';
                btnLoading.style.display = 'inline';
            } else {
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
            }
        }

        // Helper: Get reCAPTCHA token
        function getRecaptchaToken() {
            return new Promise((resolve) => {
                grecaptcha.ready(function() {
                    grecaptcha.execute('6LdfhCIsAAAAAMnS3mBat4DdJRXuvzOh4UEfjkmz', {action: 'submit'}).then(function(token) {
                        resolve(token);
                    });
                });
            });
        }

        // Send OTP
        sendOtpBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();

            // Validate email
            if (!email || !emailRegex.test(email)) {
                const errorEl = document.getElementById('email-error');
                errorEl.textContent = 'Please enter a valid email address';
                emailInput.classList.add('error');
                return;
            }

            // Clear error
            document.getElementById('email-error').textContent = '';
            emailInput.classList.remove('error');

            // Get reCAPTCHA token
            setButtonLoading(sendOtpBtn, true);
            try {
                const recaptchaToken = await getRecaptchaToken();

                // Verify reCAPTCHA with backend
                const recaptchaResponse = await fetch(`${BACKEND_URL}/api/verify-recaptcha`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: recaptchaToken })
                });

                if (!recaptchaResponse.ok) {
                    const error = await recaptchaResponse.json();
                    showStatus(error.error || 'reCAPTCHA verification failed', 'error');
                    setButtonLoading(sendOtpBtn, false);
                    return;
                }

                // Send OTP
                const otpResponse = await fetch(`${BACKEND_URL}/api/send-otp`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email })
                });

                if (!otpResponse.ok) {
                    const error = await otpResponse.json();
                    showStatus(error.error || 'Failed to send OTP', 'error');
                    setButtonLoading(sendOtpBtn, false);
                    return;
                }

                // Success - show OTP section
                verifiedEmail = email;
                emailInput.disabled = true;
                emailVerificationSection.style.display = 'none';
                otpVerificationSection.style.display = 'block';
                showStatus('OTP sent! Check your email.', 'success');
                otpInput.focus();
            } catch (error) {
                showStatus('Error: ' + error.message, 'error');
                console.error('Send OTP error:', error);
            } finally {
                setButtonLoading(sendOtpBtn, false);
            }
        });

        // Verify OTP
        verifyOtpBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const otp = otpInput.value.trim();

            if (!otp || otp.length !== 6 || isNaN(otp)) {
                document.getElementById('otp-error').textContent = 'Please enter a valid 6-digit OTP';
                otpInput.classList.add('error');
                return;
            }

            document.getElementById('otp-error').textContent = '';
            otpInput.classList.remove('error');

            setButtonLoading(verifyOtpBtn, true);
            try {
                const response = await fetch(`${BACKEND_URL}/api/verify-otp`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: verifiedEmail, otp: otp })
                });

                if (!response.ok) {
                    const error = await response.json();
                    const errorMsg = error.error + (error.attemptsLeft ? ` (${error.attemptsLeft} attempts left)` : '');
                    showStatus(errorMsg, 'error');
                    document.getElementById('otp-error').textContent = error.error;
                    otpInput.classList.add('error');
                    setButtonLoading(verifyOtpBtn, false);
                    return;
                }

                // Success - show form section
                isOtpVerified = true;
                otpVerificationSection.style.display = 'none';
                formSection.style.display = 'block';
                showStatus('Email verified! Please fill in your details.', 'success');
                nameInput.focus();
            } catch (error) {
                showStatus('Error: ' + error.message, 'error');
                console.error('Verify OTP error:', error);
            } finally {
                setButtonLoading(verifyOtpBtn, false);
            }
        });

        // Resend OTP
        resendOtpLink.addEventListener('click', async (e) => {
            e.preventDefault();
            setButtonLoading(sendOtpBtn, true);
            try {
                const response = await fetch(`${BACKEND_URL}/api/send-otp`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: verifiedEmail })
                });

                if (!response.ok) {
                    const error = await response.json();
                    showStatus(error.error || 'Failed to resend OTP', 'error');
                    return;
                }

                showStatus('New OTP sent! Check your email.', 'success');
                otpInput.value = '';
                document.getElementById('otp-error').textContent = '';
                otpInput.classList.remove('error', 'success');
                otpInput.focus();
            } catch (error) {
                showStatus('Error: ' + error.message, 'error');
            } finally {
                setButtonLoading(sendOtpBtn, false);
            }
        });

        // Real-time validation
        const validateField = (input, errorId, validationFn, errorMessage) => {
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
        };

        nameInput.addEventListener('input', () => {
            validateField(nameInput, 'name-error', (v) => v.length >= 2, 'Name must be at least 2 characters');
        });

        subjectInput.addEventListener('input', () => {
            validateField(subjectInput, 'subject-error', (v) => v.length >= 3, 'Subject must be at least 3 characters');
        });

        messageInput.addEventListener('input', () => {
            validateField(messageInput, 'message-error', (v) => v.length >= 10, 'Message must be at least 10 characters');
        });

        // Form submission
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!isOtpVerified) {
                showStatus('Please verify your email first', 'error');
                return;
            }

            // Validate form fields
            const isNameValid = validateField(nameInput, 'name-error', (v) => v.length >= 2, 'Name must be at least 2 characters');
            const isSubjectValid = validateField(subjectInput, 'subject-error', (v) => v.length >= 3, 'Subject must be at least 3 characters');
            const isMessageValid = validateField(messageInput, 'message-error', (v) => v.length >= 10, 'Message must be at least 10 characters');

            if (!isNameValid || !isSubjectValid || !isMessageValid) {
                showStatus('Please fix the errors above', 'error');
                return;
            }

            setButtonLoading(submitBtn, true);
            try {
                const response = await fetch(`${BACKEND_URL}/api/submit-contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: verifiedEmail,
                        name: nameInput.value.trim(),
                        subject: subjectInput.value.trim(),
                        message: messageInput.value.trim()
                    })
                });

                if (!response.ok) {
                    const error = await response.json();
                    showStatus(error.error || 'Failed to submit form', 'error');
                    setButtonLoading(submitBtn, false);
                    return;
                }

                // Success
                showStatus('Thank you! Your message has been sent. Check your email for confirmation.', 'success');

                // Reset form
                contactForm.reset();
                isOtpVerified = false;
                verifiedEmail = null;
                emailInput.disabled = false;
                formSection.style.display = 'none';
                emailVerificationSection.style.display = 'block';
                [emailInput, nameInput, subjectInput, messageInput, otpInput].forEach(input => {
                    input.classList.remove('success', 'error');
                });
            } catch (error) {
                showStatus('Error: ' + error.message, 'error');
                console.error('Form submission error:', error);
            } finally {
                setButtonLoading(submitBtn, false);
            }
        });
    }

})();
