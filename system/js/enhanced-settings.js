// ==================== ENHANCED SETTINGS FUNCTIONALITY ====================

class EnhancedSettings {
    constructor() {
        this.currentTab = 'profile';
        this.settingsData = this.loadSettings();
        this.currentLanguage = this.settingsData.system?.language || 'rw';
        this.translations = this.getTranslations();
        this.initialize();
    }

    // ✅ Initialize settings module
    initialize() {
        console.log('🔄 Initializing Enhanced Settings Module...');
        
        this.setupTabSystem();
        this.setupEventListeners();
        this.loadCurrentSettings();
        this.updateSummaryCards();
        this.setupRealTimePreviews();
        this.applyLanguage(this.currentLanguage);
        
        console.log('✅ Enhanced Settings Module initialized');
    }

    // ==================== MULTI-LANGUAGE SUPPORT ====================

    getTranslations() {
        return {
            rw: {
                // Profile Tab
                'profile': 'Profaili',
                'system': 'Sisitemu',
                'security': 'Umutekano',
                'notifications': 'Amenyo',
                'data': 'Amakuru',
                'advanced': 'Ingenzi',
                
                // Common
                'save': 'Bika',
                'cancel': 'Funga',
                'reset': 'Subiza',
                'loading': 'Birakorwa...',
                'success': 'Byakozwe neza!',
                'error': 'Ikosa',
                
                // Profile
                'fullName': 'Izina Ryuzuye',
                'email': 'Imeli',
                'phone': 'Telefone',
                'bio': 'Ibisobanuro',
                'changePhoto': 'Hindura ifoto',
                'notificationPreferences': 'Icyifuzo cy\'Amenyo',
                
                // System
                'currency': 'Ifaranga',
                'language': 'Ururimi',
                'dateFormat': 'Imiterere y\'Itariki',
                'timeFormat': 'Imiterere y\'Isaha',
                'theme': 'Imiterere',
                'paginationSize': 'Ingano ya Page',
                
                // Security
                'changePassword': 'Hindura Ijambobanga',
                'twoFactorAuth': 'Two-Factor Authentication',
                'loginAlerts': 'Amenyo yo Kwinjira',
                'autoLogout': 'Gusohoka Automatique',
                
                // Notifications
                'purchaseAlerts': 'Ibyaguzwe Bishya',
                'lowBalance': 'Amafaranga Make',
                'incomeAlerts': 'Amafaranga Yinjiye',
                'monthlyReports': 'Raporo z\'Ukwezi'
            },
            sw: {
                // Profile Tab
                'profile': 'Wasifu',
                'system': 'Mfumo',
                'security': 'Usalama',
                'notifications': 'Arifa',
                'data': 'Data',
                'advanced': 'Za Juu',
                
                // Common
                'save': 'Hifadhi',
                'cancel': 'Futa',
                'reset': 'Weka Upya',
                'loading': 'Inapakia...',
                'success': 'Imefanikiwa!',
                'error': 'Hitilafu',
                
                // Profile
                'fullName': 'Jina Kamili',
                'email': 'Barua Pepe',
                'phone': 'Simu',
                'bio': 'Maelezo',
                'changePhoto': 'Badilisha Picha',
                'notificationPreferences': 'Mapendeleo ya Arifa',
                
                // System
                'currency': 'Sarafu',
                'language': 'Lugha',
                'dateFormat': 'Muundo wa Tarehe',
                'timeFormat': 'Muundo wa Saa',
                'theme': 'Mandhari',
                'paginationSize': 'Ukubwa wa Ukurasa',
                
                // Security
                'changePassword': 'Badilisha Nenosiri',
                'twoFactorAuth': 'Uthibitishaji wa Vipengele Viwili',
                'loginAlerts': 'Arifa za Kuingia',
                'autoLogout': 'Kujiongozea Kutoa',
                
                // Notifications
                'purchaseAlerts': 'Ununuzi Mpya',
                'lowBalance': 'Mizani ya Chini',
                'incomeAlerts': 'Mapato Yanayoingia',
                'monthlyReports': 'Ripoti za Mwezi'
            },
            en: {
                // Profile Tab
                'profile': 'Profile',
                'system': 'System',
                'security': 'Security',
                'notifications': 'Notifications',
                'data': 'Data',
                'advanced': 'Advanced',
                
                // Common
                'save': 'Save',
                'cancel': 'Cancel',
                'reset': 'Reset',
                'loading': 'Loading...',
                'success': 'Success!',
                'error': 'Error',
                
                // Profile
                'fullName': 'Full Name',
                'email': 'Email',
                'phone': 'Phone',
                'bio': 'Bio',
                'changePhoto': 'Change Photo',
                'notificationPreferences': 'Notification Preferences',
                
                // System
                'currency': 'Currency',
                'language': 'Language',
                'dateFormat': 'Date Format',
                'timeFormat': 'Time Format',
                'theme': 'Theme',
                'paginationSize': 'Page Size',
                
                // Security
                'changePassword': 'Change Password',
                'twoFactorAuth': 'Two-Factor Authentication',
                'loginAlerts': 'Login Alerts',
                'autoLogout': 'Auto Logout',
                
                // Notifications
                'purchaseAlerts': 'New Purchases',
                'lowBalance': 'Low Balance',
                'incomeAlerts': 'Income Alerts',
                'monthlyReports': 'Monthly Reports'
            },
            fr: {
                // Profile Tab
                'profile': 'Profil',
                'system': 'Système',
                'security': 'Sécurité',
                'notifications': 'Notifications',
                'data': 'Données',
                'advanced': 'Avancé',
                
                // Common
                'save': 'Sauvegarder',
                'cancel': 'Annuler',
                'reset': 'Réinitialiser',
                'loading': 'Chargement...',
                'success': 'Succès!',
                'error': 'Erreur',
                
                // Profile
                'fullName': 'Nom Complet',
                'email': 'Email',
                'phone': 'Téléphone',
                'bio': 'Bio',
                'changePhoto': 'Changer la Photo',
                'notificationPreferences': 'Préférences de Notification',
                
                // System
                'currency': 'Devise',
                'language': 'Langue',
                'dateFormat': 'Format de Date',
                'timeFormat': 'Format d\'Heure',
                'theme': 'Thème',
                'paginationSize': 'Taille de Page',
                
                // Security
                'changePassword': 'Changer le Mot de Passe',
                'twoFactorAuth': 'Authentification à Deux Facteurs',
                'loginAlerts': 'Alertes de Connexion',
                'autoLogout': 'Déconnexion Automatique',
                
                // Notifications
                'purchaseAlerts': 'Nouveaux Achats',
                'lowBalance': 'Solde Faible',
                'incomeAlerts': 'Alertes de Revenu',
                'monthlyReports': 'Rapports Mensuels'
            }
        };
    }

