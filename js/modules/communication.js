import { API } from '../utils/api.js';
import { UI } from '../components/ui.js';

export const MarqueeModule = {
    async render() {
        const data = await API.get('/promo');
        const marquee = data.marquee;
        const texts = marquee.texts || [marquee.text] || ['Welcome to THE AMAZE!'];

        return `
            <div class="space-y-10 animate-fade-in">
                <div class="glass-panel p-10 rounded-[2.5rem]">
                    <h2 class="text-2xl font-black uppercase tracking-tighter mb-10">Promo Marquee Protocol</h2>
                    
                    <div class="space-y-8">
                        <div>
                            <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Scrolling Transmission Text (Multiple)</label>
                            <div id="marquee-items-container" class="space-y-4">
                                ${texts.map((t, i) => `
                                    <div class="flex gap-4 marquee-item">
                                        <input type="text" class="w-full admin-input marquee-input" value="${t}">
                                        <button onclick="this.parentElement.remove()" class="px-4 bg-white/5 border border-white/10 rounded-xl hover:bg-red-500/20 hover:border-red-500/30 transition-all">
                                            <i class="fas fa-times text-xs"></i>
                                        </button>
                                    </div>
                                `).join('')}
                            </div>
                            <button id="addMarqueeItem" class="mt-4 px-6 py-3 bg-white/5 border border-dashed border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 hover:border-accent-cyan/30 transition-all flex items-center gap-2">
                                <i class="fas fa-plus"></i> Add New Message
                            </button>
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

                        <button id="saveMarquee" class="btn-primary px-12 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest">
                            Sync Broadcast Protocol
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    async init() {
        const addBtn = document.getElementById('addMarqueeItem');
        if (addBtn) {
            addBtn.onclick = () => {
                const container = document.getElementById('marquee-items-container');
                const div = document.createElement('div');
                div.className = 'flex gap-4 marquee-item';
                div.innerHTML = `
                    <input type="text" class="w-full admin-input marquee-input" value="">
                    <button onclick="this.parentElement.remove()" class="px-4 bg-white/5 border border-white/10 rounded-xl hover:bg-red-500/20 hover:border-red-500/30 transition-all">
                        <i class="fas fa-times text-xs"></i>
                    </button>
                `;
                container.appendChild(div);
            };
        }

        document.getElementById('saveMarquee').onclick = async () => {
            try {
                const texts = Array.from(document.querySelectorAll('.marquee-input'))
                    .map(i => i.value.trim())
                    .filter(t => t);

                const payload = {
                    texts,
                    text: texts[0] || 'Welcome to THE AMAZE!',
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
        const prep = await API.get('/payment') || { easyPaisa: '', easyPaisaTitle: '', jazzCash: '', jazzCashTitle: '', shippingFee: 0, enableCOD: true };

        return `
            <div class="space-y-10 animate-fade-in">
                <div class="glass-panel p-10 rounded-[2.5rem]">
                    <h2 class="text-2xl font-black uppercase tracking-tighter mb-10">Financial Infrastructure</h2>
                    
                    <div class="grid lg:grid-cols-2 gap-10">
                        <div class="space-y-8">
                            <div>
                                <h3 class="text-[10px] font-black uppercase tracking-widest text-accent-cyan mb-4">EasyPaisa Config</h3>
                                <div class="space-y-4">
                                    <div>
                                        <label class="block text-[9px] font-bold uppercase tracking-widest text-white/20 mb-2">Account Title</label>
                                        <input type="text" id="p_ep_title" value="${prep.easyPaisaTitle || ''}" class="w-full admin-input">
                                    </div>
                                    <div>
                                        <label class="block text-[9px] font-bold uppercase tracking-widest text-white/20 mb-2">Account Number</label>
                                        <input type="text" id="p_ep" value="${prep.easyPaisa}" class="w-full admin-input">
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 class="text-[10px] font-black uppercase tracking-widest text-accent-cyan mb-4">JazzCash Config</h3>
                                <div class="space-y-4">
                                    <div>
                                        <label class="block text-[9px] font-bold uppercase tracking-widest text-white/20 mb-2">Account Title</label>
                                        <input type="text" id="p_jc_title" value="${prep.jazzCashTitle || ''}" class="w-full admin-input">
                                    </div>
                                    <div>
                                        <label class="block text-[9px] font-bold uppercase tracking-widest text-white/20 mb-2">Account Number</label>
                                        <input type="text" id="p_jc" value="${prep.jazzCash}" class="w-full admin-input">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="space-y-8">
                            <div>
                                <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Global Shipping Fee (RS)</label>
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
                    easyPaisaTitle: document.getElementById('p_ep_title').value,
                    jazzCash: document.getElementById('p_jc').value,
                    jazzCashTitle: document.getElementById('p_jc_title').value,
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
