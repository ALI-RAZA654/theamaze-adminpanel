import { API } from '../utils/api.js';
import { UI } from '../components/ui.js';

export const MuseModule = {
    async render() {
        const data = await API.get('/muse');
        const muses = data.muses;
        const settings = data.settings;

        return `
            <div class="space-y-10 animate-fade-in">
                <!-- Social Pulse Configuration -->
                <div class="glass-panel p-10 rounded-[2.5rem]">
                    <h2 class="text-2xl font-black uppercase tracking-tighter mb-10">Live Pulse Social Proof</h2>
                    <div class="grid lg:grid-cols-2 gap-10">
                        <div>
                            <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Notification Pattern</label>
                            <input type="text" id="s_text" value="${settings.socialPulseText}" class="w-full admin-input">
                            <p class="text-[8px] text-white/20 uppercase mt-2">Variables: {city}, {product}</p>
                        </div>
                        <div class="grid grid-cols-2 gap-6">
                            <div>
                                <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Pulse Frequency (ms)</label>
                                <input type="number" id="s_freq" value="${settings.socialPulseFrequency}" class="w-full admin-input">
                            </div>
                            <div class="flex items-center gap-4 pt-6">
                                <label class="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" id="s_enabled" class="hidden peer" ${settings.socialPulseEnabled ? 'checked' : ''}>
                                    <div class="w-10 h-6 bg-white/10 rounded-full relative transition-all peer-checked:bg-accent-cyan">
                                        <div class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:left-5"></div>
                                    </div>
                                    <span class="text-[10px] font-bold uppercase tracking-widest text-white/40">Enable Live Pulse</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <button id="saveSocial" class="btn-primary mt-10 px-10 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                        Sync Pulse Protocol
                    </button>
                </div>

                <!-- Muse Archive -->
                <div class="glass-panel p-10 rounded-[2.5rem]">
                    <div class="flex justify-between items-center mb-10">
                        <h2 class="text-2xl font-black uppercase tracking-tighter">The Muse Archive</h2>
                        <button id="addMuse" class="px-8 py-3 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-accent-cyan transition-all">
                            Initialize New Muse
                        </button>
                    </div>
                    
                    <div class="grid lg:grid-cols-3 gap-8">
                        ${muses.map((muse, index) => this.renderMuseCard(muse, index)).join('')}
                    </div>

                    <div class="mt-12 pt-10 border-t border-white/5 flex justify-end">
                        <button id="saveMuse" class="btn-primary px-16 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest">
                            Update Muse Archive
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    renderMuseCard(muse, index) {
        return `
            <div class="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] flex flex-col group relative overflow-hidden">
                <button onclick="window.AdminApp.deleteMuse('${muse._id}')" class="absolute top-4 right-4 text-white/20 hover:text-red-500 transition-all z-20 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center border border-white/5">
                    <i class="fas fa-times text-[10px]"></i>
                </button>

                <div class="aspect-[3/4] rounded-2xl overflow-hidden mb-6 bg-black/40 relative">
                    <img id="prev_muse_${muse._id}" src="${muse.image}" class="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all">
                </div>

                <div class="space-y-6">
                    <div>
                        <label class="block text-[9px] font-bold uppercase tracking-widest text-white/20 mb-2">Author / Role</label>
                        <input type="text" id="role_${muse._id}" value="${muse.location}" class="w-full admin-input text-xs muse-role-input" data-id="${muse._id}">
                    </div>
                    
                    <div>
                        <label class="block text-[9px] font-bold uppercase tracking-widest text-white/20 mb-2">Transmission Content</label>
                        <textarea id="test_${muse._id}" class="w-full admin-input h-24 resize-none text-[10px] muse-test-input" data-id="${muse._id}">${muse.text}</textarea>
                    </div>

                    <div>
                        <label class="block text-[9px] font-bold uppercase tracking-widest text-white/20 mb-2">Asset URL</label>
                        <div class="flex gap-4">
                            <input type="text" id="img_muse_${muse._id}" value="${muse.image}" class="w-full admin-input text-[10px] flex-1 muse-img-input" data-id="${muse._id}">
                            <label class="shrink-0">
                                <div class="h-11 px-4 bg-white/5 border border-dashed border-white/10 rounded-xl hover:bg-white/10 hover:border-accent-cyan/30 cursor-pointer transition-all flex items-center justify-center">
                                    <i class="fas fa-upload text-[10px] text-accent-cyan"></i>
                                </div>
                                <input type="file" id="file_muse_${muse._id}" class="hidden muse-file-input" accept="image/*" data-id="${muse._id}">
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    async init() {
        // Save Social Settings
        const saveSocialBtn = document.getElementById('saveSocial');
        if (saveSocialBtn) {
            saveSocialBtn.onclick = async () => {
                try {
                    const payload = {
                        socialPulseText: document.getElementById('s_text').value,
                        socialPulseFrequency: parseInt(document.getElementById('s_freq').value),
                        socialPulseEnabled: document.getElementById('s_enabled').checked
                    };
                    await API.put('/muse/settings', payload);
                    UI.toast('Social Pulse Configuration Synchronized');
                } catch (err) {
                    UI.toast(err.message, 'error');
                }
            };
        }

        // Handle File Uploads
        document.querySelectorAll('.muse-file-input').forEach(input => {
            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const id = e.target.dataset.id;
                try {
                    UI.toast('Uploading Muse Asset...');
                    const result = await API.upload(file);
                    document.getElementById(`img_muse_${id}`).value = result.url;
                    document.getElementById(`prev_muse_${id}`).src = result.url;
                    UI.toast('Muse Asset Synchronized');
                } catch (err) {
                    UI.toast(err.message, 'error');
                }
            };
        });

        // Add Muse
        const addBtn = document.getElementById('addMuse');
        if (addBtn) {
            addBtn.onclick = () => {
                UI.modal('Initialize New Muse', `
                    <div class="space-y-6">
                        <div>
                            <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Author Name / Location</label>
                            <input type="text" id="new_m_auth" class="w-full admin-input" required>
                        </div>
                        <div>
                            <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Transmission Portrait</label>
                            <div class="flex gap-4">
                                <input type="text" id="new_m_img" class="flex-1 admin-input text-[10px]" placeholder="URL">
                                <label class="shrink-0 flex items-center justify-center p-4 bg-white/5 border border-dashed border-white/10 rounded-xl hover:bg-white/10 hover:border-accent-cyan/30 cursor-pointer transition-all">
                                    <i class="fas fa-upload text-[10px] text-accent-cyan"></i>
                                    <input type="file" id="new_m_file" class="hidden" accept="image/*" onchange="window._handleNewMuseUpload(this)">
                                </label>
                            </div>
                        </div>
                        <div>
                            <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Testimonial Pulse</label>
                            <textarea id="new_m_text" class="w-full admin-input h-24 resize-none text-[10px]"></textarea>
                        </div>
                    </div>
                `, [
                    {
                        id: 'saveNewMuse', text: 'Commit to Archive', class: 'btn-primary', click: async () => {
                            try {
                                const newMuse = {
                                    author: document.getElementById('new_m_auth').value,
                                    location: document.getElementById('new_m_auth').value, // Use same for location if simple
                                    image: document.getElementById('new_m_img').value,
                                    text: document.getElementById('new_m_text').value
                                };
                                await API.post('/muse', newMuse);
                                UI.toast('Muse Archive Updated');
                                UI.closeModal();
                                window.AdminApp.switchSection('muse');
                            } catch (err) {
                                UI.toast(err.message, 'error');
                            }
                        }
                    }
                ]);

                window._handleNewMuseUpload = async (input) => {
                    const file = input.files[0];
                    if (!file) return;
                    try {
                        UI.toast('Syncing Digital Reflection...');
                        const result = await API.upload(file);
                        document.getElementById('new_m_img').value = result.url;
                        UI.toast('Protrait Protocol Synchronized');
                    } catch (err) {
                        UI.toast(err.message, 'error');
                    }
                };
            };
        }

        // Bulk update
        const saveMuseBtn = document.getElementById('saveMuse');
        if (saveMuseBtn) {
            saveMuseBtn.onclick = async () => {
                try {
                    const updatedMuses = Array.from(document.querySelectorAll('.muse-role-input')).map(input => {
                        const id = input.dataset.id;
                        return {
                            _id: id,
                            location: input.value,
                            text: document.getElementById(`test_${id}`).value,
                            image: document.getElementById(`img_muse_${id}`).value
                        };
                    });

                    await API.request('/muse/bulk', {
                        method: 'PUT',
                        body: JSON.stringify({ muses: updatedMuses })
                    });

                    UI.toast('Muse Archive Protocol Synchronized');
                    window.AdminApp.switchSection('muse');
                } catch (err) {
                    UI.toast(err.message, 'error');
                }
            };
        }
    },

    async handleDelete(id) {
        try {
            await API.delete(`/muse/${id}`);
            UI.toast('Muse Identity Erased');
            window.AdminApp.switchSection('muse');
        } catch (err) {
            UI.toast(err.message, 'error');
        }
    }
};