    // ✅ Apply language to entire settings section
    applyLanguage(language) {
        this.currentLanguage = language;
        this.translateSettingsSection();
        
        // Update language selector
        const languageSelector = document.getElementById('system-language');
        if (languageSelector) {
            languageSelector.value = language;
        }
        
        // Update preview
        this.updateSystemPreviews();
    }

    // ✅ Translate entire settings section
    translateSettingsSection() {
        const translations = this.translations[this.currentLanguage];
        
        // Translate tab names
        document.querySelectorAll('.settings-tab').forEach(tab => {
            const tabName = tab.dataset.tab;
            if (translations[tabName]) {
                const icon = tab.querySelector('span:first-child')?.textContent || '⚙️';
                tab.innerHTML = `<span class="mr-2">${icon}</span>${translations[tabName]}`;
            }
        });

        // Translate buttons
        document.querySelectorAll('.btn').forEach(btn => {
            const btnText = btn.textContent.trim();
            Object.entries(translations).forEach(([key, value]) => {
                if (btnText.includes(key) || btnText === this.getEnglishText(key)) {
                    btn.textContent = btn.textContent.replace(this.getEnglishText(key), value);
                }
            });
        });

        // Translate form labels and placeholders
        this.translateFormElements(translations);
        
        // Update summary cards
        this.updateSummaryCards();
    }

    // ✅ Translate form elements
    translateFormElements(translations) {
        // Profile tab
        this.translateElement('profile-full-name', translations.fullName, 'label');
        this.translateElement('profile-email', translations.email, 'label');
        this.translateElement('profile-phone', translations.phone, 'label');
        this.translateElement('profile-bio', translations.bio, 'label');
        
        // System tab
        this.translateElement('system-currency', translations.currency, 'label');
        this.translateElement('system-language', translations.language, 'label');
        this.translateElement('system-date-format', translations.dateFormat, 'label');
        this.translateElement('system-time-format', translations.timeFormat, 'label');
        this.translateElement('system-theme', translations.theme, 'label');
        
        // Security tab
        this.translateElement('change-password-btn', translations.changePassword, 'button');
        
        // Update section headers
        document.querySelectorAll('h3, h4, h5').forEach(header => {
            const text = header.textContent.trim();
            Object.entries(translations).forEach(([key, value]) => {
                if (text.includes(key) || text === this.getEnglishText(key)) {
                    header.textContent = header.textContent.replace(this.getEnglishText(key), value);
                }
            });
        });
    }

