/**
 * Glory to the Past - Luxury Heritage Travel Platform
 * Comprehensive Historical & Experiential Datasets
 */

const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', rate: 1.0 },
  INR: { code: 'INR', symbol: '₹', rate: 83.2 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92 }
};

const HISTORICAL_ERAS = [
  { id: 'all', label: 'All Eras', icon: 'sparkles' },
  { id: 'ancient', label: 'Ancient Civilizations', icon: 'landmark' },
  { id: 'royal', label: 'Royal Kingdoms & Forts', icon: 'crown' },
  { id: 'colonial', label: 'Colonial Heritage', icon: 'compass' },
  { id: 'spiritual', label: 'Sacred & Spiritual', icon: 'flame' }
];

const HERITAGE_STAYS = [
  {
    id: 'stay-1',
    title: 'Neemrana Fort-Palace',
    location: 'Alwar, Rajasthan, India',
    eraCategory: 'royal',
    eraBadge: '15th-Century Medieval Fort (1464 AD)',
    monumentProximity: '150m from Neemrana Baori Stepwell',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',
    pricePerNightUSD: 260,
    rating: 4.92,
    reviewsCount: 420,
    roomType: 'Mahal Turret Suite',
    description: 'Carved into the rugged Aravalli hillside across 14 tiers, this grand 553-year-old bastion features hanging palace gardens, Roman-style step pools, and sweeping sunset views.',
    amenities: ['Heritage Tiered Pool', 'Amphitheatre Dining', 'Vintage Camel Safari', 'Ayurvedic Royal Spa', 'Vintage Car Transfer'],
    historicalHighlights: [
      'Built by Prithviraj Chauhan III successors in 1464 AD',
      'Restored using traditional lime mortar and unbaked brickwork',
      'Features 7 distinct palace wings connected by ramparts'
    ]
  },
  {
    id: 'stay-2',
    title: 'Taj Lake Palace Citadel',
    location: 'Lake Pichola, Udaipur, Rajasthan',
    eraCategory: 'royal',
    eraBadge: '18th-Century Mewar Palace (1746 AD)',
    monumentProximity: 'Overlooking City Palace (300m by Royal Boat)',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
    pricePerNightUSD: 580,
    rating: 4.98,
    reviewsCount: 890,
    roomType: 'Royal Lake View Chamber',
    description: 'An ethereal island of white marble floating amidst azure lake waters. Commissioned by Maharana Jagat Singh II as a summer retreat of serene opulence.',
    amenities: ['Floating Heritage Pool', 'Jharokha Private Dining', '24/7 Mewar Butler', 'Solar Gondola Access', 'Astrology Session'],
    historicalHighlights: [
      'Original Jag Niwas marble pleasure palace built 1743-1746',
      'Intricate cusped arches, stained glass and black-and-white marble tiles',
      'Filming location for historic cinematic classics'
    ]
  },
  {
    id: 'stay-3',
    title: 'Ahilya Fort Citadel & Retreat',
    location: 'Maheshwar, Madhya Pradesh, India',
    eraCategory: 'royal',
    eraBadge: '18th-Century Holkar Citadel (1765 AD)',
    monumentProximity: 'Direct access to Sacred Narmada Ghats',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80',
    pricePerNightUSD: 340,
    rating: 4.88,
    reviewsCount: 310,
    roomType: 'Bastion Turret Pavilion',
    description: 'Perched high atop sandstone cliffs overlooking the holy Narmada River, where the legendary philosopher Queen Ahilyabai Holkar ruled with justice and equanimity.',
    amenities: ['Riverfront Turret Suite', 'Organic Palace Herb Farm', 'Narmada Tea Cruise', 'Handloom Weaving Studio', 'Temple Chanting Access'],
    historicalHighlights: [
      'Residence of Queen Ahilyabai Holkar, the ascetic patron of sacred sites',
      'Contains undisturbed 250-year-old royal shrines and armory',
      'Zero commercial noise, enveloped by ringing temple bells at dawn'
    ]
  },
  {
    id: 'stay-4',
    title: 'Samode Haveli Courtyard',
    location: 'Old Walled City, Jaipur, Rajasthan',
    eraCategory: 'royal',
    eraBadge: '19th-Century Rajput Haveli (1840 AD)',
    monumentProximity: '400m from Hawa Mahal & City Palace',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
    pricePerNightUSD: 290,
    rating: 4.91,
    reviewsCount: 530,
    roomType: 'Frescoed Heritage Deluxe',
    description: 'A traditional urban residence built with geometric symmetry, intricate frescoes of floral arabesques, serene elephant ramps, and courtyards filled with songbirds.',
    amenities: ['Mughal Fountain Courtyard', 'Frescoed Suite', 'Evening Sitar Recital', 'Vintage Rolls-Royce Chauffeur', 'Royal Cooking Masterclass'],
    historicalHighlights: [
      'Built for the hereditary Rawals of Samode',
      'Hand-painted vegetable pigment ceiling murals preserved in pristine state',
      'Deep verandas designed for passive natural air circulation'
    ]
  },
  {
    id: 'stay-5',
    title: 'The Imperial Raj Pavilion',
    location: 'Janpath, New Delhi, India',
    eraCategory: 'colonial',
    eraBadge: 'Colonial Heritage & Art Deco (1936 AD)',
    monumentProximity: '600m from India Gate & National Museum',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80',
    pricePerNightUSD: 320,
    rating: 4.86,
    reviewsCount: 640,
    roomType: 'Heritage Imperial Suite',
    description: 'The crowning jewel of Lutyens New Delhi, preserving museum-quality colonial lithographs, Victorian chandeliers, and teakwood galleries where historic treaties were drafted.',
    amenities: ['Art Deco Verandahs', 'British Raj High Tea Room', 'Centennial Royal Palms', 'Curated Art Museum Tour', 'Heated Heritage Pool'],
    historicalHighlights: [
      'Inaugurated by Lord Willingdon in 1936',
      'Houses over 5,000 original 17th-20th century Indian art antiquities',
      'Host to historic summits during the pivotal 1940s era'
    ]
  },
  {
    id: 'stay-6',
    title: 'Chettinad Heritage Grand Mansion',
    location: 'Kanadukathan, Sivaganga, Tamil Nadu',
    eraCategory: 'colonial',
    eraBadge: 'Dravidian-Colonial Merchant Palace (1902 AD)',
    monumentProximity: '100m from Palace of Thousand Windows',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80',
    pricePerNightUSD: 210,
    rating: 4.82,
    reviewsCount: 280,
    roomType: 'Teak Pillar Courtyard Suite',
    description: 'Created by the maritime spice & banking magnates of Tamil Nadu, utilizing raw Burmese teak, Italian Carrara marble, and Athangudi handmade terracotta tiles.',
    amenities: ['Burmese Teak Courtyard', 'Belgian Glass Drawing Room', 'Traditional 7-Course Feast', 'Vintage Bullock Cart Ride', 'Architecture Walking Map'],
    historicalHighlights: [
      'Built in 1902 using trade wealth from Ceylon, Burma, and Singapore',
      'Ingenious courtyard rain-harvesting system engineered 120 years ago',
      'Authentic Athangudi tiles manufactured with river sand and oxide'
    ]
  },
  {
    id: 'stay-7',
    title: 'BrijRama Palace on Darbhanga Ghat',
    location: 'Ganga Riverbank, Varanasi, Uttar Pradesh',
    eraCategory: 'spiritual',
    eraBadge: '18th-Century Sacred Maratha Fortress (1812 AD)',
    monumentProximity: '0m directly on Holy Darbhanga Ghat',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1000&q=80',
    pricePerNightUSD: 390,
    rating: 4.96,
    reviewsCount: 710,
    roomType: 'Ganga River View Sanctum',
    description: 'One of the oldest structures along the holy riverfront. Built by the Maratha minister Munshi Sridhar, accessible solely by royal wooden riverboat with private aarti terraces.',
    amenities: ['Riverboat Transfer', 'Private Ganga Aarti Terrace', 'Classical Sarod Recital', 'Sattvic Pure Royal Cuisine', 'Astrological Consultation'],
    historicalHighlights: [
      'Constructed in 1812 with stone imported by waterways from Chunar quarries',
      'Features the historical hand-operated elevator installed in 1918',
      'Unbroken panoramic vistas of the sunrise rituals on the sacred river'
    ]
  },
  {
    id: 'stay-8',
    title: 'Fort Tiracol Heritage Bastion',
    location: 'Tiracol Coastal Cliff, North Goa',
    eraCategory: 'colonial',
    eraBadge: '17th-Century Portuguese Maritime Bastion (1681 AD)',
    monumentProximity: 'Guarding the Terekhol River Mouth',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
    pricePerNightUSD: 240,
    rating: 4.84,
    reviewsCount: 390,
    roomType: 'Cliff-edge Rampart Suite',
    description: 'A fortified armed promontory with ancient brass cannons pointing out to the Arabian Sea. Contains a 270-year-old Baroque church inside its inner stone courtyard.',
    amenities: ['Cliffside Ocean Bastion', 'Baroque Chapel Courtyard', 'Sunset Port Wine Tasting', 'Private Coastal Yacht Charter', 'Dolphin Horizon Walk'],
    historicalHighlights: [
      'Captured by the 44th Portuguese Viceroy of India in 1746',
      'Standing watchtower over pirate routes of the Malabar and Konkan coast',
      'Intact iron gun ports and ramparts for peaceful stargazing'
    ]
  }
];

