// THE AMAZE - Admin Application Core

import { AdminAuth } from './auth.js';
import { AdminState, KEYS } from './data.js';
import { UI } from './components/ui.js';

// Import Modules
import { DashboardModule } from './modules/dashboard.js';
import { ProductsModule } from './modules/products.js';
import { SalesModule } from './modules/sales.js';
import { OrdersModule } from './modules/orders.js';
import { HeroModule } from './modules/hero.js';
import { MarqueeModule, PaymentsModule } from './modules/communication.js';
import { ReviewsModule } from './modules/reviews.js';
import { FooterModule } from './modules/footer.js';
import { LookbookModule } from './modules/lookbook.js';
import { CategoriesModule } from './modules/categories.js';
import { MuseModule } from './modules/muse.js';
import { ContactModule } from './modules/contact.js';
import { TrustedModule } from './modules/trusted.js';
import { AboutModule } from './modules/about.js';
import { SubscribersModule } from './modules/subscribers.js';

class AdminApp {
    constructor() {
        this.modules = {
            dashboard: DashboardModule,
            products: ProductsModule,
            sales: SalesModule,
            orders: OrdersModule,
            hero: HeroModule,
            marquee: MarqueeModule,
            payments: PaymentsModule,
            reviews: ReviewsModule,
            footer: FooterModule,
            lookbook: LookbookModule,
            categories: CategoriesModule,
            muse: MuseModule,
            contact: ContactModule,
            trusted: TrustedModule,
            about: AboutModule,
            subscribers: SubscribersModule,
            settings: {
                render: () => `
                <div class="space-y-8 animate-fade-in max-w-4xl">
                    <div class="mb-2">
                        <h2 class="text-[11px] font-black uppercase tracking-[0.4em] text-white/40 italic">System Configuration Protocol</h2>
                    </div>

                    <!-- Site Settings -->
                    <div class="glass-panel rounded-[2.5rem] p-8 space-y-6">
                        <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-accent-cyan border-b border-white/5 pb-4">Site Identity</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2 block">Site Name</label>
                                <input id="settings-siteName" type="text" value="THE AMAZE" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[11px] font-bold uppercase tracking-wider focus:outline-none focus:border-accent-cyan/50 transition-colors" />
                            </div>
                            <div>
                                <label class="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2 block">Tagline</label>
                                <input id="settings-tagline" type="text" value="Luxury Redefined" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[11px] font-bold uppercase tracking-wider focus:outline-none focus:border-accent-cyan/50 transition-colors" />
                            </div>
                            <div>
                                <label class="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2 block">Contact Email</label>
                                <input id="settings-email" type="email" value="admin@theamaze.com" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[11px] font-bold uppercase tracking-wider focus:outline-none focus:border-accent-cyan/50 transition-colors" />
                            </div>
                            <div>
                                <label class="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2 block">Contact Phone</label>
                                <input id="settings-phone" type="text" value="+92 300 0000000" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[11px] font-bold uppercase tracking-wider focus:outline-none focus:border-accent-cyan/50 transition-colors" />
                            </div>
                        </div>
                    </div>

                    <!-- Social Links -->
                    <div class="glass-panel rounded-[2.5rem] p-8 space-y-6">
                        <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-accent-cyan border-b border-white/5 pb-4">Social Protocol Links</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2 block"><i class="fab fa-instagram mr-2"></i>Instagram</label>
                                <input id="settings-instagram" type="text" placeholder="https://instagram.com/theamaze" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[11px] font-bold uppercase tracking-wider focus:outline-none focus:border-accent-cyan/50 transition-colors placeholder:text-white/20" />
                            </div>
                            <div>
                                <label class="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2 block"><i class="fab fa-facebook mr-2"></i>Facebook</label>
                                <input id="settings-facebook" type="text" placeholder="https://facebook.com/theamaze" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[11px] font-bold uppercase tracking-wider focus:outline-none focus:border-accent-cyan/50 transition-colors placeholder:text-white/20" />
                            </div>
                            <div>
                                <label class="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2 block"><i class="fab fa-tiktok mr-2"></i>TikTok</label>
                                <input id="settings-tiktok" type="text" placeholder="https://tiktok.com/@theamaze" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[11px] font-bold uppercase tracking-wider focus:outline-none focus:border-accent-cyan/50 transition-colors placeholder:text-white/20" />
                            </div>
                            <div>
                                <label class="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2 block"><i class="fab fa-whatsapp mr-2"></i>WhatsApp</label>
                                <input id="settings-whatsapp" type="text" placeholder="+92 300 0000000" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[11px] font-bold uppercase tracking-wider focus:outline-none focus:border-accent-cyan/50 transition-colors placeholder:text-white/20" />
                            </div>
                        </div>
                    </div>

                    <!-- Store Config -->
                    <div class="glass-panel rounded-[2.5rem] p-8 space-y-6">
                        <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-accent-cyan border-b border-white/5 pb-4">Store Configuration</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2 block">Currency</label>
                                <select id="settings-currency" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[11px] font-bold uppercase tracking-wider focus:outline-none focus:border-accent-cyan/50 transition-colors">
                                    <option value="PKR" selected>PKR - Pakistani Rupee</option>
                                    <option value="USD">USD - US Dollar</option>
                                    <option value="AED">AED - UAE Dirham</option>
                                </select>
                            </div>
                            <div>
                                <label class="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2 block">Shipping Fee (RS)</label>
                                <input id="settings-shipping" type="number" value="250" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[11px] font-bold uppercase tracking-wider focus:outline-none focus:border-accent-cyan/50 transition-colors" />
                            </div>
                            <div>
                                <label class="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2 block">Free Shipping Above (RS)</label>
                                <input id="settings-freeShipping" type="number" value="5000" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[11px] font-bold uppercase tracking-wider focus:outline-none focus:border-accent-cyan/50 transition-colors" />
                            </div>
                            <div>
                                <label class="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2 block">Max Items Per Order</label>
                                <input id="settings-maxItems" type="number" value="10" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[11px] font-bold uppercase tracking-wider focus:outline-none focus:border-accent-cyan/50 transition-colors" />
                            </div>
                        </div>
                    </div>

                    <!-- Account Security -->
                    <div class="glass-panel rounded-[2.5rem] p-8 space-y-6">
                        <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-accent-cyan border-b border-white/5 pb-4">Admin Account Security</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2 block">New Password</label>
                                <input id="settings-newPass" type="password" placeholder="Enter new password" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[11px] font-bold uppercase tracking-wider focus:outline-none focus:border-accent-cyan/50 transition-colors placeholder:text-white/20" />
                            </div>
                            <div>
                                <label class="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2 block">Confirm Password</label>
                                <input id="settings-confirmPass" type="password" placeholder="Confirm new password" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-[11px] font-bold uppercase tracking-wider focus:outline-none focus:border-accent-cyan/50 transition-colors placeholder:text-white/20" />
                            </div>
                        </div>
                    </div>

                    <!-- Save Button -->
                    <div class="flex justify-end">
                        <button onclick="window._saveSettings()" class="px-10 py-4 bg-accent-cyan text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-white transition-all duration-300 hover:tracking-[0.4em]">
                            <i class="fas fa-save mr-2"></i>Save Configuration
                        </button>
                    </div>
                </div>
                `,
                init: () => {
                    window._saveSettings = () => {
                        // In future can POST to API here
                        const { UI } = window.__adminUI || {};
                        const toast = document.createElement('div');
                        toast.className = 'fixed bottom-8 right-8 z-[9999] px-6 py-4 bg-accent-cyan text-black text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-2xl animate-fade-in';
                        toast.innerText = 'Configuration Saved';
                        document.body.appendChild(toast);
                        setTimeout(() => toast.remove(), 3000);
                    };
                }
            }
        };

        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        AdminState.init();
        this.bindEvents();
        this.checkAuth();

        // Expose app to window for inline onclick handlers (simpler for this architecture)
        window.AdminApp = this;
    }

