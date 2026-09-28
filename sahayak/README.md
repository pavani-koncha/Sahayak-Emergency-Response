# Sahayak - Emergency Assistance When Every Second Matters

## Problem Statement
During an emergency, a person may not have enough time to search for emergency numbers, explain their location, contact family members, or find nearby emergency services.

## Solution
Sahayak provides a fast and simple emergency-assistance system where a user can trigger an SOS alert, share their location, contact trusted emergency contacts, and quickly access emergency services. The core principle is: FEWER STEPS → FASTER HELP.

## Key Features
- **One-Tap SOS Alert:** Instantly record emergencies and track your location.
- **Location Sharing:** Automatically capture your GPS location and generate shareable links.
- **Emergency Contacts:** Pre-configure trusted contacts and reach them instantly.
- **Quick Access to Emergency Services:** Verified national emergency numbers (112, etc.) at your fingertips.
- **Nearby Help:** Quickly locate hospitals, police stations, and fire stations around you using your real-time location.
- **Alert History:** Maintain a log of past alerts and their recorded locations.
- **Safety Center:** Concise, actionable guidance for different emergency situations.

## Technology Stack
- **Frontend:** React, Vite, TypeScript, Tailwind CSS, Lucide React
- **Backend:** Python, FastAPI, SQLAlchemy
- **Database:** SQLite (easily migratable to PostgreSQL)
- **Authentication:** JWT-based secure authentication with bcrypt password hashing
- **Location:** HTML5 Geolocation API

## Installation

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### Setup Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\Activate.ps1
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables:
   Copy `.env.example` to `.env` and update values if necessary.
   ```bash
   cp .env.example .env
   ```
5. Run the server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   The backend will start at `http://localhost:8000`. The database `sahayak.db` will be initialized automatically.

### Setup Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file in the frontend folder with the following content (or use default):
   ```
   VITE_API_URL=http://localhost:8000/api
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will start at `http://localhost:5173`.

## How to Test the SOS Workflow
1. Register a new user account.
2. Ensure you have allowed browser location permissions.
3. Click the giant red **SOS** button on the dashboard.
4. Confirm the emergency.
5. Your current coordinates will be fetched and an alert will be recorded.
6. The dashboard will enter 'Active Emergency' mode.
7. You can test 'Share Location', 'Call 112', or cancel/resolve the alert.
8. Go to 'Alert History' to see your recorded emergency log.

## Future Improvements
- SMS/Email integrations for automated notifications to primary contacts.
- Live-tracking WebSocket implementation for continuous location updates to responders.
- Push notifications for family members using a dedicated mobile app.
- Migration to PostgreSQL for high availability and larger scale.
