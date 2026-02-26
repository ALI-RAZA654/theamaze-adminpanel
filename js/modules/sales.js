import { API } from '../utils/api.js';
import { UI } from '../components/ui.js';

export const SalesModule = {
    async render() {
        const sale = await API.get('/flash-sale') || { active: false, discountPercentage: 0, endTime: new Date().toISOString(), bannerText: '' };
        const products = await API.get('/products');
        let promoData = { codes: [], marquee: { text: '', active: true } };
        try { promoData = await API.get('/promo'); } catch (e) { }

        return `
            <div class="space-y-10 animate-fade-in">
                <!-- Status & Control -->
                <div class="glass-panel p-10 rounded-[2.5rem] relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/5 blur-[100px] pointer-events-none"></div>
                    
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
                        <div>
                            <span class="status-badge ${sale.active ? 'bg-orange-500/10 text-orange-500' : 'bg-white/5 text-white/20'} mb-4 block w-fit">
                                ${sale.active ? 'Protocol Active' : 'Protocol Dormant'}
                            </span>
                            <h2 class="text-4xl font-black uppercase tracking-tighter">Liquidity Control</h2>
                        </div>
                        <div class="flex gap-4">
                            <button id="toggleSale" class="px-10 py-4 ${sale.active ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'btn-primary'} text-[10px] font-black uppercase tracking-widest rounded-2xl border transition-all">
                                ${sale.active ? 'Deactivate Protocol' : 'Activate Sale Protocol'}
                            </button>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-16">
                        <div>
                            <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Discount Magnitude (%)</label>
                            <input type="number" id="salePercent" value="${sale.discountPercentage}" class="w-full admin-input">
                        </div>
                        <div class="lg:col-span-2">
                            <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Countdown Expiry</label>
                            <input type="datetime-local" id="saleExpiry" value="${sale.endTime ? sale.endTime.slice(0, 16) : ''}" class="w-full admin-input">
                        </div>
                        <div>
                            <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Asset Coverage</label>
                            <div class="text-2xl font-black text-white">${products.filter(p => p.isFlashSale).length} Items</div>
                        </div>
                    </div>
                </div>

                <div class="grid lg:grid-cols-2 gap-8">
                    <!-- Banner Messaging -->
                    <div class="glass-panel p-10 rounded-[2.5rem]">
                        <h3 class="text-xs font-black uppercase tracking-widest text-white/40 mb-8">Public Messaging</h3>
                        <textarea id="saleBanner" class="w-full admin-input h-32 resize-none leading-relaxed">${sale.bannerText}</textarea>
                        <button id="updateSaleMsg" class="mt-6 px-10 py-4 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all">
                            Update Broadcast Message
                        </button>
                    </div>

                    <!-- Included Products -->
                    <div class="glass-panel p-10 rounded-[2.5rem]">
                        <h3 class="text-xs font-black uppercase tracking-widest text-white/40 mb-8">Participating Assets</h3>
                        <div class="space-y-4 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                            ${products.map(p => `
                                <label class="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl cursor-pointer hover:border-white/10 transition-all">
                                    <div class="flex items-center gap-4">
                                        <img src="${p.mainImage}" class="w-10 h-10 object-cover rounded-lg grayscale group-hover:grayscale-0">
                                        <div>
                                            <p class="text-[10px] font-black text-white uppercase">${p.name}</p>
                                            <p class="text-[8px] text-white/20 uppercase tracking-widest">RS.${p.price} Base</p>
                                        </div>
                                    </div>
                                    <input type="checkbox" class="sale-product-check hidden peer" data-id="${p._id}" ${p.isFlashSale ? 'checked' : ''}>
                                    <div class="w-6 h-6 border border-white/10 rounded-lg peer-checked:bg-orange-500 peer-checked:border-orange-500 flex items-center justify-center transition-all">
                                        <i class="fas fa-check text-[10px] text-black hidden peer-checked:block"></i>
                                    </div>
                                </label>
                            `).join('')}
                        </div>
                        <button id="updateSaleProducts" class="mt-8 btn-primary w-full py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                            Sync Selection
                        </button>
                    </div>
                </div>

                <!-- ==================== PROMO CODE MANAGER ==================== -->
                <div class="glass-panel p-10 rounded-[2.5rem] relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-[400px] h-[300px] bg-cyan-500/5 blur-[100px] pointer-events-none"></div>
                    <div class="relative z-10">
                        <div class="flex items-center justify-between mb-8">
                            <div>
                                <h2 class="text-2xl font-black uppercase tracking-tighter">Promo Code Manager</h2>
                                <p class="text-[9px] text-white/30 uppercase tracking-widest mt-1">Create discount codes for your customers</p>
                            </div>
                            <span class="status-badge bg-cyan-500/10 text-cyan-400 border-cyan-500/20">${promoData.codes.length} Active Code${promoData.codes.length !== 1 ? 's' : ''}</span>
                        </div>

                        <!-- Create New Code Form -->
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                            <div>
                                <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Code</label>
                                <input type="text" id="newPromoCode" placeholder="e.g. AMAZE20" class="w-full admin-input" style="text-transform:uppercase">
                            </div>
                            <div>
                                <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Discount Type</label>
                                <select id="newPromoType" class="w-full admin-input">
                                    <option value="Percentage">Percentage (%)</option>
                                    <option value="Fixed">Fixed Amount (RS.)</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Discount Value</label>
                                <input type="number" id="newPromoValue" placeholder="e.g. 20" min="1" class="w-full admin-input">
                            </div>
                            <div>
                                <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Expiry Date</label>
                                <input type="date" id="newPromoExpiry" class="w-full admin-input" min="${new Date().toISOString().split('T')[0]}">
                            </div>
                        </div>
                        <button id="createPromoBtn" class="btn-primary px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-10">
                            <i class="fas fa-plus mr-2"></i> Create Promo Code
                        </button>

                        <!-- Existing Codes List -->
                        <div id="promoCodesList" class="space-y-3">
                            ${promoData.codes.length === 0
                ? `<div class="text-center py-10 text-white/20 text-[10px] uppercase font-bold tracking-widest border border-white/5 rounded-2xl">No promo codes yet. Create one above.</div>`
                : promoData.codes.map(c => `
                                    <div class="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-cyan-500/20 transition-all">
                                        <div class="flex items-center gap-6">
                                            <span class="text-sm font-black text-cyan-400 tracking-widest font-mono">${c.code}</span>
                                            <span class="text-[9px] font-bold text-white/40 uppercase px-3 py-1 bg-white/5 rounded-full">
                                                ${c.discountType === 'Percentage' ? c.discountValue + '% OFF' : 'RS.' + c.discountValue + ' OFF'}
                                            </span>
                                            <span class="text-[9px] text-white/20 uppercase">Expires: ${new Date(c.expiryDate).toLocaleDateString('en-PK')}</span>
                                        </div>
                                        <div class="flex items-center gap-3">
                                            <span class="status-badge ${c.active ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}">${c.active ? 'Active' : 'Inactive'}</span>
                                            <button onclick="window.AdminApp.deletePromoCode('${c._id}')" class="p-2 text-white/20 hover:text-red-400 transition-colors" title="Delete">
                                                <i class="fas fa-trash text-xs"></i>
                                            </button>
                                        </div>
                                    </div>
                                `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    async init() {
        document.getElementById('toggleSale').onclick = async () => {
            try {
                await API.request('/flash-sale/toggle', { method: 'PATCH' });
                UI.toast('Flash Sale State Synchronized');
                window.AdminApp.switchSection('sales');
            } catch (err) {
                UI.toast(err.message, 'error');
            }
        };

        document.getElementById('updateSaleMsg').onclick = async () => {
            try {
                const payload = {
                    bannerText: document.getElementById('saleBanner').value,
                    discountPercentage: parseInt(document.getElementById('salePercent').value),
                    endTime: new Date(document.getElementById('saleExpiry').value).toISOString()
                };
                await API.put('/flash-sale', payload);
                UI.toast('Sale Protocol Updated');
                window.AdminApp.switchSection('sales');
            } catch (err) {
                UI.toast(err.message, 'error');
            }
        };

        document.getElementById('updateSaleProducts').onclick = async () => {
            try {
                UI.toast('Synchronizing Asset Selection...');
                const checkboxes = document.querySelectorAll('.sale-product-check:checked');
                const productIds = Array.from(checkboxes).map(cb => cb.dataset.id);
                await API.put('/products/flash-sale/bulk', { productIds });
                UI.toast('Inventory Sync Complete');
                window.AdminApp.switchSection('sales');
            } catch (err) {
                UI.toast(err.message, 'error');
            }
        };

        document.getElementById('createPromoBtn').onclick = async () => {
            const code = document.getElementById('newPromoCode').value.trim().toUpperCase();
            const discountType = document.getElementById('newPromoType').value;
            const discountValue = parseFloat(document.getElementById('newPromoValue').value);
            const expiryDate = document.getElementById('newPromoExpiry').value;

            if (!code || !discountValue || !expiryDate) {
                UI.toast('Please fill all promo code fields', 'error');
                return;
            }

            try {
                await API.post('/promo', { code, discountType, discountValue, expiryDate: new Date(expiryDate).toISOString(), active: true });
                UI.toast(`✓ Promo code "${code}" created!`);
                window.AdminApp.switchSection('sales');
            } catch (err) {
                UI.toast(err.message || 'Failed to create promo code', 'error');
            }
        };

        // Register global delete handler
        window.AdminApp.deletePromoCode = async (id) => {
            if (!confirm('Delete this promo code?')) return;
            try {
                await API.delete(`/promo/${id}`);
                UI.toast('Promo code deleted');
                window.AdminApp.switchSection('sales');
            } catch (err) {
                UI.toast(err.message, 'error');
            }
        };
    }
};
