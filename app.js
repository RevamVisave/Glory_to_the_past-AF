/**
 * =========================================================================
 * GLORY TO THE PAST — FRONTEND APPLICATION CONTROLLER (app.js)
 * Pure Vanilla JavaScript (ES6+) with Fetch API & State Management
 * =========================================================================
 */

// Determine API Base URL (works if opened via http://localhost:5000 or file://)
const API_BASE = (window.location.protocol.startsWith('http') && window.location.port === '5000')
  ? `${window.location.origin}/api`
  : 'http://localhost:5000/api';

// Global Application State
const state = {
  stays: [],
  transport: [],
  experiences: [],
  ancillaries: [],
  cart: [],
  filters: {
    stayType: 'all',
    transportCategory: 'all',
    experienceCategory: 'all',
    searchQuery: '',
    era: 'all'
  }
};

// =========================================================================
// INITIALIZATION
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initCartFromStorage();
  initEventListeners();
  fetchAllData();
  setDefaultDates();
});

function setDefaultDates() {
  const departureInput = document.getElementById('departure-date');
  if (departureInput) {
    const today = new Date();
    today.setDate(today.getDate() + 14); // default 2 weeks in future
    departureInput.value = today.toISOString().split('T')[0];
    departureInput.min = new Date().toISOString().split('T')[0];
  }
}

// =========================================================================
// API INTEGRATION & DATA FETCHING
// =========================================================================

/**
 * Fetch all initial data concurrently
 */
async function fetchAllData() {
  showLoadingStates();
  try {
    await Promise.all([
      fetchStays(),
      fetchTransport(),
      fetchExperiences(),
      fetchAncillaries()
    ]);
  } catch (error) {
    console.error('Failed to initialize catalog:', error);
    showToast('Cannot connect to backend server. Make sure "node server.js" is running on port 5000.', 'error');
  }
}

