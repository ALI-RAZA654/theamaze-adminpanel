import { API } from '../utils/api.js';
import { UI } from '../components/ui.js';

export const AboutModule = {
    state: {
        about: null
    },

    async render() {
        if (!this.state.about) {
            this.state.about = await API.get('/about') || {};
        }

        const data = this.state.about;

        return `
            <div class="space-y-10 animate-fade-in">
                <!-- THE STORY -->
                <div class="glass-panel p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem]">
                    <h2 class="text-xl sm:text-2xl font-black uppercase tracking-tighter mb-10">The Story Protocol</h2>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div class="space-y-6">
                            <div>
                                <label class="block text-[9px] font-bold uppercase tracking-widest text-white/20 mb-2">Story Title</label>
                                <input type="text" id="storyTitle" value="${data.storyTitle || ''}" class="w-full admin-input">
                            </div>
                            <div>
                                <label class="block text-[9px] font-bold uppercase tracking-widest text-white/20 mb-2">Story Text 1</label>
                                <textarea id="storyText1" rows="4" class="w-full admin-input resize-none">${data.storyText1 || ''}</textarea>
                            </div>
                            <div>
                                <label class="block text-[9px] font-bold uppercase tracking-widest text-white/20 mb-2">Story Text 2</label>
                                <textarea id="storyText2" rows="4" class="w-full admin-input resize-none">${data.storyText2 || ''}</textarea>
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-[9px] font-bold uppercase tracking-widest text-white/20 mb-2">Story Image</label>
                            <input type="text" id="storyImage" value="${data.storyImage || ''}" class="w-full admin-input text-[10px] mb-4 overflow-hidden text-ellipsis whitespace-nowrap">
                            
                            <div class="aspect-[4/5] rounded-2xl overflow-hidden mb-6 bg-black/40 relative">
                                <img id="storyImagePreview" src="${data.storyImage || ''}" class="w-full h-full object-cover">
                            </div>

                            <label class="cursor-pointer block">
                                <div class="w-full py-4 px-4 bg-white/5 border border-dashed border-white/10 rounded-xl hover:bg-white/10 hover:border-accent-cyan/30 cursor-pointer transition-all text-center">
                                    <span class="text-[10px] font-bold text-white/40 uppercase">Upload New Asset</span>
                                </div>
                                <input type="file" id="storyImageFile" class="hidden" accept="image/*">
                            </label>
                        </div>
                    </div>
                </div>

                <!-- THE PILLARS -->
                <div class="glass-panel p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem]">
                    <h2 class="text-xl sm:text-2xl font-black uppercase tracking-tighter mb-10">Brand Pillars</h2>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div>
                            <label class="block text-[9px] font-bold uppercase tracking-widest text-white/20 mb-2">Philosophy</label>
                            <textarea id="philosophyText" rows="6" class="w-full admin-input resize-none">${data.philosophyText || ''}</textarea>
                        </div>
                        <div>
                            <label class="block text-[9px] font-bold uppercase tracking-widest text-white/20 mb-2">Engineering</label>
                            <textarea id="engineeringText" rows="6" class="w-full admin-input resize-none">${data.engineeringText || ''}</textarea>
                        </div>
                        <div>
                            <label class="block text-[9px] font-bold uppercase tracking-widest text-white/20 mb-2">Legacy</label>
                            <textarea id="legacyText" rows="6" class="w-full admin-input resize-none">${data.legacyText || ''}</textarea>
                        </div>
                    </div>
                </div>

                <!-- MATERIALS & CRAFT -->
                <div class="glass-panel p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem]">
                    <h2 class="text-xl sm:text-2xl font-black uppercase tracking-tighter mb-10">Materials Protocol</h2>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div class="space-y-6">
                            <div>
                                <label class="block text-[9px] font-bold uppercase tracking-widest text-white/20 mb-2">Materials Title</label>
                                <input type="text" id="materialsTitle" value="${data.materialsTitle || ''}" class="w-full admin-input">
                            </div>
                            <div>
                                <label class="block text-[9px] font-bold uppercase tracking-widest text-white/20 mb-2">Materials Text</label>
                                <textarea id="materialsText" rows="6" class="w-full admin-input resize-none">${data.materialsText || ''}</textarea>
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-[9px] font-bold uppercase tracking-widest text-white/20 mb-2">Materials Image</label>
                            <input type="text" id="materialsImage" value="${data.materialsImage || ''}" class="w-full admin-input text-[10px] mb-4 overflow-hidden text-ellipsis whitespace-nowrap">
                            
                            <div class="aspect-video rounded-2xl overflow-hidden mb-6 bg-black/40 relative">
                                <img id="materialsImagePreview" src="${data.materialsImage || ''}" class="w-full h-full object-cover">
                            </div>

                            <label class="cursor-pointer block">
                                <div class="w-full py-4 px-4 bg-white/5 border border-dashed border-white/10 rounded-xl hover:bg-white/10 hover:border-accent-cyan/30 cursor-pointer transition-all text-center">
                                    <span class="text-[10px] font-bold text-white/40 uppercase">Upload New Asset</span>
                                </div>
                                <input type="file" id="materialsImageFile" class="hidden" accept="image/*">
                            </label>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end pt-6">
                    <button id="saveAbout" class="btn-primary px-16 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest">
                        Sync About Architecture
                    </button>
                </div>
            </div>
        `;
    },

    async init() {
        // Handle Story Image Upload
        const storyFile = document.getElementById('storyImageFile');
        if (storyFile) {
            storyFile.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                try {
                    UI.toast('Uploading Story Asset...');
                    const result = await API.upload(file);
                    document.getElementById('storyImage').value = result.url;
                    document.getElementById('storyImagePreview').src = result.url;
                    UI.toast('Story Asset Synchronized');
                } catch (err) {
                    UI.toast(err.message, 'error');
                }
            };
        }

        // Handle Materials Image Upload
        const materialsFile = document.getElementById('materialsImageFile');
        if (materialsFile) {
            materialsFile.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                try {
                    UI.toast('Uploading Materials Asset...');
                    const result = await API.upload(file);
                    document.getElementById('materialsImage').value = result.url;
                    document.getElementById('materialsImagePreview').src = result.url;
                    UI.toast('Materials Asset Synchronized');
                } catch (err) {
                    UI.toast(err.message, 'error');
                }
            };
        }

        // Save
        const saveBtn = document.getElementById('saveAbout');
        if (saveBtn) {
            saveBtn.onclick = async () => {
                try {
                    const data = {
                        storyTitle: document.getElementById('storyTitle').value,
                        storyText1: document.getElementById('storyText1').value,
                        storyText2: document.getElementById('storyText2').value,
                        storyImage: document.getElementById('storyImage').value,
                        philosophyText: document.getElementById('philosophyText').value,
                        engineeringText: document.getElementById('engineeringText').value,
                        legacyText: document.getElementById('legacyText').value,
                        materialsTitle: document.getElementById('materialsTitle').value,
                        materialsText: document.getElementById('materialsText').value,
                        materialsImage: document.getElementById('materialsImage').value,
                    };

                    await API.put('/about', data);
                    this.state.about = data;
                    UI.toast('About Architecture Synchronized');
                } catch (err) {
                    UI.toast(err.message, 'error');
                }
            };
        }
    }
};
