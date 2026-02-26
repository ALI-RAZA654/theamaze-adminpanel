// THE AMAZE - UI Component Library

export const UI = {
    toast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');

        const colors = {
            success: 'bg-green-500/10 text-green-500 border-green-500/20',
            error: 'bg-red-500/10 text-red-500 border-red-500/20',
            info: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20'
        };

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };

        toast.className = `flex items-center gap-4 px-6 py-4 rounded-2xl border ${colors[type]} glass-panel animate-slide-in min-w-[300px]`;
        toast.innerHTML = `
            <i class="fas ${icons[type]} text-lg"></i>
            <span class="text-[10px] font-bold uppercase tracking-widest">${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    modal(title, content, actions = []) {
        const overlay = document.getElementById('modalOverlay');
        const container = document.getElementById('modalContent');

        overlay.classList.remove('hidden');
        overlay.classList.add('flex');

        container.innerHTML = `
            <div class="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
                <h2 class="text-2xl font-black uppercase tracking-tighter">${title}</h2>
                <button id="closeModal" class="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="mb-10">
                ${content}
            </div>
            <div class="flex justify-end gap-4">
                ${actions.map(btn => `
                    <button id="${btn.id}" class="px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${btn.class || 'bg-white/5 text-white/40 hover:bg-white/10'}">
                        ${btn.text}
                    </button>
                `).join('')}
            </div>
        `;

        document.getElementById('closeModal').onclick = () => {
            overlay.classList.add('hidden');
            overlay.classList.remove('flex');
        };

        actions.forEach(btn => {
            if (btn.click) {
                document.getElementById(btn.id).onclick = async () => {
                    // If keepOpen is true, just run and don't auto-close
                    if (btn.keepOpen) {
                        await btn.click();
                        return;
                    }
                    // For async handlers: run first, THEN close
                    // This prevents DOM from being destroyed before async reads fields
                    await btn.click();
                    // Only close if click didn't already close (e.g. on validation error)
                    // The click handler itself calls UI.closeModal() on success
                };
            }
        });
    },

    closeModal() {
        const overlay = document.getElementById('modalOverlay');
        overlay.classList.add('hidden');
        overlay.classList.remove('flex');
    },

    confirm(message, onConfirm) {
        this.modal('Confirm Protocol', `
            <p class="text-white/60 text-sm leading-relaxed">${message}</p>
        `, [
            { id: 'confirmCancel', text: 'Abort' },
            { id: 'confirmAction', text: 'Proceed', class: 'btn-primary', keepOpen: true, click: async () => { await onConfirm(); this.closeModal(); } }
        ]);
    }
};
