import { API } from '../utils/api.js';
import { UI } from '../components/ui.js';

export const TrustedModule = {
    async render() {
        const stats = await API.get('/trust');

        return `
            <div class="space-y-10 animate-fade-in">
                <div class="glass-panel p-10 rounded-[2.5rem]">
                    <h2 class="text-2xl font-black uppercase tracking-tighter mb-10">Trust Protocol Metrics</h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        ${stats.map(stat => `
                            <div class="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-6">
                                <div class="w-12 h-12 bg-accent-cyan/10 rounded-2xl flex items-center justify-center text-accent-cyan">
                                    <i class="${stat.icon} text-xl"></i>
                                </div>
                                
                                <div>
                                    <label class="block text-[9px] font-bold uppercase tracking-widest text-white/20 mb-2">Icon Class</label>
                                    <input type="text" id="icon_${stat._id}" value="${stat.icon}" class="w-full admin-input text-[10px]">
                                </div>

                                <div>
                                    <label class="block text-[9px] font-bold uppercase tracking-widest text-white/20 mb-2">Label Protocol</label>
                                    <input type="text" id="label_${stat._id}" value="${stat.label}" class="w-full admin-input text-[10px]">
                                </div>

                                <div>
                                    <label class="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Display Value</label>
                                    <input type="text" id="value_${stat._id}" value="${stat.value}" class="w-full admin-input font-black text-white">
                                </div>
                                
                                <button onclick="window.AdminApp.updateTrustStat('${stat._id}')" class="w-full py-3 bg-white/5 hover:bg-white/10 text-[9px] font-bold uppercase tracking-widest rounded-xl transition-all">
                                    Sync Metric
                                </button>
                            </div>
                        `).join('')}
                    </div>

                    <div class="mt-12 pt-10 border-t border-white/5">
                         <button id="addTrustStat" class="px-8 py-3 bg-white/5 text-white/40 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all">
                            Add New Metric Segment
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    async init() {
        // Add trust stat
        const addBtn = document.getElementById('addTrustStat');
        if (addBtn) {
            addBtn.onclick = () => {
                UI.modal('Add Trust Metric', `
                    <div class="space-y-6">
                        <div>
                            <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Icon Class (FontAwesome)</label>
                            <input type="text" id="new_t_icon" value="fas fa-check" class="w-full admin-input">
                        </div>
                        <div>
                            <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Metric Label</label>
                            <input type="text" id="new_t_label" placeholder="e.g. Happy Users" class="w-full admin-input">
                        </div>
                        <div>
                            <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Metric Value</label>
                            <input type="text" id="new_t_value" placeholder="e.g. 50,000+" class="w-full admin-input">
                        </div>
                    </div>
                `, [
                    {
                        id: 'saveNewTrust', text: 'Commit Metric', class: 'btn-primary', click: async () => {
                            try {
                                const payload = {
                                    icon: document.getElementById('new_t_icon').value,
                                    label: document.getElementById('new_t_label').value,
                                    value: document.getElementById('new_t_value').value
                                };
                                await API.post('/trust', payload);
                                UI.toast('Metric Committed');
                                UI.closeModal();
                                window.AdminApp.switchSection('trusted');
                            } catch (err) {
                                UI.toast(err.message, 'error');
                            }
                        }
                    }
                ]);
            };
        }
    },

    async updateStat(id) {
        try {
            const payload = {
                id,
                icon: document.getElementById(`icon_${id}`).value,
                label: document.getElementById(`label_${id}`).value,
                value: document.getElementById(`value_${id}`).value
            };
            // The backend updateTrustStat only takes id and value. 
            // I should update backend to accept all fields.
            await API.put('/trust', payload);
            UI.toast('Metric Synchronized');
            window.AdminApp.switchSection('trusted');
        } catch (err) {
            UI.toast(err.message, 'error');
        }
    }
};
