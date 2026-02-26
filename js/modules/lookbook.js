import { API } from '../utils/api.js';
import { UI } from '../components/ui.js';

export const LookbookModule = {
    async render() {
        const lookbook = await API.get('/lookbook') || { videoLink: '', isEnabled: true };

        return `
            <div class="space-y-10 animate-fade-in">
                <!-- Video Config -->
                <div class="glass-panel p-10 rounded-[2.5rem]">
                    <h2 class="text-2xl font-black uppercase tracking-tighter mb-10">Lookbook Cinematic Protocol</h2>
                    
                    <div class="grid lg:grid-cols-2 gap-10">
                        <div class="space-y-6">
                            <div>
                                <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Cinematic Video URL</label>
                                <input type="text" id="lb_video" value="${lookbook.videoLink}" class="w-full admin-input">
                                <p class="text-[9px] text-white/20 uppercase mt-2">Direct MP4 link or local file reference</p>
                            </div>
                            
                            <div class="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                                <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Direct Video Protocol</label>
                                <div class="flex items-center gap-4">
                                    <label class="flex-1">
                                        <div class="w-full py-4 px-6 bg-white/5 border border-dashed border-white/10 rounded-xl hover:bg-white/10 hover:border-accent-cyan/30 cursor-pointer transition-all text-center">
                                            <i class="fas fa-cloud-upload-alt text-accent-cyan mb-2"></i>
                                            <p class="text-[9px] font-bold text-white/60 uppercase">Select Local Video Asset</p>
                                        </div>
                                        <input type="file" id="lb_file_input" class="hidden" accept="video/mp4,video/webm">
                                    </label>
                                </div>
                                <p id="uploadStatus" class="text-[8px] text-white/20 uppercase mt-2">Note: Large files should be hosted externally for performance.</p>
                            </div>

                            <div class="flex items-center gap-4 pt-4">
                                <label class="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" id="lb_enabled" class="hidden peer" ${lookbook.isEnabled ? 'checked' : ''}>
                                    <div class="w-10 h-6 bg-white/10 rounded-full relative transition-all peer-checked:bg-accent-cyan">
                                        <div class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:left-5"></div>
                                    </div>
                                    <span class="text-[10px] font-bold uppercase tracking-widest text-white/40">Enable Video Section</span>
                                </label>
                            </div>
                        </div>

                        <div class="p-8 bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center justify-center text-center">
                            <i class="fas fa-video text-white/20 text-4xl mb-6"></i>
                            <h4 class="text-[10px] font-black text-white uppercase mb-2">Immersive Preview</h4>
                            <p class="text-[8px] text-white/20 uppercase tracking-[0.2em] max-w-[200px]">
                                This video serves as the atmospheric bridge between the collection and the engineering archives.
                            </p>
                            <button id="previewLookbook" class="mt-8 px-8 py-3 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-accent-cyan hover:text-black transition-all">
                                Protocol Preview
                            </button>
                        </div>
                    </div>

                    <div class="mt-12 pt-10 border-t border-white/5 flex justify-end">
                        <button id="saveLookbook" class="btn-primary px-16 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest">
                            Update Lookbook Protocol
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    async init() {
        document.getElementById('saveLookbook').onclick = async () => {
            try {
                let videoLink = document.getElementById('lb_video').value;

                // Defered Media Sync
                if (this.pendingFile) {
                    UI.toast('Syncing Cinematic Visual...');
                    const result = await API.upload(this.pendingFile);
                    videoLink = result.url;
                    this.pendingFile = null;
                }

                const lookbook = {
                    videoLink: videoLink,
                    isEnabled: document.getElementById('lb_enabled').checked
                };

                await API.put('/lookbook', lookbook);
                UI.toast('Lookbook Atmospheric Protocol Updated');
            } catch (err) {
                UI.toast(err.message, 'error');
            }
        };

        const fileInput = document.getElementById('lb_file_input');
        const status = document.getElementById('uploadStatus');

        if (fileInput) {
            fileInput.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;

                this.pendingFile = file;
                status.innerText = `Protocol Ready: ${file.name}`;
                status.classList.add('text-accent-cyan', 'font-bold');
            };
        }

        document.getElementById('previewLookbook').onclick = () => {
            const url = document.getElementById('lb_video').value;
            UI.modal('Lookbook Preview', `
                <div class="aspect-video bg-black rounded-2xl overflow-hidden">
                    <video autoplay muted loop playsinline class="w-full h-full object-cover">
                        <source src="${url}" type="video/mp4">
                    </video>
                </div>
            `);
        };
    }
};
