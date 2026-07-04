// ==================== ENHANCED INCOME MANAGEMENT SYSTEM ====================

class EnhancedIncomeManager {
    constructor() {
        this.currentSearchType = 'all';
        this.searchHistory = [];
        this.analyticsData = null;
        this.isInitialized = false;
        this.searchIndex = null;
        this.currentPage = 1;
        this.pageSize = 10;
        this.init();
    }

    async init() {
        console.log('🚀 Initializing Enhanced Income Manager...');
        
        try {
            await this.setupEnhancedEventListeners();
            this.setupAdvancedSearch();
            this.setupRealTimeUpdates();
            this.loadSearchHistory();
            this.updateLiveStats();
            this.isInitialized = true;
            
            console.log('✅ Enhanced Income Manager initialized successfully');
            this.showSuccessMessage('Sisitemu y\'amafaranga yinjiye yatangiye neza! 🎉');
        } catch (error) {
            console.error('❌ Error initializing Enhanced Income Manager:', error);
            this.showErrorMessage('Ikosa mu gutangiza sisitemu y\'amafaranga yinjiye');
        }
    }

    // ✅ ENHANCED 1: Advanced Event Listeners
    async setupEnhancedEventListeners() {
        try {
            // Enhanced search type selection
            document.querySelectorAll('.search-type-tag').forEach(tag => {
                tag.addEventListener('click', (e) => {
                    this.handleSearchTypeChange(e.target.dataset.type);
                });
            });

            // Enhanced search input with debouncing
            const searchInput = document.getElementById('income-search-enhanced');
            if (searchInput) {
                let searchTimeout;
                searchInput.addEventListener('input', (e) => {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => {
                        this.performEnhancedSearch(e.target.value);
                    }, 300);
                });

                // Enter key search
                searchInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.performEnhancedSearch(e.target.value);
                    }
                });
            }

            // Clear search buttons
            document.getElementById('clear-income-search-enhanced')?.addEventListener('click', () => {
                this.clearEnhancedSearch();
            });

            document.getElementById('clear-search-history')?.addEventListener('click', () => {
                this.clearSearchHistory();
            });

            // Quick amount buttons
            document.querySelectorAll('.quick-amount-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.setQuickAmount(e.target.dataset.amount);
                });
            });

            // Enhanced analytics
            document.getElementById('refresh-analytics')?.addEventListener('click', () => {
                this.generateEnhancedAnalytics();
            });

            document.getElementById('export-enhanced-analytics')?.addEventListener('click', () => {
                this.exportEnhancedAnalytics();
            });

            // Modal events
            document.getElementById('add-income-btn')?.addEventListener('click', () => {
                this.openIncomeModal();
            });

            document.getElementById('quick-add-income')?.addEventListener('click', () => {
                this.openIncomeModal();
            });

            document.getElementById('quick-view-analytics')?.addEventListener('click', () => {
                this.generateEnhancedAnalytics();
            });

            document.getElementById('quick-export-data')?.addEventListener('click', async () => {
                await this.exportIncomePDF();
            });

            // Form submission
            document.getElementById('income-form')?.addEventListener('submit', (e) => {
                this.handleIncomeSubmit(e);
            });

            // Reset form
            document.getElementById('reset-income-form')?.addEventListener('click', () => {
                this.resetIncomeForm();
            });

            // Pagination
            document.getElementById('income-prev-btn')?.addEventListener('click', () => {
                this.navigatePage('prev');
            });

            document.getElementById('income-next-btn')?.addEventListener('click', () => {
                this.navigatePage('next');
            });

            // Bulk actions
            document.getElementById('select-all-income')?.addEventListener('change', (e) => {
                this.toggleSelectAllIncome(e);
            });

            document.getElementById('bulk-delete-income-btn')?.addEventListener('click', () => {
                this.handleBulkDeleteIncome();
            });

            // Keyboard shortcuts
            this.setupKeyboardShortcuts();

            console.log('✅ Enhanced event listeners setup completed');
        } catch (error) {
            console.error('❌ Error setting up event listeners:', error);
            throw error;
        }
    }

    // ✅ ENHANCED 2: Advanced Search System
    setupAdvancedSearch() {
        this.buildSearchIndex();
        this.setupSearchSuggestions();
    }

    buildSearchIndex() {
        try {
            const income = this.getIncomeData();
            this.searchIndex = {
                ids: new Map(),
                contributors: new Map(),
                sources: new Map(),
                descriptions: new Map(),
                users: new Map(),
                amounts: new Map()
            };

            income.forEach(item => {
                // Index by ID
                this.searchIndex.ids.set(item.id.toLowerCase(), item);

                // Index by contributor
                if (item.contributor) {
                    const contributorKey = item.contributor.toLowerCase();
                    if (!this.searchIndex.contributors.has(contributorKey)) {
                        this.searchIndex.contributors.set(contributorKey, []);
                    }
                    this.searchIndex.contributors.get(contributorKey).push(item);
                }

                // Index by source
                const sourceKey = item.source.toLowerCase();
                if (!this.searchIndex.sources.has(sourceKey)) {
                    this.searchIndex.sources.set(sourceKey, []);
                }
                this.searchIndex.sources.get(sourceKey).push(item);

                // Index by description keywords
                if (item.description) {
                    item.description.toLowerCase().split(' ').forEach(word => {
                        if (word.length > 2) {
                            if (!this.searchIndex.descriptions.has(word)) {
                                this.searchIndex.descriptions.set(word, []);
                            }
                            this.searchIndex.descriptions.get(word).push(item);
                        }
                    });
                }

                // Index by user (admin only)
                if (this.isAdmin() && item.createdBy) {
                    const userKey = item.createdBy.toLowerCase();
                    if (!this.searchIndex.users.has(userKey)) {
                        this.searchIndex.users.set(userKey, []);
                    }
                    this.searchIndex.users.get(userKey).push(item);
                }

                // Index by amount ranges
                const amount = item.amount || 0;
                const amountRange = this.getAmountRange(amount);
                if (!this.searchIndex.amounts.has(amountRange)) {
                    this.searchIndex.amounts.set(amountRange, []);
                }
                this.searchIndex.amounts.get(amountRange).push(item);
            });

            console.log('✅ Search index built successfully');
        } catch (error) {
            console.error('❌ Error building search index:', error);
        }
    }

    // ✅ ENHANCED 3: Smart Search with AI-like Suggestions
    performEnhancedSearch(searchTerm) {
        if (!searchTerm.trim()) {
            this.refreshIncomeTable();
            this.hideSearchHistory();
            return;
        }

        this.addToSearchHistory(searchTerm);
        this.showSearchHistory();

        let results = [];
        const normalizedSearch = searchTerm.toLowerCase();

        try {
            switch (this.currentSearchType) {
                case 'id':
                    results = this.searchById(normalizedSearch);
                    break;
                case 'user':
                    results = this.searchByUser(normalizedSearch);
                    break;
                case 'contributor':
                    results = this.searchByContributor(normalizedSearch);
                    break;
                case 'source':
                    results = this.searchBySource(normalizedSearch);
                    break;
                default:
                    results = this.comprehensiveSearch(normalizedSearch);
            }

            this.displayEnhancedSearchResults(results, searchTerm);
            
            if (results.length === 0) {
                this.showInfoMessage(`Nta mafaranga yinjiye yabonetse muri "${searchTerm}"`);
            } else {
                this.showSuccessMessage(`Byabonetse: ${results.length} amafaranga yinjiye`);
            }
        } catch (error) {
            console.error('❌ Error performing search:', error);
            this.showErrorMessage('Ikosa mu gushakisha amafaranga yinjiye');
        }
    }

    searchById(searchTerm) {
        const results = [];
        
        // Exact match
        if (this.searchIndex.ids.has(searchTerm)) {
            results.push(this.searchIndex.ids.get(searchTerm));
        }

        // Partial matches
        for (let [id, item] of this.searchIndex.ids) {
            if (id.includes(searchTerm) && !results.includes(item)) {
                results.push(item);
            }
        }

        return results;
    }

    searchByContributor(searchTerm) {
        const results = new Set();
        
        for (let [contributor, items] of this.searchIndex.contributors) {
            if (contributor.includes(searchTerm)) {
                items.forEach(item => results.add(item));
            }
        }

        return Array.from(results);
    }

    searchBySource(searchTerm) {
        const results = new Set();
        
        for (let [source, items] of this.searchIndex.sources) {
            if (source.includes(searchTerm)) {
                items.forEach(item => results.add(item));
            }
        }

        return Array.from(results);
    }

    searchByUser(searchTerm) {
        if (!this.isAdmin()) return [];
        
        const results = new Set();
        for (let [user, items] of this.searchIndex.users) {
            if (user.includes(searchTerm)) {
                items.forEach(item => results.add(item));
            }
        }

        return Array.from(results);
    }

    comprehensiveSearch(searchTerm) {
        const results = new Set();

        // Search across all indexes
        [
            this.searchIndex.ids, 
            this.searchIndex.contributors, 
            this.searchIndex.sources, 
            this.searchIndex.descriptions
        ].forEach(index => {
            for (let [key, items] of index) {
                if (key.includes(searchTerm)) {
                    items.forEach(item => results.add(item));
                }
            }
        });

        // Admin can also search by user
        if (this.isAdmin()) {
            for (let [key, items] of this.searchIndex.users) {
                if (key.includes(searchTerm)) {
                    items.forEach(item => results.add(item));
                }
            }
        }

        return Array.from(results);
    }

    // ✅ ENHANCED 4: Display Search Results
    displayEnhancedSearchResults(results, searchTerm) {
        const tbody = document.getElementById('income-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (results.length === 0) {
            tbody.innerHTML = this.getEmptyStateHTML('Nta mafaranga yinjiye yabonetse', 'Gerageza gukoresha andi magambo yo gushakisha');
            return;
        }

        // Group results by type for better organization
        const groupedResults = this.groupSearchResults(results, searchTerm);
        this.renderGroupedSearchResults(tbody, groupedResults, searchTerm);

        // Update pagination for search results
        this.setupPaginationForTable('income', results);
        
        // Show search summary
        this.showSearchSummary(results, searchTerm);
    }

    groupSearchResults(results, searchTerm) {
        const groups = {
            exactMatches: [],
            contributors: new Map(),
            sources: new Map(),
            recent: []
        };

        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        results.forEach(item => {
            // Check for exact matches
            if (item.id.toLowerCase() === searchTerm.toLowerCase() ||
                item.contributor?.toLowerCase() === searchTerm.toLowerCase()) {
                groups.exactMatches.push(item);
            }
            
            // Group by contributor
            if (item.contributor) {
                if (!groups.contributors.has(item.contributor)) {
                    groups.contributors.set(item.contributor, []);
                }
                groups.contributors.get(item.contributor).push(item);
            }

            // Group by source
            if (!groups.sources.has(item.source)) {
                groups.sources.set(item.source, []);
            }
            groups.sources.get(item.source).push(item);

            // Recent items (last 7 days)
            const itemDate = new Date(item.date);
            if (itemDate > oneWeekAgo) {
                groups.recent.push(item);
            }
        });

        return groups;
    }

    renderGroupedSearchResults(tbody, groups, searchTerm) {
        // Show exact matches first
        if (groups.exactMatches.length > 0) {
            this.renderSearchGroup(tbody, groups.exactMatches, '🎯 Ibyahisemo neza', 'bg-green-50', 'border-green-200');
        }

        // Show contributor groups
        if (groups.contributors.size > 0) {
            groups.contributors.forEach((items, contributor) => {
                this.renderSearchGroup(tbody, items, `👥 ${contributor}`, 'bg-blue-50', 'border-blue-200');
            });
        }

        // Show source groups
        if (groups.sources.size > 0) {
            groups.sources.forEach((items, source) => {
                this.renderSearchGroup(tbody, items, `📊 ${source}`, 'bg-purple-50', 'border-purple-200');
            });
        }

        // Show recent items
        if (groups.recent.length > 0 && groups.exactMatches.length === 0) {
            this.renderSearchGroup(tbody, groups.recent.slice(0, 5), '🕒 Ibyagezeho vuba', 'bg-orange-50', 'border-orange-200');
        }
    }

    renderSearchGroup(tbody, items, groupTitle, bgColor, borderColor) {
        // Group header
        const headerRow = document.createElement('tr');
        headerRow.className = `${bgColor} border-t-2 ${borderColor}`;
        headerRow.innerHTML = `
            <td colspan="10" class="py-3 px-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <span class="font-semibold text-gray-800">${groupTitle}</span>
                        <span class="text-sm text-gray-600 ml-2">(${items.length})</span>
                    </div>
                    <div class="text-right">
                        <span class="text-sm font-semibold cash-in">
                            ${this.formatCurrency(items.reduce((sum, i) => sum + (i.amount || 0), 0))}
                        </span>
                    </div>
                </div>
            </td>
        `;
        tbody.appendChild(headerRow);

        // Group items
        items.forEach(incomeItem => {
            const row = document.createElement('tr');
            row.className = 'bg-white hover:bg-gray-50 transition-colors duration-200';
            row.innerHTML = this.getIncomeRowHTML(incomeItem);
            tbody.appendChild(row);
        });
    }

    // ✅ ENHANCED 5: Search History Management
    addToSearchHistory(term) {
        if (term && term.trim() && !this.searchHistory.includes(term.trim())) {
            this.searchHistory.unshift(term.trim());
            this.searchHistory = this.searchHistory.slice(0, 10); // Keep last 10
            this.saveSearchHistory();
            this.updateSearchHistoryDisplay();
        }
    }

    updateSearchHistoryDisplay() {
        const historyContainer = document.getElementById('search-history');
        const historyParent = document.getElementById('search-history-container');
        
        if (!historyContainer || !historyParent) return;

        if (this.searchHistory.length === 0) {
            historyParent.classList.add('hidden');
            return;
        }

        historyParent.classList.remove('hidden');
        historyContainer.innerHTML = this.searchHistory.map(term => `
            <button class="search-history-item bg-white border border-gray-300 text-gray-700 text-xs px-3 py-1 rounded-full hover:bg-gray-100 transition-colors duration-200" data-term="${term}">
                ${term}
            </button>
        `).join('');

        // Add event listeners to history items
        historyContainer.querySelectorAll('.search-history-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const term = e.target.dataset.term;
                document.getElementById('income-search-enhanced').value = term;
                this.performEnhancedSearch(term);
            });
        });
    }

    clearSearchHistory() {
        this.searchHistory = [];
        this.saveSearchHistory();
        this.updateSearchHistoryDisplay();
        this.showSuccessMessage('Amakuru yo gushakisha yasibwe');
    }

    hideSearchHistory() {
        const historyParent = document.getElementById('search-history-container');
        if (historyParent) {
            historyParent.classList.add('hidden');
        }
    }

    showSearchHistory() {
        const historyParent = document.getElementById('search-history-container');
        if (historyParent && this.searchHistory.length > 0) {
            historyParent.classList.remove('hidden');
        }
    }

    // ✅ ENHANCED 6: Real-time Updates
    setupRealTimeUpdates() {
        // Update live stats every 30 seconds
        setInterval(() => {
            this.updateLiveStats();
        }, 30000);

        // Refresh search index when data changes
        this.setupDataChangeListener();
    }

    updateLiveStats() {
        try {
            const income = this.getIncomeData();
            const today = new Date().toISOString().split('T')[0];
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            
            // Today's income
            const todayIncome = income
                .filter(item => item.date === today)
                .reduce((sum, item) => sum + (item.amount || 0), 0);

            // This month's income
            const monthlyIncome = income
                .filter(item => {
                    const itemDate = new Date(item.date);
                    return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
                })
                .reduce((sum, item) => sum + (item.amount || 0), 0);

            // Unique contributors
            const contributors = new Set(income.map(item => item.contributor).filter(Boolean));
            
            // Unique sources
            const sources = new Set(income.map(item => item.source).filter(Boolean));

            // Update live stats display
            this.updateLiveStatsDisplay({
                today: todayIncome,
                monthly: monthlyIncome,
                contributors: contributors.size,
                sources: sources.size
            });

        } catch (error) {
            console.error('❌ Error updating live stats:', error);
        }
    }

    updateLiveStatsDisplay(stats) {
        const statsContainer = document.getElementById('live-income-stats');
        if (!statsContainer) return;

        statsContainer.innerHTML = `
            <div class="live-stat bg-white border-l-4 border-green-500 p-3 rounded shadow-sm">
                <div class="flex items-center justify-between">
                    <span class="font-semibold text-green-800">Uyu munsi:</span>
                    <span class="text-lg font-bold cash-in">${this.formatCurrency(stats.today)}</span>
                </div>
                <div class="text-xs text-green-600 mt-1">🕒 Amakuru yo mu masaha 24</div>
            </div>
            <div class="live-stat bg-white border-l-4 border-blue-500 p-3 rounded shadow-sm">
                <div class="flex items-center justify-between">
                    <span class="font-semibold text-blue-800">Uku kwezi:</span>
                    <span class="text-lg font-bold cash-in">${this.formatCurrency(stats.monthly)}</span>
                </div>
                <div class="text-xs text-blue-600 mt-1">📅 Amakuru y'ukwezi gukora</div>
            </div>
            <div class="live-stat bg-white border-l-4 border-purple-500 p-3 rounded shadow-sm">
                <div class="flex items-center justify-between">
                    <span class="font-semibold text-purple-800">Abatuje:</span>
                    <span class="text-lg font-bold">${stats.contributors}</span>
                </div>
                <div class="text-xs text-purple-600 mt-1">👥 Abantu batanze</div>
            </div>
            <div class="live-stat bg-white border-l-4 border-orange-500 p-3 rounded shadow-sm">
                <div class="flex items-center justify-between">
                    <span class="font-semibold text-orange-800">Inkomoko:</span>
                    <span class="text-lg font-bold">${stats.sources}</span>
                </div>
                <div class="text-xs text-orange-600 mt-1">📊 Inkomoko zitandukanye</div>
            </div>
        `;
    }

    // ✅ ENHANCED 7: Income Form Management
    openIncomeModal() {
        this.resetIncomeForm();
        this.generateIncomeId();
        this.setDefaultDate();
        openModal('income-modal');
    }

    resetIncomeForm() {
        const form = document.getElementById('income-form');
        if (form) {
            form.reset();
            this.generateIncomeId();
            this.setDefaultDate();
        }
    }

    generateIncomeId() {
        const idInput = document.getElementById('income-id');
        if (idInput) {
            idInput.value = this.generateCode('INC');
        }
    }

    setDefaultDate() {
        const dateInput = document.getElementById('income-date');
        if (dateInput && !dateInput.value) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }
    }

    setQuickAmount(amount) {
        const amountInput = document.getElementById('income-amount');
        if (amountInput) {
            amountInput.value = amount;
            
            // Add visual feedback
            const button = document.querySelector(`[data-amount="${amount}"]`);
            if (button) {
                const originalBg = button.style.backgroundColor;
                const originalText = button.style.color;
                
                button.style.backgroundColor = '#10B981';
                button.style.color = 'white';
                
                setTimeout(() => {
                    button.style.backgroundColor = originalBg;
                    button.style.color = originalText;
                }, 1000);
            }
            
            this.showSuccessMessage(`Amafaranga yashyizweho: ${this.formatCurrency(amount)}`);
        }
    }

    // ✅ ENHANCED 8: Form Submission
    async handleIncomeSubmit(e) {
        e.preventDefault();
        
        try {
            const formData = new FormData(e.target);
            const incomeData = {
                id: formData.get('id') || this.generateCode('INC'),
                date: formData.get('date'),
                source: formData.get('source'),
                contributor: formData.get('contributor'),
                description: formData.get('description'),
                amount: parseFloat(formData.get('amount')) || 0,
                status: formData.get('status') || 'pending',
                createdAt: new Date().toISOString(),
                createdBy: this.getCurrentUser()?.username || 'System'
            };

            // Validation
            if (!this.validateIncomeData(incomeData)) {
                return;
            }

            // Add to data
            await this.saveIncomeData(incomeData);

            // Show success and ask for next action
            this.showSuccessMessage('Amafaranga yinjiye yanditswe neza! 💰');
            
            setTimeout(() => {
                const addAnother = confirm('Amafaranga yinjiye yanditswe neza! 💰\n\nWifuza kongeramo ayandi mafaranga yinjiye?');
                
                if (addAnother) {
                    this.resetIncomeForm();
                    document.getElementById('income-source').focus();
                    this.showInfoMessage('Modali ihari kugeza ufunitse! Kongeramo ayandi mafaranga...');
                } else {
                    closeModal('income-modal');
                }
                
                this.refreshIncomeTable();
            }, 500);

        } catch (error) {
            console.error('❌ Error submitting income:', error);
            this.showErrorMessage('Ikosa mu kwandika amafaranga yinjiye');
        }
    }

    validateIncomeData(data) {
        if (data.amount <= 0) {
            this.showErrorMessage('Amafaranga agomba kuba arenze zero');
            return false;
        }

        if (!data.source || !data.description) {
            this.showErrorMessage('Inkomoko n\'icyakozwe byagomba kuzuzura');
            return false;
        }

        if (!data.date) {
            this.showErrorMessage('Itariki igomba kuzuzurwa');
            return false;
        }

        return true;
    }

    // ✅ ENHANCED 9: Keyboard Shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search focus
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('income-search-enhanced')?.focus();
            }

            // Ctrl/Cmd + N for new income
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.openIncomeModal();
            }

            // Escape to clear search
            if (e.key === 'Escape') {
                const searchInput = document.getElementById('income-search-enhanced');
                if (searchInput && searchInput.value) {
                    this.clearEnhancedSearch();
                }
            }
        });
    }

    // ✅ ENHANCED 10: Utility Functions
    handleSearchTypeChange(type) {
        this.currentSearchType = type;
        
        // Update UI
        document.querySelectorAll('.search-type-tag').forEach(tag => {
            tag.classList.remove('bg-green-200', 'font-semibold');
            if (tag.dataset.type === type) {
                tag.classList.add('bg-green-200', 'font-semibold');
            }
        });

        // Update search placeholder
        const placeholders = {
            all: 'Shakisha amafaranga yinjiye... (andika inkomoko, umutoza, icyakozwe)',
            id: 'Shakisha ku ID... (andika INC001)',
            user: 'Shakisha ku mukoresha... (andika izina)',
            contributor: 'Shakisha ku mutoza... (andika izina)',
            source: 'Shakisha ku nkomoko... (andika umusanzu, ibicuruzwa...)'
        };

        const searchInput = document.getElementById('income-search-enhanced');
        if (searchInput) {
            searchInput.placeholder = placeholders[type] || placeholders.all;
            searchInput.focus();
        }

        this.showInfoMessage(`Uburyo bwo gushakisha: ${this.getSearchTypeLabel(type)}`);
    }

    getSearchTypeLabel(type) {
        const labels = {
            all: 'Byose',
            id: 'ID',
            user: 'Umukoresha',
            contributor: 'Umutoza',
            source: 'Inkomoko'
        };
        return labels[type] || 'Byose';
    }

    clearEnhancedSearch() {
        const searchInput = document.getElementById('income-search-enhanced');
        if (searchInput) {
            searchInput.value = '';
            this.refreshIncomeTable();
            this.hideSearchHistory();
            this.showInfoMessage('Gushakisha gusibwe');
        }
    }

    showSearchSummary(results, searchTerm) {
        // Remove existing summary
        const existingSummary = document.getElementById('search-summary');
        if (existingSummary) {
            existingSummary.remove();
        }

        const totalAmount = results.reduce((sum, item) => sum + (item.amount || 0), 0);
        
        const summary = document.createElement('div');
        summary.id = 'search-summary';
        summary.className = 'bg-green-50 p-4 rounded-lg mt-4 border border-green-200';
        summary.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <span class="font-semibold text-green-800">Igisubizo cyo Gushakisha:</span>
                    <span class="ml-2">${results.length} amafaranga yinjiye yabonetse muri "${searchTerm}"</span>
                    <div class="text-sm text-green-600 mt-1">
                        Igiteranyo: ${this.formatCurrency(totalAmount)} | 
                        Uburyo: ${this.currentSearchType}
                    </div>
                </div>
                <button id="clear-search-results" class="btn btn-secondary btn-sm">
                    <span class="btn-icon">🗑️</span>
                    Sukura
                </button>
            </div>
        `;

        const tableContainer = document.querySelector('.table-container');
        if (tableContainer) {
            tableContainer.appendChild(summary);
        }

        // Add clear results functionality
        document.getElementById('clear-search-results')?.addEventListener('click', () => {
            this.clearEnhancedSearch();
        });
    }

    // ==================== CORE FUNCTIONALITY ====================

    refreshIncomeTable() {
        try {
            const income = this.getIncomeData();
            const tbody = document.getElementById('income-body');
            
            if (!tbody) return;

            tbody.innerHTML = '';

            if (income.length === 0) {
                tbody.innerHTML = this.getEmptyStateHTML();
                return;
            }

            // Apply pagination
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            const paginatedIncome = income.slice(startIndex, endIndex);

            paginatedIncome.forEach(incomeItem => {
                const row = document.createElement('tr');
                row.className = 'enhanced-income-row bg-white hover:bg-green-50 transition-all duration-300';
                row.innerHTML = this.getIncomeRowHTML(incomeItem);
                tbody.appendChild(row);
            });

            this.setupPagination('income', income.length);
            this.updateIncomeSummary();
            this.updateSourceBreakdown();

        } catch (error) {
            console.error('❌ Error refreshing income table:', error);
            this.showErrorMessage('Ikosa mu kuzura urutonde rw\'amafaranga yinjiye');
        }
    }

    getIncomeRowHTML(incomeItem) {
        return `
            <td><input type="checkbox" class="row-selector income-selector" data-id="${incomeItem.id}"></td>
            <td class="text-sm font-mono font-semibold">${incomeItem.id}</td>
            <td class="text-sm" data-date="${incomeItem.date}">${this.formatDate(incomeItem.date)}</td>
            <td class="text-sm"><span class="category-badge">${incomeItem.source}</span></td>
            <td class="text-sm">${incomeItem.contributor || '-'}</td>
            <td class="text-sm truncate max-w-xs" title="${incomeItem.description}">${incomeItem.description}</td>
            <td class="text-sm font-semibold cash-in">${this.formatCurrency(incomeItem.amount)}</td>
            <td class="text-sm">${this.getStatusBadge(incomeItem.status || 'pending')}</td>
            <td class="text-sm">${this.formatDate(incomeItem.createdAt)}</td>
            <td class="text-sm">
                <div class="action-buttons">
                    <button class="action-btn view" data-id="${incomeItem.id}" title="Reba">👁️</button>
                    <button class="action-btn edit" data-id="${incomeItem.id}" title="Hindura">✏️</button>
                    <button class="action-btn delete" data-id="${incomeItem.id}" title="Siba">🗑️</button>
                </div>
            </td>
        `;
    }

    getEmptyStateHTML(title = 'Nta mafaranga yinjiye anditswe', message = 'Kanda buto yo hejuru kugirango utangire') {
        return `
            <tr class="empty-row">
                <td colspan="10" class="text-center py-12 text-gray-500 bg-gray-50">
                    <div class="flex flex-col items-center justify-center">
                        <span class="text-4xl mb-4">💰</span>
                        <p class="text-lg font-semibold mb-2">${title}</p>
                        <p class="text-sm">${message}</p>
                    </div>
                </td>
            </tr>
        `;
    }

    // ==================== HELPER METHODS ====================

    getIncomeData() {
        return window.appState?.demoData?.income || [];
    }

    getCurrentUser() {
        return window.appState?.userProfile || { username: 'System' };
    }

    isAdmin() {
        return window.appState?.userProfile?.role === 'admin';
    }

    getAmountRange(amount) {
        if (amount <= 10000) return '0-10000';
        if (amount <= 50000) return '10000-50000';
        if (amount <= 100000) return '50000-100000';
        return '100000+';
    }

    generateCode(prefix) {
        const timestamp = new Date().getTime().toString().slice(-4);
        const random = Math.random().toString(36).substring(2, 5).toUpperCase();
        return `${prefix}${timestamp}${random}`;
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
            'completed': { class: 'status-completed', text: 'Completed' }
        };
        
        const statusInfo = statusMap[status] || { class: 'status-pending', text: status };
        return `<span class="status-badge ${statusInfo.class}">${statusInfo.text}</span>`;
    }

    // ==================== STORAGE MANAGEMENT ====================

    saveSearchHistory() {
        try {
            localStorage.setItem('incomeSearchHistory', JSON.stringify(this.searchHistory));
        } catch (error) {
            console.error('❌ Error saving search history:', error);
        }
    }

    loadSearchHistory() {
        try {
            const saved = localStorage.getItem('incomeSearchHistory');
            if (saved) {
                this.searchHistory = JSON.parse(saved);
                this.updateSearchHistoryDisplay();
            }
        } catch (error) {
            console.error('❌ Error loading search history:', error);
        }
    }

    async saveIncomeData(incomeData) {
        try {
            // Add to demo data
            if (!window.appState.demoData.income) {
                window.appState.demoData.income = [];
            }
            window.appState.demoData.income.unshift(incomeData);
            
            // Rebuild search index
            this.buildSearchIndex();
            
            // Save to storage
            this.saveDataToStorage();
            
            return true;
        } catch (error) {
            console.error('❌ Error saving income data:', error);
            throw error;
        }
    }

    saveDataToStorage() {
        try {
            const dataToSave = {
                income: this.getIncomeData(),
                lastSaved: new Date().toISOString()
            };
            localStorage.setItem('mayeSystemData', JSON.stringify(dataToSave));
        } catch (error) {
            console.error('❌ Error saving data to storage:', error);
        }
    }

    // ==================== MESSAGE SYSTEM ====================

    showSuccessMessage(message) {
        this.showToast(message, 'success');
    }

    showErrorMessage(message) {
        this.showToast(message, 'error');
    }

    showInfoMessage(message) {
        this.showToast(message, 'info');
    }

    showToast(message, type = 'info') {
        if (typeof showToast === 'function') {
            showToast(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    // ==================== PAGINATION ====================

    setupPagination(type, totalItems) {
        const totalPages = Math.ceil(totalItems / this.pageSize);
        
        // Update pagination info
        const startItem = (this.currentPage - 1) * this.pageSize + 1;
        const endItem = Math.min(this.currentPage * this.pageSize, totalItems);
        
        const paginationInfo = document.getElementById(`${type}-pagination-info`);
        const pageInfo = document.getElementById(`${type}-page-info`);
        const prevBtn = document.getElementById(`${type}-prev-btn`);
        const nextBtn = document.getElementById(`${type}-next-btn`);
        
        if (paginationInfo) {
            paginationInfo.textContent = `Erekana ${startItem}-${endItem} bya ${totalItems}`;
        }
        if (pageInfo) {
            pageInfo.textContent = `Umupage ${this.currentPage} bya ${totalPages}`;
        }
        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
        }
        if (nextBtn) {
            nextBtn.disabled = this.currentPage === totalPages;
        }
    }

    navigatePage(direction) {
        const totalItems = this.getIncomeData().length;
        const totalPages = Math.ceil(totalItems / this.pageSize);
        
        if (direction === 'prev' && this.currentPage > 1) {
            this.currentPage--;
        } else if (direction === 'next' && this.currentPage < totalPages) {
            this.currentPage++;
        }
        
        this.refreshIncomeTable();
    }

    // ==================== BULK ACTIONS ====================

    toggleSelectAllIncome(e) {
        const checkboxes = document.querySelectorAll('.income-selector');
        checkboxes.forEach(checkbox => {
            checkbox.checked = e.target.checked;
        });
        this.toggleBulkDeleteButton();
    }

    toggleBulkDeleteButton() {
        const selectedCount = document.querySelectorAll('.income-selector:checked').length;
        const bulkDeleteBtn = document.getElementById('bulk-delete-income-btn');
        if (bulkDeleteBtn) {
            if (selectedCount > 0) {
                bulkDeleteBtn.classList.remove('hidden');
                bulkDeleteBtn.innerHTML = `<span class="btn-icon">🗑️</span> Siba Ibyahiswemo (${selectedCount})`;
            } else {
                bulkDeleteBtn.classList.add('hidden');
            }
        }
    }

    handleBulkDeleteIncome() {
        const selectedIds = [];
        document.querySelectorAll('.income-selector:checked').forEach(checkbox => {
            selectedIds.push(checkbox.dataset.id);
        });

        if (selectedIds.length === 0) {
            this.showInfoMessage('Nta mafaranga yinjiye byahiswemo');
            return;
        }

        if (confirm(`Wemeza gusiba ${selectedIds.length} amafaranga yinjiye byahiswemo?`)) {
            // Remove from data
            window.appState.demoData.income = window.appState.demoData.income.filter(
                item => !selectedIds.includes(item.id)
            );
            
            // Rebuild search index
            this.buildSearchIndex();
            
            // Refresh table
            this.refreshIncomeTable();
            this.saveDataToStorage();
            
            this.showSuccessMessage(`${selectedIds.length} amafaranga yinjiye byasibwe neza!`);
        }
    }

    // ==================== ANALYTICS (Placeholder) ====================

    generateEnhancedAnalytics() {
        this.showInfoMessage('Imibare nshya irakorwa...');
        // Implementation would go here
    }

    exportEnhancedAnalytics() {
        this.showInfoMessage('Gusoza raporo...');
        // Implementation would go here
    }

    async exportIncomePDF() {
        this.showInfoMessage('Gusoza PDF...');
        // Implementation would go here
    }

    // ==================== DATA CHANGE LISTENER ====================

    setupDataChangeListener() {
        // Listen for changes in income data
        const originalData = window.appState?.demoData?.income;
        if (originalData) {
            setInterval(() => {
                const currentData = window.appState?.demoData?.income;
                if (currentData && currentData !== originalData) {
                    this.buildSearchIndex();
                    this.updateLiveStats();
                }
            }, 5000);
        }
    }

    updateIncomeSummary() {
        const income = this.getIncomeData();
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyIncome = income.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
        });
        
        const monthlyTotal = monthlyIncome.reduce((sum, item) => sum + (item.amount || 0), 0);
        
        const monthlyTotalElement = document.getElementById('monthly-income-total');
        if (monthlyTotalElement) {
            monthlyTotalElement.textContent = `${this.formatCurrency(monthlyTotal)}`;
        }
    }

    updateSourceBreakdown() {
        const income = this.getIncomeData();
        const sourceBreakdown = document.getElementById('source-breakdown');
        
        if (!sourceBreakdown) return;
        
        const sources = {};
        income.forEach(item => {
            const source = item.source || 'Ibindi';
            if (!sources[source]) {
                sources[source] = { count: 0, amount: 0 };
            }
            sources[source].count++;
            sources[source].amount += item.amount || 0;
        });
        
        if (Object.keys(sources).length === 0) {
            sourceBreakdown.innerHTML = '<div class="text-gray-500 text-center py-4">Nta makuru</div>';
            return;
        }
        
        const totalAmount = income.reduce((sum, item) => sum + (item.amount || 0), 0);
        
        sourceBreakdown.innerHTML = Object.entries(sources)
            .sort((a, b) => b[1].amount - a[1].amount)
            .map(([source, data]) => `
                <div class="breakdown-item flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span class="font-medium text-sm">${source}</span>
                    <div class="text-right">
                        <div class="font-semibold text-green-600 text-sm">${this.formatCurrency(data.amount)}</div>
                        <div class="text-xs text-gray-500">${data.count} • ${((data.amount/totalAmount)*100).toFixed(1)}%</div>
                    </div>
                </div>
            `).join('');
    }

    setupSearchSuggestions() {
        // Implementation for search suggestions
        console.log('🔍 Search suggestions setup completed');
    }

    setupPaginationForTable(type, data) {
        // Implementation for pagination setup
        this.setupPagination(type, data.length);
    }
}

// ==================== INITIALIZATION ====================

// Initialize enhanced income manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('💰 Loading Enhanced Income Management System...');
    
    // Wait for appState to be available
    const initManager = () => {
        if (window.appState) {
            window.enhancedIncomeManager = new EnhancedIncomeManager();
        } else {
            setTimeout(initManager, 100);
        }
    };
    
    initManager();
});

// Export for global access
window.IncomeManager = EnhancedIncomeManager;

console.log('✅ Enhanced Income Management System loaded successfully!');