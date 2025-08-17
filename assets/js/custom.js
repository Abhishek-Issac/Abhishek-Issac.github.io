// ====== CUSTOM SCRIPTS ======

// Function to create a custom cursor trail effect
function createCursorTrail() {
    const trailCount = 20;
    const trailElements = [];
    
    for (let i = 0; i < trailCount; i++) {
        const trail = document.createElement('div');
        trail.classList.add('cursor-trail');
        trail.style.opacity = i / trailCount;
        document.body.appendChild(trail);
        trailElements.push(trail);
    }
    
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateTrail() {
        let x = mouseX;
        let y = mouseY;
        
        trailElements.forEach((trail, index) => {
            const nextTrail = trailElements[index + 1];
            
            if (nextTrail) {
                x += (nextTrail.offsetLeft - trail.offsetLeft) * 0.5;
                y += (nextTrail.offsetTop - trail.offsetTop) * 0.5;
            } else {
                x += (mouseX - trail.offsetLeft) * 0.5;
                y += (mouseY - trail.offsetTop) * 0.5;
            }
            
            trail.style.left = x + 'px';
            trail.style.top = y + 'px';
        });
        
        requestAnimationFrame(animateTrail);
    }
    
    animateTrail();
}

// Function to create a matrix rain effect
function createMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.classList.add('matrix-rain');
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");
    
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    
    const drops = [];
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00aaff';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            drops[i]++;
        }
    }
    
    setInterval(draw, 35);
    
    // Resize canvas when window is resized
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Function to create a custom audio visualizer
function createAudioVisualizer() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    
    const visualizerContainer = document.createElement('div');
    visualizerContainer.classList.add('audio-visualizer');
    document.body.appendChild(visualizerContainer);
    
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = 200;
    visualizerContainer.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;
    
    function renderFrame() {
        requestAnimationFrame(renderFrame);
        
        x = 0;
        
        analyser.getByteFrequencyData(dataArray);
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;
            
            const r = barHeight + 25 * (i / bufferLength);
            const g = 250 * (i / bufferLength);
            const b = 250;
            
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            
            x += barWidth + 1;
        }
    }
    
    // Get microphone input
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            renderFrame();
        })
        .catch(err => {
            console.log('Error accessing microphone:', err);
            // Fallback to random data
            function randomData() {
                for (let i = 0; i < bufferLength; i++) {
                    dataArray[i] = Math.floor(Math.random() * 256);
                }
                renderFrame();
                requestAnimationFrame(randomData);
            }
            randomData();
        });
    
    // Resize canvas when window is resized
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
    });
}

// Function to create a custom particle system
function createParticleSystem() {
    const particleContainer = document.createElement('div');
    particleContainer.classList.add('particle-system');
    document.body.appendChild(particleContainer);
    
    const particleCount = 100;
    const particles = [];
    
    class Particle {
        constructor() {
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
            this.size = Math.random() * 5 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
            this.element = document.createElement('div');
            this.element.classList.add('particle');
            this.element.style.width = `${this.size}px`;
            this.element.style.height = `${this.size}px`;
            this.element.style.backgroundColor = this.color;
            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y}px`;
            particleContainer.appendChild(this.element);
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > window.innerWidth) {
                this.x = 0;
            } else if (this.x < 0) {
                this.x = window.innerWidth;
            }
            
            if (this.y > window.innerHeight) {
                this.y = 0;
            } else if (this.y < 0) {
                this.y = window.innerHeight;
            }
            
            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y}px`;
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animateParticles() {
        particles.forEach(particle => {
            particle.update();
        });
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
    
    // Mouse interaction
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        particles.forEach(particle => {
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.speedX += dx * force * 0.05;
                particle.speedY += dy * force * 0.05;
            }
        });
    });
}

// Function to create a custom 3D carousel
function create3DCarousel() {
    const carouselContainer = document.createElement('div');
    carouselContainer.classList.add('carousel-3d');
    document.body.appendChild(carouselContainer);
    
    const carousel = document.createElement('div');
    carousel.classList.add('carousel');
    carouselContainer.appendChild(carousel);
    
    const itemCount = 8;
    const radius = 250;
    
    for (let i = 0; i < itemCount; i++) {
        const item = document.createElement('div');
        item.classList.add('carousel-item');
        
        const angle = (i / itemCount) * Math.PI * 2;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        
        item.style.transform = `translateX(${x}px) translateZ(${z}px)`;
        item.style.backgroundImage = `url(https://picsum.photos/seed/carousel${i}/300/200.jpg)`;
        
        carousel.appendChild(item);
    }
    
    let angleX = 0;
    let angleY = 0;
    let isMouseDown = false;
    let startX = 0;
    let startY = 0;
    
    carouselContainer.addEventListener('mousedown', function(e) {
        isMouseDown = true;
        startX = e.clientX;
        startY = e.clientY;
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isMouseDown) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        angleY += deltaX * 0.5;
        angleX -= deltaY * 0.5;
        
        carousel.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        
        startX = e.clientX;
        startY = e.clientY;
    });
    
    document.addEventListener('mouseup', function() {
        isMouseDown = false;
    });
    
    // Auto rotation
    function autoRotate() {
        if (!isMouseDown) {
            angleY += 0.5;
            carousel.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        }
        requestAnimationFrame(autoRotate);
    }
    
    autoRotate();
}

