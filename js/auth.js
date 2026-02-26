// THE AMAZE - Admin Auth Protocol

export class AdminAuth {
    static SESSION_KEY = 'the_amaze_admin_session';
    static API_URL = 'http://127.0.0.1:5000/api/auth'; // Adjust to your backend URL

    static async login(email, password) {
        try {
            const response = await fetch(`${this.API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                if (!data.isAdmin) {
                    throw new Error('Access Denied: Admin privileges required');
                }

                const session = {
                    email: data.email,
                    name: data.name,
                    token: data.token,
                    loginTime: new Date().toISOString()
                };
                localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
                return { success: true };
            } else {
                return { success: false, message: data.message || 'Invalid Protocol Credentials' };
            }
        } catch (error) {
            console.error('Auth Protocol Error:', error);
            return { success: false, message: 'Backend Server NOT Found. Please run "npm run dev" in backend folder.' };
        }
    }

    static logout() {
        localStorage.removeItem(this.SESSION_KEY);
        window.location.reload();
    }

    static isAuthenticated() {
        const session = localStorage.getItem(this.SESSION_KEY);
        if (!session) return false;

        const data = JSON.parse(session);
        const loginDate = new Date(data.loginTime);
        const hoursPassed = (new Date() - loginDate) / (1000 * 60 * 60);

        if (hoursPassed > 24) {
            this.logout();
            return false;
        }

        return true;
    }

    static getToken() {
        const session = localStorage.getItem(this.SESSION_KEY);
        return session ? JSON.parse(session).token : null;
    }
}
