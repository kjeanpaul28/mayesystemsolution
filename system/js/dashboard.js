// ==================== ENHANCED DASHBOARD FUNCTIONALITY ====================
class DashboardManager {
    constructor() {
        this.currentFilters = {
            startDate: '',
            endDate: ''
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboardData();
        this.setupRealTimeUpdates();
    }

    setupEventListeners() {
        // Date range filters
        document.getElementById('apply-dashboard-filters')?.addEventListener('click', () => {
            this.applyDashboardFilters();
        });

        document.getElementById('clear-dashboard-filters')?.addEventListener('click', () => {
            this.clearDashboardFilters();
        });

        // Quick actions
        document.getElementById('quick-add-purchase')?.addEventListener('click', () => {
            openModal('purchase-modal');
        });

        document.getElementById('quick-add-income')?.addEventListener('click', () => {
            openModal('income-modal');
        });

        document.getElementById('quick-view-report')?.addEventListener('click', () => {
            this.generateQuickReport();
        });

        document.getElementById('quick-view-analytics')?.addEventListener('click', () => {
            this.showAnalytics();
        });
    }

    setupRealTimeUpdates() {
        // Real-time updates for dashboard stats
        if (window.appState?.firebaseReady) {
            this.setupFirebaseListeners();
        } else {
            // Fallback to polling
            setInterval(() => {
                this.loadDashboardData();
            }, 30000); // Update every 30 seconds
        }
    }

    setupFirebaseListeners() {
        // Real-time listeners for purchases and income
        if (window.db && window.firebaseModules) {
            const { collection, query, where, orderBy, onSnapshot } = window.firebaseModules;
            
            // Listen to user's purchases
            const purchasesQuery = query(
                collection(window.db, 'purchases'),
                where('userId', '==', window.appState.currentUser?.uid),
                orderBy('createdAt', 'desc')
            );

            onSnapshot(purchasesQuery, (snapshot) => {
                console.log('📥 Real-time purchases update:', snapshot.docs.length);
                this.loadDashboardData();
            });

            // Listen to user's income
            const incomeQuery = query(
                collection(window.db, 'income'),
                where('userId', '==', window.appState.currentUser?.uid),
                orderBy('createdAt', 'desc')
            );

            onSnapshot(incomeQuery, (snapshot) => {
                console.log('📥 Real-time income update:', snapshot.docs.length);
                this.loadDashboardData();
            });
        }
    }

    applyDashboardFilters() {
        const startDate = document.getElementById('dashboard-start-date')?.value;
        const endDate = document.getElementById('dashboard-end-date')?.value;

        if (startDate && endDate) {
            this.currentFilters.startDate = startDate;
            this.currentFilters.endDate = endDate;
            showToast(`Filtire yoherejwe: ${formatDate(startDate)} - ${formatDate(endDate)}`, 'success');
            this.loadDashboardData();
        } else {
            showToast('Ugomba guhitamo itariki y\'ibanze n\'iy\'iperuka', 'error');
        }
    }

    clearDashboardFilters() {
        const startDate = document.getElementById('dashboard-start-date');
        const endDate = document.getElementById('dashboard-end-date');
        
        if (startDate) startDate.value = '';
        if (endDate) endDate.value = '';
        
        this.currentFilters.startDate = '';
        this.currentFilters.endDate = '';
        
        showToast('Filtire yasuzwe', 'success');
        this.loadDashboardData();
    }

    async loadDashboardData() {
        try {
            if (!window.appState?.crudOperationsEnabled) return;

            const purchases = this.getFilteredPurchases();
            const income = this.getFilteredIncome();
            
            this.updateStatsGrid(purchases, income);
            this.updateRecentTransactions(purchases, income);
            this.updatePercentageChanges(purchases, income);
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    getFilteredPurchases() {
        let purchases = window.appState?.demoData?.purchases || [];
        
        // Apply date range filter
        if (this.currentFilters.startDate && this.currentFilters.endDate) {
            purchases = purchases.filter(purchase => {
                const purchaseDate = new Date(purchase.date);
                const start = new Date(this.currentFilters.startDate);
                const end = new Date(this.currentFilters.endDate);
                end.setHours(23, 59, 59, 999);
                return purchaseDate >= start && purchaseDate <= end;
            });
        }
        
        return purchases;
    }

    getFilteredIncome() {
        let income = window.appState?.demoData?.income || [];
        
        // Apply date range filter
        if (this.currentFilters.startDate && this.currentFilters.endDate) {
            income = income.filter(incomeItem => {
                const incomeDate = new Date(incomeItem.date);
                const start = new Date(this.currentFilters.startDate);
                const end = new Date(this.currentFilters.endDate);
                end.setHours(23, 59, 59, 999);
                return incomeDate >= start && incomeDate <= end;
            });
        }
        
        return income;
    }

    updateStatsGrid(purchases, income) {
        const totalIncome = income.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
        const totalExpense = purchases.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
        const balance = totalIncome - totalExpense;
        const totalTransactions = purchases.length + income.length;
        
        // Update DOM elements
        this.updateElement('total-income', formatCurrency(totalIncome));
        this.updateElement('total-expense', formatCurrency(totalExpense));
        this.updateElement('current-balance', formatCurrency(balance));
        this.updateElement('total-transactions', totalTransactions.toString());

        // Update balance status
        const balanceStatus = document.getElementById('balance-status');
        if (balanceStatus) {
            if (balance > 0) {
                balanceStatus.textContent = 'Amafaranga ahagaze';
                balanceStatus.className = 'stat-change text-sm text-green-500';
            } else if (balance < 0) {
                balanceStatus.textContent = 'Amafaranga make';
                balanceStatus.className = 'stat-change text-sm text-red-500';
            } else {
                balanceStatus.textContent = 'Nta mafaranga asigaye';
                balanceStatus.className = 'stat-change text-sm text-gray-500';
            }
        }

        // Update transactions period
        const transactionsPeriod = document.getElementById('transactions-period');
        if (transactionsPeriod) {
            if (this.currentFilters.startDate && this.currentFilters.endDate) {
                transactionsPeriod.textContent = `Kuva ${formatDate(this.currentFilters.startDate)} kugeza ${formatDate(this.currentFilters.endDate)}`;
            } else {
                transactionsPeriod.textContent = 'Byose';
            }
        }
    }

    updateElement(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }

    updatePercentageChanges() {
        const purchases = window.appState?.demoData?.purchases || [];
        const income = window.appState?.demoData?.income || [];
        
        // Calculate current month totals
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const currentMonthIncome = income
            .filter(item => {
                const itemDate = new Date(item.date);
                return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
            })
            .reduce((sum, item) => sum + (item.amount || 0), 0);
            
        const previousMonthIncome = income
            .filter(item => {
                const itemDate = new Date(item.date);
                const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
                return itemDate.getMonth() === prevMonth && itemDate.getFullYear() === prevYear;
            })
            .reduce((sum, item) => sum + (item.amount || 0), 0);
            
        const currentMonthExpense = purchases
            .filter(item => {
                const itemDate = new Date(item.date);
                return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
            })
            .reduce((sum, item) => sum + (item.amount || 0), 0);
            
        const previousMonthExpense = purchases
            .filter(item => {
                const itemDate = new Date(item.date);
                const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
                return itemDate.getMonth() === prevMonth && itemDate.getFullYear() === prevYear;
            })
            .reduce((sum, item) => sum + (item.amount || 0), 0);
        
        // Calculate percentages
        const incomePercentage = previousMonthIncome > 0 ? 
            ((currentMonthIncome - previousMonthIncome) / previousMonthIncome * 100).toFixed(1) : 0;
        const expensePercentage = previousMonthExpense > 0 ? 
            ((currentMonthExpense - previousMonthExpense) / previousMonthExpense * 100).toFixed(1) : 0;
        
        // Update UI
        const incomeChangeEl = document.getElementById('income-change');
        const incomePercentageEl = document.getElementById('income-percentage');
        const expenseChangeEl = document.getElementById('expense-change');
        const expensePercentageEl = document.getElementById('expense-percentage');
        
        if (incomeChangeEl && incomePercentageEl) {
            incomeChangeEl.textContent = incomePercentage >= 0 ? '↑' : '↓';
            incomeChangeEl.className = incomePercentage >= 0 ? 'text-green-500 mr-1' : 'text-red-500 mr-1';
            incomePercentageEl.textContent = `${incomePercentage >= 0 ? '+' : ''}${incomePercentage}%`;
        }
        
        if (expenseChangeEl && expensePercentageEl) {
            expenseChangeEl.textContent = expensePercentage >= 0 ? '↑' : '↓';
            expenseChangeEl.className = expensePercentage >= 0 ? 'text-red-500 mr-1' : 'text-green-500 mr-1';
            expensePercentageEl.textContent = `${expensePercentage >= 0 ? '+' : ''}${expensePercentage}%`;
        }
    }

    updateRecentTransactions(purchases, income) {
        const recentTransactions = document.getElementById('recent-transactions');
        if (!recentTransactions) return;
        
        // Combine and sort by date
        const allTransactions = [
            ...purchases.map(p => ({
                type: 'purchase',
                description: p.description,
                amount: p.amount,
                date: p.date,
                category: p.category,
                status: p.status,
                id: p.id
            })),
            ...income.map(i => ({
                type: 'income',
                description: i.description,
                amount: i.amount,
                date: i.date,
                source: i.source,
                status: i.status,
                id: i.id
            }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5); // Show latest 5
        
        if (allTransactions.length === 0) {
            recentTransactions.innerHTML = `
                <div class="empty-state text-gray-500 text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div class="text-4xl mb-4">📊</div>
                    <p class="text-lg">Nta bikorwa byagezeho</p>
                    <p class="text-sm mt-2">Tangira kongeramo ibikorwa byawe</p>
                </div>
            `;
            return;
        }
        
        let transactionsHTML = '';
        allTransactions.forEach(transaction => {
            const isIncome = transaction.type === 'income';
            transactionsHTML += `
                <div class="transaction-item flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer" 
                     onclick="dashboardManager.viewTransaction('${transaction.id}', '${transaction.type}')">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full ${isIncome ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center">
                            <span class="text-lg">${isIncome ? '💰' : '🛒'}</span>
                        </div>
                        <div>
                            <div class="font-medium text-gray-800">${transaction.description}</div>
                            <div class="text-sm text-gray-500">
                                ${isIncome ? transaction.source : transaction.category} • ${formatDate(transaction.date)}
                            </div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="font-semibold ${isIncome ? 'text-green-600' : 'text-red-600'}">
                            ${isIncome ? '+' : '-'}${formatCurrency(transaction.amount)}
                        </div>
                        <div class="text-xs ${transaction.status === 'completed' ? 'text-green-600' : 
                                          transaction.status === 'pending' ? 'text-yellow-600' : 
                                          'text-red-600'}">
                            ${transaction.status}
                        </div>
                    </div>
                </div>
            `;
        });
        
        recentTransactions.innerHTML = transactionsHTML;
    }

    viewTransaction(id, type) {
        if (type === 'purchase') {
            viewPurchase(id);
        } else {
            viewIncome(id);
        }
    }

    generateQuickReport() {
        showToast('Kora raporo vuba...', 'info');
        
        // In a real implementation, this would generate a quick PDF report
        setTimeout(() => {
            const purchases = this.getFilteredPurchases();
            const income = this.getFilteredIncome();
            
            const reportData = {
                period: this.currentFilters.startDate && this.currentFilters.endDate ? 
                    `${formatDate(this.currentFilters.startDate)} - ${formatDate(this.currentFilters.endDate)}` : 'Byose',
                totalIncome: income.reduce((sum, item) => sum + (item.amount || 0), 0),
                totalExpense: purchases.reduce((sum, item) => sum + (item.amount || 0), 0),
                transactionCount: purchases.length + income.length,
                generatedAt: new Date().toLocaleString('rw-RW')
            };
            
            this.showQuickReportModal(reportData);
            
        }, 1000);
    }

    showQuickReportModal(reportData) {
        const modalHTML = `
            <div class="modal hidden" id="quick-report-modal">
                <div class="modal-content">
                    <div class="modal-header bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-5 border-b border-blue-200 flex justify-between items-center rounded-t-2xl">
                        <h3 class="text-xl font-semibold text-blue-800 flex items-center">
                            <span class="mr-2">📊</span>
                            Raporo Vuba
                        </h3>
                        <span class="close-modal text-2xl cursor-pointer text-blue-600 hover:text-blue-800">&times;</span>
                    </div>
                    <div class="modal-body p-6">
                        <div class="report-summary space-y-4">
                            <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <span class="font-semibold">Igihe:</span>
                                <span>${reportData.period}</span>
                            </div>
                            <div class="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                                <span class="font-semibold">Amafaranga Yinjiye:</span>
                                <span class="font-bold cash-in">${formatCurrency(reportData.totalIncome)}</span>
                            </div>
                            <div class="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                                <span class="font-semibold">Amafaranga Yasohotse:</span>
                                <span class="font-bold cash-out">${formatCurrency(reportData.totalExpense)}</span>
                            </div>
                            <div class="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                                <span class="font-semibold">Igiteranyo cy'Ibikorwa:</span>
                                <span class="font-bold">${reportData.transactionCount}</span>
                            </div>
                            <div class="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                                <span class="font-semibold">Yakozwe:</span>
                                <span>${reportData.generatedAt}</span>
                            </div>
                        </div>
                    </div>
                    <div class="modal-actions flex gap-3 justify-end p-6 border-t border-gray-200">
                        <button type="button" class="btn btn-secondary close-modal-btn">Funga</button>
                        <button type="button" class="btn btn-success" onclick="dashboardManager.exportQuickReport()">
                            <span class="btn-icon">📄</span>
                            Soza PDF
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('quick-report-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Setup event listeners
        const modal = document.getElementById('quick-report-modal');
        modal.querySelectorAll('.close-modal, .close-modal-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            });
        });

        // Show modal
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    exportQuickReport() {
        showToast('Gusoza raporo vuba...', 'info');
        // Implementation for PDF export would go here
        setTimeout(() => {
            showToast('Raporo vuba yasohotse neza!', 'success');
        }, 1500);
    }

    showAnalytics() {
        showToast('Kuzura imibare...', 'info');
        
        const purchases = this.getFilteredPurchases();
        const income = this.getFilteredIncome();
        
        const analyticsData = this.calculateAnalytics(purchases, income);
        this.showAnalyticsModal(analyticsData);
    }

    calculateAnalytics(purchases, income) {
        // Category breakdown for purchases
        const categoryBreakdown = {};
        purchases.forEach(purchase => {
            const category = purchase.category || 'Andi';
            if (!categoryBreakdown[category]) {
                categoryBreakdown[category] = 0;
            }
            categoryBreakdown[category] += purchase.amount || 0;
        });

        // Source breakdown for income
        const sourceBreakdown = {};
        income.forEach(item => {
            const source = item.source || 'Ibindi';
            if (!sourceBreakdown[source]) {
                sourceBreakdown[source] = 0;
            }
            sourceBreakdown[source] += item.amount || 0;
        });

        // Monthly trends
        const monthlyTrends = this.calculateMonthlyTrends(purchases, income);

        return {
            categoryBreakdown,
            sourceBreakdown,
            monthlyTrends,
            topPurchases: purchases.slice(0, 5).sort((a, b) => (b.amount || 0) - (a.amount || 0)),
            topIncome: income.slice(0, 5).sort((a, b) => (b.amount || 0) - (a.amount || 0))
        };
    }

    calculateMonthlyTrends(purchases, income) {
        const monthlyData = {};
        
        [...purchases, ...income].forEach(item => {
            const date = new Date(item.date);
            const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = {
                    purchases: 0,
                    income: 0,
                    month: date.toLocaleDateString('rw-RW', { month: 'long', year: 'numeric' })
                };
            }
            
            if (item.hasOwnProperty('category')) {
                monthlyData[monthKey].purchases += item.amount || 0;
            } else {
                monthlyData[monthKey].income += item.amount || 0;
            }
        });

        return Object.values(monthlyData).slice(-6); // Last 6 months
    }

    showAnalyticsModal(analyticsData) {
        const modalHTML = `
            <div class="modal hidden" id="analytics-modal">
                <div class="modal-content large">
                    <div class="modal-header bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-5 border-b border-purple-200 flex justify-between items-center rounded-t-2xl">
                        <h3 class="text-xl font-semibold text-purple-800 flex items-center">
                            <span class="mr-2">📈</span>
                            Imibare n'Ibitekerezo
                        </h3>
                        <span class="close-modal text-2xl cursor-pointer text-purple-600 hover:text-purple-800">&times;</span>
                    </div>
                    <div class="modal-body p-6">
                        <div class="analytics-grid grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="category-breakdown">
                                <h4 class="font-semibold mb-4 text-gray-800">Ibyiciro by'Ibiguzi</h4>
                                ${this.renderCategoryBreakdown(analyticsData.categoryBreakdown)}
                            </div>
                            <div class="source-breakdown">
                                <h4 class="font-semibold mb-4 text-gray-800">Inkomoko z'Amafaranga</h4>
                                ${this.renderSourceBreakdown(analyticsData.sourceBreakdown)}
                            </div>
                        </div>
                        
                        <div class="monthly-trends mt-6">
                            <h4 class="font-semibold mb-4 text-gray-800">Imiterere y'Ukwezi</h4>
                            ${this.renderMonthlyTrends(analyticsData.monthlyTrends)}
                        </div>
                    </div>
                    <div class="modal-actions flex gap-3 justify-end p-6 border-t border-gray-200">
                        <button type="button" class="btn btn-secondary close-modal-btn">Funga</button>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('analytics-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Setup event listeners
        const modal = document.getElementById('analytics-modal');
        modal.querySelectorAll('.close-modal, .close-modal-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            });
        });

        // Show modal
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    renderCategoryBreakdown(categoryBreakdown) {
        const total = Object.values(categoryBreakdown).reduce((sum, amount) => sum + amount, 0);
        
        let html = '<div class="space-y-3">';
        Object.entries(categoryBreakdown).forEach(([category, amount]) => {
            const percentage = total > 0 ? ((amount / total) * 100).toFixed(1) : 0;
            html += `
                <div class="category-item flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg">
                    <span class="font-medium">${category}</span>
                    <div class="text-right">
                        <div class="font-semibold">${formatCurrency(amount)}</div>
                        <div class="text-sm text-gray-500">${percentage}%</div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        return html;
    }

    renderSourceBreakdown(sourceBreakdown) {
        const total = Object.values(sourceBreakdown).reduce((sum, amount) => sum + amount, 0);
        
        let html = '<div class="space-y-3">';
        Object.entries(sourceBreakdown).forEach(([source, amount]) => {
            const percentage = total > 0 ? ((amount / total) * 100).toFixed(1) : 0;
            html += `
                <div class="source-item flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg">
                    <span class="font-medium">${source}</span>
                    <div class="text-right">
                        <div class="font-semibold cash-in">${formatCurrency(amount)}</div>
                        <div class="text-sm text-gray-500">${percentage}%</div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        return html;
    }

    renderMonthlyTrends(monthlyTrends) {
        let html = '<div class="space-y-4">';
        monthlyTrends.forEach(month => {
            html += `
                <div class="month-item p-4 bg-white border border-gray-200 rounded-lg">
                    <div class="font-semibold mb-2">${month.month}</div>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div class="text-red-600">
                            <strong>Ibyaguzwe:</strong> ${formatCurrency(month.purchases)}
                        </div>
                        <div class="text-green-600">
                            <strong>Amafaranga Yinjiye:</strong> ${formatCurrency(month.income)}
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        return html;
    }

    // Method to refresh dashboard when tab is shown
    refresh() {
        this.loadDashboardData();
    }
}

// Initialize Dashboard Manager
let dashboardManager;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    dashboardManager = new DashboardManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardManager;
}