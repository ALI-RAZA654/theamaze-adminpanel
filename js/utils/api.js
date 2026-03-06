// THE AMAZE - API Connector Protocol
import { AdminAuth } from '../auth.js';

const BASE_URL = 'https://theamazebackend-production.up.railway.app/api';

export const API = {
    async request(endpoint, options = {}) {
        const token = AdminAuth.getToken();

        const defaultHeaders = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };

        const config = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        };

        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    AdminAuth.logout();
                }
                throw new Error(data.message || 'Transmission Protocol Error');
            }

            return data;
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    },

    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    },

    put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    },

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    },

    async upload(file) {
        const formData = new FormData();
        formData.append('image', file);

        const token = AdminAuth.getToken();
        const response = await fetch(`${BASE_URL}/upload`, {
            method: 'POST',
            headers: {
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: formData
        });

        if (!response.ok) throw new Error('Asset Upload Failed');
        return await response.json();
    }
};
