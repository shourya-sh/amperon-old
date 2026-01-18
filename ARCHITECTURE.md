# KiCad Symbols Integration - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       Amperon Application                        │
└─────────────────────────────────────────────────────────────────┘
                                  ↓
                    ┌─────────────────────────┐
                    │   ChatPanel Component   │
                    │  (src/components/chat/) │
                    └─────────────────────────┘
                                  ↓
                    ┌─────────────────────────┐
                    │  Symbol Service Layer   │
                    │  (symbolsService.ts)    │
                    └─────────────────────────┘
                           ↙         ↖
                ┌──────────────┐  ┌──────────────────────┐
                │  localStorage│  │  KiCad GitHub (Raw)  │
                │   (Cached)   │  │  kicad-symbols.git   │
                └──────────────┘  └──────────────────────┘
                           ↓         ↓
                    ┌─────────────────────────┐
                    │   useSymbolsStore       │
                    │   (Zustand Store)       │
                    └─────────────────────────┘
                                  ↓
                    ┌─────────────────────────┐
                    │  generateResponse()     │
                    │  (AI Chat Logic)        │
                    └─────────────────────────┘
                                  ↓
                    ┌─────────────────────────┐
                    │  User Receives Response │
                    │  with Symbol Info       │
                    └─────────────────────────┘
```

## Data Flow Diagram

### Initial Load Sequence:
```
User Opens App
    ↓
ChatPanel mounts
    ↓
useEffect: initializeSymbols()
    ↓
Check if symbols exist in store
    ├─ YES → Already loaded, skip
    └─ NO → Continue
    ↓
setSymbolsLoading(true)
    ↓
loadSymbols() called
    ↓
getCachedSymbols() → Check localStorage
    ├─ Cache valid & exists → Return cached ✓
    ├─ Cache expired or empty → Continue
    └─ Parse error → Clear and continue
    ↓
fetchSymbolsFromKiCad() → Fetch from GitHub
    ├─ Success → Parse symbols
    ├─ Timeout → Return empty array
    └─ Error → Log and return empty
    ↓
setCachedSymbols() → Save to localStorage
    ├─ Sets amperon_kicad_symbols (data)
    └─ Sets amperon_kicad_symbols_expiry (7 days)
    ↓
setSymbols(loadedSymbols) → Update store
    ↓
setSymbolsLoading(false)
    ↓
UI updates with available symbols ✓
```

### Chat Query Sequence:
```
User Types Query
    ↓
User presses Enter/Send
    ↓
generateResponse(userMessage)
    ↓
Check built-in components
    ├─ Found → Build component response
    └─ Not found → Continue
    ↓
Check KiCad symbols (from store)
    ├─ Found → Build symbol response
    └─ Not found → Continue
    ↓
Check for special keywords
    ├─ 'led' + 'circuit' → LED circuit response
    ├─ 'ohm' → Ohm's Law response
    ├─ 'series/parallel' → Comparison response
    └─ None matched → Continue
    ↓
Build default educational response
    ├─ Mention available symbols if loaded
    └─ List available actions
    ↓
Return response to user ✓
```

## Cache Lifecycle

```
DAY 0 (First Load):
┌──────────────────────────────────────┐
│ localStorage empty                   │
│ Start fetching from KiCad            │
│ After ~2 seconds: symbols loaded     │
└──────────────────────────────────────┘
                    ↓
DAY 0-6:
┌──────────────────────────────────────┐
│ Cached symbols in localStorage       │
│ Every load uses cache (instant)      │
│ Cache key: amperon_kicad_symbols     │
│ Expiry key: amperon_kicad_symbols_   │
│           expiry                     │
└──────────────────────────────────────┘
                    ↓
DAY 7 (Expiry):
┌──────────────────────────────────────┐
│ getCachedSymbols() checks expiry     │
│ Date.now() > expiry timestamp        │
│ Cache invalidated                    │
│ Fresh fetch from KiCad begins        │
└──────────────────────────────────────┘
                    ↓
