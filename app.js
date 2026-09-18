/**
 * Glory to the Past - Luxury Heritage Travel Platform
 * Application Controller & UI Logic
 */

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initApp();
  });
} else {
  initApp();
}

function initApp() {
  // Setup reactive state subscription
  state.subscribe((event, data) => {
    handleStateChange(event, data);
  });

  // Setup DOM listeners
  setupNavigation();
  setupCurrencySelector();
  setupHeroWidget();
  setupEraFilters();
  setupCartDrawer();
  setupSearchForm();
  setupModalDismissals();

  // Initial render of all sections
  renderStays();
  renderTransports();
  renderExperiences();
  renderAncillaries();
  updateCartUI();

  // Trigger Lucide icons creation
  refreshIcons();
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/**
 * Handle state updates reactively
 */
function handleStateChange(event, data) {
  if (event === 'currency_changed') {
    renderStays();
    renderTransports();
    renderExperiences();
    updateCartUI();
    showToast(`Currency updated to ${data} (${CURRENCIES[data].symbol})`);
  } else if (event === 'era_changed') {
    renderStays();
    renderExperiences();
  } else if (event === 'cart_updated') {
    updateCartUI();
    if (data && data.action === 'added') {
      showToast(`Added "${data.item.title}" to your Heritage Itinerary`);
    } else if (data && data.action === 'removed') {
      showToast(`Item removed from your itinerary`);
    }
  } else if (event === 'hero_tab_changed') {
    renderHeroTabContent(data);
  }
  refreshIcons();
}

/**
 * Global Navigation & Category Tab Switching
 */
function setupNavigation() {
  const categoryTabs = document.querySelectorAll('.nav-category-tab');
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSectionId = tab.getAttribute('data-target');
      
      categoryTabs.forEach(t => t.classList.remove('nav-tab-active', 'text-amber-500'));
      tab.classList.add('nav-tab-active');
      
      const targetElem = document.getElementById(targetSectionId);
      if (targetElem) {
        targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Mobile navigation drawer toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

/**
 * Currency Selector setup
 */
function setupCurrencySelector() {
  const currencySelect = document.getElementById('currency-select');
  if (currencySelect) {
    currencySelect.value = state.currency;
    currencySelect.addEventListener('change', (e) => {
      state.setCurrency(e.target.value);
    });
  }
}

/**
 * Hero Multi-Tab Search Box
 */
function setupHeroWidget() {
  const heroTabs = document.querySelectorAll('.hero-tab-btn');
  heroTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      heroTabs.forEach(t => {
        t.classList.remove('border-amber-400', 'text-amber-400', 'bg-slate-900/90');
        t.classList.add('text-slate-300', 'border-transparent');
      });
      btn.classList.remove('text-slate-300', 'border-transparent');
      btn.classList.add('border-amber-400', 'text-amber-400', 'bg-slate-900/90');
      
      state.setHeroTab(tabId);
    });
  });

  // Initial hero tab view
  renderHeroTabContent(state.heroTab);
}

