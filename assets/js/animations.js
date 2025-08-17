// ====== ANIMATION HELPERS ======

// Function to add animation classes to elements
function addAnimation(element, animationClass, delay = 0) {
    setTimeout(() => {
        element.classList.add('animate__animated', animationClass);
    }, delay);
}

// Function to create a confetti effect
function createConfetti() {
    const confettiCount = 150;
    const confettiColors = ['#00aaff', '#39ff14', '#ff00ff', '#ffff00', '#ff6600'];
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        // Random properties
        const size = Math.random() * 10 + 5;
        const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        const posX = Math.random() * 100;
        const posY = Math.random() * 100 - 100;
        const rotation = Math.random() * 360;
        const animationDuration = Math.random() * 3 + 2;
        
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.backgroundColor = color;
        confetti.style.left = `${posX}%`;
        confetti.style.top = `${posY}%`;
        confetti.style.transform = `rotate(${rotation}deg)`;
        confetti.style.animation = `fall ${animationDuration}s linear forwards`;
        
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, animationDuration * 1000);
    }
}

// Function to create a firework effect
function createFirework(x, y) {
    const fireworkCount = 100;
    const fireworkColors = ['#00aaff', '#39ff14', '#ff00ff', '#ffff00', '#ff6600'];
    
    for (let i = 0; i < fireworkCount; i++) {
        const firework = document.createElement('div');
        firework.classList.add('firework');
        
        // Random properties
        const size = Math.random() * 5 + 2;
        const color = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 5 + 2;
        const animationDuration = Math.random() * 1 + 0.5;
        
        firework.style.width = `${size}px`;
        firework.style.height = `${size}px`;
        firework.style.backgroundColor = color;
        firework.style.left = `${x}px`;
        firework.style.top = `${y}px`;
        firework.style.animation = `explode ${animationDuration}s ease-out forwards`;
        
        // Calculate end position
        const endX = x + Math.cos(angle) * velocity * 50;
        const endY = y + Math.sin(angle) * velocity * 50;
        
        firework.style.setProperty('--end-x', `${endX}px`);
        firework.style.setProperty('--end-y', `${endY}px`);
        
        document.body.appendChild(firework);
        
        // Remove firework after animation
        setTimeout(() => {
            firework.remove();
        }, animationDuration * 1000);
    }
}

// Function to create a meteor shower effect
function createMeteorShower() {
    const meteorCount = 20;
    
    for (let i = 0; i < meteorCount; i++) {
        setTimeout(() => {
            const meteor = document.createElement('div');
            meteor.classList.add('meteor');
            
            // Random properties
            const posX = Math.random() * 100;
            const posY = Math.random() * 50;
            const size = Math.random() * 3 + 1;
            const duration = Math.random() * 1 + 0.5;
            const delay = Math.random() * 5;
            
            meteor.style.width = `${size}px`;
            meteor.style.height = `${size * 50}px`;
            meteor.style.left = `${posX}%`;
            meteor.style.top = `${posY}%`;
            meteor.style.animation = `meteor ${duration}s linear ${delay}s forwards`;
            
            document.body.appendChild(meteor);
            
            // Remove meteor after animation
            setTimeout(() => {
                meteor.remove();
            }, (duration + delay) * 1000);
        }, i * 200);
    }
}

// Function to create a pulse wave effect
function createPulseWave(x, y) {
    const waveCount = 3;
    
    for (let i = 0; i < waveCount; i++) {
        setTimeout(() => {
            const wave = document.createElement('div');
            wave.classList.add('pulse-wave');
            
            // Properties
            const size = 50;
            const duration = 1;
            
            wave.style.width = `${size}px`;
            wave.style.height = `${size}px`;
            wave.style.left = `${x - size/2}px`;
            wave.style.top = `${y - size/2}px`;
            wave.style.animation = `pulse-wave ${duration}s ease-out forwards`;
            
            document.body.appendChild(wave);
            
            // Remove wave after animation
            setTimeout(() => {
                wave.remove();
            }, duration * 1000);
        }, i * 200);
    }
}