function showLoadingStates() {
  const loaderHtml = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--gold-dark); font-family: var(--font-serif);">
      <i class="fa-solid fa-compass fa-spin fa-2x" style="margin-bottom: 12px; display: block;"></i>
      <span>Consulting Royal Archives & Excavation Ledgers...</span>
    </div>
  `;
  document.getElementById('stays-grid').innerHTML = loaderHtml;
  document.getElementById('transport-grid').innerHTML = loaderHtml;
  document.getElementById('experiences-grid').innerHTML = loaderHtml;
  document.getElementById('ancillaries-grid').innerHTML = loaderHtml;
}

/**
 * GET /api/stays
 */
async function fetchStays() {
  try {
    const response = await fetch(`${API_BASE}/stays`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const result = await response.json();
    state.stays = result.data || [];
    renderStays();
  } catch (error) {
    console.error('Error fetching stays:', error);
    document.getElementById('stays-grid').innerHTML = renderErrorCard('Unable to load heritage stays. Please verify server is online.');
  }
}

/**
 * GET /api/transport
 */
async function fetchTransport() {
  try {
    const response = await fetch(`${API_BASE}/transport`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const result = await response.json();
    state.transport = result.data || [];
    renderTransport();
  } catch (error) {
    console.error('Error fetching transport:', error);
    document.getElementById('transport-grid').innerHTML = renderErrorCard('Unable to load transport options.');
  }
}

/**
 * GET /api/experiences
 */
async function fetchExperiences() {
  try {
    const response = await fetch(`${API_BASE}/experiences`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const result = await response.json();
    state.experiences = result.data || [];
    renderExperiences();
  } catch (error) {
    console.error('Error fetching experiences:', error);
    document.getElementById('experiences-grid').innerHTML = renderErrorCard('Unable to load archaeologist experiences.');
  }
}

/**
 * GET /api/ancillaries
 */
async function fetchAncillaries() {
  try {
    const response = await fetch(`${API_BASE}/ancillaries`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const result = await response.json();
    state.ancillaries = result.data || [];
    renderAncillaries();
  } catch (error) {
    console.error('Error fetching ancillaries:', error);
    document.getElementById('ancillaries-grid').innerHTML = renderErrorCard('Unable to load concierge ancillaries.');
  }
}

function renderErrorCard(msg) {
  return `
    <div style="grid-column: 1 / -1; background: #FFF5F5; border: 1px solid #FEB2B2; border-radius: 8px; padding: 24px; text-align: center; color: #9B2C2C;">
      <i class="fa-solid fa-triangle-exclamation fa-2x" style="margin-bottom: 8px;"></i>
      <p style="font-weight: 600; margin-bottom: 8px;">${msg}</p>
      <button onclick="fetchAllData()" class="btn-secondary" style="padding: 6px 14px; font-size: 0.75rem;">
        <i class="fa-solid fa-rotate"></i> Retry Connection
      </button>
    </div>
  `;
}

// =========================================================================
// DYNAMIC RENDERING FUNCTIONS
// =========================================================================

/**
 * Render Stays into #stays-grid
 */
function renderStays() {
  const container = document.getElementById('stays-grid');
  const filtered = state.stays.filter(stay => {
    const matchType = state.filters.stayType === 'all' || stay.type.toLowerCase() === state.filters.stayType.toLowerCase();
    const matchSearch = !state.filters.searchQuery || 
      stay.title.toLowerCase().includes(state.filters.searchQuery) ||
      stay.location.toLowerCase().includes(state.filters.searchQuery) ||
      stay.era.toLowerCase().includes(state.filters.searchQuery);
    const matchEra = state.filters.era === 'all' || stay.era.toLowerCase().includes(state.filters.era.toLowerCase());
    return matchType && matchSearch && matchEra;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">No heritage stays match your search criteria.</div>`;
    return;
  }

  container.innerHTML = filtered.map(stay => `
    <div class="heritage-card" id="card-${stay.id}">
      <div class="card-media">
        <img src="${escapeHtml(stay.imageUrl)}" alt="${escapeHtml(stay.title)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80'">
        <span class="badge-era">${escapeHtml(stay.era)}</span>
        <span class="badge-type">${escapeHtml(stay.type)}</span>
      </div>
      <div class="card-body">
        <div class="card-location">
          <i class="fa-solid fa-location-dot"></i>
          <span>${escapeHtml(stay.location)}</span>
        </div>
        <h3 class="card-title">${escapeHtml(stay.title)}</h3>
        <p class="card-desc">${escapeHtml(stay.description)}</p>
        <div class="card-amenities">
          ${(stay.amenities || []).slice(0, 3).map(a => `<span class="amenity-pill">✦ ${escapeHtml(a)}</span>`).join('')}
        </div>
        <div class="card-footer">
          <div class="card-pricing">
            <span class="price-label">Per Night</span>
            <div class="price-val">$${stay.price.toLocaleString()} <span>USD</span></div>
          </div>
          <button class="btn-book-action" onclick="addToCart({ id: '${stay.id}', title: '${escapeJs(stay.title)}', type: '${escapeJs(stay.type)}', era: '${escapeJs(stay.era)}', price: ${stay.price}, imageUrl: '${escapeJs(stay.imageUrl)}' })">
            <i class="fa-solid fa-feather-pointed"></i> Book Stay
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Render Transport into #transport-grid
 */
function renderTransport() {
  const container = document.getElementById('transport-grid');
  const filtered = state.transport.filter(item => {
    const matchCategory = state.filters.transportCategory === 'all' || item.category.toLowerCase().includes(state.filters.transportCategory.toLowerCase());
    const matchSearch = !state.filters.searchQuery ||
      item.title.toLowerCase().includes(state.filters.searchQuery) ||
      item.route.toLowerCase().includes(state.filters.searchQuery) ||
      item.category.toLowerCase().includes(state.filters.searchQuery);
    return matchCategory && matchSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">No royal transport options match your selection.</div>`;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="heritage-card">
      <div class="card-media">
        <img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.title)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1000&q=80'">
        <span class="badge-era">${escapeHtml(item.duration)}</span>
        <span class="badge-type">${escapeHtml(item.category)}</span>
      </div>
      <div class="card-body">
        <div class="transport-route-tag">
          <i class="fa-solid fa-route" style="color: var(--gold-dark); margin-right: 4px;"></i>
          ${escapeHtml(item.route)}
        </div>
        <h3 class="card-title">${escapeHtml(item.title)}</h3>
        <p class="card-desc">${escapeHtml(item.description)}</p>
        <div class="card-amenities">
          ${(item.highlights || []).map(h => `<span class="amenity-pill">★ ${escapeHtml(h)}</span>`).join('')}
        </div>
        <div class="card-footer">
          <div class="card-pricing">
            <span class="price-label">Charter Rate</span>
            <div class="price-val">$${item.price.toLocaleString()} <span>USD</span></div>
          </div>
          <button class="btn-book-action" onclick="addToCart({ id: '${item.id}', title: '${escapeJs(item.title)}', type: '${escapeJs(item.category)}', era: '${escapeJs(item.duration)}', price: ${item.price}, imageUrl: '${escapeJs(item.imageUrl)}' })">
            <i class="fa-solid fa-ticket"></i> Book Transport
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Render Experiences into #experiences-grid
 */
