# Price Scraping API

This document describes the price scraping API that fetches real-time component prices from Octopart, FindChips, and Amazon.

## Overview

The API scrapes pricing information from three major sources:
- **Octopart** - Comprehensive electronics component search engine
- **FindChips** - Electronics part search across multiple distributors
- **Amazon** - Consumer electronics marketplace

## Architecture

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│   Frontend      │────►│  Backend API         │────►│  Web Scraping   │
│   ShopPanel     │     │  (Express Server)    │     │  (HTTP + Cache) │
└─────────────────┘     └──────────────────────┘     └─────────────────┘
                                                              │
                                                              ▼
                                                    ┌─────────────────┐
                                                    │   Price Cache   │
                                                    │   (1 hour TTL)  │
                                                    └─────────────────┘
```

## Running the Server

```bash
cd server
npm install
npm run dev
```

The server runs on port 3001 by default.

## API Endpoints

### Health Check
```
GET /api/health
```
Returns the server status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-18T12:00:00.000Z"
}
```

### Fetch Single Component Price
```
POST /api/prices/component
```

**Request Body:**
```json
{
  "componentId": "resistor-1",
  "componentType": "resistor",
  "componentName": "1kΩ Resistor",
  "quantity": 5,
  "properties": [
    { "name": "Resistance", "value": "1k", "unit": "Ω" }
  ]
}
```

**Response:**
```json
{
  "componentId": "resistor-1",
  "componentName": "1kΩ Resistor",
  "componentType": "resistor",
  "quantity": 5,
  "prices": [
    {
      "vendor": "octopart",
      "vendorDisplayName": "Octopart",
      "price": 0.05,
      "currency": "USD",
      "url": "https://octopart.com/search?q=1k%20resistor",
      "inStock": true,
      "stockQuantity": 10000,
      "minOrderQty": 1,
      "leadTime": "1-3 business days",
      "partNumber": "OCP-RESI-123"
    },
    {
      "vendor": "findchips",
      "vendorDisplayName": "FindChips",
      "price": 0.04,
      "currency": "USD",
      "url": "https://www.findchips.com/search/1k%20resistor",
      "inStock": true,
      "stockQuantity": 5000,
      "minOrderQty": 10,
      "leadTime": "2-5 business days",
      "partNumber": "FC-5678"
    },
    {
      "vendor": "amazon",
      "vendorDisplayName": "Amazon",
      "price": 0.08,
      "currency": "USD",
      "url": "https://www.amazon.com/s?k=1k%20resistor",
      "inStock": true,
      "stockQuantity": 100,
      "minOrderQty": 1,
      "leadTime": "Prime: 1-2 days",
      "partNumber": "AMZN-RESI"
    }
  ],
  "bestPrice": {
    "vendor": "findchips",
    "price": 0.04
  },
  "lastUpdated": "2026-01-18T12:00:00.000Z",
  "status": "success"
}
```

### Fetch Batch Component Prices
```
POST /api/prices/batch
```

**Request Body:**
```json
{
  "components": [
    {
      "componentId": "resistor-1",
      "componentType": "resistor",
      "componentName": "1kΩ Resistor",
      "quantity": 5
    },
    {
      "componentId": "capacitor-1",
      "componentType": "capacitor",
      "componentName": "100µF Capacitor",
      "quantity": 2
    }
  ]
}
```

**Response:**
```json
{
  "resistor-1": { /* ComponentPricing object */ },
  "capacitor-1": { /* ComponentPricing object */ }
}
```

### Get Cache Statistics
```
GET /api/prices/cache/stats
```

**Response:**
```json
{
  "keys": 15,
  "hits": 120,
  "misses": 30
}
```

### Clear Cache
```
POST /api/prices/cache/clear
```

**Response:**
```json
{
  "message": "Cache cleared successfully"
}
```

## Frontend Integration

The frontend `shopService.ts` automatically:
1. Checks if the backend API is available
2. If available, fetches real prices from the scraping API
3. If unavailable, falls back to estimated/mock prices

### Status Indicator

The ShopPanel displays a status badge:
- **🟢 Live** - Connected to scraping API, showing real prices
- **🟡 Offline** - Using estimated prices

## Caching

Prices are cached for 1 hour to:
- Reduce load on source websites
- Speed up repeated requests
- Avoid rate limiting

## Rate Limiting

The scraper enforces a minimum delay of 1.5 seconds between requests to each source to avoid being blocked.

## Fallback Mechanism

If scraping fails for any source, the API returns estimated prices based on component type. Estimated prices are marked with `-EST` suffix in the part number.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `VITE_API_URL` | Frontend API URL (Vite) | http://localhost:3001 |

## Supported Component Types

The scraper has optimized search queries for:
- resistor, capacitor, inductor
- led, diode, transistor
- switch, pushbutton, relay
- motor, buzzer, speaker
- potentiometer, fuse
- opamp, microcontroller
- battery, wire, connector
- 7segment display

## Legal Considerations

⚠️ **Important:** Web scraping may violate the terms of service of some websites. This implementation is for educational purposes. For production use, consider:

1. Using official APIs:
   - [Octopart API](https://octopart.com/api)
   - [Amazon Product Advertising API](https://affiliate-program.amazon.com/assoc_credentials/home)

2. Implementing proper respect for robots.txt
3. Adding request throttling and delays
4. Caching aggressively to minimize requests

## Troubleshooting

### API not responding
1. Check if server is running: `npm run dev`
2. Check port 3001 is not in use
3. Check console for errors

### Prices showing "EST" suffix
This means the price was estimated, not scraped. Common causes:
- Website structure changed
- Rate limited by source
- Network connectivity issues

### "Offline" status in UI
The frontend couldn't reach the backend. Check:
1. Server is running
2. Correct API URL in environment
3. CORS settings are correct
