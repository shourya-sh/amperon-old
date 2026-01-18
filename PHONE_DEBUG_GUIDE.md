# 🔍 Phone Connection Debugging Guide

## Step-by-Step Debugging Process

### 1️⃣ **First - Test Basic Connectivity**

On your phone, open browser and go to:
```
http://YOUR_LAPTOP_IP:5173/test.html
```

Replace `YOUR_LAPTOP_IP` with the value from your `.env` file (VITE_LAPTOP_IP)

**Example:** If your IP is `172.25.5.122`:
```
http://172.25.5.122:5173/test.html
```

#### ✅ **If this loads:**
- Your phone CAN reach your laptop
- Problem is with the React app
- Continue to Step 2

#### ❌ **If this doesn't load:**
- Your phone CANNOT reach your laptop
- **FIX:**
  1. Make sure both devices on same WiFi
  2. Check your IP address is correct: Run `ipconfig` on laptop
  3. Update `.env` with correct IP
  4. Restart `npm run dev`
  5. Check Windows Firewall isn't blocking port 5173

---

### 2️⃣ **Second - Check AR Connect Page Loads**

On your phone, go to:
```
http://YOUR_LAPTOP_IP:5173/ar-connect?peer=test&session=test
```

**What you should see:**

#### ✅ **Success Signs:**
- Page loads (any content appears)
- Green/black background
- Header says "Amperon AR Connect"
- Yellow debug banner at top showing status
- You'll see console logs if you open browser DevTools

#### ❌ **If blank/white screen:**
1. Open phone browser developer tools (if available)
2. Check JavaScript console for errors
3. Take screenshot and check error message

#### ❌ **If "Page Not Found" or similar:**
- Route not configured properly
- Check laptop terminal for errors

---

### 3️⃣ **Third - Check Browser Console**

If page loads but doesn't work:

**On Phone (if possible):**
1. Open browser DevTools/Console
2. Look for console.log messages starting with emojis:
   - 🚀 Component loaded
   - 📱 Parameters
   - 🔵 useEffect running
   - 🔌 Connection starting
   - ❌ Errors

**On Laptop:**
1. Open `http://localhost:5173/ar`
2. Open DevTools Console (F12)
3. Click "Connect Phone"
4. Watch for PeerJS connection messages

---

### 4️⃣ **Fourth - Test QR Code URL**

On laptop:
1. Go to `http://localhost:5173/ar`
2. Click "Phone" tab
3. Click "Connect Phone"
4. Look at QR code
5. **MANUALLY TYPE** the URL shown in the yellow box into phone browser

**The URL should look like:**
```
http://172.25.5.122:5173/ar-connect?peer=amperon-abc12345&session=lxxxxxx
```

**Check:**
- [ ] Does it use YOUR IP (not localhost)?
- [ ] Does it have `?peer=` and `&session=` parameters?
- [ ] Can you manually type it into phone browser?

---

## Common Issues & Fixes

### Issue: "Nothing loads on phone"

**Most likely causes:**

1. **Wrong IP Address**
   ```bash
   # On laptop PowerShell:
   ipconfig
   # Look for "IPv4 Address" under your WiFi adapter
   # Example: 192.168.1.100
   
   # Update .env:
   VITE_LAPTOP_IP=192.168.1.100
   
   # Restart:
   npm run dev
   ```

2. **Different WiFi Networks**
   - Phone on WiFi A
   - Laptop on WiFi B
   - **FIX:** Connect both to same network

3. **Firewall Blocking**
   - Windows Firewall blocking port 5173
   - **FIX (temporary):**
     ```
     Windows Settings → Firewall → Allow app
     Or disable firewall temporarily to test
     ```

4. **Dev Server Not Running**
   - Check laptop terminal shows: `Local: http://localhost:5173/`
   - **FIX:** Run `npm run dev`

---

### Issue: "Page loads but stuck on 'Initializing...'"

**Check console logs:**
- Look for 🔴 error messages
- Check if PeerJS is loading

**Common causes:**
1. PeerJS CDN blocked
2. Slow internet connection
3. Browser compatibility issue

**FIX:**
- Wait 15 seconds (timeout will trigger)
- Check error message that appears
- Try different browser on phone

---

### Issue: "Camera permission never appears"

**Console should show:**
```
📷 Requesting camera access...
⏳ Waiting for camera permission...
```

**If stuck here:**
1. Check phone browser settings
2. Allow camera permission for site
3. Try refreshing page
4. Try different browser (Chrome/Safari)

---

## Debug Console Output

When working correctly, you should see:

```
🚀 ARConnectPage COMPONENT LOADED
📱 ARConnectPage - Peer ID: amperon-xyz123
📱 ARConnectPage - Session ID: abc789
📱 ARConnectPage - Full URL: http://172.25.5.122:5173/ar-connect?peer=...
🔵 ARConnectPage useEffect RUNNING
✅ Parameters valid, starting connection...
🔌 startConnection() called
📷 Requesting camera access...
⏳ Waiting for camera permission...
✅ Camera access granted!
🔗 Connecting to host: amperon-xyz123...
✅ Connected successfully!
```

---

## Quick Diagnostic Checklist

Run through these in order:

- [ ] Laptop IP address: _____________ (from `ipconfig`)
- [ ] `.env` has `VITE_LAPTOP_IP=YOUR_IP`
- [ ] Both devices on same WiFi: _____________
- [ ] `npm run dev` running: YES / NO
- [ ] Test page loads: `http://IP:5173/test.html` YES / NO
- [ ] AR connect loads: `http://IP:5173/ar-connect?peer=test&session=test` YES / NO
- [ ] QR code shows IP (not localhost): YES / NO
- [ ] Firewall disabled or port 5173 allowed: YES / NO
- [ ] Browser console shows errors: YES / NO

---

## What to Send Me for Help

If still not working, send:

1. Screenshot of test.html page on phone
2. Screenshot of ar-connect page on phone
3. Your laptop IP address (from `ipconfig`)
4. Phone browser console errors (if available)
5. Laptop terminal output from `npm run dev`
6. Contents of `.env` file (VITE_LAPTOP_IP line)

---

## Emergency Fallback

If NOTHING works, try this simple test:

1. Create `public/hello.html`:
   ```html
   <!DOCTYPE html>
   <html><body><h1>HELLO FROM LAPTOP</h1></body></html>
   ```

2. On phone go to: `http://YOUR_IP:5173/hello.html`

3. If this works → React/routing issue
4. If this fails → Network/firewall issue
