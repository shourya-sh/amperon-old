// KiCAD SVG Symbol Converter
// Converts KiCAD symbol drawing commands to SVG format

// Primary GitHub raw + CDN fallbacks to avoid 404s/disk-cache issues
const KICAD_SOURCES = [
  'https://raw.githubusercontent.com/KiCad/kicad-symbols/master',
  'https://cdn.jsdelivr.net/gh/KiCad/kicad-symbols',
  'https://raw.fastgit.org/KiCad/kicad-symbols/master'
];

// Fast local fallbacks (no network) per component type
const LOCAL_SVGS: Record<string, string> = {
  resistor: `<svg viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg"><path d="M2 16 H12 L16 6 L22 26 L28 6 L34 26 L40 6 L46 26 L52 6 L56 16 H62" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  capacitor: `<svg viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg"><line x1="2" y1="16" x2="24" y2="16" stroke="#22c55e" stroke-width="2"/><line x1="24" y1="4" x2="24" y2="28" stroke="#22c55e" stroke-width="2.5"/><line x1="40" y1="4" x2="40" y2="28" stroke="#22c55e" stroke-width="2.5"/><line x1="40" y1="16" x2="62" y2="16" stroke="#22c55e" stroke-width="2"/></svg>`,
  led: `<svg viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg"><polygon points="16,4 16,28 44,16" fill="none" stroke="#22c55e" stroke-width="2"/><line x1="44" y1="4" x2="44" y2="28" stroke="#22c55e" stroke-width="2"/><line x1="2" y1="16" x2="16" y2="16" stroke="#22c55e" stroke-width="2"/><line x1="44" y1="16" x2="62" y2="16" stroke="#22c55e" stroke-width="2"/><line x1="46" y1="6" x2="56" y2="2" stroke="#fbbf24" stroke-width="1.5"/><line x1="48" y1="10" x2="58" y2="8" stroke="#fbbf24" stroke-width="1.5"/></svg>`,
  diode: `<svg viewBox="0 0 64 24" xmlns="http://www.w3.org/2000/svg"><line x1="2" y1="12" x2="18" y2="12" stroke="#22c55e" stroke-width="2"/><polygon points="18,4 18,20 38,12" fill="none" stroke="#22c55e" stroke-width="2"/><line x1="38" y1="4" x2="38" y2="20" stroke="#22c55e" stroke-width="2"/><line x1="38" y1="12" x2="62" y2="12" stroke="#22c55e" stroke-width="2"/></svg>`,
  battery: `<svg viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg"><line x1="2" y1="16" x2="20" y2="16" stroke="#22c55e" stroke-width="2"/><line x1="20" y1="6" x2="20" y2="26" stroke="#22c55e" stroke-width="2.5"/><line x1="30" y1="10" x2="30" y2="22" stroke="#22c55e" stroke-width="2.5"/><line x1="40" y1="6" x2="40" y2="26" stroke="#22c55e" stroke-width="2.5"/><line x1="50" y1="10" x2="50" y2="22" stroke="#22c55e" stroke-width="2.5"/><line x1="50" y1="16" x2="62" y2="16" stroke="#22c55e" stroke-width="2"/></svg>`,
  switch: `<svg viewBox="0 0 64 24" xmlns="http://www.w3.org/2000/svg"><line x1="2" y1="16" x2="16" y2="16" stroke="#22c55e" stroke-width="2"/><circle cx="18" cy="16" r="3" fill="#22c55e"/><line x1="18" y1="16" x2="42" y2="6" stroke="#22c55e" stroke-width="2"/><circle cx="46" cy="16" r="3" fill="#22c55e"/><line x1="48" y1="16" x2="62" y2="16" stroke="#22c55e" stroke-width="2"/></svg>`,
  ground: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><line x1="16" y1="2" x2="16" y2="12" stroke="#22c55e" stroke-width="2"/><line x1="4" y1="12" x2="28" y2="12" stroke="#22c55e" stroke-width="2"/><line x1="8" y1="18" x2="24" y2="18" stroke="#22c55e" stroke-width="2"/><line x1="12" y1="24" x2="20" y2="24" stroke="#22c55e" stroke-width="2"/></svg>`,
  buzzer: `<svg viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="4" width="40" height="24" rx="4" fill="none" stroke="#22c55e" stroke-width="2"/><circle cx="32" cy="16" r="6" fill="none" stroke="#22c55e" stroke-width="1.5"/><line x1="2" y1="16" x2="12" y2="16" stroke="#22c55e" stroke-width="2"/><line x1="52" y1="16" x2="62" y2="16" stroke="#22c55e" stroke-width="2"/></svg>`,
  motor: `<svg viewBox="0 0 64 40" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="20" r="16" fill="none" stroke="#22c55e" stroke-width="2"/><text x="32" y="24" text-anchor="middle" fill="#22c55e" font-size="12" font-weight="bold">M</text><line x1="2" y1="20" x2="10" y2="20" stroke="#22c55e" stroke-width="2"/><line x1="54" y1="20" x2="62" y2="20" stroke="#22c55e" stroke-width="2"/></svg>`,
  voltmeter: `<svg viewBox="0 0 64 40" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="20" r="16" fill="none" stroke="#22c55e" stroke-width="2"/><text x="32" y="24" text-anchor="middle" fill="#22c55e" font-size="12" font-weight="bold">V</text><line x1="2" y1="20" x2="10" y2="20" stroke="#22c55e" stroke-width="2"/><line x1="54" y1="20" x2="62" y2="20" stroke="#22c55e" stroke-width="2"/></svg>`,
  ammeter: `<svg viewBox="0 0 64 40" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="20" r="16" fill="none" stroke="#22c55e" stroke-width="2"/><text x="32" y="24" text-anchor="middle" fill="#22c55e" font-size="12" font-weight="bold">A</text><line x1="2" y1="20" x2="10" y2="20" stroke="#22c55e" stroke-width="2"/><line x1="54" y1="20" x2="62" y2="20" stroke="#22c55e" stroke-width="2"/></svg>`,
  inductor: `<svg viewBox="0 0 64 24" xmlns="http://www.w3.org/2000/svg"><line x1="2" y1="12" x2="10" y2="12" stroke="#22c55e" stroke-width="2"/><path d="M10 12 Q16 2 22 12 Q28 22 34 12 Q40 2 46 12 Q52 22 58 12" fill="none" stroke="#22c55e" stroke-width="2"/><line x1="58" y1="12" x2="62" y2="12" stroke="#22c55e" stroke-width="2"/></svg>`,
  lightbulb: `<svg viewBox="0 0 40 48" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="16" r="12" fill="none" stroke="#22c55e" stroke-width="2"/><path d="M14 28 L14 42 L26 42 L26 28" fill="none" stroke="#22c55e" stroke-width="2"/><line x1="13" y1="34" x2="27" y2="34" stroke="#22c55e" stroke-width="1.5"/></svg>`,
  transistor: `<svg viewBox="0 0 64 48" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="16" fill="none" stroke="#22c55e" stroke-width="2"/><line x1="2" y1="24" x2="12" y2="24" stroke="#22c55e" stroke-width="2"/><line x1="12" y1="10" x2="12" y2="38" stroke="#22c55e" stroke-width="2"/><line x1="12" y1="16" x2="40" y2="6" stroke="#22c55e" stroke-width="2"/><line x1="12" y1="32" x2="40" y2="42" stroke="#22c55e" stroke-width="2"/><line x1="40" y1="6" x2="62" y2="6" stroke="#22c55e" stroke-width="2"/><line x1="40" y1="42" x2="62" y2="42" stroke="#22c55e" stroke-width="2"/><polygon points="32,36 40,42 34,30" fill="#22c55e"/></svg>`
};

// Map component types to KiCAD symbol files and names
const COMPONENT_TO_KICAD: Record<string, { file: string; symbol: string }> = {
  battery: { file: 'Device.kicad_sym', symbol: 'Battery' },
  resistor: { file: 'Device.kicad_sym', symbol: 'R' },
  capacitor: { file: 'Device.kicad_sym', symbol: 'C' },
  inductor: { file: 'Device.kicad_sym', symbol: 'L' },
  led: { file: 'Device.kicad_sym', symbol: 'LED' },
  diode: { file: 'Device.kicad_sym', symbol: 'D' },
  transistor: { file: 'Transistor_BJT.kicad_sym', symbol: 'Q_NPN_CBE' },
  switch: { file: 'Switch.kicad_sym', symbol: 'SW_SPDT' },
  lightbulb: { file: 'Device.kicad_sym', symbol: 'Lamp' },
  buzzer: { file: 'Device.kicad_sym', symbol: 'Buzzer' },
  motor: { file: 'Motor.kicad_sym', symbol: 'Motor_DC' },
  voltmeter: { file: 'Measurement.kicad_sym', symbol: 'Voltmeter' },
  ammeter: { file: 'Measurement.kicad_sym', symbol: 'Ammeter' },
  ground: { file: 'power.kicad_sym', symbol: 'GND' },
  wire: { file: 'Connector_Generic.kicad_sym', symbol: 'Conn_01x01' },
};

// Parse KiCAD symbol file and extract symbol definitions
function parseKiCadSymbols(content: string): Map<string, string> {
  const symbols = new Map<string, string>();
  
  // Extract symbol blocks: (symbol "Name" ...)
  const symbolRegex = /\(symbol\s+"([^"]+)"[^)]*\((symbol\s+"[^"]*"_\d+_\d+[^)]*\(([^)]*\(.*?\)[^)]*)*\))\)/gs;
  
  let match;
  while ((match = symbolRegex.exec(content)) !== null) {
    const name = match[1];
    const drawing = match[2];
    symbols.set(name, drawing);
  }
  
  return symbols;
}

// Convert KiCAD drawing command to SVG path
function kicadToSvg(drawing: string): string[] {
  const svgElements: string[] = [];
  
  // Parse rectangles: (rectangle (start x1 y1) (end x2 y2) (stroke ...) (fill ...))
  const rectRegex = /\(rectangle\s+\(start\s+([-\d.]+)\s+([-\d.]+)\)\s+\(end\s+([-\d.]+)\s+([-\d.]+)\)([^)]*)\)/g;
  let match;
  
  while ((match = rectRegex.exec(drawing)) !== null) {
    const x1 = parseFloat(match[1]);
    const y1 = parseFloat(match[2]);
    const x2 = parseFloat(match[3]);
    const y2 = parseFloat(match[4]);
    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);
    const x = Math.min(x1, x2);
    const y = Math.min(y1, y2);
    
    svgElements.push(
      `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="none" stroke="#22c55e" stroke-width="0.2"/>`
    );
  }
  
  // Parse circles: (circle (center x y) (radius r) (stroke ...) (fill ...))
  const circleRegex = /\(circle\s+\(center\s+([-\d.]+)\s+([-\d.]+)\)\s+\(radius\s+([-\d.]+)\)([^)]*)\)/g;
  while ((match = circleRegex.exec(drawing)) !== null) {
    const cx = parseFloat(match[1]);
    const cy = parseFloat(match[2]);
    const r = parseFloat(match[3]);
    
    svgElements.push(
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#22c55e" stroke-width="0.2"/>`
    );
  }
  
  // Parse polylines: (polyline (pts (xy x1 y1) (xy x2 y2) ...) (stroke ...) (fill ...))
  const polylineRegex = /\(polyline\s+\(pts([^)]*)\)([^)]*)\)/g;
  while ((match = polylineRegex.exec(drawing)) !== null) {
    const pointsStr = match[1];
    const pointRegex = /\(xy\s+([-\d.]+)\s+([-\d.]+)\)/g;
    let pointMatch;
    const points: string[] = [];
    
    while ((pointMatch = pointRegex.exec(pointsStr)) !== null) {
      points.push(`${pointMatch[1]},${pointMatch[2]}`);
    }
    
    if (points.length > 0) {
      svgElements.push(
        `<polyline points="${points.join(' ')}" fill="none" stroke="#22c55e" stroke-width="0.2"/>`
      );
    }
  }
  
  // Parse arcs: (arc (start x1 y1) (mid x2 y2) (end x3 y3) (stroke ...) (fill ...))
  const arcRegex = /\(arc\s+\(start\s+([-\d.]+)\s+([-\d.]+)\)\s+\(mid\s+([-\d.]+)\s+([-\d.]+)\)\s+\(end\s+([-\d.]+)\s+([-\d.]+)\)([^)]*)\)/g;
  while ((match = arcRegex.exec(drawing)) !== null) {
    const x1 = parseFloat(match[1]);
    const y1 = parseFloat(match[2]);
    const x3 = parseFloat(match[6]);
    const y3 = parseFloat(match[7]);
    
    // Create arc path (simplified)
    const midX = (x1 + x3) / 2;
    const midY = (y1 + y3) / 2;
    
    svgElements.push(
      `<path d="M ${x1} ${y1} Q ${midX} ${midY} ${x3} ${y3}" fill="none" stroke="#22c55e" stroke-width="0.2"/>`
    );
  }
  
  return svgElements;
}

