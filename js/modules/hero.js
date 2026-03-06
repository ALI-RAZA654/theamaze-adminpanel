import { API } from '../utils/api.js';
import { UI } from '../components/ui.js';

export const HeroModule = {
    async render() {
        const hero = await API.get('/hero') || { heading: '', subtext: '', ctaText: '', videoLink: '', enableSpotlight: true };
        const products = await API.get('/products');

        return `
            <div class="space-y-10 animate-fade-in">
                <!-- Visual Config -->
                <div class="glass-panel p-10 rounded-[2.5rem]">
                    <h2 class="text-2xl font-black uppercase tracking-tighter mb-10">Hero Atmosphere Config</h2>
                    
                    <div class="grid lg:grid-cols-2 gap-10">
                        <div class="space-y-6">
                            <div>
                                <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Main Heading</label>
                                <input type="text" id="h_heading" value="${hero.heading}" class="w-full admin-input">
                            </div>
                            <div>
                                <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Atmosphere Subtext</label>
                                <textarea id="h_subtext" class="w-full admin-input h-32 resize-none leading-relaxed">${hero.subtext}</textarea>
                            </div>
                            <div class="grid grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">CTA Action Text</label>
                                    <input type="text" id="h_cta" value="${hero.ctaText}" class="w-full admin-input">
                                </div>
                                <div class="flex items-center gap-4 pt-6">
                                    <label class="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" id="h_spotlight" class="hidden peer" ${hero.enableSpotlight ? 'checked' : ''}>
                                        <div class="w-10 h-6 bg-white/10 rounded-full relative transition-all peer-checked:bg-accent-cyan">
                                            <div class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:left-5"></div>
                                        </div>
                                        <span class="text-[10px] font-bold uppercase tracking-widest text-white/40">Enable Spotlight Card</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="space-y-6">
                            <div>
                                <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Background Media (URL Protocol)</label>
                                <input type="url" id="h_video" value="${hero.videoLink}" class="w-full admin-input">
                                <p class="text-[9px] text-white/20 uppercase mt-2">MP4 source link for direct rendering</p>
                            </div>
                            
                            <div class="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                                <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Direct Media Transmission</label>
                                <label class="block">
                                    <div class="w-full py-4 bg-white/5 border border-dashed border-white/10 rounded-xl hover:bg-white/10 hover:border-accent-cyan/30 cursor-pointer transition-all text-center">
                                        <i class="fas fa-video text-accent-cyan mb-2"></i>
                                        <p class="text-[9px] font-bold text-white/60 uppercase">Upload Local Media Asset</p>
                                    </div>
                                    <input type="file" id="h_file_input" class="hidden" accept="video/mp4,video/webm">
                                </label>
                                <p id="heroUploadStatus" class="text-[8px] text-white/20 uppercase mt-2 text-center">Protocol readiness check active.</p>
                            </div>

                            <div class="p-6 bg-accent-cyan/5 border border-accent-cyan/20 rounded-2xl">
                                <label class="block text-[10px] font-black uppercase tracking-widest text-accent-cyan mb-4">Atmospheric Featured Asset (Single Card)</label>
                                <select id="h_featured" class="w-full admin-input outline-none">
                                    <option value="">Select Featured Product</option>
                                    ${products.map(p => `
                                        <option value="${p._id}" ${hero.featuredProductId == p._id ? 'selected' : ''}>${p.name}</option>
                                    `).join('')}
                                </select>
                                <p class="text-[8px] text-white/20 uppercase mt-2">This product will be highlighted in the main Hero featured box.</p>
                            </div>

                            <div>
                                <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Spotlight Series Protocols (3 Products Required)</label>
                                <div class="space-y-4">
                                    <div class="flex items-center gap-4">
                                        <span class="text-[8px] font-black text-accent-cyan w-4">01</span>
                                        <select id="h_spotlight_1" class="w-full admin-input outline-none">
                                            <option value="">Select Product Protocol</option>
                                            ${products.map(p => `
                                                <option value="${p._id}" ${hero.spotlightProductIds && hero.spotlightProductIds[0] == p._id ? 'selected' : ''}>${p.name}</option>
                                            `).join('')}
                                        </select>
                                    </div>
                                    <div class="flex items-center gap-4">
                                        <span class="text-[8px] font-black text-accent-cyan w-4">02</span>
                                        <select id="h_spotlight_2" class="w-full admin-input outline-none">
                                            <option value="">Select Product Protocol</option>
                                            ${products.map(p => `
                                                <option value="${p._id}" ${hero.spotlightProductIds && hero.spotlightProductIds[1] == p._id ? 'selected' : ''}>${p.name}</option>
                                            `).join('')}
                                        </select>
                                    </div>
                                    <div class="flex items-center gap-4">
                                        <span class="text-[8px] font-black text-accent-cyan w-4">03</span>
                                        <select id="h_spotlight_3" class="w-full admin-input outline-none">
                                            <option value="">Select Product Protocol</option>
                                            ${products.map(p => `
                                                <option value="${p._id}" ${hero.spotlightProductIds && hero.spotlightProductIds[2] == p._id ? 'selected' : ''}>${p.name}</option>
                                            `).join('')}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="p-6 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
                                <div class="flex items-center gap-4">
                                    <i class="fas fa-play-circle text-accent-cyan text-xl"></i>
                                    <div>
                                        <p class="text-[10px] font-black text-white uppercase">Vanguard Preview</p>
                                        <p class="text-[8px] text-white/20 uppercase tracking-widest">Protocol Sync Required</p>
                                    </div>
                                </div>
                                <button id="previewHero" class="px-6 py-2 bg-white/10 text-white text-[9px] font-bold uppercase tracking-widest rounded-lg hover:bg-white hover:text-black transition-all">
                                    View Live
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="mt-12 pt-10 border-t border-white/5 flex justify-end">
                        <button id="saveHero" class="btn-primary px-16 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest">
                            Update Atmospheric Protocol
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    async init() {
        document.getElementById('saveHero').onclick = async () => {
            try {
                let videoLink = document.getElementById('h_video').value.trim();

                // Defered Media Sync
                if (this.pendingFile) {
                    UI.toast('Syncing Atmosphere Visual...');
                    const result = await API.upload(this.pendingFile);
                    videoLink = result.url;
                    this.pendingFile = null;
                }

                const spotlightProductIds = [
                    document.getElementById('h_spotlight_1').value,
                    document.getElementById('h_spotlight_2').value,
                    document.getElementById('h_spotlight_3').value
                ].filter(id => id !== "");

                const hero = {
                    heading: document.getElementById('h_heading').value.trim(),
                    subtext: document.getElementById('h_subtext').value.trim(),
                    ctaText: document.getElementById('h_cta').value.trim(),
                    videoLink: videoLink,
                    featuredProductId: document.getElementById('h_featured').value,
                    spotlightProductIds: spotlightProductIds,
                    enableSpotlight: document.getElementById('h_spotlight').checked
                };

                if (!hero.heading || !hero.subtext) {
                    throw new Error('Heading and Subtext are protocols that cannot be empty.');
                }
                await API.put('/hero', hero);
                UI.toast('Hero Atmospheric Configuration Updated');
            } catch (err) {
                UI.toast(err.message, 'error');
            }
        };

        // File Selection Logic
        const fileInput = document.getElementById('h_file_input');
        const status = document.getElementById('heroUploadStatus');

        if (fileInput) {
            fileInput.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;

                this.pendingFile = file;
                status.innerText = `Atmosphere Protocol Ready: ${file.name}`;
                status.className = 'text-[8px] uppercase mt-2 text-center text-accent-cyan font-bold';
            };
        }
    }
};
