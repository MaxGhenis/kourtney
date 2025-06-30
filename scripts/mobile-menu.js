/**
 * Modern Academic Site JavaScript
 * Mobile-first, accessible interactions
 */

(function() {
    'use strict';

    // DOM elements
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    // Initialize the application
    function init() {
        setupNavigation();
        setupAnimations();
        setupAccessibility();
        setupUtils();
    }

    /**
     * Setup responsive navigation
     */
    function setupNavigation() {
        if (!navToggle || !mainNav) return;

        // Toggle navigation menu
        navToggle.addEventListener('click', function() {
            const isOpen = mainNav.classList.contains('is-open');
            
            if (isOpen) {
                closeNav();
            } else {
                openNav();
            }
        });

        // Close navigation when clicking on links (mobile)
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 768) {
                    closeNav();
                }
            });
        });

        // Close navigation when clicking outside (mobile)
        document.addEventListener('click', function(e) {
            if (window.innerWidth < 768 && 
                !mainNav.contains(e.target) && 
                !navToggle.contains(e.target) &&
                mainNav.classList.contains('is-open')) {
                closeNav();
            }
        });

        // Close navigation on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
                closeNav();
                navToggle.focus();
            }
        });

        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth >= 768) {
                    closeNav();
                }
            }, 150);
        });
    }

    /**
     * Open navigation menu
     */
    function openNav() {
        mainNav.classList.add('is-open');
        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.innerHTML = '<i class="fas fa-times"></i>';
        
        // Focus first nav link for keyboard users
        const firstNavLink = mainNav.querySelector('.nav-link');
        if (firstNavLink) {
            setTimeout(() => firstNavLink.focus(), 100);
        }
        
        // Prevent body scroll on mobile
        if (window.innerWidth < 768) {
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Close navigation menu
     */
    function closeNav() {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        
        // Restore body scroll
        document.body.style.overflow = '';
    }

    /**
     * Setup scroll animations
     */
    function setupAnimations() {
        // Intersection Observer for fade-in animations
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animationDelay = Math.random() * 0.3 + 's';
                        entry.target.classList.add('fade-in-up');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observe elements that should animate
            const animatedElements = document.querySelectorAll('.publication-item, .education-item, .content-section');
            animatedElements.forEach(el => {
                observer.observe(el);
            });
        }
    }

    /**
     * Setup accessibility features
     */
    function setupAccessibility() {
        // Add proper ARIA labels and roles where needed
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            const icon = link.querySelector('i');
            if (icon && !link.getAttribute('aria-label')) {
                const iconClass = icon.className;
                let platform = 'Link';
                
                if (iconClass.includes('linkedin')) platform = 'LinkedIn';
                else if (iconClass.includes('twitter')) platform = 'Twitter';
                else if (iconClass.includes('github')) platform = 'GitHub';
                else if (iconClass.includes('google-scholar')) platform = 'Google Scholar';
                else if (iconClass.includes('orcid')) platform = 'ORCID';
                else if (iconClass.includes('researchgate')) platform = 'ResearchGate';
                else if (iconClass.includes('academia')) platform = 'Academia.edu';
                else if (iconClass.includes('cv')) platform = 'CV';
                
                link.setAttribute('aria-label', platform + ' profile');
            }
        });

        // Enhance publication details
        const detailsElements = document.querySelectorAll('.publication-details');
        detailsElements.forEach(details => {
            const summary = details.querySelector('summary');
            if (summary) {
                summary.setAttribute('role', 'button');
                summary.setAttribute('aria-expanded', 'false');
                
                details.addEventListener('toggle', function() {
                    summary.setAttribute('aria-expanded', details.open);
                });
            }
        });
    }

    /**
     * Setup utility functions
     */
    function setupUtils() {
        // Smooth scroll for anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 80; // Account for fixed header
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Add loading states for external links
        const externalLinks = document.querySelectorAll('a[target="_blank"]');
        externalLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Add a small loading indicator
                const originalText = this.textContent;
                this.style.opacity = '0.7';
                
                setTimeout(() => {
                    this.style.opacity = '1';
                }, 300);
            });
        });

        // Copy email functionality (if email button exists)
        const emailButton = document.querySelector('.tooltip button');
        if (emailButton) {
            emailButton.addEventListener('click', function() {
                const emailText = this.textContent.trim();
                const email = emailText.replace(' α.τ. ', '@');
                
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(email).then(() => {
                        showTooltip('Email copied!');
                    }).catch(() => {
                        fallbackCopyEmail(email);
                    });
                } else {
                    fallbackCopyEmail(email);
                }
            });
        }
    }

    /**
     * Show tooltip message
     */
    function showTooltip(message) {
        const tooltip = document.querySelector('#myTooltip');
        if (tooltip) {
            const originalText = tooltip.textContent;
            tooltip.textContent = message;
            
            setTimeout(() => {
                tooltip.textContent = originalText;
            }, 2000);
        }
    }

    /**
     * Fallback email copy function
     */
    function fallbackCopyEmail(email) {
        const textArea = document.createElement('textarea');
        textArea.value = email;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showTooltip('Email copied!');
        } catch (err) {
            console.error('Failed to copy email:', err);
            showTooltip('Copy failed');
        }
        
        document.body.removeChild(textArea);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Performance optimization: Debounce scroll events
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

    // Add scroll-based header styling
    const header = document.querySelector('.site-header');
    if (header) {
        const debouncedScroll = debounce(() => {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = 'white';
                header.style.backdropFilter = 'none';
            }
        }, 10);

        window.addEventListener('scroll', debouncedScroll);
    }

})();