// Circuit validation and connection verification service
import { circuitComponents } from "../data/components";

/**
 * Comprehensive circuit validation system
 * Ensures all components are properly connected and follows electrical engineering rules
 */

export interface ConnectionInfo {
  componentIndex: number;
  connectedTo: Set<number>;
  requiredConnections: number;
  actualConnections: number;
  isValid: boolean;
}

export interface CircuitValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  connectionInfo: Map<number, ConnectionInfo>;
}

// Component metadata: pin counts, power requirements, etc.
const COMPONENT_PINS: Record<string, number> = {
  // Two-terminal passive components
  resistor: 2,
  capacitor: 2,
  inductor: 2,
  fuse: 2,
  polyfuse: 2,
  diode: 2,
  "flyback-diode": 2,
  "tvs-diode": 2,
  "reverse-polarity": 2,
  led: 2,
  "led-indicator": 2,
  lightbulb: 2,
  buzzer: 2,
  speaker: 2,
  battery: 2,
  "dc-power-supply": 2,
  motor: 2,
  "stepper-motor": 2,
  "servo-motor": 2,
  "resistive-load": 2,
  "inductive-load": 2,
  transformer: 2,
  "current-sensor": 2,
  "voltage-sensor": 2,
  ammeter: 2,
  voltmeter: 2,

  // Three-terminal components
  potentiometer: 3,
  transistor: 3,

  // Five+ terminal components
  opamp: 5,
  "instrumentation-amplifier": 5,
  comparator: 3,
  "analog-mux": 8,
  "rc-lpf": 3,
  "lc-filter": 3,

  // Gate logic components (2 inputs, 1 output)
  "and-gate": 3,
  "or-gate": 3,
  "not-gate": 2,
  "nand-gate": 3,
  "nor-gate": 3,
  "xor-gate": 3,

  // Multi-pin devices
  "h-bridge": 4,
  "half-bridge": 3,
  "low-side-switch": 2,
  "high-side-switch": 2,
  "solid-state-relay": 2,
  "solenoid-driver": 2,
  "stepper-driver": 4,
  relay: 3,
  "e-stop": 2,
  switch: 2,
  pushbutton: 2,

  // Power conversion (input and output)
  "buck-converter": 2,
  "boost-converter": 2,
  "buck-boost-converter": 2,
  ldo: 2,
  "battery-charger": 2,
  "battery-protection": 2,
  "power-path-controller": 2,
  "ac-dc-converter": 2,

  // Control/Compute (many pins)
  microcontroller: 8,
  microprocessor: 8,
  fpga: 8,
  "clock-oscillator": 2,
  "reset-supervisor": 2,
  "gpio-expander": 8,

  // Communication
  uart: 2,
  rs485: 2,
  can: 2,
  spi: 4,
  i2c: 2,
  ethernet: 2,

  // Connection-agnostic components
  ground: 1,
  wire: 2,
  connector: 2,
  "terminal-block": 2,

  // Sensors
  "analog-sensor": 3,
  "digital-sensor": 2,
  "temperature-sensor": 3,
  "pressure-sensor": 3,
  "7segment": 8,
};

/**
 * Get the number of connection pins a component should have
 */
export function getComponentPinCount(componentType: string): number {
  const pins = COMPONENT_PINS[componentType];
  if (pins !== undefined) return pins;

  // Fallback: check component catalog
  const component = circuitComponents.find((c) => c.type === componentType);
  if (component) return component.connections;

  // Default to 2 pins if unknown
  return 2;
}

/**
 * Categorize connections by their electrical purpose
 */
export interface ConnectionEdge {
  from: number;
  to: number;
  label?: string;
}

/**
 * Validate that all connections are properly formed
 * Each component must have the correct number of connections
 */
export function validateCircuitConnections(
  components: Array<{ type: string }>,
  connections: Array<{ from: number; to: number; label?: string }>,
): CircuitValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const connectionInfo = new Map<number, ConnectionInfo>();

  // Initialize connection tracking
  for (let i = 0; i < components.length; i++) {
    const requiredConnections = getComponentPinCount(components[i].type);
    connectionInfo.set(i, {
      componentIndex: i,
      connectedTo: new Set(),
      requiredConnections,
      actualConnections: 0,
      isValid: false,
    });
  }

  // Count connections for each component
  connections.forEach((conn) => {
    const fromInfo = connectionInfo.get(conn.from);
    const toInfo = connectionInfo.get(conn.to);

    if (!fromInfo) {
      errors.push(
        `Connection references invalid component index: from=${conn.from}`,
      );
      return;
    }
    if (!toInfo) {
      errors.push(
        `Connection references invalid component index: to=${conn.to}`,
      );
      return;
    }

    fromInfo.connectedTo.add(conn.to);
    toInfo.connectedTo.add(conn.from);
  });

  // Update actual connection counts
  connectionInfo.forEach((info) => {
    info.actualConnections = info.connectedTo.size;
  });

  // Validate each component
  connectionInfo.forEach((info, idx) => {
    const component = components[idx];

    // Special handling for certain components
    if (component.type === "ground" || component.type === "wire") {
      // Ground and wire can have any number of connections
      info.isValid = true;
      return;
    }

    // Check if component has enough connections
    if (info.actualConnections < info.requiredConnections) {
      errors.push(
        `${component.type} at position ${idx} requires ${info.requiredConnections} connections but only has ${info.actualConnections}. ` +
          `Connected to components: ${Array.from(info.connectedTo).join(", ") || "none"}`,
      );
      info.isValid = false;
    } else if (info.actualConnections === info.requiredConnections) {
      info.isValid = true;
    } else {
      // More connections than required
      warnings.push(
        `${component.type} at position ${idx} has ${info.actualConnections} connections but only requires ${info.requiredConnections}.`,
      );
      info.isValid = true; // Still valid, just over-connected
    }
  });

  // Check for complete circuit topology
  const hasPowerSource = components.some((c) =>
    ["battery", "dc-power-supply", "ac-dc-converter"].includes(c.type),
  );
  const hasGround = components.some((c) => c.type === "ground");

  if (!hasPowerSource && components.length > 0) {
    errors.push(
      "Circuit must have a power source (battery or power supply)",
    );
  }

  if (!hasGround && components.length > 1) {
    warnings.push(
      "Circuit should have a ground reference for proper operation",
    );
  }

  // Check for isolated components (not connected to anything)
  connectionInfo.forEach((info, idx) => {
    if (
      info.actualConnections === 0 &&
      !["wire"].includes(components[idx].type)
    ) {
      errors.push(
        `${components[idx].type} at position ${idx} is not connected to anything`,
      );
    }
  });

  // Add electrical rule violations to errors
  const electricalIssues = validateElectricalRules(components, connections);
  errors.push(...electricalIssues);

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings,
    connectionInfo,
  };
}

