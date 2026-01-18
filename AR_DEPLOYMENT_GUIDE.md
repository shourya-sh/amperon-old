# AR Lab - Deployment Guide

## Quick Start: Using Local Network IP (Development)

For testing the AR Lab feature during development:

### 1. Find Your Computer's Local IP Address

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your WiFi/Ethernet adapter (e.g., `192.168.1.100`)

**Mac/Linux:**
```bash
ifconfig
# or
ip addr show
```
Look for an address like `192.168.1.x`

### 2. Access the App Using Your IP

Instead of `http://localhost:5173`, use:
```
http://YOUR_IP_ADDRESS:5173
```

Example: `http://192.168.1.100:5173`

### 3. Navigate to AR Lab

Go to: `http://YOUR_IP_ADDRESS:5173/ar`

### 4. Connect Your Phone

1. Make sure your phone is on the **same WiFi network**
2. Click "Connect Phone" 
3. Scan the QR code with your phone
4. Your phone camera will stream to the laptop!

---

## Production Deployment: Firebase Hosting

For production use (no IP address needed), deploy to Firebase:

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Initialize Firebase (if not already done)

```bash
firebase init hosting
```

Select:
- Use existing project (or create new)
- Public directory: `dist`
- Single-page app: `Yes`
- GitHub deploys: `No` (optional)

### 4. Build the App

```bash
npm run build
```

### 5. Deploy to Firebase

```bash
firebase deploy --only hosting
```

### 6. Access Your App

Firebase will give you a URL like:
```
https://your-project-name.web.app
```

Navigate to: `https://your-project-name.web.app/ar`

Now the QR code will work from anywhere! No local network needed.

---

## Troubleshooting

### Phone can't connect:
- ✅ Ensure phone and computer are on same WiFi
- ✅ Use IP address, not `localhost`
- ✅ Check firewall isn't blocking port 5173
- ✅ Try accessing `http://YOUR_IP:5173` from phone browser first

### Camera permission denied:
- ✅ Check browser settings allow camera access
- ✅ HTTPS is required for camera in production (Firebase provides this)
- ✅ Try in Chrome/Safari (best WebRTC support)

### Overshoot AI not detecting components:
- ✅ Ensure good lighting on breadboard
- ✅ Keep camera steady
- ✅ Components should be clearly visible
- ✅ Check Overshoot API key is valid

---

## How It Works

1. **QR Code**: Contains URL to `/ar-connect?peer=ID&session=SESSION_ID`
2. **WebRTC**: Phone and laptop establish peer-to-peer connection via PeerJS
3. **Video Stream**: Phone camera streams to laptop via WebRTC
4. **Overshoot AI**: Analyzes video stream every 1.5 seconds
5. **Component Detection**: Maps detected items to app components
6. **Tutorial Guidance**: Auto-advances based on detected components

---

## Environment Variables

Create `.env` from `.env.example` and fill values. Do not commit secrets.

```env
# --- Hosted Site ---
VITE_SITE_URL=https://circuitco.web.app
CLIENT_ORIGIN=https://circuitco.web.app

# --- Firebase ---
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# --- Collaboration Server ---
VITE_SOCKET_URL=http://localhost:3001

# --- AR Lab (WebRTC) ---
# Leave empty in production (hosted origin is used)
VITE_LAPTOP_IP=
# Optional TURN servers for restrictive networks
VITE_TURN_URLS=
VITE_TURN_USERNAME=
VITE_TURN_CREDENTIAL=

# --- AI ---
VITE_OPENROUTER_API_KEY=your_openrouter_key_here
```

Notes:
- In production hosting, do not set `VITE_LAPTOP_IP`; the QR code will use your hosted domain automatically.
- If you run a hosted collaboration server, point `VITE_SOCKET_URL` to it and ensure CORS allows `CLIENT_ORIGIN`.
