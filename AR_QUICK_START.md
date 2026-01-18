# ⚡ Quick AR Phone Setup Checklist

## 📋 Before You Start
```
☐ Both laptop and phone on same WiFi network
☐ Laptop has http://localhost:5173 running (npm run dev)
☐ Phone has internet connection
```

## 🔧 Configuration (One-Time)
```
☐ Find your laptop's IP address:
    Windows: Open PowerShell → ipconfig
    Mac/Linux: Open Terminal → hostname -I
    
    Look for "IPv4 Address" like: 192.168.1.100
    
☐ Edit .env file in project root:
    VITE_LAPTOP_IP=192.168.1.100  ← Use YOUR IP address
    
☐ Restart npm dev server:
    Ctrl+C (stop current)
    npm run dev (start fresh)
    
☐ Wait for message: "Local: http://localhost:5173/ar"
```

## 💻 On Your Laptop
```
☐ Open browser to: http://localhost:5173/ar
☐ Click "Phone" tab (see phone icon)
☐ Click "Connect Phone" button (green button)
☐ Wait for QR code to appear
☐ Check the "Using Localhost" box shows your actual IP address
   (Should show: http://192.168.1.100:5173/ar-connect not localhost)
```

## 📱 On Your Phone
```
☐ Open camera app (built-in)
☐ Point camera at the QR code on laptop screen
☐ Click the notification that appears (or tap the QR code preview)
☐ Wait for page to load (might redirect to http://YOUR_IP:5173/ar-connect)
☐ Allow camera permission when prompted
☐ Wait for status to show "Connected!" ✓
```

## ✅ Success Signs
```
✓ Phone shows green "Connected!" message
✓ Laptop AR Lab screen shows phone camera feed (live video)
✓ You can see your breadboard in the video on laptop screen
✓ Status shows "Connected" or "Live" badge
```

## ❌ If It Doesn't Work

### Phone shows "Connection timeout" or "Connection failed"
- [ ] Stop and restart npm dev server
- [ ] Verify .env has correct IP address
- [ ] Make sure both devices are on SAME WiFi (very important!)
- [ ] Check laptop IP address hasn't changed (run ipconfig again)
- [ ] Try disabling firewall temporarily to test

### Phone keeps asking for camera but doesn't connect
- [ ] Phone might not have internet (check WiFi connection)
- [ ] Laptop app might have crashed (check browser console)
- [ ] Try refreshing laptop page: F5
- [ ] Try scanning QR code again

### Can see live video but it's not analyzing
- [ ] That's normal! The analysis happens in the Overshoot AI service
- [ ] Look for green status badge showing "Analyzing..."
- [ ] Give it 10-15 seconds for first detection

### "Using Localhost" box shows localhost instead of IP
- [ ] You didn't restart npm run dev after updating .env
- [ ] Or you're still accessing via localhost URL (use IP instead)
- [ ] Try: http://192.168.1.100:5173/ar in browser

## 🚀 When It Works

```
You should see:
1. Laptop: Green QR code modal
2. Phone: Live video preview
3. Laptop: Live video feed from phone
4. Status: "Connected" badge
5. AR overlay: Shows detected components, hints, etc.
```

## 💡 Pro Tips
```
✓ Use 5GHz WiFi if available (faster connection)
✓ Keep phone camera steady over breadboard
✓ Good lighting = better component detection  
✓ Don't cover phone camera
✓ Don't put laptop to sleep during streaming
✓ Keep both pages open/active
```

## 🔄 To Disconnect and Reconnect
```
On Laptop: Click "Disconnect" button
Wait 2 seconds
Click "Connect Phone" again
Scan new QR code with phone
```

---

**Having trouble?** Check the error message on your phone - it now tells you exactly what's wrong! 

See `AR_PHONE_CONNECTION.md` for detailed troubleshooting.
