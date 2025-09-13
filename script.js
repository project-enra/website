// 🔮 VEILGLASS - CUTTING EDGE 2025 MYSTICAL EXPERIENCE 🔮

// Email form handling
document.addEventListener('DOMContentLoaded', function() {
    const emailForm = document.getElementById('emailForm');
    const successMessage = document.getElementById('successMessage');
    
    if (emailForm) {
        emailForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Bot protection: check honeypot field
            const honeypot = emailForm.querySelector('input[name="website"]');
            if (honeypot && honeypot.value !== '') {
                // Silent fail for bots
                console.log('Bot detected');
                return;
            }
            
            // Rate limiting: prevent rapid submissions
            const lastSubmission = localStorage.getItem('lastEmailSubmission');
            const now = Date.now();
            if (lastSubmission && (now - parseInt(lastSubmission)) < 30000) {
                alert('Please wait before submitting again.');
                return;
            }
            
            const formData = new FormData(emailForm);
            const submitBtn = emailForm.querySelector('.mystical-submit');
            const btnText = submitBtn.querySelector('.btn-text');
            const originalText = btnText.textContent;
            
            // Show loading state
            btnText.textContent = 'Joining the Circle...';
            submitBtn.disabled = true;
            
            try {
                // Submit to Mailchimp via AJAX (no redirect)
                const response = await fetch(emailForm.action, {
                    method: 'POST',
                    body: formData,
                    mode: 'no-cors' // Mailchimp doesn't support CORS, but submission still works
                });
                
                // Store submission time
                localStorage.setItem('lastEmailSubmission', now.toString());
                
                // Show success message (assume success since Mailchimp doesn't return proper CORS)
                emailForm.style.display = 'none';
                successMessage.style.display = 'block';
                
                // Add mystical entrance animation
                successMessage.style.opacity = '0';
                successMessage.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    successMessage.style.transition = 'all 0.6s ease';
                    successMessage.style.opacity = '1';
                    successMessage.style.transform = 'translateY(0)';
                }, 100);
                
            } catch (error) {
                console.error('Error:', error);
                btnText.textContent = 'Try Again';
                alert('The mystical energies are disrupted. Please try again.');
            } finally {
                setTimeout(() => {
                    btnText.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    }
});

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
});

// 🌟 MYSTICAL CANVAS PARTICLE SYSTEM 🌟
class MysticalParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.resize();
        this.init();
        this.animate();
        
        // Mouse interaction
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        for (let i = 0; i < 150; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                hue: Math.random() * 60 + 30, // Golden hues
                life: Math.random() * 100 + 50,
                maxLife: 100,
                pulse: Math.random() * Math.PI * 2
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Create mystical connections
        this.drawConnections();
        
        // Update and draw particles
        this.particles.forEach((particle, index) => {
            this.updateParticle(particle);
            this.drawParticle(particle);
            
            // Respawn particles
            if (particle.life <= 0) {
                this.particles[index] = {
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 3 + 1,
                    opacity: Math.random() * 0.5 + 0.2,
                    hue: Math.random() * 60 + 30,
                    life: Math.random() * 100 + 50,
                    maxLife: 100,
                    pulse: Math.random() * Math.PI * 2
                };
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    updateParticle(particle) {
        // Mouse attraction
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            const force = (100 - distance) / 100;
            particle.vx += (dx / distance) * force * 0.01;
            particle.vy += (dy / distance) * force * 0.01;
        }
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Boundary wrapping
        if (particle.x < 0) particle.x = this.canvas.width;
        if (particle.x > this.canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = this.canvas.height;
        if (particle.y > this.canvas.height) particle.y = 0;
        
        // Update life and pulse
        particle.life--;
        particle.pulse += 0.05;
    }
    
    drawParticle(particle) {
        const pulseFactor = Math.sin(particle.pulse) * 0.3 + 0.7;
        const size = particle.size * pulseFactor;
        
        this.ctx.save();
        this.ctx.globalAlpha = particle.opacity * (particle.life / particle.maxLife);
        
        // Create gradient
        const gradient = this.ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, size * 2
        );
        gradient.addColorStop(0, `hsla(${particle.hue}, 80%, 60%, 1)`);
        gradient.addColorStop(1, `hsla(${particle.hue}, 80%, 60%, 0)`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    drawConnections() {
        this.particles.forEach((particle, i) => {
            this.particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const opacity = (120 - distance) / 120 * 0.1;
                    this.ctx.save();
                    this.ctx.globalAlpha = opacity;
                    this.ctx.strokeStyle = '#D28117';
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.stroke();
                    this.ctx.restore();
                }
            });
        });
    }
}

// 🎭 SIMPLE TEXT ANIMATION SYSTEM 🎭
class TextAnimator {
    constructor() {
        this.initSimpleAnimations();
    }
    
    initSimpleAnimations() {
        const title = document.getElementById('animated-title');
        const subtitle = document.getElementById('animated-subtitle');
        
        if (title && subtitle) {
            // Simple fade-in animations instead of typewriter
            setTimeout(() => {
                title.style.opacity = '1';
                title.style.transform = 'translateY(0)';
            }, 500);
            
            setTimeout(() => {
                subtitle.style.opacity = '1';
                subtitle.style.transform = 'translateY(0)';
            }, 1000);
        }
    }
}

// 🃏 SIMPLE CARD HOVER SYSTEM 🃏
class SimpleCardSystem {
    constructor() {
        this.cards = document.querySelectorAll('[data-tilt]');
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => this.handleMouseEnter(e));
            card.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));
        });
    }
    
    handleMouseEnter(e) {
        const card = e.currentTarget;
        const glow = card.querySelector('.card-glow');
        if (glow) {
            glow.style.opacity = '1';
        }
    }
    
    handleMouseLeave(e) {
        const card = e.currentTarget;
        const glow = card.querySelector('.card-glow');
        if (glow) {
            glow.style.opacity = '0';
        }
    }
}

