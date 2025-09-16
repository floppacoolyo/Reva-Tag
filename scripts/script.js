document.addEventListener("DOMContentLoaded", () => {
    // Initialize components after header is loaded
    initializePage();
});

/**
 * Main function to initialize all page components.
 */
function initializePage() {
    initializeScrollEffects();
    initializeFooter();
    initializeMobileNav();
    initializeThemeSwitcher();
    setActiveNavLink();
    
    // Page-specific initializers
    if (document.querySelector('.faq')) {
        initializeFAQ();
    }
    
    if (document.querySelector('.blogs-container')) {
        initializeBlog();
    }
}

/**
 * Adds an 'active' class to the navigation link corresponding to the current page.
 */
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    // Adjust paths for pages directory
    const isInPagesDir = currentPage !== 'index.html';
    const navLinks = document.querySelectorAll('.header-button, .mobile-nav a');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (!linkHref) return;

        const targetPage = linkHref.split('#')[0];
        
        if (targetPage === currentPage) {
            link.classList.add('active');
        }
    });
}


/**
 * Handles smooth scrolling to a section on the page.
 * @param {string} sectionId - The ID of the section to scroll to.
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        // Calculate offset for the fixed header
        const headerOffset = 100; // Height of the header
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
}

/**
 * Initializes the header scroll effect (shrinking/changing background).
 */
function initializeScrollEffects() {
    const header = document.querySelector(".navigationHeader");
    if (!header) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
}

/**
 * Initializes the FAQ accordion functionality.
 */
function initializeFAQ() {
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
        item.addEventListener("click", () => {
            item.classList.toggle("open");
        });
    });
}

/**
 * Initializes the blog page, fetching and displaying blog posts.
 */
function initializeBlog() {
    // --- Blog Data ---
    const blogs = [
        {
            title: "Developer Update #1",
            date: "July 26, 2024",
            author: "abztrc",
            image: "../images/Logo.png",
            fields: {
                "✨ Additions": "Added new cosmetic items for players to unlock.",
                "🔧 Changes": "Improved UI elements for better navigation and clarity.",
                "🐛 Fixes": "Resolved a bug causing players to get stuck in the main lobby.",
            },
            new: true,
            available: true,
        },
        {
            title: "Community Spotlight #1",
            date: "August 15, 2024",
            author: "Hollow Tags Team",
            image: "../images/Logo.png",
            fields: {
                "🏆 Winner": "Congratulations to @Player123 for winning our first community contest!",
                "🎨 Fan Art": "Check out this amazing fan art from @CreativePlayer!",
                "💡 Suggestions": "We're listening to your feedback! Here are some of the top suggestions we're considering.",
            },
            new: false,
            available: true,
        },
        {
            title: "Patch Notes 1.0.1",
            date: "September 5, 2024",
            author: "abztrc",
            image: "../images/Logo.png",
            fields: {
                "✨ Additions": "Added a new map: 'Cosmic Arena'.",
                "🔧 Changes": "Rebalanced the 'Speed Boost' power-up.",
                "🐛 Fixes": "Fixed a rare issue where players could fall through the map.",
            },
            new: false,
            available: true,
        },
        // Add more blog posts here in the future
    ];

    const blogsContainer = document.querySelector(".blogs-container");
    if (!blogsContainer) return;

    // --- Render Blog Previews ---
    blogs
        .filter((blog) => blog.available)
        .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by most recent date
        .forEach((blog) => {
            const blogPreview = document.createElement("div");
            blogPreview.classList.add("blog-preview");
            blogPreview.innerHTML = `
                ${blog.new ? '<div class="new-badge">NEW</div>' : ''}
                <div class="blog-image-wrapper">
                    <img class="blog-image" src="${blog.image || "images/Logo.png"}" alt="${blog.title}" loading="lazy" />
                </div>
                <div class="blog-info">
                    <h2 class="blog-title">${blog.title}</h2>
                    <p class="blog-meta">By ${blog.author} on ${blog.date}</p>
                </div>
            `;
            blogPreview.addEventListener("click", () => handleBlogClick(blog));
            blogsContainer.appendChild(blogPreview);
        });
}

/**
 * Handles showing the blog post popup.
 * @param {object} blog - The blog post data.
 */
function handleBlogClick(blog) {
    // Prevent multiple popups
    if (document.querySelector('.popup-overlay')) return;

    const popupOverlay = document.createElement("div");
    popupOverlay.classList.add("popup-overlay");

    const popupContent = document.createElement("div");
    popupContent.classList.add("popup-content");

    let fieldsHTML = "";
    for (const [key, value] of Object.entries(blog.fields)) {
        fieldsHTML += `
            <div class="field">
                <h2>${key}</h2>
                <p>${value}</p>
            </div>
        `;
    }

    popupContent.innerHTML = `
        <button class="close-popup">&times;</button>
        <img class="popup-header-image" src="${blog.image}" alt="${blog.title}" loading="lazy" />
        <div class="popup-body">
            <h1>${blog.title}</h1>
            <p class="popup-meta">By ${blog.author} on ${blog.date}</p>
            ${fieldsHTML}
        </div>
    `;

    popupOverlay.appendChild(popupContent);
    document.body.appendChild(popupOverlay);

    // Close popup functionality
    const closePopup = () => document.body.removeChild(popupOverlay);
    popupContent.querySelector(".close-popup").addEventListener("click", closePopup);
    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
             closePopup();
        }
    });
}

/**
 * Sets the current year in the footer copyright.
 */
function initializeFooter() {
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

/**
 * Initializes the mobile navigation functionality.
 */
function initializeMobileNav() {
    const mobileNavButton = document.querySelector('.mobile-nav-button');
    const mobileNavCloseButton = document.querySelector('.mobile-nav-close-button');
    const mobileNav = document.querySelector('.mobile-nav');

    if (mobileNavButton && mobileNav) {
        mobileNavButton.addEventListener('click', () => {
            mobileNav.classList.add('open');
        });
    }

    if (mobileNavCloseButton && mobileNav) {
        mobileNavCloseButton.addEventListener('click', () => {
            mobileNav.classList.remove('open');
        });
    }
}

/**
 * Initializes the theme switcher functionality.
 */
function initializeThemeSwitcher() {
    const themeSwitcher = document.getElementById('theme-switcher');
    const body = document.body;

    if (!themeSwitcher) return;

    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        body.classList.add(currentTheme);
    } else {
        body.classList.add('theme-blue-purple');
    }

    themeSwitcher.addEventListener('click', () => {
        if (body.classList.contains('theme-blue-purple')) {
            body.classList.remove('theme-blue-purple');
            body.classList.add('theme-orange');
            localStorage.setItem('theme', 'theme-orange');
        } else {
            body.classList.remove('theme-orange');
            body.classList.add('theme-blue-purple');
            localStorage.setItem('theme', 'theme-blue-purple');
        }
    });
}