function renderHeroTabContent(tabId) {
  const container = document.getElementById('hero-tab-content');
  if (!container) return;

  if (tabId === 'stays') {
    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 lg:p-6 items-center">
        <div class="border-b md:border-b-0 md:border-r border-amber-900/30 pb-3 md:pb-0 md:pr-4">
          <label class="block text-xs font-semibold uppercase tracking-wider text-amber-300/80 mb-1">Destination / Citadel</label>
          <div class="flex items-center gap-2">
            <i data-lucide="map-pin" class="w-4 h-4 text-amber-400 shrink-0"></i>
            <input type="text" id="search-dest" placeholder="e.g. Udaipur, Alwar, Jaipur" class="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none font-medium">
          </div>
        </div>

        <div class="border-b md:border-b-0 md:border-r border-amber-900/30 pb-3 md:pb-0 md:px-4">
          <label class="block text-xs font-semibold uppercase tracking-wider text-amber-300/80 mb-1">Historical Era</label>
          <div class="flex items-center gap-2">
            <i data-lucide="hourglass" class="w-4 h-4 text-amber-400 shrink-0"></i>
            <select id="search-era" class="w-full bg-transparent text-sm text-slate-100 focus:outline-none font-medium cursor-pointer">
              <option value="all" class="bg-slate-900 text-slate-100">All Historical Eras</option>
              <option value="ancient" class="bg-slate-900 text-slate-100">Ancient Civilizations</option>
              <option value="royal" class="bg-slate-900 text-slate-100">Royal Kingdoms & Forts</option>
              <option value="colonial" class="bg-slate-900 text-slate-100">Colonial Heritage</option>
              <option value="spiritual" class="bg-slate-900 text-slate-100">Sacred & Spiritual</option>
            </select>
          </div>
        </div>

        <div class="border-b md:border-b-0 md:border-r border-amber-900/30 pb-3 md:pb-0 md:px-4">
          <label class="block text-xs font-semibold uppercase tracking-wider text-amber-300/80 mb-1">Check-in / Check-out</label>
          <div class="flex items-center gap-2">
            <i data-lucide="calendar" class="w-4 h-4 text-amber-400 shrink-0"></i>
            <input type="text" id="search-dates" value="Oct 14 — Oct 18, 2026" class="w-full bg-transparent text-sm text-slate-100 focus:outline-none font-medium">
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-3 pt-2 md:pt-0 md:pl-4">
          <div class="w-full sm:w-auto flex-1">
            <label class="block text-xs font-semibold uppercase tracking-wider text-amber-300/80 mb-1">Guests & Suites</label>
            <div class="flex items-center gap-2">
              <i data-lucide="users" class="w-4 h-4 text-amber-400 shrink-0"></i>
              <span class="text-sm text-slate-200 font-medium">2 Royalty, 1 Suite</span>
            </div>
          </div>
          <button id="btn-hero-search-stays" class="gold-shimmer-btn w-full sm:w-auto px-6 py-3.5 rounded-lg font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg">
            <span>Explore</span>
            <i data-lucide="search" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;
  } else if (tabId === 'transport') {
    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 lg:p-6 items-center">
        <div class="border-b md:border-b-0 md:border-r border-amber-900/30 pb-3 md:pb-0 md:pr-4">
          <label class="block text-xs font-semibold uppercase tracking-wider text-amber-300/80 mb-1">Royal Transit Mode</label>
          <div class="flex items-center gap-2">
            <i data-lucide="compass" class="w-4 h-4 text-amber-400 shrink-0"></i>
            <select id="search-trans-mode" class="w-full bg-transparent text-sm text-slate-100 focus:outline-none font-medium cursor-pointer">
              <option value="all" class="bg-slate-900 text-slate-100">All Royal Modes</option>
              <option value="Train" class="bg-slate-900 text-slate-100">Luxury Heritage Train</option>
              <option value="Cruise" class="bg-slate-900 text-slate-100">Palace River Cruise</option>
              <option value="Chopper" class="bg-slate-900 text-slate-100">Ancient Ruins Chopper</option>
              <option value="Flight" class="bg-slate-900 text-slate-100">Private Jet Charter</option>
              <option value="Vintage Car" class="bg-slate-900 text-slate-100">Vintage Chauffeur</option>
            </select>
          </div>
        </div>

        <div class="border-b md:border-b-0 md:border-r border-amber-900/30 pb-3 md:pb-0 md:px-4">
          <label class="block text-xs font-semibold uppercase tracking-wider text-amber-300/80 mb-1">Origin City / Gate</label>
          <div class="flex items-center gap-2">
            <i data-lucide="map-pin" class="w-4 h-4 text-amber-400 shrink-0"></i>
            <input type="text" id="search-trans-origin" placeholder="e.g. New Delhi, Varanasi" class="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none font-medium">
          </div>
        </div>

        <div class="border-b md:border-b-0 md:border-r border-amber-900/30 pb-3 md:pb-0 md:px-4">
          <label class="block text-xs font-semibold uppercase tracking-wider text-amber-300/80 mb-1">Destination Citadel</label>
          <div class="flex items-center gap-2">
            <i data-lucide="landmark" class="w-4 h-4 text-amber-400 shrink-0"></i>
            <input type="text" id="search-trans-dest" placeholder="e.g. Jaipur, Hampi, Agra" class="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none font-medium">
          </div>
        </div>

        <div class="flex items-center gap-3 pt-2 md:pt-0 md:pl-4">
          <button id="btn-hero-search-transport" class="gold-shimmer-btn w-full px-6 py-3.5 rounded-lg font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg">
            <span>Find Transits</span>
            <i data-lucide="navigation" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;
  } else if (tabId === 'guides') {
    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 lg:p-6 items-center">
        <div class="border-b md:border-b-0 md:border-r border-amber-900/30 pb-3 md:pb-0 md:pr-4">
          <label class="block text-xs font-semibold uppercase tracking-wider text-amber-300/80 mb-1">Monument / Archaeological Site</label>
          <div class="flex items-center gap-2">
            <i data-lucide="shield" class="w-4 h-4 text-amber-400 shrink-0"></i>
            <input type="text" id="search-guide-site" placeholder="e.g. Amber Fort, Nalanda, Khajuraho" class="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none font-medium">
          </div>
        </div>

        <div class="border-b md:border-b-0 md:border-r border-amber-900/30 pb-3 md:pb-0 md:px-4">
          <label class="block text-xs font-semibold uppercase tracking-wider text-amber-300/80 mb-1">Historian Language</label>
          <div class="flex items-center gap-2">
            <i data-lucide="languages" class="w-4 h-4 text-amber-400 shrink-0"></i>
            <select id="search-guide-lang" class="w-full bg-transparent text-sm text-slate-100 focus:outline-none font-medium cursor-pointer">
              <option value="any" class="bg-slate-900 text-slate-100">All Languages (EN, FR, DE)</option>
              <option value="English" class="bg-slate-900 text-slate-100">English (Scholarly)</option>
              <option value="French" class="bg-slate-900 text-slate-100">French</option>
              <option value="German" class="bg-slate-900 text-slate-100">German</option>
            </select>
          </div>
        </div>

        <div class="border-b md:border-b-0 md:border-r border-amber-900/30 pb-3 md:pb-0 md:px-4">
          <label class="block text-xs font-semibold uppercase tracking-wider text-amber-300/80 mb-1">Accreditation Filter</label>
          <div class="flex items-center gap-2">
            <input type="checkbox" id="cert-toggle" checked class="accent-amber-500 w-4 h-4 cursor-pointer">
            <label for="cert-toggle" class="text-xs text-slate-200 cursor-pointer font-medium">ASI / UNESCO Certified Historian Only</label>
          </div>
        </div>

        <div class="flex items-center gap-3 pt-2 md:pt-0 md:pl-4">
          <button id="btn-hero-search-guides" class="gold-shimmer-btn w-full px-6 py-3.5 rounded-lg font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg">
            <span>Find Historians</span>
            <i data-lucide="award" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;
  }

  bindHeroSearchActions(tabId);
  refreshIcons();
}

function bindHeroSearchActions(tabId) {
  if (tabId === 'stays') {
    const btn = document.getElementById('btn-hero-search-stays');
    if (btn) {
      btn.addEventListener('click', () => {
        const dest = document.getElementById('search-dest')?.value.trim().toLowerCase() || '';
        const era = document.getElementById('search-era')?.value || 'all';
        
        state.activeEra = era;
        updateEraPillsUI(era);
        
        renderStays(dest);
        const staysSec = document.getElementById('heritage-stays-section');
        if (staysSec) staysSec.scrollIntoView({ behavior: 'smooth' });
        showToast(`Filtering stays for "${dest || 'All Destinations'}"`);
      });
    }
  } else if (tabId === 'transport') {
    const btn = document.getElementById('btn-hero-search-transport');
    if (btn) {
      btn.addEventListener('click', () => {
        const mode = document.getElementById('search-trans-mode')?.value || 'all';
        renderTransports(mode);
        const transSec = document.getElementById('transport-section');
        if (transSec) transSec.scrollIntoView({ behavior: 'smooth' });
        showToast(`Filtered royal transports by mode: ${mode}`);
      });
    }
  } else if (tabId === 'guides') {
    const btn = document.getElementById('btn-hero-search-guides');
    if (btn) {
      btn.addEventListener('click', () => {
        const site = document.getElementById('search-guide-site')?.value.trim().toLowerCase() || '';
        renderExperiences(site);
        const expSec = document.getElementById('experiences-section');
        if (expSec) expSec.scrollIntoView({ behavior: 'smooth' });
        showToast(`Found accredited historical experiences`);
      });
    }
  }
}

