# 🏛️ Glory to the Past — Luxury Heritage & Ancient Travel Platform

"**Glory to the Past**" is an end-to-end, full-stack luxury heritage, ancient travel, and vintage experience booking platform. Step back in time to inhabit fortified medieval ramparts, traverse historic routes aboard gilded carriages, and unlock sealed antiquity sanctuaries with the world's master historians.

---

## 🌟 Tech Stack

- **Frontend**: Pure HTML5, Custom CSS3, and Modular Vanilla JavaScript (ES6+ with Fetch API).
  - Royal Vintage Palette:
    - **Background**: Warm Parchment / Cream (`#FDFBF7`, `#F6F1E7`)
    - **Navigation / Header**: Deep Royal Navy (`#0F172A`, `#1E293B`) with Antique Gold (`#D4AF37`) accents and metallic luster
    - **Highlights / Accents**: Rich Burgundy / Maroon (`#800020`, `#991B1B`)
  - Typography: Google Fonts (`Cinzel`, `Cormorant Garamond`, `Plus Jakarta Sans`).
  - Icons: FontAwesome 6.
- **Backend**: Node.js with Express.js REST API running on **port 5000**.
- **Database**: Local `data.json` managed through Node.js asynchronous file system (`fs.promises`) for live data persistence.
- **CORS**: Fully enabled on Express for cross-origin client interaction, and the Express server also serves the frontend directly at `http://localhost:5000`.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
Open a terminal in the project root directory (`GTTP`) and run:
```bash
npm install
```
*(This installs `express` and `cors`)*

### 2. Start the Express Server
```bash
npm start
```
*Alternatively for auto-reloading during development:*
```bash
npm run dev
```

The terminal will confirm:
```
====================================================
🏛️  GLORY TO THE PAST — HERITAGE BOOKING PLATFORM
✨ Server running on: http://localhost:5000
📜 API endpoints active on: http://localhost:5000/api/
====================================================
```

### 3. Open the Application
Open your web browser and navigate to:
```
http://localhost:5000
```
*(Or open `index.html` directly in your browser or with Live Server)*

---

## 📡 REST API Architecture

All endpoints are hosted under `http://localhost:5000/api/`:

| Method | Endpoint | Description | Sample Request / Query |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/stays` | Returns list of heritage stays (Forts, Royal Palaces, Haveli, Vintage Villas). | `?type=Fort&search=Jodhpur` |
| **POST** | `/api/stays` | Inducts a user-hosted vintage property into `data.json` and returns the newly created property. | `{ "title": "...", "location": "...", "era": "...", "price": 650, "type": "Fort" }` |
| **GET** | `/api/transport` | Returns vintage transport options (Heritage Trains, Choppers, Classic Bikes, Cruises, Historic Flights). | `?category=Heritage+Train` |
| **GET** | `/api/experiences` | Returns archaeologist passes, private historian tours, and monument passes. | `?category=Archaeologist+Pass` |
| **GET** | `/api/ancillaries` | Returns ancillary concierge items (E-Visa, Forex Card, Heritage Insurance). | — |
| **POST** | `/api/bookings` | Accepts an expedition itinerary, validates contact & dates, persists to `data.json`, and returns a unique Booking ID. | `{ "items": [...], "customer": { "name": "Lord Vance", "email": "vance@domain.com" }, "totalPrice": 1250 }` |
| **GET** | `/api/bookings` | Returns all recorded bookings for review or verification. | — |
| **GET** | `/api/health` | Healthcheck route. | — |

---

## 🧭 Key Features & User Flows

### 1. Dynamic Catalog Exploration
- Seamlessly view Forts, Palaces, Havelis, and Vintage Villas with high-resolution imagery, era badges, amenities, and nightly rates.
- Explore Royal Transport (like the *Venice Simplon-Orient-Express*, *Aerial Citadel Choppers*, or *1948 Royal Enfield Cruisers*).
- Reserve Archaeo-Passes (like *Nocturnal Colosseum Hypogeum* or *Petra Treasury Candlelight Twilight Access*).
- Filter any section by category pills or search by destination, era, or monument in real time.

### 2. Live Expedition Cart Drawer
- Click **"Book Stay"**, **"Book Transport"**, or **"Reserve Pass"** on any card to add it to your in-memory & localStorage itinerary.
- The cart trigger in the header displays a live counter badge that pulses on each addition.
- Open the slide-over drawer to inspect your itemized itinerary, remove items, specify departure dates and guest names, and see the calculated subtotal, 5% Historic Preservation Levy, and Grand Total.

### 3. Order Checkout & Instant Confirmation
- Click **"Confirm Booking"** to dispatch the booking payload via `POST /api/bookings`.
- The server saves the booking into `data.json` and mints a unique booking reference ID (e.g., `GP-EXP-7K9A2F-4821`).
- The frontend displays a royal parchment certificate modal with one-click reference ID copying, clears the cart, and notifies the user with a celebratory toast banner.

### 4. Live Property Hosting
- Click **"Host a Property"** in the top navigation to open the host modal.
- Enter property details (Title, Era, Location, Architectural Type, Price, Description, and Image URL or choose a 1-click photo preset).
- Submitting the form sends a `POST /api/stays` request to the backend.
- The property is appended to `data.json` and immediately re-fetched and displayed at the top of the `#stays-grid` without refreshing the page!

---

## 📁 Project Directory Structure

```
GTTP/
├── package.json          # Node.js project manifest & scripts
├── server.js             # Express.js server & REST API (port 5000)
├── data.json             # Seed database & live JSON store
├── index.html            # Royal luxury vintage frontend structure
├── style.css             # Custom CSS3 styling & responsive theme
├── app.js                # Modular Vanilla JavaScript controller
└── README.md             # Documentation & testing walkthrough
```

---

## 📜 Sovereign Preservation Pledge
5% of every expedition booked through *Glory to the Past* is directly designated for the physical structural restoration and maintenance of UNESCO world heritage monuments.
