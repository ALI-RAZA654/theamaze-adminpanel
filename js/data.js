// THE AMAZE - Admin Data & State Management Protocol
import { API } from './utils/api.js';

export const KEYS = {
    PRODUCTS: 'the_amaze_products_2026',
    SALE: 'the_amaze_sale_2026',
    HERO: 'the_amaze_hero_2026',
    PROMO: 'the_amaze_promo_2026',
    ORDERS: 'the_amaze_orders_2026',
    PAYMENTS: 'the_amaze_payments_2026',
    SOCIAL: 'the_amaze_social_2026',
    REVIEWS: 'the_amaze_reviews_2026',
    STATS: 'the_amaze_stats_2026',
    FOOTER: 'the_amaze_footer_2026',
    LOOKBOOK: 'the_amaze_lookbook_2026',
    CATEGORIES: 'the_amaze_categories_2026',
    MUSE: 'the_amaze_muse_2026',
    CONTACT: 'the_amaze_contact_2026',
    TRUSTED: 'the_amaze_trusted_2026'
};

const DEFAULT_PRODUCTS = [
    {
        id: 1,
        name: 'VANGUARD SILK TEE',
        price: 180,
        original: 250,
        badge: 'Drop 01',
        category: 'Men',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
        hoverImage: 'https://images.unsplash.com/photo-1483393458019-411bc6bd104e?w=800',
        stock: 4,
        description: "Engineered from bio-synthetic silk strands, the Vanguard Tee offers frictionless movement and climatic adaptation.",
        isFeatured: true,
        isFlashSale: false,
        rating: 4.8,
        fabric: 'Technical Silk Blend',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['#FFFFFF', '#000000']
    },
    {
        id: 2,
        name: 'TECH-SHELL JACKET',
        price: 450,
        original: 600,
        badge: 'New Gen',
        category: 'Outerwear',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
        hoverImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800',
        stock: 2,
        description: "A triple-layer defense matrix against environmental hostility. Self-healing polymer fabrics.",
        isFeatured: true,
        isFlashSale: true,
        rating: 4.9,
        fabric: 'Self-Healing Polymer',
        sizes: ['M', 'L', 'XL'],
        colors: ['#1A1A1A', '#FF4D4D']
    },
    {
        id: 3,
        name: 'ARCTICA WOOL COAT',
        price: 899,
        original: 1200,
        badge: 'Exclusive',
        category: 'Women',
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
        hoverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
        stock: 12,
        description: "Harvested from the high-altitude plateaus, Arctica Wool provides unmatched thermal regulation.",
        isFeatured: false,
        isFlashSale: true,
        rating: 5.0,
        fabric: 'Nano-Infused Wool',
        sizes: ['S', 'M', 'L'],
        colors: ['#8E5E4E', '#1A1A1A']
    },
    {
        id: 4,
        name: 'METAL-REINFORCED DENIM',
        price: 320,
        original: 450,
        badge: 'Archive',
        category: 'Men',
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
        hoverImage: 'https://images.unsplash.com/photo-1516575334481-f85287c2c82d?w=800',
        stock: 7,
        description: "Denim woven with microscopic titanium filaments. Indestructible, adaptive.",
        isFeatured: false,
        isFlashSale: false,
        rating: 4.7,
        fabric: 'Titanium-Filament Denim',
        sizes: ['30', '32', '34', '36'],
        colors: ['#4A4A4A', '#2C3E50']
    },
    {
        id: 5,
        name: 'NEON-REACTIVE HOODIE',
        price: 210,
        original: 300,
        badge: 'Limited',
        category: 'Men',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
        hoverImage: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800',
        stock: 5,
        description: "Fabric responding to UV radiation and sound waves. Shift visual states.",
        isFeatured: false,
        isFlashSale: false,
        rating: 4.6,
        fabric: 'Photo-Reactive Polyester',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['#000000', '#06b6d4']
    },
    {
        id: 6,
        name: 'SENSORY KNIT WEAR',
        price: 160,
        original: 220,
        badge: 'Studio',
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800',
        hoverImage: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800',
        stock: 9,
        description: "Tactile feedback interface woven into a garment. Adapt to body temperature.",
        isFeatured: false,
        isFlashSale: false,
        rating: 4.8,
        fabric: 'Smart-Fiber Knit',
        sizes: ['ONE SIZE'],
        colors: ['#F5F5F5', '#808080']
    },
    {
        id: 7,
        name: 'BIO-HYBRID SNEAKERS',
        price: 420,
        original: 550,
        badge: 'Tech',
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800',
        hoverImage: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800',
        stock: 3,
        description: "Grown, not manufactured. Sole utilizes mycelium structures.",
        isFeatured: true,
        isFlashSale: true,
        rating: 4.9,
        fabric: 'Mycelium Leather',
        sizes: ['40', '41', '42', '43', '44'],
        colors: ['#FFFFFF', '#06b6d4']
    }
];

