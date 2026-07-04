Ndashaka ko muri index.html ukuramo page ya purchase.html ikazaba ikagumya igakora muri muburyo busanzwe ariko ari PWA na APK 
uzajya ayifungura atinjiye ajye yoherezwa kuri /pages/auth/auth.


// ==================== ENHANCED PURCHASE FUNCTIONALITY ====================

class EnhancedPurchaseManager {
    constructor() {
        this.searchCache = new Map();
        this.autocompleteData = new Set();
        this.selectedPurchaseId = null;
        this.modalOpenTime = null;
        this.init();
    }

    init() {
        this.setupEnhancedSearch();
        this.setupAutocomplete();
        this.setupModalPersistence();
        this.setupAdminSearch();
        console.log('✅ Enhanced Purchase Manager initialized');
    }

    // ✅ ENHANCED: Search by ID functionality
    setupEnhancedSearch() {
        const searchInput = document.getElementById('purchase-search');
        if (!searchInput) return;

        // Real-time search with debouncing
        searchInput.addEventListener('input', this.debounce((e) => {
            const searchTerm = e.target.value.trim();
            this.performEnhancedSearch(searchTerm);
        }, 300));

        // Enter key for quick search
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performEnhancedSearch(e.target.value.trim());
            }
        });
    }

    // ✅ ENHANCED: Professional debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ✅ ENHANCED: Multi-field search with caching
    async performEnhancedSearch(searchTerm) {
        if (!searchTerm) {
            this.refreshPurchaseTable();
            return;
        }

        try {
            showToast('Shakisha...', 'info');

            let results = [];
            const lowerSearchTerm = searchTerm.toLowerCase();

            // Check cache first
            if (this.searchCache.has(searchTerm)) {
                results = this.searchCache.get(searchTerm);
            } else {
                // Search across multiple fields
                const purchases = window.appState.demoData.purchases;
                
                results = purchases.filter(purchase => {
                    return (
                        purchase.id.toLowerCase().includes(lowerSearchTerm) ||
                        purchase.description.toLowerCase().includes(lowerSearchTerm) ||
                        purchase.category.toLowerCase().includes(lowerSearchTerm) ||
                        (purchase.notes && purchase.notes.toLowerCase().includes(lowerSearchTerm)) ||
                        purchase.createdBy.toLowerCase().includes(lowerSearchTerm) ||
                        this.fuzzyMatch(purchase.description, lowerSearchTerm) ||
                        this.fuzzyMatch(purchase.category, lowerSearchTerm)
                    );
                });

                // Cache the results
                this.searchCache.set(searchTerm, results);
                
                // Limit cache size
                if (this.searchCache.size > 50) {
                    const firstKey = this.searchCache.keys().next().value;
                    this.searchCache.delete(firstKey);
                }
            }

            this.displaySearchResults(results, searchTerm);
            
        } catch (error) {
            console.error('❌ Search error:', error);
            showToast('Ikosa mu gushakisha', 'error');
        }
    }

    // ✅ ENHANCED: Fuzzy matching for better search
    fuzzyMatch(text, searchTerm) {
        if (!text || !searchTerm) return false;
        
        const textLower = text.toLowerCase();
        let searchIndex = 0;
        
        for (let i = 0; i < textLower.length; i++) {
            if (textLower[i] === searchTerm[searchIndex]) {
                searchIndex++;
                if (searchIndex === searchTerm.length) return true;
            }
        }
        return false;
    }

    // ✅ ENHANCED: Display search results with highlighting
    displaySearchResults(results, searchTerm) {
        const tbody = document.getElementById('purchases-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (results.length === 0) {
            tbody.innerHTML = `
                <tr class="empty-row">
                    <td colspan="12" class="text-center py-12 text-gray-500 bg-gray-50">
                        <div class="flex flex-col items-center justify-center">
                            <span class="text-4xl mb-4">🔍</span>
                            <p class="text-lg font-semibold mb-2">Nta biguzi byabonetse</p>
                            <p class="text-sm">Shakisha ikindi jambo</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        results.forEach(purchase => {
            const row = document.createElement('tr');
            const highlightedDescription = this.highlightText(purchase.description, searchTerm);
            const highlightedCategory = this.highlightText(purchase.category, searchTerm);
            const highlightedID = this.highlightText(purchase.id, searchTerm);

            row.innerHTML = `
                <td><input type="checkbox" class="row-selector purchase-selector" data-id="${purchase.id}"></td>
                <td class="text-sm font-mono">${highlightedID}</td>
                <td class="text-sm" data-date="${purchase.date}">${formatDate(purchase.date)}</td>
                <td class="text-sm truncate max-w-xs">${highlightedDescription}</td>
                <td class="text-sm"><span class="category-badge">${highlightedCategory}</span></td>
                <td class="text-sm">${purchase.quantity || '-'}</td>
                <td class="text-sm">${purchase.unit || '-'}</td>
                <td class="text-sm">${formatCurrency(purchase.price)}</td>
                <td class="text-sm font-semibold">${formatCurrency(purchase.amount)}</td>
                <td class="text-sm">${getStatusBadge(purchase.status || 'pending')}</td>
                <td class="text-sm">${formatDate(purchase.createdAt)}</td>
                <td class="text-sm">
                    <div class="action-buttons">
                        <button class="action-btn view" data-id="${purchase.id}" title="Reba">👁️</button>
                        <button class="action-btn edit" data-id="${purchase.id}" title="Hindura">✏️</button>
                        <button class="action-btn delete" data-id="${purchase.id}" title="Siba">🗑️</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Update search summary
        const searchSummary = document.getElementById('purchase-search-summary');
        if (!searchSummary) {
            this.createSearchSummaryElement();
        }
        
        this.updateSearchSummary(results.length, searchTerm);
        showToast(`Byabonetse: ${results.length} biguzi`, 'success');
        
        // Setup action listeners for new rows
        setupMultipleActionListeners('purchase');
    }

    // ✅ ENHANCED: Text highlighting for search results
    highlightText(text, searchTerm) {
        if (!searchTerm) return text;
        
        const regex = new RegExp(`(${this.escapeRegex(searchTerm)})`, 'gi');
        return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // ✅ ENHANCED: Search summary element
    createSearchSummaryElement() {
        const searchBox = document.querySelector('.search-box');
        if (!searchBox) return;

        const summaryElement = document.createElement('div');
        summaryElement.id = 'purchase-search-summary';
        summaryElement.className = 'mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg';
        searchBox.parentNode.insertBefore(summaryElement, searchBox.nextSibling);
    }

    updateSearchSummary(resultCount, searchTerm) {
        const summaryElement = document.getElementById('purchase-search-summary');
        if (!summaryElement) return;

        if (resultCount > 0) {
            summaryElement.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="text-blue-600">🔍</span>
                        <span class="font-semibold text-blue-800">
                            ${resultCount} byabonetse muri "${searchTerm}"
                        </span>
                    </div>
                    <button id="clear-search-highlight" class="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        Sukura amabara
                    </button>
                </div>
            `;

            // Clear highlight button
            document.getElementById('clear-search-highlight').addEventListener('click', () => {
                this.clearSearchHighlights();
            });
        } else {
            summaryElement.innerHTML = '';
        }
    }

    clearSearchHighlights() {
        const marks = document.querySelectorAll('mark.bg-yellow-200');
        marks.forEach(mark => {
            const parent = mark.parentNode;
            parent.replaceChild(document.createTextNode(mark.textContent), mark);
            parent.normalize();
        });

        const summaryElement = document.getElementById('purchase-search-summary');
        if (summaryElement) {
            summaryElement.innerHTML = '';
        }
    }

    // ✅ ENHANCED: Autocomplete functionality
    setupAutocomplete() {
        const searchInput = document.getElementById('purchase-search');
        if (!searchInput) return;

        // Create autocomplete container
        this.createAutocompleteContainer();

        // Update autocomplete data
        this.updateAutocompleteData();

        // Input event for autocomplete
        searchInput.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            if (value.length >= 2) {
                this.showAutocompleteSuggestions(value);
            } else {
                this.hideAutocomplete();
            }
        });

        // Focus event
        searchInput.addEventListener('focus', (e) => {
            const value = e.target.value.trim();
            if (value.length >= 2) {
                this.showAutocompleteSuggestions(value);
            }
        });

        // Click outside to hide
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.autocomplete-container') && !e.target.matches('#purchase-search')) {
                this.hideAutocomplete();
            }
        });

        // Keyboard navigation
        searchInput.addEventListener('keydown', (e) => {
            this.handleAutocompleteKeyboard(e);
        });
    }

    createAutocompleteContainer() {
        const searchInput = document.getElementById('purchase-search');
        if (!searchInput) return;

        const container = document.createElement('div');
        container.className = 'autocomplete-container absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto hidden';
        container.id = 'purchase-autocomplete';
        
        searchInput.parentNode.style.position = 'relative';
        searchInput.parentNode.appendChild(container);
    }

    updateAutocompleteData() {
        const purchases = window.appState.demoData.purchases;
        
        // Clear existing data
        this.autocompleteData.clear();

        // Add descriptions, categories, IDs to autocomplete
        purchases.forEach(purchase => {
            if (purchase.description) {
                this.autocompleteData.add(purchase.description.toLowerCase());
            }
            if (purchase.category) {
                this.autocompleteData.add(purchase.category.toLowerCase());
            }
            if (purchase.id) {
                this.autocompleteData.add(purchase.id.toLowerCase());
            }
            if (purchase.notes) {
                // Extract keywords from notes
                const keywords = purchase.notes.toLowerCase().split(/\s+/).filter(word => word.length > 3);
                keywords.forEach(keyword => this.autocompleteData.add(keyword));
            }
        });

        console.log(`✅ Autocomplete data updated: ${this.autocompleteData.size} items`);
    }

    showAutocompleteSuggestions(input) {
        const container = document.getElementById('purchase-autocomplete');
        if (!container) return;

        const suggestions = Array.from(this.autocompleteData)
            .filter(item => item.includes(input.toLowerCase()))
            .slice(0, 8); // Limit to 8 suggestions

        if (suggestions.length === 0) {
            this.hideAutocomplete();
            return;
        }

        container.innerHTML = suggestions.map(suggestion => `
            <div class="autocomplete-item px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0" data-value="${suggestion}">
                <div class="flex items-center gap-2">
                    <span class="text-blue-600">🔍</span>
                    <span>${this.highlightSuggestion(suggestion, input)}</span>
                </div>
            </div>
        `).join('');

        // Add click handlers
        container.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', () => {
                const searchInput = document.getElementById('purchase-search');
                searchInput.value = item.dataset.value;
                this.performEnhancedSearch(item.dataset.value);
                this.hideAutocomplete();
            });
        });

        container.classList.remove('hidden');
    }

    highlightSuggestion(suggestion, input) {
        const index = suggestion.toLowerCase().indexOf(input.toLowerCase());
        if (index === -1) return suggestion;

        const before = suggestion.substring(0, index);
        const match = suggestion.substring(index, index + input.length);
        const after = suggestion.substring(index + input.length);

        return `${before}<strong class="text-blue-600">${match}</strong>${after}`;
    }

    hideAutocomplete() {
        const container = document.getElementById('purchase-autocomplete');
        if (container) {
            container.classList.add('hidden');
        }
    }

    handleAutocompleteKeyboard(e) {
        const container = document.getElementById('purchase-autocomplete');
        if (!container || container.classList.contains('hidden')) return;

        const items = container.querySelectorAll('.autocomplete-item');
        const activeItem = container.querySelector('.autocomplete-item.active');
        let currentIndex = Array.from(items).indexOf(activeItem);

        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                currentIndex = (currentIndex + 1) % items.length;
                break;
            case 'ArrowUp':
                e.preventDefault();
                currentIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
                break;
            case 'Enter':
                e.preventDefault();
                if (activeItem) {
                    const searchInput = document.getElementById('purchase-search');
                    searchInput.value = activeItem.dataset.value;
                    this.performEnhancedSearch(activeItem.dataset.value);
                    this.hideAutocomplete();
                }
                return;
            case 'Escape':
                this.hideAutocomplete();
                return;
            default:
                return;
        }

        // Update active item
        items.forEach(item => item.classList.remove('active', 'bg-blue-100'));
        if (items[currentIndex]) {
            items[currentIndex].classList.add('active', 'bg-blue-100');
        }
    }

    // ✅ ENHANCED: Admin search for user purchases
    setupAdminSearch() {
        // This will be integrated with admin functionality
        console.log('✅ Admin search setup completed');
    }

    // ✅ ENHANCED: Modal persistence system
    setupModalPersistence() {
        // Listen for purchase addition
        document.addEventListener('purchaseAdded', (event) => {
            this.handleNewPurchase(event.detail);
        });

        // Listen for modal opens
        document.addEventListener('modalOpened', (event) => {
            if (event.detail.modalId === 'purchase-modal') {
                this.trackModalOpenTime();
            }
        });
    }

    trackModalOpenTime() {
        this.modalOpenTime = Date.now();
    }

    handleNewPurchase(purchaseData) {
        if (!this.modalOpenTime) return;

        // Calculate how long modal has been open
        const modalOpenDuration = Date.now() - this.modalOpenTime;
        
        // If modal was open for more than 30 seconds, keep it open
        if (modalOpenDuration > 30000) {
            this.keepModalOpenForConfirmation(purchaseData);
        }
        
        this.modalOpenTime = null;
    }

    keepModalOpenForConfirmation(purchaseData) {
        const modal = document.getElementById('purchase-modal');
        if (!modal) return;

        // Show confirmation message in modal
        const form = document.getElementById('purchase-form');
        const originalSubmitButton = form.querySelector('button[type="submit"]');
        
        // Create confirmation section
        let confirmationSection = form.querySelector('.purchase-confirmation');
        
        if (!confirmationSection) {
            confirmationSection = document.createElement('div');
            confirmationSection.className = 'purchase-confirmation mt-6 p-4 bg-green-50 border border-green-200 rounded-lg';
            form.insertBefore(confirmationSection, form.querySelector('.modal-actions'));
        }

        confirmationSection.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="text-2xl">✅</span>
                <div>
                    <h4 class="font-semibold text-green-800">Ibyaguzwe ryongewe neza!</h4>
                    <p class="text-sm text-green-600">
                        <strong>${purchaseData.description}</strong> ryakiriwe. 
                        Amafaranga: <strong>${formatCurrency(purchaseData.amount)}</strong>
                    </p>
                    <p class="text-xs text-green-500 mt-1">
                        Modal izafunga mu minsi 5 cyangwa wandike ikindi...
                    </p>
                </div>
            </div>
        `;

        // Scroll to confirmation
        confirmationSection.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Auto-close after 5 seconds
        setTimeout(() => {
            if (modal && !modal.classList.contains('hidden')) {
                this.closeModalWithConfirmation(modal, purchaseData);
            }
        }, 5000);

        // Reset form for next entry but keep modal open
        setTimeout(() => {
            this.resetFormForNextEntry(form, originalSubmitButton);
        }, 1000);
    }

    closeModalWithConfirmation(modal, purchaseData) {
        // Show final confirmation before closing
        const form = modal.querySelector('#purchase-form');
        const confirmationSection = form.querySelector('.purchase-confirmation');
        
        if (confirmationSection) {
            confirmationSection.innerHTML = `
                <div class="flex items-center gap-3">
                    <span class="text-2xl">👋</span>
                    <div>
                        <h4 class="font-semibold text-blue-800">Murakoze!</h4>
                        <p class="text-sm text-blue-600">
                            <strong>${purchaseData.description}</strong> ryabitswe neza.
                        </p>
                    </div>
                </div>
            `;
        }

        // Close modal after short delay
        setTimeout(() => {
            closeModal('purchase-modal');
            showToast(`Ibyaguzwe "${purchaseData.description}" ryakiriwe!`, 'success');
        }, 1500);
    }

    resetFormForNextEntry(form, originalButton) {
        // Store current values
        const currentCategory = document.getElementById('purchase-category').value;
        const currentNotes = document.getElementById('purchase-notes').value;

        // Reset form but preserve some values
        form.reset();

        // Restore preserved values
        document.getElementById('purchase-category').value = currentCategory;
        document.getElementById('purchase-notes').value = currentNotes;
        
        // Generate new ID
        document.getElementById('purchase-id').value = generateCode('PUR');
        document.getElementById('purchase-quantity').value = '1';
        document.getElementById('purchase-date').value = new Date().toISOString().split('T')[0];

        // Update button text temporarily
        const originalText = originalButton.innerHTML;
        originalButton.innerHTML = '<span class="btn-icon">➕</span> Ongeramo Ikindi';
        
        setTimeout(() => {
            originalButton.innerHTML = originalText;
        }, 2000);

        // Focus on description for next entry
        document.getElementById('purchase-description').focus();
    }

    // ✅ ENHANCED: Refresh autocomplete data when purchases change
    refreshAutocompleteData() {
        this.updateAutocompleteData();
        this.searchCache.clear(); // Clear search cache
    }

    // ✅ ENHANCED: Export search results
    exportSearchResults() {
        const searchTerm = document.getElementById('purchase-search').value;
        const results = this.searchCache.get(searchTerm) || window.appState.demoData.purchases;
        
        if (results.length === 0) {
            showToast('Nta biguzi biraboneka kugirango usozwe', 'info');
            return;
        }

        const title = searchTerm ? `Ibyakuzwe mu bushakashatsi: "${searchTerm}"` : 'Ibyaguzwe Byose';
        exportSelectedPurchasesPDF(results, title);
    }
}

// ==================== ENHANCED PURCHASE EVENT INTEGRATION ====================

// Custom events for enhanced purchase functionality
class PurchaseEvents {
    static triggerPurchaseAdded(purchaseData) {
        const event = new CustomEvent('purchaseAdded', { detail: purchaseData });
        document.dispatchEvent(event);
    }

    static triggerModalOpened(modalId) {
        const event = new CustomEvent('modalOpened', { detail: { modalId } });
        document.dispatchEvent(event);
    }

    static triggerSearchPerformed(searchTerm, resultCount) {
        const event = new CustomEvent('searchPerformed', { 
            detail: { searchTerm, resultCount } 
        });
        document.dispatchEvent(event);
    }
}

// ==================== ENHANCED INTEGRATION WITH EXISTING CODE ====================

// Override the existing purchase form submission to include enhanced features
function enhancePurchaseFormSubmission() {
    const originalHandlePurchaseSubmit = window.handlePurchaseSubmit;
    
    window.handlePurchaseSubmit = async function(e) {
        e.preventDefault();
        
        try {
            const formData = {
                id: document.getElementById('purchase-id').value || generateCode('PUR'),
                date: document.getElementById('purchase-date').value,
                description: document.getElementById('purchase-description').value,
                category: document.getElementById('purchase-category').value,
                quantity: parseFloat(document.getElementById('purchase-quantity').value) || 1,
                unit: document.getElementById('purchase-unit').value,
                price: parseFloat(document.getElementById('purchase-price').value),
                amount: parseFloat(document.getElementById('purchase-amount').value),
                status: document.getElementById('purchase-status').value,
                notes: document.getElementById('purchase-notes').value,
                createdAt: new Date().toISOString(),
                createdBy: window.appState.userProfile?.fullName || 'System',
                userId: window.appState.currentUser?.uid || 'demo-user',
                updatedAt: new Date().toISOString()
            };
            
            let firestoreSuccess = false;
            
            if (window.appState.firebaseReady && window.appState.currentUser && window.db) {
                try {
                    const { doc, setDoc, serverTimestamp } = window.firebaseModules;
                    const purchaseRef = doc(window.db, 'purchases', formData.id);
                    await setDoc(purchaseRef, {
                        ...formData,
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp()
                    });
                    firestoreSuccess = true;
                } catch (firestoreError) {
                    console.error('❌ Firestore save failed:', firestoreError);
                    firestoreSuccess = false;
                }
            }
            
            if (!firestoreSuccess) {
                window.appState.demoData.purchases.unshift(formData);
                saveDataToStorage();
            }

            // ✅ ENHANCED: Trigger purchase added event
            PurchaseEvents.triggerPurchaseAdded(formData);

            // ✅ ENHANCED: Check if we should keep modal open
            const modalOpenDuration = window.purchaseManager?.modalOpenTime ? 
                Date.now() - window.purchaseManager.modalOpenTime : 0;

            if (modalOpenDuration > 30000) {
                // Modal will be handled by enhanced manager
                showToast('Ibyaguzwe ryongewe neza! Modal izasanga iri gufunga...', 'success');
            } else {
                // Original behavior - close modal immediately
                closeModal('purchase-modal');
                showToast('Ibyaguzwe ryongewe neza!', 'success');
            }
            
            refreshPurchaseTable();
            loadDashboardData();
            
            // ✅ ENHANCED: Refresh autocomplete data
            if (window.purchaseManager) {
                window.purchaseManager.refreshAutocompleteData();
            }
            
        } catch (error) {
            console.error('❌ Error adding purchase:', error);
            showToast('Ikosa mu kongeramo Ibyaguzwe', 'error');
        }
    };
}

// ==================== ENHANCED MODAL OPENING ====================

// Override modal opening to track time
function enhanceModalOpening() {
    const originalOpenModal = window.openModal;
    
    window.openModal = function(modalId) {
        originalOpenModal(modalId);
        
        // ✅ ENHANCED: Track when purchase modal opens
        if (modalId === 'purchase-modal') {
            PurchaseEvents.triggerModalOpened(modalId);
        }
    };
}

// ==================== INITIALIZATION ====================

// Initialize enhanced purchase functionality
function initializeEnhancedPurchase() {
    if (window.purchaseManager) {
        console.log('✅ Enhanced Purchase Manager already initialized');
        return;
    }

    try {
        // Create enhanced purchase manager
        window.purchaseManager = new EnhancedPurchaseManager();
        
        // Enhance form submission
        enhancePurchaseFormSubmission();
        
        // Enhance modal opening
        enhanceModalOpening();
        
        console.log('🚀 Enhanced Purchase functionality loaded successfully');
        
    } catch (error) {
        console.error('❌ Error initializing enhanced purchase:', error);
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEnhancedPurchase);
} else {
    initializeEnhancedPurchase();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EnhancedPurchaseManager, PurchaseEvents };
}


