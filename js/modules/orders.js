import { API } from '../utils/api.js';
import { UI } from '../components/ui.js';

export const OrdersModule = {
    async render() {
        const orders = await API.get('/orders');

        return `
            <div class="space-y-8 animate-fade-in">
                <!-- Header Stats -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    ${this.renderMiniStat('Active Sessions', orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length, 'fa-clock', 'text-accent-cyan')}
                    ${this.renderMiniStat('Total Protocol Volume', `RS.${orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString()}`, 'fa-wallet', 'text-green-400')}
                    ${this.renderMiniStat('Completed Fulfilment', orders.filter(o => o.status === 'Delivered').length, 'fa-check-circle', 'text-blue-400')}
                    ${this.renderMiniStat('Protocol Rejections', orders.filter(o => o.status === 'Cancelled').length, 'fa-times-circle', 'text-red-400')}
                </div>

                <!-- Orders Table -->
                <div class="glass-panel rounded-[2rem] overflow-hidden">
                    <div class="table-container">
                        <table class="w-full admin-table">
                            <thead>
                                <tr>
                                    <th>Protocol ID</th>
                                    <th>Consumer</th>
                                    <th>Node (City)</th>
                                    <th>Allocation</th>
                                    <th>State</th>
                                    <th class="text-right">Operations</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.renderOrdersTable(orders)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    renderMiniStat(label, value, icon, colorClass) {
        return `
            <div class="glass-panel p-6 rounded-2xl flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                    <i class="fas ${icon} ${colorClass} text-lg"></i>
                </div>
                <div>
                    <div class="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">${label}</div>
                    <div class="text-lg font-black text-white italic">${value}</div>
                </div>
            </div>
        `;
    },

    renderOrdersTable(orders) {
        if (orders.length === 0) {
            return `<tr><td colspan="6" class="text-center py-20 text-white/20 text-[10px] uppercase font-bold tracking-widest">No Active Protocol Requests</td></tr>`;
        }

        return orders.map(o => `
            <tr class="hover:bg-white/[0.01] transition-colors">
                <td class="font-bold text-[10px] text-accent-cyan tracking-widest">#${o.orderId || o._id.substring(0, 8)}</td>
                <td>
                    <div class="text-[11px] font-bold text-white uppercase">${o.customerInfo?.name || 'Anonymous'}</div>
                    <div class="text-[9px] text-white/20 uppercase">${o.customerInfo?.email || 'Guest Consumer'}</div>
                </td>
                <td><span class="text-[10px] font-bold text-white/40 uppercase">${o.shippingAddress?.city || 'Remote'}</span></td>
                <td><span class="text-[11px] font-black text-white">RS.${o.totalAmount || 0}</span></td>
                <td>
                    <span class="status-badge ${this.getStatusClass(o.status)}">${o.status}</span>
                </td>
                <td class="text-right flex justify-end gap-2">
                    <button onclick="window.AdminApp.viewOrder('${o._id}')" class="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                        Inspect
                    </button>
                    <button onclick="window.AdminApp.deleteOrder('${o._id}')" class="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all">
                        Delete
                    </button>
                </td>
            </tr>
        `).join('');
    },

    getStatusClass(status) {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            case 'confirmed': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
            case 'shipped': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'delivered': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-white/5 text-white/40 border-white/10';
        }
    },

    async viewOrder(id) {
        const order = await API.get(`/orders/${id}`);
        if (!order) return;

        UI.modal(`Protocol Inspection #${(order.orderId || id).substring(0, 12)}`, `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-10 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar leading-relaxed">
                <div class="space-y-6">
                    <section>
                        <h4 class="text-[11px] font-black uppercase tracking-tighter text-accent-cyan mb-4">Consumer Identity</h4>
                        <div class="glass-panel p-5 rounded-2xl space-y-3">
                            <div class="flex justify-between"><span class="text-[9px] font-bold text-white/20 uppercase">Name</span><span class="text-[10px] font-bold text-white uppercase">${order.customerInfo?.name || 'N/A'}</span></div>
                            <div class="flex justify-between"><span class="text-[9px] font-bold text-white/20 uppercase">Digital Address</span><span class="text-[10px] font-bold text-white uppercase">${order.customerInfo?.email || 'N/A'}</span></div>
                            <div class="flex justify-between"><span class="text-[9px] font-bold text-white/20 uppercase">Terminal</span><span class="text-[10px] font-bold text-white uppercase">${order.customerInfo?.phone || 'N/A'}</span></div>
                            <div class="flex justify-between"><span class="text-[9px] font-bold text-white/20 uppercase">Payment</span><span class="text-[10px] font-bold text-white uppercase">${order.paymentMethod || 'N/A'}</span></div>
                        </div>
                    </section>
                    
                    <section>
                        <h4 class="text-[11px] font-black uppercase tracking-tighter text-accent-cyan mb-4">Fulfilment Node</h4>
                        <div class="glass-panel p-5 rounded-2xl">
                            <p class="text-[11px] font-bold text-white/60 uppercase leading-loose">${order.shippingAddress?.address || ''}, ${order.shippingAddress?.city || ''}${order.shippingAddress?.postalCode ? ', ' + order.shippingAddress.postalCode : ''}</p>
                        </div>
                    </section>
                </div>

                <div class="space-y-6">
                    <section>
                        <h4 class="text-[11px] font-black uppercase tracking-tighter text-accent-cyan mb-4">Asset Allocation</h4>
                        <div class="glass-panel p-5 rounded-2xl space-y-4">
                            ${order.orderItems.map(item => `
                                <div class="flex items-center gap-4">
                                    <div class="w-10 h-10 rounded-lg bg-white/5 border border-white/10 overflow-hidden shrink-0">
                                        <img src="${item.image}" class="w-full h-full object-cover">
                                    </div>
                                    <div class="flex-1">
                                        <div class="text-[10px] font-black text-white uppercase">${item.name}</div>
                                        <div class="text-[8px] font-bold text-white/40 uppercase">
                                            QTY: ${item.qty} × RS.${item.price}
                                            ${item.size ? ` • Size: ${item.size}` : ''}
                                            ${item.color ? ` • Color: ${item.color}` : ''}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                            <div class="pt-4 border-t border-white/5 flex justify-between">
                                <span class="text-[10px] font-black text-accent-cyan uppercase italic">Total Value</span>
                                 <span class="text-[11px] font-black text-white italic">RS.${order.totalAmount || 0}</span>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h4 class="text-[11px] font-black uppercase tracking-tighter text-accent-cyan mb-4">Protocol State Control</h4>
                        <div class="grid grid-cols-2 gap-4">
                            ${['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map(status => `
                                <button onclick="window.AdminApp.updateOrderStatus('${id}', '${status}')" 
                                    class="py-3 rounded-xl border ${order.status === status ? 'bg-accent-cyan text-black border-accent-cyan font-black' : 'bg-white/5 border-white/10 text-white/40 font-bold'} text-[8px] uppercase tracking-widest hover:border-accent-cyan/50 transition-all">
                                    ${status}
                                </button>
                            `).join('')}
                        </div>
                    </section>
                </div>
            </div>
        `);
    },

    async updateStatus(id, newStatus) {
        try {
            await API.put(`/orders/${id}/status`, { status: newStatus });
            UI.toast(`Protocol State Synchronized: ${newStatus}`);
            UI.closeModal();
            window.AdminApp.switchSection('orders');
        } catch (err) {
            UI.toast(err.message, 'error');
        }
    },

    async handleDelete(id) {
        try {
            await API.delete(`/orders/${id}`);
            UI.toast('Order Deleted Successfully');
            window.AdminApp.switchSection('orders');
        } catch (err) {
            UI.toast(err.message, 'error');
        }
    }
};
