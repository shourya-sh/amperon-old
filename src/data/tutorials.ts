import type { Tutorial, CircuitDiagram } from '../types';

// ============================================================================
// CIRCUIT DIAGRAM DEFINITIONS
// ============================================================================

// Simple Series Circuit: Battery+ -> Resistor -> LED -> Battery- (complete loop)
const simpleSeriesCircuit: CircuitDiagram = {
  title: 'Simple Series Circuit',
  description: 'A basic circuit with a battery, resistor, and LED in series',
  isReadOnly: true,
  showSimulation: true,
  nodes: [
    {
      id: 'battery-1',
      type: 'circuit',
      position: { x: 50, y: 150 },
      data: {
        component: {
          id: 'battery',
          type: 'battery',
          name: 'Battery',
          description: 'Power source',
          symbol: 'Battery',
          category: 'source',
          icon: 'battery',
          connections: 2,
          properties: [
            { name: 'Voltage', value: 9, unit: 'V', editable: true },
            { name: 'Current Supplied', value: 21.2, unit: 'mA', editable: false },
            { name: 'Power Output', value: 191, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'resistor-1',
      type: 'circuit',
      position: { x: 250, y: 50 },
      data: {
        component: {
          id: 'resistor',
          type: 'resistor',
          name: 'Resistor',
          description: 'Protects LED',
          symbol: 'R',
          category: 'passive',
          icon: 'resistor',
          connections: 2,
          properties: [
            { name: 'Resistance', value: 330, unit: 'Ω', editable: true },
            { name: 'Voltage Drop', value: 7, unit: 'V', editable: false },
            { name: 'Current', value: 21.2, unit: 'mA', editable: false },
            { name: 'Power Dissipated', value: 148, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'led-1',
      type: 'circuit',
      position: { x: 450, y: 150 },
      data: {
        component: {
          id: 'led',
          type: 'led',
          name: 'LED',
          description: 'Light output',
          symbol: 'LED',
          category: 'output',
          icon: 'lightbulb',
          connections: 2,
          properties: [
            { name: 'Color', value: 'Red', unit: '', editable: true },
            { name: 'Forward Voltage', value: 2, unit: 'V', editable: false },
            { name: 'Current', value: 21.2, unit: 'mA', editable: false },
            { name: 'Power Dissipated', value: 42, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
  ],
  edges: [
    { id: 'edge-1', source: 'battery-1', target: 'resistor-1', sourceHandle: 'positive' },
    { id: 'edge-2', source: 'resistor-1', target: 'led-1' },
    { id: 'edge-3', source: 'led-1', target: 'battery-1', targetHandle: 'negative' },
  ],
};

// Parallel Circuit: Two independent LED branches from same battery
const parallelCircuit: CircuitDiagram = {
  title: 'Parallel Circuit',
  description: 'Two LED branches that can operate independently',
  isReadOnly: true,
  showSimulation: true,
  nodes: [
    {
      id: 'battery-p',
      type: 'circuit',
      position: { x: 50, y: 150 },
      data: {
        component: {
          id: 'battery',
          type: 'battery',
          name: 'Battery',
          description: 'Power source',
          symbol: 'Battery',
          category: 'source',
          icon: 'battery',
          connections: 2,
          properties: [
            { name: 'Voltage', value: 9, unit: 'V', editable: true },
            { name: 'Current Supplied', value: 42.4, unit: 'mA', editable: false },
            { name: 'Power Output', value: 382, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'led-p1',
      type: 'circuit',
      position: { x: 300, y: 50 },
      data: {
        component: {
          id: 'led',
          type: 'led',
          name: 'LED 1',
          description: 'Red Light',
          symbol: 'LED',
          category: 'output',
          icon: 'lightbulb',
          connections: 2,
          properties: [
            { name: 'Color', value: 'Red', unit: '', editable: true },
            { name: 'Forward Voltage', value: 2, unit: 'V', editable: false },
            { name: 'Current', value: 21.2, unit: 'mA', editable: false },
            { name: 'Power Dissipated', value: 42, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'res-p1',
      type: 'circuit',
      position: { x: 200, y: 50 },
      data: {
        component: {
          id: 'resistor',
          type: 'resistor',
          name: 'Resistor 1',
          description: 'Path 1 protection',
          symbol: 'R',
          category: 'passive',
          icon: 'resistor',
          connections: 2,
          properties: [
            { name: 'Resistance', value: 330, unit: 'Ω', editable: true },
            { name: 'Voltage Drop', value: 7, unit: 'V', editable: false },
            { name: 'Current', value: 21.2, unit: 'mA', editable: false },
            { name: 'Power Dissipated', value: 148, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'led-p2',
      type: 'circuit',
      position: { x: 300, y: 250 },
      data: {
        component: {
          id: 'led',
          type: 'led',
          name: 'LED 2',
          description: 'Green Light',
          symbol: 'LED',
          category: 'output',
          icon: 'lightbulb',
          connections: 2,
          properties: [
            { name: 'Color', value: 'Green', unit: '', editable: true },
            { name: 'Forward Voltage', value: 2.2, unit: 'V', editable: false },
            { name: 'Current', value: 20.6, unit: 'mA', editable: false },
            { name: 'Power Dissipated', value: 45, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'res-p2',
      type: 'circuit',
      position: { x: 200, y: 250 },
      data: {
        component: {
          id: 'resistor',
          type: 'resistor',
          name: 'Resistor 2',
          description: 'Path 2 protection',
          symbol: 'R',
          category: 'passive',
          icon: 'resistor',
          connections: 2,
          properties: [
            { name: 'Resistance', value: 330, unit: 'Ω', editable: true },
            { name: 'Voltage Drop', value: 6.8, unit: 'V', editable: false },
            { name: 'Current', value: 20.6, unit: 'mA', editable: false },
            { name: 'Power Dissipated', value: 140, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
  ],
  edges: [
    // Top branch: Battery+ -> Resistor 1 -> LED 1 -> Battery-
    { id: 'edge-p1', source: 'battery-p', target: 'res-p1', sourceHandle: 'positive' },
    { id: 'edge-p2', source: 'res-p1', target: 'led-p1' },
    { id: 'edge-p3', source: 'led-p1', target: 'battery-p', targetHandle: 'negative' },
    // Bottom branch: Battery+ -> Resistor 2 -> LED 2 -> Battery-
    { id: 'edge-p4', source: 'battery-p', target: 'res-p2', sourceHandle: 'positive' },
    { id: 'edge-p5', source: 'res-p2', target: 'led-p2' },
    { id: 'edge-p6', source: 'led-p2', target: 'battery-p', targetHandle: 'negative' },
  ],
};

// Switch Circuit: Battery+ -> Switch -> Resistor -> LED -> Battery-
const switchCircuit: CircuitDiagram = {
  title: 'Switch-Controlled LED',
  description: 'Using a switch to control circuit operation',
  isReadOnly: true,
  showSimulation: true,
  nodes: [
    {
      id: 'battery-s',
      type: 'circuit',
      position: { x: 50, y: 150 },
      data: {
        component: {
          id: 'battery',
          type: 'battery',
          name: 'Battery',
          description: 'Power source',
          symbol: 'Battery',
          category: 'source',
          icon: 'battery',
          connections: 2,
          properties: [
            { name: 'Voltage', value: 9, unit: 'V', editable: true },
            { name: 'Current Supplied', value: 21.2, unit: 'mA', editable: false },
            { name: 'Power Output', value: 191, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'switch-1',
      type: 'circuit',
      position: { x: 200, y: 50 },
      data: {
        component: {
          id: 'switch',
          type: 'switch',
          name: 'Switch',
          description: 'Control flow',
          symbol: 'SW',
          category: 'passive',
          icon: 'switch',
          connections: 2,
          properties: [
            { name: 'State', value: 'Open', unit: '', editable: true },
            { name: 'Resistance', value: 0, unit: 'Ω', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'resistor-s',
      type: 'circuit',
      position: { x: 350, y: 50 },
      data: {
        component: {
          id: 'resistor',
          type: 'resistor',
          name: 'Resistor',
          description: 'LED protection',
          symbol: 'R',
          category: 'passive',
          icon: 'resistor',
          connections: 2,
          properties: [
            { name: 'Resistance', value: 330, unit: 'Ω', editable: true },
            { name: 'Voltage Drop', value: 7, unit: 'V', editable: false },
            { name: 'Current', value: 21.2, unit: 'mA', editable: false },
            { name: 'Power Dissipated', value: 148, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'led-s',
      type: 'circuit',
      position: { x: 500, y: 150 },
      data: {
        component: {
          id: 'led',
          type: 'led',
          name: 'LED',
          description: 'Indicator',
          symbol: 'LED',
          category: 'output',
          icon: 'lightbulb',
          connections: 2,
          properties: [
            { name: 'Color', value: 'Red', unit: '', editable: true },
            { name: 'Forward Voltage', value: 2, unit: 'V', editable: false },
            { name: 'Current', value: 21.2, unit: 'mA', editable: false },
            { name: 'Power Dissipated', value: 42, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
  ],
  edges: [
    { id: 'edge-s1', source: 'battery-s', target: 'switch-1', sourceHandle: 'positive' },
    { id: 'edge-s2', source: 'switch-1', target: 'resistor-s' },
    { id: 'edge-s3', source: 'resistor-s', target: 'led-s' },
    { id: 'edge-s4', source: 'led-s', target: 'battery-s', targetHandle: 'negative' },
  ],
};

// Diode Protection Circuit
const diodeCircuit: CircuitDiagram = {
  title: 'Diode-Protected Circuit',
  description: 'Diode protecting circuit from reverse polarity',
  isReadOnly: true,
  showSimulation: true,
  nodes: [
    {
      id: 'battery-d',
      type: 'circuit',
      position: { x: 50, y: 150 },
      data: {
        component: {
          id: 'battery',
          type: 'battery',
          name: 'Battery',
          description: 'Power source',
          symbol: 'Battery',
          category: 'source',
          icon: 'battery',
          connections: 2,
          properties: [
            { name: 'Voltage', value: 9, unit: 'V', editable: true },
            { name: 'Current Supplied', value: 19.7, unit: 'mA', editable: false },
            { name: 'Power Output', value: 177, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'diode-1',
      type: 'circuit',
      position: { x: 200, y: 50 },
      data: {
        component: {
          id: 'diode',
          type: 'diode',
          name: 'Diode',
          description: 'Protection',
          symbol: 'D',
          category: 'passive',
          icon: 'diode',
          connections: 2,
          properties: [
            { name: 'Type', value: '1N4007', unit: '', editable: true },
            { name: 'Forward Voltage', value: 0.7, unit: 'V', editable: false },
            { name: 'Current', value: 19.7, unit: 'mA', editable: false },
            { name: 'Max Current', value: 1, unit: 'A', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'resistor-d',
      type: 'circuit',
      position: { x: 350, y: 50 },
      data: {
        component: {
          id: 'resistor',
          type: 'resistor',
          name: 'Resistor',
          description: 'LED protection',
          symbol: 'R',
          category: 'passive',
          icon: 'resistor',
          connections: 2,
          properties: [
            { name: 'Resistance', value: 330, unit: 'Ω', editable: true },
            { name: 'Voltage Drop', value: 6.3, unit: 'V', editable: false },
            { name: 'Current', value: 19.7, unit: 'mA', editable: false },
            { name: 'Power Dissipated', value: 124, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'led-d',
      type: 'circuit',
      position: { x: 500, y: 150 },
      data: {
        component: {
          id: 'led',
          type: 'led',
          name: 'LED',
          description: 'Output',
          symbol: 'LED',
          category: 'output',
          icon: 'lightbulb',
          connections: 2,
          properties: [
            { name: 'Color', value: 'Red', unit: '', editable: true },
            { name: 'Forward Voltage', value: 2, unit: 'V', editable: false },
            { name: 'Current', value: 19.7, unit: 'mA', editable: false },
            { name: 'Power Dissipated', value: 39, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
  ],
  edges: [
    { id: 'edge-d1', source: 'battery-d', target: 'diode-1', sourceHandle: 'positive' },
    { id: 'edge-d2', source: 'diode-1', target: 'resistor-d' },
    { id: 'edge-d3', source: 'resistor-d', target: 'led-d' },
    { id: 'edge-d4', source: 'led-d', target: 'battery-d', targetHandle: 'negative' },
  ],
};

// Voltage Divider Circuit with Voltmeter
const voltageDividerCircuit: CircuitDiagram = {
  title: 'Voltage Divider',
  description: 'Using resistors to divide voltage',
  isReadOnly: true,
  showSimulation: true,
  nodes: [
    {
      id: 'battery-v',
      type: 'circuit',
      position: { x: 50, y: 150 },
      data: {
        component: {
          id: 'battery',
          type: 'battery',
          name: 'Battery',
          description: '9V source',
          symbol: 'Battery',
          category: 'source',
          icon: 'battery',
          connections: 2,
          properties: [
            { name: 'Voltage', value: 9, unit: 'V', editable: true },
            { name: 'Current Supplied', value: 4.5, unit: 'mA', editable: false },
            { name: 'Power Output', value: 40.5, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'resistor-v1',
      type: 'circuit',
      position: { x: 250, y: 50 },
      data: {
        component: {
          id: 'resistor',
          type: 'resistor',
          name: 'R1',
          description: 'Upper resistor',
          symbol: 'R1',
          category: 'passive',
          icon: 'resistor',
          connections: 2,
          properties: [
            { name: 'Resistance', value: 1000, unit: 'Ω', editable: true },
            { name: 'Voltage Drop', value: 4.5, unit: 'V', editable: false },
            { name: 'Current', value: 4.5, unit: 'mA', editable: false },
            { name: 'Power Dissipated', value: 20.25, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'resistor-v2',
      type: 'circuit',
      position: { x: 250, y: 150 },
      data: {
        component: {
          id: 'resistor',
          type: 'resistor',
          name: 'R2',
          description: 'Lower resistor',
          symbol: 'R2',
          category: 'passive',
          icon: 'resistor',
          connections: 2,
          properties: [
            { name: 'Resistance', value: 1000, unit: 'Ω', editable: true },
            { name: 'Voltage Drop', value: 4.5, unit: 'V', editable: false },
            { name: 'Current', value: 4.5, unit: 'mA', editable: false },
            { name: 'Power Dissipated', value: 20.25, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'voltmeter-1',
      type: 'circuit',
      position: { x: 450, y: 100 },
      data: {
        component: {
          id: 'voltmeter',
          type: 'voltmeter',
          name: 'Voltmeter',
          description: 'Measure output',
          symbol: 'V',
          category: 'measurement',
          icon: 'voltmeter',
          connections: 2,
          properties: [
            { name: 'Range', value: '20V', unit: '', editable: false },
            { name: 'Voltage Reading', value: 4.5, unit: 'V', editable: false },
          ],
        },
        rotation: 0,
      },
    },
  ],
  edges: [
    { id: 'edge-v1', source: 'battery-v', target: 'resistor-v1', sourceHandle: 'positive' },
    { id: 'edge-v2', source: 'resistor-v1', target: 'resistor-v2' },
    { id: 'edge-v3', source: 'resistor-v2', target: 'battery-v', targetHandle: 'negative' },
    // Voltmeter probe to junction
    { id: 'edge-v5', source: 'voltmeter-1', target: 'resistor-v1' },
    { id: 'edge-v6', source: 'voltmeter-1', target: 'resistor-v2' },
  ],
};

// Ohm's Law Circuit with Ammeter
const ohmsLawCircuit: CircuitDiagram = {
  title: "Ohm's Law Demonstration",
  description: 'Using ammeter to demonstrate V=IR',
  isReadOnly: true,
  showSimulation: true,
  nodes: [
    {
      id: 'battery-o',
      type: 'circuit',
      position: { x: 50, y: 150 },
      data: {
        component: {
          id: 'battery',
          type: 'battery',
          name: 'Battery',
          description: '9V source',
          symbol: 'Battery',
          category: 'source',
          icon: 'battery',
          connections: 2,
          properties: [
            { name: 'Voltage', value: 9, unit: 'V', editable: true },
            { name: 'Current Supplied', value: 9, unit: 'mA', editable: false },
            { name: 'Power Output', value: 81, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'ammeter-1',
      type: 'circuit',
      position: { x: 250, y: 50 },
      data: {
        component: {
          id: 'ammeter',
          type: 'ammeter',
          name: 'Ammeter',
          description: 'Measure current',
          symbol: 'A',
          category: 'measurement',
          icon: 'ammeter',
          connections: 2,
          properties: [
            { name: 'Range', value: '1A', unit: '', editable: false },
            { name: 'Current Reading', value: 9, unit: 'mA', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'resistor-o',
      type: 'circuit',
      position: { x: 400, y: 150 },
      data: {
        component: {
          id: 'resistor',
          type: 'resistor',
          name: 'Resistor',
          description: 'Variable load',
          symbol: 'R',
          category: 'passive',
          icon: 'resistor',
          connections: 2,
          properties: [
            { name: 'Resistance', value: 1000, unit: 'Ω', editable: true },
            { name: 'Voltage Drop', value: 9, unit: 'V', editable: false },
            { name: 'Current', value: 9, unit: 'mA', editable: false },
            { name: 'Power Dissipated', value: 81, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
  ],
  edges: [
    { id: 'edge-o1', source: 'battery-o', target: 'ammeter-1', sourceHandle: 'positive' },
    { id: 'edge-o2', source: 'ammeter-1', target: 'resistor-o' },
    { id: 'edge-o3', source: 'resistor-o', target: 'battery-o', targetHandle: 'negative' },
  ],
};

// Transistor Switch Circuit
const transistorSwitchCircuit: CircuitDiagram = {
  title: 'Transistor Switch',
  description: 'Using transistor to switch LED on/off',
  isReadOnly: true,
  showSimulation: true,
  nodes: [
    {
      id: 'battery-t',
      type: 'circuit',
      position: { x: 50, y: 150 },
      data: {
        component: {
          id: 'battery',
          type: 'battery',
          name: 'Battery',
          description: '9V main power',
          symbol: 'Battery',
          category: 'source',
          icon: 'battery',
          connections: 2,
          properties: [
            { name: 'Voltage', value: 9, unit: 'V', editable: true },
            { name: 'Current Supplied', value: 21.2, unit: 'mA', editable: false },
            { name: 'Power Output', value: 191, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'transistor-1',
      type: 'circuit',
      position: { x: 250, y: 50 },
      data: {
        component: {
          id: 'transistor',
          type: 'transistor',
          name: 'Transistor',
          description: 'NPN switch',
          symbol: 'Q1',
          category: 'active',
          icon: 'transistor',
          connections: 3,
          properties: [
            { name: 'Type', value: 'NPN 2N2222', unit: '', editable: false },
            { name: 'Base Current', value: 212, unit: 'μA', editable: false },
            { name: 'Collector Current', value: 21.2, unit: 'mA', editable: false },
            { name: 'Power', value: 4.2, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'resistor-t',
      type: 'circuit',
      position: { x: 250, y: 150 },
      data: {
        component: {
          id: 'resistor',
          type: 'resistor',
          name: 'LED Resistor',
          description: 'Protection',
          symbol: 'R1',
          category: 'passive',
          icon: 'resistor',
          connections: 2,
          properties: [
            { name: 'Resistance', value: 330, unit: 'Ω', editable: true },
            { name: 'Voltage Drop', value: 7, unit: 'V', editable: false },
            { name: 'Current', value: 21.2, unit: 'mA', editable: false },
            { name: 'Power Dissipated', value: 148, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'led-t',
      type: 'circuit',
      position: { x: 400, y: 150 },
      data: {
        component: {
          id: 'led',
          type: 'led',
          name: 'LED',
          description: 'Output',
          symbol: 'LED',
          category: 'output',
          icon: 'lightbulb',
          connections: 2,
          properties: [
            { name: 'Color', value: 'Red', unit: '', editable: true },
            { name: 'Forward Voltage', value: 2, unit: 'V', editable: false },
            { name: 'Current', value: 21.2, unit: 'mA', editable: false },
            { name: 'Power Dissipated', value: 42, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
  ],
  edges: [
    { id: 'edge-t1', source: 'battery-t', target: 'transistor-1', sourceHandle: 'positive' },
    { id: 'edge-t2', source: 'transistor-1', target: 'resistor-t' },
    { id: 'edge-t3', source: 'resistor-t', target: 'led-t' },
    { id: 'edge-t4', source: 'led-t', target: 'battery-t', targetHandle: 'negative' },
  ],
};

// Motor Control Circuit with Flyback Diode
const motorCircuit: CircuitDiagram = {
  title: 'Motor Control with Diode Protection',
  description: 'Transistor controlling motor with flyback diode protection',
  isReadOnly: true,
  showSimulation: true,
  nodes: [
    {
      id: 'battery-m',
      type: 'circuit',
      position: { x: 50, y: 150 },
      data: {
        component: {
          id: 'battery',
          type: 'battery',
          name: 'Battery',
          description: '9V main power',
          symbol: 'Battery',
          category: 'source',
          icon: 'battery',
          connections: 2,
          properties: [
            { name: 'Voltage', value: 9, unit: 'V', editable: true },
            { name: 'Current Supplied', value: 150, unit: 'mA', editable: false },
            { name: 'Power Output', value: 1350, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'transistor-m',
      type: 'circuit',
      position: { x: 250, y: 50 },
      data: {
        component: {
          id: 'transistor',
          type: 'transistor',
          name: 'Transistor',
          description: 'Motor driver',
          symbol: 'Q1',
          category: 'active',
          icon: 'transistor',
          connections: 3,
          properties: [
            { name: 'Type', value: 'NPN 2N2222', unit: '', editable: false },
            { name: 'Base Current', value: 1500, unit: 'μA', editable: false },
            { name: 'Collector Current', value: 150, unit: 'mA', editable: false },
            { name: 'Power', value: 30, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'motor-1',
      type: 'circuit',
      position: { x: 400, y: 50 },
      data: {
        component: {
          id: 'motor',
          type: 'motor',
          name: 'Motor',
          description: 'Load',
          symbol: 'M',
          category: 'output',
          icon: 'motor',
          connections: 2,
          properties: [
            { name: 'Voltage', value: 8.8, unit: 'V', editable: false },
            { name: 'Current', value: 150, unit: 'mA', editable: false },
            { name: 'Power', value: 1.32, unit: 'W', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'diode-m',
      type: 'circuit',
      position: { x: 400, y: 150 },
      data: {
        component: {
          id: 'diode',
          type: 'diode',
          name: 'Flyback Diode',
          description: 'Protection',
          symbol: 'D1',
          category: 'passive',
          icon: 'diode',
          connections: 2,
          properties: [
            { name: 'Type', value: '1N4007', unit: '', editable: false },
            { name: 'Forward Voltage', value: 0.7, unit: 'V', editable: false },
            { name: 'Current', value: 0, unit: 'mA', editable: false },
          ],
        },
        rotation: 0,
      },
    },
  ],
  edges: [
    { id: 'edge-m1', source: 'battery-m', target: 'transistor-m', sourceHandle: 'positive' },
    { id: 'edge-m2', source: 'transistor-m', target: 'motor-1' },
    { id: 'edge-m3', source: 'motor-1', target: 'diode-m' },
    { id: 'edge-m4', source: 'diode-m', target: 'battery-m', targetHandle: 'negative' },
  ],
};

// Buzzer Alarm Circuit
const buzzerCircuit: CircuitDiagram = {
  title: 'Buzzer Alarm',
  description: 'Switch-controlled buzzer with visual indicator',
  isReadOnly: true,
  showSimulation: true,
  nodes: [
    {
      id: 'battery-b',
      type: 'circuit',
      position: { x: 50, y: 150 },
      data: {
        component: {
          id: 'battery',
          type: 'battery',
          name: 'Battery',
          description: '9V source',
          symbol: 'Battery',
          category: 'source',
          icon: 'battery',
          connections: 2,
          properties: [
            { name: 'Voltage', value: 9, unit: 'V', editable: true },
            { name: 'Current Supplied', value: 30, unit: 'mA', editable: false },
            { name: 'Power Output', value: 270, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'switch-b',
      type: 'circuit',
      position: { x: 200, y: 50 },
      data: {
        component: {
          id: 'switch',
          type: 'switch',
          name: 'Switch',
          description: 'Trigger',
          symbol: 'SW',
          category: 'passive',
          icon: 'switch',
          connections: 2,
          properties: [
            { name: 'State', value: 'Open', unit: '', editable: true },
            { name: 'Resistance', value: 0, unit: 'Ω', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'buzzer-1',
      type: 'circuit',
      position: { x: 350, y: 150 },
      data: {
        component: {
          id: 'buzzer',
          type: 'buzzer',
          name: 'Buzzer',
          description: 'Audio output',
          symbol: 'BZ',
          category: 'output',
          icon: 'buzzer',
          connections: 2,
          properties: [
            { name: 'Type', value: 'Active', unit: '', editable: false },
            { name: 'Frequency', value: 4000, unit: 'Hz', editable: false },
            { name: 'Current', value: 30, unit: 'mA', editable: false },
            { name: 'Power', value: 270, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
  ],
  edges: [
    { id: 'edge-b1', source: 'battery-b', target: 'switch-b', sourceHandle: 'positive' },
    { id: 'edge-b2', source: 'switch-b', target: 'buzzer-1' },
    { id: 'edge-b3', source: 'buzzer-1', target: 'battery-b', targetHandle: 'negative' },
  ],
};

// ============================================================================
// NEW ADVANCED CIRCUITS FOR EDUCATIONAL DEMONSTRATIONS
// ============================================================================

// 1. Capacitor Charging Circuit: Battery+ -> Switch -> Resistor -> Capacitor -> Battery-
const capacitorChargingCircuit: CircuitDiagram = {
  title: 'Capacitor Charging Circuit',
  description: 'Watch how a capacitor charges and voltage increases over time',
  isReadOnly: true,
  showSimulation: true,
  nodes: [
    {
      id: 'battery-cc',
      type: 'circuit',
      position: { x: 50, y: 150 },
      data: {
        component: {
          id: 'battery',
          type: 'battery',
          name: 'Battery',
          description: '9V Power Source',
          symbol: 'Battery',
          category: 'source',
          icon: 'battery',
          connections: 2,
          properties: [
            { name: 'Voltage', value: 9, unit: 'V', editable: true },
            { name: 'Current Supplied', value: 12.5, unit: 'mA', editable: false },
            { name: 'Power Output', value: 112.5, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'switch-cc',
      type: 'circuit',
      position: { x: 150, y: 50 },
      data: {
        component: {
          id: 'switch',
          type: 'switch',
          name: 'Switch',
          description: 'Start Charging',
          symbol: 'SW',
          category: 'passive',
          icon: 'switch',
          connections: 2,
          properties: [
            { name: 'State', value: 'Closed', unit: '', editable: true },
            { name: 'Resistance', value: 0, unit: 'Ω', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'resistor-cc',
      type: 'circuit',
      position: { x: 250, y: 50 },
      data: {
        component: {
          id: 'resistor',
          type: 'resistor',
          name: 'Resistor',
          description: 'Limits Charging Current',
          symbol: 'R',
          category: 'passive',
          icon: 'resistor',
          connections: 2,
          properties: [
            { name: 'Resistance', value: 680, unit: 'Ω', editable: true },
            { name: 'Voltage Drop', value: 8.5, unit: 'V', editable: false },
            { name: 'Current', value: 12.5, unit: 'mA', editable: false },
            { name: 'Power Dissipated', value: 106, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'capacitor-cc',
      type: 'circuit',
      position: { x: 350, y: 50 },
      data: {
        component: {
          id: 'capacitor',
          type: 'capacitor',
          name: 'Capacitor',
          description: 'Energy Storage',
          symbol: 'C',
          category: 'passive',
          icon: 'capacitor',
          connections: 2,
          properties: [
            { name: 'Capacitance', value: 100, unit: 'µF', editable: true },
            { name: 'Voltage', value: 0.5, unit: 'V', editable: false },
            { name: 'Current', value: 12.5, unit: 'mA', editable: false },
            { name: 'Charging Time', value: 4.2, unit: 's', editable: false },
          ],
        },
        rotation: 0,
      },
    },
  ],
  edges: [
    { id: 'edge-cc1', source: 'battery-cc', target: 'switch-cc', sourceHandle: 'positive' },
    { id: 'edge-cc2', source: 'switch-cc', target: 'resistor-cc' },
    { id: 'edge-cc3', source: 'resistor-cc', target: 'capacitor-cc' },
    { id: 'edge-cc4', source: 'capacitor-cc', target: 'battery-cc', targetHandle: 'negative' },
  ],
};

// 2. LED Brightness Control (Voltage Divider): Battery+ -> R1 -> Divider -> R2 -> LED -> Battery-
const voltageDividerLEDCircuit: CircuitDiagram = {
  title: 'LED Brightness Control (Voltage Divider)',
  description: 'Control LED brightness by adjusting voltage with a potentiometer voltage divider',
  isReadOnly: true,
  showSimulation: true,
  nodes: [
    {
      id: 'battery-vd',
      type: 'circuit',
      position: { x: 50, y: 150 },
      data: {
        component: {
          id: 'battery',
          type: 'battery',
          name: 'Battery',
          description: '9V Power Source',
          symbol: 'Battery',
          category: 'source',
          icon: 'battery',
          connections: 2,
          properties: [
            { name: 'Voltage', value: 9, unit: 'V', editable: true },
            { name: 'Current Supplied', value: 27.5, unit: 'mA', editable: false },
            { name: 'Power Output', value: 247.5, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'resistor-vd1',
      type: 'circuit',
      position: { x: 200, y: 50 },
      data: {
        component: {
          id: 'resistor',
          type: 'resistor',
          name: 'Resistor 1',
          description: 'Upper Divider',
          symbol: 'R',
          category: 'passive',
          icon: 'resistor',
          connections: 2,
          properties: [
            { name: 'Resistance', value: 330, unit: 'Ω', editable: true },
            { name: 'Voltage Drop', value: 3.3, unit: 'V', editable: false },
            { name: 'Current', value: 27.5, unit: 'mA', editable: false },
            { name: 'Power Dissipated', value: 91, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'potentiometer-vd',
      type: 'circuit',
      position: { x: 350, y: 50 },
      data: {
        component: {
          id: 'potentiometer',
          type: 'potentiometer',
          name: 'Potentiometer',
          description: 'Voltage Control (50% position)',
          symbol: 'POT',
          category: 'passive',
          icon: 'potentiometer',
          connections: 3,
          properties: [
            { name: 'Total Resistance', value: 10000, unit: 'Ω', editable: false },
            { name: 'Position', value: 50, unit: '%', editable: true },
            { name: 'Output Voltage', value: 4.5, unit: 'V', editable: false },
            { name: 'Voltage Drop', value: 1.2, unit: 'V', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'resistor-vd2',
      type: 'circuit',
      position: { x: 200, y: 250 },
      data: {
        component: {
          id: 'resistor',
          type: 'resistor',
          name: 'Resistor 2',
          description: 'Lower Divider / LED Protection',
          symbol: 'R',
          category: 'passive',
          icon: 'resistor',
          connections: 2,
          properties: [
            { name: 'Resistance', value: 330, unit: 'Ω', editable: true },
            { name: 'Voltage Drop', value: 2.3, unit: 'V', editable: false },
            { name: 'Current', value: 27.5, unit: 'mA', editable: false },
            { name: 'Power Dissipated', value: 63, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'led-vd',
      type: 'circuit',
      position: { x: 350, y: 250 },
      data: {
        component: {
          id: 'led',
          type: 'led',
          name: 'LED',
          description: 'Brightness Controlled',
          symbol: 'LED',
          category: 'output',
          icon: 'lightbulb',
          connections: 2,
          properties: [
            { name: 'Color', value: 'Red', unit: '', editable: true },
            { name: 'Forward Voltage', value: 2, unit: 'V', editable: false },
            { name: 'Current', value: 27.5, unit: 'mA', editable: false },
            { name: 'Power Dissipated', value: 55, unit: 'mW', editable: false },
            { name: 'Brightness', value: 55, unit: '%', editable: false },
          ],
        },
        rotation: 0,
      },
    },
  ],
  edges: [
    { id: 'edge-vd1', source: 'battery-vd', target: 'resistor-vd1', sourceHandle: 'positive' },
    { id: 'edge-vd2', source: 'resistor-vd1', target: 'potentiometer-vd' },
    { id: 'edge-vd3', source: 'potentiometer-vd', target: 'resistor-vd2' },
    { id: 'edge-vd4', source: 'resistor-vd2', target: 'led-vd' },
    { id: 'edge-vd5', source: 'led-vd', target: 'battery-vd', targetHandle: 'negative' },
  ],
};

// 3. Simple Oscillator/Flasher: Battery+ -> Switch -> Resistor -> Capacitor -> Transistor -> LED -> Battery-
const oscillatorFlasherCircuit: CircuitDiagram = {
  title: 'Simple Oscillator (Flasher)',
  description: 'A transistor-based oscillator that makes the LED blink repeatedly',
  isReadOnly: true,
  showSimulation: true,
  nodes: [
    {
      id: 'battery-osc',
      type: 'circuit',
      position: { x: 50, y: 150 },
      data: {
        component: {
          id: 'battery',
          type: 'battery',
          name: 'Battery',
          description: '9V Power Source',
          symbol: 'Battery',
          category: 'source',
          icon: 'battery',
          connections: 2,
          properties: [
            { name: 'Voltage', value: 9, unit: 'V', editable: true },
            { name: 'Current Supplied', value: 45, unit: 'mA', editable: false },
            { name: 'Power Output', value: 405, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'resistor-osc1',
      type: 'circuit',
      position: { x: 150, y: 50 },
      data: {
        component: {
          id: 'resistor',
          type: 'resistor',
          name: 'Base Resistor',
          description: 'Controls Base Current',
          symbol: 'R',
          category: 'passive',
          icon: 'resistor',
          connections: 2,
          properties: [
            { name: 'Resistance', value: 10000, unit: 'Ω', editable: true },
            { name: 'Voltage Drop', value: 1.8, unit: 'V', editable: false },
            { name: 'Current', value: 18, unit: 'µA', editable: false },
            { name: 'Power Dissipated', value: 32.4, unit: 'µW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'capacitor-osc',
      type: 'circuit',
      position: { x: 250, y: 50 },
      data: {
        component: {
          id: 'capacitor',
          type: 'capacitor',
          name: 'Timing Capacitor',
          description: 'Controls Frequency',
          symbol: 'C',
          category: 'passive',
          icon: 'capacitor',
          connections: 2,
          properties: [
            { name: 'Capacitance', value: 10, unit: 'µF', editable: true },
            { name: 'Voltage', value: 4.5, unit: 'V', editable: false },
            { name: 'Charge', value: 45, unit: 'µC', editable: false },
            { name: 'Frequency', value: 1.5, unit: 'Hz', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'transistor-osc',
      type: 'circuit',
      position: { x: 350, y: 150 },
      data: {
        component: {
          id: 'transistor',
          type: 'transistor',
          name: 'Transistor',
          description: '2N3904 NPN',
          symbol: 'Q',
          category: 'active',
          icon: 'transistor',
          connections: 3,
          properties: [
            { name: 'Type', value: 'NPN', unit: '', editable: false },
            { name: 'Base-Emitter Voltage', value: 0.7, unit: 'V', editable: false },
            { name: 'Collector Current', value: 45, unit: 'mA', editable: false },
            { name: 'State', value: 'Oscillating', unit: '', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'led-osc',
      type: 'circuit',
      position: { x: 450, y: 50 },
      data: {
        component: {
          id: 'led',
          type: 'led',
          name: 'LED',
          description: 'Blinking Output',
          symbol: 'LED',
          category: 'output',
          icon: 'lightbulb',
          connections: 2,
          properties: [
            { name: 'Color', value: 'Red', unit: '', editable: true },
            { name: 'Forward Voltage', value: 2, unit: 'V', editable: false },
            { name: 'Current (peak)', value: 35, unit: 'mA', editable: false },
            { name: 'Power (avg)', value: 31.5, unit: 'mW', editable: false },
            { name: 'Frequency', value: 1.5, unit: 'Hz', editable: false },
          ],
        },
        rotation: 0,
      },
    },
  ],
  edges: [
    { id: 'edge-osc1', source: 'battery-osc', target: 'resistor-osc1', sourceHandle: 'positive' },
    { id: 'edge-osc2', source: 'resistor-osc1', target: 'capacitor-osc' },
    { id: 'edge-osc3', source: 'capacitor-osc', target: 'transistor-osc' },
    { id: 'edge-osc4', source: 'transistor-osc', target: 'led-osc' },
    { id: 'edge-osc5', source: 'led-osc', target: 'battery-osc', targetHandle: 'negative' },
  ],
};

// 4. Three LED Series Circuit: Battery+ -> R1 -> LED1 -> R2 -> LED2 -> R3 -> LED3 -> Battery-
const threeLEDSeriesCircuit: CircuitDiagram = {
  title: 'Three LEDs in Series',
  description: 'See how voltage drops across each LED in a series circuit',
  isReadOnly: true,
  showSimulation: true,
  nodes: [
    {
      id: 'battery-3led',
      type: 'circuit',
      position: { x: 50, y: 150 },
      data: {
        component: {
          id: 'battery',
          type: 'battery',
          name: 'Battery',
          description: '9V Power Source',
          symbol: 'Battery',
          category: 'source',
          icon: 'battery',
          connections: 2,
          properties: [
            { name: 'Voltage', value: 9, unit: 'V', editable: true },
            { name: 'Current Supplied', value: 12.5, unit: 'mA', editable: false },
            { name: 'Power Output', value: 112.5, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'resistor-3led1',
      type: 'circuit',
      position: { x: 150, y: 50 },
      data: {
        component: {
          id: 'resistor',
          type: 'resistor',
          name: 'Resistor 1',
          description: 'Current Limiting',
          symbol: 'R',
          category: 'passive',
          icon: 'resistor',
          connections: 2,
          properties: [
            { name: 'Resistance', value: 100, unit: 'Ω', editable: true },
            { name: 'Voltage Drop', value: 1.25, unit: 'V', editable: false },
            { name: 'Current', value: 12.5, unit: 'mA', editable: false },
            { name: 'Power Dissipated', value: 15.6, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'led-3led1',
      type: 'circuit',
      position: { x: 250, y: 50 },
      data: {
        component: {
          id: 'led',
          type: 'led',
          name: 'LED 1',
          description: 'Red',
          symbol: 'LED',
          category: 'output',
          icon: 'lightbulb',
          connections: 2,
          properties: [
            { name: 'Color', value: 'Red', unit: '', editable: true },
            { name: 'Forward Voltage', value: 2, unit: 'V', editable: false },
            { name: 'Current', value: 12.5, unit: 'mA', editable: false },
            { name: 'Power Dissipated', value: 25, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'led-3led2',
      type: 'circuit',
      position: { x: 350, y: 50 },
      data: {
        component: {
          id: 'led',
          type: 'led',
          name: 'LED 2',
          description: 'Green',
          symbol: 'LED',
          category: 'output',
          icon: 'lightbulb',
          connections: 2,
          properties: [
            { name: 'Color', value: 'Green', unit: '', editable: true },
            { name: 'Forward Voltage', value: 2.2, unit: 'V', editable: false },
            { name: 'Current', value: 12.5, unit: 'mA', editable: false },
            { name: 'Power Dissipated', value: 27.5, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'led-3led3',
      type: 'circuit',
      position: { x: 450, y: 50 },
      data: {
        component: {
          id: 'led',
          type: 'led',
          name: 'LED 3',
          description: 'Blue',
          symbol: 'LED',
          category: 'output',
          icon: 'lightbulb',
          connections: 2,
          properties: [
            { name: 'Color', value: 'Blue', unit: '', editable: true },
            { name: 'Forward Voltage', value: 3.2, unit: 'V', editable: false },
            { name: 'Current', value: 12.5, unit: 'mA', editable: false },
            { name: 'Power Dissipated', value: 40, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
  ],
  edges: [
    { id: 'edge-3led1', source: 'battery-3led', target: 'resistor-3led1', sourceHandle: 'positive' },
    { id: 'edge-3led2', source: 'resistor-3led1', target: 'led-3led1' },
    { id: 'edge-3led3', source: 'led-3led1', target: 'led-3led2' },
    { id: 'edge-3led4', source: 'led-3led2', target: 'led-3led3' },
    { id: 'edge-3led5', source: 'led-3led3', target: 'battery-3led', targetHandle: 'negative' },
  ],
};

// 5. Battery with Load: Battery -> Ammeter -> Variable Resistor -> Battery- (Power Consumption)
const batteryLoadCircuit: CircuitDiagram = {
  title: 'Battery with Load (Power Consumption)',
  description: 'Observe how an ammeter measures current draw and power consumption changes',
  isReadOnly: true,
  showSimulation: true,
  nodes: [
    {
      id: 'battery-load',
      type: 'circuit',
      position: { x: 50, y: 150 },
      data: {
        component: {
          id: 'battery',
          type: 'battery',
          name: 'Battery',
          description: '12V Power Source',
          symbol: 'Battery',
          category: 'source',
          icon: 'battery',
          connections: 2,
          properties: [
            { name: 'Voltage', value: 12, unit: 'V', editable: true },
            { name: 'Current Supplied', value: 240, unit: 'mA', editable: false },
            { name: 'Power Output', value: 2880, unit: 'mW', editable: false },
            { name: 'Internal Resistance', value: 0.5, unit: 'Ω', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'ammeter-load',
      type: 'circuit',
      position: { x: 200, y: 50 },
      data: {
        component: {
          id: 'ammeter',
          type: 'ammeter',
          name: 'Ammeter',
          description: 'Current Measurement',
          symbol: 'A',
          category: 'measurement',
          icon: 'ammeter',
          connections: 2,
          properties: [
            { name: 'Current', value: 240, unit: 'mA', editable: false },
            { name: 'Internal Resistance', value: 0.1, unit: 'Ω', editable: false },
            { name: 'Max Current', value: 1, unit: 'A', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'potentiometer-load',
      type: 'circuit',
      position: { x: 350, y: 50 },
      data: {
        component: {
          id: 'potentiometer',
          type: 'potentiometer',
          name: 'Variable Resistor (Load)',
          description: 'Adjustable Load - 50Ω position',
          symbol: 'POT',
          category: 'passive',
          icon: 'potentiometer',
          connections: 3,
          properties: [
            { name: 'Total Resistance', value: 100, unit: 'Ω', editable: false },
            { name: 'Current Position', value: 50, unit: 'Ω', editable: true },
            { name: 'Voltage Drop', value: 12, unit: 'V', editable: false },
            { name: 'Current Through', value: 240, unit: 'mA', editable: false },
            { name: 'Power Consumed', value: 2880, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
  ],
  edges: [
    { id: 'edge-load1', source: 'battery-load', target: 'ammeter-load', sourceHandle: 'positive' },
    { id: 'edge-load2', source: 'ammeter-load', target: 'potentiometer-load' },
    { id: 'edge-load3', source: 'potentiometer-load', target: 'battery-load', targetHandle: 'negative' },
  ],
};

// 6. Light Sensor Circuit: Battery+ -> R1 -> LDR -> R2 (divider) -> LED -> Battery-
const lightSensorCircuit: CircuitDiagram = {
  title: 'Light Sensor Circuit (Photoresistor)',
  description: 'See how a photoresistor (LDR) changes resistance based on light and affects LED brightness',
  isReadOnly: true,
  showSimulation: true,
  nodes: [
    {
      id: 'battery-ls',
      type: 'circuit',
      position: { x: 50, y: 150 },
      data: {
        component: {
          id: 'battery',
          type: 'battery',
          name: 'Battery',
          description: '9V Power Source',
          symbol: 'Battery',
          category: 'source',
          icon: 'battery',
          connections: 2,
          properties: [
            { name: 'Voltage', value: 9, unit: 'V', editable: true },
            { name: 'Current Supplied', value: 18, unit: 'mA', editable: false },
            { name: 'Power Output', value: 162, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'resistor-ls1',
      type: 'circuit',
      position: { x: 200, y: 50 },
      data: {
        component: {
          id: 'resistor',
          type: 'resistor',
          name: 'Series Resistor',
          description: 'Current Limiting',
          symbol: 'R',
          category: 'passive',
          icon: 'resistor',
          connections: 2,
          properties: [
            { name: 'Resistance', value: 220, unit: 'Ω', editable: true },
            { name: 'Voltage Drop', value: 1.8, unit: 'V', editable: false },
            { name: 'Current', value: 18, unit: 'mA', editable: false },
            { name: 'Power Dissipated', value: 32.4, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'ldr-ls',
      type: 'circuit',
      position: { x: 350, y: 50 },
      data: {
        component: {
          id: 'potentiometer',
          type: 'potentiometer',
          name: 'Photoresistor (LDR)',
          description: 'Light Sensor - Medium Light',
          symbol: 'LDR',
          category: 'passive',
          icon: 'potentiometer',
          connections: 3,
          properties: [
            { name: 'Resistance (Dark)', value: 100000, unit: 'Ω', editable: false },
            { name: 'Resistance (Bright)', value: 500, unit: 'Ω', editable: false },
            { name: 'Current Resistance', value: 5000, unit: 'Ω', editable: true },
            { name: 'Light Level', value: 50, unit: '%', editable: false },
            { name: 'Voltage Output', value: 4.5, unit: 'V', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'resistor-ls2',
      type: 'circuit',
      position: { x: 200, y: 250 },
      data: {
        component: {
          id: 'resistor',
          type: 'resistor',
          name: 'Load Resistor',
          description: 'Voltage Divider',
          symbol: 'R',
          category: 'passive',
          icon: 'resistor',
          connections: 2,
          properties: [
            { name: 'Resistance', value: 4700, unit: 'Ω', editable: true },
            { name: 'Voltage Drop', value: 3.2, unit: 'V', editable: false },
            { name: 'Current', value: 18, unit: 'mA', editable: false },
            { name: 'Power Dissipated', value: 57.6, unit: 'mW', editable: false },
          ],
        },
        rotation: 0,
      },
    },
    {
      id: 'led-ls',
      type: 'circuit',
      position: { x: 350, y: 250 },
      data: {
        component: {
          id: 'led',
          type: 'led',
          name: 'LED',
          description: 'Light Indicator',
          symbol: 'LED',
          category: 'output',
          icon: 'lightbulb',
          connections: 2,
          properties: [
            { name: 'Color', value: 'Yellow', unit: '', editable: true },
            { name: 'Forward Voltage', value: 2, unit: 'V', editable: false },
            { name: 'Current', value: 18, unit: 'mA', editable: false },
            { name: 'Power Dissipated', value: 36, unit: 'mW', editable: false },
            { name: 'Brightness', value: 60, unit: '%', editable: false },
          ],
        },
        rotation: 0,
      },
    },
  ],
  edges: [
    { id: 'edge-ls1', source: 'battery-ls', target: 'resistor-ls1', sourceHandle: 'positive' },
    { id: 'edge-ls2', source: 'resistor-ls1', target: 'ldr-ls' },
    { id: 'edge-ls3', source: 'ldr-ls', target: 'resistor-ls2' },
    { id: 'edge-ls4', source: 'resistor-ls2', target: 'led-ls' },
    { id: 'edge-ls5', source: 'led-ls', target: 'battery-ls', targetHandle: 'negative' },
  ],
};

// ============================================================================
// EXPORT ALL CIRCUITS FOR USE IN TUTORIALS
// ============================================================================

export const allCircuits = {
  simpleSeriesCircuit,
  parallelCircuit,
  switchCircuit,
  diodeCircuit,
  voltageDividerCircuit,
  ohmsLawCircuit,
  transistorSwitchCircuit,
  motorCircuit,
  buzzerCircuit,
  capacitorChargingCircuit,
  voltageDividerLEDCircuit,
  oscillatorFlasherCircuit,
  threeLEDSeriesCircuit,
  batteryLoadCircuit,
  lightSensorCircuit,
};

// ============================================================================
// TUTORIALS ARRAY
// ============================================================================

export const tutorials: Tutorial[] = [
  // Beginner Level
  {
    id: 'intro-to-circuits',
    title: 'What is a Circuit?',
    description: 'Learn the basics of electrical circuits and how electricity flows!',
    difficulty: 'beginner',
    duration: '10 min',
    category: 'Fundamentals',
    icon: '⚡',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'Welcome to Circuits!',
        content: `# Welcome, Young Engineer! 🎉

A **circuit** is like a road for electricity! Just like cars need roads to travel, electricity needs circuits to flow.

## What You'll Learn:
- What electricity is
- How circuits work
- The parts of a circuit

Let's start our adventure!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'What is Electricity?',
        content: `# Electricity - Tiny Moving Particles ⚡

Electricity is made of tiny particles called **electrons**. 

Imagine billions of tiny balls rolling through a tube - that's kind of what electricity is!

## Fun Fact:
Electrons are SO tiny that about 6 quintillion (6,000,000,000,000,000,000) of them pass through a light bulb every second!

When these electrons move together in the same direction, we call it **electric current**.`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Parts of a Circuit',
        content: `# The Three Essential Parts 🔧

Every circuit needs THREE things:

## 1. ⚡ Power Source (Battery)
This pushes the electrons around the circuit - like a water pump!

## 2. 🔌 Wires (Path)
The road that electrons travel on.

## 3. 💡 Load (Light, Motor, etc.)
Something useful that uses the electricity!

If ANY part is missing, the circuit won't work!`,
        type: 'text',
        visualizeComponents: ['battery', 'wire', 'led'],
        completed: false,
      },
      {
        id: 'step-4',
        title: 'Build Your First Circuit!',
        content: `# Time to Build! 🛠️

Let's create a simple circuit:

1. **Drag a Battery** from the components panel
2. **Add an LED** 
3. **Add a Resistor** (this protects the LED!)
4. **Connect them** with wires

The LED should light up! 💡

**Try it now in the canvas!**`,
        type: 'interactive',
        action: {
          type: 'add_component',
          component: 'battery',
        },
        completed: false,
      },
    ],
  },
  {
    id: 'resistors-101',
    title: 'Understanding Resistors',
    description: 'Learn about resistors and how they control electricity flow!',
    difficulty: 'beginner',
    duration: '15 min',
    category: 'Components',
    icon: '🔧',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'What is a Resistor?',
        content: `# Resistors - Traffic Controllers! 🚦

A **resistor** is like a speed bump for electricity. It slows down the flow of electrons!

## Why Do We Need Them?
- **Protect components** - Some parts can't handle too much current
- **Control brightness** - Make LEDs dimmer or brighter
- **Set timing** - Used in many electronic timers

Without resistors, many circuits would break or even catch fire! 🔥`,
        type: 'text',
        visualizeComponents: ['resistor'],
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Reading Resistor Colors',
        content: `# The Color Code 🌈

Resistors have colored bands that tell us their value!

## Common Colors:
- **Black** = 0
- **Brown** = 1
- **Red** = 2
- **Orange** = 3
- **Yellow** = 4
- **Green** = 5
- **Blue** = 6
- **Purple** = 7
- **Gray** = 8
- **White** = 9

## Example:
Brown-Black-Red = 1,000 Ω (1kΩ)

**Pro Tip:** "Bad Boys Race Our Young Girls But Violet Generally Wins"`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Interactive: Choose the Right Resistor',
        content: `# Protect the LED! 💡

LEDs need the right resistor to work safely.

## Your Mission:
An LED needs about 20mA of current and you have a 9V battery.

**Question:** What resistor should you use?

Using Ohm's Law: R = V / I = (9V - 2V) / 0.02A = 350Ω

A **330Ω** or **470Ω** resistor would work great!

**Try adding the right resistor in the canvas!**`,
        type: 'interactive',
        completed: false,
      },
    ],
  },
  {
    id: 'leds-and-lights',
    title: 'LEDs - Light It Up!',
    description: 'Discover how LEDs work and create colorful light circuits!',
    difficulty: 'beginner',
    duration: '12 min',
    category: 'Components',
    icon: '💡',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'What is an LED?',
        content: `# LEDs - Super Efficient Lights! 💡

**LED** stands for **Light Emitting Diode**.

## Why LEDs are Awesome:
- ⚡ Use very little electricity
- ❄️ Stay cool (don't get hot!)
- ⏰ Last for years and years
- 🌈 Come in many colors

LEDs are used in phone screens, traffic lights, and even your TV!`,
        type: 'text',
        visualizeComponents: ['led'],
        completed: false,
      },
      {
        id: 'step-2',
        title: 'The Right Direction',
        content: `# One-Way Street! ➡️

LEDs only work in ONE direction!

## How to Tell:
- **Longer leg** = Positive (Anode) ➕
- **Shorter leg** = Negative (Cathode) ➖

If you connect it backwards, it won't light up (but it won't break either!).

## Remember:
**L**onger leg = **P**ositive (L and P look similar!)`,
        type: 'text',
        completed: false,
      },
    ],
  },

  // Intermediate Level
  {
    id: 'series-parallel',
    title: 'Series vs Parallel Circuits',
    description: 'Master the two fundamental ways to connect components!',
    difficulty: 'intermediate',
    duration: '25 min',
    category: 'Circuit Design',
    icon: '🔀',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'Introduction: Two Ways to Connect',
        content: `# Two Fundamental Circuit Types! 🔌

When you connect components to a power source, there are **two basic ways** to do it:

## 🔗 Series Connection
Components connected **end-to-end**, forming a single path for electricity.

## 🔀 Parallel Connection  
Components connected **side-by-side**, creating multiple paths for electricity.

### Why Does This Matter?
The way you connect components completely changes how your circuit behaves! Understanding this difference is **crucial** for designing any electronic device.

Let's explore each type with interactive examples! 🚀`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Series Circuit: One Path',
        content: `# Series Circuits: All in a Row! ➡️

In a **series circuit**, electricity has only **ONE path** to follow.

## 🔑 Key Rules of Series Circuits:

### 1. Current is IDENTICAL Everywhere
Like a river flowing through - the same amount of water passes every point.

> **I₁ = I₂ = I₃ = I_total**

### 2. Voltage is DIVIDED Among Components
Each component uses up some voltage. Add them all up = battery voltage!

> **V_total = V₁ + V₂ + V₃**

### 3. Total Resistance ADDS UP
More components = more total resistance.

> **R_total = R₁ + R₂ + R₃**

## 🔴 The Big Drawback:
If **ANY** component breaks or is removed, the **entire circuit stops!**

Watch the circuit diagram and click "Simulate" to see the current flow! ⚡`,
        type: 'diagram',
        circuit: {
          title: 'Series Circuit - Two LEDs',
          description: 'Two LEDs connected end-to-end with a shared current',
          isReadOnly: true,
          showSimulation: true,
          nodes: [
            {
              id: 'battery-series',
              type: 'circuit',
              position: { x: 50, y: 150 },
              data: {
                component: {
                  id: 'battery',
                  type: 'battery',
                  name: '9V Battery',
                  description: 'Power source',
                  symbol: 'Battery',
                  category: 'source',
                  icon: 'battery',
                  connections: 2,
                  properties: [
                    { name: 'Voltage', value: 9, unit: 'V', editable: false },
                    { name: 'Current Supplied', value: 15, unit: 'mA', editable: false },
                    { name: 'Power Output', value: 135, unit: 'mW', editable: false },
                  ],
                },
                rotation: 0,
              },
            },
            {
              id: 'resistor-series',
              type: 'circuit',
              position: { x: 180, y: 50 },
              data: {
                component: {
                  id: 'resistor',
                  type: 'resistor',
                  name: 'Resistor',
                  description: 'Current limiter - 330Ω',
                  symbol: 'R',
                  category: 'passive',
                  icon: 'resistor',
                  connections: 2,
                  properties: [
                    { name: 'Resistance', value: 330, unit: 'Ω', editable: false },
                    { name: 'Voltage Drop', value: 4.95, unit: 'V', editable: false },
                    { name: 'Current', value: 15, unit: 'mA', editable: false },
                    { name: 'Power Dissipated', value: 74, unit: 'mW', editable: false },
                  ],
                },
                rotation: 0,
              },
            },
            {
              id: 'led-series-1',
              type: 'circuit',
              position: { x: 340, y: 50 },
              data: {
                component: {
                  id: 'led',
                  type: 'led',
                  name: 'LED 1 (Red)',
                  description: 'Same current as LED 2!',
                  symbol: 'LED',
                  category: 'output',
                  icon: 'lightbulb',
                  connections: 2,
                  properties: [
                    { name: 'Color', value: 'Red', unit: '', editable: false },
                    { name: 'Forward Voltage', value: 2, unit: 'V', editable: false },
                    { name: 'Current', value: 15, unit: 'mA', editable: false },
                    { name: 'Power Dissipated', value: 30, unit: 'mW', editable: false },
                  ],
                },
                rotation: 0,
              },
            },
            {
              id: 'led-series-2',
              type: 'circuit',
              position: { x: 500, y: 150 },
              data: {
                component: {
                  id: 'led',
                  type: 'led',
                  name: 'LED 2 (Red)',
                  description: 'Same current as LED 1!',
                  symbol: 'LED',
                  category: 'output',
                  icon: 'lightbulb',
                  connections: 2,
                  properties: [
                    { name: 'Color', value: 'Red', unit: '', editable: false },
                    { name: 'Forward Voltage', value: 2, unit: 'V', editable: false },
                    { name: 'Current', value: 15, unit: 'mA', editable: false },
                    { name: 'Power Dissipated', value: 30, unit: 'mW', editable: false },
                  ],
                },
                rotation: 0,
              },
            },
          ],
          edges: [
            { id: 'edge-s1', source: 'battery-series', target: 'resistor-series', sourceHandle: 'positive' },
            { id: 'edge-s2', source: 'resistor-series', target: 'led-series-1' },
            { id: 'edge-s3', source: 'led-series-1', target: 'led-series-2' },
            { id: 'edge-s4', source: 'led-series-2', target: 'battery-series', targetHandle: 'negative' },
          ],
        },
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Series Math: Adding it Up',
        content: `# Let's Do the Math! 🧮

Looking at our series circuit with 2 LEDs:

## Voltage Distribution:
| Component | Voltage Drop |
|-----------|-------------|
| Resistor (330Ω) | 4.95V |
| LED 1 | 2.0V |
| LED 2 | 2.0V |
| **Total** | **≈9V** ✅ |

## Current Check:
- Current through Resistor: **15mA**
- Current through LED 1: **15mA**  
- Current through LED 2: **15mA**

👉 **Same current everywhere!** This is the defining feature of series circuits.

## The Voltage Formula:
\`V_battery = V_resistor + V_LED1 + V_LED2\`
\`9V = 4.95V + 2V + 2V\`

## 💡 Pro Tip:
If you add MORE LEDs in series, each one gets **less voltage** (and appears dimmer). The total voltage must still equal the battery!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-4',
        title: 'Parallel Circuit: Multiple Paths',
        content: `# Parallel Circuits: Choose Your Path! 🔀

In a **parallel circuit**, electricity has **MULTIPLE paths** to choose from.

## 🔑 Key Rules of Parallel Circuits:

### 1. Voltage is IDENTICAL Across All Branches
Each component "sees" the full battery voltage!

> **V₁ = V₂ = V₃ = V_source**

### 2. Current is DIVIDED Among Branches
The total current splits up - like a river dividing into streams.

> **I_total = I₁ + I₂ + I₃**

### 3. Total Resistance DECREASES
More paths = easier for current to flow!

> **1/R_total = 1/R₁ + 1/R₂ + 1/R₃**

## ✅ The Big Advantage:
If one component breaks, **the others keep working!**

Observe how each LED has its own separate path in this circuit! ⚡`,
        type: 'diagram',
        circuit: {
          title: 'Parallel Circuit - Two LEDs',
          description: 'Two LEDs with independent paths - each gets full voltage!',
          isReadOnly: true,
          showSimulation: true,
          nodes: [
            {
              id: 'battery-parallel',
              type: 'circuit',
              position: { x: 50, y: 150 },
              data: {
                component: {
                  id: 'battery',
                  type: 'battery',
                  name: '9V Battery',
                  description: 'Power source',
                  symbol: 'Battery',
                  category: 'source',
                  icon: 'battery',
                  connections: 2,
                  properties: [
                    { name: 'Voltage', value: 9, unit: 'V', editable: false },
                    { name: 'Current Supplied', value: 42, unit: 'mA', editable: false },
                    { name: 'Power Output', value: 378, unit: 'mW', editable: false },
                  ],
                },
                rotation: 0,
              },
            },
            {
              id: 'resistor-parallel-1',
              type: 'circuit',
              position: { x: 220, y: 50 },
              data: {
                component: {
                  id: 'resistor',
                  type: 'resistor',
                  name: 'Resistor 1',
                  description: '330Ω - Branch 1',
                  symbol: 'R1',
                  category: 'passive',
                  icon: 'resistor',
                  connections: 2,
                  properties: [
                    { name: 'Resistance', value: 330, unit: 'Ω', editable: false },
                    { name: 'Voltage Drop', value: 7, unit: 'V', editable: false },
                    { name: 'Current', value: 21, unit: 'mA', editable: false },
                    { name: 'Power Dissipated', value: 147, unit: 'mW', editable: false },
                  ],
                },
                rotation: 0,
              },
            },
            {
              id: 'led-parallel-1',
              type: 'circuit',
              position: { x: 400, y: 50 },
              data: {
                component: {
                  id: 'led',
                  type: 'led',
                  name: 'LED 1 (Red)',
                  description: 'Full brightness - 21mA!',
                  symbol: 'LED',
                  category: 'output',
                  icon: 'lightbulb',
                  connections: 2,
                  properties: [
                    { name: 'Color', value: 'Red', unit: '', editable: false },
                    { name: 'Forward Voltage', value: 2, unit: 'V', editable: false },
                    { name: 'Current', value: 21, unit: 'mA', editable: false },
                    { name: 'Power Dissipated', value: 42, unit: 'mW', editable: false },
                  ],
                },
                rotation: 0,
              },
            },
            {
              id: 'resistor-parallel-2',
              type: 'circuit',
              position: { x: 220, y: 250 },
              data: {
                component: {
                  id: 'resistor',
                  type: 'resistor',
                  name: 'Resistor 2',
                  description: '330Ω - Branch 2',
                  symbol: 'R2',
                  category: 'passive',
                  icon: 'resistor',
                  connections: 2,
                  properties: [
                    { name: 'Resistance', value: 330, unit: 'Ω', editable: false },
                    { name: 'Voltage Drop', value: 7, unit: 'V', editable: false },
                    { name: 'Current', value: 21, unit: 'mA', editable: false },
                    { name: 'Power Dissipated', value: 147, unit: 'mW', editable: false },
                  ],
                },
                rotation: 0,
              },
            },
            {
              id: 'led-parallel-2',
              type: 'circuit',
              position: { x: 400, y: 250 },
              data: {
                component: {
                  id: 'led',
                  type: 'led',
                  name: 'LED 2 (Green)',
                  description: 'Full brightness - 21mA!',
                  symbol: 'LED',
                  category: 'output',
                  icon: 'lightbulb',
                  connections: 2,
                  properties: [
                    { name: 'Color', value: 'Green', unit: '', editable: false },
                    { name: 'Forward Voltage', value: 2, unit: 'V', editable: false },
                    { name: 'Current', value: 21, unit: 'mA', editable: false },
                    { name: 'Power Dissipated', value: 42, unit: 'mW', editable: false },
                  ],
                },
                rotation: 0,
              },
            },
          ],
          edges: [
            { id: 'edge-p1', source: 'battery-parallel', target: 'resistor-parallel-1', sourceHandle: 'positive' },
            { id: 'edge-p2', source: 'resistor-parallel-1', target: 'led-parallel-1' },
            { id: 'edge-p3', source: 'led-parallel-1', target: 'battery-parallel', targetHandle: 'negative' },
            { id: 'edge-p4', source: 'battery-parallel', target: 'resistor-parallel-2', sourceHandle: 'positive' },
            { id: 'edge-p5', source: 'resistor-parallel-2', target: 'led-parallel-2' },
            { id: 'edge-p6', source: 'led-parallel-2', target: 'battery-parallel', targetHandle: 'negative' },
          ],
        },
        completed: false,
      },
      {
        id: 'step-5',
        title: 'Parallel Math: Splitting Current',
        content: `# Let's Do the Math! 🧮

Looking at our parallel circuit with 2 LEDs:

## Voltage Distribution:
| Branch | Voltage |
|--------|---------|
| Branch 1 (R1 + LED1) | 7V + 2V = **9V** |
| Branch 2 (R2 + LED2) | 7V + 2V = **9V** |

👉 **Each branch gets the FULL 9V!** This is why parallel LEDs are brighter.

## Current Distribution:
| Path | Current |
|------|---------|
| Through R1 + LED1 | 21mA |
| Through R2 + LED2 | 21mA |
| **From Battery** | **42mA** (total) |

## The Current Formula:
\`I_battery = I_branch1 + I_branch2\`
\`42mA = 21mA + 21mA\`

## 💡 Pro Tip:
Adding MORE parallel branches draws **more total current** from the battery, but each LED stays at full brightness!

## ⚠️ Warning:
Parallel circuits can drain batteries faster because they draw more current!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-6',
        title: 'Side-by-Side Comparison',
        content: `# Series vs Parallel: The Ultimate Showdown! ⚔️

## 📊 Quick Comparison Table:

| Feature | Series 🔗 | Parallel 🔀 |
|---------|----------|-------------|
| **Paths** | ONE path | MULTIPLE paths |
| **Voltage** | DIVIDED among components | SAME for all components |
| **Current** | SAME everywhere | DIVIDED among paths |
| **If one breaks?** | ENTIRE circuit stops ❌ | Others keep working ✅ |
| **LED Brightness** | Dimmer (shared voltage) | Brighter (full voltage) |
| **Battery Drain** | Lower current draw | Higher current draw |
| **Resistance** | R_total = R₁ + R₂ + ... | 1/R_total = 1/R₁ + 1/R₂ + ... |

## 🎄 Real-World Examples:

### Series (One Path):
- Old Christmas tree lights (one breaks, all go out!)
- Battery cells in a flashlight (voltages add up)
- Light switches on the wall (must be ON for light to work)

### Parallel (Multiple Paths):
- Modern Christmas lights (one breaks, rest stay on)
- House electrical outlets (each device gets 120V)
- USB hubs (each device gets power independently)`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-7',
        title: 'Visual Memory Trick',
        content: `# Remember This Forever! 🧠

## The Water Pipe Analogy 💧

### Series = Single Pipe
Imagine water flowing through **one pipe** with obstacles:
- Same amount of water (current) passes each obstacle
- Each obstacle slows down the pressure (voltage drop)
- Block one section = NO water flows anywhere!

### Parallel = Split Pipes
Imagine water splitting into **multiple pipes**:
- Each pipe gets the full water pressure (voltage)
- Water amount (current) divides between pipes
- Block one pipe = others still flow!

---

## 📝 Memory Trick:

### **S**eries = **S**ame current
### **P**arallel = **S**ame voltage (P's point different directions like split paths!)

---

## 🎯 Quick Quiz for Yourself:
1. In series, if one LED goes out, what happens? *(Answer: All go out)*
2. In parallel, what does each LED get? *(Answer: Full voltage)*
3. Which uses more battery power with 2 LEDs? *(Answer: Parallel)*`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-8',
        title: 'Build a Series Circuit',
        content: `# Challenge 1: Build a Series Circuit! 🔗

## Your Mission:
Create a **series circuit** with the following components:

1. **1 Battery** (power source)
2. **1 Resistor** (to limit current)  
3. **2 LEDs** (connected one after another)

## Steps:
1. Drag a **Battery** onto the canvas
2. Drag a **Resistor** and connect it to the battery's (+)
3. Drag **LED 1** and connect it to the resistor
4. Drag **LED 2** and connect it to LED 1
5. Connect LED 2 back to the battery's (-)

## 🎯 What to Observe:
- Click **Simulate** and watch the current flow
- Notice both LEDs have the **same current**
- Try the "i" button on each component to see the values

## ✅ Success Criteria:
- All components connected in ONE loop
- Circuit simulates successfully
- Current flows through all components

**Pro tip:** Keep components in a line for a clean series circuit!`,
        type: 'interactive',
        circuit: {
          isReadOnly: false,
          showSimulation: true,
          nodes: [],
          edges: [],
        },
        validationCriteria: {
          requireComponents: ['battery', 'resistor', 'led'],
          requireMinConnections: 4,
          requirePowerSource: true,
        },
        completed: false,
      },
      {
        id: 'step-9',
        title: 'Build a Parallel Circuit',
        content: `# Challenge 2: Build a Parallel Circuit! 🔀

## Your Mission:
Create a **parallel circuit** with two separate LED branches!

1. **1 Battery** (power source)
2. **2 Resistors** (one for each branch)
3. **2 LEDs** (each in its own branch)

## Steps:
1. Drag a **Battery** onto the canvas
2. Create **Branch 1**: Resistor → LED → back to battery (-)
3. Create **Branch 2**: Another Resistor → LED → back to battery (-)
4. Both branches connect to battery (+) and battery (-)

## 🎯 What to Observe:
- Each LED gets its **own resistor** (important for protection!)
- The battery supplies **more total current** than in series
- Each LED should appear equally bright

## 💡 Parallel Pattern:
\`\`\`
        ┌─ R1 ─ LED1 ─┐
(+) ────┤              ├──── (-)
        └─ R2 ─ LED2 ─┘
\`\`\`

## ⚡ Compare the Results:
- How does the battery current compare to your series circuit?
- Which circuit would drain the battery faster?`,
        type: 'interactive',
        circuit: {
          isReadOnly: false,
          showSimulation: true,
          nodes: [],
          edges: [],
        },
        validationCriteria: {
          requireComponents: ['battery', 'resistor', 'led'],
          requireMinConnections: 6,
          requirePowerSource: true,
        },
        completed: false,
      },
      {
        id: 'step-10',
        title: 'Knowledge Check',
        content: `# Test Your Understanding! 🎓

## Question 1:
You have 3 LEDs in series with a 9V battery. Each LED drops 2V. How much voltage is left for the resistor?

**Answer:** 9V - (3 × 2V) = 9V - 6V = **3V** for the resistor ✅

---

## Question 2:
In a parallel circuit with 3 branches, if each branch draws 20mA, how much total current does the battery supply?

**Answer:** 20mA × 3 = **60mA** total ✅

---

## Question 3:
You're designing fairy lights. Why would modern designers choose parallel over series?

**Answer:** If one bulb burns out in a **parallel** circuit, the others stay lit! In series, one failure = all dark! 🎄

---

## Question 4:
Your circuit has 2 parallel 100Ω resistors. What's the total resistance?

**Answer:** 1/R_total = 1/100 + 1/100 = 2/100, so R_total = **50Ω** 
(Two equal parallel resistors = half the resistance of one!)

---

## 🏆 Congratulations!
You now understand the difference between series and parallel circuits!`,
        type: 'text',
        completed: false,
      },
    ],
  },
  {
    id: 'ohms-law',
    title: "Ohm's Law - The Magic Formula",
    description: 'Master the most important equation in electronics!',
    difficulty: 'intermediate',
    duration: '25 min',
    category: 'Theory',
    icon: '📐',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: "Introducing Ohm's Law",
        content: `# The Golden Rule ⚡

**Ohm's Law** is the most important formula in electronics:

# V = I × R

- **V** = Voltage (Volts) - electrical pressure
- **I** = Current (Amps) - flow of electricity
- **R** = Resistance (Ohms) - opposition to flow

## The Triangle Trick:
Put V at top, I and R at bottom. Cover what you want to find!

- Want V? It's I × R
- Want I? It's V ÷ R
- Want R? It's V ÷ I`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Real World Examples',
        content: `# Let's Calculate! 🧮

## Example 1:
You have a 9V battery and a 1000Ω resistor. How much current flows?

I = V ÷ R = 9 ÷ 1000 = 0.009A = **9mA**

## Example 2:
An LED needs 20mA at 2V. The battery is 9V. What resistor do you need?

Voltage across resistor = 9V - 2V = 7V
R = V ÷ I = 7 ÷ 0.02 = **350Ω**

Use a 330Ω or 470Ω (these are standard values)

### Build Your Own Circuit:
Create different resistor values and use the ammeter to verify your Ohm's Law calculations!`,
        type: 'interactive',
        circuit: {
          isReadOnly: false,
          showSimulation: true,
          nodes: [],
          edges: [],
        },
        validationCriteria: {
          requireComponents: ['battery', 'resistor'],
          requireMinConnections: 2,
          requirePowerSource: true,
        },
        completed: false,
      },
    ],
  },
  {
    id: 'switches-buttons',
    title: 'Switches and Buttons',
    description: 'Learn to control your circuits with switches!',
    difficulty: 'intermediate',
    duration: '15 min',
    category: 'Components',
    icon: '🔘',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'Types of Switches',
        content: `# Control the Flow! 🎮

Switches let you turn circuits ON and OFF!

## Common Types:

### Toggle Switch
- Stays in position (ON or OFF)
- Like a light switch

### Push Button
- Only ON while pressed
- Like a doorbell

### SPST, SPDT, DPDT
- Single/Double Pole (how many circuits)
- Single/Double Throw (how many positions)`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Build a Switch Circuit',
        content: `# Try It Yourself! 🎮

Now build your own switch-controlled circuit:

1. **Add a Battery** (9V)
2. **Add a Switch** (controls current)
3. **Add a Resistor** (330Ω protection)
4. **Add an LED** (output)
5. **Connect them in series**
6. **Click Simulate** and toggle the switch!

### Remember:
- Switches **break** the circuit when OFF (no current)
- Switches **complete** the circuit when ON (current flows)
- With no switch, current always flows!`,
        type: 'interactive',
        circuit: {
          isReadOnly: false,
          showSimulation: true,
          nodes: [],
          edges: [],
        },
        validationCriteria: {
          requireComponents: ['battery', 'switch', 'led', 'resistor'],
          requireMinConnections: 4,
          requirePowerSource: true,
        },
        completed: false,
      },
    ],
  },

  // Advanced Level
  {
    id: 'transistors',
    title: 'Transistors - Electronic Switches',
    description: 'Discover the building blocks of computers!',
    difficulty: 'advanced',
    duration: '30 min',
    category: 'Components',
    icon: '🔌',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'What is a Transistor?',
        content: `# The Most Important Invention! 🏆

**Transistors** are electronic switches that changed the world!

## Two Main Uses:
1. **Switching** - Turn things ON/OFF with tiny signals
2. **Amplifying** - Make weak signals stronger

## Fun Fact:
Your phone has BILLIONS of transistors, each smaller than a virus! 🤯

A transistor has 3 pins:
- **Base (B)** - The control pin
- **Collector (C)** - Current flows IN
- **Emitter (E)** - Current flows OUT`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'NPN vs PNP',
        content: `# Two Flavors 🍦

## NPN Transistor
- Most common type
- Current flows from Collector to Emitter
- Base needs POSITIVE voltage to turn ON
- Think: "Not Pointing iN"

## PNP Transistor
- Current flows from Emitter to Collector
- Base needs NEGATIVE voltage to turn ON
- Think: "Pointing iN Permanently"

For beginners, NPN (like 2N2222) is easier to use!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Build a Touch Sensor',
        content: `# Project: Touch-Activated LED! 👆

Let's use a transistor to make an LED that turns on when you touch it!

## Build a Circuit With:
1. **Battery** (9V main power)
2. **Transistor** (NPN, acts as switch)
3. **LED** (output when triggered)
4. **Resistor** (330Ω for LED, 10kΩ for base)
5. **Signal source** (simulates finger touch on base)

When base signal is HIGH → tiny base current → transistor amplifies it → LED turns ON ✅

**Your phone, your computer, your gaming console - all use billions of transistors like this!**`,
        type: 'interactive',
        circuit: {
          isReadOnly: false,
          showSimulation: true,
          nodes: [],
          edges: [],
        },
        validationCriteria: {
          requireComponents: ['battery', 'transistor', 'led', 'resistor'],
          requireMinConnections: 4,
          requirePowerSource: true,
        },
        completed: false,
      },
    ],
  },
  {
    id: 'capacitors-basics',
    title: 'Capacitors - Energy Storage',
    description: 'Learn how capacitors store and release energy!',
    difficulty: 'beginner',
    duration: '15 min',
    category: 'Components',
    icon: '🔋',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'What is a Capacitor?',
        content: `# Energy Buckets! 🪣

A **capacitor** is like a tiny rechargeable battery - it stores electrical energy!

## How It Works:
Imagine a bucket that fills with water (energy) when you pour it in, then pours it back out when you tip it.

## Two Main Parts:
- Two metal plates
- Separated by an insulator (dielectric)

When voltage is applied, electrons pile up on one side creating stored energy!`,
        type: 'text',
        visualizeComponents: ['capacitor'],
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Capacitance - Storage Capacity',
        content: `# How Much Can It Hold? 📏

**Capacitance** is measured in **Farads (F)**.

## Common Values:
- **pF** (picofarads) - 0.000000000001F - tiny!
- **nF** (nanofarads) - 0.000000001F - small
- **µF** (microfarads) - 0.000001F - common
- **mF** (millifarads) - 0.001F - large

## Rule of Thumb:
Bigger capacitance = stores MORE energy = takes LONGER to charge/discharge

**Fun Fact:** A 1 Farad capacitor is HUGE - usually only seen in car audio systems!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Charging and Discharging',
        content: `# The Fill and Drain Cycle ⏱️

## Charging:
Connect to a power source → electrons flow onto the plates → voltage builds up → capacitor is "full"

## Discharging:
Connect to a circuit → stored electrons flow out → powers the circuit → capacitor is "empty"

## Real Uses:
- **Smoothing** - Reduces voltage wobbles
- **Timing** - Creates delays in circuits
- **Filters** - Blocks some frequencies
- **Flash photography** - Quick burst of power! 📸`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-4',
        title: 'Interactive: Blink an LED',
        content: `# Build a Flasher Circuit! ✨

Create a circuit where an LED blinks on and off using a capacitor!

## Components Needed:
- 1x Capacitor (100µF)
- 1x LED
- 1x Resistor (1kΩ)
- 1x Battery

The capacitor charges through the resistor, then discharges through the LED - creating a blinking effect!

**Try building this timing circuit!**`,
        type: 'interactive',
        completed: false,
      },
    ],
  },
  {
    id: 'diodes-basics',
    title: 'Diodes - One-Way Gates',
    description: 'Understand how diodes control current direction!',
    difficulty: 'beginner',
    duration: '12 min',
    category: 'Components',
    icon: '🚪',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'What is a Diode?',
        content: `# The One-Way Valve! ➡️

A **diode** lets electricity flow in ONE direction only - like a check valve in plumbing!

## The Two Sides:
- **Anode** (+) - Where current enters
- **Cathode** (-) - Where current exits

## The Rule:
Current flows from Anode → Cathode
Current is BLOCKED from Cathode → Anode

Look for the stripe on the diode - that's the cathode side!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Why Use Diodes?',
        content: `# Protection and Control! 🛡️

## Common Uses:

### 1. Reverse Polarity Protection
Protects your circuit if you connect the battery backwards!

### 2. AC to DC Conversion
Power adapters use diodes to convert wall power to DC

### 3. Voltage Regulation
Some diodes (Zener diodes) keep voltage stable

### 4. Signal Detection
Radio circuits use diodes to detect radio waves

## Types:
- **Standard** (1N4007) - General purpose
- **Zener** - Voltage regulation
- **Schottky** - Fast switching
- **LED** - Light Emitting Diode!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Build a Protected Circuit',
        content: `# Safety First! ⚠️

Build a diode-protected circuit that stays safe even when battery is reversed!

## Challenge:
Build a circuit with:
1. **Battery** (9V)
2. **Diode** (protection, anode → cathode direction)
3. **Resistor** (330Ω)
4. **LED**

### Try reversing the battery:
- WITH diode: LED stays OFF (protected) ✅
- WITHOUT diode: LED burns out ❌

**Note:** Motors need diodes too - they create HUGE voltage spikes when turned off!`,
        type: 'interactive',
        circuit: {
          isReadOnly: false,
          showSimulation: true,
          nodes: [],
          edges: [],
        },
        validationCriteria: {
          requireComponents: ['battery', 'diode', 'led', 'resistor'],
          requireMinConnections: 4,
          requirePowerSource: true,
        },
        completed: false,
      },
    ],
  },
  {
    id: 'voltage-divider',
    title: 'Voltage Dividers',
    description: 'Learn how to create different voltages in your circuit!',
    difficulty: 'intermediate',
    duration: '18 min',
    category: 'Circuit Design',
    icon: '⚖️',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'What is a Voltage Divider?',
        content: `# Splitting Voltage! ⚡➗

A **voltage divider** uses resistors to create a lower voltage from a higher one.

## The Magic:
Two resistors in series split the voltage between them!

## Formula:
**Vout = Vin × (R2 / (R1 + R2))**

- Vin = Input voltage
- R1 = First resistor
- R2 = Second resistor
- Vout = Output voltage (across R2)`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Practical Example',
        content: `# Make 5V from 9V! 🔢

Let's create 5V from a 9V battery:

## Step 1: Choose R1 and R2
We want: Vout = 5V, Vin = 9V

Using equal resistors (1kΩ each) gives us:
5V = 9V × (1000 / (1000 + 1000))
5V = 9V × 0.5 = 4.5V

Close! For exactly 5V, we need:
- R1 = 800Ω
- R2 = 1000Ω (1kΩ)

## Important:
Don't draw too much current from a voltage divider - it's for reference voltages, not power!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Build Your Own',
        content: `# Interactive Challenge! 🎯

Create a voltage divider that produces 3V from a 9V battery!

## Your Mission:
1. Add two resistors in series
2. Calculate values to get 3V
3. Use a voltmeter to check!

**Hint:** 3V is 1/3 of 9V, so R2 should be 1/3 of the total resistance!

Try different resistor combinations in the canvas!`,
        type: 'interactive',
        completed: false,
      },
    ],
  },
  {
    id: 'motors-basics',
    title: 'DC Motors - Making Things Move!',
    description: 'Control motors and create motion in your projects!',
    difficulty: 'intermediate',
    duration: '20 min',
    category: 'Components',
    icon: '⚙️',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'How Motors Work',
        content: `# Electricity to Motion! 🔄

A **DC motor** converts electrical energy into spinning motion using magnetism!

## Inside a Motor:
- **Coils** - Wire loops that become electromagnets
- **Magnets** - Create magnetic field
- **Commutator** - Switches current direction
- **Brushes** - Conduct current to spinning part

When current flows, magnetic forces make the coil spin!

## Direction Control:
Reverse the voltage = reverse the spin direction! 🔄`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Protecting Your Circuit',
        content: `# Motors Need Special Care! ⚠️

Motors can damage circuits in two ways:

## 1. High Current Draw
Motors need a LOT of current to start

**Solution:** Use a transistor as a switch! The transistor handles the high current.

## 2. Back EMF
When a motor stops, it generates voltage that can flow backwards!

**Solution:** Add a "flyback diode" across the motor (backwards) to absorb this voltage.

## The Safe Motor Circuit:
Battery → Transistor → Motor
          ↑             ↓
      Resistor    Flyback Diode`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Build a Motor Controller',
        content: `# Control a Motor! 🎮

Build a transistor-controlled motor circuit with full protection:

## Components:
- 1x Battery (6-9V)
- 1x Transistor (NPN, 2N2222)
- 1x Motor (DC motor)
- 1x Resistor (1kΩ for base)
- 1x Diode (1N4007 flyback protection)
- 1x Switch (to control)

### How it works:
- Switch opens/closes the base circuit
- Small current through base resistor
- Transistor amplifies current to motor
- **CRITICAL:** Diode protects transistor from motor's back EMF!

Close the switch and watch it spin! 🌀`,
        type: 'interactive',
        circuit: {
          isReadOnly: false,
          showSimulation: true,
          nodes: [],
          edges: [],
        },
        validationCriteria: {
          requireComponents: ['battery', 'transistor', 'motor', 'diode'],
          requireMinConnections: 4,
          requirePowerSource: true,
        },
        completed: false,
      },
    ],
  },
  {
    id: 'buzzers-sound',
    title: 'Buzzers and Sound',
    description: 'Create audio alerts and simple melodies!',
    difficulty: 'beginner',
    duration: '10 min',
    category: 'Components',
    icon: '🔊',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'How Buzzers Work',
        content: `# Make Some Noise! 🔔

A **buzzer** creates sound using vibrations!

## Two Types:

### Active Buzzers
- Have built-in oscillator
- Just connect power → makes sound
- Fixed frequency (pitch)

### Passive Buzzers
- Need you to provide the signal
- Can make different tones
- More flexible!

Most hobby projects use active buzzers - super simple!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Buzzer Polarity',
        content: `# Getting It Right ✅

Most buzzers have polarity (+ and -):

## Finding the Positive:
- Longer lead = Positive (+)
- Red wire = Positive (+)
- + symbol on the buzzer

## What Happens If Wrong?
- Active buzzer: Won't make sound ❌
- Passive buzzer: Might work, might not

Always check the datasheet if unsure!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Build an Alarm',
        content: `# Create a Simple Alarm! 🚨

Build a complete alarm circuit with visual and audio alerts!

## Your Alarm System:
1. **Battery** (9V)
2. **Switch** (trigger)
3. **Buzzer** (audio alarm)
4. **LED** (visual indicator)
5. **Resistor** (LED protection)

### How it works:
- Press switch → LED lights up
- Press switch → Buzzer sounds
- Both active at the same time!

### Challenge:
Use a transistor to control the buzzer with a tiny signal. Perfect for security systems!`,
        type: 'interactive',
        circuit: {
          isReadOnly: false,
          showSimulation: true,
          nodes: [],
          edges: [],
        },
        validationCriteria: {
          requireComponents: ['battery', 'switch', 'buzzer', 'led'],
          requireMinConnections: 4,
          requirePowerSource: true,
        },
        completed: false,
      },
    ],
  },
  {
    id: 'understanding-ground',
    title: 'Understanding Ground',
    description: 'Learn what ground really is and how it completes the circuit!',
    difficulty: 'beginner',
    duration: '12 min',
    category: 'Fundamentals',
    icon: '⏚',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'What is Ground?',
        content: `# The Circuit's Return Path! 🔄

**Ground** (GND) is the 0-volt reference point in your circuit. It's where current returns to complete the loop back to the power source.

## Important Concepts:

### Ground is NOT a "drain"
Ground doesn't "remove" or "absorb" current. Current must flow in a complete loop - from the positive terminal, through your circuit, to ground, and back to the negative terminal of the battery.

### Ground is a Reference Point
- All voltages are measured relative to ground (0V)
- Ground connects to the negative terminal of your power source
- It provides the return path for current to flow

## Think of it Like Water:
Water flows in a complete loop through pipes. Ground is like the return pipe that brings water back to the pump. The water isn't "removed" - it just completes the cycle!`,
        type: 'text',
        visualizeComponents: ['ground', 'battery'],
        completed: false,
      },
      {
        id: 'step-1b',
        title: 'Two Meanings of "Ground"',
        content: `# 0V Return vs Earth Ground 🌍

"Ground" is used in two common ways. Knowing the difference prevents mistakes:

## 1) Circuit Ground (0V, Common, Return)
- The 0V reference for your circuit
- Usually tied to the battery's negative (−) terminal in battery-powered circuits
- Provides the return path so current can complete the loop
- Shown as the standard ground symbol (⏚)

## 2) Earth/Chassis Ground (Protective Ground)
- A safety connection to the physical earth or metal chassis
- Used in mains-powered equipment to carry FAULT current safely to earth
- Not a sink for "excess power" during normal operation
- Marked with an earth ground symbol (often three descending lines)

## Myth vs Reality
- ❌ Myth: "Ground absorbs extra electricity"
- ✅ Reality: In normal operation, current flows in closed loops. Circuit ground is just the 0V reference/return. Earth ground is for safety in fault conditions.

## Quick Rule of Thumb
- Battery/low-voltage electronics: ground ≈ negative terminal (0V reference)
- Mains/safety contexts: earth ground = protective conductor for faults, not a return path for your signal currents`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Current Flow and Ground',
        content: `# Current MUST Complete the Loop! ⚡🔁

## The Complete Circuit:
1. **Battery positive (+)** → pushes current out
2. **Through components** → LED, resistor, etc.
3. **To ground (GND)** → the 0V reference point
4. **Back to battery negative (-)** → completes the loop

## Key Points:

### Current Doesn't Disappear
- Current flows FROM positive TO ground
- Then FROM ground BACK TO battery negative
- Same current throughout the entire loop
- Ground is just a convenient reference point

### Ground Connections:
- Only has ONE connection point (terminal)
- Acts as a common connection for multiple circuits
- Simplifies circuit diagrams
- Represents the return path

## Why It's Called "Ground":
Originally, circuits were connected to the actual earth ground for safety. In modern electronics, "ground" is just the 0V reference - it may or may not be connected to earth.`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Common Ground Mistakes',
        content: `# Avoid These Errors! ⚠️

## Mistake 1: Thinking Ground "Removes" Current
❌ **Wrong:** "Current flows to ground and disappears"
✅ **Right:** "Current flows through ground back to the power source"

## Mistake 2: Not Completing the Circuit
❌ **Wrong:** Battery → LED → Ground (incomplete!)
✅ **Right:** Battery → LED → Ground → back to Battery

## Mistake 3: Confusing Ground with Negative
While ground often connects to battery negative:
- **Ground** = 0V reference point
- **Negative terminal** = the actual battery connection
- They're connected, but ground is the common reference for the whole circuit

## Mistake 4: Multiple Grounds Not Connected
- All ground symbols in a circuit are connected together
- They represent the same 0V point
- This simplifies wiring diagrams`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-4',
        title: 'Interactive: Build a Complete Circuit',
        content: `# Practice Time! 🛠️

Build a proper circuit with ground:

## Requirements:
1. Add a **Battery** (power source)
2. Add a **Resistor** (current limiter)
3. Add an **LED** (load)
4. Add **Ground** (return path reference)
5. **Connect**: Battery + → Resistor → LED → Ground
6. **Important**: Wire ground back to battery negative!

## What You'll Learn:
- How current flows in a complete loop
- Why ground is necessary
- That ground is a connection point, not an endpoint

Remember: **Electricity only flows in complete loops!**`,
        type: 'interactive',
        validationCriteria: {
          requireComponents: ['battery', 'resistor', 'led', 'ground'],
          requireMinConnections: 4,
          requirePowerSource: true,
        },
        completed: false,
      },
    ],
  },
  {
    id: 'breadboards',
    title: 'Using Breadboards',
    description: 'Master the essential tool for prototyping circuits!',
    difficulty: 'beginner',
    duration: '15 min',
    category: 'Fundamentals',
    icon: '📋',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'What is a Breadboard?',
        content: `# The Perfect Testing Ground! 🧪

A **breadboard** (or protoboard) lets you build circuits WITHOUT soldering!

## Why Use Breadboards?
- ✅ Reusable - build, test, rebuild!
- ✅ No soldering needed
- ✅ Easy to change connections
- ✅ Great for learning
- ✅ Quick prototyping

## The Layout:
Breadboards have rows and columns of holes. Inside are metal clips that connect the holes together in specific patterns.`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'How Breadboards Connect',
        content: `# Understanding the Connections 🔗

## Power Rails (sides):
- Red line = Positive rail (+)
- Blue/Black line = Negative rail (-)
- ALL holes in a rail are connected together
- Use for power distribution

> Note: In battery-powered circuits, the blue/black rail often serves as **ground (0V)** and is typically tied to the battery's negative (−) terminal. This does not "dump excess power" — it provides the return path to complete the circuit loop.

## Center Rows:
- Holes in each row (a-e or f-j) are connected
- The gap in the middle separates them
- Perfect for ICs (integrated circuits)

## Important Rule:
Holes are connected HORIZONTALLY in rows
NOT vertically in columns!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Breadboard Best Practices',
        content: `# Pro Tips! 💡

## Do's ✅:
- Use red wire for positive
- Use black wire for negative (ground)
- Keep wires neat and flat
- Test connections with a multimeter
- Plan your layout before building

## Don'ts ❌:
- Don't force components in
- Don't bend leads at sharp angles
- Don't cross wires unnecessarily
- Don't exceed breadboard ratings (1A max usually)

## Troubleshooting:
If circuit doesn't work:
1. Check power connections
2. Verify component orientation
3. Look for loose connections
4. Use multimeter to test continuity`,
        type: 'text',
        completed: false,
      },
    ],
  },
  {
    id: 'multimeters',
    title: 'Using a Multimeter',
    description: 'Learn to measure voltage, current, and resistance!',
    difficulty: 'beginner',
    duration: '20 min',
    category: 'Measurement',
    icon: '📊',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'What is a Multimeter?',
        content: `# Your Electronic Detective! 🔍

A **multimeter** (or DMM - Digital Multimeter) measures electrical properties!

## What It Measures:
- **Voltage** (V) - Electrical pressure
- **Current** (A) - Flow of electricity
- **Resistance** (Ω) - Opposition to flow
- **Continuity** - Are two points connected?
- **Diode test** - Is your diode working?

## Parts:
- Display screen
- Selection dial
- Two probes (red and black)
- Probe ports (COM, VΩ, mA, 10A)

It's the MOST important tool for electronics!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Measuring Voltage',
        content: `# Voltage Measurement 📈

Voltage is measured **in parallel** (across a component).

## Steps:
1. Set dial to V⎓ (DC voltage) or V~ (AC voltage)
2. Black probe → COM port
3. Red probe → VΩ port
4. Touch black probe to ground/negative
5. Touch red probe to the point you want to measure
6. Read the display!

## Safety Tips:
- Start with highest range
- Never measure voltage in series
- Circuit can be powered ON
- Red is positive, black is negative

**Practice measuring your battery voltage!**`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Measuring Current',
        content: `# Current Measurement ⚡

Current is measured **in series** (through the circuit).

## Steps:
1. Set dial to A (DC amps) or mA (milliamps)
2. Black probe → COM port
3. Red probe → mA port (or 10A port for high current)
4. BREAK the circuit
5. Insert multimeter in the break
6. Power ON and read display

## Critical Warning! ⚠️
- Never measure current across a battery
- Always measure in series
- Start with highest range
- Can blow fuse if done wrong!

**Practice with an LED circuit!**`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-4',
        title: 'Measuring Resistance',
        content: `# Resistance Measurement 🔧

Resistance is measured with power OFF!

## Steps:
1. Set dial to Ω (ohms)
2. Black probe → COM port
3. Red probe → VΩ port
4. Power OFF the circuit!
5. Touch probes to both ends of resistor
6. Read the display

## Continuity Test:
Set dial to continuity symbol (sound waves icon)
- Beep = connected!
- No beep = not connected

Great for finding broken wires!

## Important:
Always remove power before measuring resistance or you'll get wrong readings!`,
        type: 'text',
        completed: false,
      },
    ],
  },
  {
    id: 'power-supplies',
    title: 'Power Supplies and Batteries',
    description: 'Choose and use the right power source for your projects!',
    difficulty: 'intermediate',
    duration: '18 min',
    category: 'Fundamentals',
    icon: '🔌',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'Types of Power Sources',
        content: `# Powering Your Projects! 🔋

## Batteries (Portable Power)

### Primary (Single Use):
- **Alkaline** (AA, AAA, 9V) - Common, cheap
- **Lithium** - Long life, expensive

### Secondary (Rechargeable):
- **NiMH** - Good capacity, cheap
- **Li-ion/Li-Po** - High energy, needs protection
- **Lead Acid** - Heavy, cheap, good for high current

## Power Adapters (Wall Power):
- Convert AC to DC
- Rated by voltage and current
- Look for "UL Listed" for safety!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Battery Specifications',
        content: `# Understanding Battery Ratings 📋

## Voltage:
- **1.5V** - Alkaline AA/AAA/C/D
- **9V** - Alkaline 9V battery
- **3.7V** - Li-ion cell
- **12V** - Car battery (lead acid)

## Capacity (mAh):
How long it can supply current:
- 2000mAh battery + 100mA circuit = 20 hours
- Higher mAh = longer runtime

## Series vs Parallel:
- **Series** - Voltages add (2× 1.5V = 3V)
- **Parallel** - Capacity adds (2× 2000mAh = 4000mAh)

Never mix old and new batteries!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Voltage Regulators',
        content: `# Keeping Voltage Steady! 📏

A **voltage regulator** keeps voltage constant even as battery drains.

## Common Types:
- **7805** - Outputs 5V
- **LM317** - Adjustable output
- **Buck converter** - Steps down efficiently
- **Boost converter** - Steps up voltage

## When to Use:
- Circuit needs precise voltage
- Powering sensitive components
- Battery voltage varies too much

## Example Circuit:
9V Battery → 7805 Regulator → 5V Output
Add capacitors for stability!

**Try adding a regulator to your circuit!**`,
        type: 'interactive',
        completed: false,
      },
    ],
  },
  {
    id: 'capacitors-advanced',
    title: 'Capacitors Deep Dive',
    description: 'Master energy storage and timing circuits!',
    difficulty: 'advanced',
    duration: '25 min',
    category: 'Components',
    icon: '🔋',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'Capacitor Types',
        content: `# Many Flavors! 🧪

## Ceramic Capacitors:
- Small, cheap, non-polarized
- 1pF to 1µF typically
- Great for high frequencies
- Slight value change with temperature

## Electrolytic Capacitors:
- Polarized (+ and -)
- Large values (1µF to 1000s of µF)
- Good for power supply filtering
- Can explode if connected backwards! 💥

## Film Capacitors:
- Stable, precise
- Medium values
- More expensive
- Great for audio circuits

## Tantalum Capacitors:
- Small size, high capacity
- Polarized
- Expensive
- Stable over temperature`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'RC Time Constants',
        content: `# Timing with Resistors and Capacitors ⏱️

When a resistor and capacitor work together, they create precise timing!

## The Formula:
**τ (tau) = R × C**

Where:
- τ = Time constant (seconds)
- R = Resistance (ohms)
- C = Capacitance (farads)

## What It Means:
After 1 time constant:
- Capacitor is 63% charged (or discharged)

After 5 time constants:
- Fully charged (99%)

## Example:
1kΩ × 100µF = 0.1 seconds
5 × 0.1s = 0.5 seconds to fully charge!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Build a Timer Circuit',
        content: `# 555 Timer - The Classic! 🎯

The 555 timer IC is one of the most popular chips ever made!

## Astable Mode (Blinks Forever):
Uses two resistors and one capacitor to create pulses.

**Frequency = 1.44 / ((R1 + 2×R2) × C)**

## Components:
- 555 Timer IC
- 2× Resistors
- 1× Capacitor
- 1× LED
- 1× Battery

The LED will blink at a rate determined by your R and C values!

**Build your own blinking LED!**`,
        type: 'interactive',
        completed: false,
      },
      {
        id: 'step-4',
        title: 'Filter Circuits',
        content: `# Cleaning Up Signals 🧹

Capacitors can filter (remove) certain frequencies!

## Low-Pass Filter:
Lets low frequencies through, blocks high frequencies
- Used in audio to remove noise
- R → C → Ground configuration

## High-Pass Filter:
Lets high frequencies through, blocks low (DC)
- Used to block DC in audio circuits
- C → R → Ground configuration

## Cutoff Frequency:
**fc = 1 / (2π × R × C)**

Frequencies above fc are reduced!

## Real Use:
Power supply circuits use capacitors to filter out AC ripple, giving smooth DC.`,
        type: 'text',
        completed: false,
      },
    ],
  },
  {
    id: 'inductors-coils',
    title: 'Inductors and Magnetic Fields',
    description: 'Explore inductors and electromagnetic induction!',
    difficulty: 'advanced',
    duration: '22 min',
    category: 'Components',
    icon: '🧲',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'What is an Inductor?',
        content: `# Coils of Wire! 🌀

An **inductor** is simply a coil of wire - but it has amazing properties!

## How It Works:
Current flowing through the coil creates a magnetic field. When current changes, the magnetic field changes, which creates a voltage!

## Key Property:
Inductors **resist changes** in current
- Unlike resistors (resist current itself)
- Unlike capacitors (resist changes in voltage)

## Symbol:
Looks like a spring or coil in schematics

## Unit:
**Henry (H)** - usually mH (millihenry) or µH (microhenry)`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Inductor Applications',
        content: `# What Are They Used For? 🤔

## 1. Filters (with Capacitors):
Create LC filters for radios and audio
- Low-pass filters
- High-pass filters
- Band-pass filters (select specific frequency)

## 2. Transformers:
Two inductors near each other:
- Changes voltage levels
- Isolates circuits
- Your phone charger has one!

## 3. DC-DC Converters:
Boost voltage efficiently
- Switch current on/off rapidly
- Inductor stores energy
- Releases at different voltage

## 4. RF Circuits:
Essential for:
- Antennas
- Radio transmitters/receivers
- Wireless power transfer`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Back EMF and Protection',
        content: `# The Voltage Spike! ⚡

When current through an inductor stops suddenly, it creates a **huge voltage spike**!

## Why It Happens:
Inductor wants to keep current flowing
When you open the switch, it generates high voltage trying to maintain current

## Real Example:
- Motors have coils (inductors)
- When motor stops, back EMF occurs
- Can be hundreds of volts!
- Can damage transistors and ICs

## Protection:
**Flyback Diode** across the inductor:
- Gives current a path when circuit opens
- Absorbs the voltage spike
- Protects your components!

Always use flyback diodes with relays, motors, and solenoids!`,
        type: 'text',
        completed: false,
      },
    ],
  },
  {
    id: 'integrated-circuits',
    title: 'Integrated Circuits (ICs)',
    description: 'Learn about the chips that power modern electronics!',
    difficulty: 'advanced',
    duration: '28 min',
    category: 'Components',
    icon: '🖥️',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'What is an IC?',
        content: `# Tiny Computers on a Chip! 💎

An **Integrated Circuit (IC)** contains thousands to billions of components in a tiny package!

## Inside an IC:
- Transistors
- Resistors
- Capacitors
- Diodes
- All microscopic!

## Common Packages:
- **DIP** (Dual Inline Package) - through-hole, breadboard friendly
- **SOIC** (Small Outline IC) - surface mount
- **QFP** (Quad Flat Package) - many pins
- **BGA** (Ball Grid Array) - highest density

## Pin Identification:
Look for the notch or dot - that marks pin 1!
Pins count counterclockwise from pin 1.`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Types of ICs',
        content: `# Many Functions! 🎭

## Analog ICs:
Process continuous signals
- **Op-Amps** (LM358, LM741) - amplify signals
- **Voltage Regulators** (7805) - steady voltage
- **Timer ICs** (555) - create timing pulses

## Digital ICs:
Process binary (0/1) signals
- **Logic Gates** (7400 series)
- **Microcontrollers** (Arduino, PIC)
- **Memory** (RAM, ROM, Flash)

## Mixed-Signal ICs:
Both analog and digital
- **ADC** - Analog to Digital Converter
- **DAC** - Digital to Analog Converter
- **Microcontrollers** (have both!)

## Power Management ICs:
- Battery chargers
- DC-DC converters
- Power monitors`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Reading Datasheets',
        content: `# The IC Manual 📖

Every IC has a **datasheet** - the instruction manual!

## Key Information:
1. **Pin Diagram** - What each pin does
2. **Absolute Maximum Ratings** - Don't exceed these!
3. **Operating Conditions** - Normal use range
4. **Electrical Characteristics** - Performance specs
5. **Application Circuits** - Example uses

## Important Pins:
- **VCC/VDD** - Positive power
- **GND/VSS** - Ground (0V)
- **Inputs** - Signals going in
- **Outputs** - Signals coming out

## Pro Tip:
Always read the datasheet before using an IC! It tells you exactly how to use it safely and correctly.`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-4',
        title: 'IC Best Practices',
        content: `# Keep Your ICs Happy! 😊

## Do's ✅:
- **Use decoupling capacitors** (0.1µF near VCC to GND)
- Check pin orientation before inserting
- Start with low voltage and test
- Use IC sockets for easy replacement
- Handle by edges (don't touch pins)

## Don'ts ❌:
- Never exceed maximum voltage
- Don't apply voltage to inputs before power
- Don't reverse power polarity
- Don't bend pins
- Don't let pins short together

## ESD Protection:
ICs are sensitive to static electricity!
- Touch grounded metal before handling
- Store in anti-static foam or bags
- Use ESD wrist strap when possible

One zap can permanently damage an IC!`,
        type: 'text',
        completed: false,
      },
    ],
  },
  {
    id: 'circuit-protection',
    title: 'Circuit Protection',
    description: 'Keep your circuits safe with proper protection!',
    difficulty: 'intermediate',
    duration: '20 min',
    category: 'Circuit Design',
    icon: '🛡️',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'Why Protection Matters',
        content: `# Safety First! ⚠️

Circuits can fail in many ways - protection prevents damage and safety hazards!

## Common Failures:
- **Overcurrent** - Too much current flows
- **Overvoltage** - Voltage too high
- **Reverse polarity** - Battery connected backwards
- **Short circuits** - Direct path to ground
- **ESD** - Static electricity discharge

## What Can Happen:
- Components burn out 🔥
- ICs permanently damaged
- Battery overheats
- Fire hazard!
- Personal injury

Good protection saves your project AND keeps you safe!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Overcurrent Protection',
        content: `# Limiting Current Flow ⚡

## Fuses:
One-time protection
- Melts when current too high
- Must be replaced
- Rated by current (e.g., 1A, 500mA)
- Types: fast-blow, slow-blow

## Resettable Fuses (PTC):
Self-resetting protection
- Heats up when current high
- Resistance increases
- Limits current
- Cools down and resets

## Current-Limiting Resistors:
Simple protection
- Calculate: R = V / Imax
- Limits maximum current
- Creates voltage drop
- Dissipates power as heat

Place fuses as close to the power source as possible!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Voltage Protection',
        content: `# Keeping Voltage in Check 📏

## Zener Diodes:
Voltage clamps
- Conducts when voltage exceeds rating
- Shunts excess current to ground
- Protects sensitive components
- Choose voltage rating just above normal

## Transient Voltage Suppressors (TVS):
Fast protection
- Clamps voltage spikes
- Very fast response (nanoseconds)
- Good for ESD protection
- Common in USB circuits

## Voltage Regulators:
Constant output
- Drops excess voltage
- Maintains stable output
- Linear or switching types
- Prevents overvoltage damage

## Metal Oxide Varistors (MOV):
AC protection
- Used in surge protectors
- Clamps high voltage transients
- Degrades over time`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-4',
        title: 'Polarity and Short Protection',
        content: `# Preventing Connection Mistakes 🔄

## Reverse Polarity Protection:

### Method 1: Diode
- Simple and cheap
- 0.7V drop (power loss)
- Use Schottky for less drop

### Method 2: P-MOSFET
- No voltage drop
- More complex circuit
- Most efficient

## Short Circuit Protection:
- Use current limiting
- Add fuses
- Current sense resistors
- Electronic circuit breakers

## Build a Protected Circuit:
Battery → Fuse → Reverse Protection Diode → Voltage Regulator → Circuit

Now your circuit is protected from most common failures!

**Try adding protection to your projects!**`,
        type: 'interactive',
        completed: false,
      },
    ],
  },
  {
    id: 'pcb-design-intro',
    title: 'Introduction to PCB Design',
    description: 'Learn how to design and order custom circuit boards!',
    difficulty: 'advanced',
    duration: '30 min',
    category: 'Circuit Design',
    icon: '🔲',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'What is a PCB?',
        content: `# Printed Circuit Boards! 🎨

A **PCB** is a board with copper traces that connect components - like a breadboard, but permanent!

## Layers:
- **Top copper** - Traces and pads
- **Bottom copper** - More traces
- **Substrate** - Insulating material (usually FR4)
- **Silkscreen** - Labels and text
- **Soldermask** - Green coating (protects copper)

## Why Use PCBs?
✅ Professional and permanent
✅ Compact size
✅ Reliable connections
✅ Can be mass-produced
✅ No messy wires!

## When to Use:
- Final version of your project
- Need multiple copies
- Commercial products
- Professional appearance`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'PCB Design Software',
        content: `# Tools of the Trade 🛠️

## Popular Free Options:

### KiCad:
- Completely free
- Professional features
- Open source
- Steep learning curve
- Large library

### EasyEDA:
- Web-based
- Integrated with JLCPCB
- Easy to learn
- Good for beginners

### Fusion 360 (Eagle):
- Free for hobbyists
- Professional software
- Good community

## Design Process:
1. **Schematic** - Draw the circuit
2. **Assign footprints** - Choose part packages
3. **Layout** - Place and route components
4. **Design rules check** - Find errors
5. **Generate Gerbers** - Files for manufacturer`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'PCB Design Best Practices',
        content: `# Making Great Boards! ⭐

## Trace Width:
- Power traces: 0.5mm - 1mm (or more)
- Signal traces: 0.25mm - 0.4mm
- Use trace width calculators for current

## Spacing:
- Minimum clearance: 0.2mm
- More space for high voltage!
- Keep AC away from sensitive signals

## Component Placement:
- Group related components
- Keep signal paths short
- Decoupling caps near IC power pins
- Consider thermal management

## Ground Planes:
- Use copper pour for ground
- Reduces noise
- Better return paths
- Acts as shield

## Vias:
- Connect top and bottom layers
- Don't place under SMD pads
- Use thermal relief for ground connections`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-4',
        title: 'Ordering Your PCB',
        content: `# From Design to Reality! 📦

## Popular Manufacturers:
- **JLCPCB** - Cheap, fast, good quality
- **PCBWay** - Good for prototypes
- **OSH Park** - USA-based, purple boards!
- **Seeed Studio** - Good for small batches

## What to Specify:
- **Dimensions** - Board size
- **Layers** - Usually 2 (top and bottom)
- **Thickness** - Usually 1.6mm
- **Color** - Green is cheapest
- **Surface finish** - HASL or ENIG
- **Quantity** - Often 5 minimum

## Costs:
- Small 2-layer board: $2-5 for 5 pieces
- Shipping: $5-20
- Production time: 2-5 days
- Delivery: 1-2 weeks

## First Time Tips:
- Order extra boards (mistakes happen!)
- Check design 3 times before ordering
- Start with simple designs
- Join boards together to save cost`,
        type: 'text',
        completed: false,
      },
    ],
  },
  {
    id: 'troubleshooting',
    title: 'Circuit Troubleshooting',
    description: 'Learn systematic debugging techniques!',
    difficulty: 'intermediate',
    duration: '25 min',
    category: 'Fundamentals',
    icon: '🔧',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'Systematic Approach',
        content: `# Debug Like a Pro! 🔍

When circuits don't work, use a systematic approach!

## The Scientific Method:
1. **Observe** - What's happening?
2. **Hypothesize** - What could be wrong?
3. **Test** - Check your hypothesis
4. **Repeat** - Until you find the problem

## Common Symptoms:
- Nothing happens (no power)
- Component gets hot (short or wrong value)
- Intermittent behavior (loose connection)
- Wrong output (calculation error)
- Component damaged (smoke, burning smell)

## First Steps:
✓ Visual inspection
✓ Check power supply
✓ Verify component orientation
✓ Look for obvious damage`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Common Mistakes',
        content: `# The Usual Suspects! 🕵️

## Top 10 Beginner Errors:

1. **Polarity Wrong** - LEDs, capacitors, diodes backwards
2. **Missing Ground** - Always close the loop!
3. **Wrong Values** - Read resistor bands carefully
4. **Loose Connections** - Push components in firmly
5. **No Current Limiting** - LEDs need resistors!
6. **Power Supply Issues** - Check voltage and current
7. **Breadboard Problems** - Verify internal connections
8. **Component Damage** - Got hot? Probably dead
9. **Wiring Errors** - Follow schematic carefully
10. **Calculation Mistakes** - Double-check Ohm's Law

## Quick Checks:
- Battery connected?
- Battery still good?
- Switches in right position?
- Fuses not blown?`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Using Test Equipment',
        content: `# Measurement is Key! 📊

## Multimeter Tests:

### Voltage Check:
- Measure at power source (correct?)
- Measure at IC power pins (reaching?)
- Measure at component inputs (right levels?)

### Continuity Check:
- Test all connections
- Find broken wires
- Verify switch operation
- Check solder joints

### Resistance Check:
- Power OFF first!
- Verify resistor values
- Check for shorts (0Ω)
- Check for opens (infinite Ω)

### Current Check:
- Measure series current
- Compare to expected value
- Find shorts (high current)

## Oscilloscope (Advanced):
- View signal waveforms
- Check timing
- Find noise issues
- Verify frequency`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-4',
        title: 'Isolation and Division',
        content: `# Divide and Conquer! ✂️

## Block Testing:
Break circuit into sections:

1. **Power Supply Block**
   - Test voltage at source
   - Test current capability
   - Check regulation

2. **Input Section**
   - Verify sensor/switch works
   - Check signal levels
   - Test connections

3. **Processing Section**
   - ICs getting power?
   - Inputs correct?
   - Outputs responding?

4. **Output Section**
   - Power reaching load?
   - Component working individually?
   - Correct voltage/current?

## Progressive Testing:
- Start simple (just power LED)
- Add one section at a time
- Test after each addition
- Isolate where it breaks

## The Swap Test:
Suspect a component?
- Replace with known good one
- If works, found the problem!
- Keep spare components handy`,
        type: 'text',
        completed: false,
      },
    ],
  },
  {
    id: 'soldering-basics',
    title: 'Soldering Techniques',
    description: 'Master the art of making permanent connections!',
    difficulty: 'intermediate',
    duration: '25 min',
    category: 'Fundamentals',
    icon: '🔥',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'Soldering Equipment',
        content: `# The Essentials! 🛠️

## Basic Tools:
- **Soldering Iron** - 30-60W, temperature controlled
- **Solder** - 60/40 or 63/37 tin/lead or lead-free
- **Stand** - Holds hot iron safely
- **Sponge/Brass Wool** - Cleans tip
- **Helping Hands** - Holds components
- **Wire Cutters** - Trim leads

## Safety Equipment:
- **Ventilation** - Fumes are harmful!
- **Safety Glasses** - Protect eyes from splashes
- **Heat-Resistant Mat** - Protect workspace

## Temperature:
- Lead solder: 300-350°C (572-662°F)
- Lead-free: 350-400°C (662-752°F)
- Too hot = damages components
- Too cold = cold joints`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Good Solder Joints',
        content: `# What to Aim For! 🎯

## Perfect Joint Characteristics:
✓ **Shiny** - Smooth, reflective surface
✓ **Concave** - Gentle cone shape
✓ **Fills Pad** - Complete coverage
✓ **No Excess** - Just enough solder
✓ **Strong Bond** - Mechanically solid

## Bad Joints:

### Cold Joint:
- Dull, grainy appearance
- Solder didn't melt properly
- Unreliable connection
- Fix: Reheat properly

### Dry Joint:
- Not enough solder
- Weak connection
- May fail over time
- Fix: Add more solder

### Solder Bridge:
- Connects adjacent pins
- Creates short circuit
- Fix: Solder wick or desoldering

### Too Much Solder:
- Blob-like appearance
- May hide problems
- Wastes solder
- Fix: Remove excess`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Soldering Technique',
        content: `# The Perfect Process! 🌟

## Step-by-Step:

### 1. Prepare
- Clean iron tip (wet sponge)
- Tin the tip (coat with solder)
- Component ready and secured

### 2. Heat
- Touch iron to BOTH pad and lead
- Wait 1-2 seconds
- Must heat both!

### 3. Apply Solder
- Feed solder to the JOINT (not iron)
- Solder should melt on contact
- Apply just enough to coat

### 4. Remove
- Remove solder first
- Keep heating 1 more second
- Remove iron
- Don't move component!

### 5. Cool
- Wait 3-5 seconds
- Don't blow on it
- Check joint quality

## Pro Tips:
- Use flux for better flow
- Keep tip clean
- Work quickly but carefully
- Practice on scrap first!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-4',
        title: 'Desoldering',
        content: `# Fixing Mistakes! 🔄

## Methods:

### Solder Wick (Braid):
- Copper braid absorbs solder
- Press to joint with hot iron
- Solder wicks up into braid
- Cut off used section
- Best for: Small joints, SMD

### Solder Sucker (Pump):
- Spring-loaded vacuum pump
- Heat joint
- Place tip over joint
- Release plunger
- Solder sucked up
- Best for: Through-hole components

### Desoldering Station:
- Combination iron + vacuum
- Professional tool
- Heat and suck simultaneously
- Best for: Lots of desoldering

## Tips:
- Add fresh solder first (improves heat transfer)
- May need multiple attempts
- Be patient
- Don't overheat pads
- PCB pads can lift if overheated!

## Component Removal:
Heat one lead at a time, gently wiggle component free`,
        type: 'text',
        completed: false,
      },
    ],
  },
  {
    id: 'project-planning',
    title: 'Planning Your Projects',
    description: 'Learn to design successful electronic projects!',
    difficulty: 'intermediate',
    duration: '20 min',
    category: 'Fundamentals',
    icon: '📝',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'Defining Requirements',
        content: `# Start with the End in Mind! 🎯

## Key Questions:

### 1. What Should It Do?
- Core functionality
- Features (must-have vs nice-to-have)
- User interface needs
- Output requirements

### 2. Where Will It Be Used?
- Indoor or outdoor?
- Temperature range
- Humidity/weather exposure
- Vibration/movement

### 3. What Are the Constraints?
- **Size** - How big can it be?
- **Power** - Battery or wall power?
- **Cost** - Budget limitations?
- **Time** - Deadline for completion?

### 4. Who Is It For?
- You (learning project)
- Others (needs to be user-friendly)
- Commercial (needs to be professional)

Write down specific, measurable requirements!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Breaking Down the System',
        content: `# Divide into Blocks! 🧩

## System Block Diagram:

Every project has blocks:

### Input Block:
- Sensors
- Switches
- User interface
- Data sources

### Processing Block:
- Microcontroller
- Logic circuits
- Signal conditioning
- Calculations

### Output Block:
- LEDs, displays
- Motors, actuators
- Sound, buzzers
- Communication

### Power Block:
- Battery/adapter
- Voltage regulation
- Power distribution
- Protection

Draw each block and connections!
This makes complex projects manageable.`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Component Selection',
        content: `# Choosing the Right Parts! 🛒

## Research Process:

### 1. Identify Needs
- What specs are required?
- Voltage, current, speed, accuracy
- Physical size constraints

### 2. Find Candidates
- Search suppliers (Digi-Key, Mouser, Amazon)
- Check availability
- Compare specifications
- Read reviews

### 3. Check Compatibility
- Voltage levels match?
- Current requirements met?
- Interfaces work together?
- Physical mounting possible?

### 4. Consider Practicality
- Can you solder it?
- Breadboard compatible?
- Documentation available?
- Support libraries exist?

### 5. Budget Check
- Cost per unit
- Shipping costs
- Quantity discounts
- Alternatives available?

## Pro Tips:
- Buy extras (mistakes happen!)
- Choose common parts (easier to replace)
- Prioritize parts with good documentation`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-4',
        title: 'Prototyping Strategy',
        content: `# Build, Test, Iterate! 🔄

## Development Stages:

### Stage 1: Proof of Concept
- Breadboard simple version
- Test core functionality
- Verify approach works
- Use dev boards (Arduino, etc.)

### Stage 2: Prototype
- Add all features
- Still on breadboard
- Test extensively
- Find and fix bugs

### Stage 3: Integration
- Combine all blocks
- Test interactions
- Verify power consumption
- Check timing issues

### Stage 4: Finalization
- Design PCB or stripboard
- Choose enclosure
- Plan assembly process
- Document everything!

## Testing Between Stages:
- Does each block work alone?
- Do blocks work together?
- Edge cases handled?
- Failure modes considered?

## Documentation Tips:
- Take photos of working breadboard
- Note component values
- Draw schematic as you go
- Keep a project journal`,
        type: 'text',
        completed: false,
      },
    ],
  },
  {
    id: 'logic-gates',
    title: 'Logic Gates - Digital Basics',
    description: 'Learn how computers make decisions!',
    difficulty: 'advanced',
    duration: '35 min',
    category: 'Digital',
    icon: '🖥️',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'Binary - The Language of Computers',
        content: `# Ones and Zeros 🔢

Computers only understand two things:
- **1** = ON / HIGH / TRUE
- **0** = OFF / LOW / FALSE

This is called **binary**!

## Why Binary?
It's easy to represent with electricity:
- Voltage present = 1
- No voltage = 0

All the amazing things computers do come from combining 1s and 0s!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'AND, OR, NOT Gates',
        content: `# The Basic Gates 🚪

## AND Gate
Output is 1 only if BOTH inputs are 1
- 0 AND 0 = 0
- 0 AND 1 = 0
- 1 AND 0 = 0
- 1 AND 1 = 1

## OR Gate
Output is 1 if ANY input is 1
- 0 OR 0 = 0
- 0 OR 1 = 1
- 1 OR 0 = 1
- 1 OR 1 = 1

## NOT Gate
Flips the input
- NOT 0 = 1
- NOT 1 = 0`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'NAND, NOR, XOR Gates',
        content: `# More Logic Gates! 🎛️

## NAND Gate
NOT + AND = opposite of AND
- 0 NAND 0 = 1
- 0 NAND 1 = 1
- 1 NAND 0 = 1
- 1 NAND 1 = 0

**Fun Fact:** You can build ANY logic circuit using only NAND gates!

## NOR Gate
NOT + OR = opposite of OR
- 0 NOR 0 = 1
- 0 NOR 1 = 0
- 1 NOR 0 = 0
- 1 NOR 1 = 0

## XOR Gate (Exclusive OR)
Output is 1 if inputs are DIFFERENT
- 0 XOR 0 = 0
- 0 XOR 1 = 1
- 1 XOR 0 = 1
- 1 XOR 1 = 0

Great for comparison and parity checking!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-4',
        title: 'Building Digital Circuits',
        content: `# Practical Logic! ⚡

## 7400 Series ICs:
Classic logic chips still used today!

- **7400** - Quad 2-input NAND gate
- **7402** - Quad 2-input NOR gate
- **7404** - Hex inverter (NOT gates)
- **7408** - Quad 2-input AND gate
- **7432** - Quad 2-input OR gate
- **7486** - Quad 2-input XOR gate

## Voltage Levels:
- TTL: 0V = 0, 5V = 1
- CMOS: 0V = 0, 3.3V or 5V = 1

## Example Project:
Build a burglar alarm!
- Switch on door (input)
- Switch on window (input)
- OR gate (if either opens)
- Buzzer (output)

**Try building logic circuits!**`,
        type: 'interactive',
        completed: false,
      },
    ],
  },
];

// Additional tutorial categories for future expansion
export const futureTutorialCategories = [
  {
    category: 'Microcontrollers',
    topics: [
      'Introduction to Arduino',
      'Programming Basics',
      'Digital I/O',
      'Analog Inputs',
      'PWM and Analog Output',
      'Serial Communication',
    ],
  },
  {
    category: 'Communication',
    topics: [
      'UART/Serial',
      'I2C Protocol',
      'SPI Protocol',
      'Wireless (Bluetooth/WiFi)',
      'RF Communication',
    ],
  },
  {
    category: 'Sensors',
    topics: [
      'Temperature Sensors',
      'Light Sensors',
      'Motion/Accelerometers',
      'Distance Sensors',
      'Gas/Environmental Sensors',
    ],
  },
  {
    category: 'Power Electronics',
    topics: [
      'Buck Converters',
      'Boost Converters',
      'Linear Regulators',
      'Battery Management',
      'Solar Power',
    ],
  },
  {
    category: 'Audio',
    topics: [
      'Audio Amplifiers',
      'Speakers and Transducers',
      'Tone Generation',
      'Audio Filters',
      'Music Synthesis',
    ],
  },
  {
    category: 'Advanced Digital',
    topics: [
      'Flip-Flops and Latches',
      'Counters',
      'Shift Registers',
      'Multiplexers',
      'State Machines',
    ],
  },

  // New Practice Tutorials Using Enhanced Circuits
  {
    id: 'voltage-dividers-led-control',
    title: 'Voltage Dividers - Control LED Brightness',
    description: 'Use a potentiometer to control LED brightness with a voltage divider',
    difficulty: 'intermediate',
    duration: '20 min',
    category: 'Components',
    icon: '🔅',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'What is a Voltage Divider?',
        content: `# Split the Voltage! ⚡

A **voltage divider** is a clever way to get a fraction of your battery voltage!

## The Concept:
Two resistors in series create a "tap" between them where you get a voltage between 0V and battery voltage.

## Formula:
\`V_out = V_in × (R2 / (R1 + R2))\`

## Example:
- 9V battery
- R1 = R2 = 1kΩ
- V_out = 9V × (1kΩ / 2kΩ) = **4.5V** ✅

Perfect for controlling brightness, analog sensors, and audio circuits!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Interactive Voltage Divider',
        content: `# Building a Real Voltage Divider! 👀

Voltage dividers are used extensively in:
- Volume controls
- Brightness adjustments
- Sensor signal conditioning

## Practical Circuit:
When building a real voltage divider with a potentiometer (variable resistor):
- The potentiometer acts as two resistors
- The wiper (middle pin) is your output
- Moving the wiper changes the output voltage
- Perfect for analog control!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Real-World Applications',
        content: `# Where's the Voltage Divider? 🌍

Voltage dividers are EVERYWHERE:

1. **Volume Controls** - Your speaker volume uses this!
2. **Brightness Sensors** - Phone auto-brightness
3. **Temperature Sensors** - Thermometers in circuits
4. **Joysticks** - Game controller analog sticks
5. **Microphone Preamps** - Audio recording equipment

**Challenge:** Can you build your own voltage divider and measure the middle voltage? 🎯`,
        type: 'text',
        completed: false,
      },
    ],
  },

  {
    id: 'oscillators-and-timing',
    title: 'Oscillators - Make Things Blink!',
    description: 'Learn about oscillators that create repeating signals',
    difficulty: 'advanced',
    duration: '25 min',
    category: 'Components',
    icon: '⏱️',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'What is an Oscillator?',
        content: `# The Heartbeat of Electronics! 💓

An **oscillator** is a circuit that automatically switches on and off over and over.

## Key Components:
1. **Transistor** - The switch
2. **Capacitor** - Creates timing
3. **Resistor** - Controls speed
4. **Battery** - Powers it

## The Magic:
- Capacitor charges through resistor
- Transistor switches ON when voltage rises
- Capacitor discharges through transistor
- Capacitor voltage falls, transistor turns OFF
- Cycle repeats! 🔄

## Frequency Formula:
\`f ≈ 0.7 / (R × C)\`

Where R is in ohms and C is in farads!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Blinking LED Circuit',
        content: `# Make an LED Blink! 📟

The classic astable multivibrator oscillator circuit uses capacitors and resistors:

## How It Works:
1. **Capacitor charges** through resistor → reaches threshold
2. **Transistor turns ON** → capacitor discharges
3. **Voltage drops** → transistor turns OFF
4. **Cycle repeats** → LED blinks!

## The Components:
- **2x Transistors** (NPN, 2N2222)
- **2x Capacitors** (100µF or adjustable)
- **2x Resistors** (10kΩ)
- **1x LED** with resistor (330Ω)
- **1x Battery** (6-9V)

## Building It:
Connect the transistors in a cross-coupled configuration where each transistor's output drives the other's base. The capacitors control timing.`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Make It Faster or Slower',
        content: `# Control the Blink Speed! ⚡

Try these modifications:

## To Make It Blink FASTER:
- Decrease R (smaller resistor)
- Decrease C (smaller capacitor)
- Example: 1kΩ and 10µF = ~70 blinks per second! ⚡⚡⚡

## To Make It Blink SLOWER:
- Increase R (bigger resistor)
- Increase C (bigger capacitor)
- Example: 100kΩ and 100µF = 1 blink per minute 🐢

**Real Devices Using Oscillators:**
- 🚗 Car turn signals
- 📱 Phone vibration patterns
- 🎵 Music synthesizers (generate tones!)
- ⏰ Digital clocks
- 📡 Radio transmitters`,
        type: 'text',
        completed: false,
      },
    ],
  },

  {
    id: 'series-led-circuits',
    title: 'Series Circuits - More Than One LED',
    description: 'Connect multiple LEDs in series and understand voltage distribution',
    difficulty: 'beginner',
    duration: '15 min',
    category: 'Circuits',
    icon: '🟡',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'One LED vs Multiple LEDs',
        content: `# Stacking LEDs! 🪜

When LEDs are connected in **series**, they add up!

## Voltage Drop Rule:
Each LED drops about **2V**

### Example 1: One LED
- Battery: 9V
- LED1: 2V drop
- Resistor: 7V drop ✅

### Example 2: Three LEDs
- Battery: 9V
- LED1: 2V drop
- LED2: 2V drop  
- LED3: 2V drop
- Resistor: 3V drop ✅
- Total: 9V ✓

**Key Insight:** Same current flows through ALL components!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Three-LED Circuit',
        content: `# Red, Green, Blue in Series! 🌈

## The Math:
When connecting 3 different colored LEDs in series:

- Red LED: ~2.0V drop
- Green LED: ~2.2V drop  
- Blue LED: ~3.2V drop
- **Total voltage needed:** ~7.4V ✓

## With a 9V Battery:
- Voltage used by LEDs: 7.4V
- Voltage across resistor: 1.6V
- Current needed: 20mA (typical)
- **Resistor value:** R = 1.6V ÷ 0.020A = **80Ω** (use 100Ω)

## Building the Rainbow:
1. Battery positive → 100Ω resistor
2. Resistor → Red LED (positive lead)
3. Red LED (negative) → Green LED (positive)
4. Green LED (negative) → Blue LED (positive)
5. Blue LED (negative) → Battery negative

**Result:** A beautiful rainbow glow! 🌈`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Brightness Comparison',
        content: `# Why Less Bright? 💡

When LEDs are in series, they share the voltage and brightness!

## The Trade-off:
| Config | Brightness | Pros | Cons |
|--------|-----------|------|------|
| 1 LED | 100% | Max brightness | Limited |
| 2 LEDs | ~75% | More variety | Some loss |
| 3 LEDs | ~60% | Rainbow! 🌈 | Dimmer |

## Design Tips:
- Use **series** when you want multiple effects
- Use **parallel** when you need full brightness
- Mix them for cool multi-color displays! ✨`,
        type: 'text',
        completed: false,
      },
    ],
  },

  {
    id: 'current-and-power-meter',
    title: 'Measuring Current and Power',
    description: 'Use an ammeter to measure current and calculate power consumption',
    difficulty: 'intermediate',
    duration: '20 min',
    category: 'Measurement',
    icon: '⚙️',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'What is Current?',
        content: `# Electrons on the Move! 🏃

**Current** is the flow of electrons through a circuit, measured in **Amperes (A)** or **milliamps (mA)**.

## Think of It Like Water:
- Voltage = Water Pressure
- Current = How much water flows
- Resistance = Size of the pipe

## Ohm's Law (Again!):
\`I = V / R\`

- Increase voltage → More current
- Increase resistance → Less current

## Safe Ranges:
- **< 5mA** - Safe to touch! 🟢
- **5-50mA** - Painful, can interfere with heartbeat ⚠️
- **> 50mA** - Extremely dangerous 🔴

**Always be careful with electricity!**`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Ammeter in Action',
        content: `# How to Measure Current! 📊

## Ammeter Connection:
Ammeters must be connected **in series** with the circuit:

\`\`\`
Battery (+) → Ammeter → Components → Battery (-)
\`\`\`

**IMPORTANT:** Never connect an ammeter directly across a battery (parallel) - it will be destroyed!

## Reading Current:
- Multimeter set to A or mA
- Choose the right range
- Select correct polarity
- Measure at different points

## Example Readings:
- Single LED: 20mA
- 3 LEDs in series: 20mA (same current)
- 2 LED branches in parallel: 40mA total (20mA each)
- Motor circuit: 100-500mA

## Tips:
- Always estimate before measuring
- Start on highest range
- Reduce range if needed
- Never exceed ammeter limit!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Power Consumption',
        content: `# How Much Energy? ⚡

**Power** tells us how much energy is being used per second!

## Formula:
\`P = V × I\`

Power in Watts (W), Voltage in Volts, Current in Amps

## Examples:
- LED (2V, 20mA): P = 2 × 0.020 = **0.04W** = 40mW
- Motor (9V, 150mA): P = 9 × 0.150 = **1.35W** = 1350mW
- Your Phone: ~5W
- Light Bulb: ~60W
- Your House: ~1000-5000W total!

## Cost Calculator:
1kWh costs about $0.12 in the US

If your phone charges at 5W:
- 1 hour charging = 0.005 kWh
- Cost = 0.005 × $0.12 = **$0.0006** ✅ (less than 1 cent!)`,
        type: 'text',
        completed: false,
      },
    ],
  },

  {
    id: 'light-sensing-circuit',
    title: 'Light Sensors - Photoresistors',
    description: 'Build a circuit that responds to light levels',
    difficulty: 'intermediate',
    duration: '20 min',
    category: 'Sensors',
    icon: '🔦',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'What is a Photoresistor?',
        content: `# Light Changes Resistance! 🌞

A **Photoresistor (LDR - Light Dependent Resistor)** is magical - its resistance changes with light!

## How It Works:
- **Bright light** → Low resistance (100Ω) 💡
- **Darkness** → High resistance (1MΩ) 🌙

## Physics:
When photons hit the semiconductor material, they knock electrons loose, allowing current to flow more easily!

## Applications:
1. **Auto brightness** - Your phone screen 📱
2. **Street lights** - Turn on at dusk 🛣️
3. **Camera exposure** - Adjust for light levels 📸
4. **Burglar alarms** - Detect intruders 🚨`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Light Sensor Circuit',
        content: `# Build the Light Sensor Circuit! 🌞➡️🌙

## Circuit Design:
Use an LDR in a voltage divider configuration:

\`\`\`
Battery (+) ─┐
             ├─ Voltage out
            LDR
             ├─ To transistor base
            Resistor (1kΩ)
             │
           Ground
\`\`\`

## How It Works:
- **Bright light:** LDR resistance drops → Voltage at output goes DOWN
- **Darkness:** LDR resistance rises → Voltage at output goes UP

## Connecting to an LED:
1. Voltage divider output → Transistor base
2. Transistor base current → Controls LED brightness
3. In bright light → Less current → LED off
4. In darkness → More current → LED on

## Component Values:
- LDR: Any photoresistor (GL5528, LDR5516)
- Fixed resistor: 1kΩ
- Transistor: 2N2222
- LED resistor: 330Ω
- Battery: 9V

**Test it:** Cover the LDR and watch the LED brightness change! 🔦`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Build Your Own Light Detector',
        content: `# DIY Light Meter! 🔧

Create a circuit that automatically:
- ✅ Turns ON at night (darkness)
- ✅ Turns OFF during day (light)
- ✅ Adjusts brightness based on ambient light

## Challenge Project:
1. Use an LDR in a voltage divider
2. Connect output to transistor base
3. Transistor drives the LED
4. Test it with your phone's flashlight! 📱💡

## Real Products:
- 🏠 Home automation sensors
- 🚗 Automotive light sensors  
- 💡 Smart lighting systems
- 🌳 Outdoor decorative lights

**Bonus:** Can you add a temperature sensor too? 🌡️`,
        type: 'text',
        completed: false,
      },
    ],
  },
];

export const getTutorialsByDifficulty = (difficulty: string) => {
  return tutorials.filter((t) => t.difficulty === difficulty);
};

export const getTutorialById = (id: string) => {
  return tutorials.find((t) => t.id === id);
};
