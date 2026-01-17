import type { CircuitComponent } from '../types';

export const circuitComponents: CircuitComponent[] = [
  // Power Sources
  {
    id: 'battery',
    type: 'battery',
    name: 'Battery',
    description: 'A power source that provides electrical energy to the circuit. Batteries have positive and negative terminals.',
    symbol: 'Battery',
    category: 'source',
    icon: 'battery',
    connections: 2,
    properties: [
      { name: 'Voltage', value: 9, unit: 'V', editable: true },
      { name: 'Type', value: 'DC', unit: '', editable: false },
    ],
  },
  
  // Passive Components
  {
    id: 'resistor',
    type: 'resistor',
    name: 'Resistor',
    description: 'Resists the flow of electric current. The colored bands show its resistance value. Higher resistance reduces current flow.',
    symbol: 'R',
    category: 'passive',
    icon: 'resistor',
    connections: 2,
    properties: [
      { name: 'Resistance', value: 1000, unit: 'Ω', editable: true },
      { name: 'Power Rating', value: 0.25, unit: 'W', editable: false },
    ],
  },
  {
    id: 'capacitor',
    type: 'capacitor',
    name: 'Capacitor',
    description: 'Stores electrical energy temporarily. Can smooth out voltage changes in a circuit.',
    symbol: 'C',
    category: 'passive',
    icon: 'capacitor',
    connections: 2,
    properties: [
      { name: 'Capacitance', value: 100, unit: 'µF', editable: true },
      { name: 'Voltage Rating', value: 16, unit: 'V', editable: false },
    ],
  },
  {
    id: 'inductor',
    type: 'inductor',
    name: 'Inductor',
    description: 'A coil of wire that stores energy in a magnetic field. Resists changes in current flow.',
    symbol: 'L',
    category: 'passive',
    icon: 'inductor',
    connections: 2,
    properties: [
      { name: 'Inductance', value: 10, unit: 'mH', editable: true },
    ],
  },

  // Active Components
  {
    id: 'opamp',
    type: 'opamp',
    name: 'Op-Amp',
    description: 'Operational Amplifier - amplifies voltage signals and performs mathematical operations on analog signals.',
    symbol: 'U',
    category: 'active',
    icon: 'cpu',
    connections: 5,
    properties: [
      { name: 'Model', value: 'LM358', unit: '', editable: false },
      { name: 'Gain', value: 100, unit: '', editable: true },
      { name: 'Supply Voltage', value: 15, unit: 'V', editable: false },
    ],
  },
  {
    id: 'and-gate',
    type: 'and-gate',
    name: 'AND Gate',
    description: 'Logic gate that outputs HIGH only when all inputs are HIGH. Basic building block of digital circuits.',
    symbol: 'AND',
    category: 'active',
    icon: 'cpu',
    connections: 3,
    properties: [
      { name: 'Inputs', value: 2, unit: '', editable: false },
      { name: 'Logic Family', value: 'CMOS', unit: '', editable: false },
    ],
  },
  {
    id: 'or-gate',
    type: 'or-gate',
    name: 'OR Gate',
    description: 'Logic gate that outputs HIGH when at least one input is HIGH.',
    symbol: 'OR',
    category: 'active',
    icon: 'cpu',
    connections: 3,
    properties: [
      { name: 'Inputs', value: 2, unit: '', editable: false },
      { name: 'Logic Family', value: 'CMOS', unit: '', editable: false },
    ],
  },
  {
    id: 'not-gate',
    type: 'not-gate',
    name: 'NOT Gate',
    description: 'Logic gate that inverts the input signal (also called an inverter).',
    symbol: 'NOT',
    category: 'active',
    icon: 'cpu',
    connections: 2,
    properties: [
      { name: 'Logic Family', value: 'CMOS', unit: '', editable: false },
    ],
  },
  {
    id: 'nand-gate',
    type: 'nand-gate',
    name: 'NAND Gate',
    description: 'Logic gate that outputs LOW only when all inputs are HIGH (inverted AND).',
    symbol: 'NAND',
    category: 'active',
    icon: 'cpu',
    connections: 3,
    properties: [
      { name: 'Inputs', value: 2, unit: '', editable: false },
      { name: 'Logic Family', value: 'CMOS', unit: '', editable: false },
    ],
  },
  {
    id: 'nor-gate',
    type: 'nor-gate',
    name: 'NOR Gate',
    description: 'Logic gate that outputs HIGH only when all inputs are LOW (inverted OR).',
    symbol: 'NOR',
    category: 'active',
    icon: 'cpu',
    connections: 3,
    properties: [
      { name: 'Inputs', value: 2, unit: '', editable: false },
      { name: 'Logic Family', value: 'CMOS', unit: '', editable: false },
    ],
  },
  {
    id: 'xor-gate',
    type: 'xor-gate',
    name: 'XOR Gate',
    description: 'Logic gate that outputs HIGH when inputs are different (exclusive OR).',
    symbol: 'XOR',
    category: 'active',
    icon: 'cpu',
    connections: 3,
    properties: [
      { name: 'Inputs', value: 2, unit: '', editable: false },
      { name: 'Logic Family', value: 'CMOS', unit: '', editable: false },
    ],
  },
  {
    id: 'led',
    type: 'led',
    name: 'LED',
    description: 'Light Emitting Diode - lights up when electricity flows through it the right way. Needs a resistor to protect it.',
    symbol: 'D',
    category: 'output',
    icon: 'led',
    connections: 2,
    properties: [
      { name: 'Forward Voltage', value: 2.0, unit: 'V', editable: false },
      { name: 'Color', value: 'Red', unit: '', editable: true },
      { name: 'Current', value: 20, unit: 'mA', editable: false },
    ],
  },
  {
    id: 'diode',
    type: 'diode',
    name: 'Diode',
    description: 'A one-way valve for electricity. Current can only flow in one direction through it.',
    symbol: 'D1',
    category: 'active',
    icon: 'diode',
    connections: 2,
    properties: [
      { name: 'Forward Voltage', value: 0.7, unit: 'V', editable: false },
      { name: 'Type', value: '1N4007', unit: '', editable: false },
    ],
  },
  {
    id: 'transistor',
    type: 'transistor',
    name: 'Transistor',
    description: 'An electronic switch or amplifier. A small current controls a much larger current.',
    symbol: 'Q',
    category: 'active',
    icon: 'transistor',
    connections: 3,
    properties: [
      { name: 'Type', value: 'NPN', unit: '', editable: true },
      { name: 'Model', value: '2N2222', unit: '', editable: false },
    ],
  },

  // Switches and Controls
  {
    id: 'switch',
    type: 'switch',
    name: 'Switch',
    description: 'Opens or closes the circuit. When open, no current flows. When closed, current can pass through.',
    symbol: 'SW',
    category: 'connection',
    icon: 'switch',
    connections: 2,
    properties: [
      { name: 'State', value: 'Open', unit: '', editable: true },
      { name: 'Type', value: 'SPST', unit: '', editable: false },
    ],
  },

  // Output Devices
  {
    id: 'lightbulb',
    type: 'lightbulb',
    name: 'Light Bulb',
    description: 'Produces light when current flows through its filament.',
    symbol: 'BU',
    category: 'output',
    icon: 'lightbulb',
    connections: 2,
    properties: [
      { name: 'Power', value: 5, unit: 'W', editable: true },
      { name: 'Voltage', value: 6, unit: 'V', editable: false },
    ],
  },
  {
    id: 'buzzer',
    type: 'buzzer',
    name: 'Buzzer',
    description: 'Produces sound when electricity flows through it. Used for alarms and signals.',
    symbol: 'BZ',
    category: 'output',
    icon: 'buzzer',
    connections: 2,
    properties: [
      { name: 'Voltage', value: 5, unit: 'V', editable: false },
      { name: 'Frequency', value: 2300, unit: 'Hz', editable: false },
    ],
  },
  {
    id: 'motor',
    type: 'motor',
    name: 'DC Motor',
    description: 'Converts electrical energy into spinning motion. Used in fans, toys, and robots.',
    symbol: 'M',
    category: 'output',
    icon: 'motor',
    connections: 2,
    properties: [
      { name: 'Voltage', value: 6, unit: 'V', editable: true },
      { name: 'Speed', value: 3000, unit: 'RPM', editable: false },
    ],
  },

  // Measurement
  {
    id: 'voltmeter',
    type: 'voltmeter',
    name: 'Voltmeter',
    description: 'Measures the voltage between two points in a circuit.',
    symbol: 'V',
    category: 'measurement',
    icon: 'voltmeter',
    connections: 2,
    properties: [
      { name: 'Range', value: '0-20', unit: 'V', editable: false },
    ],
  },
  {
    id: 'ammeter',
    type: 'ammeter',
    name: 'Ammeter',
    description: 'Measures the current flowing through a circuit.',
    symbol: 'A',
    category: 'measurement',
    icon: 'ammeter',
    connections: 2,
    properties: [
      { name: 'Range', value: '0-1', unit: 'A', editable: false },
    ],
  },

  // Connections
  {
    id: 'wire',
    type: 'wire',
    name: 'Wire',
    description: 'Connects components together so electricity can flow between them.',
    symbol: 'W',
    category: 'connection',
    icon: 'wire',
    connections: 2,
    properties: [],
  },
  {
    id: 'ground',
    type: 'ground',
    name: 'Ground',
    description: 'The reference point at 0 volts in a circuit. All voltages are measured relative to ground.',
    symbol: 'GND',
    category: 'connection',
    icon: 'ground',
    connections: 1,
    properties: [],
  },
];

export const componentCategories = [
  { id: 'source', name: 'Power Sources', icon: 'Zap', color: 'text-red-400' },
  { id: 'passive', name: 'Passive', icon: 'CircuitBoard', color: 'text-purple-400' },
  { id: 'active', name: 'Active', icon: 'Cpu', color: 'text-blue-400' },
  { id: 'output', name: 'Output', icon: 'Lightbulb', color: 'text-amber-400' },
  { id: 'measurement', name: 'Measurement', icon: 'Gauge', color: 'text-cyan-400' },
  { id: 'connection', name: 'Connections', icon: 'Link', color: 'text-green-400' },
];

export const getComponentById = (id: string): CircuitComponent | undefined => {
  return circuitComponents.find((c) => c.id === id);
};

export const getComponentsByCategory = (category: string): CircuitComponent[] => {
  return circuitComponents.filter((c) => c.category === category);
};
