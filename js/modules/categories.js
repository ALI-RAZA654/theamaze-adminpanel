import { API } from '../utils/api.js';
import { UI } from '../components/ui.js';

export const CategoriesModule = {
    state: {
        categories: null
    },

    async render() {
        if (!this.state.categories) {
            this.state.categories = await API.get('/category') || [];
        }

        return `
            <div class="space-y-10 animate-fade-in">
                <div class="glass-panel p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem]">
                    <h2 class="text-xl sm:text-2xl font-black uppercase tracking-tighter mb-10">Tier Navigation (Categories)</h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        ${this.state.categories.map((cat, index) => this.renderCategoryCard(cat, index)).join('')}
                    </div>

                    <div class="mt-12 pt-10 border-t border-white/5 flex justify-between items-center">
                        <button id="addCategory" class="bg-white/5 border border-white/10 text-white hover:bg-white/10 px-8 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all">
                            <i class="fas fa-plus mr-2"></i> Add New Tier
                        </button>
                        <button id="saveCategories" class="btn-primary px-16 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest">
                            Sync Tier Architecture
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    renderCategoryCard(cat, index) {
        const id = cat.uid || `temp_${index}`;
        return `
            <div class="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] flex flex-col group">
                <div class="aspect-video rounded-2xl overflow-hidden mb-6 bg-black/40 relative">
                    <img id="prev_${id}" src="${cat.image}" class="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all">
                    <div class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <span class="text-[8px] font-black uppercase tracking-widest text-accent-cyan">${cat.uid || 'New'} tier</span>
                    </div>
                </div>

                <div class="space-y-6">
                    <div class="flex justify-between items-center">
                        <div>
                            <label class="block text-[9px] font-bold uppercase tracking-widest text-white/20 mb-2">Tier Name</label>
                            <input type="text" id="name_${id}" value="${cat.name}" class="w-full admin-input text-xs category-name-input" data-index="${index}">
                        </div>
                        <div class="text-right">
                             <label class="block text-[9px] font-bold uppercase tracking-widest text-white/20 mb-2">Display</label>
                             <button class="toggle-active w-12 h-6 rounded-full relative transition-all ${cat.isActive !== false ? 'bg-accent-cyan' : 'bg-white/10'}" data-index="${index}">
                                <div class="w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${cat.isActive !== false ? 'right-1' : 'left-1'}"></div>
                             </button>
                        </div>
                    </div>

                    <div>
                        <label class="block text-[9px] font-bold uppercase tracking-widest text-white/20 mb-2">Tier Unique ID</label>
                        <input type="text" id="uid_${id}" value="${cat.uid}" class="w-full admin-input text-[10px] category-uid-input" data-index="${index}" ${cat.uid ? 'readonly' : ''}>
                    </div>
                    
                    <div>
                        <label class="block text-[9px] font-bold uppercase tracking-widest text-white/20 mb-2">Image Protocol</label>
                        <input type="text" id="img_${id}" value="${cat.image}" class="w-full admin-input text-[10px] mb-4 category-img-input" data-index="${index}">
                        
                        <div class="grid grid-cols-2 gap-4">
                            <label class="cursor-pointer">
                                <div class="w-full py-3 px-4 bg-white/5 border border-dashed border-white/10 rounded-xl hover:bg-white/10 hover:border-accent-cyan/30 cursor-pointer transition-all text-center">
                                    <span class="text-[9px] font-bold text-white/40 uppercase">Upload</span>
                                </div>
                                <input type="file" id="file_${id}" class="hidden category-file-input" accept="image/*" data-index="${index}">
                            </label>
                            <button class="remove-category w-full py-3 px-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all" data-index="${index}">
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    async init() {
        // Sync inputs back to state to avoid losing data on toggle
        const syncInputs = () => {
            this.state.categories.forEach((cat, idx) => {
                const id_source = cat.uid || `temp_${idx}`;
                const nameInput = document.getElementById(`name_${id_source}`);
                const uidInput = document.getElementById(`uid_${id_source}`);
                const imgInput = document.getElementById(`img_${id_source}`);

                if (nameInput) cat.name = nameInput.value;
                if (uidInput && !cat.uid) cat.uid = uidInput.value; // Only sync UID if it was empty (new category)
                if (imgInput) cat.image = imgInput.value;
            });
        };

        // Add Category
        const addBtn = document.getElementById('addCategory');
        if (addBtn) {
            addBtn.onclick = () => {
                syncInputs();
                this.state.categories.push({
                    uid: '',
                    name: 'New Tier',
                    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000',
                    isActive: true,
                    _isNew: true
                });
                this.refreshUI();
            };
        }

        // Handle Active Toggle
        document.querySelectorAll('.toggle-active').forEach(btn => {
            btn.onclick = () => {
                syncInputs();
                const idx = parseInt(btn.dataset.index);
                this.state.categories[idx].isActive = this.state.categories[idx].isActive === false ? true : false;
                this.refreshUI();
            };
        });

        // Handle Remove
        document.querySelectorAll('.remove-category').forEach(btn => {
            btn.onclick = () => {
                const idx = parseInt(btn.dataset.index);
                if (confirm('Are you sure you want to decommission this tier? This protocol cannot be reversed.')) {
                    syncInputs();
                    this.state.categories.splice(idx, 1);
                    this.refreshUI();
                }
            };
        });

        // Handle File Uploads
        document.querySelectorAll('.category-file-input').forEach(input => {
            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                syncInputs();
                const idx = parseInt(e.target.dataset.index);
                const id = this.state.categories[idx].uid || `temp_${idx}`;
                const imgInputValue = document.getElementById(`img_${id}`);
                const preview = document.getElementById(`prev_${id}`);

                try {
                    UI.toast(`Uploading ${this.state.categories[idx].uid.toUpperCase() || 'NEW'} Asset...`);
                    const result = await API.upload(file);
                    if (imgInputValue) imgInputValue.value = result.url;
                    if (preview) preview.src = result.url;
                    this.state.categories[idx].image = result.url;

                    UI.toast(`${this.state.categories[idx].uid.toUpperCase() || 'NEW'} Asset Synchronized`);
                } catch (err) {
                    UI.toast(err.message, 'error');
                }
            };
        });

        document.getElementById('saveCategories').onclick = async () => {
            try {
                syncInputs();
                const updatedCategories = this.state.categories.map(c => ({
                    uid: c.uid,
                    name: c.name,
                    image: c.image,
                    isActive: c.isActive !== false
                }));

                if (updatedCategories.some(c => !c.uid)) {
                    throw new Error('All Tiers must have a unique ID code.');
                }

                await API.put('/category', updatedCategories);
                UI.toast('Category Architecture Synchronized');
                this.state.categories = null; // Clear to force reload
                window.AdminApp.switchSection('categories');
            } catch (err) {
                UI.toast(err.message, 'error');
            }
        };
    },

    async refreshUI() {
        const content = await this.render();
        document.getElementById('contentArea').innerHTML = content;
        this.init();
    }
};
