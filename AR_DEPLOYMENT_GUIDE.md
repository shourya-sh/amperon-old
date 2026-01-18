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

Make sure you have these in your `.env` file:

```env
# Overshoot AI (already configured)
VITE_OVERSHOOT_API_KEY=ovs_3869c2f26aff295082c87e4a4fb75a3a

# Firebase (for deployment)
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_domain_here
# ... other Firebase config
```

The Overshoot API key is already set in the code, but for security in production, you should move it to environment variables.