    // ✅ Helper to get English text for replacement
    getEnglishText(key) {
        const english = this.translations.en;
        return english[key] || key;
    }

    // ✅ Translate specific element
    translateElement(elementId, translation, elementType) {
        const element = document.getElementById(elementId);
        if (!element) return;

        if (elementType === 'label') {
            const label = element.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                label.textContent = translation;
            }
        } else if (elementType === 'button') {
            const icon = element.querySelector('.btn-icon')?.textContent || '';
            element.innerHTML = `<span class="btn-icon">${icon}</span>${translation}`;
        }
    }

    // ==================== SETTINGS MANAGEMENT ====================

    // ✅ Setup tab navigation system
    setupTabSystem() {
        const tabButtons = document.querySelectorAll('.settings-tab');
        
        tabButtons.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const targetTab = e.target.dataset.tab;
                this.switchTab(targetTab);
            });
        });
    }

    // ✅ Switch between settings tabs
    switchTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.settings-tab').forEach(tab => {
            tab.classList.remove('active', 'border-blue-600', 'text-blue-600');
            tab.classList.add('text-gray-600', 'border-transparent');
        });

        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('active', 'border-blue-600', 'text-blue-600');
            activeTab.classList.remove('text-gray-600', 'border-transparent');
        }

        // Update tab content
        document.querySelectorAll('.settings-tab-content').forEach(content => {
            content.classList.remove('active');
        });

        const targetContent = document.getElementById(`${tabName}-tab`);
        if (targetContent) {
            targetContent.classList.add('active');
        }

        this.currentTab = tabName;
        
        // Load tab-specific data
        this.loadTabData(tabName);
    }

    // ✅ Load data for specific tab
    loadTabData(tabName) {
        switch(tabName) {
            case 'profile':
                this.loadProfileData();
                break;
            case 'system':
                this.loadSystemData();
                break;
            case 'security':
                this.loadSecurityData();
                break;
            case 'notifications':
                this.loadNotificationData();
                break;
            case 'data':
                this.loadDataManagement();
                break;
            case 'advanced':
                this.loadAdvancedSettings();
                break;
        }
    }

    // ✅ Setup all event listeners
    setupEventListeners() {
        this.setupFormSubmissions();
        this.setupProfileEvents();
        this.setupSystemEvents();
        this.setupSecurityEvents();
        this.setupNotificationEvents();
        this.setupDataManagementEvents();
        this.setupAdvancedEvents();
        this.setupLanguageEvents();
    }

    // ✅ Setup language change events
    setupLanguageEvents() {
        const languageSelector = document.getElementById('system-language');
        if (languageSelector) {
            languageSelector.addEventListener('change', (e) => {
                this.applyLanguage(e.target.value);
                this.saveSystemSettings(); // Save immediately
            });
        }
    }

    // ✅ PROFILE TAB: Load and manage profile data
    loadProfileData() {
        const profile = this.settingsData.profile || {};
        
        // Populate form fields
        document.getElementById('profile-full-name').value = profile.fullName || 'KWIHANGANA Jean Paul';
        document.getElementById('profile-email').value = profile.email || 'kwihangana@mayesystem.rw';
        document.getElementById('profile-phone').value = profile.phone || '';
        document.getElementById('profile-bio').value = profile.bio || '';
        
        // Update display elements
        document.getElementById('profile-display-name').textContent = profile.fullName || 'KWIHANGANA Jean Paul';
        document.getElementById('profile-display-email').textContent = profile.email || 'kwihangana@mayesystem.rw';
        document.getElementById('profile-join-date').textContent = profile.joinDate || new Date().toLocaleDateString('rw-RW');
        
        // Set notification preferences
        const notifications = profile.notifications || {};
        document.getElementById('profile-notify-email').checked = notifications.email || true;
        document.getElementById('profile-notify-push').checked = notifications.push || true;
        document.getElementById('profile-notify-sms').checked = notifications.sms || false;
        
        // Update avatar if exists
        if (profile.avatar) {
            this.updateAvatarPreview(profile.avatar);
        }
    }

    // ✅ PROFILE: Setup profile event listeners
    setupProfileEvents() {
        // Avatar upload
        const avatarUpload = document.getElementById('profile-avatar-upload');
        if (avatarUpload) {
            avatarUpload.addEventListener('change', (e) => {
                this.handleAvatarUpload(e);
            });
        }

        // Real-time name/email updates
        document.getElementById('profile-full-name')?.addEventListener('input', (e) => {
            document.getElementById('profile-display-name').textContent = e.target.value;
        });

        document.getElementById('profile-email')?.addEventListener('input', (e) => {
            document.getElementById('profile-display-email').textContent = e.target.value;
        });
    }

    // ✅ PROFILE: Handle avatar upload
    handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.showToast(this.translations[this.currentLanguage].error + ': Hitamo dosiye y\'ishusho gusa', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            this.showToast(this.translations[this.currentLanguage].error + ': Dosiye nini cyane (5MB maximum)', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.updateAvatarPreview(e.target.result);
            this.settingsData.profile.avatar = e.target.result;
            this.saveSettings();
            this.showToast('Ifoto yahinduwe neza!', 'success');
        };
        reader.readAsDataURL(file);
    }

    // ✅ PROFILE: Update avatar preview
    updateAvatarPreview(imageData) {
        const avatarPreview = document.getElementById('profile-avatar-preview');
        if (avatarPreview && imageData) {
            avatarPreview.style.backgroundImage = `url(${imageData})`;
            avatarPreview.style.backgroundSize = 'cover';
            avatarPreview.style.backgroundPosition = 'center';
            avatarPreview.innerHTML = '';
        }
    }

    // ✅ SYSTEM TAB: Load system settings
    loadSystemData() {
        const system = this.settingsData.system || {};
        
        // Set form values
        document.getElementById('system-currency').value = system.currency || 'RWF';
        document.getElementById('system-language').value = system.language || 'rw';
        document.getElementById('system-date-format').value = system.dateFormat || 'dd-mm-yyyy';
        document.getElementById('system-time-format').value = system.timeFormat || '24h';
        document.getElementById('system-theme').value = system.theme || 'light';
        document.getElementById('system-pagination-size').value = system.paginationSize || 10;
        document.getElementById('system-auto-backup').checked = system.autoBackup || false;
        document.getElementById('system-backup-interval').value = system.backupInterval || 'weekly';
        document.getElementById('system-session-timeout').value = system.sessionTimeout || 30;
        
        // Update previews
        this.updateSystemPreviews();
    }

    // ✅ SYSTEM: Setup system event listeners
    setupSystemEvents() {
        // Real-time preview updates
        const previewElements = [
            'system-currency', 'system-language', 'system-date-format', 
            'system-time-format', 'system-theme'
        ];

        previewElements.forEach(elementId => {
            document.getElementById(elementId)?.addEventListener('change', () => {
                this.updateSystemPreviews();
            });
        });

        // Theme change handler
        document.getElementById('system-theme')?.addEventListener('change', (e) => {
            this.applyTheme(e.target.value);
        });
    }

    // ✅ SYSTEM: Update real-time previews
    updateSystemPreviews() {
        const currency = document.getElementById('system-currency').value;
        const dateFormat = document.getElementById('system-date-format').value;
        const timeFormat = document.getElementById('system-time-format').value;
        const language = document.getElementById('system-language').value;

        // Currency preview
        const currencyPreview = document.getElementById('currency-preview');
        if (currencyPreview) {
            const amounts = {
                'RWF': 'Frw 1,000,000',
                'USD': '$1,000.00',
                'EUR': '€1.000,00',
                'GBP': '£1,000.00',
                'KES': 'KSh 1,000,000'
            };
            currencyPreview.textContent = amounts[currency] || 'Frw 1,000,000';
        }

        // Date preview
        const datePreview = document.getElementById('date-preview');
        if (datePreview) {
            const now = new Date();
            const formats = {
                'dd-mm-yyyy': now.toLocaleDateString('rw-RW'),
                'mm-dd-yyyy': now.toLocaleDateString('en-US'),
                'yyyy-mm-dd': now.toISOString().split('T')[0],
                'dd/mm/yyyy': now.toLocaleDateString('fr-FR')
            };
            datePreview.textContent = formats[dateFormat] || now.toLocaleDateString('rw-RW');
        }

        // Time preview
        const timePreview = document.getElementById('time-preview');
        if (timePreview) {
            const now = new Date();
            if (timeFormat === '12h') {
                timePreview.textContent = now.toLocaleTimeString('en-US', { 
                    hour12: true,
                    hour: 'numeric',
                    minute: '2-digit'
                });
            } else {
                timePreview.textContent = now.toLocaleTimeString('rw-RW', { 
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
        }

        // Language preview
        const languagePreview = document.getElementById('language-preview');
        if (languagePreview) {
            const languages = {
                'rw': '🇷🇼 Kinyarwanda',
                'en': '🇬🇧 English',
                'fr': '🇫🇷 Français',
                'sw': '🇹🇿 Kiswahili'
            };
            languagePreview.textContent = languages[language] || '🇷🇼 Kinyarwanda';
        }
    }

    // ✅ SYSTEM: Apply theme changes
    applyTheme(theme) {
        const html = document.documentElement;
        
        // Remove existing theme classes
        html.classList.remove('theme-light', 'theme-dark', 'theme-auto');
        
        // Add new theme class
        html.classList.add(`theme-${theme}`);
        
        // Update app state
        if (window.appState) {
            window.appState.settings.theme = theme;
        }
        
        this.showToast(`Imiterere yahinduwe: ${theme}`, 'success');
    }

    // ✅ SECURITY TAB: Load security settings
    loadSecurityData() {
        const security = this.settingsData.security || {};
        
        // Set form values
        document.getElementById('security-two-factor').checked = security.twoFactor || false;
        document.getElementById('security-login-alerts').checked = security.loginAlerts || true;
        document.getElementById('security-auto-logout').checked = security.autoLogout || true;
        document.getElementById('security-password-expiry').value = security.passwordExpiry || 90;
        document.getElementById('security-failed-attempts').value = security.failedAttempts || 5;
        
        // Update security score
        this.updateSecurityScore();
    }

    // ✅ SECURITY: Setup security event listeners
    setupSecurityEvents() {
        // Password change button
        document.getElementById('change-password-btn')?.addEventListener('click', () => {
            this.openPasswordChangeModal();
        });

        // Real-time security score updates
        const securityElements = [
            'security-two-factor', 'security-login-alerts', 'security-auto-logout',
            'security-password-expiry', 'security-failed-attempts'
        ];

        securityElements.forEach(elementId => {
            document.getElementById(elementId)?.addEventListener('change', () => {
                this.updateSecurityScore();
            });
        });
    }

    // ✅ SECURITY: Update security score
    updateSecurityScore() {
        let score = 50;
        
        if (document.getElementById('security-two-factor').checked) score += 20;
        if (document.getElementById('security-login-alerts').checked) score += 10;
        if (document.getElementById('security-auto-logout').checked) score += 10;
        
        const expiry = parseInt(document.getElementById('security-password-expiry').value);
        if (expiry <= 30) score += 5;
        else if (expiry <= 90) score += 3;
        
        const attempts = parseInt(document.getElementById('security-failed-attempts').value);
        if (attempts <= 3) score += 5;
        else if (attempts <= 5) score += 3;
        
        document.getElementById('security-score').textContent = `${Math.min(score, 100)}%`;
        this.updateSecurityStatus(score);
    }

    // ✅ SECURITY: Update security status display
    updateSecurityStatus(score) {
        const statusCard = document.querySelector('#security-status .security-status-card');
        if (!statusCard) return;

        let status, color, icon;
        
        if (score >= 80) {
            status = 'Umutekano Uremewe';
            color = 'green';
            icon = '🛡️';
        } else if (score >= 60) {
            status = 'Umutekano Ukomeye';
            color = 'blue';
            icon = '🔒';
        } else {
            status = 'Umutekano Ugomba Kwegerezwa';
            color = 'yellow';
            icon = '⚠️';
        }

        statusCard.className = `security-status-card p-4 rounded-lg border-2 border-${color}-200 bg-${color}-50`;
        statusCard.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <span class="text-2xl mr-3">${icon}</span>
                    <div>
                        <div class="font-semibold text-${color}-800">${status}</div>
                        <div class="text-sm text-${color}-600">Indanganurugo: ${score}%</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-xs text-${color}-600">Iheruka ryahinduwe</div>
                    <div class="text-sm font-semibold text-${color}-800">${new Date().toLocaleDateString('rw-RW')}</div>
                </div>
            </div>
        `;
    }

    // ✅ NOTIFICATIONS TAB: Load notification settings
    loadNotificationData() {
        const notifications = this.settingsData.notifications || {};
        
        const notificationElements = [
            'notify-purchase-alerts', 'notify-low-balance',
            'notify-income-alerts', 'notify-monthly-reports',
            'notify-system-updates', 'notify-security-alerts',
            'notify-report-ready'
        ];

        notificationElements.forEach(elementId => {
            document.getElementById(elementId).checked = notifications[elementId] || true;
        });
    }

    // ✅ NOTIFICATIONS: Setup notification events
    setupNotificationEvents() {
        const notificationToggles = document.querySelectorAll('#notification-settings-form input[type="checkbox"]');
        notificationToggles.forEach(toggle => {
            toggle.addEventListener('change', () => {
                this.debouncedSave();
            });
        });
    }

    // ✅ DATA MANAGEMENT: Load data management section
    loadDataManagement() {
        this.updateDataUsage();
        this.updateBackupInfo();
    }

    // ✅ DATA: Setup data management events
    setupDataManagementEvents() {
        document.getElementById('export-data-btn')?.addEventListener('click', () => {
            this.exportAllData();
        });

        document.getElementById('import-data-btn')?.addEventListener('click', () => {
            this.importData();
        });

        document.getElementById('backup-now-btn')?.addEventListener('click', () => {
            this.createBackup();
        });

        document.getElementById('clear-data-btn')?.addEventListener('click', () => {
            this.clearAllData();
        });
    }

    // ✅ DATA: Update data usage information
    updateDataUsage() {
        const appData = window.appState?.demoData || {};
        let totalSize = 0;

        if (appData.purchases) totalSize += JSON.stringify(appData.purchases).length;
        if (appData.income) totalSize += JSON.stringify(appData.income).length;
        if (appData.users) totalSize += JSON.stringify(appData.users).length;

        const sizeInKB = (totalSize / 1024).toFixed(1);
        document.getElementById('data-usage').textContent = `${sizeInKB} KB`;
        document.getElementById('data-size').textContent = `${sizeInKB} KB`;
    }

    // ✅ DATA: Update backup information
    updateBackupInfo() {
        const backups = this.settingsData.backups || [];
        const lastBackup = backups[backups.length - 1];

        if (lastBackup) {
            document.getElementById('last-backup').textContent = 
                new Date(lastBackup.timestamp).toLocaleString('rw-RW');
        } else {
            document.getElementById('last-backup').textContent = 'Nta backup';
        }
    }

    // ✅ DATA: Export all data as JSON
    exportAllData() {
        try {
            const appData = window.appState?.demoData || {};
            const exportData = {
                ...appData,
                exportInfo: {
                    exportedAt: new Date().toISOString(),
                    exportedBy: this.settingsData.profile?.fullName || 'Unknown',
                    version: '1.0'
                }
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `maye_system_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            this.showToast('Amakuru yasohotse neza!', 'success');
            this.addActivity('Amakuru yasohotse', 'Soza amakuru ya JSON', '📤');

        } catch (error) {
            console.error('Export error:', error);
            this.showToast('Ikosa mu gusoza amakuru', 'error');
        }
    }

    // ✅ DATA: Create backup
    createBackup() {
        try {
            const appData = window.appState?.demoData || {};
            const backup = {
                timestamp: new Date().toISOString(),
                data: { ...appData },
                size: JSON.stringify(appData).length
            };

            if (!this.settingsData.backups) {
                this.settingsData.backups = [];
            }

            this.settingsData.backups.push(backup);
            this.saveSettings();
            this.updateBackupInfo();

            this.showToast('Backup yakoze neza!', 'success');
            this.addActivity('Backup yakoze', 'Kora backup y\'amakuru', '💾');

        } catch (error) {
            console.error('Backup error:', error);
            this.showToast('Ikosa mu gukora backup', 'error');
        }
    }

    // ✅ DATA: Clear all data (with confirmation)
    clearAllData() {
        const confirmMessage = this.currentLanguage === 'rw' 
            ? '🔴 WEMEZA: Iki gikorwa gisiba amakuru yawe YOSE. Ntushobora gusubira inyuma!\n\nEmeza gusiba amakuru yawe yose?'
            : '🔴 CONFIRM: This action will delete ALL your data. You cannot undo this!\n\nConfirm to delete all your data?';

        if (!confirm(confirmMessage)) return;

        try {
            if (window.appState?.demoData) {
                window.appState.demoData.purchases = [];
                window.appState.demoData.income = [];
                window.appState.demoData.users = [];
            }

            localStorage.removeItem('mayeSystemData');

            if (window.refreshPurchaseTable) window.refreshPurchaseTable();
            if (window.refreshIncomeTable) window.refreshIncomeTable();

            this.showToast('Amakuru yasibwe neza!', 'success');
            this.addActivity('Amakuru yasibwe', 'Sukura amakuru yose', '🗑️');

        } catch (error) {
            console.error('Clear data error:', error);
            this.showToast('Ikosa mu gusiba amakuru', 'error');
        }
    }

    // ✅ ADVANCED TAB: Load advanced settings
    loadAdvancedSettings() {
        const advanced = this.settingsData.advanced || {};
        
        document.getElementById('advanced-analytics').checked = advanced.analytics || true;
        document.getElementById('advanced-error-reporting').checked = advanced.errorReporting || true;
        document.getElementById('advanced-performance-mode').checked = advanced.performanceMode || false;
        document.getElementById('advanced-developer-mode').checked = advanced.developerMode || false;
        document.getElementById('advanced-experimental-features').checked = advanced.experimentalFeatures || false;
        document.getElementById('advanced-log-level').value = advanced.logLevel || 'info';
    }

    // ✅ ADVANCED: Setup advanced events
    setupAdvancedEvents() {
        document.getElementById('reset-settings-btn')?.addEventListener('click', () => {
            this.resetToDefaults();
        });

        document.getElementById('export-settings-btn')?.addEventListener('click', () => {
            this.exportSettings();
        });

        document.getElementById('import-settings-btn')?.addEventListener('click', () => {
            this.importSettings();
        });
    }

    // ✅ ADVANCED: Reset settings to defaults
    resetToDefaults() {
        const confirmMessage = this.currentLanguage === 'rw'
            ? 'Wemeza gusubiza igenamiterere ku mwizerere? Iki gikorwa gisiba amahinduro yawe yose.'
            : 'Confirm reset to default settings? This will erase all your customizations.';

        if (!confirm(confirmMessage)) return;

        this.settingsData = this.getDefaultSettings();
        this.saveSettings();
        this.loadCurrentSettings();
        this.updateSummaryCards();

        this.showToast('Igenamiterere ryasubizwe ku mwizerere!', 'success');
        this.addActivity('Igenamiterere ryasubizwe', 'Subiza ku mwizerere', '🔄');
    }

    // ✅ FORM SUBMISSIONS: Setup all form submissions
    setupFormSubmissions() {
        document.getElementById('profile-settings-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfileSettings();
        });

        document.getElementById('system-settings-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSystemSettings();
        });

        document.getElementById('security-settings-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSecuritySettings();
        });

        document.getElementById('notification-settings-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveNotificationSettings();
        });

        document.getElementById('advanced-settings-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveAdvancedSettings();
        });
    }

    // ✅ SAVE: Profile settings
    saveProfileSettings() {
        this.settingsData.profile = {
            fullName: document.getElementById('profile-full-name').value,
            email: document.getElementById('profile-email').value,
            phone: document.getElementById('profile-phone').value,
            bio: document.getElementById('profile-bio').value,
            notifications: {
                email: document.getElementById('profile-notify-email').checked,
                push: document.getElementById('profile-notify-push').checked,
                sms: document.getElementById('profile-notify-sms').checked
            },
            lastUpdated: new Date().toISOString()
        };

        this.saveSettings();
        this.updateSummaryCards();
        this.showToast('Profaili yabitswe neza!', 'success');
        this.addActivity('Profaili yahinduwe', 'Hindura amakuru y\'umukoresha', '👤');
    }

    // ✅ SAVE: System settings
    saveSystemSettings() {
        this.settingsData.system = {
            currency: document.getElementById('system-currency').value,
            language: document.getElementById('system-language').value,
            dateFormat: document.getElementById('system-date-format').value,
            timeFormat: document.getElementById('system-time-format').value,
            theme: document.getElementById('system-theme').value,
            paginationSize: parseInt(document.getElementById('system-pagination-size').value),
            autoBackup: document.getElementById('system-auto-backup').checked,
            backupInterval: document.getElementById('system-backup-interval').value,
            sessionTimeout: parseInt(document.getElementById('system-session-timeout').value)
        };

        this.saveSettings();
        this.applySystemSettings();
        
        this.showToast('Igenamiterere ry\'sisitemu ryabitswe neza!', 'success');
        this.addActivity('Sisitemu yahinduwe', 'Hindura igenamiterere ry\'sisitemu', '⚙️');
    }

    // ✅ SAVE: Security settings
    saveSecuritySettings() {
        this.settingsData.security = {
            twoFactor: document.getElementById('security-two-factor').checked,
            loginAlerts: document.getElementById('security-login-alerts').checked,
            autoLogout: document.getElementById('security-auto-logout').checked,
            passwordExpiry: parseInt(document.getElementById('security-password-expiry').value),
            failedAttempts: parseInt(document.getElementById('security-failed-attempts').value),
            lastUpdated: new Date().toISOString()
        };

        this.saveSettings();
        this.updateSecurityScore();
        this.showToast('Igenamiterere ry\'umutekano ryabitswe neza!', 'success');
        this.addActivity('Umutekano wahinduwe', 'Hindura igenamiterere ry\'umutekano', '🔐');
    }

    // ✅ SAVE: Notification settings
    saveNotificationSettings() {
        this.settingsData.notifications = {
            notifyPurchaseAlerts: document.getElementById('notify-purchase-alerts').checked,
            notifyLowBalance: document.getElementById('notify-low-balance').checked,
            notifyIncomeAlerts: document.getElementById('notify-income-alerts').checked,
            notifyMonthlyReports: document.getElementById('notify-monthly-reports').checked,
            notifySystemUpdates: document.getElementById('notify-system-updates').checked,
            notifySecurityAlerts: document.getElementById('notify-security-alerts').checked,
            notifyReportReady: document.getElementById('notify-report-ready').checked
        };

        this.saveSettings();
        this.showToast('Icyifuzo cy\'amenyo cyabitswe neza!', 'success');
        this.addActivity('Amenyo yahinduwe', 'Hindura icyifuzo cy\'amenyo', '🔔');
    }

    // ✅ SAVE: Advanced settings
    saveAdvancedSettings() {
        this.settingsData.advanced = {
            analytics: document.getElementById('advanced-analytics').checked,
            errorReporting: document.getElementById('advanced-error-reporting').checked,
            performanceMode: document.getElementById('advanced-performance-mode').checked,
            developerMode: document.getElementById('advanced-developer-mode').checked,
            experimentalFeatures: document.getElementById('advanced-experimental-features').checked,
            logLevel: document.getElementById('advanced-log-level').value
        };

        this.saveSettings();
        this.showToast('Igenamiterere ry\'ingenzi ryabitswe neza!', 'success');
        this.addActivity('Ingenzi zahinduwe', 'Hindura igenamiterere ry\'ingenzi', '🚀');
    }

    // ✅ APPLY: Apply system settings globally
    applySystemSettings() {
        const system = this.settingsData.system;
        if (!system) return;

        // Update app state
        if (window.appState) {
            window.appState.settings = {
                ...window.appState.settings,
                currency: system.currency,
                language: system.language,
                dateFormat: system.dateFormat,
                timeFormat: system.timeFormat,
                theme: system.theme
            };
        }

        // Apply theme and language
        this.applyTheme(system.theme);
        this.applyLanguage(system.language);

        // Update date/time displays
        if (window.updateDateTime) {
            window.updateDateTime();
        }
    }

    // ✅ LOAD: Load current settings into forms
    loadCurrentSettings() {
        this.loadProfileData();
        this.loadSystemData();
        this.loadSecurityData();
        this.loadNotificationData();
        this.loadAdvancedSettings();
    }

    // ✅ UPDATE: Update summary cards
    updateSummaryCards() {
        const profile = this.settingsData.profile || {};
        let profileScore = 25;
        
        if (profile.fullName) profileScore += 25;
        if (profile.email) profileScore += 25;
        if (profile.phone) profileScore += 15;
        if (profile.bio) profileScore += 10;

        document.getElementById('profile-completion').textContent = `${Math.min(profileScore, 100)}%`;
        this.updateDataUsage();
    }

    // ✅ ACTIVITY: Add activity to log
    addActivity(title, description, icon) {
        const activityList = document.querySelector('.activity-list');
        if (!activityList) return;

        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item flex items-center justify-between p-3 bg-gray-50 rounded-lg';
        activityItem.innerHTML = `
            <div class="flex items-center">
                <span class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">${icon}</span>
                <div>
                    <p class="font-medium text-gray-800">${title}</p>
                    <p class="text-sm text-gray-600">${description}</p>
                </div>
            </div>
            <span class="text-sm text-gray-500">${new Date().toLocaleDateString('rw-RW')}</span>
        `;

        activityList.insertBefore(activityItem, activityList.firstChild);

        const activities = activityList.querySelectorAll('.activity-item');
        if (activities.length > 5) {
            activities[activities.length - 1].remove();
        }
    }

    // ✅ SETTINGS: Load settings from storage
    loadSettings() {
        try {
            const saved = localStorage.getItem('mayeSystemSettings');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
        
        return this.getDefaultSettings();
    }

    // ✅ SETTINGS: Save settings to storage
    saveSettings() {
        try {
            localStorage.setItem('mayeSystemSettings', JSON.stringify(this.settingsData));
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showToast('Ikosa mu kubika igenamiterere', 'error');
        }
    }

    // ✅ SETTINGS: Get default settings
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

    // ✅ UTILITY: Show toast message
    showToast(message, type = 'info') {
        if (window.showToast) {
            window.showToast(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    // ✅ UTILITY: Debounced save function
    debouncedSave() {
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
            this.saveSettings();
        }, 1000);
    }

    // ✅ SETUP: Real-time previews
    setupRealTimePreviews() {
        this.updateSystemPreviews();
        this.updateSecurityScore();
        this.updateSummaryCards();
    }
}

// ✅ Initialize Enhanced Settings when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.enhancedSettings = new EnhancedSettings();
});

// ✅ Export for global access
window.EnhancedSettings = EnhancedSettings;

console.log('✅ Enhanced Settings Module with Multi-Language Support loaded successfully!');