// Convert KiCAD symbol to SVG
function convertKiCadToSvg(symbolName: string, drawing: string): string {
  const svgElements = kicadToSvg(drawing);
  
  if (svgElements.length === 0) {
    // Fallback to basic symbol if parsing fails
    return createFallbackSymbol(symbolName);
  }
  
  const svg = `
    <svg viewBox="-3 -3 6 6" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
      ${svgElements.join('\n')}
    </svg>
  `;
  
  return svg;
}

// Create fallback symbols when KiCAD parsing fails
function createFallbackSymbol(symbolName: string): string {
  const symbols: Record<string, string> = {
    R: `<svg viewBox="-1 -2.5 2 5" xmlns="http://www.w3.org/2000/svg"><rect x="-0.8" y="-1.5" width="1.6" height="3" fill="none" stroke="#22c55e" stroke-width="0.2"/><circle cx="-0.4" cy="-0.3" r="0.1" fill="#22c55e"/><circle cx="0" cy="0.3" r="0.1" fill="#22c55e"/><circle cx="0.4" cy="0.9" r="0.1" fill="#22c55e"/></svg>`,
    C: `<svg viewBox="-1 -2.5 2 5" xmlns="http://www.w3.org/2000/svg"><line x1="-0.5" y1="-2" x2="-0.5" y2="2" stroke="#22c55e" stroke-width="0.3"/><line x1="0.5" y1="-2" x2="0.5" y2="2" stroke="#22c55e" stroke-width="0.3"/></svg>`,
    L: `<svg viewBox="-1 -2.5 2 5" xmlns="http://www.w3.org/2000/svg"><path d="M -0.8 -2 Q 0 -0.5 0.8 1 Q 0 1.5 -0.8 2" fill="none" stroke="#22c55e" stroke-width="0.3"/></svg>`,
    LED: `<svg viewBox="-1 -2.5 2 5" xmlns="http://www.w3.org/2000/svg"><polygon points="-0.8,-1.5 0.8,-1.5 0,-1.5 -0.8,1.5" fill="none" stroke="#22c55e" stroke-width="0.2"/><line x1="-0.8" y1="-2" x2="0.8" y2="2" stroke="#22c55e" stroke-width="0.2"/><line x1="0.2" y1="-2.3" x2="0.8" y2="-1.7" stroke="#fbbf24" stroke-width="0.1"/></svg>`,
    D: `<svg viewBox="-1 -2.5 2 5" xmlns="http://www.w3.org/2000/svg"><polygon points="-0.8,-1.5 0.8,0 -0.8,1.5" fill="none" stroke="#22c55e" stroke-width="0.2"/><line x1="0.8" y1="-1.5" x2="0.8" y2="1.5" stroke="#22c55e" stroke-width="0.2"/></svg>`,
    Battery: `<svg viewBox="-1 -2.5 2 5" xmlns="http://www.w3.org/2000/svg"><rect x="-0.8" y="-0.8" width="0.6" height="1.6" fill="none" stroke="#22c55e" stroke-width="0.2"/><rect x="0.1" y="-0.5" width="0.5" height="1" fill="none" stroke="#22c55e" stroke-width="0.2"/><line x1="-0.8" y1="-2" x2="-0.8" y2="-0.8" stroke="#22c55e" stroke-width="0.2"/><line x1="0.6" y1="0.8" x2="0.6" y2="2" stroke="#22c55e" stroke-width="0.2"/></svg>`,
    GND: `<svg viewBox="-1 -1 2 2" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="-0.8" x2="0" y2="-0.2" stroke="#22c55e" stroke-width="0.2"/><line x1="-0.6" y1="-0.2" x2="0.6" y2="-0.2" stroke="#22c55e" stroke-width="0.2"/><line x1="-0.4" y1="0.1" x2="0.4" y2="0.1" stroke="#22c55e" stroke-width="0.2"/><line x1="-0.2" y1="0.4" x2="0.2" y2="0.4" stroke="#22c55e" stroke-width="0.2"/></svg>`,
    SW_SPDT: `<svg viewBox="-1 -2.5 2 5" xmlns="http://www.w3.org/2000/svg"><circle cx="0" cy="-1" r="0.3" fill="none" stroke="#22c55e" stroke-width="0.2"/><circle cx="-0.8" cy="1" r="0.25" fill="none" stroke="#22c55e" stroke-width="0.2"/><circle cx="0.8" cy="1" r="0.25" fill="none" stroke="#22c55e" stroke-width="0.2"/><line x1="0" y1="-0.7" x2="-0.3" y2="0.8" stroke="#22c55e" stroke-width="0.2"/></svg>`,
    Buzzer: `<svg viewBox="-1 -2.5 2 5" xmlns="http://www.w3.org/2000/svg"><circle cx="0" cy="-1" r="0.8" fill="none" stroke="#22c55e" stroke-width="0.2"/><text x="0" y="-0.5" font-size="1" fill="#22c55e" text-anchor="middle">~</text></svg>`,
    Motor_DC: `<svg viewBox="-1 -2.5 2 5" xmlns="http://www.w3.org/2000/svg"><circle cx="0" cy="0" r="1" fill="none" stroke="#22c55e" stroke-width="0.2"/><text x="0" y="0.3" font-size="1.5" fill="#22c55e" text-anchor="middle" font-weight="bold">M</text></svg>`,
    Voltmeter: `<svg viewBox="-1 -2.5 2 5" xmlns="http://www.w3.org/2000/svg"><circle cx="0" cy="0" r="1" fill="none" stroke="#22c55e" stroke-width="0.2"/><text x="0" y="0.3" font-size="1" fill="#22c55e" text-anchor="middle">V</text></svg>`,
    Ammeter: `<svg viewBox="-1 -2.5 2 5" xmlns="http://www.w3.org/2000/svg"><circle cx="0" cy="0" r="1" fill="none" stroke="#22c55e" stroke-width="0.2"/><text x="0" y="0.3" font-size="1" fill="#22c55e" text-anchor="middle">A</text></svg>`,
  };
  
  return symbols[symbolName] || symbols.R; // Default to resistor symbol
}

