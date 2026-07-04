// ==================== MAIN SETTINGS CONTROLLER ====================

class SettingsController {
    constructor() {
        this.settings = null;
        this.currentLanguage = 'rw';
        this.initialize();
    }

    // ✅ Initialize settings controller
    initialize() {
        console.log('🔄 Initializing Settings Controller...');
        
        this.loadSettings();
        this.setupGlobalEventListeners();
        this.applyGlobalSettings();
        
        console.log('✅ Settings Controller initialized');
    }

    // ✅ Load settings from storage
    loadSettings() {
        try {
            const saved = localStorage.getItem('mayeSystemSettings');
            if (saved) {
                this.settings = JSON.parse(saved);
                this.currentLanguage = this.settings.system?.language || 'rw';
            } else {
                this.settings = this.getDefaultSettings();
                this.saveSettings();
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            this.settings = this.getDefaultSettings();
        }

        // Make settings globally available
        window.appState = window.appState || {};
        window.appState.settings = this.settings.system || {};
    }

    // ✅ Save settings to storage
    saveSettings() {
        try {
            localStorage.setItem('mayeSystemSettings', JSON.stringify(this.settings));
            
            // Update global app state
            if (window.appState) {
                window.appState.settings = this.settings.system || {};
            }
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    // ✅ Get default settings
    getDefaultSettings() {
        return {
            profile: {
                fullName: 'KWIHANGANA Jean Paul',
                email: 'kwihangana@mayesystem.rw',
                phone: '',
                bio: '',
                joinDate: new Date().toISOString(),
                notifications: {
                    email: true,
                    push: true,
                    sms: false
                }
            },
            system: {
                currency: 'RWF',
                language: 'rw',
                dateFormat: 'dd-mm-yyyy',
                timeFormat: '24h',
                theme: 'light',
                paginationSize: 10,
                autoBackup: false,
                backupInterval: 'weekly',
                sessionTimeout: 30
            },
            security: {
                twoFactor: false,
                loginAlerts: true,
                autoLogout: true,
                passwordExpiry: 90,
                failedAttempts: 5
            },
            notifications: {
                notifyPurchaseAlerts: true,
                notifyLowBalance: true,
                notifyIncomeAlerts: true,
                notifyMonthlyReports: true,
                notifySystemUpdates: true,
                notifySecurityAlerts: true,
                notifyReportReady: true
            },
            advanced: {
                analytics: true,
                errorReporting: true,
                performanceMode: false,
                developerMode: false,
                experimentalFeatures: false,
                logLevel: 'info'
            },
            backups: []
        };
    }

    // ✅ Apply global settings to entire application
    applyGlobalSettings() {
        if (!this.settings?.system) return;

        const { currency, language, dateFormat, timeFormat, theme } = this.settings.system;

        // Apply theme
        this.applyTheme(theme);

        // Apply language
        this.applyGlobalLanguage(language);

        // Update app state
        if (window.appState) {
            window.appState.settings = {
                currency,
                language,
                dateFormat,
                timeFormat,
                theme
            };
        }

        // Update UI elements
        this.updateGlobalUI();
    }

    // ✅ Apply theme to entire application
    applyTheme(theme) {
        const html = document.documentElement;
        
        // Remove existing theme classes
        html.classList.remove('theme-light', 'theme-dark', 'theme-auto');
        
        // Add new theme class
        html.classList.add(`theme-${theme}`);
    }

    // ✅ Apply language to entire application
    applyGlobalLanguage(language) {
        this.currentLanguage = language;
        
        // Update language selector if exists
        const languageSelector = document.getElementById('language-selector');
        if (languageSelector) {
            languageSelector.value = language;
        }

        // Update system language selector if exists
        const systemLanguageSelector = document.getElementById('system-language');
        if (systemLanguageSelector) {
            systemLanguageSelector.value = language;
        }

        // Trigger language change event for other components
        this.triggerLanguageChange(language);
    }

    // ✅ Trigger language change for other components
    triggerLanguageChange(language) {
        // Dispatch custom event for other components to listen to
        const event = new CustomEvent('languageChanged', {
            detail: { language }
        });
        document.dispatchEvent(event);

        // Update Enhanced Settings if available
        if (window.enhancedSettings && window.enhancedSettings.applyLanguage) {
            window.enhancedSettings.applyLanguage(language);
        }
    }

    // ✅ Update global UI elements
    updateGlobalUI() {
        // Update date/time displays
        if (window.updateDateTime) {
            window.updateDateTime();
        }

        // Update currency displays
        this.updateCurrencyDisplays();

        // Update navigation and other UI elements
        this.updateNavigationText();
    }

    // ✅ Update currency displays throughout the app
    updateCurrencyDisplays() {
        const currency = this.settings.system?.currency || 'RWF';
        const currencyElements = document.querySelectorAll('.currency-display');
        
        currencyElements.forEach(element => {
            const amount = element.getAttribute('data-amount') || '0';
            element.textContent = this.formatCurrency(amount, currency);
        });
    }

    // ✅ Format currency based on settings
    formatCurrency(amount, currency = null) {
        const curr = currency || this.settings.system?.currency || 'RWF';
        
        try {
            const numericAmount = parseFloat(amount) || 0;
            
            const formats = {
                'RWF': new Intl.NumberFormat('rw-RW', {
                    style: 'currency',
                    currency: 'RWF'
                }),
                'USD': new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                }),
                'EUR': new Intl.NumberFormat('de-DE', {
                    style: 'currency',
                    currency: 'EUR'
                }),
                'GBP': new Intl.NumberFormat('en-GB', {
                    style: 'currency',
                    currency: 'GBP'
                }),
                'KES': new Intl.NumberFormat('sw-KE', {
                    style: 'currency',
                    currency: 'KES'
                })
            };

            return formats[curr]?.format(numericAmount) || `${numericAmount.toLocaleString()} ${curr}`;
        } catch (error) {
            return `${amount} ${curr}`;
        }
    }

    // ✅ Update navigation and UI text
    updateNavigationText() {
        const translations = this.getTranslations();
        const lang = this.currentLanguage;

        // Update navigation tabs
        const navTabs = {
            'dashboard': ['🏠', translations[lang]?.dashboard || 'Dashboard'],
            'purchase': ['🛒', translations[lang]?.purchase || 'Ibyaguzwe'],
            'income': ['💰', translations[lang]?.income || 'Amafaranga Yinjiye'],
            'settings': ['⚙️', translations[lang]?.settings || 'Igenamiterere'],
            'admin': ['👑', translations[lang]?.admin || 'Admin']
        };

        Object.entries(navTabs).forEach(([tabName, [icon, text]]) => {
            const tab = document.querySelector(`[data-tab="${tabName}"]`);
            if (tab) {
                tab.innerHTML = `<span class="mr-2">${icon}</span>${text}`;
            }
        });

        // Update section headers
        this.updateSectionHeaders(translations[lang]);
    }

    // ✅ Update section headers based on language
    updateSectionHeaders(translations) {
        if (!translations) return;

        const sections = {
            'dashboard-header': translations.dashboard || 'Dashboard',
            'purchase-header': translations.purchase || 'Ibyaguzwe',
            'income-header': translations.income || 'Amafaranga Yinjiye',
            'settings-header': translations.settings || 'Igenamiterere',
            'admin-header': translations.admin || 'Admin'
        };

        Object.entries(sections).forEach(([sectionId, text]) => {
            const element = document.getElementById(sectionId);
            if (element) {
                const h1 = element.querySelector('h1, h2');
                if (h1) {
                    // Preserve icons and other elements
                    const icon = h1.querySelector('span:first-child')?.textContent || '';
                    h1.innerHTML = `${icon} ${text}`;
                }
            }
        });
    }

    // ✅ Get translations for all languages
    getTranslations() {
        return {
            rw: {
                dashboard: 'Dashboard',
                purchase: 'Ibyaguzwe',
                income: 'Amafaranga Yinjiye',
                settings: 'Igenamiterere',
                admin: 'Admin',
                welcome: 'Murakaza neza',
                logout: 'Sohoka',
                search: 'Shakisha',
                add: 'Ongeramo',
                edit: 'Hindura',
                delete: 'Siba',
                view: 'Reba',
                save: 'Bika',
                cancel: 'Funga'
            },
            sw: {
                dashboard: 'Dashibodi',
                purchase: 'Manunuzi',
                income: 'Mapato',
                settings: 'Mipangilio',
                admin: 'Msimamizi',
                welcome: 'Karibu',
                logout: 'Toka',
                search: 'Tafuta',
                add: 'Ongeza',
                edit: 'Hariri',
                delete: 'Futa',
                view: 'Tazama',
                save: 'Hifadhi',
                cancel: 'Ghairi'
            },
            en: {
                dashboard: 'Dashboard',
                purchase: 'Purchases',
                income: 'Income',
                settings: 'Settings',
                admin: 'Admin',
                welcome: 'Welcome',
                logout: 'Logout',
                search: 'Search',
                add: 'Add',
                edit: 'Edit',
                delete: 'Delete',
                view: 'View',
                save: 'Save',
                cancel: 'Cancel'
            },
            fr: {
                dashboard: 'Tableau de bord',
                purchase: 'Achats',
                income: 'Revenu',
                settings: 'Paramètres',
                admin: 'Admin',
                welcome: 'Bienvenue',
                logout: 'Déconnexion',
                search: 'Rechercher',
                add: 'Ajouter',
                edit: 'Modifier',
                delete: 'Supprimer',
                view: 'Voir',
                save: 'Sauvegarder',
                cancel: 'Annuler'
            }
        };
    }

    // ✅ Setup global event listeners
    setupGlobalEventListeners() {
        // Language selector change
        const languageSelector = document.getElementById('language-selector');
        if (languageSelector) {
            languageSelector.addEventListener('change', (e) => {
                this.changeGlobalLanguage(e.target.value);
            });
        }

        // System language selector change (in settings)
        const systemLanguageSelector = document.getElementById('system-language');
        if (systemLanguageSelector) {
            systemLanguageSelector.addEventListener('change', (e) => {
                this.changeGlobalLanguage(e.target.value);
            });
        }

        // Listen for language changes from other components
        document.addEventListener('languageChanged', (e) => {
            this.changeGlobalLanguage(e.detail.language);
        });
    }

    // ✅ Change global language
    changeGlobalLanguage(language) {
        this.currentLanguage = language;
        
        // Update settings
        if (this.settings.system) {
            this.settings.system.language = language;
            this.saveSettings();
        }

        // Apply to entire application
        this.applyGlobalLanguage(language);
        this.updateGlobalUI();

        // Show confirmation
        this.showToast(`Ururimi rwahinduwe: ${this.getLanguageName(language)}`, 'success');
    }

    // ✅ Get language name
    getLanguageName(code) {
        const languages = {
            'rw': 'Kinyarwanda',
            'sw': 'Kiswahili',
            'en': 'English',
            'fr': 'Français'
        };
        return languages[code] || code;
    }

    // ✅ Show toast message
    showToast(message, type = 'info') {
        if (window.showToast) {
            window.showToast(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    // ✅ Get current settings
    getSettings() {
        return this.settings;
    }

    // ✅ Update specific setting
    updateSetting(category, key, value) {
        if (!this.settings[category]) {
            this.settings[category] = {};
        }
        
        this.settings[category][key] = value;
        this.saveSettings();
        
        // Apply changes if they're system settings
        if (category === 'system') {
            this.applyGlobalSettings();
        }
    }
}

// ✅ Initialize Settings Controller when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.settingsController = new SettingsController();
});

// ✅ Export for global access
window.SettingsController = SettingsController;

console.log('✅ Settings Controller with Global Language Support loaded successfully!');