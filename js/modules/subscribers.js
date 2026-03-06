import { API } from '../utils/api.js';
import { UI } from '../components/ui.js';

export const SubscribersModule = {
    async render() {
        let subscribers = [];
        try {
            subscribers = await API.get('/subscribers');
            if (!Array.isArray(subscribers)) {
                console.error('Subscribers Data Corrupted:', subscribers);
                subscribers = [];
            }
        } catch (err) {
            console.error('Subscribers Sync Failure:', err);
            throw err;
        }

        return `
            <div class="space-y-10 animate-fade-in">
                <div class="glass-panel p-10 rounded-[2.5rem]">
                    <div class="flex justify-between items-center mb-10">
                        <h2 class="text-2xl font-black uppercase tracking-tighter">Elite Protocol Manifest (Subscribers)</h2>
                        <span class="px-5 py-2 bg-accent-cyan/10 text-accent-cyan rounded-full text-[10px] font-black uppercase tracking-widest border border-accent-cyan/20">
                            ${subscribers.length} Digital Identities
                        </span>
                    </div>
                    
                    <div class="table-container overflow-hidden rounded-3xl border border-white/5 bg-white/[0.01]">
                        <table class="w-full text-left">
                            <thead>
                                <tr class="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 border-b border-white/5">
                                    <th class="p-8">Email Address</th>
                                    <th class="p-8">Registration Source</th>
                                    <th class="p-8">Sync Date</th>
                                    <th class="p-8 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-white/5">
                                ${subscribers.length === 0 ? `
                                    <tr>
                                        <td colspan="4" class="p-20 text-center text-white/20 text-[10px] uppercase font-bold tracking-widest">
                                            No subscribers detected in the protocol.
                                        </td>
                                    </tr>
                                ` : subscribers.map(s => `
                                    <tr class="group hover:bg-white/[0.02] transition-colors">
                                        <td class="p-8">
                                            <div class="text-xs font-bold text-white uppercase tracking-wider">${s.email}</div>
                                        </td>
                                        <td class="p-8">
                                            <span class="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-bold text-white/40 uppercase tracking-widest">
                                                ${s.source || 'Direct Protocol'}
                                            </span>
                                        </td>
                                        <td class="p-8">
                                            <div class="text-[10px] text-white/40 uppercase font-black tracking-widest">
                                                ${new Date(s.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </div>
                                        </td>
                                        <td class="p-8 text-right">
                                            <button onclick="window.AdminApp.deleteSubscriber('${s._id}')" class="w-10 h-10 flex items-center justify-center bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all">
                                                <i class="fas fa-trash-alt text-[10px]"></i>
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    async deleteSubscriber(id) {
        try {
            await API.delete(`/subscribers/${id}`);
            UI.toast('Subscriber Identity Erased');
            window.AdminApp.switchSection('subscribers');
        } catch (err) {
            UI.toast(err.message, 'error');
        }
    }
};
