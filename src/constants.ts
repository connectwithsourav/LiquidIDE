import { FileNode } from './types';

export const INITIAL_FILES: FileNode[] = [
  {
    id: 'index.html',
    name: 'index.html',
    language: 'html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="A Next-Gen web workspace to build beautiful, fast, and responsive sites without limits. Enjoy a smooth, seamless coding environment.">
    <title>Modern Workspace | Web IDE</title>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- Navigation -->
    <nav>
        <a href="#home" class="logo">Dev<span>IDE</span></a>
        
        <!-- Mobile Toggle Button -->
        <div class="hamburger" id="hamburger">
            <span></span>
            <span></span>
            <span></span>
        </div>
        
        <!-- Background Overlay for Mobile Menu -->
        <div class="nav-overlay" id="navOverlay"></div>

        <div class="nav-links" id="navLinks">
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="hero container">
        <div class="reveal active">
            <h2>Next-Gen Development</h2>
            <h1>Create without <br> limits using <span class="typing-container" id="typewriter"></span></h1>
            <p>Experience a smooth, seamless coding environment. This template features responsive layouts, minimal gradients, and hardware-accelerated animations.</p>
            <div>
                <a href="#features" class="btn">Explore Features</a>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features container">
        <h2 class="section-title reveal">Powerful Tools</h2>
        <p class="section-subtitle reveal">Everything you need to build stunning websites, packed into a lightweight interface.</p>
        
        <div class="grid-3">
            <div class="feature-card reveal">
                <div class="feature-icon">⚡</div>
                <h3>Lightning Fast</h3>
                <p>Zero bloat. Built with pure HTML, CSS, and Vanilla JS for maximum performance and instant load times.</p>
            </div>
            
            <div class="feature-card reveal">
                <div class="feature-icon">🎨</div>
                <h3>Modern Aesthetics</h3>
                <p>Glassmorphism, minimal gradients, and smooth typography combined to give your projects a premium look.</p>
            </div>
            
            <div class="feature-card reveal">
                <div class="feature-icon">📱</div>
                <h3>Fully Responsive</h3>
                <p>Flawlessly adapts to any screen size, from tiny 320px mobile screens to massive 1440px+ desktop monitors.</p>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about">
        <div class="container about-content">
            <div class="about-text reveal">
                <h3>Crafted for Developers, Designed for Everyone.</h3>
                <p>We've stripped away the unnecessary complexities to give you a workspace that just works. Edit the code, save, and watch your changes reflect instantly.</p>
                <p>The code structure is heavily commented, highly modular, and completely customizable using simple CSS variables.</p>
                <br>
                <a href="#contact" class="btn">Get Started Now</a>
            </div>
            <div class="about-visual reveal">
                <div class="code-mockup">
                    &lt;div class="creative"&gt;<br>
                    &nbsp;&nbsp;hello_world();<br>
                    &lt;/div&gt;
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact container">
        <h2 class="section-title reveal">Get In Touch</h2>
        <p class="section-subtitle reveal">Have a question or want to work together? Drop a message below.</p>
        <form class="contact-form reveal" id="contactForm">
            <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" class="form-control" placeholder="John Doe" required>
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" class="form-control" placeholder="john@example.com" required>
            </div>
            <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" class="form-control" rows="5" placeholder="Your message here..." required></textarea>
            </div>
            <button type="submit" class="btn" style="width: 100%; margin-top: 1rem;">Send Message</button>
        </form>
    </section>

    <!-- CTA Section -->
    <section id="cta" class="cta container">
        <div class="cta-box reveal">
            <h2>Ready to build something amazing?</h2>
            <p>Join thousands of developers using our workspace template.</p>
            <a href="#home" class="btn">Back to Top 🚀</a>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <p>&copy; 2026 Crafted in your Web IDE. Modify the code to make it your own.</p>
    </footer>

    <!-- Custom JavaScript -->
    <script src="script.js"></script>
</body>
</html>`,
  },
  {
    id: 'style.css',
    name: 'style.css',
    language: 'css',
    content: `/* =========================================
           1. CSS VARIABLES & RESET
           ========================================= */
        :root {
            --bg-color: #0f172a; 
            --text-main: #f8fafc; 
            --text-muted: #94a3b8; 
            --primary: #6366f1; 
            --secondary: #8b5cf6; /* Added for minimal gradients */
            --card-bg: rgba(30, 41, 59, 0.5); 
            --glass-border: rgba(255, 255, 255, 0.08);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html {
            scroll-behavior: smooth;
        }

        /* Fix for sticky header overlapping section titles */
        section {
            scroll-margin-top: 85px;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-main);
            line-height: 1.6;
            overflow-x: hidden;
            position: relative;
        }

        /* Animated Background Gradient */
        body::before {
            content: '';
            position: fixed;
            top: -20%;
            left: -10%;
            width: 60vw;
            height: 60vw;
            background: radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(15, 23, 42, 0) 70%);
            border-radius: 50%;
            z-index: -1;
            animation: pulse-bg 10s infinite alternate;
        }

        /* =========================================
           2. NAVIGATION
           ========================================= */
        nav {
            position: fixed;
            top: 0;
            width: 100%;
            padding: 1.2rem 5%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(15, 23, 42, 0.7);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-bottom: 1px solid var(--glass-border);
            z-index: 1000;
        }

        .logo {
            font-size: 1.5rem;
            font-weight: 800;
            color: var(--text-main);
            text-decoration: none;
        }

        .logo span {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .nav-links {
            display: flex;
            gap: 2.5rem;
        }

        .nav-links a {
            color: var(--text-muted);
            text-decoration: none;
            font-weight: 600;
            font-size: 0.9rem;
            position: relative;
            transition: color 0.3s ease;
        }

        .nav-links a:hover {
            color: var(--text-main);
        }

        .nav-links a::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: -4px;
            left: 0;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            transition: width 0.3s ease;
        }

        .nav-links a:hover::after {
            width: 100%;
        }

        /* Hamburger & Overlay Settings */
        .hamburger {
            display: none;
            flex-direction: column;
            gap: 6px;
            cursor: pointer;
            z-index: 1002;
        }

        .hamburger span {
            width: 28px;
            height: 2px;
            background-color: var(--text-main);
            border-radius: 4px;
            transition: all 0.3s ease;
        }

        .nav-overlay {
            display: none;
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100vh;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(4px);
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .nav-overlay.active {
            display: block;
            opacity: 1;
            pointer-events: all;
        }

        /* =========================================
           3. UI COMPONENTS (Buttons & Utilities)
           ========================================= */
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 5%;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.9rem 2.2rem;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.95rem;
            border-radius: 50px; /* Pill shape */
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 1px solid transparent;
            position: relative;
            z-index: 1;
            overflow: hidden;
        }

        .btn::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(135deg, var(--secondary), var(--primary));
            opacity: 0;
            z-index: -1;
            transition: opacity 0.4s ease;
        }

        .btn:hover {
            transform: translateY(-4px) scale(1.02);
            box-shadow: 0 12px 24px rgba(139, 92, 246, 0.35);
            letter-spacing: 0.5px;
        }

        .btn:hover::before {
            opacity: 1;
        }

        .section-title {
            text-align: center;
            font-size: 2.2rem;
            margin-bottom: 1rem;
            font-weight: 800;
            background: linear-gradient(to right, #fff, var(--text-muted));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .section-subtitle {
            text-align: center;
            color: var(--text-muted);
            margin-bottom: 3.5rem;
            font-size: 1rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }

        /* =========================================
           4. SECTIONS
           ========================================= */
        
        /* Hero Section */
        .hero {
            min-height: 85vh;
            padding-top: 100px; /* Accounts for fixed nav */
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
        }

        .hero h2 {
            color: var(--secondary);
            font-weight: 600;
            margin-bottom: 0.8rem;
            letter-spacing: 2px;
            text-transform: uppercase;
            font-size: 0.8rem;
        }

        .hero h1 {
            font-size: clamp(2.5rem, 5vw, 4.2rem); /* Reduced Font Size */
            font-weight: 800;
            line-height: 1.15;
            margin-bottom: 1.2rem;
            letter-spacing: -1px;
        }

        .typing-container {
            display: inline-block;
            min-width: 20px;
            border-right: 3px solid var(--primary);
            padding-right: 5px;
            animation: blink 0.75s step-end infinite;
            background: linear-gradient(90deg, var(--text-main), var(--text-muted));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .hero p {
            color: var(--text-muted);
            font-size: 1rem; /* Reduced Font Size */
            max-width: 550px;
            margin-bottom: 2rem;
        }

        /* Features Section */
        .features {
            padding: 6rem 0;
        }

        .grid-3 {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
        }

        .feature-card {
            background: var(--card-bg);
            border: 1px solid var(--glass-border);
            border-radius: 20px;
            padding: 2.5rem 2rem;
            text-align: center;
            backdrop-filter: blur(10px);
            transition: all 0.4s ease;
        }

        .feature-card:hover {
            transform: translateY(-10px);
            border-color: rgba(139, 92, 246, 0.4);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
            background: rgba(30, 41, 59, 0.8);
        }

        .feature-icon {
            font-size: 2.5rem;
            margin-bottom: 1.5rem;
            display: inline-block;
            animation: float 4s ease-in-out infinite;
        }

        /* Delay animation for different cards */
        .feature-card:nth-child(2) .feature-icon { animation-delay: 1s; }
        .feature-card:nth-child(3) .feature-icon { animation-delay: 2s; }

        .feature-card h3 {
            font-size: 1.25rem;
            margin-bottom: 1rem;
            color: var(--text-main);
        }

        .feature-card p {
            color: var(--text-muted);
            font-size: 0.9rem;
        }

        /* About Section */
        .about {
            padding: 6rem 0;
            background: rgba(15, 23, 42, 0.3);
            border-top: 1px solid var(--glass-border);
            border-bottom: 1px solid var(--glass-border);
        }

        .about-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
        }

        .about-text h3 {
            font-size: 2rem;
            margin-bottom: 1.5rem;
            line-height: 1.3;
        }

        .about-text p {
            color: var(--text-muted);
            margin-bottom: 1.5rem;
            font-size: 0.95rem;
        }

        .about-visual {
            position: relative;
            height: 300px;
            background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1));
            border-radius: 24px;
            border: 1px solid var(--glass-border);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        .code-mockup {
            background: rgba(15, 23, 42, 0.9);
            padding: 1.5rem;
            border-radius: 12px;
            border: 1px solid var(--glass-border);
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            font-family: monospace;
            color: #10b981;
            transform: rotate(-3deg);
            transition: transform 0.5s ease;
        }

        .about-visual:hover .code-mockup {
            transform: rotate(0deg) scale(1.05);
        }

        /* CTA Section */
        .cta {
            padding: 8rem 0;
            text-align: center;
        }

        .cta-box {
            background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1));
            border: 1px solid rgba(139,92,246,0.3);
            border-radius: 30px;
            padding: 4rem 2rem;
            max-width: 800px;
            margin: 0 auto;
            position: relative;
            overflow: hidden;
        }

        .cta-box h2 {
            font-size: 2rem;
            margin-bottom: 1rem;
        }

        .cta-box p {
            color: var(--text-muted);
            margin-bottom: 2.5rem;
        }

        /* Contact Section */
        .contact {
            padding: 6rem 0;
            max-width: 800px;
            margin: 0 auto;
        }

        .contact-form {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            background: var(--card-bg);
            padding: 3rem;
            border-radius: 20px;
            border: 1px solid var(--glass-border);
            backdrop-filter: blur(10px);
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            text-align: left;
        }

        .form-group label {
            color: var(--text-main);
            font-size: 0.95rem;
            font-weight: 600;
        }

        .form-control {
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid var(--glass-border);
            border-radius: 10px;
            padding: 1rem;
            color: var(--text-main);
            font-family: inherit;
            transition: all 0.3s ease;
        }

        .form-control::placeholder {
            color: var(--text-muted);
        }

        .form-control:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }

        /* Footer */
        footer {
            text-align: center;
            padding: 2rem 5%;
            color: var(--text-muted);
            font-size: 0.85rem;
            border-top: 1px solid var(--glass-border);
        }

        /* =========================================
           5. ANIMATIONS (Keyframes & Utilities)
           ========================================= */
        @keyframes blink {
            from, to { border-color: transparent }
            50% { border-color: var(--primary); }
        }

        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
        }

        @keyframes pulse-bg {
            0% { opacity: 0.5; transform: scale(1); }
            100% { opacity: 1; transform: scale(1.1); }
        }

        .reveal {
            opacity: 0;
            transform: translateY(40px);
            transition: all 0.8s cubic-bezier(0.5, 0, 0, 1);
        }

        .reveal.active {
            opacity: 1;
            transform: translateY(0);
        }

        /* =========================================
           6. RESPONSIVE DESIGN (All specified breakpoints)
           ========================================= */
        
        /* 1440px - Large Desktop (Default max-width handles this beautifully) */
        @media (max-width: 1440px) {
            .container { max-width: 1100px; }
        }

        /* 1024px - Laptop/Tablet Landscape */
        @media (max-width: 1024px) {
            .hero h1 { font-size: 3.5rem; }
            .grid-3 { gap: 1.5rem; }
            .about-content { gap: 2rem; }
            .about-text h3 { font-size: 1.75rem; }
        }

        /* 768px - Tablet Portrait */
        @media (max-width: 768px) {
            nav { padding: 1rem 5%; }
            
            /* Off-canvas Navigation */
            .hamburger { display: flex; }
            
            .nav-links {
                position: fixed;
                top: 0;
                right: 0;
                transform: translateX(100%); /* Hardware accelerated positioning */
                width: 260px;
                height: 100vh;
                background: rgba(15, 23, 42, 0.98);
                backdrop-filter: blur(20px);
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 2.5rem;
                transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); /* Smooth standard easing */
                z-index: 1001;
                border-left: 1px solid var(--glass-border);
            }

            .nav-links.active {
                transform: translateX(0); /* Smoothly slide in */
            }

            /* Hamburger 'X' animation */
            .hamburger.active span:nth-child(1) {
                transform: translateY(8px) rotate(45deg);
            }
            .hamburger.active span:nth-child(2) {
                opacity: 0;
            }
            .hamburger.active span:nth-child(3) {
                transform: translateY(-8px) rotate(-45deg);
            }
            
            .hero h1 { font-size: 3rem; }
            .hero p { font-size: 0.95rem; }
            
            .grid-3 { grid-template-columns: 1fr; }
            .about-content { grid-template-columns: 1fr; text-align: center; }
            .about-text h3 { font-size: 2rem; }
            
            .section-title { font-size: 1.8rem; }
            .cta-box { padding: 3rem 1.5rem; border-radius: 20px; }
        }

        /* 480px - Mobile */
        @media (max-width: 480px) {
            .hero h1 { font-size: 2.2rem; }
            .hero h2 { font-size: 0.75rem; }
            .hero p { font-size: 0.9rem; margin-bottom: 1.5rem; }
            .btn { padding: 0.8rem 1.8rem; font-size: 0.85rem; }
            
            .features, .about, .cta, .contact { padding: 4rem 0; }
            .feature-card { padding: 2rem 1.5rem; }
            .about-visual { height: 200px; }
            .code-mockup { font-size: 0.8rem; padding: 1rem; }
            .contact-form { padding: 2rem 1.5rem; }
        }

        /* 320px - Small Mobile */
        @media (max-width: 320px) {
            .logo { font-size: 1.2rem; }
            .hero h1 { font-size: 1.8rem; }
            .section-title { font-size: 1.5rem; }
            .btn { width: 100%; text-align: center; }
            .cta-box h2 { font-size: 1.5rem; }
        }`,
  },
  {
    id: 'script.js',
    name: 'script.js',
    language: 'javascript',
    content: `// 1. Typing Animation Logic