const DEFAULT_HERO = {
    heading: "DIGITAL SCULPTURES.",
    subtext: "Redefining the relationship between advanced textiles and human form through high-conversion aesthetic engineering.",
    videoLink: "https://player.vimeo.com/external/494451559.sd.mp4?s=5a0921757835154ee42f9e42220970dd88293774&profile_id=164&oauth2_token_id=57447761",
    ctaText: "Purchase the future",
    featuredProductId: 2,
    enableSpotlight: true
};

const DEFAULT_SALE = {
    isActive: true,
    discountPercent: 40,
    endTime: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
    bannerText: "Seasonal liquidity event. High-performance textiles at unprecedented acquisition rates.",
    products: [2, 3]
};

const DEFAULT_PROMO = {
    text: "Free Global Delivery on orders above Rs. 5,999 — Exclusive 20% OFF — Use Code: AMAZE20",
    code: "AMAZE20",
    isEnabled: true
};

const DEFAULT_PAYMENTS = {
    easyPaisa: "03451234567",
    jazzCash: "03007654321",
    enableCOD: true,
    shippingFee: 250
};

const DEFAULT_SOCIAL = {
    enablePulse: true,
    notificationText: "Someone in {city} just secured {product}.",
    frequency: 5000 // 5 seconds
};

const DEFAULT_FOOTER = {
    description: "Architecting high-conversion fashion identities for the year 2026.",
    copyright: "© 2026 THE AMAZE FASHION PROTOCOL. ALL RIGHTS SECURED.",
    socials: {
        instagram: "#",
        x: "#",
        linkedin: "#"
    },
    sections: {
        showNavigation: true,
        showDigital: true,
        showLegal: true
    }
};

const DEFAULT_LOOKBOOK = {
    videoLink: "istockphoto-1095664718-640_adpp_is.mp4",
    isEnabled: true
};

const DEFAULT_CATEGORIES = [
    {
        id: 'vanguard',
        name: 'Vanguard Series',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000'
    },
    {
        id: 'essentials',
        name: 'Essentials',
        image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1000'
    },
    {
        id: 'accessories',
        name: 'Accessories',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1000'
    }
];

const DEFAULT_MUSE = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
        role: 'Berlin / Digital Artist',
        testimonial: '"THE AMAZE isn\'t just clothing; it\'s a digital extension of my creative identity. The fluidity is unmatched."'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800',
        role: 'Tokyo / Architect',
        testimonial: '"The engineering behind these textiles mirrors the precision of modern structural design."'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=800',
        role: 'Paris / Curator',
        testimonial: '"A masterclass in high-conversion aesthetic. They\'ve truly captured the pulse of 2026."'
    }
];

const DEFAULT_CONTACT = {
    subjects: [
        'Private Commission',
        'Technical Support',
        'Elite Partnership',
        'General Inquiry'
    ]
};

const DEFAULT_TRUSTED = [
    {
        id: 1,
        icon: 'fas fa-users',
        value: '10,000+',
        label: 'Happy Customers'
    },
    {
        id: 2,
        icon: 'fas fa-star',
        value: '4.9 ★',
        label: 'Average Rating'
    },
    {
        id: 3,
        icon: 'fas fa-undo',
        value: '30-Day',
        label: 'Easy Returns'
    },
    {
        id: 4,
        icon: 'fas fa-globe',
        value: 'FREE',
        label: 'Worldwide Shipping'
    }
];