/**
 * Validate connections follow electrical rules
 */
export function validateElectricalRules(
  components: Array<{ type: string }>,
  connections: Array<{ from: number; to: number; label?: string }>,
): string[] {
  const issues: string[] = [];

  // Check for motors in series (bad practice)
  const motorIdxs = components
    .map((c, i) =>
      ["motor", "stepper-motor", "servo-motor"].includes(c.type) ? i : -1,
    )
    .filter((i) => i >= 0);

  if (motorIdxs.length > 1) {
    for (let i = 0; i < motorIdxs.length - 1; i++) {
      const from = motorIdxs[i];
      const to = motorIdxs[i + 1];
      if (
        connections.some(
          (c) => (c.from === from && c.to === to) || (c.from === to && c.to === from),
        )
      ) {
        issues.push(
          `Motors should not be chained in series (motor ${i} → motor ${i + 1}). Use parallel connections instead.`,
        );
      }
    }
  }

  // Check that each motor driver is actually connected to motors
  const motorDriverIdxs = components
    .map((c, i) => ["h-bridge", "stepper-driver"].includes(c.type) ? i : -1)
    .filter((i) => i >= 0);

  motorDriverIdxs.forEach((driverIdx) => {
    const connectedToDriver = new Set<number>();
    connections.forEach((c) => {
      if (c.from === driverIdx) connectedToDriver.add(c.to);
      if (c.to === driverIdx) connectedToDriver.add(c.from);
    });

    const hasMotor = Array.from(connectedToDriver).some((idx) =>
      motorIdxs.includes(idx),
    );
    if (!hasMotor && motorIdxs.length > 0) {
      issues.push(
        `Motor driver at position ${driverIdx} is not connected to any motors`,
      );
    }
  });

  // Check for diodes properly oriented (if possible to infer)
  const diodeIdxs = components
    .map((c, i) =>
      ["diode", "flyback-diode", "tvs-diode"].includes(c.type) ? i : -1,
    )
    .filter((i) => i >= 0);

  diodeIdxs.forEach((diodeIdx) => {
    const connectedTo = new Set<number>();
    connections.forEach((c) => {
      if (c.from === diodeIdx) connectedTo.add(c.to);
      if (c.to === diodeIdx) connectedTo.add(c.from);
    });

    if (connectedTo.size < 2) {
      issues.push(
        `Diode at position ${diodeIdx} must be connected on both ends (currently only connected to ${connectedTo.size} component(s))`,
      );
    }
  });

  return issues;
}

/**
 * Generate a detailed report of the circuit
 */
export function generateCircuitReport(
  components: Array<{ type: string }>,
  connections: Array<{ from: number; to: number; label?: string }>,
): string {
  const validation = validateCircuitConnections(components, connections);
  const electricalIssues = validateElectricalRules(components, connections);

  let report = "=== CIRCUIT VALIDATION REPORT ===\n\n";

  report += `Components: ${components.length}\n`;
  report += `Connections: ${connections.length}\n`;
  report += `Valid: ${validation.isValid ? "YES" : "NO"}\n\n`;

  if (validation.errors.length > 0) {
    report += "ERRORS:\n";
    validation.errors.forEach((err) => {
      report += `  ❌ ${err}\n`;
    });
    report += "\n";
  }

  if (validation.warnings.length > 0) {
    report += "WARNINGS:\n";
    validation.warnings.forEach((warn) => {
      report += `  ⚠️  ${warn}\n`;
    });
    report += "\n";
  }

  if (electricalIssues.length > 0) {
    report += "ELECTRICAL RULE VIOLATIONS:\n";
    electricalIssues.forEach((issue) => {
      report += `  ⚡ ${issue}\n`;
    });
    report += "\n";
  }

  report += "CONNECTION DETAILS:\n";
  components.forEach((comp, idx) => {
    const info = validation.connectionInfo.get(idx);
    if (info) {
      report += `  [${idx}] ${comp.type}: ${info.actualConnections}/${info.requiredConnections} connections`;
      if (!info.isValid) report += " ❌";
      report += "\n";
    }
  });

  return report;
}