const MULTIMODAL_TRANSPORTS = [
  {
    id: 'trans-1',
    title: "The Maharajas' Express: Heritage Suite",
    mode: 'Train',
    modeIcon: 'train',
    eraBadge: 'Gilded Age Luxury Rail',
    origin: 'New Delhi',
    destination: 'Agra - Ranthambore - Jaipur - Mumbai',
    duration: '4 Days / 3 Nights',
    priceUSD: 1850,
    rating: 4.98,
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80',
    description: 'Voted the World’s Leading Luxury Train. Features pneumatic suspension, private en-suite royal bathrooms, curated vintage crystal service, and off-train monument access.',
    inclusions: ['Private 24h Royal Valet', 'All Fine-Dining Banquets & Vintage Wines', 'Fast-Track Monument Permits', 'Luxury Coach Excursions']
  },
  {
    id: 'trans-2',
    title: 'Royal Ganga River Twilight Cruise',
    mode: 'Cruise',
    modeIcon: 'ship',
    eraBadge: 'Ancient Sacred Waterways',
    origin: 'Assi Ghat, Varanasi',
    destination: 'Chunar Fort & Ramnagar',
    duration: '6 Hours (Sunset to Twilight)',
    priceUSD: 420,
    rating: 4.93,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    description: 'Glide on handcrafted teak riverboats illuminated by antique brass lanterns. Witness 84 ancient stone ghats come alive with flame offerings and Vedic hymns.',
    inclusions: ['Vedic Chanting on Deck', 'Traditional Thali Dinner by Firelight', 'Aarti Front-Row Mooring', 'Flute & Sitar Ensemble']
  },
  {
    id: 'trans-3',
    title: 'Hampi Ancient Empire Ruins Chopper',
    mode: 'Chopper',
    modeIcon: 'helicopter',
    eraBadge: '14th-Century Vijayanagara Air Tour',
    origin: 'Toranagallu Helipad',
    destination: 'Hampi UNESCO Sacred Ruins',
    duration: '45-Minute Flight',
    priceUSD: 310,
    rating: 4.95,
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
    description: 'Soar directly above the boulder-strewn landscape of the Vijayanagara Empire. Marvel at the stone chariot of Vittala Temple and the Tungabhadra river from the skies.',
    inclusions: ['Live Historian Cockpit Audio', 'VIP Helipad Transfers', 'Commemorative Flight Certificate', 'Aerial Photography Window']
  },
  {
    id: 'trans-4',
    title: 'Rajputana Royal Private Air Charter',
    mode: 'Flight',
    modeIcon: 'plane',
    eraBadge: 'Royal Air Excursion',
    origin: 'Indira Gandhi VIP Terminal, Delhi',
    destination: 'Jaisalmer Golden Fortress Fort',
    duration: '1h 35m Direct',
    priceUSD: 1200,
    rating: 4.91,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
    description: 'Skip modern airport queues with direct private jet charter to historical desert bastions. Enjoy onboard royal cuisine and fast-track clearance.',
    inclusions: ['Tarmac Limousine Escort', 'Curated Rajasthani High Tea onboard', 'Flexible Flight Timing', 'Heavy Luggage Support for Antiques']
  },
  {
    id: 'trans-5',
    title: 'Vintage Royal Enfield 1968 Cast-Iron Fleet',
    mode: 'Bike',
    modeIcon: 'bike',
    eraBadge: 'Classic Motor Heritage',
    origin: 'Jaipur Heritage Outpost',
    destination: 'Nahargarh & Jaigarh Fort Circuit',
    duration: 'Full Day Rental (10 Hours)',
    priceUSD: 85,
    rating: 4.88,
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    description: 'Experience the throaty rhythm of an authentic British-Indian Royal Enfield Bullet through winding fort switchbacks, cobbled lanes, and mountain battlements.',
    inclusions: ['Handcrafted Leather Saddlebags', 'Classic Aviator Goggles & Helmet', 'Offline GPS Fort Roadbook', 'Emergency Support Vehicle']
  },
  {
    id: 'trans-6',
    title: '1934 Vintage Rolls-Royce Chauffeur Tour',
    mode: 'Vintage Car',
    modeIcon: 'car',
    eraBadge: 'Colonial Aristocracy',
    origin: 'Lutyens Heritage Quarter, Delhi',
    destination: 'Humayuns Tomb & Red Fort Ramparts',
    duration: '3.5 Hours Private Ride',
    priceUSD: 190,
    rating: 4.96,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    description: 'Travel like royalty of the 1930s with a liveried chauffeur in a meticulously restored 1934 Rolls-Royce Phantom II Continental.',
    inclusions: ['Liveried Royal Chauffeur', 'Chilled Sparkling Heritage Drinks', 'Exclusive Monument Entry Passes', 'Curated Photo Memories']
  }
];

