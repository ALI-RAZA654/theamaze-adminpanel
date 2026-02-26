import { API } from '../utils/api.js';
import { UI } from '../components/ui.js';

export const FooterModule = {
    async render() {
        const footer = await API.get('/footer') || { description: '', copyright: '', socials: {}, sections: {} };

        return `
            <div class="space-y-10 animate-fade-in">
                <!-- Branding & Copy -->
                <div class="glass-panel p-10 rounded-[2.5rem]">
                    <h2 class="text-2xl font-black uppercase tracking-tighter mb-10">Branding & Identity</h2>
                    
                    <div class="space-y-8">
                        <div>
                            <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Vision Description</label>
                            <textarea id="f_desc" class="w-full admin-input h-24 resize-none leading-relaxed">${footer.description}</textarea>
                        </div>
                        <div>
                            <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Copyright Notice</label>
                            <input type="text" id="f_copy" value="${footer.copyright}" class="w-full admin-input">
                        </div>
                    </div>
                </div>

                <div class="grid lg:grid-cols-2 gap-8">
                    <!-- Social Links -->
                    <div class="glass-panel p-10 rounded-[2.5rem]">
                        <h3 class="text-xs font-black uppercase tracking-widest text-white/40 mb-8">Digital Presence (Socials)</h3>
                        <div class="space-y-6">
                            <div>
                                <label class="block text-[9px] font-bold uppercase tracking-widest text-white/20 mb-2">Instagram Link</label>
                                <input type="text" id="s_ig" value="${footer.socials?.instagram || ''}" class="w-full admin-input">
                            </div>
                            <div>
                                <label class="block text-[9px] font-bold uppercase tracking-widest text-white/20 mb-2">X / Digital Link</label>
                                <input type="text" id="s_x" value="${footer.socials?.x || ''}" class="w-full admin-input">
                            </div>
                            <div>
                                <label class="block text-[9px] font-bold uppercase tracking-widest text-white/20 mb-2">LinkedIn Link</label>
                                <input type="text" id="s_li" value="${footer.socials?.linkedin || ''}" class="w-full admin-input">
                            </div>
                        </div>
                    </div>

                    <!-- Visibility Controls -->
                    <div class="glass-panel p-10 rounded-[2.5rem]">
                        <h3 class="text-xs font-black uppercase tracking-widest text-white/40 mb-8">Section Visibility</h3>
                        <div class="space-y-6">
                            ${this.createToggleRow('Mission Navigation', 'f_nav', footer.sections?.showNavigation)}
                            ${this.createToggleRow('Digital Presence Column', 'f_dig', footer.sections?.showDigital)}
                            ${this.createToggleRow('Intellectual Protocol (Legal)', 'f_leg', footer.sections?.showLegal)}
                        </div>

                        <div class="mt-12 p-6 bg-accent-cyan/5 border border-accent-cyan/10 rounded-2xl">
                            <p class="text-[9px] text-accent-cyan font-bold uppercase tracking-widest leading-relaxed">
                                Note: Disabling these sections will collapse the architecture of the portal's base.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end">
                    <button id="saveFooter" class="btn-primary px-16 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest">
                        Sync Footer Protocol
                    </button>
                </div>
            </div>
        `;
    },

    createToggleRow(label, id, checked) {
        return `
            <div class="flex justify-between items-center">
                <span class="text-[10px] font-bold text-white/60 uppercase tracking-widest">${label}</span>
                <label class="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" id="${id}" class="hidden peer" ${checked ? 'checked' : ''}>
                    <div class="w-10 h-6 bg-white/10 rounded-full relative transition-all peer-checked:bg-accent-cyan">
                        <div class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:left-5"></div>
                    </div>
                </label>
            </div>
        `;
    },

    async init() {
        document.getElementById('saveFooter').onclick = async () => {
            try {
                const footer = {
                    description: document.getElementById('f_desc').value,
                    copyright: document.getElementById('f_copy').value,
                    socials: {
                        instagram: document.getElementById('s_ig').value,
                        x: document.getElementById('s_x').value,
                        linkedin: document.getElementById('s_li').value
                    },
                    sections: {
                        showNavigation: document.getElementById('f_nav').checked,
                        showDigital: document.getElementById('f_dig').checked,
                        showLegal: document.getElementById('f_leg').checked
                    }
                };

                await API.put('/footer', footer);
                UI.toast('Footer Protocol Synchronized');
            } catch (err) {
                UI.toast(err.message, 'error');
            }
        };
    }
};
