import { API } from '../utils/api.js';
import { UI } from '../components/ui.js';

export const ContactModule = {
    async render() {
        const subjects = await API.get('/contact/subjects');

        return `
            <div class="space-y-10 animate-fade-in">
                <div class="glass-panel p-10 rounded-[2.5rem]">
                    <h2 class="text-2xl font-black uppercase tracking-tighter mb-10">Transmission Protocols (Contact Settings)</h2>
                    
                    <div class="space-y-8 max-w-2xl">
                        <div>
                            <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Subject Protocol Options (One per line)</label>
                            <textarea id="contactSubjects" class="w-full admin-input h-64 resize-none leading-relaxed text-xs">${subjects.map(s => s.name).join('\n')}</textarea>
                            <p class="mt-4 text-[9px] text-white/20 uppercase font-bold tracking-widest">These options will appear in the subject dropdown on the contact page.</p>
                        </div>

                        <div class="pt-10 border-t border-white/5 flex justify-end">
                            <button id="saveContact" class="btn-primary px-16 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest">
                                Sync Transmission Protocol
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    async init() {
        const saveBtn = document.getElementById('saveContact');
        if (saveBtn) {
            saveBtn.onclick = async () => {
                try {
                    const subjectsText = document.getElementById('contactSubjects').value;
                    const subjectNames = subjectsText.split('\n').map(s => s.trim()).filter(s => s !== '');

                    // We need a bulk update for subjects on backend.
                    // Since it's missing, let's just loop create for now OR update backend.
                    // Proactive: I'll update backend to handle bulk subject update.
                    await API.request('/contact/subjects/bulk', {
                        method: 'POST',
                        body: JSON.stringify({ subjects: subjectNames })
                    });

                    UI.toast('Transmission Protocol Synchronized');
                    window.AdminApp.switchSection('contact');
                } catch (err) {
                    UI.toast(err.message, 'error');
                }
            };
        }
    }
};
