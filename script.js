// Privacy Policy Interactive Features
class PrivacyPolicyManager {
    constructor() {
        this.currentLang = 'en';
        this.currentTheme = 'light';
        this.init();
    }

    init() {
        this.loadPreferences();
        this.bindEvents();
        this.updateContent();
        this.applyTheme();
    }

    bindEvents() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.addEventListener('click', () => this.toggleTheme());

        // Language toggle
        const langToggle = document.getElementById('lang-toggle');
        langToggle.addEventListener('click', () => this.toggleLanguage());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'd':
                        e.preventDefault();
                        this.toggleTheme();
                        break;
                    case 'l':
                        e.preventDefault();
                        this.toggleLanguage();
                        break;
                }
            }
        });

        // Auto theme detection
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addListener(() => this.handleSystemThemeChange());
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.savePreferences();
        this.announceChange(`Theme switched to ${this.currentTheme} mode`);
    }

    applyTheme() {
        const body = document.body;
        const themeIcon = document.querySelector('.theme-icon');
        
        if (this.currentTheme === 'dark') {
            body.setAttribute('data-theme', 'dark');
            themeIcon.textContent = '☀️';
        } else {
            body.removeAttribute('data-theme');
            themeIcon.textContent = '🌙';
        }
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
        this.updateContent();
        this.savePreferences();
        this.announceChange(`Language switched to ${this.currentLang === 'en' ? 'English' : 'Arabic'}`);
    }

    updateContent() {
        const englishContent = document.getElementById('english-content');
        const arabicContent = document.getElementById('arabic-content');
        const langText = document.getElementById('lang-text');
        const mainTitle = document.getElementById('main-title');
        const footerText = document.getElementById('footer-text');
        const html = document.documentElement;

        if (this.currentLang === 'ar') {
            // Switch to Arabic
            englishContent.classList.remove('active');
            arabicContent.classList.add('active');
            langText.textContent = 'English';
            mainTitle.textContent = 'سياسة الخصوصية';
            footerText.textContent = '© 2026 SilentShield. جميع الحقوق محفوظة.';
            html.setAttribute('lang', 'ar');
            html.setAttribute('dir', 'rtl');
            document.body.setAttribute('dir', 'rtl');
        } else {
            // Switch to English
            arabicContent.classList.remove('active');
            englishContent.classList.add('active');
            langText.textContent = 'العربية';
            mainTitle.textContent = 'Privacy Policy';
            footerText.textContent = '© 2026 SilentShield. All rights reserved.';
            html.setAttribute('lang', 'en');
            html.setAttribute('dir', 'ltr');
            document.body.setAttribute('dir', 'ltr');
        }
    }

    handleSystemThemeChange() {
        if (!localStorage.getItem('privacy-policy-theme')) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.currentTheme = prefersDark ? 'dark' : 'light';
            this.applyTheme();
        }
    }

    savePreferences() {
        localStorage.setItem('privacy-policy-lang', this.currentLang);
        localStorage.setItem('privacy-policy-theme', this.currentTheme);
    }

    loadPreferences() {
        // Load language preference
        const savedLang = localStorage.getItem('privacy-policy-lang');
        if (savedLang && ['en', 'ar'].includes(savedLang)) {
            this.currentLang = savedLang;
        } else {
            // Auto-detect language from browser
            const browserLang = navigator.language || navigator.userLanguage;
            this.currentLang = browserLang.startsWith('ar') ? 'ar' : 'en';
        }

        // Load theme preference
        const savedTheme = localStorage.getItem('privacy-policy-theme');
        if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
            this.currentTheme = savedTheme;
        } else {
            // Auto-detect theme from system preference
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.currentTheme = prefersDark ? 'dark' : 'light';
        }
    }

    announceChange(message) {
        // Create accessible announcement for screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}

// Utility functions
function smoothScrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Print functionality
function printPolicy() {
    window.print();
}

// Copy link functionality
function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Privacy policy link copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Privacy policy link copied to clipboard!');
    });
}

// Add screen reader only styles
const srOnlyStyles = `
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
`;

// Inject screen reader styles
const styleSheet = document.createElement('style');
styleSheet.textContent = srOnlyStyles;
document.head.appendChild(styleSheet);

// Initialize the privacy policy manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PrivacyPolicyManager();
    
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Refresh theme in case system preference changed
        const manager = window.privacyPolicyManager;
        if (manager) {
            manager.handleSystemThemeChange();
        }
    }
});

// Export for global access
window.privacyPolicyManager = null;
document.addEventListener('DOMContentLoaded', () => {
    window.privacyPolicyManager = new PrivacyPolicyManager();
});