// Function to create a text scramble effect
function textScramble(element, finalText, duration = 1000) {
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    const startTime = Date.now();
    const endTime = startTime + duration;
    
    const frame = () => {
        const currentTime = Date.now();
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        let output = '';
        for (let i = 0; i < finalText.length; i++) {
            if (progress * finalText.length > i) {
                output += finalText[i];
            } else {
                output += chars[Math.floor(Math.random() * chars.length)];
            }
        }
        
        element.textContent = output;
        
        if (progress < 1) {
            requestAnimationFrame(frame);
        }
    };
    
    requestAnimationFrame(frame);
}

// Function to create a glitch effect
function createGlitchEffect(element) {
    element.classList.add('glitch-effect');
    
    setTimeout(() => {
        element.classList.remove('glitch-effect');
    }, 1000);
}

// Function to create a magnetic effect on elements
function addMagneticEffect(elements) {
    elements.forEach(element => {
        element.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0)';
        });
    });
}

// Function to create a 3D tilt effect on cards
function add3DTiltEffect(cards) {
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

// Function to create a parallax effect on elements
function addParallaxEffect(elements, speed = 0.5) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        elements.forEach(element => {
            const rate = scrolled * -speed;
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// Function to create a typing effect on elements
function typeWriter(element, text, speed = 50) {
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    element.textContent = '';
    type();
}

// Function to create a fade in effect on elements
function fadeInElements(elements, delay = 100) {
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * delay);
    });
}

// Function to create a stagger effect on elements
function staggerEffect(elements, animationClass, delay = 100) {
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('animate__animated', animationClass);
        }, index * delay);
    });
}

// Initialize effects when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add magnetic effect to buttons
    const buttons = document.querySelectorAll('.btn');
    addMagneticEffect(buttons);
    
    // Add 3D tilt effect to cards
    const cards = document.querySelectorAll('.skill-card, .project-card, .interest-card');
    add3DTiltEffect(cards);
    
    // Add parallax effect to hero elements
    const heroElements = document.querySelectorAll('.hero-text, .hero-visual');
    addParallaxEffect(heroElements, 0.5);
    
    // Create confetti effect on page load
    setTimeout(() => {
        createConfetti();
    }, 1000);
    
    // Create meteor shower effect periodically
    setInterval(() => {
        createMeteorShower();
    }, 30000);
    
    // Add click event to create firework effect
    document.addEventListener('click', function(e) {
        if (Math.random() > 0.95) { // 5% chance to create firework on click
            createFirework(e.clientX, e.clientY);
        }
    });
    
    // Add click event to create pulse wave effect
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn') || e.target.classList.contains('social-link')) {
            createPulseWave(e.clientX, e.clientY);
        }
    });
    
    // Add text scramble effect to headings
    const headings = document.querySelectorAll('h1, h2, h3');
    headings.forEach(heading => {
        const originalText = heading.textContent;
        
        heading.addEventListener('mouseenter', function() {
            textScramble(this, originalText, 500);
        });
    });
    
    // Add glitch effect to headings on double click
    headings.forEach(heading => {
        heading.addEventListener('dblclick', function() {
            createGlitchEffect(this);
        });
    });
    
    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const titleText = heroTitle.textContent;
        typeWriter(heroTitle, titleText, 100);
    }
    
    // Fade in elements on scroll
    const fadeElements = document.querySelectorAll('.skill-card, .project-card, .interest-card, .timeline-item');
    fadeInElements(fadeElements, 100);
    
    // Stagger effect on timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    staggerEffect(timelineItems, 'animate__fadeInUp', 200);
    
    // Stagger effect on interest cards
    const interestCards = document.querySelectorAll('.interest-card');
    staggerEffect(interestCards, 'animate__flipInY', 150);
});

// Export functions for use in other scripts
window.animationHelpers = {
    createConfetti,
    createFirework,
    createMeteorShower,
    createPulseWave,
    textScramble,
    createGlitchEffect,
    addMagneticEffect,
    add3DTiltEffect,
    addParallaxEffect,
    typeWriter,
    fadeInElements,
    staggerEffect
};
