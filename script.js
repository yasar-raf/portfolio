/**
 * Yasar Arafath - Portfolio Website
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
    console.log('%c Welcome to Yasar Arafath\'s Portfolio!',
        'background: #06b6d4; color: #0a0a0b; padding: 10px 20px; font-size: 16px; font-weight: bold; border-radius: 4px;');
    console.log('%c Built with vanilla HTML, CSS & JavaScript',
        'color: #a1a1aa; padding: 5px 0;');

    // ===================================
    // Page Load Complete
    // ===================================
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');

        // Trigger initial animations
        setTimeout(() => {
            revealOnScroll();
        }, 100);
    });

})();