const words = ["Code.", "Design.", "Logic.", "Innovation."];
let i = 0;      
let j = 0;      
let isDeleting = false;
const typewriterElement = document.getElementById("typewriter");

function type() {
    const currentWord = words[i];
    
    if (isDeleting) {
        typewriterElement.textContent = currentWord.substring(0, j - 1);
        j--;
    } else {
        typewriterElement.textContent = currentWord.substring(0, j + 1);
        j++;
    }

    let typeSpeed = isDeleting ? 40 : 120;

    if (!isDeleting && j === currentWord.length) {
        typeSpeed = 1500; 
        isDeleting = true;
    } else if (isDeleting && j === 0) {
        isDeleting = false;
        i++;
        if (i === words.length) i = 0; 
        typeSpeed = 500; 
    }

    setTimeout(type, typeSpeed);
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(type, 800);
});

// 2. Scroll Reveal Animations
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Run once
        }
    });
}, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
});

revealElements.forEach(el => {
    // Ignore elements that are already set to active (like Hero)
    if(!el.classList.contains('active')) {
        revealObserver.observe(el);
    }
});

// 3. Contact Form Submission Handling (Demo UI interaction)
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevents actual page reload
    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    
    // Show Success State
    btn.textContent = 'Message Sent! ✨';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    
    this.reset();
    
    // Reset Button after 3 seconds
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = ''; // Reverts to default CSS gradient
    }, 3000);
});

// 4. Navigation Fix (Ensures smooth scrolling inside iframe/IDE environments)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// 5. Mobile Off-Canvas Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');
const navItems = document.querySelectorAll('.nav-links a');
const navbar = document.querySelector('nav');

function toggleNav() {
    const isOpening = !navLinks.classList.contains('active');
    
    if (isOpening) {
        // Prevent layout jump from disappearing scrollbar
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = \`\${scrollbarWidth}px\`;
        navbar.style.paddingRight = \`calc(5% + \${scrollbarWidth}px)\`;
        document.body.style.overflow = 'hidden';
        
        hamburger.classList.add('active');
        navLinks.classList.add('active');
        navOverlay.classList.add('active');
    } else {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        navOverlay.classList.remove('active');
        
        // Wait for animation to finish before restoring scroll/padding
        setTimeout(() => {
            if (!navLinks.classList.contains('active')) {
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
                navbar.style.paddingRight = '';
            }
        }, 400); // Matches the CSS transition duration
    }
}

// Toggle on hamburger click
hamburger?.addEventListener('click', toggleNav);

// Close on overlay click
navOverlay?.addEventListener('click', toggleNav);

// Close when a link inside the menu is clicked
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            toggleNav();
        }
    });
});`,
  },
];
