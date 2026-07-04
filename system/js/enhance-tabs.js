/**
 * Enhanced Tabs Controller for MAYE System
 * Handles synchronization between sidebar, bottom nav, and tabs
 */

class EnhancedTabsController {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.sidebar = null;
        this.bottomNav = null;
        this.tabs = null;
        this.isInitialized = false;
        
        // Bind methods
        this.init = this.init.bind(this);
        this.syncNavigation = this.syncNavigation.bind(this);
        this.handleTabClick = this.handleTabClick.bind(this);
        this.handleNavigationClick = this.handleNavigationClick.bind(this);
        this.updateResponsiveBehavior = this.updateResponsiveBehavior.bind(this);
    }
    
    /**
     * Get current page from URL
     */
    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        return page;
    }
    
    /**
     * Initialize the tabs controller
     */
    init() {
        if (this.isInitialized) return;
        
        console.log('🚀 Initializing Enhanced Tabs Controller...');
        
        // Get navigation elements
        this.sidebar = document.getElementById('sidebar');
        this.bottomNav = document.getElementById('bottom-nav');
        this.tabs = document.querySelector('.nav-container');
        
        // Set initial active states
        this.syncNavigation();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Set up responsive behavior
        this.updateResponsiveBehavior();
        window.addEventListener('resize', this.updateResponsiveBehavior);
        
        // Listen for page changes
        window.addEventListener('popstate', () => {
            this.currentPage = this.getCurrentPage();
            this.syncNavigation();
        });
        
        this.isInitialized = true;
        console.log('✅ Enhanced Tabs Controller initialized');
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Tab clicks (existing tabs)
        if (this.tabs) {
            this.tabs.addEventListener('click', (e) => {
                const tab = e.target.closest('.nav-tab');
                if (tab && tab.dataset.tab) {
                    e.preventDefault();
                    this.handleTabClick(tab.dataset.tab);
                }
            });
        }
        
        // Sidebar navigation clicks
        if (this.sidebar) {
            this.sidebar.addEventListener('click', (e) => {
                const navItem = e.target.closest('.nav-item[data-page]');
                if (navItem && navItem.dataset.page) {
                    e.preventDefault();
                    this.handleNavigationClick(navItem.dataset.page);
                }
            });
        }
        
        // Bottom nav clicks
        if (this.bottomNav) {
            this.bottomNav.addEventListener('click', (e) => {
                const navItem = e.target.closest('.bottom-nav-item[data-page]');
                if (navItem && navItem.dataset.page) {
                    e.preventDefault();
                    this.handleNavigationClick(navItem.dataset.page);
                }
            });
        }
    }
    
    /**
     * Handle tab click
     */
    handleTabClick(tabName) {
        console.log(`Tab clicked: ${tabName}`);
        
        // Update current page
        const pageMap = {
            'dashboard': 'index.html',
            'purchase': 'purchase.html',
            'income': 'income.html',
            'settings': 'settings.html',
            'admin': 'admin.html'
        };
        
        const targetPage = pageMap[tabName] || 'index.html';
        
        // Only navigate if it's a different page
        if (targetPage !== this.currentPage) {
            window.location.href = targetPage;
        }
    }
    
    /**
     * Handle navigation click
     */
    handleNavigationClick(targetPage) {
        console.log(`Navigation clicked: ${targetPage}`);
        
        // Only navigate if it's a different page
        if (targetPage !== this.currentPage) {
            window.location.href = targetPage;
        }
    }
    
    /**
     * Sync active states across all navigation elements
     */
    syncNavigation() {
        const currentPage = this.getCurrentPage();
        this.currentPage = currentPage;
        
        console.log(`Syncing navigation for page: ${currentPage}`);
        
        // Map page to tab name for existing tabs
        const tabMap = {
            'index.html': 'dashboard',
            'purchase.html': 'purchase',
            'income.html': 'income',
            'settings.html': 'settings',
            'admin.html': 'admin'
        };
        
        const currentTab = tabMap[currentPage] || 'dashboard';
        
        // Update sidebar active state
        if (this.sidebar) {
            const sidebarItems = this.sidebar.querySelectorAll('.nav-item[data-page]');
            sidebarItems.forEach(item => {
                item.classList.remove('active');
                if (item.dataset.page === currentPage) {
                    item.classList.add('active');
                }
            });
        }
        
        // Update bottom nav active state
        if (this.bottomNav) {
            const bottomNavItems = this.bottomNav.querySelectorAll('.bottom-nav-item[data-page]');
            bottomNavItems.forEach(item => {
                item.classList.remove('active');
                if (item.dataset.page === currentPage) {
                    item.classList.add('active');
                }
            });
        }
        
        // Update tabs active state (only on index.html)
        if (this.tabs && currentPage === 'index.html') {
            const tabs = this.tabs.querySelectorAll('.nav-tab');
            const tabContents = document.querySelectorAll('.tab-content');
            
            tabs.forEach(tab => {
                tab.classList.remove('active');
                if (tab.dataset.tab === currentTab) {
                    tab.classList.add('active');
                }
            });
            
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === currentTab) {
                    content.classList.add('active');
                    content.classList.add('fade-in');
                }
            });
        }
        
        // Update admin visibility
        this.updateAdminVisibility();
    }
    
    /**
     * Update admin menu visibility based on user role
     */
    updateAdminVisibility() {
        const isAdmin = window.appState?.userProfile?.role === 'admin';
        
        // Update sidebar admin link
        const sidebarAdmin = document.getElementById('sidebar-admin-link');
        if (sidebarAdmin) {
            sidebarAdmin.classList.toggle('hidden', !isAdmin);
        }
        
        // Update bottom nav admin link
        const bottomAdmin = document.getElementById('bottom-admin-link');
        if (bottomAdmin) {
            bottomAdmin.classList.toggle('hidden', !isAdmin);
        }
        
        // Update admin tab (on index.html)
        const adminTab = document.querySelector('.admin-nav-tab');
        if (adminTab) {
            adminTab.classList.toggle('hidden', !isAdmin);
        }
        
        // Update user info in sidebar
        this.updateUserInfo();
    }
    
    /**
     * Update user information in sidebar
     */
    updateUserInfo() {
        const sidebarUserName = document.getElementById('sidebar-user-name');
        const sidebarUserRole = document.getElementById('sidebar-user-role');
        
        if (sidebarUserName && window.appState?.userProfile?.fullName) {
            sidebarUserName.textContent = window.appState.userProfile.fullName;
        }
        
        if (sidebarUserRole && window.appState?.userProfile?.role) {
            sidebarUserRole.textContent = window.appState.userProfile.role;
        }
    }
    
    /**
     * Update responsive behavior
     */
    updateResponsiveBehavior() {
        const isMobile = window.innerWidth <= 768;
        
        // Hide/show sidebar based on screen size
        if (this.sidebar) {
            if (isMobile) {
                this.sidebar.classList.remove('collapsed');
                this.sidebar.classList.remove('mobile-open');
            }
        }
        
        // Hide/show bottom nav based on screen size
        if (this.bottomNav) {
            this.bottomNav.style.display = isMobile ? 'block' : 'none';
        }
        
        // Adjust main content padding for bottom nav
        const mainContent = document.querySelector('.main-content');
        if (mainContent && isMobile) {
            mainContent.style.paddingBottom = '70px';
        } else if (mainContent) {
            mainContent.style.paddingBottom = '';
        }
    }
    
    /**
     * Toggle sidebar (for mobile hamburger menu)
     */
    toggleSidebar() {
        if (this.sidebar && window.innerWidth <= 768) {
            this.sidebar.classList.toggle('mobile-open');
        }
    }
    
    /**
     * Collapse/expand sidebar
     */
    toggleSidebarCollapse() {
        if (this.sidebar && window.innerWidth > 768) {
            this.sidebar.classList.toggle('collapsed');
        }
    }
}

// Initialize Enhanced Tabs Controller
document.addEventListener('DOMContentLoaded', function() {
    // Create global instance
    window.enhancedTabs = new EnhancedTabsController();
    
    // Initialize when DOM is ready
    setTimeout(() => {
        window.enhancedTabs.init();
    }, 100);
    
    // Integrate with existing appState
    if (window.appState) {
        // Override updateUserInterface to include our updates
        const originalUpdateUI = window.updateUserInterface || function() {};
        window.updateUserInterface = function() {
            originalUpdateUI();
            if (window.enhancedTabs) {
                window.enhancedTabs.updateAdminVisibility();
                window.enhancedTabs.updateUserInfo();
            }
        };
    }
    
    // Listen for authentication changes
    if (typeof onAuthStateChanged === 'function' && window.auth) {
        onAuthStateChanged(window.auth, (user) => {
            if (user && window.enhancedTabs) {
                setTimeout(() => {
                    window.enhancedTabs.updateAdminVisibility();
                    window.enhancedTabs.updateUserInfo();
                }, 500);
            }
        });
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedTabsController;
}