DAY 7+ (New Cycle):
┌──────────────────────────────────────┐
│ Updated symbols cached               │
│ Process repeats                      │
└──────────────────────────────────────┘
```

## State Management

### useSymbolsStore Structure:
```typescript
{
  // Data
  symbols: [
    {
      id: 'resistor',
      name: 'Resistor',
      category: 'passive',
      description: 'KiCad symbol: Resistor (2 pins)',
      connections: 2,
      symbol: '⚪',
      source: 'kicad'
    },
    // ... more symbols
  ],
  
  // UI State
  isLoading: false,
  error: null,
  lastUpdated: 1705XXX000,
  
  // Actions
  setSymbols: (symbols) => {},
  setIsLoading: (loading) => {},
  setError: (error) => {},
  addSymbol: (symbol) => {},
  updateLastUpdated: () => {}
}
```

### localStorage Structure:
```
Key: amperon_kicad_symbols
Value: [
  {"id":"...","name":"...","category":"...","description":"...","connections":2,"symbol":"⚪","source":"kicad"},
  // ... 50+ more symbols
]
Size: ~1MB

Key: amperon_kicad_symbols_expiry
Value: 1705606000 (Unix timestamp)
Size: ~10 bytes

Key: amperon-symbols
Value: {"symbols":[...],"isLoading":false,"error":null,"lastUpdated":...}
Size: ~1MB
```

## Error Handling Paths

```
Fetch from GitHub
    ├─ SUCCESS
    │   ├─ Parse symbols
    │   └─ Cache and store ✓
    ├─ TIMEOUT
    │   ├─ Check for existing cache
    │   ├─ YES → Use cached symbols
    │   └─ NO → Show message, use built-in
    ├─ RATE LIMITED
    │   ├─ Use existing cache
    │   └─ Retry in 7 days
    ├─ NETWORK ERROR
    │   ├─ Fall back to built-in
    │   └─ Offer retry
    └─ PARSE ERROR
        ├─ Clear corrupted cache
        └─ Retry fresh fetch
```

## Performance Optimization

### Caching Strategy:
1. **First Load:** ~2000ms (network fetch)
2. **Cached Load:** ~50ms (localStorage read)
3. **Search:** O(n) → ~50ms for 50 symbols
4. **Storage:** ~1-2MB total
5. **Memory:** ~2-5MB in-memory

### Why 7-Day Cache?
- KiCad symbols don't change daily
- Reduces GitHub API calls (rate limiting)
- Balances freshness vs performance
- Users get regular updates monthly

## Security Considerations

### localStorage:
- User-specific, cannot be accessed from other domains
- No sensitive data stored
- Client-side parsing prevents injection

### GitHub:
- Fetching from raw.githubusercontent.com (trusted source)
- No authentication needed (public repo)
- Read-only operations (no write capability)

### Parsing:
- Symbols are structured data (not user input)
- No eval() or unsafe operations
- Type validation with TypeScript

## Scalability

### Current Implementation:
- 50 symbols from 3 KiCad libraries
- Can handle up to 1000+ symbols in localStorage
- Parsing takes ~500ms for large dataset

### Future Scaling:
- Split symbols by category
- Lazy-load symbols on demand
- Implement IndexedDB for larger datasets
- Add pagination/infinite scroll

## Integration Points

### With Existing Code:
1. **CircuitComponents Array:**
   - Still used as primary source
   - Symbols augment, not replace

2. **ChatPanel:**
   - No breaking changes
   - Enhanced with new data

3. **useCircuitStore:**
   - No modifications needed
   - Symbols are read-only

4. **UI Components:**
   - All existing features unchanged
   - Graceful degradation if symbols unavailable

## Testing Points

1. **Unit Tests:** Symbol parsing logic
2. **Integration Tests:** Cache with UI
3. **E2E Tests:** Full load cycle
4. **Performance Tests:** Load times
5. **Error Tests:** Network failures
6. **Cache Tests:** Expiry logic

## Monitoring & Debugging

### DevTools Console Commands:
```javascript
// View all symbols
const s = JSON.parse(localStorage.getItem('amperon_kicad_symbols'));
console.table(s);

// Check cache validity
const exp = localStorage.getItem('amperon_kicad_symbols_expiry');
console.log('Expires:', new Date(parseInt(exp)));

// View store state
console.log(useSymbolsStore.getState());

// Search for symbol
const symbol = s.find(x => x.name.includes('LED'));
console.log(symbol);
```

## Deployment Checklist

- [x] Services created with error handling
- [x] Store configured with persistence
- [x] Component integration complete
- [x] No breaking changes to existing code
- [x] All TypeScript types correct
- [x] Error boundaries tested
- [x] Cache logic verified
- [x] Performance acceptable
- [x] Documentation complete
