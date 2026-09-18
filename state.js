/**
 * Glory to the Past - Luxury Heritage Travel Platform
 * Reactive State Management & Event Bus
 */

class AppState {
  constructor() {
    this.currency = localStorage.getItem('gttp_currency') || 'USD';
    this.activeEra = 'all';
    this.activeCategory = 'stays'; // 'stays', 'transport', 'experiences', 'ancillaries'
    this.heroTab = 'stays'; // 'stays', 'transport', 'guides'
    this.searchQuery = {
      stays: { destination: '', era: 'all', checkIn: '', checkOut: '', guests: '2 Guests, 1 Suite' },
      transport: { mode: 'all', origin: '', destination: '', date: '' },
      guides: { site: '', language: 'any', certifiedOnly: true }
    };
    
    // Initial sample itinerary so the drawer and sticky bottom bar display immediate rich content
    const savedCart = localStorage.getItem('gttp_cart');
    if (savedCart) {
      try {
        this.cart = JSON.parse(savedCart);
      } catch (e) {
        this.cart = this.getDefaultCart();
      }
    } else {
      this.cart = this.getDefaultCart();
    }

    this.listeners = [];
  }

  getDefaultCart() {
    return [
      {
        cartId: 'item-demo-1',
        type: 'stay',
        refId: 'stay-1',
        title: 'Neemrana Fort-Palace (Mahal Turret Suite)',
        badge: '15th-Century Medieval Fort',
        dateOrDuration: '2 Nights (Oct 14 - Oct 16)',
        guests: '2 Guests',
        priceUSD: 520,
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80'
      },
      {
        cartId: 'item-demo-2',
        type: 'transport',
        refId: 'trans-3',
        title: 'Hampi Ancient Empire Ruins Chopper Tour',
        badge: 'Aerial Vijayanagara Tour',
        dateOrDuration: '45-Minute Flight',
        guests: '2 Passengers',
        priceUSD: 310,
        image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=400&q=80'
      },
      {
        cartId: 'item-demo-3',
        type: 'experience',
        refId: 'exp-1',
        title: 'Secret Underground Vaults of Amber Fort with Dr. Rathore',
        badge: 'ASI Certified Senior Archaeologist',
        dateOrDuration: 'Oct 15, 09:30 AM (3.5 Hours)',
        guests: '2 Explorers',
        priceUSD: 280,
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=400&q=80'
      },
      {
        cartId: 'item-demo-4',
        type: 'ancillary',
        refId: 'anc-1',
        title: 'Heritage Relic & Adventure Travel Insurance',
        badge: 'Underwritten by Royal Heritage Lloyd',
        dateOrDuration: 'Full Expedition Coverage',
        guests: '2 Insured Travellers',
        priceUSD: 70,
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80'
      }
    ];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify(event, data) {
    this.listeners.forEach(listener => listener(event, data, this));
  }

  setCurrency(currCode) {
    if (CURRENCIES[currCode]) {
      this.currency = currCode;
      localStorage.setItem('gttp_currency', currCode);
      this.notify('currency_changed', currCode);
    }
  }

  formatPrice(amountUSD) {
    const curr = CURRENCIES[this.currency] || CURRENCIES.USD;
    const converted = Math.round(amountUSD * curr.rate);
    return `${curr.symbol}${converted.toLocaleString()}`;
  }

  getConvertedRaw(amountUSD) {
    const curr = CURRENCIES[this.currency] || CURRENCIES.USD;
    return Math.round(amountUSD * curr.rate);
  }

  setActiveEra(eraId) {
    this.activeEra = eraId;
    this.notify('era_changed', eraId);
  }

  setActiveCategory(category) {
    this.activeCategory = category;
    this.notify('category_changed', category);
  }

  setHeroTab(tabId) {
    this.heroTab = tabId;
    this.notify('hero_tab_changed', tabId);
  }

  addToCart(item) {
    const itemWithId = {
      ...item,
      cartId: 'cart-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4)
    };
    this.cart.push(itemWithId);
    this.saveCart();
    this.notify('cart_updated', { action: 'added', item: itemWithId });
  }

  removeFromCart(cartId) {
    const index = this.cart.findIndex(i => i.cartId === cartId);
    if (index > -1) {
      const removed = this.cart.splice(index, 1)[0];
      this.saveCart();
      this.notify('cart_updated', { action: 'removed', item: removed });
    }
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
    this.notify('cart_updated', { action: 'cleared' });
  }

  saveCart() {
    localStorage.setItem('gttp_cart', JSON.stringify(this.cart));
  }

  getCartTotals() {
    const subtotalUSD = this.cart.reduce((sum, item) => sum + (item.priceUSD || 0), 0);
    const taxRate = 0.12; // 12% Heritage Conservation & Luxury Service Tax
    const taxUSD = Math.round(subtotalUSD * taxRate);
    const totalUSD = subtotalUSD + taxUSD;

    return {
      count: this.cart.length,
      subtotalUSD,
      taxUSD,
      totalUSD,
      subtotalFormatted: this.formatPrice(subtotalUSD),
      taxFormatted: this.formatPrice(taxUSD),
      totalFormatted: this.formatPrice(totalUSD)
    };
  }
}

// Global state instance
const state = new AppState();
