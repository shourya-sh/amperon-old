import type { CircuitComponent } from '../types';

const KICAD_SYMBOLS_URL = 'https://raw.githubusercontent.com/KiCad/kicad-symbols/master';
const CACHE_KEY = 'amperon_kicad_symbols';
const CACHE_EXPIRY_KEY = 'amperon_kicad_symbols_expiry';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Map of KiCad symbol categories to Amperon categories
const CATEGORY_MAP: Record<string, string> = {
  'Device': 'passive',
  'Diode': 'active',
  'LED': 'output',
  'Transistor': 'active',
  'Switch': 'connection',
  'Connector': 'connection',
  'Sensor': 'input',
  'Motor': 'output',
  'Battery_Management': 'power',
  'power': 'source',
};

export interface ExtractedSymbol {
  id: string;
  name: string;
  category: string;
  description: string;
  connections: number;
  symbol: string;
  source: 'kicad' | 'builtin';
}

// Parse simple symbol information from KiCad library files
function parseSymbolName(line: string): string | null {
  // KiCad format: DEF name reference unused x y ...
  const match = line.match(/^DEF\s+(\w+)\s+/);
  return match ? match[1] : null;
}

function extractPinCount(content: string, symbolName: string): number {
  const symbolRegex = new RegExp(`DEF\\s+${symbolName}\\s+.*?(?=DEF|$)`, 's');
  const symbolBlock = content.match(symbolRegex)?.[0] || '';
  const pins = symbolBlock.match(/^F\s+\d+\s+"[^"]*"\s+\d+\s+\d+\s+\d+\s+[LR]/gm);
  return pins ? pins.length : 2;
}

async function fetchSymbolsFromKiCad(): Promise<ExtractedSymbol[]> {
  try {
    const symbols: ExtractedSymbol[] = [];
    
    // List of common KiCad library files to fetch
    const libFiles = [
      'Device.lib',
      'Diode.lib',
      'LED.lib',
      'Transistor_BJT.lib',
      'Switch.lib',
      'Connector_Generic.lib',
      'Sensor.lib',
      'Motor.lib',
      'power.lib',
    ];

    // Fetch and parse a few key libraries
    for (const libFile of libFiles.slice(0, 3)) { // Start with just 3 to avoid rate limiting
      try {
        const response = await fetch(`${KICAD_SYMBOLS_URL}/${libFile}`);
        if (!response.ok) continue;

        const content = await response.text();
        const lines = content.split('\n');
        
        // Extract symbols from the library
        for (const line of lines) {
          const symbolName = parseSymbolName(line);
          if (symbolName && symbolName.length > 0 && symbolName.length < 30) {
            const pinCount = extractPinCount(content, symbolName);
            const category = CATEGORY_MAP[libFile.replace('.lib', '')] || 'passive';
            
            symbols.push({
              id: symbolName.toLowerCase(),
              name: symbolName,
              category,
              description: `KiCad symbol: ${symbolName} (${pinCount} pins)`,
              connections: pinCount,
              symbol: '⚪',
              source: 'kicad',
            });

            // Limit to reasonable number
            if (symbols.length >= 50) break;
          }
        }
      } catch (error) {
        console.warn(`Failed to fetch ${libFile}:`, error);
      }
    }

    return symbols;
  } catch (error) {
    console.error('Failed to fetch KiCad symbols:', error);
    return [];
  }
}

function isCacheValid(): boolean {
  try {
    const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);
    if (!expiry) return false;
    return Date.now() < parseInt(expiry);
  } catch {
    return false;
  }
}

function getCachedSymbols(): ExtractedSymbol[] | null {
  try {
    if (!isCacheValid()) return null;
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.warn('Failed to retrieve cached symbols:', error);
    return null;
  }
}

function setCachedSymbols(symbols: ExtractedSymbol[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(symbols));
    localStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString());
  } catch (error) {
    console.warn('Failed to cache symbols:', error);
  }
}

export async function loadSymbols(): Promise<ExtractedSymbol[]> {
  // Try to get cached symbols first
  const cached = getCachedSymbols();
  if (cached && cached.length > 0) {
    return cached;
  }

  // Fetch from KiCad
  const fetched = await fetchSymbolsFromKiCad();
  
  // Cache the results
  if (fetched.length > 0) {
    setCachedSymbols(fetched);
  }

  return fetched;
}

export function clearSymbolsCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_EXPIRY_KEY);
  } catch (error) {
    console.warn('Failed to clear symbols cache:', error);
  }
}

export function getSymbolByName(symbols: ExtractedSymbol[], name: string): ExtractedSymbol | undefined {
  const lowerName = name.toLowerCase();
  return symbols.find(s => s.name.toLowerCase().includes(lowerName) || s.id.includes(lowerName));
}

export function filterSymbolsByCategory(symbols: ExtractedSymbol[], category: string): ExtractedSymbol[] {
  return symbols.filter(s => s.category === category);
}

// Convert ExtractedSymbol to CircuitComponent format for compatibility
export function symbolToComponent(symbol: ExtractedSymbol): Partial<CircuitComponent> {
  return {
    id: symbol.id,
    name: symbol.name,
    description: symbol.description,
    category: symbol.category as any,
    connections: symbol.connections,
    symbol: symbol.symbol,
    properties: [
      { name: 'Source', value: 'KiCad Library', unit: '', editable: false },
      { name: 'Connections', value: symbol.connections, unit: 'pins', editable: false },
    ],
  };
}