const HISTORICAL_EXPERIENCES = [
  {
    id: 'exp-1',
    title: 'Secret Subterranean Vaults of Amber Fort',
    category: 'Archaeologist-Led Guides',
    eraCategory: 'royal',
    eraBadge: '16th-Century Military Citadel',
    site: 'Amber Fort, Jaipur',
    guide: 'Dr. Vikramaditya Rathore',
    guideRole: 'ASI Senior Conservator & Epigraphist (22 yrs exp)',
    language: 'English, French, Hindi',
    duration: '3.5 Hours',
    priceUSD: 140,
    rating: 5.0,
    reviewsCount: 184,
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
    description: 'Unlock subterranean corridors, concealed royal water tanks, and military escape tunnels strictly closed to standard ticket holders with an accredited archaeologist.',
    highlights: [
      'Exclusive key access to 16th-century Mughal cannon foundries',
      'Deciphering Persian and Sanskrit builder inscriptions on sandstone',
      'Torchlight exploration of the 1.2km subterranean tunnel to Jaigarh'
    ]
  },
  {
    id: 'exp-2',
    title: 'Ancient Nalanda University Scholar Walk',
    category: 'Spiritual Tours',
    eraCategory: 'ancient',
    eraBadge: '5th-Century Buddhist Monastic University',
    site: 'Nalanda Ruins, Bihar',
    guide: 'Prof. Ananya Sen',
    guideRole: 'Buddhist Epigraphist & Sanskrit Scholar',
    language: 'English, German, Hindi',
    duration: '4 Hours',
    priceUSD: 95,
    rating: 4.95,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    description: 'Walk in the footsteps of Xuanzang and Aryabhata through the red-brick monastic cells that once educated 10,000 scholars from China, Greece, and Persia.',
    highlights: [
      'Understanding Buddhist iconography and ancient terracotta seals',
      'Acoustic resonance demonstration in meditation stupa chambers',
      'Private scholarly discourse on ancient astronomy and logic'
    ]
  },
  {
    id: 'exp-3',
    title: 'Khajuraho Sacred Architecture & Astronomy Decoded',
    category: 'Ancient Monuments',
    eraCategory: 'ancient',
    eraBadge: '10th-Century Chandela Dynasty',
    site: 'Western Temple Complex, Khajuraho',
    guide: 'Dr. R. K. Dixit',
    guideRole: 'Vastu Shastra & Medieval Iconography Expert',
    language: 'English, Italian, Hindi',
    duration: '3 Hours',
    priceUSD: 110,
    rating: 4.92,
    reviewsCount: 215,
    image: 'https://images.unsplash.com/photo-1590059390046-60868f7fba50?auto=format&fit=crop&w=800&q=80',
    description: 'Beyond the famed sensual carvings lies an astounding mathematical and cosmic treatise. Learn how the Kandariya Mahadeva temple charts planetary movements.',
    highlights: [
      'Geometric fractal layout analysis of temple spires (Shikharas)',
      'Sunset shadow alignments that mark solstice days',
      'Philosophical interpretation of dharma, artha, kama, and moksha reliefs'
    ]
  },
  {
    id: 'exp-4',
    title: 'Royal Durbar Banquet & Living Sitar Twilight',
    category: 'Spiritual Tours',
    eraCategory: 'royal',
    eraBadge: 'Living Court Tradition',
    site: 'Private Palace Courtyard, Jaipur',
    guide: 'Ustad Sharafat Ali & Hereditary Court Chefs',
    guideRole: '5th-Generation Sitar Virtuoso & Royal Khansamas',
    language: 'English, Hindi',
    duration: '3.5 Hours',
    priceUSD: 160,
    rating: 4.97,
    reviewsCount: 290,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    description: 'Dine in an illuminated marble pavilion serenaded by hereditary musicians playing classical evening ragas, while enjoying centuries-old ancestral recipes.',
    highlights: [
      '7-course royal thali cooked over slow charcoal in copper vessels',
      'Unbroken lineage of Senia gharana sitar performances',
      'Fragrant rosewater and ittar welcoming ceremony'
    ]
  },
  {
    id: 'exp-5',
    title: 'Shahjahanabad Mughal Culinary & Haveli Secrets',
    category: 'Archaeologist-Led Guides',
    eraCategory: 'royal',
    eraBadge: '17th-Century Mughal Capital (1648 AD)',
    site: 'Old Delhi Walled Alleys',
    guide: 'Sadia Qureshi',
    guideRole: 'Heritage Author & Mughal Historian',
    language: 'English, Urdu, Hindi',
    duration: '4 Hours',
    priceUSD: 80,
    rating: 4.89,
    reviewsCount: 360,
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80',
    description: 'Weave through historic spice bazars to discover hidden Mughal residences with fluted arches, antique bird-cages, and taste culinary recipes preserved since Emperor Shah Jahan.',
    highlights: [
      'Private tea in an active 200-year-old marble courtyard haveli',
      'Secret vantage point over the Jama Masjid domes',
      'Tasting slow-cooked Nihari and saffron-infused Shahi Tukda'
    ]
  },
  {
    id: 'exp-6',
    title: 'Konark Sun Temple Dawn Solar Alignment Walk',
    category: 'Ancient Monuments',
    eraCategory: 'ancient',
    eraBadge: '13th-Century Kalinga Architecture (1250 AD)',
    site: 'Konark Sun Temple, Odisha',
    guide: 'Dr. P. K. Mohanty',
    guideRole: 'UNESCO Heritage Specialist & Archaeo-Astronomer',
    language: 'English, French, Hindi',
    duration: '3 Hours',
    priceUSD: 125,
    rating: 4.94,
    reviewsCount: 165,
    image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80',
    description: 'Witness the first rays of dawn illuminate the colossal stone chariot wheels of the Sun God. Learn how the ancient spokes functioned as precise sundials down to the minute.',
    highlights: [
      'Interactive demonstration of calculating time using wheel spoke shadows',
      'Stories of the legendary magnetic lodestone that anchored the main tower',
      'Micro-carvings of medieval dancers and musicians in chlorite stone'
    ]
  }
];

