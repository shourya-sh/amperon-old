# AR Phone Connection Setup Guide

## Overview
The AR Lab feature allows you to connect your phone to stream its camera to your laptop for real-time breadboard analysis using the Overshoot AI SDK.

## Quick Setup

### 1. Set Your Laptop's IP Address in `.env`
Edit `.env` and add your laptop's IP address:

```env
VITE_LAPTOP_IP=192.168.1.100
```

**To find your IP address:**
- **Windows:** Open PowerShell and run `ipconfig` - look for "IPv4 Address"
- **Mac/Linux:** Open Terminal and run `ifconfig` or `hostname -I`

### 2. Start the Development Server
```bash
npm run dev
```
The app will run at `http://localhost:5173/ar`

### 3. On Your Laptop
1. Navigate to `http://localhost:5173/ar` (or `http://YOUR_IP:5173/ar`)
2. Click on the "Phone" tab
3. Click "Connect Phone" to generate a QR code
4. The QR code will automatically use your configured IP address

### 4. On Your Phone
1. Open your phone's camera app
2. Scan the QR code shown on your laptop
3. Click the notification or follow the link
4. Allow camera access when prompted
5. Your phone's camera will stream to the laptop

## Troubleshooting

### Connection Timeout or Infinite Loading

**Problem:** Phone shows "Connecting..." but never connects.

**Solutions:**
1. **Verify IP Address:**
   - Run `ipconfig` on Windows or `hostname -I` on Mac/Linux
   - Update `VITE_LAPTOP_IP` in `.env` with the correct IPv4 address
   - Restart `npm run dev`

2. **Check Network:**
   - Ensure both laptop and phone are on the **same WiFi network**
   - Phones on different networks (mobile data) won't work

3. **Firewall:**
   - Check if your firewall is blocking port 5173
   - On Windows: Try disabling firewall temporarily to test
   - On Mac: System Preferences > Security & Privacy > Firewall

4. **Restart Everything:**
   ```bash
   # Stop npm run dev
   # Close the dev server
   # Kill any PeerJS connections
   # Restart npm run dev
   # Reload the page
   ```

5. **Use Environment Variable:**
   - Don't manually replace localhost in the URL
   - Set `VITE_LAPTOP_IP=YOUR.IP.ADDRESS` in `.env`
   - Restart `npm run dev`
   - The QR code will automatically use the correct IP

### Phone Gets Camera Access But Doesn't Stream

- The connection might be dropping due to network issues
- Check WiFi signal strength
- Restart the connection by clicking "Disconnect" then "Connect Phone" again

### "Connection Failed" with Specific Message

The phone shows detailed error messages. Common ones:

- **"Connection timeout"** → Laptop isn't reachable
- **"Unable to establish data connection"** → Wrong IP address or firewall blocking
- **"No camera found"** → Phone's camera is disabled or in use

## Architecture

```
Phone (ARConnectPage)
  ↓ (QR Code URL)
  ↓ Scan → http://YOUR_IP:5173/ar-connect?peer=ID&session=SESSION
  ↓ (PeerJS WebRTC)
Laptop (ARTutorialPage)
  ↓ (Receives video stream)
  ↓ (Sends to Overshoot AI)
Real-time breadboard analysis
```

## Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_LAPTOP_IP` | (none) | Your laptop's IP address for phone connections |
| `VITE_SOCKET_URL` | `http://localhost:3001` | Collaboration server URL |
| `VITE_OPENROUTER_API_KEY` | (none) | AI chat API key |

## PeerJS Connection Details

- **Signaling Server:** PeerJS free tier (https://peerjs.com)
- **STUN Servers:** Google's free STUN servers for NAT traversal
- **Connection Type:** WebRTC peer-to-peer (direct if possible)
- **Timeout:** 15 seconds for initial connection
- **Stream Quality:** 1280x720 H.264 video

## Tips for Best Results

1. ✅ Use 5GHz WiFi if available for better bandwidth
2. ✅ Ensure good lighting on your breadboard
3. ✅ Keep phone steady and close to the breadboard
4. ✅ Don't block the phone's camera lens
5. ✅ Ensure the laptop is actively receiving the stream (don't put it to sleep)

## Development Notes

- Connection state is managed by `arConnectionManager` in `arConnectionService.ts`
- Phone-side logic is in `ARConnectPage.tsx`
- Laptop-side logic is in `ARTutorialPage.tsx`
- QR code is generated using the free QR Server API
- No special signaling server required (uses PeerJS defaults)

## Firebase Deployment

When deploying to Firebase (`firebase deploy --only hosting`):

1. Set `VITE_LAPTOP_IP` in your deployment environment
2. The app will be available at `https://amperon.web.app/ar`
3. Phone connects via `https://amperon.web.app/ar-connect`
4. Note: Cross-origin or CORS issues may arise - test thoroughly

## Security Notes

- Connections are peer-to-peer (direct between devices when possible)
- Data passes through PeerJS signaling servers only for initial handshake
- Camera stream is encrypted via WebRTC DTLS
- No video is stored or logged
