import { API } from '../utils/api.js';
import { UI } from '../components/ui.js';

export const ReviewsModule = {
    async render() {
        const data = await API.get('/reviews');
        const reviews = data.reviews;
        const settings = data.settings;

        return `
            <div class="space-y-10 animate-fade-in">
                <!-- Social Pulse Configuration -->
                <div class="glass-panel p-10 rounded-[2.5rem]">
                    <h2 class="text-2xl font-black uppercase tracking-tighter mb-10">Product Review Protocols</h2>
                    <div class="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <div>
                            <p class="text-[11px] font-black text-white uppercase mb-1">Global Review Visibility</p>
                            <p class="text-[9px] text-white/20 uppercase tracking-widest">Toggle all product reviews across the platform</p>
                        </div>
                        <label class="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" id="r_enabled" class="hidden peer" ${settings.reviewsEnabled ? 'checked' : ''}>
                            <div class="w-12 h-7 bg-white/10 rounded-full relative transition-all peer-checked:bg-accent-cyan">
                                <div class="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-all peer-checked:left-6"></div>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Review Moderation -->
                <div class="glass-panel p-10 rounded-[2.5rem]">
                    <h2 class="text-2xl font-black uppercase tracking-tighter mb-10">Incoming Transmissions (Moderation)</h2>
                    
                    <div class="space-y-6">
                        ${reviews.length === 0 ? `
                            <div class="text-center py-20 text-white/20 text-[10px] uppercase font-bold tracking-widest">No review transmissions detected.</div>
                        ` : reviews.map(r => this.renderReviewItem(r)).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    renderReviewItem(r) {
        return `
            <div class="glass-card p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row gap-8 group">
                <div class="flex-1">
                    <div class="flex items-center gap-4 mb-4">
                        <div class="flex text-accent-cyan text-[10px]">
                            ${Array(5).fill(0).map((_, i) => `<i class="${i < r.rating ? 'fas' : 'far'} fa-star"></i>`).join('')}
                        </div>
                        <span class="text-[10px] font-black text-white px-3 py-1 bg-white/5 rounded-full uppercase">${r.name}</span>
                        <span class="text-[9px] text-white/20 uppercase tracking-widest">${new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p class="text-[11px] text-white/60 leading-relaxed italic">"${r.comment}"</p>
                </div>
                
                <div class="flex items-center gap-4">
                    <button onclick="window.AdminApp.toggleReviewApproval('${r._id}', ${!r.approved})" class="px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${r.approved ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}">
                        ${r.approved ? 'Revoke Protocol' : 'Authorize Display'}
                    </button>
                    <button onclick="window.AdminApp.deleteProductReview('${r._id}')" class="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-white/20 hover:text-red-500 transition-all">
                        <i class="fas fa-trash-alt text-[10px]"></i>
                    </button>
                </div>
            </div>
        `;
    },

    async init() {
        const toggleCheck = document.getElementById('r_enabled');
        if (toggleCheck) {
            toggleCheck.onchange = async () => {
                try {
                    await API.request('/reviews/toggle', { method: 'PATCH' });
                    UI.toast('Review Protocol State Synchronized');
                } catch (err) {
                    UI.toast(err.message, 'error');
                }
            };
        }
    },

    async toggleApproval(id, approved) {
        try {
            await API.put(`/reviews/${id}`, { approved });
            UI.toast(approved ? 'Transmission Authorized' : 'Protocol Revoked');
            window.AdminApp.switchSection('reviews');
        } catch (err) {
            UI.toast(err.message, 'error');
        }
    },

    async deleteReview(id) {
        try {
            await API.delete(`/reviews/${id}`);
            UI.toast('Transmission Erased');
            window.AdminApp.switchSection('reviews');
        } catch (err) {
            UI.toast(err.message, 'error');
        }
    }
};
