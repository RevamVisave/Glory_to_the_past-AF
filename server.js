const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from current directory
app.use(express.static(__dirname));

/**
 * Helper to safely read data.json
 */
async function readDatabase() {
  try {
    const fileContent = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(fileContent);
  } catch (err) {
    console.error('Error reading database file:', err.message);
    // Return empty schema fallback
    return {
      stays: [],
      transport: [],
      experiences: [],
      ancillaries: [],
      bookings: []
    };
  }
}

/**
 * Helper to safely write to data.json
 */
async function writeDatabase(data) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing to database file:', err.message);
    throw err;
  }
}

// ==========================================
// API ROUTES
// ==========================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'Glory to the Past API',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// 1. GET /api/stays
app.get('/api/stays', async (req, res) => {
  try {
    const db = await readDatabase();
    let stays = db.stays || [];

    // Optional query parameter filtering
    const { type, search } = req.query;
    if (type && type !== 'all') {
      stays = stays.filter(s => s.type.toLowerCase() === type.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      stays = stays.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        s.era.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: stays.length,
      data: stays
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve stays', error: error.message });
  }
});

// 2. GET /api/transport
app.get('/api/transport', async (req, res) => {
  try {
    const db = await readDatabase();
    let transport = db.transport || [];

    const { category, search } = req.query;
    if (category && category !== 'all') {
      transport = transport.filter(t => t.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (search) {
      const q = search.toLowerCase();
      transport = transport.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.route.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: transport.length,
      data: transport
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve transport options', error: error.message });
  }
});

// 3. GET /api/experiences
app.get('/api/experiences', async (req, res) => {
  try {
    const db = await readDatabase();
    let experiences = db.experiences || [];

    const { category, search } = req.query;
    if (category && category !== 'all') {
      experiences = experiences.filter(e => e.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (search) {
      const q = search.toLowerCase();
      experiences = experiences.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: experiences.length,
      data: experiences
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve experiences', error: error.message });
  }
});

// GET /api/ancillaries
app.get('/api/ancillaries', async (req, res) => {
  try {
    const db = await readDatabase();
    res.json({
      success: true,
      count: (db.ancillaries || []).length,
      data: db.ancillaries || []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve ancillaries', error: error.message });
  }
});

// 4. POST /api/bookings
app.post('/api/bookings', async (req, res) => {
  try {
    const { items, customer, totalPrice, dates, specialRequests } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'A booking must contain at least one selected item or itinerary element.'
      });
    }

    const db = await readDatabase();
    if (!db.bookings) {
      db.bookings = [];
    }

    // Generate majestic historical reference ID
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    const bookingId = `GP-EXP-${randomHex}-${timestamp}`;

    const newBooking = {
      id: bookingId,
      bookingReference: bookingId,
      items: items.map(item => ({
        id: item.id,
        title: item.title,
        type: item.type || item.category || 'Expedition Service',
        price: Number(item.price) || 0,
        era: item.era || item.duration || 'Historic Odyssey'
      })),
      customer: {
        name: customer?.name || 'Venerable Traveler',
        email: customer?.email || 'guest@glorytothepast.com',
        phone: customer?.phone || 'N/A',
        guests: Number(customer?.guests) || 1
      },
      dates: dates || customer?.dates || {
        departure: new Date().toISOString().split('T')[0],
        return: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
      },
      totalPrice: Number(totalPrice) || items.reduce((acc, it) => acc + (Number(it.price) || 0), 0),
      specialRequests: specialRequests || customer?.specialRequests || 'None',
      status: 'Confirmed & Sovereign Escort Reserved',
      createdAt: new Date().toISOString()
    };

    db.bookings.unshift(newBooking);
    await writeDatabase(db);

    console.log(`[BOOKING CREATED] ${bookingId} for ${newBooking.customer.name} - Total: $${newBooking.totalPrice}`);

    res.status(201).json({
      success: true,
      message: 'Expedition booked successfully! Glory to the Past concierge has received your itinerary.',
      bookingId: bookingId,
      booking: newBooking
    });
  } catch (error) {
    console.error('Error handling booking:', error);
    res.status(500).json({ success: false, message: 'Failed to process booking', error: error.message });
  }
});

// GET /api/bookings (View existing bookings)
app.get('/api/bookings', async (req, res) => {
  try {
    const db = await readDatabase();
    res.json({
      success: true,
      count: (db.bookings || []).length,
      data: db.bookings || []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve bookings', error: error.message });
  }
});

// 5. POST /api/stays (Host / List a new property)
app.post('/api/stays', async (req, res) => {
  try {
    const { title, location, era, price, imageUrl, type, description, amenities } = req.body;

    // Validate required fields
    if (!title || !location || !era || !price) {
      return res.status(400).json({
        success: false,
        message: 'Missing required property details (Title, Location, Era, Price are required).'
      });
    }

    const db = await readDatabase();
    if (!db.stays) {
      db.stays = [];
    }

    // Default fallback image if none provided
    const fallbackImage = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80';

    const newStay = {
      id: `stay_${Date.now()}`,
      title: title.trim(),
      type: type ? type.trim() : 'Vintage Villa',
      location: location.trim(),
      era: era.trim(),
      price: parseFloat(price) || 500,
      rating: 5.0,
      reviewsCount: 1,
      imageUrl: (imageUrl && imageUrl.trim().startsWith('http')) ? imageUrl.trim() : fallbackImage,
      description: description ? description.trim() : 'An exquisite, newly inducted heritage sanctuary rich in historic character and timeless architectural grandeur.',
      amenities: Array.isArray(amenities) && amenities.length > 0 
        ? amenities 
        : ['Private Butler', 'Historic Courtyard', 'Heritage Library', 'Authentic Banquet Dining'],
      hostedByUser: true,
      createdAt: new Date().toISOString()
    };

    // Prepend to list so it appears at the front of the catalog
    db.stays.unshift(newStay);
    await writeDatabase(db);

    console.log(`[NEW PROPERTY LISTED] ${newStay.title} (${newStay.era}) in ${newStay.location} - $${newStay.price}`);

    res.status(201).json({
      success: true,
      message: 'Vintage property listed successfully into the Sovereign Heritage Collection!',
      stay: newStay,
      stays: db.stays
    });
  } catch (error) {
    console.error('Error hosting property:', error);
    res.status(500).json({ success: false, message: 'Failed to list property', error: error.message });
  }
});

// Fallback to index.html for root
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log('====================================================');
  console.log('🏛️  GLORY TO THE PAST — HERITAGE BOOKING PLATFORM');
  console.log(`✨ Server running on: http://localhost:${PORT}`);
  console.log(`📜 API endpoints active on: http://localhost:${PORT}/api/`);
  console.log('====================================================');
});
