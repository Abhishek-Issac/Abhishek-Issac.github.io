# Abhishek Issac — Developer Portfolio

A magnificent, NASA-level tech portfolio website showcasing my projects, skills, and journey as a developer. Built entirely with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools, just pure code.

![Portfolio Preview](https://img.shields.io/badge/Status-Live-00f0ff?style=for-the-badge&logo=github)
![Lines of Code](https://img.shields.io/badge/Lines-10k+-ff10f0?style=for-the-badge)
![Theme Count](https://img.shields.io/badge/Themes-6-7b2ff7?style=for-the-badge)

## Features

### Visual Effects
- **Interactive Particle Background** — Canvas-based particle system with mouse interaction and collision detection
- **6 Color Themes** — Neon, Cyberpunk, Ocean Deep, Ember Blaze, Aurora, Matrix — with instant switching
- **Smooth Scroll Animations** — Intersection Observer-powered entrance animations with stagger delays
- **Typewriter Effect** — Dynamic role display cycling through developer titles
- **Glassmorphism UI** — Frosted glass cards with backdrop blur effects
- **Floating Shapes** — Background decorative shapes with parallax-like motion
- **Gradient Orbs** — Animated gradient background blobs
- **Scan Line Effect** — HUD/sci-fi scanning line animation
- **Morphing Blob** — Continuously shape-shifting decorative element
- **Glitch Text** — Subtle glitch animation for headings

### Interactive Components
- **GitHub API Integration** — Live repository data, stars, forks, and profile stats
- **Project Filtering** — Category-based project showcase (bots, web, tools, games, mobile)
- **3D Tilt Cards** — Mouse-following tilt effect on project and skill cards
- **Magnetic Buttons** — Buttons that subtly follow cursor on hover
- **Ripple Effect** — Material Design-style click ripple on buttons
- **Reading Progress Bar** — Page scroll progress indicator at the top
- **Text Scramble** — Character scramble effect for text transitions
- **Smooth Scroll** — Animated scroll-to-section navigation
- **Counter Animation** — Animated number counting for stats

### Navigation
- **Cross-Page Navigation** — Consistent header across 8 HTML pages
- **Responsive Mobile Menu** — Hamburger menu with slide-in drawer
- **Auto-Hide Navigation** — Nav bar hides on scroll down, shows on scroll up
- **Active Link Highlighting** — Current page/section highlighted in nav
- **Breadcrumb Trail** — Page location breadcrumbs on subpages
- **Scroll to Top** — Floating button appearing after scroll threshold

### Pages
- **Home** (`index.html`) — Hero, about summary, skills, projects, timeline, GitHub, contact
- **About** (`about.html`) — Extended biography, interests, development stats
- **Skills** (`skills.html`) — Detailed skill categories with progress bars
- **Projects** (`projects.html`) — Full project showcase with featured project
- **Journey** (`timeline.html`) — Development timeline with milestones
- **GitHub** (`github.html`) — GitHub profile, pinned repos, live API data
- **Contact** (`contact.html`) — Contact form and social links
- **404** (`404.html`) — Custom "Lost in the Matrix" error page

### Design System
- **CSS Custom Properties** — 50+ design tokens for colors, spacing, typography
- **Theme Engine** — Runtime theme switching with localStorage persistence
- **Responsive Grid** — Flexible grid system adapting from 4 to 1 columns
- **Utility Classes** — Comprehensive utility class system for rapid layout
- **Print Styles** — Clean print stylesheet for portfolio printing

## Tech Stack

| Technology | Usage |
|-----------|-------|
| HTML5 | Semantic markup, Open Graph meta tags |
| CSS3 | Custom properties, Grid, Flexbox, animations, backdrop-filter |
| JavaScript (ES6+) | Classes, async/await, IntersectionObserver, Canvas API |
| Canvas API | Particle system rendering and mouse interaction |
| GitHub REST API | Live repository data fetching |
| Font Awesome 6 | Icon library |
| Google Fonts | Inter, JetBrains Mono, Orbitron typefaces |

## Project Structure

```
├── index.html                 # Main portfolio page (hero + all sections)
├── about.html                 # Extended biography and interests
├── skills.html                # Detailed technical skills
├── projects.html              # Full project showcase
├── timeline.html              # Developer journey milestones
├── github.html                # GitHub profile and live repos
├── contact.html               # Contact form and social links
├── 404.html                   # Custom 404 error page
├── README.md                  # This file
├── images/
│   └── profile.jpeg           # Profile photo placeholder
├── assets/
│   ├── css/
│   │   ├── main.css           # Core styles, variables, base components
│   │   ├── navigation.css     # Header, mobile nav, breadcrumbs
│   │   ├── animations.css     # 50+ keyframe animations, stagger system
│   │   ├── components.css     # All UI components (hero, cards, etc.)
│   │   ├── themes.css         # 6 color theme definitions
│   │   └── pages.css          # Page-specific styles, utilities
│   └── js/
│       ├── main.js            # Core app functionality
│       ├── particles.js       # Particle background engine
│       └── effects.js         # Advanced effects (tilt, scramble, etc.)
└── favicon.ico
```

## Color Themes

| Theme | Primary | Secondary | Accent |
|-------|---------|-----------|--------|
| Neon (default) | `#00f0ff` | `#ff10f0` | `#7b2ff7` |
| Cyberpunk | `#ff10f0` | `#00f0ff` | `#ffdd00` |
| Ocean Deep | `#00d4ff` | `#0066ff` | `#00ffaa` |
| Ember Blaze | `#ff6600` | `#ff0044` | `#ffaa00` |
| Aurora | `#a855f7` | `#ec4899` | `#06b6d4` |
| Matrix | `#00ff41` | `#39ff14` | `#00ff41` |

## Setup

No build step required! Just open `index.html` in a browser, or deploy to any static hosting.

```bash
# Clone the repository
git clone https://github.com/Abhishek-Issac/Abhishek-Issac.github.io.git

# Navigate to directory
cd Abhishek-Issac.github.io

# Open in browser (macOS)
open index.html

# Or serve with any HTTP server
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 14+
- Edge 80+

## Performance

- No external JavaScript frameworks
- No build tools or bundlers
- Lazy-loaded images
- GPU-accelerated animations (transform, opacity)
- `will-change` hints for animated elements
- `prefers-reduced-motion` accessibility support
- Efficient IntersectionObserver for scroll animations
- FPS-limited particle system

## Live Site

Visit: [abhishek-issac.github.io](https://abhishek-issac.github.io)

## Author

**Abhishek Issac**
- GitHub: [@Abhishek-Issac](https://github.com/Abhishek-Issac)
- Telegram: [@AbhishekIssac](https://t.me/AbhishekIssac)
- Instagram: [@abhishek_issac_](https://instagram.com/abhishek_issac_)

## License

MIT License — feel free to use this as inspiration for your own portfolio!
