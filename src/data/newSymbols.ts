// New Electronic Component Symbols
// These symbols extend the existing components library with industry-standard symbols
// SVG style: Simple rectangular body, dark border (#1a1a1f), light background, labeled pins, component name centered

export interface SymbolDefinition {
  name: string;
  category: string;
  width: number;
  height: number;
  svg: string;
  pins: {
    name: string;
    side: 'left' | 'right' | 'top' | 'bottom';
    index: number;
  }[];
}

export const newSymbols: SymbolDefinition[] = [
  // ============================================
  // POWER & ENERGY (Industry-critical)
  // ============================================
  {
    name: 'DC Power Supply',
    category: 'source',
    width: 80,
    height: 60,
    svg: `<svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="60" height="40" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="40" y="28" text-anchor="middle" fill="#22c55e" font-size="10" font-weight="bold">DC</text>
      <text x="40" y="40" text-anchor="middle" fill="#22c55e" font-size="8">SUPPLY</text>
      <line x1="0" y1="20" x2="10" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="40" x2="10" y2="40" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="20" x2="80" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="40" x2="80" y2="40" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="18" fill="#22c55e" font-size="6">AC+</text>
      <text x="4" y="43" fill="#22c55e" font-size="6">AC-</text>
      <text x="72" y="18" fill="#22c55e" font-size="6">V+</text>
      <text x="72" y="43" fill="#22c55e" font-size="6">GND</text>
    </svg>`,
    pins: [
      { name: 'AC+', side: 'left', index: 0 },
      { name: 'AC-', side: 'left', index: 1 },
      { name: 'V+', side: 'right', index: 0 },
      { name: 'GND', side: 'right', index: 1 }
    ]
  },
  {
    name: 'AC to DC Converter',
    category: 'source',
    width: 80,
    height: 60,
    svg: `<svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="60" height="40" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="40" y="28" text-anchor="middle" fill="#22c55e" font-size="9" font-weight="bold">AC/DC</text>
      <text x="40" y="40" text-anchor="middle" fill="#22c55e" font-size="7">CONVERTER</text>
      <path d="M14 25 Q20 20 26 25 Q32 30 26 35" fill="none" stroke="#22c55e" stroke-width="1"/>
      <line x1="54" y1="25" x2="66" y2="25" stroke="#22c55e" stroke-width="1.5"/>
      <line x1="54" y1="35" x2="66" y2="35" stroke="#22c55e" stroke-width="1.5"/>
      <line x1="56" y1="33" x2="64" y2="33" stroke="#22c55e" stroke-width="1.5"/>
      <line x1="0" y1="20" x2="10" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="40" x2="10" y2="40" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="20" x2="80" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="40" x2="80" y2="40" stroke="#22c55e" stroke-width="2"/>
    </svg>`,
    pins: [
      { name: 'AC_L', side: 'left', index: 0 },
      { name: 'AC_N', side: 'left', index: 1 },
      { name: 'DC+', side: 'right', index: 0 },
      { name: 'DC-', side: 'right', index: 1 }
    ]
  },
  {
    name: 'Buck Converter',
    category: 'source',
    width: 80,
    height: 50,
    svg: `<svg viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="8" width="60" height="34" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="40" y="22" text-anchor="middle" fill="#22c55e" font-size="9" font-weight="bold">BUCK</text>
      <text x="40" y="34" text-anchor="middle" fill="#22c55e" font-size="7">STEP-DOWN</text>
      <polygon points="55,18 65,25 55,32" fill="none" stroke="#22c55e" stroke-width="1.5"/>
      <line x1="0" y1="18" x2="10" y2="18" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="32" x2="10" y2="32" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="18" x2="80" y2="18" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="32" x2="80" y2="32" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="16" fill="#22c55e" font-size="5">VIN</text>
      <text x="4" y="35" fill="#22c55e" font-size="5">GND</text>
      <text x="71" y="16" fill="#22c55e" font-size="5">VOUT</text>
    </svg>`,
    pins: [
      { name: 'VIN', side: 'left', index: 0 },
      { name: 'GND', side: 'left', index: 1 },
      { name: 'VOUT', side: 'right', index: 0 },
      { name: 'GND', side: 'right', index: 1 }
    ]
  },
  {
    name: 'Boost Converter',
    category: 'source',
    width: 80,
    height: 50,
    svg: `<svg viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="8" width="60" height="34" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="40" y="22" text-anchor="middle" fill="#22c55e" font-size="9" font-weight="bold">BOOST</text>
      <text x="40" y="34" text-anchor="middle" fill="#22c55e" font-size="7">STEP-UP</text>
      <polygon points="15,18 25,25 15,32" fill="#22c55e" stroke="#22c55e" stroke-width="1"/>
      <line x1="0" y1="18" x2="10" y2="18" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="32" x2="10" y2="32" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="18" x2="80" y2="18" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="32" x2="80" y2="32" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="16" fill="#22c55e" font-size="5">VIN</text>
      <text x="71" y="16" fill="#22c55e" font-size="5">VOUT</text>
    </svg>`,
    pins: [
      { name: 'VIN', side: 'left', index: 0 },
      { name: 'GND', side: 'left', index: 1 },
      { name: 'VOUT', side: 'right', index: 0 },
      { name: 'GND', side: 'right', index: 1 }
    ]
  },
  {
    name: 'Buck-Boost Converter',
    category: 'source',
    width: 90,
    height: 50,
    svg: `<svg viewBox="0 0 90 50" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="8" width="70" height="34" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="45" y="22" text-anchor="middle" fill="#22c55e" font-size="8" font-weight="bold">BUCK-BOOST</text>
      <text x="45" y="34" text-anchor="middle" fill="#22c55e" font-size="6">STEP UP/DOWN</text>
      <polygon points="18,18 26,25 18,32" fill="none" stroke="#22c55e" stroke-width="1"/>
      <polygon points="64,18 72,25 64,32" fill="none" stroke="#22c55e" stroke-width="1"/>
      <line x1="0" y1="18" x2="10" y2="18" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="32" x2="10" y2="32" stroke="#22c55e" stroke-width="2"/>
      <line x1="80" y1="18" x2="90" y2="18" stroke="#22c55e" stroke-width="2"/>
      <line x1="80" y1="32" x2="90" y2="32" stroke="#22c55e" stroke-width="2"/>
    </svg>`,
    pins: [
      { name: 'VIN', side: 'left', index: 0 },
      { name: 'GND', side: 'left', index: 1 },
      { name: 'VOUT', side: 'right', index: 0 },
      { name: 'GND', side: 'right', index: 1 }
    ]
  },
  {
    name: 'Linear Regulator (LDO)',
    category: 'source',
    width: 80,
    height: 50,
    svg: `<svg viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="8" width="60" height="34" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="40" y="22" text-anchor="middle" fill="#22c55e" font-size="9" font-weight="bold">LDO</text>
      <text x="40" y="34" text-anchor="middle" fill="#22c55e" font-size="6">REGULATOR</text>
      <line x1="0" y1="18" x2="10" y2="18" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="32" x2="10" y2="32" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="25" x2="80" y2="25" stroke="#22c55e" stroke-width="2"/>
      <line x1="40" y1="42" x2="40" y2="50" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="16" fill="#22c55e" font-size="5">VIN</text>
      <text x="4" y="35" fill="#22c55e" font-size="5">EN</text>
      <text x="71" y="23" fill="#22c55e" font-size="5">VOUT</text>
      <text x="42" y="48" fill="#22c55e" font-size="5">GND</text>
    </svg>`,
    pins: [
      { name: 'VIN', side: 'left', index: 0 },
      { name: 'EN', side: 'left', index: 1 },
      { name: 'VOUT', side: 'right', index: 0 },
      { name: 'GND', side: 'bottom', index: 0 }
    ]
  },
  {
    name: 'Battery Charger',
    category: 'source',
    width: 80,
    height: 60,
    svg: `<svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="60" height="40" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="40" y="26" text-anchor="middle" fill="#22c55e" font-size="8" font-weight="bold">BATTERY</text>
      <text x="40" y="38" text-anchor="middle" fill="#22c55e" font-size="7">CHARGER</text>
      <polygon points="50,18 58,26 50,34 50,28 44,28 44,24 50,24" fill="#22c55e" stroke="#22c55e"/>
      <line x1="0" y1="20" x2="10" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="40" x2="10" y2="40" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="20" x2="80" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="40" x2="80" y2="40" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="18" fill="#22c55e" font-size="5">VIN</text>
      <text x="4" y="43" fill="#22c55e" font-size="5">GND</text>
      <text x="72" y="18" fill="#22c55e" font-size="5">BAT+</text>
      <text x="72" y="43" fill="#22c55e" font-size="5">BAT-</text>
    </svg>`,
    pins: [
      { name: 'VIN', side: 'left', index: 0 },
      { name: 'GND', side: 'left', index: 1 },
      { name: 'BAT+', side: 'right', index: 0 },
      { name: 'BAT-', side: 'right', index: 1 }
    ]
  },
  {
    name: 'Battery Protection Module',
    category: 'source',
    width: 80,
    height: 60,
    svg: `<svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="60" height="40" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="40" y="24" text-anchor="middle" fill="#22c55e" font-size="7" font-weight="bold">BATTERY</text>
      <text x="40" y="34" text-anchor="middle" fill="#22c55e" font-size="6">PROTECTION</text>
      <circle cx="56" cy="30" r="6" fill="none" stroke="#22c55e" stroke-width="1.5"/>
      <line x1="53" y1="27" x2="59" y2="33" stroke="#22c55e" stroke-width="1.5"/>
      <line x1="0" y1="20" x2="10" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="40" x2="10" y2="40" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="20" x2="80" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="40" x2="80" y2="40" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="18" fill="#22c55e" font-size="5">B+</text>
      <text x="4" y="43" fill="#22c55e" font-size="5">B-</text>
      <text x="72" y="18" fill="#22c55e" font-size="5">P+</text>
      <text x="72" y="43" fill="#22c55e" font-size="5">P-</text>
    </svg>`,
    pins: [
      { name: 'B+', side: 'left', index: 0 },
      { name: 'B-', side: 'left', index: 1 },
      { name: 'P+', side: 'right', index: 0 },
      { name: 'P-', side: 'right', index: 1 }
    ]
  },
  {
    name: 'Power Path Controller',
    category: 'source',
    width: 90,
    height: 60,
    svg: `<svg viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="70" height="40" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="45" y="24" text-anchor="middle" fill="#22c55e" font-size="7" font-weight="bold">POWER PATH</text>
      <text x="45" y="36" text-anchor="middle" fill="#22c55e" font-size="6">CONTROLLER</text>
      <line x1="0" y1="20" x2="10" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="30" x2="10" y2="30" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="40" x2="10" y2="40" stroke="#22c55e" stroke-width="2"/>
      <line x1="80" y1="25" x2="90" y2="25" stroke="#22c55e" stroke-width="2"/>
      <line x1="80" y1="35" x2="90" y2="35" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="18" fill="#22c55e" font-size="4">VIN</text>
      <text x="4" y="28" fill="#22c55e" font-size="4">VBAT</text>
      <text x="4" y="43" fill="#22c55e" font-size="4">GND</text>
      <text x="82" y="23" fill="#22c55e" font-size="4">VOUT</text>
      <text x="82" y="38" fill="#22c55e" font-size="4">STAT</text>
    </svg>`,
    pins: [
      { name: 'VIN', side: 'left', index: 0 },
      { name: 'VBAT', side: 'left', index: 1 },
      { name: 'GND', side: 'left', index: 2 },
      { name: 'VOUT', side: 'right', index: 0 },
      { name: 'STAT', side: 'right', index: 1 }
    ]
  },

  // ============================================
  // CONTROL & COMPUTE
  // ============================================
  {
    name: 'Microcontroller (Generic)',
    category: 'active',
    width: 100,
    height: 80,
    svg: `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="10" width="70" height="60" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="50" y="35" text-anchor="middle" fill="#22c55e" font-size="10" font-weight="bold">MCU</text>
      <text x="50" y="50" text-anchor="middle" fill="#22c55e" font-size="7">MICROCONTROLLER</text>
      <line x1="0" y1="20" x2="15" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="35" x2="15" y2="35" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="50" x2="15" y2="50" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="65" x2="15" y2="65" stroke="#22c55e" stroke-width="2"/>
      <line x1="85" y1="20" x2="100" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="85" y1="35" x2="100" y2="35" stroke="#22c55e" stroke-width="2"/>
      <line x1="85" y1="50" x2="100" y2="50" stroke="#22c55e" stroke-width="2"/>
      <line x1="85" y1="65" x2="100" y2="65" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="18" fill="#22c55e" font-size="4">VCC</text>
      <text x="4" y="33" fill="#22c55e" font-size="4">GND</text>
      <text x="4" y="48" fill="#22c55e" font-size="4">RST</text>
      <text x="4" y="63" fill="#22c55e" font-size="4">CLK</text>
      <text x="87" y="18" fill="#22c55e" font-size="4">GPIO0</text>
      <text x="87" y="33" fill="#22c55e" font-size="4">GPIO1</text>
      <text x="87" y="48" fill="#22c55e" font-size="4">TX</text>
      <text x="87" y="63" fill="#22c55e" font-size="4">RX</text>
    </svg>`,
    pins: [
      { name: 'VCC', side: 'left', index: 0 },
      { name: 'GND', side: 'left', index: 1 },
      { name: 'RST', side: 'left', index: 2 },
      { name: 'CLK', side: 'left', index: 3 },
      { name: 'GPIO0', side: 'right', index: 0 },
      { name: 'GPIO1', side: 'right', index: 1 },
      { name: 'TX', side: 'right', index: 2 },
      { name: 'RX', side: 'right', index: 3 }
    ]
  },
  {
    name: 'Microprocessor',
    category: 'active',
    width: 100,
    height: 80,
    svg: `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="10" width="70" height="60" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="50" y="35" text-anchor="middle" fill="#22c55e" font-size="10" font-weight="bold">MPU</text>
      <text x="50" y="50" text-anchor="middle" fill="#22c55e" font-size="7">MICROPROCESSOR</text>
      <line x1="0" y1="20" x2="15" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="35" x2="15" y2="35" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="50" x2="15" y2="50" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="65" x2="15" y2="65" stroke="#22c55e" stroke-width="2"/>
      <line x1="85" y1="25" x2="100" y2="25" stroke="#22c55e" stroke-width="2"/>
      <line x1="85" y1="40" x2="100" y2="40" stroke="#22c55e" stroke-width="2"/>
      <line x1="85" y1="55" x2="100" y2="55" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="18" fill="#22c55e" font-size="4">VCC</text>
      <text x="4" y="33" fill="#22c55e" font-size="4">GND</text>
      <text x="4" y="48" fill="#22c55e" font-size="4">RST</text>
      <text x="4" y="63" fill="#22c55e" font-size="4">CLK</text>
      <text x="87" y="23" fill="#22c55e" font-size="4">ADDR</text>
      <text x="87" y="38" fill="#22c55e" font-size="4">DATA</text>
      <text x="87" y="53" fill="#22c55e" font-size="4">CTRL</text>
    </svg>`,
    pins: [
      { name: 'VCC', side: 'left', index: 0 },
      { name: 'GND', side: 'left', index: 1 },
      { name: 'RST', side: 'left', index: 2 },
      { name: 'CLK', side: 'left', index: 3 },
      { name: 'ADDR', side: 'right', index: 0 },
      { name: 'DATA', side: 'right', index: 1 },
      { name: 'CTRL', side: 'right', index: 2 }
    ]
  },
  {
    name: 'FPGA (Abstract)',
    category: 'active',
    width: 100,
    height: 80,
    svg: `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="10" width="70" height="60" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="50" y="35" text-anchor="middle" fill="#22c55e" font-size="10" font-weight="bold">FPGA</text>
      <text x="50" y="50" text-anchor="middle" fill="#22c55e" font-size="6">PROGRAMMABLE</text>
      <rect x="30" y="55" width="40" height="8" fill="none" stroke="#22c55e" stroke-width="1"/>
      <line x1="0" y1="25" x2="15" y2="25" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="40" x2="15" y2="40" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="55" x2="15" y2="55" stroke="#22c55e" stroke-width="2"/>
      <line x1="85" y1="25" x2="100" y2="25" stroke="#22c55e" stroke-width="2"/>
      <line x1="85" y1="40" x2="100" y2="40" stroke="#22c55e" stroke-width="2"/>
      <line x1="85" y1="55" x2="100" y2="55" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="23" fill="#22c55e" font-size="4">VCC</text>
      <text x="4" y="38" fill="#22c55e" font-size="4">GND</text>
      <text x="4" y="53" fill="#22c55e" font-size="4">CFG</text>
      <text x="87" y="23" fill="#22c55e" font-size="4">IO_A</text>
      <text x="87" y="38" fill="#22c55e" font-size="4">IO_B</text>
      <text x="87" y="53" fill="#22c55e" font-size="4">IO_C</text>
    </svg>`,
    pins: [
      { name: 'VCC', side: 'left', index: 0 },
      { name: 'GND', side: 'left', index: 1 },
      { name: 'CFG', side: 'left', index: 2 },
      { name: 'IO_A', side: 'right', index: 0 },
      { name: 'IO_B', side: 'right', index: 1 },
      { name: 'IO_C', side: 'right', index: 2 }
    ]
  },
  {
    name: 'Clock Oscillator',
    category: 'active',
    width: 70,
    height: 50,
    svg: `<svg viewBox="0 0 70 50" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="50" height="30" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="35" y="22" text-anchor="middle" fill="#22c55e" font-size="8" font-weight="bold">OSC</text>
      <path d="M20 32 L24 28 L28 36 L32 28 L36 36 L40 28 L44 36 L48 32" fill="none" stroke="#22c55e" stroke-width="1.5"/>
      <line x1="0" y1="20" x2="10" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="35" x2="10" y2="35" stroke="#22c55e" stroke-width="2"/>
      <line x1="60" y1="25" x2="70" y2="25" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="18" fill="#22c55e" font-size="4">VCC</text>
      <text x="4" y="38" fill="#22c55e" font-size="4">GND</text>
      <text x="62" y="23" fill="#22c55e" font-size="4">CLK</text>
    </svg>`,
    pins: [
      { name: 'VCC', side: 'left', index: 0 },
      { name: 'GND', side: 'left', index: 1 },
      { name: 'CLK', side: 'right', index: 0 }
    ]
  },
  {
    name: 'Reset Supervisor',
    category: 'active',
    width: 70,
    height: 50,
    svg: `<svg viewBox="0 0 70 50" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="50" height="30" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="35" y="22" text-anchor="middle" fill="#22c55e" font-size="7" font-weight="bold">RESET</text>
      <text x="35" y="32" text-anchor="middle" fill="#22c55e" font-size="6">SUPERVISOR</text>
      <line x1="0" y1="20" x2="10" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="35" x2="10" y2="35" stroke="#22c55e" stroke-width="2"/>
      <line x1="60" y1="25" x2="70" y2="25" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="18" fill="#22c55e" font-size="4">VCC</text>
      <text x="4" y="38" fill="#22c55e" font-size="4">GND</text>
      <text x="62" y="23" fill="#22c55e" font-size="4">RST</text>
    </svg>`,
    pins: [
      { name: 'VCC', side: 'left', index: 0 },
      { name: 'GND', side: 'left', index: 1 },
      { name: 'RST', side: 'right', index: 0 }
    ]
  },
  {
    name: 'GPIO Expander',
    category: 'active',
    width: 80,
    height: 70,
    svg: `<svg viewBox="0 0 80 70" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="60" height="50" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="40" y="28" text-anchor="middle" fill="#22c55e" font-size="8" font-weight="bold">GPIO</text>
      <text x="40" y="40" text-anchor="middle" fill="#22c55e" font-size="6">EXPANDER</text>
      <line x1="0" y1="20" x2="10" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="35" x2="10" y2="35" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="50" x2="10" y2="50" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="20" x2="80" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="30" x2="80" y2="30" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="40" x2="80" y2="40" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="50" x2="80" y2="50" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="18" fill="#22c55e" font-size="4">SDA</text>
      <text x="4" y="33" fill="#22c55e" font-size="4">SCL</text>
      <text x="4" y="48" fill="#22c55e" font-size="4">INT</text>
      <text x="72" y="18" fill="#22c55e" font-size="4">P0</text>
      <text x="72" y="28" fill="#22c55e" font-size="4">P1</text>
      <text x="72" y="38" fill="#22c55e" font-size="4">P2</text>
      <text x="72" y="48" fill="#22c55e" font-size="4">P3</text>
    </svg>`,
    pins: [
      { name: 'SDA', side: 'left', index: 0 },
      { name: 'SCL', side: 'left', index: 1 },
      { name: 'INT', side: 'left', index: 2 },
      { name: 'P0', side: 'right', index: 0 },
      { name: 'P1', side: 'right', index: 1 },
      { name: 'P2', side: 'right', index: 2 },
      { name: 'P3', side: 'right', index: 3 }
    ]
  },

  // ============================================
  // ACTUATION & DRIVERS
  // ============================================
  {
    name: 'H-Bridge Motor Driver',
    category: 'active',
    width: 90,
    height: 70,
    svg: `<svg viewBox="0 0 90 70" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="10" width="60" height="50" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="45" y="28" text-anchor="middle" fill="#22c55e" font-size="9" font-weight="bold">H-BRIDGE</text>
      <text x="45" y="42" text-anchor="middle" fill="#22c55e" font-size="6">MOTOR DRIVER</text>
      <line x1="0" y1="20" x2="15" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="35" x2="15" y2="35" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="50" x2="15" y2="50" stroke="#22c55e" stroke-width="2"/>
      <line x1="75" y1="25" x2="90" y2="25" stroke="#22c55e" stroke-width="2"/>
      <line x1="75" y1="45" x2="90" y2="45" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="18" fill="#22c55e" font-size="4">VCC</text>
      <text x="4" y="33" fill="#22c55e" font-size="4">IN1</text>
      <text x="4" y="48" fill="#22c55e" font-size="4">IN2</text>
      <text x="77" y="23" fill="#22c55e" font-size="4">OUT1</text>
      <text x="77" y="43" fill="#22c55e" font-size="4">OUT2</text>
    </svg>`,
    pins: [
      { name: 'VCC', side: 'left', index: 0 },
      { name: 'IN1', side: 'left', index: 1 },
      { name: 'IN2', side: 'left', index: 2 },
      { name: 'OUT1', side: 'right', index: 0 },
      { name: 'OUT2', side: 'right', index: 1 }
    ]
  },
  {
    name: 'Half-Bridge Driver',
    category: 'active',
    width: 80,
    height: 60,
    svg: `<svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="60" height="40" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="40" y="26" text-anchor="middle" fill="#22c55e" font-size="8" font-weight="bold">HALF-BRIDGE</text>
      <text x="40" y="38" text-anchor="middle" fill="#22c55e" font-size="6">DRIVER</text>
      <line x1="0" y1="20" x2="10" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="35" x2="10" y2="35" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="25" x2="80" y2="25" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="40" x2="80" y2="40" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="18" fill="#22c55e" font-size="4">VCC</text>
      <text x="4" y="33" fill="#22c55e" font-size="4">IN</text>
      <text x="72" y="23" fill="#22c55e" font-size="4">HO</text>
      <text x="72" y="38" fill="#22c55e" font-size="4">LO</text>
    </svg>`,
    pins: [
      { name: 'VCC', side: 'left', index: 0 },
      { name: 'IN', side: 'left', index: 1 },
      { name: 'HO', side: 'right', index: 0 },
      { name: 'LO', side: 'right', index: 1 }
    ]
  },
  {
    name: 'Low-Side MOSFET Switch',
    category: 'active',
    width: 70,
    height: 50,
    svg: `<svg viewBox="0 0 70 50" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="50" height="30" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="35" y="22" text-anchor="middle" fill="#22c55e" font-size="7" font-weight="bold">LOW-SIDE</text>
      <text x="35" y="32" text-anchor="middle" fill="#22c55e" font-size="6">SWITCH</text>
      <line x1="0" y1="25" x2="10" y2="25" stroke="#22c55e" stroke-width="2"/>
      <line x1="60" y1="15" x2="70" y2="15" stroke="#22c55e" stroke-width="2"/>
      <line x1="60" y1="35" x2="70" y2="35" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="23" fill="#22c55e" font-size="4">GATE</text>
      <text x="62" y="13" fill="#22c55e" font-size="4">DRAIN</text>
      <text x="62" y="38" fill="#22c55e" font-size="4">SRC</text>
    </svg>`,
    pins: [
      { name: 'GATE', side: 'left', index: 0 },
      { name: 'DRAIN', side: 'right', index: 0 },
      { name: 'SOURCE', side: 'right', index: 1 }
    ]
  },
  {
    name: 'High-Side Switch',
    category: 'active',
    width: 70,
    height: 50,
    svg: `<svg viewBox="0 0 70 50" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="50" height="30" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="35" y="22" text-anchor="middle" fill="#22c55e" font-size="7" font-weight="bold">HIGH-SIDE</text>
      <text x="35" y="32" text-anchor="middle" fill="#22c55e" font-size="6">SWITCH</text>
      <line x1="0" y1="15" x2="10" y2="15" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="35" x2="10" y2="35" stroke="#22c55e" stroke-width="2"/>
      <line x1="60" y1="25" x2="70" y2="25" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="13" fill="#22c55e" font-size="4">VIN</text>
      <text x="4" y="38" fill="#22c55e" font-size="4">EN</text>
      <text x="62" y="23" fill="#22c55e" font-size="4">OUT</text>
    </svg>`,
    pins: [
      { name: 'VIN', side: 'left', index: 0 },
      { name: 'EN', side: 'left', index: 1 },
      { name: 'OUT', side: 'right', index: 0 }
    ]
  },
  {
    name: 'Solid State Relay',
    category: 'active',
    width: 80,
    height: 60,
    svg: `<svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="60" height="40" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="40" y="25" text-anchor="middle" fill="#22c55e" font-size="8" font-weight="bold">SSR</text>
      <text x="40" y="38" text-anchor="middle" fill="#22c55e" font-size="6">SOLID STATE</text>
      <line x1="20" y1="30" x2="32" y2="30" stroke="#22c55e" stroke-width="1.5"/>
      <polygon points="32,26 40,30 32,34" fill="none" stroke="#22c55e" stroke-width="1.5"/>
      <line x1="45" y1="30" x2="60" y2="30" stroke="#22c55e" stroke-width="1.5"/>
      <line x1="0" y1="20" x2="10" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="40" x2="10" y2="40" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="20" x2="80" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="40" x2="80" y2="40" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="18" fill="#22c55e" font-size="4">CTL+</text>
      <text x="4" y="43" fill="#22c55e" font-size="4">CTL-</text>
      <text x="72" y="18" fill="#22c55e" font-size="4">L1</text>
      <text x="72" y="43" fill="#22c55e" font-size="4">L2</text>
    </svg>`,
    pins: [
      { name: 'CTL+', side: 'left', index: 0 },
      { name: 'CTL-', side: 'left', index: 1 },
      { name: 'L1', side: 'right', index: 0 },
      { name: 'L2', side: 'right', index: 1 }
    ]
  },
  {
    name: 'Solenoid Driver',
    category: 'active',
    width: 80,
    height: 60,
    svg: `<svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="60" height="40" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="40" y="26" text-anchor="middle" fill="#22c55e" font-size="8" font-weight="bold">SOLENOID</text>
      <text x="40" y="38" text-anchor="middle" fill="#22c55e" font-size="6">DRIVER</text>
      <line x1="0" y1="20" x2="10" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="35" x2="10" y2="35" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="20" x2="80" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="40" x2="80" y2="40" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="18" fill="#22c55e" font-size="4">VCC</text>
      <text x="4" y="33" fill="#22c55e" font-size="4">IN</text>
      <text x="72" y="18" fill="#22c55e" font-size="4">SOL+</text>
      <text x="72" y="43" fill="#22c55e" font-size="4">SOL-</text>
    </svg>`,
    pins: [
      { name: 'VCC', side: 'left', index: 0 },
      { name: 'IN', side: 'left', index: 1 },
      { name: 'SOL+', side: 'right', index: 0 },
      { name: 'SOL-', side: 'right', index: 1 }
    ]
  },
  {
    name: 'Stepper Motor Driver',
    category: 'active',
    width: 90,
    height: 70,
    svg: `<svg viewBox="0 0 90 70" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="10" width="60" height="50" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="45" y="28" text-anchor="middle" fill="#22c55e" font-size="8" font-weight="bold">STEPPER</text>
      <text x="45" y="42" text-anchor="middle" fill="#22c55e" font-size="6">DRIVER</text>
      <line x1="0" y1="20" x2="15" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="35" x2="15" y2="35" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="50" x2="15" y2="50" stroke="#22c55e" stroke-width="2"/>
      <line x1="75" y1="18" x2="90" y2="18" stroke="#22c55e" stroke-width="2"/>
      <line x1="75" y1="31" x2="90" y2="31" stroke="#22c55e" stroke-width="2"/>
      <line x1="75" y1="44" x2="90" y2="44" stroke="#22c55e" stroke-width="2"/>
      <line x1="75" y1="57" x2="90" y2="57" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="18" fill="#22c55e" font-size="4">VCC</text>
      <text x="4" y="33" fill="#22c55e" font-size="4">STEP</text>
      <text x="4" y="48" fill="#22c55e" font-size="4">DIR</text>
      <text x="77" y="16" fill="#22c55e" font-size="4">A1</text>
      <text x="77" y="29" fill="#22c55e" font-size="4">A2</text>
      <text x="77" y="42" fill="#22c55e" font-size="4">B1</text>
      <text x="77" y="55" fill="#22c55e" font-size="4">B2</text>
    </svg>`,
    pins: [
      { name: 'VCC', side: 'left', index: 0 },
      { name: 'STEP', side: 'left', index: 1 },
      { name: 'DIR', side: 'left', index: 2 },
      { name: 'A1', side: 'right', index: 0 },
      { name: 'A2', side: 'right', index: 1 },
      { name: 'B1', side: 'right', index: 2 },
      { name: 'B2', side: 'right', index: 3 }
    ]
  },

  // ============================================
  // MOTORS & LOADS
  // ============================================
  {
    name: 'Stepper Motor',
    category: 'output',
    width: 70,
    height: 60,
    svg: `<svg viewBox="0 0 70 60" xmlns="http://www.w3.org/2000/svg">
      <circle cx="35" cy="30" r="22" fill="none" stroke="#22c55e" stroke-width="2"/>
      <text x="35" y="28" text-anchor="middle" fill="#22c55e" font-size="10" font-weight="bold">M</text>
      <text x="35" y="40" text-anchor="middle" fill="#22c55e" font-size="6">STEP</text>
      <line x1="0" y1="18" x2="13" y2="18" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="30" x2="13" y2="30" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="42" x2="13" y2="42" stroke="#22c55e" stroke-width="2"/>
      <line x1="57" y1="30" x2="70" y2="30" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="16" fill="#22c55e" font-size="4">A1</text>
      <text x="4" y="28" fill="#22c55e" font-size="4">A2</text>
      <text x="4" y="45" fill="#22c55e" font-size="4">B1</text>
      <text x="59" y="28" fill="#22c55e" font-size="4">B2</text>
    </svg>`,
    pins: [
      { name: 'A1', side: 'left', index: 0 },
      { name: 'A2', side: 'left', index: 1 },
      { name: 'B1', side: 'left', index: 2 },
      { name: 'B2', side: 'right', index: 0 }
    ]
  },
  {
    name: 'Servo Motor',
    category: 'output',
    width: 70,
    height: 50,
    svg: `<svg viewBox="0 0 70 50" xmlns="http://www.w3.org/2000/svg">
      <circle cx="35" cy="25" r="18" fill="none" stroke="#22c55e" stroke-width="2"/>
      <text x="35" y="23" text-anchor="middle" fill="#22c55e" font-size="8" font-weight="bold">M</text>
      <text x="35" y="34" text-anchor="middle" fill="#22c55e" font-size="6">SERVO</text>
      <line x1="0" y1="15" x2="17" y2="15" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="25" x2="17" y2="25" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="35" x2="17" y2="35" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="13" fill="#22c55e" font-size="4">VCC</text>
      <text x="4" y="23" fill="#22c55e" font-size="4">SIG</text>
      <text x="4" y="38" fill="#22c55e" font-size="4">GND</text>
    </svg>`,
    pins: [
      { name: 'VCC', side: 'left', index: 0 },
      { name: 'SIG', side: 'left', index: 1 },
      { name: 'GND', side: 'left', index: 2 }
    ]
  },
  {
    name: 'Resistive Load',
    category: 'output',
    width: 60,
    height: 40,
    svg: `<svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="8" width="30" height="24" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="30" y="18" text-anchor="middle" fill="#22c55e" font-size="8" font-weight="bold">R</text>
      <text x="30" y="28" text-anchor="middle" fill="#22c55e" font-size="5">LOAD</text>
      <line x1="0" y1="20" x2="15" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="45" y1="20" x2="60" y2="20" stroke="#22c55e" stroke-width="2"/>
    </svg>`,
    pins: [
      { name: 'IN', side: 'left', index: 0 },
      { name: 'OUT', side: 'right', index: 0 }
    ]
  },
  {
    name: 'Inductive Load',
    category: 'output',
    width: 60,
    height: 40,
    svg: `<svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="8" width="30" height="24" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="30" y="18" text-anchor="middle" fill="#22c55e" font-size="8" font-weight="bold">L</text>
      <text x="30" y="28" text-anchor="middle" fill="#22c55e" font-size="5">LOAD</text>
      <line x1="0" y1="20" x2="15" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="45" y1="20" x2="60" y2="20" stroke="#22c55e" stroke-width="2"/>
    </svg>`,
    pins: [
      { name: 'IN', side: 'left', index: 0 },
      { name: 'OUT', side: 'right', index: 0 }
    ]
  },

  // ============================================
  // ANALOG & SIGNAL CONDITIONING
  // ============================================
  {
    name: 'Instrumentation Amplifier',
    category: 'active',
    width: 80,
    height: 60,
    svg: `<svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
      <polygon points="10,8 10,52 60,30" fill="none" stroke="#22c55e" stroke-width="2"/>
      <text x="30" y="32" text-anchor="middle" fill="#22c55e" font-size="8" font-weight="bold">IN-AMP</text>
      <line x1="0" y1="18" x2="10" y2="18" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="30" x2="10" y2="30" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="42" x2="10" y2="42" stroke="#22c55e" stroke-width="2"/>
      <line x1="60" y1="30" x2="80" y2="30" stroke="#22c55e" stroke-width="2"/>
      <text x="14" y="22" fill="#22c55e" font-size="6">+</text>
      <text x="14" y="44" fill="#22c55e" font-size="8">−</text>
      <text x="14" y="33" fill="#22c55e" font-size="5">REF</text>
    </svg>`,
    pins: [
      { name: 'IN+', side: 'left', index: 0 },
      { name: 'REF', side: 'left', index: 1 },
      { name: 'IN-', side: 'left', index: 2 },
      { name: 'OUT', side: 'right', index: 0 }
    ]
  },
  {
    name: 'Comparator',
    category: 'active',
    width: 70,
    height: 50,
    svg: `<svg viewBox="0 0 70 50" xmlns="http://www.w3.org/2000/svg">
      <polygon points="10,5 10,45 55,25" fill="none" stroke="#22c55e" stroke-width="2"/>
      <text x="28" y="28" text-anchor="middle" fill="#22c55e" font-size="8" font-weight="bold">CMP</text>
      <line x1="0" y1="15" x2="10" y2="15" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="35" x2="10" y2="35" stroke="#22c55e" stroke-width="2"/>
      <line x1="55" y1="25" x2="70" y2="25" stroke="#22c55e" stroke-width="2"/>
      <text x="14" y="18" fill="#22c55e" font-size="7">+</text>
      <text x="14" y="38" fill="#22c55e" font-size="9">−</text>
    </svg>`,
    pins: [
      { name: 'IN+', side: 'left', index: 0 },
      { name: 'IN-', side: 'left', index: 1 },
      { name: 'OUT', side: 'right', index: 0 }
    ]
  },
  {
    name: 'Analog Multiplexer',
    category: 'active',
    width: 80,
    height: 70,
    svg: `<svg viewBox="0 0 80 70" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="10" width="50" height="50" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="40" y="28" text-anchor="middle" fill="#22c55e" font-size="8" font-weight="bold">MUX</text>
      <text x="40" y="42" text-anchor="middle" fill="#22c55e" font-size="6">ANALOG</text>
      <line x1="0" y1="20" x2="15" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="32" x2="15" y2="32" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="44" x2="15" y2="44" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="56" x2="15" y2="56" stroke="#22c55e" stroke-width="2"/>
      <line x1="65" y1="35" x2="80" y2="35" stroke="#22c55e" stroke-width="2"/>
      <line x1="40" y1="60" x2="40" y2="70" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="18" fill="#22c55e" font-size="4">CH0</text>
      <text x="4" y="30" fill="#22c55e" font-size="4">CH1</text>
      <text x="4" y="42" fill="#22c55e" font-size="4">CH2</text>
      <text x="4" y="54" fill="#22c55e" font-size="4">CH3</text>
      <text x="67" y="33" fill="#22c55e" font-size="4">OUT</text>
      <text x="44" y="68" fill="#22c55e" font-size="4">SEL</text>
    </svg>`,
    pins: [
      { name: 'CH0', side: 'left', index: 0 },
      { name: 'CH1', side: 'left', index: 1 },
      { name: 'CH2', side: 'left', index: 2 },
      { name: 'CH3', side: 'left', index: 3 },
      { name: 'OUT', side: 'right', index: 0 },
      { name: 'SEL', side: 'bottom', index: 0 }
    ]
  },
  {
    name: 'RC Low-Pass Filter',
    category: 'passive',
    width: 80,
    height: 50,
    svg: `<svg viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="60" height="30" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="40" y="22" text-anchor="middle" fill="#22c55e" font-size="8" font-weight="bold">RC LPF</text>
      <text x="40" y="34" text-anchor="middle" fill="#22c55e" font-size="6">LOW-PASS</text>
      <line x1="0" y1="20" x2="10" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="35" x2="10" y2="35" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="20" x2="80" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="35" x2="80" y2="35" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="18" fill="#22c55e" font-size="4">IN</text>
      <text x="4" y="38" fill="#22c55e" font-size="4">GND</text>
      <text x="72" y="18" fill="#22c55e" font-size="4">OUT</text>
    </svg>`,
    pins: [
      { name: 'IN', side: 'left', index: 0 },
      { name: 'GND', side: 'left', index: 1 },
      { name: 'OUT', side: 'right', index: 0 },
      { name: 'GND', side: 'right', index: 1 }
    ]
  },
  {
    name: 'LC Filter',
    category: 'passive',
    width: 80,
    height: 50,
    svg: `<svg viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="60" height="30" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="40" y="22" text-anchor="middle" fill="#22c55e" font-size="8" font-weight="bold">LC FILTER</text>
      <path d="M22 30 Q26 24 30 30 Q34 36 38 30 Q42 24 46 30 Q50 36 54 30" fill="none" stroke="#22c55e" stroke-width="1"/>
      <line x1="0" y1="20" x2="10" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="35" x2="10" y2="35" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="20" x2="80" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="35" x2="80" y2="35" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="18" fill="#22c55e" font-size="4">IN</text>
      <text x="4" y="38" fill="#22c55e" font-size="4">GND</text>
      <text x="72" y="18" fill="#22c55e" font-size="4">OUT</text>
    </svg>`,
    pins: [
      { name: 'IN', side: 'left', index: 0 },
      { name: 'GND', side: 'left', index: 1 },
      { name: 'OUT', side: 'right', index: 0 },
      { name: 'GND', side: 'right', index: 1 }
    ]
  },

  // ============================================
  // SENSORS
  // ============================================
  {
    name: 'Analog Sensor (Generic)',
    category: 'measurement',
    width: 70,
    height: 50,
    svg: `<svg viewBox="0 0 70 50" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="50" height="30" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="35" y="22" text-anchor="middle" fill="#22c55e" font-size="7" font-weight="bold">ANALOG</text>
      <text x="35" y="32" text-anchor="middle" fill="#22c55e" font-size="6">SENSOR</text>
      <line x1="0" y1="15" x2="10" y2="15" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="35" x2="10" y2="35" stroke="#22c55e" stroke-width="2"/>
      <line x1="60" y1="25" x2="70" y2="25" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="13" fill="#22c55e" font-size="4">VCC</text>
      <text x="4" y="38" fill="#22c55e" font-size="4">GND</text>
      <text x="62" y="23" fill="#22c55e" font-size="4">OUT</text>
    </svg>`,
    pins: [
      { name: 'VCC', side: 'left', index: 0 },
      { name: 'GND', side: 'left', index: 1 },
      { name: 'OUT', side: 'right', index: 0 }
    ]
  },
  {
    name: 'Digital Sensor',
    category: 'measurement',
    width: 70,
    height: 50,
    svg: `<svg viewBox="0 0 70 50" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="50" height="30" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="35" y="22" text-anchor="middle" fill="#22c55e" font-size="7" font-weight="bold">DIGITAL</text>
      <text x="35" y="32" text-anchor="middle" fill="#22c55e" font-size="6">SENSOR</text>
      <line x1="0" y1="15" x2="10" y2="15" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="35" x2="10" y2="35" stroke="#22c55e" stroke-width="2"/>
      <line x1="60" y1="25" x2="70" y2="25" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="13" fill="#22c55e" font-size="4">VCC</text>
      <text x="4" y="38" fill="#22c55e" font-size="4">GND</text>
      <text x="62" y="23" fill="#22c55e" font-size="4">DATA</text>
    </svg>`,
    pins: [
      { name: 'VCC', side: 'left', index: 0 },
      { name: 'GND', side: 'left', index: 1 },
      { name: 'DATA', side: 'right', index: 0 }
    ]
  },
  {
    name: 'Temperature Sensor',
    category: 'measurement',
    width: 70,
    height: 50,
    svg: `<svg viewBox="0 0 70 50" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="50" height="30" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="35" y="22" text-anchor="middle" fill="#22c55e" font-size="7" font-weight="bold">TEMP</text>
      <text x="35" y="32" text-anchor="middle" fill="#22c55e" font-size="6">SENSOR</text>
      <circle cx="52" cy="25" r="5" fill="none" stroke="#22c55e" stroke-width="1"/>
      <text x="52" y="28" text-anchor="middle" fill="#22c55e" font-size="6">°</text>
      <line x1="0" y1="15" x2="10" y2="15" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="35" x2="10" y2="35" stroke="#22c55e" stroke-width="2"/>
      <line x1="60" y1="25" x2="70" y2="25" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="13" fill="#22c55e" font-size="4">VCC</text>
      <text x="4" y="38" fill="#22c55e" font-size="4">GND</text>
      <text x="62" y="23" fill="#22c55e" font-size="4">OUT</text>
    </svg>`,
    pins: [
      { name: 'VCC', side: 'left', index: 0 },
      { name: 'GND', side: 'left', index: 1 },
      { name: 'OUT', side: 'right', index: 0 }
    ]
  },
  {
    name: 'Pressure Sensor',
    category: 'measurement',
    width: 70,
    height: 50,
    svg: `<svg viewBox="0 0 70 50" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="50" height="30" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="35" y="22" text-anchor="middle" fill="#22c55e" font-size="7" font-weight="bold">PRESS</text>
      <text x="35" y="32" text-anchor="middle" fill="#22c55e" font-size="6">SENSOR</text>
      <line x1="0" y1="15" x2="10" y2="15" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="35" x2="10" y2="35" stroke="#22c55e" stroke-width="2"/>
      <line x1="60" y1="25" x2="70" y2="25" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="13" fill="#22c55e" font-size="4">VCC</text>
      <text x="4" y="38" fill="#22c55e" font-size="4">GND</text>
      <text x="62" y="23" fill="#22c55e" font-size="4">OUT</text>
    </svg>`,
    pins: [
      { name: 'VCC', side: 'left', index: 0 },
      { name: 'GND', side: 'left', index: 1 },
      { name: 'OUT', side: 'right', index: 0 }
    ]
  },
  {
    name: 'Current Sensor',
    category: 'measurement',
    width: 70,
    height: 50,
    svg: `<svg viewBox="0 0 70 50" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="50" height="30" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="35" y="22" text-anchor="middle" fill="#22c55e" font-size="7" font-weight="bold">CURRENT</text>
      <text x="35" y="32" text-anchor="middle" fill="#22c55e" font-size="6">SENSOR</text>
      <line x1="0" y1="15" x2="10" y2="15" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="25" x2="10" y2="25" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="35" x2="10" y2="35" stroke="#22c55e" stroke-width="2"/>
      <line x1="60" y1="25" x2="70" y2="25" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="13" fill="#22c55e" font-size="4">VCC</text>
      <text x="4" y="23" fill="#22c55e" font-size="4">IN</text>
      <text x="4" y="38" fill="#22c55e" font-size="4">GND</text>
      <text x="62" y="23" fill="#22c55e" font-size="4">OUT</text>
    </svg>`,
    pins: [
      { name: 'VCC', side: 'left', index: 0 },
      { name: 'IN', side: 'left', index: 1 },
      { name: 'GND', side: 'left', index: 2 },
      { name: 'OUT', side: 'right', index: 0 }
    ]
  },
  {
    name: 'Voltage Sensor',
    category: 'measurement',
    width: 70,
    height: 50,
    svg: `<svg viewBox="0 0 70 50" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="50" height="30" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="35" y="22" text-anchor="middle" fill="#22c55e" font-size="7" font-weight="bold">VOLTAGE</text>
      <text x="35" y="32" text-anchor="middle" fill="#22c55e" font-size="6">SENSOR</text>
      <line x1="0" y1="15" x2="10" y2="15" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="35" x2="10" y2="35" stroke="#22c55e" stroke-width="2"/>
      <line x1="60" y1="25" x2="70" y2="25" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="13" fill="#22c55e" font-size="4">V+</text>
      <text x="4" y="38" fill="#22c55e" font-size="4">V-</text>
      <text x="62" y="23" fill="#22c55e" font-size="4">OUT</text>
    </svg>`,
    pins: [
      { name: 'V+', side: 'left', index: 0 },
      { name: 'V-', side: 'left', index: 1 },
      { name: 'OUT', side: 'right', index: 0 }
    ]
  },

  // ============================================
  // COMMUNICATION INTERFACES
  // ============================================
  {
    name: 'UART Interface',
    category: 'active',
    width: 70,
    height: 50,
    svg: `<svg viewBox="0 0 70 50" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="50" height="30" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="35" y="28" text-anchor="middle" fill="#22c55e" font-size="10" font-weight="bold">UART</text>
      <line x1="0" y1="20" x2="10" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="30" x2="10" y2="30" stroke="#22c55e" stroke-width="2"/>
      <line x1="60" y1="20" x2="70" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="60" y1="30" x2="70" y2="30" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="18" fill="#22c55e" font-size="4">TX</text>
      <text x="4" y="33" fill="#22c55e" font-size="4">RX</text>
      <text x="62" y="18" fill="#22c55e" font-size="4">RX</text>
      <text x="62" y="33" fill="#22c55e" font-size="4">TX</text>
    </svg>`,
    pins: [
      { name: 'TX', side: 'left', index: 0 },
      { name: 'RX', side: 'left', index: 1 },
      { name: 'RX', side: 'right', index: 0 },
      { name: 'TX', side: 'right', index: 1 }
    ]
  },
  {
    name: 'RS-485 Transceiver',
    category: 'active',
    width: 80,
    height: 60,
    svg: `<svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="60" height="40" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="40" y="28" text-anchor="middle" fill="#22c55e" font-size="9" font-weight="bold">RS-485</text>
      <text x="40" y="40" text-anchor="middle" fill="#22c55e" font-size="6">TRANSCEIVER</text>
      <line x1="0" y1="20" x2="10" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="35" x2="10" y2="35" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="20" x2="80" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="40" x2="80" y2="40" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="18" fill="#22c55e" font-size="4">DI</text>
      <text x="4" y="33" fill="#22c55e" font-size="4">RO</text>
      <text x="72" y="18" fill="#22c55e" font-size="4">A</text>
      <text x="72" y="43" fill="#22c55e" font-size="4">B</text>
    </svg>`,
    pins: [
      { name: 'DI', side: 'left', index: 0 },
      { name: 'RO', side: 'left', index: 1 },
      { name: 'A', side: 'right', index: 0 },
      { name: 'B', side: 'right', index: 1 }
    ]
  },
  {
    name: 'CAN Transceiver',
    category: 'active',
    width: 80,
    height: 60,
    svg: `<svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="60" height="40" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="40" y="28" text-anchor="middle" fill="#22c55e" font-size="10" font-weight="bold">CAN</text>
      <text x="40" y="40" text-anchor="middle" fill="#22c55e" font-size="6">TRANSCEIVER</text>
      <line x1="0" y1="20" x2="10" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="40" x2="10" y2="40" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="20" x2="80" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="40" x2="80" y2="40" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="18" fill="#22c55e" font-size="4">TXD</text>
      <text x="4" y="43" fill="#22c55e" font-size="4">RXD</text>
      <text x="72" y="18" fill="#22c55e" font-size="4">CANH</text>
      <text x="72" y="43" fill="#22c55e" font-size="4">CANL</text>
    </svg>`,
    pins: [
      { name: 'TXD', side: 'left', index: 0 },
      { name: 'RXD', side: 'left', index: 1 },
      { name: 'CANH', side: 'right', index: 0 },
      { name: 'CANL', side: 'right', index: 1 }
    ]
  },
  {
    name: 'SPI Interface',
    category: 'active',
    width: 80,
    height: 60,
    svg: `<svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="60" height="40" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="40" y="34" text-anchor="middle" fill="#22c55e" font-size="12" font-weight="bold">SPI</text>
      <line x1="0" y1="17" x2="10" y2="17" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="30" x2="10" y2="30" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="43" x2="10" y2="43" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="30" x2="80" y2="30" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="15" fill="#22c55e" font-size="4">MOSI</text>
      <text x="4" y="28" fill="#22c55e" font-size="4">MISO</text>
      <text x="4" y="46" fill="#22c55e" font-size="4">SCK</text>
      <text x="72" y="28" fill="#22c55e" font-size="4">CS</text>
    </svg>`,
    pins: [
      { name: 'MOSI', side: 'left', index: 0 },
      { name: 'MISO', side: 'left', index: 1 },
      { name: 'SCK', side: 'left', index: 2 },
      { name: 'CS', side: 'right', index: 0 }
    ]
  },
  {
    name: 'I2C Interface',
    category: 'active',
    width: 70,
    height: 50,
    svg: `<svg viewBox="0 0 70 50" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="50" height="30" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="35" y="28" text-anchor="middle" fill="#22c55e" font-size="10" font-weight="bold">I2C</text>
      <line x1="0" y1="20" x2="10" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="30" x2="10" y2="30" stroke="#22c55e" stroke-width="2"/>
      <line x1="60" y1="20" x2="70" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="60" y1="30" x2="70" y2="30" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="18" fill="#22c55e" font-size="4">SDA</text>
      <text x="4" y="33" fill="#22c55e" font-size="4">SCL</text>
      <text x="62" y="18" fill="#22c55e" font-size="4">SDA</text>
      <text x="62" y="33" fill="#22c55e" font-size="4">SCL</text>
    </svg>`,
    pins: [
      { name: 'SDA', side: 'left', index: 0 },
      { name: 'SCL', side: 'left', index: 1 },
      { name: 'SDA', side: 'right', index: 0 },
      { name: 'SCL', side: 'right', index: 1 }
    ]
  },
  {
    name: 'Ethernet Interface (Abstract)',
    category: 'active',
    width: 90,
    height: 60,
    svg: `<svg viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="10" width="60" height="40" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="45" y="28" text-anchor="middle" fill="#22c55e" font-size="9" font-weight="bold">ETHERNET</text>
      <text x="45" y="40" text-anchor="middle" fill="#22c55e" font-size="6">INTERFACE</text>
      <line x1="0" y1="20" x2="15" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="30" x2="15" y2="30" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="40" x2="15" y2="40" stroke="#22c55e" stroke-width="2"/>
      <line x1="75" y1="25" x2="90" y2="25" stroke="#22c55e" stroke-width="2"/>
      <line x1="75" y1="35" x2="90" y2="35" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="18" fill="#22c55e" font-size="4">RMII</text>
      <text x="4" y="28" fill="#22c55e" font-size="4">CLK</text>
      <text x="4" y="43" fill="#22c55e" font-size="4">MDC</text>
      <text x="77" y="23" fill="#22c55e" font-size="4">TX+</text>
      <text x="77" y="38" fill="#22c55e" font-size="4">TX-</text>
    </svg>`,
    pins: [
      { name: 'RMII', side: 'left', index: 0 },
      { name: 'CLK', side: 'left', index: 1 },
      { name: 'MDC', side: 'left', index: 2 },
      { name: 'TX+', side: 'right', index: 0 },
      { name: 'TX-', side: 'right', index: 1 }
    ]
  },

  // ============================================
  // PROTECTION & SAFETY
  // ============================================
  {
    name: 'Flyback Diode',
    category: 'passive',
    width: 60,
    height: 35,
    svg: `<svg viewBox="0 0 60 35" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="17" x2="15" y2="17" stroke="#22c55e" stroke-width="2"/>
      <polygon points="15,7 15,27 35,17" fill="none" stroke="#22c55e" stroke-width="2"/>
      <line x1="35" y1="7" x2="35" y2="27" stroke="#22c55e" stroke-width="2"/>
      <line x1="35" y1="17" x2="60" y2="17" stroke="#22c55e" stroke-width="2"/>
      <path d="M20 7 L10 2 M20 7 L20 3" fill="none" stroke="#22c55e" stroke-width="1"/>
      <text x="25" y="32" text-anchor="middle" fill="#22c55e" font-size="5">FLYBACK</text>
    </svg>`,
    pins: [
      { name: 'A', side: 'left', index: 0 },
      { name: 'K', side: 'right', index: 0 }
    ]
  },
  {
    name: 'TVS Diode',
    category: 'passive',
    width: 60,
    height: 35,
    svg: `<svg viewBox="0 0 60 35" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="17" x2="15" y2="17" stroke="#22c55e" stroke-width="2"/>
      <polygon points="15,7 15,27 30,17" fill="none" stroke="#22c55e" stroke-width="2"/>
      <line x1="30" y1="7" x2="30" y2="27" stroke="#22c55e" stroke-width="2"/>
      <polygon points="30,7 30,27 45,17" fill="none" stroke="#22c55e" stroke-width="2" transform="rotate(180,37.5,17)"/>
      <line x1="45" y1="17" x2="60" y2="17" stroke="#22c55e" stroke-width="2"/>
      <text x="30" y="32" text-anchor="middle" fill="#22c55e" font-size="5">TVS</text>
    </svg>`,
    pins: [
      { name: 'A', side: 'left', index: 0 },
      { name: 'K', side: 'right', index: 0 }
    ]
  },
  {
    name: 'Polyfuse',
    category: 'passive',
    width: 60,
    height: 35,
    svg: `<svg viewBox="0 0 60 35" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="17" x2="10" y2="17" stroke="#22c55e" stroke-width="2"/>
      <rect x="10" y="7" width="40" height="20" rx="3" fill="none" stroke="#22c55e" stroke-width="2"/>
      <text x="30" y="21" text-anchor="middle" fill="#22c55e" font-size="8" font-weight="bold">PTC</text>
      <line x1="50" y1="17" x2="60" y2="17" stroke="#22c55e" stroke-width="2"/>
    </svg>`,
    pins: [
      { name: 'IN', side: 'left', index: 0 },
      { name: 'OUT', side: 'right', index: 0 }
    ]
  },
  {
    name: 'Reverse Polarity Protection',
    category: 'passive',
    width: 80,
    height: 50,
    svg: `<svg viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="60" height="30" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <text x="40" y="22" text-anchor="middle" fill="#22c55e" font-size="7" font-weight="bold">REVERSE</text>
      <text x="40" y="32" text-anchor="middle" fill="#22c55e" font-size="6">PROTECT</text>
      <line x1="0" y1="20" x2="10" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="35" x2="10" y2="35" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="20" x2="80" y2="20" stroke="#22c55e" stroke-width="2"/>
      <line x1="70" y1="35" x2="80" y2="35" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="18" fill="#22c55e" font-size="4">VIN</text>
      <text x="4" y="38" fill="#22c55e" font-size="4">GND</text>
      <text x="72" y="18" fill="#22c55e" font-size="4">VOUT</text>
    </svg>`,
    pins: [
      { name: 'VIN', side: 'left', index: 0 },
      { name: 'GND', side: 'left', index: 1 },
      { name: 'VOUT', side: 'right', index: 0 },
      { name: 'GND', side: 'right', index: 1 }
    ]
  },
  {
    name: 'E-Stop (Emergency Stop)',
    category: 'connection',
    width: 70,
    height: 50,
    svg: `<svg viewBox="0 0 70 50" xmlns="http://www.w3.org/2000/svg">
      <circle cx="35" cy="25" r="20" fill="#2a2a2f" stroke="#ef4444" stroke-width="3"/>
      <text x="35" y="22" text-anchor="middle" fill="#ef4444" font-size="8" font-weight="bold">E-STOP</text>
      <line x1="25" y1="30" x2="45" y2="30" stroke="#ef4444" stroke-width="2"/>
      <line x1="0" y1="25" x2="15" y2="25" stroke="#22c55e" stroke-width="2"/>
      <line x1="55" y1="25" x2="70" y2="25" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="23" fill="#22c55e" font-size="4">NC</text>
      <text x="57" y="23" fill="#22c55e" font-size="4">COM</text>
    </svg>`,
    pins: [
      { name: 'NC', side: 'left', index: 0 },
      { name: 'COM', side: 'right', index: 0 }
    ]
  },

  // ============================================
  // USER / EXTERNAL INTERFACES
  // ============================================
  {
    name: 'Connector (Generic)',
    category: 'connection',
    width: 50,
    height: 60,
    svg: `<svg viewBox="0 0 50 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="5" width="30" height="50" rx="3" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <circle cx="25" cy="15" r="4" fill="none" stroke="#22c55e" stroke-width="1.5"/>
      <circle cx="25" cy="30" r="4" fill="none" stroke="#22c55e" stroke-width="1.5"/>
      <circle cx="25" cy="45" r="4" fill="none" stroke="#22c55e" stroke-width="1.5"/>
      <line x1="0" y1="15" x2="10" y2="15" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="30" x2="10" y2="30" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="45" x2="10" y2="45" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="13" fill="#22c55e" font-size="4">1</text>
      <text x="4" y="28" fill="#22c55e" font-size="4">2</text>
      <text x="4" y="48" fill="#22c55e" font-size="4">3</text>
    </svg>`,
    pins: [
      { name: '1', side: 'left', index: 0 },
      { name: '2', side: 'left', index: 1 },
      { name: '3', side: 'left', index: 2 }
    ]
  },
  {
    name: 'Terminal Block',
    category: 'connection',
    width: 60,
    height: 50,
    svg: `<svg viewBox="0 0 60 50" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="40" height="30" rx="2" fill="#2a2a2f" stroke="#22c55e" stroke-width="2"/>
      <rect x="15" y="15" width="10" height="20" fill="none" stroke="#22c55e" stroke-width="1.5"/>
      <rect x="35" y="15" width="10" height="20" fill="none" stroke="#22c55e" stroke-width="1.5"/>
      <circle cx="20" cy="25" r="3" fill="#22c55e"/>
      <circle cx="40" cy="25" r="3" fill="#22c55e"/>
      <line x1="0" y1="25" x2="10" y2="25" stroke="#22c55e" stroke-width="2"/>
      <line x1="50" y1="25" x2="60" y2="25" stroke="#22c55e" stroke-width="2"/>
      <text x="20" y="42" text-anchor="middle" fill="#22c55e" font-size="4">TB</text>
    </svg>`,
    pins: [
      { name: 'IN', side: 'left', index: 0 },
      { name: 'OUT', side: 'right', index: 0 }
    ]
  },
  {
    name: 'LED Indicator',
    category: 'output',
    width: 50,
    height: 40,
    svg: `<svg viewBox="0 0 50 40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="25" cy="20" r="12" fill="none" stroke="#22c55e" stroke-width="2"/>
      <circle cx="25" cy="20" r="6" fill="#22c55e" opacity="0.5"/>
      <line x1="35" y1="10" x2="42" y2="5" stroke="#22c55e" stroke-width="1.5"/>
      <line x1="37" y1="20" x2="45" y2="20" stroke="#22c55e" stroke-width="1.5"/>
      <line x1="35" y1="30" x2="42" y2="35" stroke="#22c55e" stroke-width="1.5"/>
      <line x1="0" y1="15" x2="13" y2="15" stroke="#22c55e" stroke-width="2"/>
      <line x1="0" y1="25" x2="13" y2="25" stroke="#22c55e" stroke-width="2"/>
      <text x="4" y="13" fill="#22c55e" font-size="4">A</text>
      <text x="4" y="28" fill="#22c55e" font-size="4">K</text>
    </svg>`,
    pins: [
      { name: 'A', side: 'left', index: 0 },
      { name: 'K', side: 'left', index: 1 }
    ]
  }
];

// Export count for verification
export const symbolCount = newSymbols.length;
console.log(`Total new symbols defined: ${symbolCount}`);