// 🌊 SMOOTH SCROLL WITH PARALLAX 🌊
class SmoothScrollSystem {
    constructor() {
        this.init();
    }
    
    init() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;
                    
                    this.smoothScrollTo(offsetPosition, 1000);
                }
            });
        });
        
        // Parallax scroll effects
        window.addEventListener('scroll', () => this.handleParallax());
    }
    
    smoothScrollTo(target, duration) {
        const start = window.pageYOffset;
        const distance = target - start;
        const startTime = performance.now();
        
        const easeInOutCubic = (t) => {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        };
        
        const animation = (currentTime) => {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = easeInOutCubic(progress);
            
            window.scrollTo(0, start + distance * ease);
            
            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        };
        
        requestAnimationFrame(animation);
    }
    
    handleParallax() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const canvas = document.getElementById('mystical-canvas');
        
        if (hero && canvas) {
            const rate = scrolled * -0.5;
            canvas.style.transform = `translateY(${rate}px)`;
        }
        
        // Parallax for other elements
        const parallaxElements = document.querySelectorAll('.discovery-card');
        parallaxElements.forEach((element, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// Audio system removed for cleaner experience

// 🚀 PERFORMANCE MONITOR 🚀
class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.lastTime = performance.now();
        this.frameCount = 0;
        this.init();
    }
    
    init() {
        this.monitor();
        
        // Adaptive quality based on performance
        setInterval(() => {
            if (this.fps < 30) {
                this.reduceQuality();
            } else if (this.fps > 50) {
                this.increaseQuality();
            }
        }, 2000);
    }
    
    monitor() {
        const currentTime = performance.now();
        this.frameCount++;
        
        if (currentTime - this.lastTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = currentTime;
        }
        
        requestAnimationFrame(() => this.monitor());
    }
    
    reduceQuality() {
        // Reduce particle count for better performance
        const canvas = document.getElementById('mystical-canvas');
        if (canvas && window.particleSystem) {
            window.particleSystem.particles = window.particleSystem.particles.slice(0, 75);
        }
    }
    
    increaseQuality() {
        // Increase effects for better devices
        const cards = document.querySelectorAll('.discovery-card');
        cards.forEach(card => {
            card.style.filter = 'brightness(1.1) contrast(1.1)';
        });
    }
}

