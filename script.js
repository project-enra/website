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
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
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
}

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
    
    // Initialize fog of war map with delay to ensure DOM is ready
    // DISABLED: Uncomment below to re-enable fog map
    /*
    setTimeout(() => {
        console.log('🗺️ Initializing Fog of War Map...');
        const fogMap = new FogOfWarMap('fogMap');
        if (fogMap.canvas) {
            console.log('✅ Fog map canvas found, starting animation');
            fogMap.startAnimation();
            window.fogMap = fogMap; // Make globally accessible for debugging
        } else {
            console.error('❌ Fog map canvas not found!');
            // Try to find any canvas elements
            const allCanvases = document.querySelectorAll('canvas');
            console.log('🔍 All canvas elements found:', allCanvases);
        }
    }, 100);
    */
    
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

// 🗺️ MYSTICAL FOG OF WAR MINI MAP SYSTEM 🗺️
class FogOfWarMap {
    constructor(canvasId) {
        console.log(`🔍 Looking for canvas with ID: ${canvasId}`);
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`❌ Canvas with ID '${canvasId}' not found!`);
            return;
        }
        console.log('✅ Canvas found:', this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Fog state - 0 = fully fogged, 1 = fully clear
        this.fogData = new Array(this.width * this.height).fill(0);
        this.clearRadius = 25;
        this.isDragging = false;
        this.lastClearPos = null;
        
        // Heritage sites (sample locations)
        this.heritageSites = [
            { x: 120, y: 80, name: "Ancient Castle", type: "castle", revealed: false },
            { x: 280, y: 150, name: "Sacred Grove", type: "forest", revealed: false },
            { x: 200, y: 200, name: "Historic Pub", type: "pub", revealed: false },
            { x: 80, y: 180, name: "Stone Circle", type: "monument", revealed: false },
            { x: 320, y: 100, name: "Old Mill", type: "mill", revealed: false }
        ];
        
        // Progress tracking
        this.totalPixels = this.width * this.height;
        this.clearedPixels = 0;
        this.sitesFound = 0;
        
        console.log('🎨 Canvas dimensions:', this.width, 'x', this.height);
        
        this.init();
        this.loadProgress();
        this.render();
        
        // Test canvas by drawing a simple rectangle
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(10, 10, 50, 50);
        console.log('🔴 Test red rectangle drawn');
        
        // Add click test
        this.canvas.addEventListener('click', (e) => {
            console.log('🖱️ Canvas clicked!', e);
            const pos = this.getMousePos(e);
            console.log('📍 Click position:', pos);
            // Draw a test circle at click position
            this.ctx.fillStyle = '#00ff00';
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    init() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.startClearing(e));
        this.canvas.addEventListener('mousemove', (e) => this.continueClear(e));
        this.canvas.addEventListener('mouseup', () => this.stopClearing());
        this.canvas.addEventListener('mouseleave', () => this.stopClearing());
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.startClearing(mouseEvent);
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.continueClear(mouseEvent);
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stopClearing();
        });
        
        // Reset button
        const resetBtn = document.getElementById('resetFog');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetFog());
        }
    }
    
    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: Math.floor((e.clientX - rect.left) * (this.width / rect.width)),
            y: Math.floor((e.clientY - rect.top) * (this.height / rect.height))
        };
    }
    
    startClearing(e) {
        console.log('🖱️ Start clearing fog at:', e);
        this.isDragging = true;
        const pos = this.getMousePos(e);
        console.log('📍 Mouse position:', pos);
        this.clearFogAt(pos.x, pos.y);
        this.lastClearPos = pos;
    }
    
    continueClear(e) {
        if (!this.isDragging) return;
        
        const pos = this.getMousePos(e);
        
        // Draw line between last position and current position for smooth clearing
        if (this.lastClearPos) {
            this.clearFogLine(this.lastClearPos.x, this.lastClearPos.y, pos.x, pos.y);
        }
        
        this.clearFogAt(pos.x, pos.y);
        this.lastClearPos = pos;
    }
    
    stopClearing() {
        this.isDragging = false;
        this.lastClearPos = null;
        this.saveProgress();
    }
    
    clearFogAt(centerX, centerY) {
        let pixelsCleared = 0;
        
        for (let x = centerX - this.clearRadius; x <= centerX + this.clearRadius; x++) {
            for (let y = centerY - this.clearRadius; y <= centerY + this.clearRadius; y++) {
                if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
                    if (distance <= this.clearRadius) {
                        const index = y * this.width + x;
                        const oldValue = this.fogData[index];
                        
                        // Smooth clearing with falloff
                        const clearAmount = Math.max(0, 1 - (distance / this.clearRadius));
                        this.fogData[index] = Math.min(1, this.fogData[index] + clearAmount * 0.3);
                        
                        if (oldValue < 0.5 && this.fogData[index] >= 0.5) {
                            pixelsCleared++;
                        }
                    }
                }
            }
        }
        
        this.clearedPixels += pixelsCleared;
        this.checkHeritageSites(centerX, centerY);
        this.updateStats();
        this.render();
    }
    
    clearFogLine(x1, y1, x2, y2) {
        const dx = Math.abs(x2 - x1);
        const dy = Math.abs(y2 - y1);
        const sx = x1 < x2 ? 1 : -1;
        const sy = y1 < y2 ? 1 : -1;
        let err = dx - dy;
        
        let x = x1;
        let y = y1;
        
        while (true) {
            this.clearFogAt(x, y);
            
            if (x === x2 && y === y2) break;
            
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x += sx;
            }
            if (e2 < dx) {
                err += dx;
                y += sy;
            }
        }
    }
    
    checkHeritageSites(clearX, clearY) {
        this.heritageSites.forEach(site => {
            if (!site.revealed) {
                const distance = Math.sqrt((clearX - site.x) ** 2 + (clearY - site.y) ** 2);
                if (distance <= this.clearRadius + 10) {
                    site.revealed = true;
                    this.sitesFound++;
                    this.showSiteDiscovery(site);
                }
            }
        });
    }
    
    showSiteDiscovery(site) {
        // Create mystical discovery notification
        const notification = document.createElement('div');
        notification.className = 'site-discovery';
        notification.innerHTML = `
            <div class="discovery-glow"></div>
            <div class="discovery-icon">${this.getSiteIcon(site.type)}</div>
            <div class="discovery-text">
                <strong>Heritage Site Discovered!</strong>
                <span>${site.name}</span>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .site-discovery {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, rgba(45, 24, 16, 0.95), rgba(210, 129, 23, 0.3));
                border: 2px solid #E6941F;
                border-radius: 12px;
                padding: 1rem 1.5rem;
                color: #E6941F;
                font-family: 'IM Fell English', serif;
                z-index: 10000;
                backdrop-filter: blur(20px);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
                animation: discoverySlideIn 0.6s ease-out;
                display: flex;
                align-items: center;
                gap: 1rem;
                max-width: 300px;
                position: relative;
                overflow: hidden;
            }
            
            .discovery-glow {
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(230, 148, 31, 0.2) 0%, transparent 70%);
                animation: discoveryGlow 2s ease-in-out infinite;
            }
            
            .discovery-icon {
                font-size: 2rem;
                filter: drop-shadow(0 0 10px rgba(230, 148, 31, 0.8));
                position: relative;
                z-index: 2;
            }
            
            .discovery-text {
                display: flex;
                flex-direction: column;
                position: relative;
                z-index: 2;
            }
            
            .discovery-text strong {
                font-size: 1rem;
                margin-bottom: 0.3rem;
                text-shadow: 0 0 10px rgba(230, 148, 31, 0.5);
            }
            
            .discovery-text span {
                font-size: 0.9rem;
                opacity: 0.9;
            }
            
            @keyframes discoverySlideIn {
                0% { 
                    opacity: 0; 
                    transform: translateX(100%) scale(0.8); 
                }
                100% { 
                    opacity: 1; 
                    transform: translateX(0) scale(1); 
                }
            }
            
            @keyframes discoveryGlow {
                0%, 100% { opacity: 0.2; }
                50% { opacity: 0.4; }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(notification);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'discoverySlideIn 0.6s ease-out reverse';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                    document.head.removeChild(style);
                }
            }, 600);
        }, 4000);
    }
    
    getSiteIcon(type) {
        const icons = {
            castle: '🏰',
            forest: '🌲',
            pub: '🍺',
            monument: '🗿',
            mill: '⚙️'
        };
        return icons[type] || '📍';
    }
    
    updateStats() {
        const exploredPercent = Math.floor((this.clearedPixels / this.totalPixels) * 100);
        
        const percentEl = document.getElementById('exploredPercent');
        const sitesEl = document.getElementById('sitesFound');
        
        if (percentEl) percentEl.textContent = `${Math.min(exploredPercent, 100)}%`;
        if (sitesEl) sitesEl.textContent = this.sitesFound;
    }
    
    render() {
        console.log('🎨 Rendering fog map...');
        
        // Clear canvas
        this.ctx.fillStyle = '#2a2a2a';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw base map (simple terrain)
        this.drawBaseMap();
        
        // Draw heritage sites
        this.drawHeritageSites();
        
        // Draw fog overlay
        this.drawFog();
        
        // Add mystical particles
        this.drawParticles();
        
        console.log('✅ Render complete');
    }
    
    drawBaseMap() {
        // Simple terrain generation
        this.ctx.fillStyle = '#1a4a1a'; // Dark green for forests
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            const radius = 20 + Math.random() * 30;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Rivers/paths
        this.ctx.strokeStyle = '#4a6a8a';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height * 0.7);
        this.ctx.quadraticCurveTo(this.width * 0.5, this.height * 0.5, this.width, this.height * 0.3);
        this.ctx.stroke();
    }
    
    drawHeritageSites() {
        this.heritageSites.forEach(site => {
            if (site.revealed) {
                // Glowing heritage site
                const gradient = this.ctx.createRadialGradient(
                    site.x, site.y, 0,
                    site.x, site.y, 15
                );
                gradient.addColorStop(0, 'rgba(230, 148, 31, 0.8)');
                gradient.addColorStop(1, 'rgba(230, 148, 31, 0)');
                
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(site.x, site.y, 15, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Site marker
                this.ctx.fillStyle = '#E6941F';
                this.ctx.beginPath();
                this.ctx.arc(site.x, site.y, 4, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Pulsing effect
                const pulseRadius = 8 + Math.sin(Date.now() * 0.003) * 3;
                this.ctx.strokeStyle = 'rgba(230, 148, 31, 0.6)';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(site.x, site.y, pulseRadius, 0, Math.PI * 2);
                this.ctx.stroke();
            }
        });
    }
    
    drawFog() {
        console.log('🌫️ Drawing fog overlay...');
        
        try {
            const imageData = this.ctx.createImageData(this.width, this.height);
            const data = imageData.data;
            
            for (let i = 0; i < this.fogData.length; i++) {
                const fogAmount = 1 - this.fogData[i];
                const pixelIndex = i * 4;
                
                // Mystical fog color with golden tint
                data[pixelIndex] = 20 + fogAmount * 30;     // R
                data[pixelIndex + 1] = 15 + fogAmount * 25; // G  
                data[pixelIndex + 2] = 10 + fogAmount * 20; // B
                data[pixelIndex + 3] = fogAmount * 200;     // A
            }
            
            this.ctx.putImageData(imageData, 0, 0);
            console.log('✅ Fog overlay drawn');
        } catch (error) {
            console.error('❌ Error drawing fog:', error);
            
            // Fallback: draw simple fog rectangles
            this.ctx.fillStyle = 'rgba(30, 20, 15, 0.8)';
            for (let x = 0; x < this.width; x += 10) {
                for (let y = 0; y < this.height; y += 10) {
                    const index = y * this.width + x;
                    if (index < this.fogData.length && this.fogData[index] < 0.5) {
                        this.ctx.fillRect(x, y, 10, 10);
                    }
                }
            }
        }
    }
    
    drawParticles() {
        // Add some mystical floating particles
        const time = Date.now() * 0.001;
        
        for (let i = 0; i < 20; i++) {
            const x = (Math.sin(time + i) * 50 + this.width / 2 + i * 20) % this.width;
            const y = (Math.cos(time * 0.7 + i) * 30 + this.height / 2 + i * 15) % this.height;
            
            // Only show particles in cleared areas
            const fogIndex = Math.floor(y) * this.width + Math.floor(x);
            if (this.fogData[fogIndex] > 0.3) {
                const alpha = this.fogData[fogIndex] * 0.6;
                this.ctx.fillStyle = `rgba(230, 148, 31, ${alpha})`;
                this.ctx.beginPath();
                this.ctx.arc(x, y, 1 + Math.sin(time * 2 + i) * 0.5, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    }
    
    resetFog() {
        this.fogData.fill(0);
        this.clearedPixels = 0;
        this.sitesFound = 0;
        this.heritageSites.forEach(site => site.revealed = false);
        this.updateStats();
        this.render();
        this.saveProgress();
        
        // Show reset notification
        const resetBtn = document.getElementById('resetFog');
        if (resetBtn) {
            const originalText = resetBtn.textContent;
            resetBtn.textContent = 'The Veil Returns...';
            resetBtn.disabled = true;
            
            setTimeout(() => {
                resetBtn.textContent = originalText;
                resetBtn.disabled = false;
            }, 2000);
        }
    }
    
    saveProgress() {
        const progress = {
            fogData: Array.from(this.fogData),
            clearedPixels: this.clearedPixels,
            sitesFound: this.sitesFound,
            heritageSites: this.heritageSites.map(site => ({...site}))
        };
        localStorage.setItem('veilglass_fog_progress', JSON.stringify(progress));
    }
    
    loadProgress() {
        const saved = localStorage.getItem('veilglass_fog_progress');
        if (saved) {
            try {
                const progress = JSON.parse(saved);
                this.fogData = new Float32Array(progress.fogData);
                this.clearedPixels = progress.clearedPixels || 0;
                this.sitesFound = progress.sitesFound || 0;
                if (progress.heritageSites) {
                    progress.heritageSites.forEach((savedSite, index) => {
                        if (this.heritageSites[index]) {
                            this.heritageSites[index].revealed = savedSite.revealed;
                        }
                    });
                }
                this.updateStats();
            } catch (e) {
                console.log('Could not load fog progress');
            }
        }
    }
    
    startAnimation() {
        const animate = () => {
            this.render();
            requestAnimationFrame(animate);
        };
        animate();
    }
}

// 🎊 CONGRATULATIONS! YOU'VE REACHED THE END OF THE MYSTICAL CODE! 🎊