/**
 * Historical Era Filters
 */
function setupEraFilters() {
  const container = document.getElementById('era-filter-pills');
  if (!container) return;

  container.innerHTML = HISTORICAL_ERAS.map(era => `
    <button class="filter-pill px-4 py-2 rounded-full text-xs font-semibold tracking-wide flex items-center gap-2 cursor-pointer shadow-sm ${state.activeEra === era.id ? 'active' : ''}" data-era="${era.id}">
      <i data-lucide="${era.icon}" class="w-3.5 h-3.5 text-amber-500"></i>
      <span>${era.label}</span>
    </button>
  `).join('');

  container.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const eraId = pill.getAttribute('data-era');
      state.setActiveEra(eraId);
      updateEraPillsUI(eraId);
    });
  });
}

function updateEraPillsUI(activeEraId) {
  const pills = document.querySelectorAll('.filter-pill');
  pills.forEach(p => {
    if (p.getAttribute('data-era') === activeEraId) {
      p.classList.add('active');
    } else {
      p.classList.remove('active');
    }
  });
}

/**
 * Render Heritage Stays Cards
 */
function renderStays(searchQuery = '') {
  const grid = document.getElementById('stays-grid');
  if (!grid) return;

  let filtered = HERITAGE_STAYS;

  // Filter by era
  if (state.activeEra !== 'all') {
    filtered = filtered.filter(s => s.eraCategory === state.activeEra);
  }

  // Filter by search text
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(s => 
      s.title.toLowerCase().includes(q) || 
      s.location.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-12 text-center bg-stone-100/80 rounded-2xl border border-stone-200 p-8">
        <i data-lucide="castle" class="w-12 h-12 mx-auto text-amber-600 mb-3 opacity-60"></i>
        <h4 class="font-serif text-xl text-slate-800 font-semibold mb-1">No Citadel Stays Found</h4>
        <p class="text-sm text-slate-500 max-w-md mx-auto mb-4">No heritage properties matched your current era and query. Reset filters to explore all ancient bastions.</p>
        <button onclick="state.setActiveEra('all'); renderStays();" class="px-5 py-2 rounded-lg bg-slate-900 text-amber-300 font-medium text-xs uppercase tracking-wider hover:bg-slate-800">Show All Eras</button>
      </div>
    `;
    refreshIcons();
    return;
  }

  grid.innerHTML = filtered.map(stay => {
    const priceFormatted = state.formatPrice(stay.pricePerNightUSD);
    return `
      <article class="royal-card rounded-2xl overflow-hidden flex flex-col group relative" data-stay-id="${stay.id}">
        <!-- Image & Era Badge -->
        <div class="relative h-64 overflow-hidden">
          <img 
            src="${stay.image}" 
            alt="${stay.title}" 
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20"></div>

          <!-- Era Badge -->
          <div class="absolute top-3 left-3 era-badge px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 font-medium">
            <i data-lucide="crown" class="w-3 h-3 text-amber-400"></i>
            <span>${stay.eraBadge}</span>
          </div>

          <!-- Monument Proximity Badge -->
          <div class="absolute bottom-3 left-3 proximity-badge px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 shadow">
            <i data-lucide="map-pin" class="w-3 h-3 text-amber-200"></i>
            <span>${stay.monumentProximity}</span>
          </div>

          <!-- Rating -->
          <div class="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-amber-300 flex items-center gap-1 border border-amber-400/30">
            <i data-lucide="star" class="w-3 h-3 fill-amber-400 text-amber-400"></i>
            <span>${stay.rating}</span>
            <span class="text-slate-400 font-normal">(${stay.reviewsCount})</span>
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-5 sm:p-6 flex-1 flex flex-col justify-between">
          <div>
            <div class="text-xs text-amber-800 font-medium tracking-wide mb-1 flex items-center gap-1">
              <i data-lucide="compass" class="w-3.5 h-3.5 text-amber-600"></i>
              <span>${stay.location}</span>
            </div>
            <h3 class="text-xl font-bold text-slate-900 font-serif leading-tight mb-2 group-hover:text-amber-700 transition-colors">
              ${stay.title}
            </h3>
            <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
              ${stay.description}
            </p>

            <!-- Amenities Chips -->
            <div class="flex flex-wrap gap-1.5 mb-5">
              ${stay.amenities.slice(0, 3).map(a => `
                <span class="text-[11px] bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200/60 font-medium flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  ${a}
                </span>
              `).join('')}
              ${stay.amenities.length > 3 ? `<span class="text-[10px] text-slate-400 self-center">+${stay.amenities.length - 3} more</span>` : ''}
            </div>
          </div>

          <!-- Footer Price & CTA -->
          <div class="pt-4 border-t border-amber-900/10 flex items-center justify-between mt-auto">
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Starting Royal Rate</span>
              <div class="flex items-baseline gap-1">
                <span class="text-2xl font-black text-slate-900 font-display">${priceFormatted}</span>
                <span class="text-xs text-slate-500 font-medium">/ night</span>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button 
                onclick="openStayDetailModal('${stay.id}')"
                class="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
                title="View Palace Details"
              >
                Inspect
              </button>
              <button 
                onclick="bookStayDirect('${stay.id}')"
                class="gold-shimmer-btn px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow"
              >
                <span>Book Stay</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');

  refreshIcons();
}

/**
 * Render Multimodal Transport Cards
 */
function renderTransports(modeFilter = 'all') {
  const grid = document.getElementById('transport-grid');
  if (!grid) return;

  let filtered = MULTIMODAL_TRANSPORTS;
  if (modeFilter && modeFilter !== 'all') {
    filtered = filtered.filter(t => t.mode.toLowerCase() === modeFilter.toLowerCase());
  }

  grid.innerHTML = filtered.map(t => {
    const priceFormatted = state.formatPrice(t.priceUSD);
    return `
      <div class="royal-card rounded-2xl overflow-hidden flex flex-col group border border-amber-900/15">
        <div class="relative h-48 overflow-hidden">
          <img src="${t.image}" alt="${t.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20"></div>

          <div class="absolute top-3 left-3 bg-amber-500/90 text-slate-950 font-bold text-xs px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow">
            <i data-lucide="${t.modeIcon}" class="w-3.5 h-3.5"></i>
            <span>${t.mode}</span>
          </div>

          <div class="absolute bottom-3 left-3 right-3 text-white">
            <span class="text-[11px] text-amber-300 font-semibold tracking-wider uppercase block">${t.eraBadge}</span>
            <h4 class="font-serif font-bold text-lg leading-tight text-white drop-shadow">${t.title}</h4>
          </div>
        </div>

        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <!-- Route info -->
            <div class="bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/50 mb-3 text-xs">
              <div class="flex items-center gap-2 text-slate-800 font-medium">
                <i data-lucide="navigation" class="w-3.5 h-3.5 text-amber-600 shrink-0"></i>
                <span class="font-semibold text-slate-900">${t.origin}</span>
                <i data-lucide="arrow-right" class="w-3 h-3 text-slate-400"></i>
                <span class="font-semibold text-slate-900 truncate">${t.destination}</span>
              </div>
              <div class="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <i data-lucide="clock" class="w-3 h-3 text-amber-600"></i>
                <span>Duration: ${t.duration}</span>
              </div>
            </div>

            <p class="text-xs text-slate-600 leading-relaxed mb-3">${t.description}</p>
          </div>

          <div class="pt-3 border-t border-amber-900/10 flex items-center justify-between">
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-400">Royal Transit Fare</span>
              <div class="text-xl font-black text-slate-900 font-display">${priceFormatted}</div>
            </div>

            <button 
              onclick="addTransportToCart('${t.id}')"
              class="gold-shimmer-btn px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow"
            >
              <span>Add Transit</span>
              <i data-lucide="plus-circle" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  refreshIcons();
}

/**
 * Render Historical Experiences Cards
 */
function renderExperiences(siteQuery = '') {
  const grid = document.getElementById('experiences-grid');
  if (!grid) return;

  let filtered = HISTORICAL_EXPERIENCES;

  if (state.activeEra !== 'all') {
    filtered = filtered.filter(e => e.eraCategory === state.activeEra);
  }

  if (siteQuery) {
    const q = siteQuery.toLowerCase();
    filtered = filtered.filter(e => 
      e.title.toLowerCase().includes(q) || 
      e.site.toLowerCase().includes(q) ||
      e.guide.toLowerCase().includes(q)
    );
  }

  grid.innerHTML = filtered.map(exp => {
    const priceFormatted = state.formatPrice(exp.priceUSD);
    return `
      <div class="royal-card rounded-2xl overflow-hidden flex flex-col group border border-amber-900/15">
        <div class="relative h-52 overflow-hidden">
          <img src="${exp.image}" alt="${exp.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20"></div>

          <div class="absolute top-3 left-3 era-badge px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow">
            <i data-lucide="shield" class="w-3 h-3 text-amber-400"></i>
            <span>${exp.eraBadge}</span>
          </div>

          <div class="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-full text-xs font-bold text-amber-300 flex items-center gap-1 border border-amber-400/30">
            <i data-lucide="star" class="w-3 h-3 fill-amber-400 text-amber-400"></i>
            <span>${exp.rating}</span>
          </div>

          <div class="absolute bottom-3 left-3 right-3">
            <div class="text-[11px] text-amber-300 font-medium tracking-wide uppercase">${exp.category}</div>
            <h4 class="font-serif font-bold text-lg text-white leading-snug drop-shadow">${exp.title}</h4>
          </div>
        </div>

        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <!-- Historian / Guide Profile Box -->
            <div class="flex items-center gap-3 p-2.5 rounded-lg bg-slate-900 text-amber-100 mb-3 border border-amber-500/20">
              <div class="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-300 font-serif font-bold shrink-0">
                ${exp.guide.charAt(0)}
              </div>
              <div class="text-xs overflow-hidden">
                <span class="font-bold text-amber-200 block truncate">${exp.guide}</span>
                <span class="text-[10px] text-slate-300 block truncate">${exp.guideRole}</span>
              </div>
            </div>

            <p class="text-xs text-slate-600 leading-relaxed mb-3">${exp.description}</p>

            <ul class="space-y-1 mb-4">
              ${exp.highlights.slice(0, 2).map(h => `
                <li class="text-[11px] text-slate-700 flex items-start gap-1.5">
                  <i data-lucide="check" class="w-3 h-3 text-emerald-600 shrink-0 mt-0.5"></i>
                  <span>${h}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <div class="pt-3 border-t border-amber-900/10 flex items-center justify-between">
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-400">Historian Fee</span>
              <div class="flex items-baseline gap-1">
                <span class="text-xl font-black text-slate-900 font-display">${priceFormatted}</span>
                <span class="text-[10px] text-slate-500">/ person</span>
              </div>
            </div>

            <button 
              onclick="addExperienceToCart('${exp.id}')"
              class="gold-shimmer-btn px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow"
            >
              <span>Add Guide Tour</span>
              <i data-lucide="plus" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  refreshIcons();
}

/**
 * Render Ancillaries Quick Bar
 */
function renderAncillaries() {
  const container = document.getElementById('ancillaries-container');
  if (!container) return;

  container.innerHTML = ANCILLARIES.map(anc => {
    const priceFormatted = state.formatPrice(anc.priceUSD);
    return `
      <div class="royal-card p-6 rounded-2xl border border-amber-900/20 bg-gradient-to-b from-[#FFFDF9] to-[#F7F1E3] flex flex-col justify-between relative overflow-hidden group">
        <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-400/20 transition-all pointer-events-none"></div>

        <div>
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-amber-400 shadow-md">
              <i data-lucide="${anc.icon}" class="w-6 h-6"></i>
            </div>
            <span class="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-full uppercase tracking-wider border border-amber-300/60">
              ${anc.badge}
            </span>
          </div>

          <h3 class="font-serif text-lg font-bold text-slate-900 mb-2">${anc.title}</h3>
          <p class="text-xs text-slate-600 mb-4 leading-relaxed">${anc.tagline}</p>

          <ul class="space-y-2 mb-6">
            ${anc.features.map(f => `
              <li class="text-xs text-slate-700 flex items-start gap-2">
                <i data-lucide="shield-check" class="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5"></i>
                <span>${f}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="pt-4 border-t border-amber-900/15 flex items-center justify-between">
          <div>
            <span class="text-[10px] uppercase font-bold text-slate-400">Concierge Fee</span>
            <div class="text-xl font-black text-slate-900 font-display">${priceFormatted}</div>
          </div>
          <button 
            onclick="openAncillaryModal('${anc.id}')"
            class="px-4 py-2 rounded-lg bg-slate-900 text-amber-300 font-semibold text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors shadow flex items-center gap-1.5"
          >
            <span>Activate</span>
            <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  refreshIcons();
}

/**
 * Cart & Itinerary Drawer State & UI Sync
 */
function setupCartDrawer() {
  const triggerBtn = document.getElementById('cart-drawer-trigger');
  const bottomBarTrigger = document.getElementById('floating-bar-trigger');
  const closeBtn = document.getElementById('close-cart-drawer');
  const backdrop = document.getElementById('cart-drawer-backdrop');
  const drawer = document.getElementById('cart-drawer-panel');

  const openDrawer = () => {
    backdrop.classList.add('active');
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    backdrop.classList.remove('active');
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (triggerBtn) triggerBtn.addEventListener('click', openDrawer);
  if (bottomBarTrigger) bottomBarTrigger.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeDrawer();
    });
  }

  // Clear cart button
  const clearBtn = document.getElementById('btn-clear-cart');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear your Royal Heritage Itinerary?')) {
        state.clearCart();
      }
    });
  }

  // Checkout button
  const checkoutBtn = document.getElementById('btn-proceed-checkout');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      closeDrawer();
      openCheckoutModal();
    });
  }
}

function updateCartUI() {
  const totals = state.getCartTotals();
  
  // Header badge counters
  const badgeCounts = document.querySelectorAll('.cart-count-badge');
  badgeCounts.forEach(badge => {
    badge.textContent = totals.count;
    if (totals.count > 0) {
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  });

  // Floating bottom bar update
  const floatingBar = document.getElementById('floating-itinerary-bar');
  const floatingCount = document.getElementById('floating-itinerary-count');
  const floatingTotal = document.getElementById('floating-itinerary-total');
  
  if (floatingBar && floatingCount && floatingTotal) {
    if (totals.count > 0) {
      floatingBar.classList.remove('translate-y-32', 'opacity-0');
      floatingBar.classList.add('translate-y-0', 'opacity-100');
      floatingCount.textContent = `${totals.count} Heritage Item${totals.count > 1 ? 's' : ''}`;
      floatingTotal.textContent = totals.totalFormatted;
    } else {
      floatingBar.classList.remove('translate-y-0', 'opacity-100');
      floatingBar.classList.add('translate-y-32', 'opacity-0');
    }
  }

  // Drawer list items
  const itemsContainer = document.getElementById('drawer-items-list');
  const subtotalElem = document.getElementById('drawer-subtotal');
  const taxElem = document.getElementById('drawer-tax');
  const totalElem = document.getElementById('drawer-total');

  if (subtotalElem) subtotalElem.textContent = totals.subtotalFormatted;
  if (taxElem) taxElem.textContent = totals.taxFormatted;
  if (totalElem) totalElem.textContent = totals.totalFormatted;

  if (!itemsContainer) return;

  if (state.cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="p-8 text-center my-auto">
        <div class="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
          <i data-lucide="scroll" class="w-8 h-8"></i>
        </div>
        <h4 class="font-serif text-lg font-bold text-slate-800 mb-1">Your Heritage Itinerary is Empty</h4>
        <p class="text-xs text-slate-500 max-w-xs mx-auto mb-4">Choose from our curated 15th-century forts, luxury heritage trains, or private archaeologist walks to compose your royal voyage.</p>
      </div>
    `;
    refreshIcons();
    return;
  }

  itemsContainer.innerHTML = state.cart.map(item => {
    const itemPriceFormatted = state.formatPrice(item.priceUSD);
    let typeIcon = 'home';
    if (item.type === 'transport') typeIcon = 'train';
    if (item.type === 'experience') typeIcon = 'compass';
    if (item.type === 'ancillary') typeIcon = 'shield-check';

    return `
      <div class="p-4 rounded-xl bg-white border border-stone-200/80 shadow-sm flex items-start gap-3 relative group">
        <img src="${item.image}" alt="${item.title}" class="w-16 h-16 rounded-lg object-cover shrink-0 border border-stone-200">
        
        <div class="flex-1 min-w-0 pr-6">
          <div class="flex items-center gap-1 text-[10px] uppercase font-bold text-amber-700 tracking-wider mb-0.5">
            <i data-lucide="${typeIcon}" class="w-3 h-3 text-amber-600"></i>
            <span>${item.badge}</span>
          </div>
          <h5 class="text-xs font-bold text-slate-900 truncate font-serif mb-1" title="${item.title}">${item.title}</h5>
          
          <div class="text-[11px] text-slate-500 flex items-center gap-2">
            <span>${item.dateOrDuration}</span>
            <span>•</span>
            <span>${item.guests}</span>
          </div>

          <div class="mt-2 flex items-baseline gap-1">
            <span class="text-xs text-slate-400 font-medium">Rate:</span>
            <span class="text-sm font-black text-slate-900 font-display">${itemPriceFormatted}</span>
          </div>
        </div>

        <button 
          onclick="state.removeFromCart('${item.cartId}')" 
          class="absolute top-3 right-3 text-slate-400 hover:text-red-600 transition-colors p-1"
          title="Remove from itinerary"
        >
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
    `;
  }).join('');

  refreshIcons();
}

/**
 * Direct Add-to-Cart helpers
 */
function bookStayDirect(stayId) {
  const stay = HERITAGE_STAYS.find(s => s.id === stayId);
  if (!stay) return;

  state.addToCart({
    type: 'stay',
    refId: stay.id,
    title: `${stay.title} (${stay.roomType})`,
    badge: stay.eraBadge,
    dateOrDuration: '2 Nights (Oct 14 - Oct 16)',
    guests: '2 Royalty',
    priceUSD: stay.pricePerNightUSD * 2,
    image: stay.image
  });
}

function addTransportToCart(transId) {
  const trans = MULTIMODAL_TRANSPORTS.find(t => t.id === transId);
  if (!trans) return;

  state.addToCart({
    type: 'transport',
    refId: trans.id,
    title: trans.title,
    badge: `${trans.mode} • ${trans.eraBadge}`,
    dateOrDuration: trans.duration,
    guests: '2 Passengers',
    priceUSD: trans.priceUSD,
    image: trans.image
  });
}

function addExperienceToCart(expId) {
  const exp = HISTORICAL_EXPERIENCES.find(e => e.id === expId);
  if (!exp) return;

  state.addToCart({
    type: 'experience',
    refId: exp.id,
    title: `${exp.title} (Guided by ${exp.guide})`,
    badge: exp.category,
    dateOrDuration: exp.duration,
    guests: '2 Travellers',
    priceUSD: exp.priceUSD * 2,
    image: exp.image
  });
}

/**
 * Modal Handling Logic
 */
function setupModalDismissals() {
  const modals = document.querySelectorAll('.modal-wrapper');
  modals.forEach(m => {
    m.addEventListener('click', (e) => {
      if (e.target === m || e.target.classList.contains('btn-close-modal')) {
        closeAllModals();
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
}

function closeAllModals() {
  document.querySelectorAll('.modal-wrapper').forEach(m => {
    m.classList.add('hidden');
    m.classList.remove('flex');
  });
  document.body.style.overflow = '';
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    refreshIcons();
  }
}

/**
 * Stay Details Modal
 */
function openStayDetailModal(stayId) {
  const stay = HERITAGE_STAYS.find(s => s.id === stayId);
  if (!stay) return;

  const modalBody = document.getElementById('stay-modal-body');
  if (!modalBody) return;

  const priceFormatted = state.formatPrice(stay.pricePerNightUSD);

  modalBody.innerHTML = `
    <div class="relative h-72 sm:h-80 overflow-hidden">
      <img src="${stay.image}" alt="${stay.title}" class="w-full h-full object-cover">
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

      <button class="btn-close-modal absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-800 transition-colors">
        <i data-lucide="x" class="w-5 h-5 pointer-events-none"></i>
      </button>

      <div class="absolute bottom-5 left-6 right-6 text-white">
        <div class="flex items-center gap-2 mb-1.5">
          <span class="era-badge px-3 py-1 rounded-full text-xs font-semibold">${stay.eraBadge}</span>
          <span class="proximity-badge px-2.5 py-0.5 rounded text-xs">${stay.monumentProximity}</span>
        </div>
        <h2 class="font-display text-2xl sm:text-3xl font-bold text-white">${stay.title}</h2>
        <p class="text-xs text-amber-200/90 flex items-center gap-1.5 mt-1">
          <i data-lucide="map-pin" class="w-3.5 h-3.5 text-amber-400"></i>
          <span>${stay.location}</span>
        </p>
      </div>
    </div>

    <div class="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
      <div>
        <h4 class="font-serif text-base font-bold text-slate-900 mb-2">Historical Significance & Architectural Heritage</h4>
        <p class="text-sm text-slate-600 leading-relaxed">${stay.description}</p>
      </div>

      <div class="bg-amber-50/80 p-4 rounded-xl border border-amber-200/70">
        <h5 class="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <i data-lucide="landmark" class="w-4 h-4 text-amber-700"></i>
          <span>Curated Architectural Chronology</span>
        </h5>
        <ul class="space-y-1.5">
          ${stay.historicalHighlights.map(h => `
            <li class="text-xs text-slate-700 flex items-start gap-2">
              <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5"></i>
              <span>${h}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <div>
        <h4 class="font-serif text-base font-bold text-slate-900 mb-2">Royal Amenities Included</h4>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          ${stay.amenities.map(a => `
            <div class="p-2.5 rounded-lg bg-stone-100 border border-stone-200 text-xs font-medium text-slate-800 flex items-center gap-2">
              <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-amber-600"></i>
              <span>${a}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Booking selection customizer inside modal -->
      <div class="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span class="text-xs text-amber-300 font-semibold block uppercase tracking-wider">Suite Configuration</span>
          <div class="text-lg font-bold font-serif">${stay.roomType}</div>
          <span class="text-xs text-slate-400">Includes Royal Breakfast in Court & Butler Service</span>
        </div>

        <div class="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div class="text-right">
            <span class="text-2xl font-black text-amber-300 font-display">${priceFormatted}</span>
            <span class="text-xs text-slate-400 block">/ night</span>
          </div>

          <button 
            onclick="bookStayDirect('${stay.id}'); closeAllModals();"
            class="gold-shimmer-btn px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
          >
            <span>Confirm Stay</span>
            <i data-lucide="bookmark-check" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  openModal('stay-modal');
  refreshIcons();
}

/**
 * Ancillary Application Modal
 */
function openAncillaryModal(ancillaryId) {
  const anc = ANCILLARIES.find(a => a.id === ancillaryId);
  if (!anc) return;

  const modalBody = document.getElementById('ancillary-modal-body');
  if (!modalBody) return;

  const priceFormatted = state.formatPrice(anc.priceUSD);

  modalBody.innerHTML = `
    <div class="p-6 sm:p-8">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center">
            <i data-lucide="${anc.icon}" class="w-6 h-6"></i>
          </div>
          <div>
            <span class="text-xs font-bold text-amber-700 tracking-wide uppercase">${anc.badge}</span>
            <h3 class="font-display text-xl sm:text-2xl font-bold text-slate-900">${anc.title}</h3>
          </div>
        </div>
        <button class="btn-close-modal text-slate-400 hover:text-slate-800">
          <i data-lucide="x" class="w-6 h-6 pointer-events-none"></i>
        </button>
      </div>

      <p class="text-xs sm:text-sm text-slate-600 mb-6">${anc.tagline}</p>

      <div class="space-y-4 mb-6">
        <div class="bg-amber-50/70 p-4 rounded-xl border border-amber-200">
          <h5 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Coverage & Features</h5>
          <ul class="space-y-2">
            ${anc.features.map(f => `
              <li class="text-xs text-slate-700 flex items-center gap-2">
                <i data-lucide="check-circle-2" class="w-4 h-4 text-amber-600 shrink-0"></i>
                <span>${f}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Passport / Registered Traveller Name</label>
          <input type="text" id="anc-traveller-name" value="Lord Alexander Wright" class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-amber-500">
        </div>
      </div>

      <div class="pt-4 border-t border-stone-200 flex items-center justify-between">
        <div>
          <span class="text-[10px] uppercase font-bold text-slate-400">Total Fee</span>
          <div class="text-2xl font-black text-slate-900 font-display">${priceFormatted}</div>
        </div>

        <button 
          onclick="confirmAncillary('${anc.id}'); closeAllModals();"
          class="gold-shimmer-btn px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider shadow flex items-center gap-2"
        >
          <span>Add to Itinerary</span>
          <i data-lucide="shield-check" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  `;

  openModal('ancillary-modal');
  refreshIcons();
}

function confirmAncillary(ancId) {
  const anc = ANCILLARIES.find(a => a.id === ancId);
  if (!anc) return;

  state.addToCart({
    type: 'ancillary',
    refId: anc.id,
    title: anc.title,
    badge: anc.badge,
    dateOrDuration: 'Instant Royal Protection',
    guests: '1 Insured VIP',
    priceUSD: anc.priceUSD,
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80'
  });
}

/**
 * Royal Checkout & Printable Voucher Generator
 */
function openCheckoutModal() {
  const modalBody = document.getElementById('checkout-modal-body');
  if (!modalBody) return;

  const totals = state.getCartTotals();

  modalBody.innerHTML = `
    <div class="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
      <div class="flex items-center justify-between border-b border-amber-900/10 pb-4 mb-6">
        <div>
          <span class="text-xs font-bold text-amber-700 tracking-widest uppercase">Imperial Concierge</span>
          <h2 class="font-display text-2xl font-bold text-slate-900">Royal Heritage Checkout</h2>
        </div>
        <button class="btn-close-modal text-slate-400 hover:text-slate-800">
          <i data-lucide="x" class="w-6 h-6 pointer-events-none"></i>
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <!-- Guest Details Form -->
        <div class="lg:col-span-3 space-y-4">
          <h4 class="font-serif text-sm font-bold text-slate-900 uppercase tracking-wider">Primary Traveller Dignitary</h4>
          
          <div class="grid grid-cols-3 gap-3">
            <div class="col-span-1">
              <label class="block text-[11px] font-semibold text-slate-600 mb-1">Title</label>
              <select class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-amber-500 bg-white">
                <option>Lord</option>
                <option>Lady</option>
                <option>Sire</option>
                <option>Madame</option>
                <option>Mr.</option>
                <option>Ms.</option>
              </select>
            </div>
            <div class="col-span-2">
              <label class="block text-[11px] font-semibold text-slate-600 mb-1">Full Name</label>
              <input type="text" id="chk-name" value="Lord Alexander Wright" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-amber-500">
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-semibold text-slate-600 mb-1">Royal Dispatch Email</label>
              <input type="email" id="chk-email" value="alexander.wright@royalheritagemail.org" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-amber-500">
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-slate-600 mb-1">Passport / Residence Country</label>
              <input type="text" id="chk-country" value="United Kingdom" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-amber-500">
            </div>
          </div>

          <h4 class="font-serif text-sm font-bold text-slate-900 uppercase tracking-wider pt-2">Royal Payment Option</h4>
          <div class="space-y-2">
            <label class="flex items-center gap-3 p-3 rounded-xl border-2 border-amber-500 bg-amber-50/50 cursor-pointer">
              <input type="radio" name="pay_mode" checked class="accent-amber-600">
              <div class="flex-1 text-xs">
                <span class="font-bold text-slate-900 block">Heritage Crown Concierge Card (Instant Guarantee)</span>
                <span class="text-slate-500 text-[11px]">Zero international exchange charge, includes complimentary butler</span>
              </div>
              <i data-lucide="credit-card" class="w-4 h-4 text-amber-600"></i>
            </label>

            <label class="flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:border-amber-400 bg-white cursor-pointer">
              <input type="radio" name="pay_mode" class="accent-amber-600">
              <div class="flex-1 text-xs">
                <span class="font-bold text-slate-900 block">Imperial Sovereign Bank Wire</span>
                <span class="text-slate-500 text-[11px]">Direct transfer via sovereign central clearance</span>
              </div>
              <i data-lucide="landmark" class="w-4 h-4 text-slate-500"></i>
            </label>
          </div>
        </div>

        <!-- Itinerary Summary Box -->
        <div class="lg:col-span-2 bg-[#F9F5EC] p-5 rounded-2xl border border-amber-900/15 flex flex-col justify-between">
          <div>
            <h4 class="font-serif text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Voyage Summary</h4>
            <div class="space-y-2.5 mb-4 max-h-48 overflow-y-auto pr-1">
              ${state.cart.map(item => `
                <div class="text-xs flex items-center justify-between pb-2 border-b border-stone-200/60">
                  <div class="truncate pr-2">
                    <span class="font-semibold text-slate-800 block truncate">${item.title}</span>
                    <span class="text-[10px] text-slate-500">${item.badge}</span>
                  </div>
                  <span class="font-bold text-slate-900 shrink-0 font-display">${state.formatPrice(item.priceUSD)}</span>
                </div>
              `).join('')}
            </div>

            <div class="space-y-1.5 pt-2 text-xs">
              <div class="flex justify-between text-slate-600">
                <span>Subtotal (${totals.count} items)</span>
                <span class="font-medium font-display">${totals.subtotalFormatted}</span>
              </div>
              <div class="flex justify-between text-slate-600">
                <span>12% Heritage Conservation Tax</span>
                <span class="font-medium font-display">${totals.taxFormatted}</span>
              </div>
              <div class="flex justify-between text-slate-900 font-bold pt-2 border-t border-stone-300 text-sm">
                <span class="font-serif">Grand Total</span>
                <span class="text-amber-800 text-lg font-display">${totals.totalFormatted}</span>
              </div>
            </div>
          </div>

          <button 
            id="btn-confirm-royal-order"
            onclick="executeRoyalOrder()"
            class="gold-shimmer-btn w-full mt-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
          >
            <span>Seal Royal Booking</span>
            <i data-lucide="stamp" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  openModal('checkout-modal');
  refreshIcons();
}

function executeRoyalOrder() {
  const modalBody = document.getElementById('checkout-modal-body');
  if (!modalBody) return;

  const totals = state.getCartTotals();
  const bookingRef = 'GTTP-' + Math.floor(100000 + Math.random() * 900000);
  const guestName = document.getElementById('chk-name')?.value || 'Lord Alexander Wright';

  modalBody.innerHTML = `
    <div class="p-6 sm:p-10 text-center" id="printable-voucher">
      <div class="w-20 h-20 rounded-full bg-amber-500/20 text-amber-700 mx-auto flex items-center justify-center mb-4 border-2 border-amber-500 shadow-inner">
        <i data-lucide="crown" class="w-10 h-10"></i>
      </div>

      <span class="text-xs font-bold text-amber-700 tracking-widest uppercase block mb-1">Official Imperial Certificate</span>
      <h2 class="font-display text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Voyage Confirmed & Sealed</h2>
      <p class="text-xs text-slate-600 max-w-md mx-auto mb-6">Your luxury heritage expedition has been ratified under Royal Seal. An official itinerary parchment with sealed access passes has been dispatched.</p>

      <div class="bg-amber-50/70 p-6 rounded-2xl border-2 border-dashed border-amber-300 max-w-lg mx-auto text-left mb-6">
        <div class="flex justify-between items-start border-b border-amber-200/80 pb-3 mb-3">
          <div>
            <span class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Royal Reference Seal</span>
            <div class="font-mono text-base font-black text-amber-900 tracking-wider">${bookingRef}</div>
          </div>
          <div class="text-right">
            <span class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Primary Dignitary</span>
            <div class="text-xs font-bold text-slate-800">${guestName}</div>
          </div>
        </div>

        <div class="text-xs space-y-2 mb-4">
          <div class="font-semibold text-slate-700 mb-1">Confirmed Itinerary Elements:</div>
          ${state.cart.map(item => `
            <div class="flex items-center justify-between text-slate-600 pl-2 border-l-2 border-amber-500">
              <span class="truncate pr-2">${item.title}</span>
              <span class="font-display font-semibold shrink-0">${state.formatPrice(item.priceUSD)}</span>
            </div>
          `).join('')}
        </div>

        <div class="pt-3 border-t border-amber-200 flex justify-between items-baseline">
          <span class="text-xs font-bold text-slate-800">Total Settled:</span>
          <span class="text-xl font-black text-amber-900 font-display">${totals.totalFormatted}</span>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-center gap-4">
        <button 
          onclick="window.print()" 
          class="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-100 flex items-center gap-2"
        >
          <i data-lucide="printer" class="w-4 h-4"></i>
          <span>Print Royal Voucher</span>
        </button>
        <button 
          onclick="state.clearCart(); closeAllModals();" 
          class="gold-shimmer-btn px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow flex items-center gap-2"
        >
          <span>Return to Citadel Explorer</span>
          <i data-lucide="compass" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  `;

  refreshIcons();
}

/**
 * Search form handler in header
 */
function setupSearchForm() {
  const globalSearchInput = document.getElementById('global-search-input');
  if (globalSearchInput) {
    globalSearchInput.addEventListener('input', (e) => {
      const q = e.target.value;
      renderStays(q);
      renderExperiences(q);
    });
  }
}

/**
 * Toast notification
 */
function showToast(message) {
  let toast = document.getElementById('royal-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'royal-toast';
    toast.className = 'fixed top-6 right-6 z-50 transform transition-all duration-300 translate-y-[-20px] opacity-0 pointer-events-none';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <div class="bg-slate-900 text-amber-100 px-4 py-3 rounded-xl border border-amber-400/40 shadow-2xl flex items-center gap-3 backdrop-blur-md">
      <div class="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
        <i data-lucide="bell" class="w-4 h-4"></i>
      </div>
      <span class="text-xs font-medium tracking-wide">${message}</span>
    </div>
  `;

  refreshIcons();

  toast.classList.remove('translate-y-[-20px]', 'opacity-0', 'pointer-events-none');
  toast.classList.add('translate-y-0', 'opacity-100');

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-[-20px]', 'opacity-0', 'pointer-events-none');
  }, 3500);
}

// Expose modal openers to global scope for HTML inline onclick
window.openStayDetailModal = openStayDetailModal;
window.bookStayDirect = bookStayDirect;
window.addTransportToCart = addTransportToCart;
window.addExperienceToCart = addExperienceToCart;
window.openAncillaryModal = openAncillaryModal;
window.confirmAncillary = confirmAncillary;
window.openCheckoutModal = openCheckoutModal;
window.executeRoyalOrder = executeRoyalOrder;
window.closeAllModals = closeAllModals;