const ANCILLARIES = [
  {
    id: 'anc-1',
    key: 'insurance',
    title: 'Heritage Relic & Adventure Travel Insurance',
    badge: 'Underwritten by Royal Heritage Lloyd Mutual',
    tagline: 'Comprehensive coverage for high-value antiquities, remote fort expeditions, and air evacuation.',
    priceUSD: 35,
    icon: 'shield-check',
    features: [
      'Up to $500,000 Emergency Medical & Helicopter Extraction',
      'Accidental damage/loss cover for antique purchases up to $25,000',
      'Zero-deductible cancellation for archaeological permits',
      '24/7 Diplomatic and Heritage Emergency Hotline'
    ]
  },
  {
    id: 'anc-2',
    key: 'forex',
    title: 'Royal Crown Heritage Forex Platinum Card',
    badge: 'Zero Markup Multi-Currency Card',
    tagline: 'Physical antique-etched titanium card loaded with 16 global currencies with zero foreign exchange fees.',
    priceUSD: 20,
    icon: 'credit-card',
    features: [
      '0% Foreign Exchange conversion markup worldwide',
      'Real-time interbank conversion rates for USD, INR, EUR, GBP',
      'Complimentary royal airport lounge access at 1,200+ terminals',
      'Emergency cash delivery to remote palace stays'
    ]
  },
  {
    id: 'anc-3',
    key: 'visa',
    title: 'Diplomatic & E-Visa Royal Concierge',
    badge: 'Priority 24-Hour Approval Guarantee',
    tagline: 'Direct consular handling for fast-track tourist and archaeological research visas.',
    priceUSD: 65,
    icon: 'stamp',
    features: [
      'Dedicated personal visa officer verifying paperwork',
      'Fast-track 24 to 48-hour processing window',
      'Special ASI archaeological research & photography permits included',
      'Full refund guarantee in the unlikely event of consular delay'
    ]
  }
];