function renderExperiences() {
  const container = document.getElementById('experiences-grid');
  const filtered = state.experiences.filter(exp => {
    const matchCategory = state.filters.experienceCategory === 'all' || exp.category.toLowerCase().includes(state.filters.experienceCategory.toLowerCase());
    const matchSearch = !state.filters.searchQuery ||
      exp.title.toLowerCase().includes(state.filters.searchQuery) ||
      exp.location.toLowerCase().includes(state.filters.searchQuery) ||
      exp.description.toLowerCase().includes(state.filters.searchQuery);
    return matchCategory && matchSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">No experiences found matching your query.</div>`;
    return;
  }

  container.innerHTML = filtered.map(exp => `
    <div class="heritage-card">
      <div class="card-media">
        <img src="${escapeHtml(exp.imageUrl)}" alt="${escapeHtml(exp.title)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1000&q=80'">
        <span class="badge-era">${escapeHtml(exp.duration)}</span>
        <span class="badge-type">${escapeHtml(exp.badge || exp.category)}</span>
      </div>
      <div class="card-body">
        <div class="card-location">
          <i class="fa-solid fa-monument"></i>
          <span>${escapeHtml(exp.location)}</span>
        </div>
        <h3 class="card-title">${escapeHtml(exp.title)}</h3>
        <p class="card-desc">${escapeHtml(exp.description)}</p>
        <div class="card-footer">
          <div class="card-pricing">
            <span class="price-label">Permit Cost</span>
            <div class="price-val">$${exp.price.toLocaleString()} <span>USD</span></div>
          </div>
          <button class="btn-book-action" onclick="addToCart({ id: '${exp.id}', title: '${escapeJs(exp.title)}', type: '${escapeJs(exp.category)}', era: '${escapeJs(exp.duration)}', price: ${exp.price}, imageUrl: '${escapeJs(exp.imageUrl)}' })">
            <i class="fa-solid fa-key"></i> Reserve Pass
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Render Ancillary Services
 */
function renderAncillaries() {
  const container = document.getElementById('ancillaries-grid');
  container.innerHTML = state.ancillaries.map(anc => `
    <div class="ancillary-card">
      <div class="ancillary-icon-box">
        <i class="fa-solid ${escapeHtml(anc.icon || 'fa-shield-halved')}"></i>
      </div>
      <h3 class="ancillary-title">${escapeHtml(anc.title)}</h3>
      <p class="ancillary-desc">${escapeHtml(anc.description)}</p>
      <ul class="ancillary-features">
        ${(anc.features || []).map(f => `<li><i class="fa-solid fa-check"></i> ${escapeHtml(f)}</li>`).join('')}
      </ul>
      <div class="ancillary-footer">
        <div class="ancillary-price">$${anc.price.toLocaleString()} <span style="font-size:0.75rem; color:#94A3B8;">USD</span></div>
        <button class="btn-book-action" onclick="addToCart({ id: '${anc.id}', title: '${escapeJs(anc.title)}', type: '${escapeJs(anc.category)}', era: 'Sovereign Concierge', price: ${anc.price}, imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80' })">
          <i class="fa-solid fa-plus"></i> Add Service
        </button>
      </div>
    </div>
  `).join('');
}

// =========================================================================
// CART & ITINERARY MANAGEMENT
// =========================================================================

function initCartFromStorage() {
  try {
    const saved = localStorage.getItem('gttp_cart');
    if (saved) {
      state.cart = JSON.parse(saved);
      updateCartUI();
    }
  } catch (err) {
    console.warn('Could not read cart from localStorage');
  }
}

function saveCartToStorage() {
  try {
    localStorage.setItem('gttp_cart', JSON.stringify(state.cart));
  } catch (err) {
    console.warn('Could not write cart to localStorage');
  }
}

/**
 * Add an item to the cart
 */
window.addToCart = function(item) {
  // Check if item already exists
  const existing = state.cart.find(i => i.id === item.id);
  if (existing) {
    showToast(`"${item.title}" is already in your expedition itinerary.`, 'info');
    openCartDrawer();
    return;
  }

  state.cart.push(item);
  saveCartToStorage();
  updateCartUI();
  
  // Animate badge
  const badge = document.getElementById('cart-count');
  badge.classList.add('bump');
  setTimeout(() => badge.classList.remove('bump'), 300);

  showToast(`Added "${item.title}" to expedition itinerary!`, 'success');
  openCartDrawer();
};

/**
 * Remove an item from the cart
 */
window.removeFromCart = function(id) {
  state.cart = state.cart.filter(item => item.id !== id);
  saveCartToStorage();
  updateCartUI();
  showToast('Item removed from itinerary.', 'info');
};

/**
 * Update Drawer, Badge, Totals
 */
function updateCartUI() {
  const countBadge = document.getElementById('cart-count');
  const itemsList = document.getElementById('cart-items-list');
  const emptyState = document.getElementById('cart-empty-state');
  const formContainer = document.getElementById('checkout-form-container');
  const confirmBtn = document.getElementById('btn-confirm-booking');

  const subtotalEl = document.getElementById('cart-subtotal');
  const levyEl = document.getElementById('cart-levy');
  const totalEl = document.getElementById('cart-total');

  countBadge.textContent = state.cart.length;

  if (state.cart.length === 0) {
    emptyState.style.display = 'flex';
    itemsList.innerHTML = '';
    formContainer.style.display = 'none';
    confirmBtn.disabled = true;
    subtotalEl.textContent = '$0';
    levyEl.textContent = '$0';
    totalEl.textContent = '$0';
    return;
  }

  emptyState.style.display = 'none';
  formContainer.style.display = 'block';
  confirmBtn.disabled = false;

  // Render items list
  itemsList.innerHTML = state.cart.map(item => `
    <div class="cart-item">
      <img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.title)}" class="cart-item-img" onerror="this.src='https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=300&q=80'">
      <div class="cart-item-details">
        <span class="cart-item-category">${escapeHtml(item.type)} • ${escapeHtml(item.era)}</span>
        <h4 class="cart-item-name">${escapeHtml(item.title)}</h4>
        <div class="cart-item-price">$${Number(item.price).toLocaleString()} USD</div>
      </div>
      <button class="cart-item-remove-btn" onclick="removeFromCart('${item.id}')" title="Remove from itinerary" aria-label="Remove item">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </div>
  `).join('');

  // Calculate totals
  const subtotal = state.cart.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  const preservationLevy = Math.round(subtotal * 0.05); // 5% historic preservation levy
  const grandTotal = subtotal + preservationLevy;

  subtotalEl.textContent = `$${subtotal.toLocaleString()} USD`;
  levyEl.textContent = `$${preservationLevy.toLocaleString()} USD`;
  totalEl.textContent = `$${grandTotal.toLocaleString()} USD`;
}

// Drawer Open/Close
function openCartDrawer() {
  document.getElementById('cart-drawer-backdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  document.getElementById('cart-drawer-backdrop').classList.remove('open');
  document.body.style.overflow = '';
}

// =========================================================================
// CHECKOUT & BOOKING HANDLER (POST /api/bookings)
// =========================================================================

async function handleConfirmBooking() {
  if (state.cart.length === 0) return;

  const guestName = document.getElementById('guest-name').value.trim();
  const guestEmail = document.getElementById('guest-email').value.trim();
  const departureDate = document.getElementById('departure-date').value;
  const guestCount = document.getElementById('guest-count').value || 1;
  const specialRequests = document.getElementById('special-requests').value.trim();

  // Basic Validation
  if (!guestName || !guestEmail || !departureDate) {
    showToast('Please provide your name, email, and departure date to seal the booking.', 'error');
    return;
  }

  const subtotal = state.cart.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  const preservationLevy = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + preservationLevy;

  const payload = {
    items: state.cart,
    customer: {
      name: guestName,
      email: guestEmail,
      guests: Number(guestCount),
      specialRequests: specialRequests || 'Standard Sovereign Hospitality'
    },
    dates: {
      departure: departureDate
    },
    totalPrice: grandTotal
  };

  const confirmBtn = document.getElementById('btn-confirm-booking');
  const originalBtnText = confirmBtn.innerHTML;
  confirmBtn.disabled = true;
  confirmBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sealing Expedition Order...`;

  try {
    const response = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to process booking');
    }

    // Success! Show majestic certificate modal
    closeCartDrawer();
    showBookingConfirmationModal(result.bookingId, result.booking, grandTotal);

    // Reset Cart
    state.cart = [];
    saveCartToStorage();
    updateCartUI();

    showToast(`Booking Confirmed! Reference ID: ${result.bookingId}`, 'success');

  } catch (error) {
    console.error('Error confirming booking:', error);
    showToast(`Booking error: ${error.message}`, 'error');
  } finally {
    confirmBtn.disabled = false;
    confirmBtn.innerHTML = originalBtnText;
  }
}

