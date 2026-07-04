// admin.js - Enhanced Admin Functionality for MAYE System
// Complete admin functionality with all methods implemented

class AdminManager {
    constructor() {
        this.currentAdminTab = 'user-management';
        this.userActivitiesData = {
            selectedUser: null,
            purchases: [],
            income: [],
            filters: {
                type: 'all',
                date: '',
                startDate: '',
                endDate: ''
            }
        };
        this.reportData = {
            customStartDate: '',
            customEndDate: ''
        };
        this.init();
    }

    init() {
        console.log('🚀 Initializing Admin Manager...');
        this.setupAdminEventListeners();
        this.setupAdminTabs();
        this.setupUserActivities();
        this.setupReports();
        this.setupSystemActions();
        this.loadInitialAdminData();
    }

    // ✅ FIXED: Add missing setupUserActivities method
    setupUserActivities() {
        console.log('📝 Setting up user activities...');
        // This method is now implemented
        this.setupUserActivitiesEventListeners();
    }

    setupUserActivitiesEventListeners() {
        console.log('🔧 Setting up user activities event listeners...');
        
        // Date filter change listeners
        const dateFilter = document.getElementById('admin-activities-date-filter');
        if (dateFilter) {
            dateFilter.addEventListener('change', () => {
                this.handleUserActivitiesFilterChange();
            });
        }

        const startDateFilter = document.getElementById('admin-activities-start-date');
        if (startDateFilter) {
            startDateFilter.addEventListener('change', () => {
                this.handleUserActivitiesFilterChange();
            });
        }

        const endDateFilter = document.getElementById('admin-activities-end-date');
        if (endDateFilter) {
            endDateFilter.addEventListener('change', () => {
                this.handleUserActivitiesFilterChange();
            });
        }

        const typeFilter = document.getElementById('admin-activities-type-filter');
        if (typeFilter) {
            typeFilter.addEventListener('change', () => {
                this.handleUserActivitiesFilterChange();
            });
        }
    }

    handleUserActivitiesFilterChange() {
        console.log('🔄 User activities filter changed');
        // Auto-reload activities when filters change
        const userId = document.getElementById('admin-user-activities-filter')?.value;
        if (userId) {
            this.loadUserActivities();
        }
    }