// Function to create a custom wave animation
function createWaveAnimation() {
    const waveContainer = document.createElement('div');
    waveContainer.classList.add('wave-container');
    document.body.appendChild(waveContainer);
    
    const waveCount = 3;
    
    for (let i = 0; i < waveCount; i++) {
        const wave = document.createElement('div');
        wave.classList.add('wave');
        wave.style.animationDelay = `${i * 2}s`;
        wave.style.opacity = 0.7 - (i * 0.2);
        waveContainer.appendChild(wave);
    }
}

// Function to create a custom clock
function createCustomClock() {
    const clockContainer = document.createElement('div');
    clockContainer.classList.add('clock-container');
    document.body.appendChild(clockContainer);
    
    const clock = document.createElement('div');
    clock.classList.add('clock');
    clockContainer.appendChild(clock);
    
    const hourHand = document.createElement('div');
    hourHand.classList.add('hand', 'hour-hand');
    clock.appendChild(hourHand);
    
    const minuteHand = document.createElement('div');
    minuteHand.classList.add('hand', 'minute-hand');
    clock.appendChild(minuteHand);
    
    const secondHand = document.createElement('div');
    secondHand.classList.add('hand', 'second-hand');
    clock.appendChild(secondHand);
    
    const centerDot = document.createElement('div');
    centerDot.classList.add('center-dot');
    clock.appendChild(centerDot);
    
    function updateClock() {
        const now = new Date();
        const hours = now.getHours() % 12;
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        
        const hourDegrees = (hours * 30) + (minutes * 0.5);
        const minuteDegrees = (minutes * 6) + (seconds * 0.1);
        const secondDegrees = seconds * 6;
        
        hourHand.style.transform = `rotate(${hourDegrees}deg)`;
        minuteHand.style.transform = `rotate(${minuteDegrees}deg)`;
        secondHand.style.transform = `rotate(${secondDegrees}deg)`;
    }
    
    setInterval(updateClock, 1000);
    updateClock();
}

// Initialize custom effects when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create cursor trail effect
    createCursorTrail();
    
    // Create matrix rain effect
    createMatrixRain();
    
    // Create audio visualizer
    createAudioVisualizer();
    
    // Create particle system
    createParticleSystem();
    
    // Create 3D carousel
    create3DCarousel();
    
    // Create wave animation
    createWaveAnimation();
    
    // Create custom clock
    createCustomClock();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Press 'C' to create confetti
        if (e.key === 'c' || e.key === 'C') {
            window.animationHelpers.createConfetti();
        }
        
        // Press 'M' to create meteor shower
        if (e.key === 'm' || e.key === 'M') {
            window.animationHelpers.createMeteorShower();
        }
        
        // Press 'F' to toggle fullscreen
        if (e.key === 'f' || e.key === 'F') {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        }
        
        // Press 'D' to toggle dark/light theme
        if (e.key === 'd' || e.key === 'D') {
            document.querySelector('.theme-toggle').click();
        }
    });
    
    // Add touch gestures for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', function(e) {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Swipe right to go to next section
        if (deltaX > 50 && Math.abs(deltaY) < 100) {
            const currentSection = document.querySelector('.nav-link.active').getAttribute('href');
            const sections = Array.from(document.querySelectorAll('section')).map(section => `#${section.id}`);
            const currentIndex = sections.indexOf(currentSection);
            const nextIndex = (currentIndex + 1) % sections.length;
            
            if (nextIndex < sections.length) {
                document.querySelector(`a[href="${sections[nextIndex]}"]`).click();
            }
        }
        
        // Swipe left to go to previous section
        if (deltaX < -50 && Math.abs(deltaY) < 100) {
            const currentSection = document.querySelector('.nav-link.active').getAttribute('href');
            const sections = Array.from(document.querySelectorAll('section')).map(section => `#${section.id}`);
            const currentIndex = sections.indexOf(currentSection);
            const prevIndex = (currentIndex - 1 + sections.length) % sections.length;
            
            if (prevIndex >= 0) {
                document.querySelector(`a[href="${sections[prevIndex]}"]`).click();
            }
        }
    });
    
    // Add performance monitor
    const performanceMonitor = document.createElement('div');
    performanceMonitor.classList.add('performance-monitor');
    document.body.appendChild(performanceMonitor);
    
    function updatePerformanceMonitor() {
        const fps = calculateFPS();
        performanceMonitor.textContent = `FPS: ${fps}`;
        requestAnimationFrame(updatePerformanceMonitor);
    }
    
    let lastTime = performance.now();
    let frameCount = 0;
    
    function calculateFPS() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime >= lastTime + 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            frameCount = 0;
            lastTime = currentTime;
            return fps;
        }
        
        return 'calculating...';
    }
    
    updatePerformanceMonitor();
    
    // Add easter egg: Konami code
    let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiCodePosition = 0;
    
    document.addEventListener('keydown', function(e) {
        if (e.key === konamiCode[konamiCodePosition]) {
            konamiCodePosition++;
            
            if (konamiCodePosition === konamiCode.length) {
                // Activate easter egg
                activateEasterEgg();
                konamiCodePosition = 0;
            }
        } else {
            konamiCodePosition = 0;
        }
    });
    
    function activateEasterEgg() {
        // Create a special effect
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                window.animationHelpers.createFirework(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight
                );
            }, i * 100);
        }
        
        // Show a secret message
        const secretMessage = document.createElement('div');
        secretMessage.classList.add('secret-message');
        secretMessage.textContent = 'You found the secret! 🎉';
        document.body.appendChild(secretMessage);
        
        setTimeout(() => {
            secretMessage.remove();
        }, 5000);
    }
});
