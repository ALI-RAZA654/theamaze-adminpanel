import { API } from '../utils/api.js';
import { UI } from '../components/ui.js';

export const MarqueeModule = {
    async render() {
        // Fetch marquee from promo endpoint
        const data = await API.get('/promo');
        const marquee = data.marquee;
        const codes = data.codes; // For reference if needed
        const primaryCode = codes.length > 0 ? codes[0].code : 'NONE';

        return `
            <div class="space-y-10 animate-fade-in">
                <div class="glass-panel p-10 rounded-[2.5rem]">
                    <h2 class="text-2xl font-black uppercase tracking-tighter mb-10">Promo Marquee Protocol</h2>
                    
                    <div class="space-y-8">
                        <div>
                            <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Scrolling Transmission Text</label>
                            <input type="text" id="m_text" value="${marquee.text}" class="w-full admin-input">
                        </div>
                        <div class="grid grid-cols-2 gap-10">
                            <div>
                                <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Primary Discount Code</label>
                                <input type="text" id="m_code" value="${primaryCode}" class="w-full admin-input uppercase" readonly>
                                <p class="text-[8px] text-white/20 uppercase mt-2">Manage codes in Settings > Promo Codes (Coming Soon)</p>
                            </div>
                            <div class="flex items-center gap-4 pt-6">
                                <label class="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" id="m_enabled" class="hidden peer" ${marquee.active ? 'checked' : ''}>
                                    <div class="w-10 h-6 bg-white/10 rounded-full relative transition-all peer-checked:bg-accent-cyan">
                                        <div class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:left-5"></div>
                                    </div>
                                    <span class="text-[10px] font-bold uppercase tracking-widest text-white/40">Broadcasting Enabled</span>
                                </label>
                            </div>
                        </div>
                        <button id="saveMarquee" class="btn-primary px-12 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest">
                            Sync Broadcast Protocol
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    async init() {
        document.getElementById('saveMarquee').onclick = async () => {
            try {
                const payload = {
                    text: document.getElementById('m_text').value,
                    active: document.getElementById('m_enabled').checked
                };
                await API.put('/promo', payload);
                UI.toast('Marquee Transmission Updated');
            } catch (err) {
                UI.toast(err.message, 'error');
            }
        };
    }
};

// --- Payments Module ---
export const PaymentsModule = {
    async render() {
        const prep = await API.get('/payment') || { easyPaisa: '', jazzCash: '', shippingFee: 0, enableCOD: true };

        return `
            <div class="space-y-10 animate-fade-in">
                <div class="glass-panel p-10 rounded-[2.5rem]">
                    <h2 class="text-2xl font-black uppercase tracking-tighter mb-10">Financial Infrastructure</h2>
                    
                    <div class="grid lg:grid-cols-2 gap-10">
                        <div class="space-y-8">
                            <div>
                                <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">EasyPaisa Protocol Account</label>
                                <input type="text" id="p_ep" value="${prep.easyPaisa}" class="w-full admin-input">
                            </div>
                            <div>
                                <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">JazzCash Protocol Account</label>
                                <input type="text" id="p_jc" value="${prep.jazzCash}" class="w-full admin-input">
                            </div>
                        </div>
                        <div class="space-y-8">
                            <div>
                                <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Global Shipping Fee ($)</label>
                                <input type="number" id="p_fee" value="${prep.shippingFee}" class="w-full admin-input">
                            </div>
                            <div class="flex items-center gap-4 pt-6">
                                <label class="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" id="p_cod" class="hidden peer" ${prep.enableCOD ? 'checked' : ''}>
                                    <div class="w-10 h-6 bg-white/10 rounded-full relative transition-all peer-checked:bg-accent-cyan">
                                        <div class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:left-5"></div>
                                    </div>
                                    <span class="text-[10px] font-bold uppercase tracking-widest text-white/40">Enable Cash on Delivery</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <button id="savePayments" class="btn-primary mt-12 px-12 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest">
                        Apply Financial Update
                    </button>
                </div>
            </div>
        `;
    },

    async init() {
        document.getElementById('savePayments').onclick = async () => {
            try {
                const payload = {
                    easyPaisa: document.getElementById('p_ep').value,
                    jazzCash: document.getElementById('p_jc').value,
                    shippingFee: parseInt(document.getElementById('p_fee').value),
                    enableCOD: document.getElementById('p_cod').checked
                };
                await API.put('/payment', payload);
                UI.toast('Financial Protocols Synchronized');
            } catch (err) {
                UI.toast(err.message, 'error');
            }
        };
    }
};