    bindEvents() {
        // Auth Events
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('logoutBtn').addEventListener('click', () => {
            AdminAuth.logout();
        });

        // Navigation
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.switchSection(section);

                // Close sidebar on mobile after navigation
                document.body.classList.remove('sidebar-active');
            });
        });

        // Global Search
        document.getElementById('globalSearch').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Mobile Sidebar Toggles
        const mobileBtn = document.getElementById('mobileMenuBtn');
        const closeBtn = document.getElementById('closeSidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const body = document.body;

        const toggleSidebar = () => {
            body.classList.toggle('sidebar-active');
        };

        if (mobileBtn) mobileBtn.addEventListener('click', toggleSidebar);
        if (closeBtn) closeBtn.addEventListener('click', toggleSidebar);
        if (overlay) overlay.addEventListener('click', toggleSidebar);
    }

    checkAuth() {
        if (AdminAuth.isAuthenticated()) {
            this.showDashboard();
        } else {
            this.showLogin();
        }
    }

    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const pass = document.getElementById('loginPassword').value;
        const error = document.getElementById('loginError');

        const result = await AdminAuth.login(email, pass);

        if (result.success) {
            this.showDashboard();
            UI.toast('Secure Session Initialized');
        } else {
            error.innerText = result.message;
            error.classList.remove('hidden');
            setTimeout(() => error.classList.add('hidden'), 3000);
        }
    }

    showLogin() {
        document.getElementById('loginPage').classList.remove('hidden');
        document.getElementById('dashboardApp').classList.add('opacity-0', 'pointer-events-none');
    }

    showDashboard() {
        document.getElementById('loginPage').classList.add('hidden');
        const dash = document.getElementById('dashboardApp');
        dash.classList.remove('opacity-0', 'pointer-events-none');
        this.switchSection('dashboard');
    }

    async switchSection(sectionId) {
        this.currentSection = sectionId;
        const container = document.getElementById('contentArea');
        const title = document.getElementById('sectionTitle');
        const loader = document.getElementById('loader');

        // Update Sidebar UI
        document.querySelectorAll('.sidebar-link').forEach(link => {
            if (link.dataset.section === sectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Update Title
        title.innerText = sectionId.charAt(0).toUpperCase() + sectionId.slice(1) + ' Protocol';

        // Show Loader
        container.innerHTML = `
            <div class="h-full flex items-center justify-center">
                <div class="loader"></div>
            </div>
        `;

        // Render Module
        const module = this.modules[sectionId];
        if (module) {
            try {
                const content = await module.render();
                container.innerHTML = content;
                if (module.init) await module.init();
            } catch (error) {
                container.innerHTML = `
                    <div class="p-20 text-center text-red-500/40 uppercase font-black tracking-widest animate-fade-in">
                        Data Sync Failure: ${error.message}
                    </div>
                `;
            }
        }

        // Proactive scroll to top
        container.scrollTop = 0;
    }

    // Module Methods (Exposed for window.AdminApp)
    editProduct(id) { ProductsModule.openEditModal(id); }
    deleteProduct(id) { ProductsModule.handleDelete(id); }
    viewOrder(id) { OrdersModule.viewOrder(id); }
    updateOrderStatus(id, status) {
        OrdersModule.updateStatus(id, status);
    }
    deleteOrder(id) {
        UI.confirm('Are you sure you want to permanently delete this order?', () => {
            OrdersModule.handleDelete(id);
        });
    }
    toggleReviewApproval(id, approved) {
        ReviewsModule.toggleApproval(id, approved);
    }
    deleteProductReview(id) {
        UI.confirm('Are you sure you want to permanently erase this review transmission?', () => {
            ReviewsModule.deleteReview(id);
        });
    }
    deleteMuse(id) {
        UI.confirm('Are you certain you want to erase this Muse identity from the archive?', () => {
            MuseModule.handleDelete ? MuseModule.handleDelete(id) : console.error('Delete not implemented');
        });
    }
    updateTrustStat(id) { TrustedModule.updateStat(id); }
    deleteSubscriber(id) {
        UI.confirm('Are you sure you want to permanently erase this potential elite subscriber identity?', () => {
            SubscribersModule.deleteSubscriber(id);
        });
    }

    async handleSearch(query) {
        if (this.currentSection === 'products') {
            try {
                const allProducts = await API.get('/products');
                const filtered = allProducts.filter(p =>
                    p.name.toLowerCase().includes(query.toLowerCase()) ||
                    p.category.toLowerCase().includes(query.toLowerCase())
                );
                document.getElementById('productsTableBody').innerHTML = ProductsModule.renderProductsTable(filtered);
            } catch (err) {
                console.error('Search failed:', err);
            }
        }
    }
}

// Global Initialization
document.addEventListener('DOMContentLoaded', () => {
    new AdminApp();
});
