# Noida Energy Dashboard

A full-stack 3D digital twin and energy analytics dashboard for Noida & Greater Noida, India.

## Setup & Run Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
- A free Mapbox account → get token at [mapbox.com](https://mapbox.com)

### Step 1 — Backend
```bash
cd backend
pip install -r requirements.txt
python data/seed_data.py          # generates noida_zones.json
uvicorn main:app --reload --port 8000
```

### Step 2 — Frontend
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:
```env
VITE_MAPBOX_TOKEN=pk.your_mapbox_token_here
VITE_API_BASE=http://localhost:8000
```

Start the frontend development server:
```bash
npm run dev
```

### Step 3 — Verify
- Open `http://localhost:5173`
- The 3D map should load with colored bars over Noida.
- Hover over a bar → tooltip appears.
- Click a bar → detail panel slides in.
- Navigate to Insights → charts load.
- Navigate to Predict → fill form, click predict → result animates in.

## Architecture Notes
- **deck.gl + React 18**: Using `@deck.gl/react` DeckGL component for optimal performance.
- **Data Filtering**: Client-side filtering via Framer Motion toggles to prevent redundant API calls.
- **Dark Mode Engine**: Tailwind `darkMode: 'class'` controls the tokens across backgrounds, panels, and tooltips.
- **Interactive Cursor**: Implements a global `cursor: none` overriding default cursors in favor of a responsive 32px lagging indigo ring.