// Fetch and cache KiCAD symbols
const svgCache = new Map<string, string>();

export async function getKiCadSvg(componentType: string): Promise<string> {
  // Check cache first
  if (svgCache.has(componentType)) {
    return svgCache.get(componentType)!;
  }
  
  const kicadMapping = COMPONENT_TO_KICAD[componentType];
  
  if (!kicadMapping) {
    // Fallback for unknown components
    return LOCAL_SVGS[componentType] || createFallbackSymbol('R');
  }

  // If we have a local SVG for this type, return it immediately (no network)
  if (LOCAL_SVGS[componentType]) {
    const localSvg = LOCAL_SVGS[componentType];
    svgCache.set(componentType, localSvg);
    return localSvg;
  }
  
  for (const base of KICAD_SOURCES) {
    try {
      const url = `${base}/${kicadMapping.file}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch KiCAD symbols from ${base}: ${response.status}`);
      }
      
      const content = await response.text();
      const symbols = parseKiCadSymbols(content);
      const drawing = symbols.get(kicadMapping.symbol);
      
      if (!drawing) {
        throw new Error(`Symbol ${kicadMapping.symbol} not found in ${kicadMapping.file}`);
      }
      
      const svg = convertKiCadToSvg(kicadMapping.symbol, drawing);
      svgCache.set(componentType, svg);
      return svg;
    } catch (error) {
      console.warn(`KiCAD fetch failed for ${componentType} at source; trying next`, error);
      continue;
    }
  }

  // Fallback to basic symbol if all sources fail
  const fallback = createFallbackSymbol(COMPONENT_TO_KICAD[componentType]?.symbol || 'R');
  svgCache.set(componentType, fallback);
  return fallback;
}

// Preload common symbols
export async function preloadKiCadSymbols(): Promise<void> {
  // Load a few important ones in parallel
  const importantTypes = ['resistor', 'capacitor', 'led', 'battery', 'diode'];
  
  await Promise.all(
    importantTypes.map(type => getKiCadSvg(type).catch(() => null))
  );
}

export function clearSvgCache(): void {
  svgCache.clear();
}