export class AdminState {
    static init() {
        if (!localStorage.getItem(KEYS.PRODUCTS)) {
            localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
        }
        if (!localStorage.getItem(KEYS.HERO)) {
            localStorage.setItem(KEYS.HERO, JSON.stringify(DEFAULT_HERO));
        }
        if (!localStorage.getItem(KEYS.SALE)) {
            localStorage.setItem(KEYS.SALE, JSON.stringify(DEFAULT_SALE));
        }
        if (!localStorage.getItem(KEYS.PROMO)) {
            localStorage.setItem(KEYS.PROMO, JSON.stringify(DEFAULT_PROMO));
        }
        if (!localStorage.getItem(KEYS.ORDERS)) {
            localStorage.setItem(KEYS.ORDERS, JSON.stringify([]));
        }
        if (!localStorage.getItem(KEYS.PAYMENTS)) {
            localStorage.setItem(KEYS.PAYMENTS, JSON.stringify(DEFAULT_PAYMENTS));
        }
        if (!localStorage.getItem(KEYS.SOCIAL)) {
            localStorage.setItem(KEYS.SOCIAL, JSON.stringify(DEFAULT_SOCIAL));
        }
        if (!localStorage.getItem(KEYS.REVIEWS)) {
            localStorage.setItem(KEYS.REVIEWS, JSON.stringify([]));
        }
        if (!localStorage.getItem(KEYS.FOOTER)) {
            localStorage.setItem(KEYS.FOOTER, JSON.stringify(DEFAULT_FOOTER));
        }
        if (!localStorage.getItem(KEYS.LOOKBOOK)) {
            localStorage.setItem(KEYS.LOOKBOOK, JSON.stringify(DEFAULT_LOOKBOOK));
        }
        if (!localStorage.getItem(KEYS.CATEGORIES)) {
            localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
        }
        if (!localStorage.getItem(KEYS.MUSE)) {
            localStorage.setItem(KEYS.MUSE, JSON.stringify(DEFAULT_MUSE));
        }
        if (!localStorage.getItem(KEYS.CONTACT)) {
            localStorage.setItem(KEYS.CONTACT, JSON.stringify(DEFAULT_CONTACT));
        }
        if (!localStorage.getItem(KEYS.TRUSTED)) {
            localStorage.setItem(KEYS.TRUSTED, JSON.stringify(DEFAULT_TRUSTED));
        }
    }

    static get(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    static set(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
        // Trigger a custom event for real-time UI updates within admin
        window.dispatchEvent(new CustomEvent('stateUpdated', { detail: { key, data } }));
    }

    // Product CRUD
    static addProduct(product) {
        const products = this.get(KEYS.PRODUCTS);
        product.id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push(product);
        this.set(KEYS.PRODUCTS, products);
        return product;
    }

    static updateProduct(id, updatedData) {
        const products = this.get(KEYS.PRODUCTS);
        const index = products.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedData };
            this.set(KEYS.PRODUCTS, products);
        }
    }

    static deleteProduct(id) {
        let products = this.get(KEYS.PRODUCTS);
        products = products.filter(p => p.id !== parseInt(id));
        this.set(KEYS.PRODUCTS, products);
    }

    // Orders
    static updateOrderStatus(id, status) {
        const orders = this.get(KEYS.ORDERS);
        const index = orders.findIndex(o => o.id === id);
        if (index !== -1) {
            orders[index].status = status;
            this.set(KEYS.ORDERS, orders);
        }
    }

    // Stats calculation
    static getStats() {
        const products = this.get(KEYS.PRODUCTS);
        const orders = this.get(KEYS.ORDERS);

        const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
        const lowStock = products.filter(p => p.stock < 5).length;
        const activeSale = this.get(KEYS.SALE).isActive;

        return {
            totalRevenue,
            totalOrders: orders.length,
            totalCustomers: new Set(orders.map(o => o.email)).size,
            lowStockAlerts: lowStock,
            activeSale
        };
    }
}