function showBookingConfirmationModal(bookingId, booking, grandTotal) {
  const modal = document.getElementById('confirmation-modal-backdrop');
  document.getElementById('confirmed-booking-id').textContent = bookingId;
  document.getElementById('confirmed-total-price').textContent = `$${grandTotal.toLocaleString()} USD`;

  const itemsListEl = document.getElementById('confirmed-items-list');
  itemsListEl.innerHTML = (booking.items || []).map(item => `
    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
      <span>✦ ${escapeHtml(item.title)} (${escapeHtml(item.type)})</span>
      <span style="font-weight:600;">$${Number(item.price).toLocaleString()}</span>
    </div>
  `).join('');

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeBookingConfirmationModal() {
  document.getElementById('confirmation-modal-backdrop').classList.remove('open');
  document.body.style.overflow = '';
}

// =========================================================================
// HOST PROPERTY MODAL & HANDLER (POST /api/stays)
// =========================================================================

function openHostModal() {
  document.getElementById('host-modal-backdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeHostModal() {
  document.getElementById('host-modal-backdrop').classList.remove('open');
  document.body.style.overflow = '';
}

async function handleHostPropertySubmit(e) {
  e.preventDefault();

  const title = document.getElementById('host-title').value.trim();
  const type = document.getElementById('host-type').value;
  const era = document.getElementById('host-era').value.trim();
  const location = document.getElementById('host-location').value.trim();
  const price = parseFloat(document.getElementById('host-price').value);
  const imageUrl = document.getElementById('host-image').value.trim();
  const description = document.getElementById('host-description').value.trim();

  if (!title || !era || !location || isNaN(price)) {
    showToast('Please fill in all required property information.', 'error');
    return;
  }

  const submitBtn = document.getElementById('btn-submit-property');
  const origText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Registering Property...`;

  const payload = {
    title,
    type,
    era,
    location,
    price,
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
    description: description || 'A rare, newly admitted heritage property preserved for discerning historical travelers.',
    amenities: ['Private Butler', 'Historic Courtyard', 'Royal Architecture', 'Antique Library']
  };

  try {
    const response = await fetch(`${API_BASE}/stays`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to list property');
    }

    // Success!
    closeHostModal();
    document.getElementById('host-property-form').reset();
    showToast(`"${title}" has been inducted into the Sovereign Collection!`, 'success');

    // Automatically re-fetch properties from the backend to instantly show the new stay
    await fetchStays();

    // Smooth scroll to Stays section to showcase the new listing
    const staysSection = document.getElementById('stays-section');
    if (staysSection) {
      staysSection.scrollIntoView({ behavior: 'smooth' });
    }

  } catch (error) {
    console.error('Error hosting property:', error);
    showToast(`Listing error: ${error.message}`, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = origText;
  }
}

// =========================================================================
// EVENT LISTENERS & NAVIGATION
// =========================================================================

function initEventListeners() {
  // Cart Drawer triggers
  document.getElementById('open-cart-btn')?.addEventListener('click', openCartDrawer);
  document.getElementById('close-cart-btn')?.addEventListener('click', closeCartDrawer);
  document.getElementById('cart-drawer-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'cart-drawer-backdrop') closeCartDrawer();
  });

  // Confirm booking action
  document.getElementById('btn-confirm-booking')?.addEventListener('click', handleConfirmBooking);

  // Confirmation modal close & copy reference
  document.getElementById('close-confirmation-modal-btn')?.addEventListener('click', closeBookingConfirmationModal);
  document.getElementById('copy-ref-btn')?.addEventListener('click', () => {
    const refId = document.getElementById('confirmed-booking-id').textContent;
    navigator.clipboard.writeText(refId).then(() => {
      showToast(`Copied reference ID "${refId}" to clipboard!`, 'info');
    });
  });

  // Host Property Modal triggers
  document.getElementById('open-host-modal-btn')?.addEventListener('click', openHostModal);
  document.getElementById('close-host-modal-btn')?.addEventListener('click', closeHostModal);
  document.getElementById('cancel-host-modal-btn')?.addEventListener('click', closeHostModal);
  document.getElementById('host-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'host-modal-backdrop') closeHostModal();
  });

  // Preset Image Chips
  document.querySelectorAll('.preset-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const imgInput = document.getElementById('host-image');
      if (imgInput) {
        imgInput.value = chip.dataset.img;
        showToast('Preset image applied to form', 'info');
      }
    });
  });

  // Host Property Form Submit
  document.getElementById('host-property-form')?.addEventListener('submit', handleHostPropertySubmit);

  // Navigation Tabs Smooth Scroll & Active Class
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const targetId = btn.dataset.target;
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Stays Filter Buttons
  document.querySelectorAll('#stays-filter-bar .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#stays-filter-bar .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.filters.stayType = btn.dataset.type;
      renderStays();
    });
  });

  // Transport Filter Buttons
  document.querySelectorAll('#transport-filter-bar .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#transport-filter-bar .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.filters.transportCategory = btn.dataset.category;
      renderTransport();
    });
  });

  // Experiences Filter Buttons
  document.querySelectorAll('#experiences-filter-bar .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#experiences-filter-bar .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.filters.experienceCategory = btn.dataset.category;
      renderExperiences();
    });
  });

  // Global Search Input
  const searchInput = document.getElementById('search-input');
  const eraFilter = document.getElementById('era-filter');
  const categoryFilter = document.getElementById('category-filter');
  const searchExecuteBtn = document.getElementById('btn-search-execute');

  function applyGlobalFilters() {
    state.filters.searchQuery = searchInput.value.trim().toLowerCase();
    state.filters.era = eraFilter.value;
    
    renderStays();
    renderTransport();
    renderExperiences();

    // Scroll to relevant section if category specified
    const cat = categoryFilter.value;
    if (cat === 'stays') {
      document.getElementById('stays-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (cat === 'transport') {
      document.getElementById('transport-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (cat === 'experiences') {
      document.getElementById('experiences-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  searchExecuteBtn?.addEventListener('click', applyGlobalFilters);
  searchInput?.addEventListener('input', () => {
    state.filters.searchQuery = searchInput.value.trim().toLowerCase();
    renderStays();
    renderTransport();
    renderExperiences();
  });
  eraFilter?.addEventListener('change', applyGlobalFilters);
}

// =========================================================================
// TOAST NOTIFICATIONS HELPER
// =========================================================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconClass = 'fa-info-circle';
  if (type === 'success') iconClass = 'fa-circle-check';
  if (type === 'error') iconClass = 'fa-circle-exclamation';

  toast.innerHTML = `
    <i class="fa-solid ${iconClass}"></i>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

// =========================================================================
// SECURITY ESCAPING HELPERS
// =========================================================================
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeJs(str) {
  if (!str) return '';
  return String(str).replace(/'/g, "\\'").replace(/"/g, '\\"');
}