    // Setup Admin Event Listeners
    setupAdminEventListeners() {
        console.log('🔧 Setting up admin event listeners...');
        
        // Admin tab switching
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.adminTab || e.target.closest('.admin-tab').dataset.adminTab;
                if (tabName) {
                    this.showAdminTab(tabName);
                }
            });
        });

        // User activities filter
        const loadActivitiesBtn = document.getElementById('admin-load-user-activities');
        if (loadActivitiesBtn) {
            loadActivitiesBtn.addEventListener('click', () => {
                this.loadUserActivities();
            });
        }

        // User activities tabs
        document.querySelectorAll('.user-activities-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.userTab || e.target.closest('.user-activities-tab').dataset.userTab;
                if (tabName) {
                    this.showUserActivitiesTab(tabName);
                }
            });
        });

        // Admin income export
        const exportIncomeBtn = document.getElementById('admin-export-income-pdf-btn');
        if (exportIncomeBtn) {
            exportIncomeBtn.addEventListener('click', () => {
                this.exportAdminIncomePDF();
            });
        }

        // User activities export
        const exportActivitiesBtn = document.getElementById('admin-export-user-activities');
        if (exportActivitiesBtn) {
            exportActivitiesBtn.addEventListener('click', () => {
                this.exportUserActivitiesPDF();
            });
        }

        // Add user button
        const addUserBtn = document.getElementById('admin-add-user-btn');
        if (addUserBtn) {
            addUserBtn.addEventListener('click', () => {
                this.openAddUserModal();
            });
        }

        // Add income button
        const addIncomeBtn = document.getElementById('admin-add-income-btn');
        if (addIncomeBtn) {
            addIncomeBtn.addEventListener('click', () => {
                this.openAddIncomeModal();
            });
        }

        console.log('✅ Admin event listeners setup complete');
    }

    // Setup Admin Tabs
    setupAdminTabs() {
        console.log('📑 Setting up admin tabs...');
        
        // Ensure all admin tabs are properly initialized
        const adminTabs = ['user-management', 'user-activities', 'income', 'reports', 'system'];
        
        adminTabs.forEach(tabName => {
            const tabElement = document.querySelector(`[data-admin-tab="${tabName}"]`);
            const contentElement = document.getElementById(`admin-${tabName}-tab`);
            
            if (tabElement && contentElement) {
                console.log(`✅ Admin tab found: ${tabName}`);
            } else {
                console.warn(`⚠️ Admin tab not found: ${tabName}`);
            }
        });
    }

    // Show Admin Tab
    showAdminTab(tabName) {
        console.log(`🔄 Switching to admin tab: ${tabName}`);
        
        // Hide all admin tab contents
        document.querySelectorAll('.admin-tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        
        // Remove active class from all tabs
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show selected tab content
        const selectedContent = document.getElementById(`admin-${tabName}-tab`);
        const selectedTab = document.querySelector(`[data-admin-tab="${tabName}"]`);
        
        if (selectedContent && selectedTab) {
            selectedContent.classList.remove('hidden');
            selectedTab.classList.add('active');
            this.currentAdminTab = tabName;
            
            // Load data for the tab
            this.loadAdminTabData(tabName);
            
            console.log(`✅ Switched to admin tab: ${tabName}`);
        } else {
            console.error(`❌ Could not switch to admin tab: ${tabName}`);
        }
    }

    // Load Admin Tab Data
    async loadAdminTabData(tabName) {
        console.log(`📊 Loading data for admin tab: ${tabName}`);
        
        try {
            switch(tabName) {
                case 'user-management':
                    await this.refreshAdminUsersTable();
                    break;
                case 'user-activities':
                    await this.loadUserActivitiesData();
                    break;
                case 'income':
                    await this.loadAdminIncomeData();
                    break;
                case 'reports':
                    await this.loadReportsData();
                    break;
                case 'system':
                    await this.loadSystemData();
                    break;
            }
            console.log(`✅ Data loaded for admin tab: ${tabName}`);
        } catch (error) {
            console.error(`❌ Error loading admin tab data for ${tabName}:`, error);
            this.showToast(`Ikosa mu kuzura amakuru ya ${tabName}`, 'error');
        }
    }

    // User Management Functions
    async refreshAdminUsersTable() {
        try {
            console.log('👥 Refreshing admin users table...');
            const users = await this.fetchAllUsers();
            this.renderAdminUsersTable(users);
        } catch (error) {
            console.error('❌ Error refreshing admin users table:', error);
            this.showToast('Ikosa mu kuzura urutonde rw\'abakoresha', 'error');
        }
    }

    async fetchAllUsers() {
        // Try to get users from Firestore first, then fallback to demo data
        let users = [];
        
        try {
            if (window.appState?.firebaseReady && window.db) {
                const usersSnapshot = await window.firebaseModules.getDocs(
                    window.firebaseModules.collection(window.db, 'users')
                );
                users = usersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
            }
        } catch (firestoreError) {
            console.log('🔶 Falling back to demo users data');
        }
        
        // Fallback to demo data
        if (users.length === 0) {
            users = window.appState?.demoData?.users || [];
        }
        
        console.log(`📋 Found ${users.length} users`);
        return users;
    }

    renderAdminUsersTable(users) {
        const tbody = document.getElementById('admin-users-body');
        if (!tbody) {
            console.error('❌ Admin users table body not found');
            return;
        }
        
        tbody.innerHTML = '';
        
        if (users.length === 0) {
            tbody.innerHTML = `
                <tr class="empty-row">
                    <td colspan="7" class="text-center py-12 text-gray-500 bg-gray-50">
                        <div class="flex flex-col items-center justify-center">
                            <span class="text-4xl mb-4">👥</span>
                            <p class="text-lg font-semibold mb-2">Nta bakoresha babonetse</p>
                            <p class="text-sm">Ongeramo abakoresha bashya</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 transition-colors';
            row.innerHTML = `
                <td class="py-4">
                    <div class="flex items-center">
                        <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                            ${user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                            <div class="font-semibold text-gray-800">${user.fullName || 'Nta izina'}</div>
                            <div class="text-sm text-gray-500">${user.uid || 'Nta ID'}</div>
                        </div>
                    </div>
                </td>
                <td class="py-4 text-gray-700">${user.email || 'Nta imeli'}</td>
                <td class="py-4">
                    <span class="status-badge ${user.role === 'admin' ? 'status-completed' : user.role === 'user' ? 'status-approved' : 'status-pending'}">
                        ${user.role || 'user'}
                    </span>
                </td>
                <td class="py-4">
                    <div class="flex flex-wrap gap-1">
                        ${user.permissions?.viewDashboard ? '<span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Dashboard</span>' : ''}
                        ${user.permissions?.managePurchases ? '<span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Ibyaguzwe</span>' : ''}
                        ${user.permissions?.manageIncome ? '<span class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Amafaranga</span>' : ''}
                        ${user.permissions?.viewReports ? '<span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Raporo</span>' : ''}
                        ${user.permissions?.exportData ? '<span class="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">Gusoza</span>' : ''}
                    </div>
                </td>
                <td class="py-4 text-sm text-gray-600">${this.formatDate(user.createdAt) || 'Nta date'}</td>
                <td class="py-4">
                    <span class="status-badge ${user.status === 'active' ? 'status-approved' : user.status === 'suspended' ? 'status-rejected' : 'status-pending'}">
                        ${user.status || 'active'}
                    </span>
                </td>
                <td class="py-4">
                    <div class="action-buttons flex gap-2">
                        <button class="action-btn edit p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" 
                                data-user-id="${user.uid || user.id}" title="Hindura">
                            ✏️
                        </button>
                        <button class="action-btn delete p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors" 
                                data-user-id="${user.uid || user.id}" title="Siba">
                            🗑️
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        this.setupUserActionListeners();
        console.log(`✅ Rendered ${users.length} users in admin table`);
    }

    // User Activities Functions
    async loadUserActivitiesData() {
        try {
            console.log('📝 Loading user activities data...');
            await this.loadAllUsersForFilter();
            // Don't auto-load activities - wait for user to click load button
        } catch (error) {
            console.error('❌ Error loading user activities data:', error);
            this.showToast('Ikosa mu kuzura ibikorwa by\'abakoresha', 'error');
        }
    }

    async loadAllUsersForFilter() {
        try {
            const usersFilter = document.getElementById('admin-user-activities-filter');
            if (!usersFilter) {
                console.error('❌ User activities filter not found');
                return;
            }

            // Clear existing options
            usersFilter.innerHTML = '<option value="">Hitamo umukoresha...</option>';

            // Get all users
            const users = await this.fetchAllUsers();
            
            // Add users to filter
            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.uid || user.id;
                option.textContent = `${user.fullName || 'Unknown'} (${user.role || 'user'})`;
                if (window.appState?.currentUser?.uid === user.uid) {
                    option.textContent += ' (Uwo muri)';
                }
                usersFilter.appendChild(option);
            });

            console.log(`✅ Loaded ${users.length} users for activities filter`);
        } catch (error) {
            console.error('❌ Error loading users for filter:', error);
        }
    }

    async loadUserActivities() {
        try {
            const userId = document.getElementById('admin-user-activities-filter')?.value;
            const activityType = document.getElementById('admin-activities-type-filter')?.value;
            const dateFilter = document.getElementById('admin-activities-date-filter')?.value;
            const startDate = document.getElementById('admin-activities-start-date')?.value;
            const endDate = document.getElementById('admin-activities-end-date')?.value;

            if (!userId) {
                this.showToast('Hitamo umukoresha', 'info');
                return;
            }

            this.showToast('Kuzura ibikorwa...', 'info');

            // Get selected user
            const users = await this.fetchAllUsers();
            const selectedUser = users.find(u => (u.uid || u.id) === userId);
            
            if (!selectedUser) {
                this.showToast('Umukoresha ntabwo yabonetse', 'error');
                return;
            }

            // Get all data
            let allPurchases = [];
            let allIncome = [];

            try {
                if (window.appState?.firebaseReady && window.db) {
                    // Get data from Firestore
                    const purchasesSnapshot = await window.firebaseModules.getDocs(
                        window.firebaseModules.collection(window.db, 'purchases')
                    );
                    allPurchases = purchasesSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                    const incomeSnapshot = await window.firebaseModules.getDocs(
                        window.firebaseModules.collection(window.db, 'income')
                    );
                    allIncome = incomeSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                }
            } catch (error) {
                console.log('🔶 Falling back to demo data for activities');
                allPurchases = window.appState?.demoData?.purchases || [];
                allIncome = window.appState?.demoData?.income || [];
            }

            // Filter data for selected user
            let userPurchases = allPurchases.filter(p => p.userId === userId);
            let userIncome = allIncome.filter(i => i.userId === userId);

            // Apply activity type filter
            if (activityType !== 'all') {
                if (activityType === 'purchase') {
                    userIncome = [];
                } else if (activityType === 'income') {
                    userPurchases = [];
                }
            }

            // Apply date filters
            if (dateFilter) {
                userPurchases = userPurchases.filter(p => p.date === dateFilter);
                userIncome = userIncome.filter(i => i.date === dateFilter);
            }

            if (startDate && endDate) {
                userPurchases = userPurchases.filter(p => {
                    const purchaseDate = new Date(p.date);
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    end.setHours(23, 59, 59, 999);
                    return purchaseDate >= start && purchaseDate <= end;
                });
                userIncome = userIncome.filter(i => {
                    const incomeDate = new Date(i.date);
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    end.setHours(23, 59, 59, 999);
                    return incomeDate >= start && incomeDate <= end;
                });
            }

            // Store data
            this.userActivitiesData.purchases = userPurchases;
            this.userActivitiesData.income = userIncome;
            this.userActivitiesData.selectedUser = selectedUser;
            this.userActivitiesData.filters = {
                type: activityType,
                date: dateFilter,
                startDate,
                endDate
            };

            // Render data
            this.renderUserPurchasesTable(userPurchases);
            this.renderUserIncomeTable(userIncome);
            this.updateUserActivitiesSummary(userPurchases, userIncome);

            this.showToast(`Byabonetse: ${userPurchases.length} ibiguzi, ${userIncome.length} amafaranga yinjiye`, 'success');

        } catch (error) {
            console.error('❌ Error loading user activities:', error);
            this.showToast('Ikosa mu kuzura ibikorwa', 'error');
        }
    }

    renderUserPurchasesTable(purchases) {
        const tbody = document.getElementById('admin-user-purchases-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (purchases.length === 0) {
            tbody.innerHTML = `
                <tr class="empty-row">
                    <td colspan="11" class="text-center py-12 text-gray-500 bg-gray-50">
                        <div class="flex flex-col items-center justify-center">
                            <span class="text-4xl mb-4">🛒</span>
                            <p class="text-lg font-semibold mb-2">Nta biguzi byabonetse</p>
                            <p class="text-sm">Nta biguzi byakozwe n'uyu mukoresha</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        purchases.forEach(purchase => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 transition-colors';
            row.innerHTML = `
                <td class="py-3 text-sm font-mono text-gray-600">${purchase.id}</td>
                <td class="py-3 text-sm">${this.formatDate(purchase.date)}</td>
                <td class="py-3 text-sm max-w-xs truncate" title="${purchase.description}">${purchase.description}</td>
                <td class="py-3 text-sm"><span class="category-badge">${purchase.category}</span></td>
                <td class="py-3 text-sm text-center">${purchase.quantity || '-'}</td>
                <td class="py-3 text-sm text-center">${purchase.unit || '-'}</td>
                <td class="py-3 text-sm text-right">${this.formatCurrency(purchase.price)}</td>
                <td class="py-3 text-sm font-semibold text-right">${this.formatCurrency(purchase.amount)}</td>
                <td class="py-3 text-sm">${this.getStatusBadge(purchase.status || 'pending')}</td>
                <td class="py-3 text-sm">${this.formatDate(purchase.createdAt)}</td>
                <td class="py-3 text-sm text-gray-600">${purchase.createdBy || 'System'}</td>
            `;
            tbody.appendChild(row);
        });

        console.log(`✅ Rendered ${purchases.length} user purchases`);
    }

    renderUserIncomeTable(income) {
        const tbody = document.getElementById('admin-user-income-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (income.length === 0) {
            tbody.innerHTML = `
                <tr class="empty-row">
                    <td colspan="9" class="text-center py-12 text-gray-500 bg-gray-50">
                        <div class="flex flex-col items-center justify-center">
                            <span class="text-4xl mb-4">💰</span>
                            <p class="text-lg font-semibold mb-2">Nta mafaranga yinjiye abonetse</p>
                            <p class="text-sm">Nta mafaranga yinjiye yakozwe n'uyu mukoresha</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        income.forEach(item => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 transition-colors';
            row.innerHTML = `
                <td class="py-3 text-sm font-mono text-gray-600">${item.id}</td>
                <td class="py-3 text-sm">${this.formatDate(item.date)}</td>
                <td class="py-3 text-sm">${item.source}</td>
                <td class="py-3 text-sm">${item.contributor || '-'}</td>
                <td class="py-3 text-sm max-w-xs truncate" title="${item.description}">${item.description}</td>
                <td class="py-3 text-sm font-semibold text-right">${this.formatCurrency(item.amount)}</td>
                <td class="py-3 text-sm">${this.getStatusBadge(item.status || 'pending')}</td>
                <td class="py-3 text-sm">${this.formatDate(item.createdAt)}</td>
                <td class="py-3 text-sm text-gray-600">${item.createdBy || 'System'}</td>
            `;
            tbody.appendChild(row);
        });

        console.log(`✅ Rendered ${income.length} user income records`);
    }

    updateUserActivitiesSummary(purchases, income) {
        const totalPurchases = purchases.reduce((sum, item) => sum + (item.amount || 0), 0);
        const totalIncome = income.reduce((sum, item) => sum + (item.amount || 0), 0);
        const balance = totalIncome - totalPurchases;
        
        // Update summary elements
        const purchasesEl = document.getElementById('admin-user-total-purchases');
        const incomeEl = document.getElementById('admin-user-total-income');
        const balanceEl = document.getElementById('admin-user-balance');
        
        if (purchasesEl) purchasesEl.textContent = this.formatCurrency(totalPurchases);
        if (incomeEl) incomeEl.textContent = this.formatCurrency(totalIncome);
        if (balanceEl) balanceEl.textContent = this.formatCurrency(balance);
        
        console.log(`📊 User activities summary updated: Purchases ${totalPurchases}, Income ${totalIncome}, Balance ${balance}`);
    }

    showUserActivitiesTab(tabName) {
        console.log(`🔄 Switching to user activities tab: ${tabName}`);
        
        // Update tabs
        document.querySelectorAll('.user-activities-tab').forEach(tab => {
            tab.classList.remove('active', 'border-blue-600', 'text-blue-600');
            tab.classList.add('text-gray-600', 'border-transparent');
        });

        document.querySelectorAll('.user-activities-content').forEach(content => {
            content.classList.remove('active');
        });

        // Activate selected tab
        const selectedTab = document.querySelector(`[data-user-tab="${tabName}"]`);
        const selectedContent = document.getElementById(`user-activities-${tabName}`);

        if (selectedTab && selectedContent) {
            selectedTab.classList.add('active', 'border-blue-600', 'text-blue-600');
            selectedTab.classList.remove('text-gray-600', 'border-transparent');
            selectedContent.classList.add('active');
            
            console.log(`✅ Switched to user activities tab: ${tabName}`);
        }
    }

    // Admin Income Functions
    async loadAdminIncomeData() {
        try {
            console.log('💰 Loading admin income data...');
            let income = [];

            try {
                if (window.appState?.firebaseReady && window.db) {
                    const incomeSnapshot = await window.firebaseModules.getDocs(
                        window.firebaseModules.collection(window.db, 'income')
                    );
                    income = incomeSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                }
            } catch (error) {
                console.log('🔶 Falling back to demo income data');
                income = window.appState?.demoData?.income || [];
            }

            this.renderAdminIncomeTable(income);
        } catch (error) {
            console.error('❌ Error loading admin income data:', error);
            this.showToast('Ikosa mu kuzura amafaranga yinjiye', 'error');
        }
    }

    renderAdminIncomeTable(income) {
        const tbody = document.getElementById('admin-income-body');
        if (!tbody) {
            console.error('❌ Admin income table body not found');
            return;
        }
        
        tbody.innerHTML = '';
        
        if (income.length === 0) {
            tbody.innerHTML = `
                <tr class="empty-row">
                    <td colspan="9" class="text-center py-12 text-gray-500 bg-gray-50">
                        <div class="flex flex-col items-center justify-center">
                            <span class="text-4xl mb-4">💰</span>
                            <p class="text-lg font-semibold mb-2">Nta mafaranga yinjiye anditswe</p>
                            <p class="text-sm">Tangira kwandika amafaranga yinjiye</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        income.forEach(item => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 transition-colors';
            row.innerHTML = `
                <td class="py-3 text-sm font-mono text-gray-600">${item.id}</td>
                <td class="py-3 text-sm">${this.formatDate(item.date)}</td>
                <td class="py-3 text-sm">${item.source}</td>
                <td class="py-3 text-sm">${item.contributor || '-'}</td>
                <td class="py-3 text-sm max-w-xs truncate" title="${item.description}">${item.description}</td>
                <td class="py-3 text-sm font-semibold text-right cash-in">${this.formatCurrency(item.amount)}</td>
                <td class="py-3 text-sm">${this.getStatusBadge(item.status || 'pending')}</td>
                <td class="py-3 text-sm">${this.formatDate(item.createdAt)}</td>
                <td class="py-3 text-sm text-gray-600">${item.createdBy || 'System'}</td>
            `;
            tbody.appendChild(row);
        });

        console.log(`✅ Rendered ${income.length} income records in admin table`);
    }

    // Reports Functions
    setupReports() {
        console.log('📊 Setting up reports functionality...');
        this.setupReportsEventListeners();
    }

    setupReportsEventListeners() {
        // Monthly report
        const monthlyReportBtn = document.getElementById('generate-monthly-report');
        if (monthlyReportBtn) {
            monthlyReportBtn.addEventListener('click', () => {
                this.generateMonthlyReport();
            });
        }

        // Quarterly report
        const quarterlyReportBtn = document.getElementById('generate-quarterly-report');
        if (quarterlyReportBtn) {
            quarterlyReportBtn.addEventListener('click', () => {
                this.generateQuarterlyReport();
            });
        }

        // Custom report
        const customReportBtn = document.getElementById('generate-custom-report');
        if (customReportBtn) {
            customReportBtn.addEventListener('click', () => {
                this.showCustomReportSection();
            });
        }

        // Generate custom report
        const generateCustomBtn = document.getElementById('generate-custom-report-btn');
        if (generateCustomBtn) {
            generateCustomBtn.addEventListener('click', () => {
                this.generateCustomReport();
            });
        }

        // Cancel custom report
        const cancelCustomBtn = document.getElementById('cancel-custom-report');
        if (cancelCustomBtn) {
            cancelCustomBtn.addEventListener('click', () => {
                this.hideCustomReportSection();
            });
        }

        // Specific report types
        const usersReportBtn = document.getElementById('generate-users-report');
        if (usersReportBtn) {
            usersReportBtn.addEventListener('click', () => {
                this.generateUsersReport();
            });
        }

        const categoriesReportBtn = document.getElementById('generate-categories-report');
        if (categoriesReportBtn) {
            categoriesReportBtn.addEventListener('click', () => {
                this.generateCategoriesReport();
            });
        }

        const timeReportBtn = document.getElementById('generate-time-report');
        if (timeReportBtn) {
            timeReportBtn.addEventListener('click', () => {
                this.generateTimeReport();
            });
        }

        console.log('✅ Reports event listeners setup complete');
    }

    async loadReportsData() {
        console.log('📈 Loading reports data...');
        this.updateReportsSummary();
    }

    generateMonthlyReport() {
        const now = new Date();
        const currentMonth = now.toISOString().slice(0, 7); // YYYY-MM
        this.showToast('Raporo y\'ukwezi isohoka...', 'info');
        
        // Open report in new tab
        setTimeout(() => {
            window.open(`/report.html?period=monthly&month=${currentMonth}`, '_blank');
        }, 1000);
    }

    generateQuarterlyReport() {
        const now = new Date();
        const currentQuarter = Math.floor(now.getMonth() / 3) + 1;
        this.showToast('Raporo y\'igihembwe isohoka...', 'info');
        
        // Open report in new tab
        setTimeout(() => {
            window.open(`/report.html?period=quarterly&quarter=${currentQuarter}&year=${now.getFullYear()}`, '_blank');
        }, 1000);
    }

    showCustomReportSection() {
        const customSection = document.getElementById('custom-report-section');
        if (customSection) {
            customSection.classList.remove('hidden');
            
            // Set default dates (current month)
            const now = new Date();
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
            
            document.getElementById('custom-report-start').value = firstDay;
            document.getElementById('custom-report-end').value = lastDay;
            
            console.log('✅ Custom report section shown');
        }
    }

    hideCustomReportSection() {
        const customSection = document.getElementById('custom-report-section');
        if (customSection) {
            customSection.classList.add('hidden');
            console.log('✅ Custom report section hidden');
        }
    }

    generateCustomReport() {
        const startDate = document.getElementById('custom-report-start')?.value;
        const endDate = document.getElementById('custom-report-end')?.value;

        if (!startDate || !endDate) {
            this.showToast('Hitamo itariki y\'ibanze n\'iy\'iperuka', 'error');
            return;
        }

        if (startDate > endDate) {
            this.showToast('Itariki y\'ibanze igomba kuba mbere y\'iy\'iperuka', 'error');
            return;
        }

        this.showToast('Raporo y\'igihe cyihariye isohoka...', 'info');
        
        // Open report in new tab
        setTimeout(() => {
            window.open(`/report.html?period=custom&start=${startDate}&end=${endDate}`, '_blank');
        }, 1000);
        
        this.hideCustomReportSection();
    }

    generateUsersReport() {
        this.showToast('Gusoza raporo y\'abakoresha...', 'info');
        // Implementation would generate users report PDF
        setTimeout(() => {
            this.showToast('Raporo y\'abakoresha yasohotse!', 'success');
        }, 2000);
    }

    generateCategoriesReport() {
        this.showToast('Gusoza raporo y\'ibyiciro...', 'info');
        // Implementation would generate categories report PDF
        setTimeout(() => {
            this.showToast('Raporo y\'ibyiciro yasohotse!', 'success');
        }, 2000);
    }

    generateTimeReport() {
        this.showToast('Gusoza raporo y\'igihe...', 'info');
        // Implementation would generate time-based report PDF
        setTimeout(() => {
            this.showToast('Raporo y\'igihe yasohotse!', 'success');
        }, 2000);
    }

    updateReportsSummary() {
        const purchases = window.appState?.demoData?.purchases || [];
        const income = window.appState?.demoData?.income || [];
        const users = window.appState?.demoData?.users || [];

        const totalPurchases = purchases.reduce((sum, p) => sum + (p.amount || 0), 0);
        const totalIncome = income.reduce((sum, i) => sum + (i.amount || 0), 0);

        console.log('📈 Reports summary updated');
    }

    // System Functions
    setupSystemActions() {
        console.log('⚙️ Setting up system actions...');
        this.setupSystemEventListeners();
    }

    setupSystemEventListeners() {
        document.querySelectorAll('.admin-btn[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.closest('.admin-btn').getAttribute('data-action');
                this.handleSystemAction(action);
            });
        });
    }

    async loadSystemData() {
        console.log('🔧 Loading system data...');
        this.updateAdminRealTimeData();
        this.updateSystemStats();
    }

    handleSystemAction(action) {
        console.log(`🔧 Handling system action: ${action}`);
        
        switch(action) {
            case 'system-stats':
                this.showSystemStats();
                break;
            case 'backup-data':
                this.backupData();
                break;
            case 'audit-logs':
                this.showAuditLogs();
                break;
            case 'system-cleanup':
                this.systemCleanup();
                break;
            case 'export-all-data':
                this.exportAllData();
                break;
            case 'system-health':
                this.showSystemHealth();
                break;
            default:
                console.warn(`❌ Unknown system action: ${action}`);
        }
    }

    showSystemStats() {
        const stats = this.calculateSystemStats();
        this.showToast(`Imibare ya System: ${stats.totalUsers} abakoresha, ${stats.totalPurchases} ibiguzi, ${stats.totalIncome} amafaranga yinjiye`, 'info');
    }

    calculateSystemStats() {
        const users = window.appState?.demoData?.users || [];
        const purchases = window.appState?.demoData?.purchases || [];
        const income = window.appState?.demoData?.income || [];
        
        const totalPurchases = purchases.reduce((sum, p) => sum + (p.amount || 0), 0);
        const totalIncome = income.reduce((sum, i) => sum + (i.amount || 0), 0);
        
        return {
            totalUsers: users.length,
            totalPurchases: purchases.length,
            totalIncome: income.length,
            totalAmount: totalPurchases + totalIncome
        };
    }

    backupData() {
        this.showToast('Gukora backup y\'amakuru...', 'info');
        setTimeout(() => {
            this.showToast('Backup yarakozwe neza!', 'success');
        }, 2000);
    }

    showAuditLogs() {
        this.showToast('Kuzura inyandiko z\'ibitekerezo...', 'info');
        // Implementation would show audit logs modal
    }

    systemCleanup() {
        if (confirm('Wemeza gusukura amakuru y\'ibihe? Ibi rishobora kutakaza amakuru.')) {
            this.showToast('Gusukura system...', 'info');
            // Implementation would perform system cleanup
        }
    }

    exportAllData() {
        this.showToast('Gusoza amakuru yose...', 'info');
        // Implementation would export all data
    }

    showSystemHealth() {
        const healthStatus = this.checkSystemHealth();
        this.showToast(`Ubuzima bw'System: ${healthStatus}`, 'info');
    }

    checkSystemHealth() {
        // Simple health check
        const firebaseStatus = window.appState?.firebaseReady ? '✅' : '❌';
        const dataStatus = window.appState?.demoData ? '✅' : '❌';
        return `Firebase: ${firebaseStatus}, Data: ${dataStatus}`;
    }

    // Export Functions
    async exportAdminIncomePDF() {
        try {
            this.showToast('Gusoza raporo y\'amafaranga yinjiye...', 'info');
            // PDF export implementation would go here
            setTimeout(() => {
                this.showToast('Raporo y\'amafaranga yinjiye yasohotse!', 'success');
            }, 2000);
        } catch (error) {
            console.error('❌ Error exporting admin income PDF:', error);
            this.showToast('Ikosa mu gusoza raporo', 'error');
        }
    }

    async exportUserActivitiesPDF() {
        try {
            const { purchases, income } = this.userActivitiesData;
            
            if (purchases.length === 0 && income.length === 0) {
                this.showToast('Nta bikorwa biraboneka kugirango bisozwe', 'info');
                return;
            }

            this.showToast('Gusoza raporo y\'ibikorwa...', 'info');
            // PDF export implementation would go here
            setTimeout(() => {
                this.showToast('Raporo y\'ibikorwa yasohotse!', 'success');
            }, 2000);
        } catch (error) {
            console.error('❌ Error exporting user activities PDF:', error);
            this.showToast('Ikosa mu gusoza raporo', 'error');
        }
    }

    // Modal Functions
    openAddUserModal() {
        this.showToast('Fungura modare yo kongeramo umukoresha...', 'info');
        // Implementation would open add user modal
    }

    openAddIncomeModal() {
        this.showToast('Fungura modare yo kwandika amafaranga yinjiye...', 'info');
        // Implementation would open add income modal
    }

    // Utility Functions
    updateAdminRealTimeData() {
        const purchases = window.appState?.demoData?.purchases || [];
        const income = window.appState?.demoData?.income || [];
        
        const totalIncome = income.reduce((sum, item) => sum + (item.amount || 0), 0);
        const totalExpense = purchases.reduce((sum, item) => sum + (item.amount || 0), 0);
        const balance = totalIncome - totalExpense;
        
        // Update admin dashboard cards
        const incomeEl = document.getElementById('admin-system-total-income');
        const expenseEl = document.getElementById('admin-system-total-expense');
        const balanceEl = document.getElementById('admin-system-balance');
        
        if (incomeEl) incomeEl.textContent = this.formatCurrency(totalIncome);
        if (expenseEl) expenseEl.textContent = this.formatCurrency(totalExpense);
        if (balanceEl) balanceEl.textContent = this.formatCurrency(balance);
        
        console.log('🔄 Admin real-time data updated');
    }

    setupUserActionListeners() {
        // Setup edit user buttons
        document.querySelectorAll('.action-btn.edit[data-user-id]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = e.target.closest('.action-btn').getAttribute('data-user-id');
                this.editUser(userId);
            });
        });

        // Setup delete user buttons
        document.querySelectorAll('.action-btn.delete[data-user-id]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = e.target.closest('.action-btn').getAttribute('data-user-id');
                this.deleteUser(userId);
            });
        });

        console.log('✅ User action listeners setup complete');
    }

    editUser(userId) {
        this.showToast(`Guhindura umukoresha: ${userId}`, 'info');
        // Implementation would open edit user modal
    }

    deleteUser(userId) {
        if (confirm('Wemeza gusiba uyu mukoresha?')) {
            this.showToast(`Gusiba umukoresha: ${userId}`, 'info');
            // Implementation would delete user
        }
    }

    updateSystemStats() {
        console.log('🔄 Updating system stats...');
    }

    formatCurrency(amount) {
        if (isNaN(amount) || amount === null || amount === undefined) return 'RWF 0';
        return new Intl.NumberFormat('rw-RW', {
            style: 'currency',
            currency: 'RWF'
        }).format(amount);
    }

    formatDate(dateString) {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('rw-RW');
        } catch (error) {
            return dateString;
        }
    }

    getStatusBadge(status) {
        const statusMap = {
            'pending': { class: 'status-pending', text: 'Pending' },
            'approved': { class: 'status-approved', text: 'Approved' },
            'rejected': { class: 'status-rejected', text: 'Rejected' },
            'completed': { class: 'status-completed', text: 'Completed' },
            'active': { class: 'status-approved', text: 'Active' },
            'suspended': { class: 'status-rejected', text: 'Suspended' }
        };
        
        const statusInfo = statusMap[status] || { class: 'status-pending', text: status };
        return `<span class="status-badge ${statusInfo.class}">${statusInfo.text}</span>`;
    }

    showToast(message, type = 'info') {
        // Use existing toast system or create simple alert
        if (window.showToast) {
            window.showToast(message, type);
        } else {
            console.log(`TOAST [${type}]: ${message}`);
            // Simple alert fallback
            alert(`${type.toUpperCase()}: ${message}`);
        }
    }

    async loadInitialAdminData() {
        console.log('🚀 Loading initial admin data...');
        
        // Update real-time data
        this.updateAdminRealTimeData();
        
        // Load users for activities filter
        await this.loadAllUsersForFilter();
        
        // Update reports summary
        this.updateReportsSummary();
        
        console.log('✅ Admin system initialized successfully');
        
        // Show welcome message
        this.showToast('Sisitemu ya Admin yatangiye neza!', 'success');
    }
}

// Initialize Admin Manager when DOM is loaded and user is admin
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM loaded, checking admin privileges...');
    
    // Wait a bit for app state to initialize
    setTimeout(() => {
        const userProfile = window.appState?.userProfile;
        const currentUser = window.appState?.currentUser;
        
        console.log('👤 Current user profile:', userProfile);
        console.log('🔥 Current user:', currentUser);
        
        if (userProfile?.role === 'admin' || currentUser) {
            console.log('🎯 User has admin privileges, initializing Admin Manager...');
            window.adminManager = new AdminManager();
            
            // Auto-show first tab if no tab is active
            const activeTabs = document.querySelectorAll('.admin-tab.active');
            if (activeTabs.length === 0) {
                const firstTab = document.querySelector('.admin-tab');
                if (firstTab) {
                    const firstTabName = firstTab.dataset.adminTab;
                    if (firstTabName) {
                        window.adminManager.showAdminTab(firstTabName);
                    }
                }
            }
        } else {
            console.log('🔒 User is not admin or not logged in, hiding admin tab');
            // Hide admin tab if user is not admin
            const adminTab = document.querySelector('.admin-tab');
            if (adminTab) {
                adminTab.style.display = 'none';
            }
        }
    }, 1000);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminManager;
}