import { API } from '../utils/api.js';

export const DashboardModule = {
    async render() {
        const stats = await API.get('/dashboard/overview');

        // Safe fallbacks in case backend returns null values
        const totalRevenue = stats.totalRevenue || 0;
        const totalOrders = stats.totalOrders || 0;
        const totalProducts = stats.totalProducts || 0;
        const activeFlashSale = stats.activeFlashSale || false;
        const recentOrders = stats.recentOrders || [];

        return `
            <div class="space-y-10 animate-fade-in">
                <!-- Top Metrics -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    ${this.renderStatCard('Total Revenue', `RS.${totalRevenue.toLocaleString()}`, 'fa-chart-line', 'text-accent-cyan')}
                    ${this.renderStatCard('Protocol Orders', totalOrders, 'fa-shopping-bag', 'text-white')}
                    ${this.renderStatCard('Active Inventory', totalProducts, 'fa-box', 'text-white')}
                    ${this.renderStatCard('Sale Protocol', activeFlashSale ? 'ACTIVE' : 'OFF', 'fa-bolt', activeFlashSale ? 'text-accent-cyan' : 'text-white/20')}
                </div>

                <!-- Main Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Recent Activity -->
                    <div class="lg:col-span-2 glass-panel rounded-[2.5rem] p-8">
                        <div class="flex justify-between items-center mb-8">
                            <h3 class="text-[11px] font-black uppercase tracking-[0.4em] text-white/40 italic">Recent Protocol Transmissions</h3>
                            <button onclick="window.AdminApp.switchSection('orders')" class="text-[9px] font-bold text-accent-cyan uppercase tracking-widest hover:tracking-[0.2em] transition-all">View Full Manifest</button>
                        </div>
                        <div class="table-container">
                            <table class="w-full text-left">
                                <thead>
                                    <tr class="text-[9px] font-black uppercase tracking-widest text-white/20 border-b border-white/5">
                                        <th class="pb-4">Consumer</th>
                                        <th class="pb-4">Status</th>
                                        <th class="pb-4 text-right">Value</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-white/5">
                                    ${recentOrders.map(o => `
                                        <tr>
                                            <td class="py-5">
                                                <div class="text-[11px] font-black text-white uppercase">${o.shippingAddress?.fullName || 'Guest'}</div>
                                                <div class="text-[9px] text-white/20 uppercase">${new Date(o.createdAt).toLocaleDateString()}</div>
                                            </td>
                                            <td class="py-5 text-[9px] font-bold uppercase tracking-widest text-accent-cyan">${o.status}</td>
                                            <td class="py-5 text-right text-[11px] font-black italic">RS.${o.totalAmount || 0}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- System Pulse -->
                    <div class="glass-panel rounded-[2.5rem] p-8 flex flex-col justify-between overflow-hidden relative">
                        <div>
                            <h3 class="text-[11px] font-black uppercase tracking-[0.4em] text-white/40 mb-8 italic">System Heartbeat</h3>
                            <div class="space-y-6">
                                ${this.renderPulseItem('API Connectivity', 'Operational', 'bg-accent-cyan')}
                                ${this.renderPulseItem('Database Protocol', 'Synchronized', 'bg-accent-cyan')}
                                ${this.renderPulseItem('Payment Gateway', 'Secure', 'bg-accent-cyan')}
                            </div>
                        </div>
                        
                        <div class="mt-12 pt-8 border-t border-white/5">
                            <div class="text-[9px] font-black text-white/20 uppercase tracking-widest mb-4">Storage Allocation</div>
                            <div class="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div class="h-full bg-accent-cyan w-2/3 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                            </div>
                            <div class="flex justify-between mt-3 text-[8px] font-bold uppercase text-white/40">
                                <span>64.2 GB Utilized</span>
                                <span>128 GB Total</span>
                            </div>
                        </div>

                        <!-- Pulse Animation Decor -->
                        <div class="absolute -right-20 -bottom-20 w-64 h-64 bg-accent-cyan/5 rounded-full blur-[80px]"></div>
                    </div>
                </div>
            </div>
        `;
    },

    renderStatCard(label, value, icon, colorClass) {
        return `
            <div class="glass-panel p-8 rounded-[2rem] group hover:border-accent-cyan/30 transition-all duration-500 relative overflow-hidden">
                <div class="flex justify-between items-start relative z-10">
                    <div>
                        <div class="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-3 group-hover:text-accent-cyan/50 transition-colors">${label}</div>
                        <div class="text-3xl font-black text-white italic tracking-tighter">${value}</div>
                    </div>
                    <div class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-accent-cyan group-hover:border-accent-cyan transition-all duration-500">
                        <i class="fas ${icon} ${colorClass} text-xs group-hover:text-black"></i>
                    </div>
                </div>
                <!-- Mini Chart Decor -->
                <div class="mt-6 flex items-end gap-1 h-8">
                    ${[30, 70, 45, 90, 60, 80, 40].map(h => `<div class="w-full bg-white/5 rounded-t-sm group-hover:bg-accent-cyan/10 transition-all duration-700" style="height: ${h}%"></div>`).join('')}
                </div>
            </div>
        `;
    },

    renderPulseItem(label, status, dotColor) {
        return `
            <div class="flex justify-between items-center group">
                <span class="text-[10px] font-bold text-white/60 uppercase tracking-widest">${label}</span>
                <div class="flex items-center gap-3">
                    <span class="text-[9px] font-black text-white uppercase italic">${status}</span>
                    <div class="w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div>
                </div>
            </div>
        `;
    }
};