// Header background change on scroll with enhanced effects
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    const scrolled = window.pageYOffset;
    
    if (scrolled > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.98)';
        header.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.9)';
        header.style.backdropFilter = 'blur(20px)';
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.8)';
        header.style.backdropFilter = 'blur(15px)';
    }
});

// Enhanced contact form with mystical effects
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent form submission
    
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    if (!name || !email || !message) {
        this.showMysticalAlert('The ancient spirits require all fields to be filled...', 'warning');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        this.showMysticalAlert('The mystical correspondence address seems incomplete...', 'warning');
        return;
    }
    
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Sending through the veil...';
    submitButton.disabled = true;
    submitButton.style.background = 'linear-gradient(135deg, #8B4513, #D28117)';
    
    // Show professional message for Google Play verification
    setTimeout(() => {
        this.showMysticalAlert('Thank you for your interest! Please contact us directly at contact@project-enra.com for immediate assistance.', 'success');
        this.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.style.background = '';
    }, 2000);
});

// Mystical alert system
HTMLFormElement.prototype.showMysticalAlert = function(message, type) {
    const alert = document.createElement('div');
    alert.className = `mystical-alert ${type}`;
    alert.innerHTML = `
        <div class="alert-glow"></div>
        <span>${message}</span>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .mystical-alert {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, rgba(45, 24, 16, 0.9), rgba(210, 129, 23, 0.2));
            border: 2px solid #D28117;
            border-radius: 12px;
            padding: 2rem;
            color: #E6941F;
            font-family: 'IM Fell English', serif;
            font-size: 1.1rem;
            text-align: center;
            z-index: 10000;
            backdrop-filter: blur(20px);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
            animation: mysticalAppear 0.6s ease-out;
            max-width: 400px;
            position: relative;
            overflow: hidden;
        }
        
        .alert-glow {
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(230, 148, 31, 0.1) 0%, transparent 70%);
            animation: alertGlow 2s ease-in-out infinite;
        }
        
        .mystical-alert span {
            position: relative;
            z-index: 2;
        }
        
        @keyframes mysticalAppear {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8) rotateY(90deg); }
            100% { opacity: 1; transform: translate(-50%, -50%) scale(1) rotateY(0deg); }
        }
        
        @keyframes alertGlow {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.animation = 'mysticalAppear 0.6s ease-out reverse';
        setTimeout(() => {
            document.body.removeChild(alert);
            document.head.removeChild(style);
        }, 600);
    }, 4000);
};

// 🎬 INITIALIZE ALL SYSTEMS 🎬
window.addEventListener('load', function() {
    // Initialize mystical canvas
    const canvas = document.getElementById('mystical-canvas');
    if (canvas) {
        window.particleSystem = new MysticalParticleSystem(canvas);
        
        // Resize handler
        window.addEventListener('resize', () => {
            window.particleSystem.resize();
        });
    }
    
    // Initialize all advanced systems
    new TextAnimator();
    new SimpleCardSystem();
    new SmoothScrollSystem();
    new PerformanceMonitor();
    
    // Add loading completion effects
    document.body.classList.add('loaded');
    
    // Trigger hero animations
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-buttons');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 300);
        });
    }, 500);
    
    console.log('🔮 VEILGLASS MYSTICAL SYSTEMS ACTIVATED 🔮');
    console.log('🌟 Welcome to the cutting edge of 2025 web technology 🌟');
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('loading');
            
            // Add staggered animation for cards
            if (entry.target.classList.contains('discovery-card')) {
                const cards = document.querySelectorAll('.discovery-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.animation = 'fadeInUp 0.8s ease forwards';
                    }, index * 200);
                });
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.discovery-card, .feature, .heritage-text').forEach(el => {
    observer.observe(el);
});

// Keyboard navigation support with mystical sounds
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
    
    // Easter egg: Konami code
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    window.konamiIndex = window.konamiIndex || 0;
    
    if (e.keyCode === konamiCode[window.konamiIndex]) {
        window.konamiIndex++;
        if (window.konamiIndex === konamiCode.length) {
            // Activate secret mystical mode
            document.body.classList.add('mystical-overdrive');
            window.konamiIndex = 0;
            console.log('🌟 MYSTICAL OVERDRIVE ACTIVATED! 🌟');
        }
    } else {
        window.konamiIndex = 0;
    }
});

// Add mystical overdrive styles
const mysticalOverdriveStyle = document.createElement('style');
mysticalOverdriveStyle.textContent = `
    .mystical-overdrive * {
        animation-duration: 0.5s !important;
        filter: hue-rotate(30deg) saturate(1.5) brightness(1.2) !important;
    }
    
    .mystical-overdrive .discovery-card:hover {
        transform: translateY(-30px) rotateX(15deg) rotateY(15deg) scale(1.1) !important;
    }
    
    .mystical-overdrive .hero-title {
        animation: glowPulse 1s ease-in-out infinite, textGlitch 0.1s infinite !important;
    }
    
    @keyframes textGlitch {
        0%, 100% { text-shadow: 0 0 20px rgba(230, 148, 31, 0.8); }
        50% { text-shadow: 0 0 40px rgba(230, 148, 31, 1), 2px 0 0 #ff0000, -2px 0 0 #00ff00; }
    }
`;
document.head.appendChild(mysticalOverdriveStyle);

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

// Apply debounce to scroll handler
const debouncedScrollHandler = debounce(function() {
    const header = document.querySelector('.header');
    const scrolled = window.pageYOffset;
    
    if (scrolled > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.98)';
        header.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.9)';
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.8)';
    }
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Accessibility improvements with mystical flair
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    navToggle.setAttribute('aria-label', 'Toggle mystical navigation menu');
    navToggle.setAttribute('aria-expanded', 'false');
    
    navToggle.addEventListener('click', function() {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
    });
    
    // Focus management for mobile menu
    const navMenu = document.querySelector('.nav-menu');
    const firstNavLink = navMenu.querySelector('a');
    const lastNavLink = navMenu.querySelector('a:last-child');
    
    document.addEventListener('keydown', function(e) {
        if (navMenu.classList.contains('active') && e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstNavLink) {
                    e.preventDefault();
                    lastNavLink.focus();
                }
            } else {
                if (document.activeElement === lastNavLink) {
                    e.preventDefault();
                    firstNavLink.focus();
                }
            }
        }
    });
});

// Print styles handler
window.addEventListener('beforeprint', function() {
    document.querySelectorAll('section').forEach(section => {
        section.style.pageBreakInside = 'avoid';
    });
});

// 🎆 FINAL TOUCH: MYSTICAL CURSOR TRAIL 🎆
class MysticalCursor {
    constructor() {
        this.trail = [];
        this.maxTrail = 20;
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.addTrailPoint(e.clientX, e.clientY);
        });
        
        this.animate();
    }
    
    addTrailPoint(x, y) {
        this.trail.push({ x, y, life: 1 });
        if (this.trail.length > this.maxTrail) {
            this.trail.shift();
        }
    }
    
    animate() {
        // Update existing trail points
        this.trail.forEach((point, index) => {
            point.life -= 0.05;
            if (point.life <= 0) {
                this.trail.splice(index, 1);
            }
        });
        
        // Draw trail
        this.drawTrail();
        
        requestAnimationFrame(() => this.animate());
    }
    
    drawTrail() {
        // Remove old trail elements
        document.querySelectorAll('.cursor-trail').forEach(el => el.remove());
        
        this.trail.forEach((point, index) => {
            const trailElement = document.createElement('div');
            trailElement.className = 'cursor-trail';
            trailElement.style.cssText = `
                position: fixed;
                left: ${point.x}px;
                top: ${point.y}px;
                width: ${4 * point.life}px;
                height: ${4 * point.life}px;
                background: radial-gradient(circle, rgba(230, 148, 31, ${point.life * 0.8}) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transform: translate(-50%, -50%);
            `;
            document.body.appendChild(trailElement);
        });
    }
}

// Initialize mystical cursor on devices that support it
if (!('ontouchstart' in window)) {
    new MysticalCursor();
}

// 🎊 CONGRATULATIONS! YOU'VE REACHED THE END OF THE MYSTICAL CODE! 🎊