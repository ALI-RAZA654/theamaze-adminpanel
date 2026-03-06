// THE AMAZE - Products Management Module

import { API } from '../utils/api.js';
import { UI } from '../components/ui.js';
import { KEYS, AdminState } from '../data.js';

export const ProductsModule = {
    async render() {
        const products = await API.get('/products');
        const categories = await API.get('/category');

        return `
            <div class="space-y-8 animate-fade-in">
                <!-- Header Actions -->
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div class="flex flex-wrap gap-4">
                        <select id="categoryFilter" class="bg-white/5 border border-white/10 rounded-xl px-6 py-3 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-accent-cyan transition-all">
                            <option value="all">All Tiers</option>
                            ${categories.map(c => `<option value="${c.uid}">${c.name}</option>`).join('')}
                        </select>
                        <button id="addBtn" class="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-accent-cyan transition-all">
                            Initialize New Asset
                        </button>
                    </div>
                    <div class="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">
                        Total Inventory Count: <span class="text-white">${products.length}</span>
                    </div>
                </div>

                <!-- Products Table -->
                <div class="glass-panel rounded-[2rem] overflow-hidden">
                    <div class="table-container">
                        <table class="w-full admin-table">
                        <thead>
                            <tr>
                                <th class="w-20">Asset</th>
                                <th>Identification</th>
                                <th>Category</th>
                                <th>Pricing</th>
                                <th>Inventory</th>
                                <th>Priority</th>
                                <th class="text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody id="productsTableBody">
                            ${this.renderProductsTable(products)}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderProductsTable(products) {
        if (products.length === 0) {
            return `<tr><td colspan="7" class="text-center py-20 text-white/20 text-[10px] uppercase font-bold tracking-widest">Inventory Matrix Empty</td></tr>`;
        }

        return products.map(p => `
            <tr class="hover:bg-white/[0.01] transition-colors">
                <td>
                    <img src="${p.mainImage}" class="w-12 h-16 object-cover rounded-xl border border-white/10">
                </td>
                <td>
                    <div class="text-[11px] font-black text-white uppercase mb-1">${p.name}</div>
                    <div class="text-[9px] text-white/20 font-bold uppercase tracking-widest">ID: ${p._id.substring(0, 8)}</div>
                </td>
                <td><span class="text-[10px] font-bold text-white/40 uppercase">${p.category}</span></td>
                <td>
                    <div class="text-[11px] font-black text-accent-cyan">RS.${p.isFlashSale ? p.salePrice : p.price}</div>
                    ${p.isFlashSale ? `<div class="text-[9px] text-white/20 line-through">RS.${p.price}</div>` : ''}
                </td>
                <td>
                    <div class="flex items-center gap-2">
                        <span class="text-[11px] font-bold ${p.stock < 5 ? 'text-red-500' : 'text-white/60'}">${p.stock}</span>
                        ${p.stock < 5 ? '<i class="fas fa-exclamation-triangle text-red-500 text-[8px]"></i>' : ''}
                    </div>
                </td>
                <td>
                    <div class="flex gap-2">
                        ${p.featured ? '<span class="status-badge bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">Featured</span>' : ''}
                        ${p.isFlashSale ? '<span class="status-badge bg-orange-500/10 text-orange-500 border border-orange-500/20">Sale</span>' : ''}
                    </div>
                </td>
                <td class="text-right">
                    <div class="flex justify-end gap-2">
                        <button onclick="window.AdminApp.editProduct('${p._id}')" class="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all">
                            <i class="fas fa-pen text-[10px]"></i>
                        </button>
                        <button onclick="window.AdminApp.deleteProduct('${p._id}')" class="w-9 h-9 flex items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                            <i class="fas fa-trash text-[10px]"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    async init() {
        // Initialize Add Button
        const addBtn = document.getElementById('addBtn');
        if (addBtn) {
            addBtn.onclick = () => this.openAddModal();
        }

        // Initialize Category Filter
        const filter = document.getElementById('categoryFilter');
        if (filter) {
            filter.onchange = async (e) => {
                const categoryId = e.target.value;
                const allProducts = await API.get('/products');
                const filtered = categoryId === 'all'
                    ? allProducts
                    : allProducts.filter(p => p.category === categoryId);

                document.getElementById('productsTableBody').innerHTML = this.renderProductsTable(filtered);
            };
        }
    },

    async openAddModal() {
        // Clear previous deferred file data
        delete this.p_image_file_data;
        delete this.p_hover_file_data;
        delete this.p_sizeChart_file_data;
        delete this.p_gallery_files_data;

        const categories = await API.get('/category');

        UI.modal('Initialize New Asset', `
            <div id="productForm" class="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[80vh] overflow-y-auto pr-4 custom-scrollbar">
                <div class="col-span-1 md:col-span-2">
                    <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Product Name (Identity)</label>
                    <input type="text" id="p_name" class="w-full admin-input" required placeholder="e.g. VANGUARD SILK TEE">
                </div>
                
                <div>
                    <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Category</label>
                    <select id="p_category" class="w-full admin-input outline-none">
                        ${categories.map(c => `<option value="${c.uid}">${c.name}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Inventory Stock</label>
                    <input type="number" id="p_stock" class="w-full admin-input" required value="10">
                </div>
                <div>
                    <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Fabric / Materiality</label>
                    <input type="text" id="p_fabric" class="w-full admin-input" placeholder="e.g. Hybrid Synthetic">
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Base Price (RS.)</label>
                        <input type="number" id="p_price" class="w-full admin-input" required placeholder="180">
                    </div>
                    <div>
                        <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Sale Price (RS.)</label>
                        <input type="number" id="p_salePrice" class="w-full admin-input" placeholder="150">
                    </div>
                </div>

                <div class="col-span-1 md:col-span-2 pt-4 border-t border-white/5">
                    <h4 class="text-[11px] font-black uppercase tracking-tighter text-accent-cyan mb-6">Primary Visual Protocol</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Main Image</label>
                            <input type="text" id="p_image" class="w-full admin-input text-[9px]" required placeholder="URL">
                            <input type="file" id="p_image_file" class="mt-2 text-[10px]" accept="image/*">
                        </div>
                        <div>
                            <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Hover Image</label>
                            <input type="text" id="p_hover" class="w-full admin-input text-[9px]" placeholder="URL">
                            <input type="file" id="p_hover_file" class="mt-2 text-[10px]" accept="image/*">
                        </div>
                    </div>
                </div>

                <div class="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Identity Badge (e.g. NEW GEN)</label>
                        <input type="text" id="p_badge" class="w-full admin-input" placeholder="Optional Badge Protocol">
                    </div>
                    <div>
                        <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Size Protocols</label>
                        <div class="flex flex-wrap gap-4 mt-2">
                            ${['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', 'FREE'].map(size => `
                                <label class="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" name="p_sizes" value="${size}" class="hidden peer">
                                    <div class="px-4 py-2 border border-white/10 rounded-lg text-[10px] font-black text-white/20 peer-checked:bg-accent-cyan peer-checked:text-black peer-checked:border-accent-cyan transition-all">
                                        ${size}
                                    </div>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="col-span-1 md:col-span-2 pt-6 border-t border-white/5">
                    <div class="flex items-center justify-between mb-6">
                        <h4 class="text-[11px] font-black uppercase tracking-tighter text-accent-cyan">Color Pigment Variations</h4>
                        <button type="button" onclick="window.AdminApp.addVariantField()" class="text-[9px] font-black uppercase text-accent-cyan hover:text-white transition-colors">
                            + Add Variation
                        </button>
                    </div>
                    <div id="variantsContainer" class="space-y-4">
                        <!-- Variants will be injected here -->
                    </div>
                </div>

                <div class="col-span-1 md:col-span-2 pt-6 border-t border-white/5">
                    <div class="flex items-center justify-between mb-6">
                        <h4 class="text-[11px] font-black uppercase tracking-tighter text-accent-cyan">Size Measurement Protocol</h4>
                        <select id="p_sizeChart_mode" class="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[8px] font-bold uppercase text-white/40 outline-none" onchange="window.AdminApp.toggleSizeChartMode(this.value)">
                            <option value="image">Digital Image</option>
                            <option value="table">Manual Logic Table</option>
                        </select>
                    </div>
                    
                    <div id="sizeChartImageMode" class="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                        <div class="flex-1">
                            <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Visual Source (URL)</label>
                            <input type="text" id="p_sizeChart" class="w-full admin-input text-[9px]" placeholder="URL">
                        </div>
                        <div class="flex-1">
                            <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Protocol Upload</label>
                            <input type="file" id="p_sizeChart_file" class="text-[10px]" accept="image/*">
                        </div>
                    </div>

                    <div id="sizeChartTableMode" class="hidden space-y-4">
                        <p class="text-[8px] text-white/20 uppercase font-black tracking-widest italic">Sync: Comma-separated values matching selected sizes.</p>
                        <div id="measureRowsContainer" class="space-y-3"></div>
                        <button type="button" onclick="window.AdminApp.addMeasureRow()" class="px-4 py-2 border border-white/10 rounded-lg text-[9px] font-black uppercase text-accent-cyan hover:bg-white/5 transition-all">
                            + Add Data Row (e.g. Chest, Waist)
                        </button>
                    </div>
                </div>

                <div class="col-span-1 md:col-span-2 pt-6 border-t border-white/5">
                    <h4 class="text-[11px] font-black uppercase tracking-tighter text-accent-cyan mb-6">Visual Gallery Protocol</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Add to Gallery Archive</label>
                            <input type="file" id="p_gallery_files" class="w-full text-[10px]" multiple accept="image/*">
                            <div id="galleryPreview" class="flex flex-wrap gap-2 mt-4"></div>
                        </div>
                        <div>
                            <label class="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Note (Internal Protocol)</label>
                            <input type="text" class="w-full admin-input" placeholder="e.g. Extra Visuals for Catalog">
                        </div>
                    </div>
                </div>

                <div class="col-span-1 md:col-span-2 pt-6 border-t border-white/5">
                    <h4 class="text-[11px] font-black uppercase tracking-tighter text-accent-cyan mb-6">Technical Architecture</h4>
                    <textarea id="p_desc" class="w-full admin-input h-24 resize-none leading-relaxed text-[10px]" placeholder="Detailed product specifications..."></textarea>
                </div>

                <div class="col-span-1 md:col-span-2 flex flex-wrap items-center gap-6 md:gap-10 pt-8 border-t border-white/5">
                    <label class="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" id="p_featured" class="hidden peer">
                        <div class="w-5 h-5 border border-white/20 rounded-md peer-checked:bg-accent-cyan peer-checked:border-accent-cyan transition-all flex items-center justify-center">
                            <i class="fas fa-check text-[10px] text-black hidden peer-checked:block"></i>
                        </div>
                        <span class="text-[10px] font-bold uppercase tracking-widest text-white/40">Featured Asset</span>
                    </label>
                    <label class="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" id="p_sale" class="hidden peer">
                        <div class="w-5 h-5 border border-white/20 rounded-md peer-checked:bg-orange-500 peer-checked:border-orange-500 transition-all flex items-center justify-center">
                            <i class="fas fa-check text-[10px] text-black hidden peer-checked:block"></i>
                        </div>
                        <span class="text-[10px] font-bold uppercase tracking-widest text-white/40">Flash Sale Ready</span>
                    </label>
                </div>
            </div>
        `, [
            { id: 'saveProduct', text: 'Commit Changes', class: 'btn-primary', keepOpen: true, click: () => this.handleSaveProduct() }
        ]);

        // Initialize File Upload Logic
        this.initFileUpload('p_image_file', 'p_image');
        this.initFileUpload('p_hover_file', 'p_hover');
        this.initFileUpload('p_sizeChart_file', 'p_sizeChart');

        // Initialize Gallery Preview
        const galleryInput = document.getElementById('p_gallery_files');
        if (galleryInput) {
            galleryInput.onchange = (e) => {
                const files = Array.from(e.target.files);
                const preview = document.getElementById('galleryPreview');
                preview.innerHTML = '';
                this.p_gallery_files_data = files;

                files.forEach(file => {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        const img = document.createElement('img');
                        img.src = ev.target.result;
                        img.className = 'w-12 h-16 object-cover rounded-lg border border-white/10';
                        preview.appendChild(img);
                    };
                    reader.readAsDataURL(file);
                });
            };
        }

        // Exposed global helpers for dynamic UI
        window.AdminApp.addVariantField = () => this.addVariantField();
        window.AdminApp.removeVariantField = (btn) => btn.closest('.variant-entry').remove();
        window.AdminApp.toggleSizeChartMode = (mode) => this.toggleSizeChartMode(mode);
        window.AdminApp.addMeasureRow = (data) => this.addMeasureRow(data);
        window.AdminApp.removeMeasureRow = (btn) => btn.closest('.measure-row').remove();
    },

    toggleSizeChartMode(mode) {
        const imgMode = document.getElementById('sizeChartImageMode');
        const tabMode = document.getElementById('sizeChartTableMode');
        if (mode === 'image') {
            imgMode.classList.remove('hidden');
            tabMode.classList.add('hidden');
        } else {
            imgMode.classList.add('hidden');
            tabMode.classList.remove('hidden');
        }
    },

    addMeasureRow(data = null) {
        const container = document.getElementById('measureRowsContainer');
        const row = document.createElement('div');
        row.className = 'measure-row flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5';
        row.innerHTML = `
            <input type="text" class="m-label w-1/3 admin-input text-[9px]" placeholder="Label (e.g. Length)" value="${data ? data.label : ''}">
            <input type="text" class="m-values flex-1 admin-input text-[9px]" placeholder="Values (e.g. 28, 30, 32)" value="${data ? data.values : ''}">
            <button type="button" onclick="window.AdminApp.removeMeasureRow(this)" class="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                <i class="fas fa-times text-[10px]"></i>
            </button>
        `;
        container.appendChild(row);
    },

    addVariantField(data = null) {
        const container = document.getElementById('variantsContainer');
        const entry = document.createElement('div');
        entry.className = 'variant-entry flex items-end gap-4 p-4 bg-white/5 rounded-xl border border-white/5';

        entry.innerHTML = `
            <div class="flex-1">
                <label class="block text-[8px] font-black uppercase text-white/20 mb-2">Pigment Name</label>
                <input type="text" class="v-name w-full admin-input text-[10px]" value="${data ? data.colorName : ''}" placeholder="e.g. Onyx Black">
            </div>
            <div class="w-16">
                <label class="block text-[8px] font-black uppercase text-white/20 mb-2">Hex</label>
                <input type="color" class="v-hex w-full h-10 bg-transparent border-none cursor-pointer" value="${data ? (data.colorHex || '#000000') : '#000000'}">
            </div>
            <div class="flex-[2]">
                <label class="block text-[8px] font-black uppercase text-white/20 mb-2">Visual Source</label>
                <input type="text" class="v-img w-full admin-input text-[10px]" value="${data ? data.image : ''}" placeholder="URL">
                <input type="file" class="v-file mt-2 text-[8px]" accept="image/*">
            </div>
            <button type="button" onclick="window.AdminApp.removeVariantField(this)" class="w-10 h-10 flex items-center justify-center rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                <i class="fas fa-times text-[10px]"></i>
            </button>
        `;
        container.appendChild(entry);
    },

    initFileUpload(fileId, inputId) {
        const fileInput = document.getElementById(fileId);
        const statusEl = document.createElement('div');
        statusEl.className = 'text-[8px] text-accent-cyan uppercase mt-1 font-bold';
        fileInput.parentNode.appendChild(statusEl);

        if (fileInput) {
            fileInput.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;

                // Store file for later upload
                this[`${fileId}_data`] = file;
                statusEl.innerText = `Protocol Ready: ${file.name}`;
            };
        }
    },

    async openEditModal(id) {
        const product = await API.get(`/products/${id}`);
        if (!product) return;

        await this.openAddModal();
        const modalTitle = document.querySelector('#modalOverlay h2');
        if (modalTitle) modalTitle.innerText = `Edit Archive Asset #${id.substring(0, 8)}`;

        document.getElementById('p_name').value = product.name;
        document.getElementById('p_category').value = product.category;
        document.getElementById('p_stock').value = product.stock;
        document.getElementById('p_fabric').value = product.fabric || '';
        document.getElementById('p_price').value = product.price;
        document.getElementById('p_salePrice').value = product.salePrice || '';
        document.getElementById('p_image').value = product.mainImage;
        document.getElementById('p_hover').value = product.hoverImage || '';
        // Populate Size Chart
        if (product.sizeChart) {
            if (Array.isArray(product.sizeChart)) {
                // Table Mode
                document.getElementById('p_sizeChart_mode').value = 'table';
                this.toggleSizeChartMode('table');
                product.sizeChart.forEach(row => this.addMeasureRow(row));
            } else {
                // Image Mode
                document.getElementById('p_sizeChart_mode').value = 'image';
                this.toggleSizeChartMode('image');
                document.getElementById('p_sizeChart').value = product.sizeChart || '';
            }
        }

        document.getElementById('p_badge').value = product.badge || '';
        document.getElementById('p_desc').value = product.description || '';
        document.getElementById('p_featured').checked = product.featured || false;
        document.getElementById('p_sale').checked = product.isFlashSale || false;

        // Populate Sizes
        if (product.sizes) {
            const sizeCheckboxes = document.querySelectorAll('input[name="p_sizes"]');
            sizeCheckboxes.forEach(cb => {
                if (product.sizes.includes(cb.value)) cb.checked = true;
            });
        }

        // Populate Variants
        if (product.variants && product.variants.length > 0) {
            product.variants.forEach(v => this.addVariantField(v));
        }

        // Populate Gallery Preview
        if (product.gallery && product.gallery.length > 0) {
            const preview = document.getElementById('galleryPreview');
            product.gallery.forEach(url => {
                const img = document.createElement('img');
                img.src = url;
                img.className = 'w-12 h-16 object-cover rounded-lg border border-white/10 opacity-50';
                preview.appendChild(img);
            });
        }

        document.getElementById('saveProduct').onclick = async () => await this.handleSaveProduct(id);
    },

    async handleSaveProduct(id = null) {
        const name = document.getElementById('p_name').value;
        const price = document.getElementById('p_price').value;
        let mainImage = document.getElementById('p_image').value;
        let hoverImage = document.getElementById('p_hover').value;
        let sizeChart = document.getElementById('p_sizeChart').value;
        const sizeChartMode = document.getElementById('p_sizeChart_mode').value;

        // Perform deferred uploads
        try {
            if (this.p_image_file_data) {
                UI.toast('Syncing Main Visual...');
                const result = await API.upload(this.p_image_file_data);
                mainImage = result.url;
            }
            if (this.p_hover_file_data) {
                UI.toast('Syncing Hover Visual...');
                const result = await API.upload(this.p_hover_file_data);
                hoverImage = result.url;
            }
            if (sizeChartMode === 'image' && this.p_sizeChart_file_data) {
                UI.toast('Syncing Size Protocol...');
                const result = await API.upload(this.p_sizeChart_file_data);
                sizeChart = result.url;
            }
        } catch (err) {
            UI.toast('Visual Sync Failure', 'error');
            return;
        }

        // Handle Size Chart Table Data
        if (sizeChartMode === 'table') {
            sizeChart = Array.from(document.querySelectorAll('.measure-row')).map(row => ({
                label: row.querySelector('.m-label').value,
                values: row.querySelector('.m-values').value
            })).filter(r => r.label && r.values);
        }

        // Collect Sizes
        const selectedSizes = Array.from(document.querySelectorAll('input[name="p_sizes"]:checked')).map(cb => cb.value);

        // Collect and Upload Gallery
        let gallery = [];
        const existingGalleryImgs = Array.from(document.querySelectorAll('#galleryPreview img.opacity-50')).map(img => img.src);
        gallery = [...existingGalleryImgs];

        if (this.p_gallery_files_data) {
            UI.toast(`Syncing Gallery Archive (${this.p_gallery_files_data.length} Assets)...`);
            for (const file of this.p_gallery_files_data) {
                try {
                    const res = await API.upload(file);
                    gallery.push(res.url);
                } catch (e) { console.error('Gallery asset failed:', e); }
            }
        }

        // Collect and Upload Variants
        const variantEntries = Array.from(document.querySelectorAll('.variant-entry'));
        const variants = [];

        for (const entry of variantEntries) {
            const vName = entry.querySelector('.v-name').value;
            const vHex = entry.querySelector('.v-hex').value;
            let vImg = entry.querySelector('.v-img').value;
            const vFile = entry.querySelector('.v-file').files[0];

            if (vName) {
                if (vFile) {
                    try {
                        UI.toast(`Syncing Pigment: ${vName}...`);
                        const res = await API.upload(vFile);
                        vImg = res.url;
                    } catch (e) { console.error('Variant sync failed:', e); }
                }
                if (vImg) {
                    variants.push({ colorName: vName, colorHex: vHex, image: vImg });
                }
            }
        }

        if (!name || !price || !mainImage) {
            UI.toast('Protocol Error: Required Fields Missing', 'error');
            return;
        }

        const data = {
            name: name,
            category: document.getElementById('p_category').value,
            stock: parseInt(document.getElementById('p_stock').value) || 0,
            price: parseInt(price) || 0,
            salePrice: parseInt(document.getElementById('p_salePrice').value) || 0,
            mainImage: mainImage,
            hoverImage: hoverImage,
            sizeChart: sizeChart,
            fabric: document.getElementById('p_fabric').value || 'Hybrid Synthetic',
            badge: document.getElementById('p_badge').value,
            sizes: selectedSizes,
            variants: variants,
            gallery: gallery,
            description: document.getElementById('p_desc').value,
            featured: document.getElementById('p_featured').checked,
            isFlashSale: document.getElementById('p_sale').checked,
            rating: 4.8
        };

        try {
            if (id) {
                await API.put(`/products/${id}`, data);
                UI.toast('Asset Successfully Updated');
            } else {
                await API.post('/products', data);
                UI.toast('New Asset Successfully Deployed');
            }
            UI.closeModal();
            window.AdminApp.switchSection('products');
        } catch (err) {
            UI.toast(err.message, 'error');
        }
    },

    handleDelete(id) {
        UI.confirm('Are you certain you want to permanently erase this asset from the database? This action is irreversible.', async () => {
            try {
                await API.delete(`/products/${id}`);
                UI.toast('Asset Permanently Erased', 'error');
                window.AdminApp.switchSection('products');
            } catch (err) {
                UI.toast(err.message, 'error');
            }
        });
    }
};
