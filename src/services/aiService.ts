// AI Service using OpenRouter API for circuit design assistance
import type { CircuitComponent } from "../types";
import { circuitComponents } from "../data/components";
import { getComponentPinCount } from './circuitValidator';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const insightCache = new Map<string, string>();

export interface CircuitAction {
  type:
    | "add_component"
    | "build_circuit"
    | "explain"
    | "modify_circuit"
    | "none";
  mode?: "replace" | "merge";
  components?: Array<{
    type: string;
    properties?: Record<string, unknown>;
  }>;
  connections?: Array<{
    from: number;
    to: number;
    label?: string;
  }>;
  message: string;
  componentInsights?: Record<string, string>;
}

// Represents the current state of the canvas for AI context
export interface CurrentCircuitState {
  components: Array<{
    type: string;
    id: string;
    label?: string;
  }>;
  connections: Array<{
    fromType: string;
    toType: string;
  }>;
}

const SYSTEM_PROMPT = `You are an expert circuit design assistant for Amperon, an educational circuit design application.

You help users build and understand electronic circuits. When a user asks you to build something, you MUST respond with actual component actions.

**CRITICAL RULES FOR COMPLEX REQUESTS:**
- Parse ALL specifications from user requests (don't simplify or ignore details)
- If user specifies quantities (e.g., "4 motors", "2 H-bridges"), include them ALL
- If user specifies components with properties (e.g., "regulated low-voltage rail", "pressure sensors", "audible alerts"), create them ALL
- Interpret implicit requirements: "motor drivers" means create appropriate quantity, "status indicators" means LEDs with resistors, "industrial layout" means explicit realistic wiring
- For complex requests, err on the side of OVER-specification, not under-specification
- Read the entire request multiple times before responding - don't stop at the first interpretation

AVAILABLE COMPONENTS (use exact type names):

POWER SOURCES:
- battery: Power source (9V DC)
- dc-power-supply: Regulated DC power supply
- ac-dc-converter: AC to DC converter
- buck-converter: Step-down voltage converter
- boost-converter: Step-up voltage converter
- buck-boost-converter: Step up/down voltage converter
- ldo: Low-dropout linear regulator
- battery-charger: Battery charging circuit
- battery-protection: Battery protection IC
- power-path-controller: Power path controller

PASSIVE COMPONENTS:
- resistor: Limits current flow (1000Ω default)
- capacitor: Stores electrical energy (100µF)
- inductor: Stores energy in magnetic field (10mH)
- potentiometer: Variable resistor (adjustable, 10kΩ)
- fuse: Safety device, breaks on overcurrent
- polyfuse: Resettable fuse

ANALOG/MIXED-SIGNAL:
- opamp: Operational amplifier (LM358) for signal amplification
- instrumentation-amplifier: Precision instrumentation amplifier
- comparator: Voltage comparator
- analog-mux: Analog multiplexer/demultiplexer
- rc-lpf: RC low-pass filter
- lc-filter: LC filter network

DIGITAL/LOGIC:
- and-gate: Logic AND gate (2 inputs, 1 output)
- or-gate: Logic OR gate (2 inputs, 1 output)
- not-gate: Logic NOT gate/inverter (1 input, 1 output)
- nand-gate: Logic NAND gate (2 inputs, 1 output)
- nor-gate: Logic NOR gate (2 inputs, 1 output)
- xor-gate: Logic XOR gate (2 inputs, 1 output)
- microcontroller: Embedded microcontroller
- microprocessor: Central processor
- fpga: Field programmable gate array
- clock-oscillator: Timing clock source
- reset-supervisor: Reset circuit
- gpio-expander: GPIO port expander

SWITCHES & CONTROL:
- switch: Toggle switch (SPST)
- pushbutton: Momentary pushbutton switch
- relay: Electromagnetic relay for high current loads
- solid-state-relay: Electronic relay (no moving parts)
- e-stop: Emergency stop button

DRIVERS & ACTUATION:
- h-bridge: H-Bridge motor driver (bidirectional DC motor control)
- half-bridge: Half-bridge driver for power stages
- low-side-switch: Low-side MOSFET switch
- high-side-switch: High-side switch
- solenoid-driver: Solenoid driver with flyback protection
- stepper-driver: Stepper motor driver
- transformer: AC voltage converter/isolation

OUTPUT & LOADS:
- led: Light Emitting Diode (needs resistor protection)
- lightbulb: Incandescent light (5W)
- buzzer: Produces sound (2.3kHz)
- motor: DC motor (6V)
- stepper-motor: Stepper motor (precise positioning)
- servo-motor: Servo motor with feedback
- speaker: Audio output (8Ω, 2W)
- resistive-load: Generic resistive load
- inductive-load: Inductive load (motor/solenoid)

SENSORS & MEASUREMENT:
- analog-sensor: Generic analog sensor
- digital-sensor: Digital input sensor
- temperature-sensor: Temperature sensor
- pressure-sensor: Pressure sensor
- current-sensor: Current measurement sensor
- voltage-sensor: Voltage measurement sensor
- ammeter: Measures current
- voltmeter: Measures voltage
- 7segment: 7-segment numeric display

COMMUNICATION & INTERFACES:
- uart: Serial UART interface
- rs485: RS-485 interface
- can: CAN bus interface
- spi: SPI interface
- i2c: I2C interface
- ethernet: Ethernet interface

PROTECTION & MISCELLANEOUS:
- diode: One-way current flow (1N4007)
- flyback-diode: Flyback diode for inductive loads
- tvs-diode: Transient voltage suppression diode
- reverse-polarity: Reverse polarity protection
- connector: Connector/socket
- terminal-block: Terminal block connector
- led-indicator: LED indicator light
- ground: Reference point (0V)
- wire: Connects components

RESPONSE FORMAT:
You MUST respond with valid JSON in this exact format:
{
  "type": "add_component" | "build_circuit" | "explain",
  "mode": "replace" | "merge",
  "components": [{"type": "component_type"}, ...],
  "connections": [{"from": 0, "to": 1}, {"from": 1, "to": 2}, ...],
  "message": "Your explanation to the user",
  "componentInsights": {
    "battery": "Purpose: ...\nWhere it fits: ...\nConnection tips: ...",
    "resistor": "..."
  }
}

IMPORTANT - CONNECTION ARRAY:
- "from" and "to" are INDEX NUMBERS of components in the components array (0-indexed)
- Example: If components are [battery, resistor, led], then:
  - {"from": 0, "to": 1} connects battery to resistor
  - {"from": 1, "to": 2} connects resistor to led
  - {"from": 2, "to": 0} would complete a loop back to battery
- Include ALL connections needed to form a complete, working circuit
- For series circuits, connect components in order: 0→1→2→3...→back to 0
- For parallel circuits, connect multiple components to same nodes

CRITICAL - PROPER CIRCUIT TOPOLOGY:
Follow these electrical engineering principles for realistic circuits:

1. POWER DISTRIBUTION:
   - Power source (battery) positive connects to power rails or first component in chain
   - All loads must have a return path to ground/battery negative
   - Use ground component as common return point

2. MOTOR DRIVERS (H-Bridge):
   - H-Bridge has: power input, ground, control inputs, and motor outputs
   - Connect power source → H-bridge power input
   - Each H-bridge can drive ONE motor (its output pair goes to one motor)
   - For 4 motors: use 2 H-bridges (each controls 2 motor terminals, so 2 motors per h-bridge is typical, or 4 h-bridges for individual control)
   - Motor connects between H-bridge outputs (NOT in series with other motors)
   - H-bridge ground connects to circuit ground
   
3. VOLTAGE REGULATION:
   - When battery voltage > component requirements, add regulator BEFORE loads
   - Buck converter: steps DOWN voltage (12V→5V)
   - Boost converter: steps UP voltage (5V→12V)
   - Chain: Battery → Regulator → Loads

4. SENSORS:
   - Sensors need power (VCC) and ground (GND)
   - Signal output goes to measurement/processing component
   - Connect sensor power pins to power rail, ground to common ground

5. PARALLEL vs SERIES:
   - LEDs in series: Battery→R→LED1→LED2→GND (same current through all)
   - LEDs in parallel: Battery→R→LED1→GND AND Battery→R→LED2→GND (separate current limiting)
   - Motors are usually in PARALLEL (each has own driver/path to power)

6. COMMON MISTAKES TO AVOID:
   - DON'T chain motors in series (motor1→motor2→motor3) - they need parallel power
   - DON'T connect motor driver output to another motor driver
   - DON'T forget return path to ground/battery negative
   - DON'T put regulator after the loads it should power
   - DON'T leave any component with fewer connections than required by its pins
   - DON'T connect diodes, resistors, or capacitors on only one end - they MUST have both ends connected
   - DON'T create "dangling" wires or incomplete component connections

COMPONENT PIN REQUIREMENTS (CRITICAL - ALL CONNECTIONS MUST BE COMPLETE):
- Two-pin components (MUST have exactly 2 connections): resistor, capacitor, inductor, fuse, diode, flyback-diode, led, buzzer, battery, motor, etc.
- Three-pin components: potentiometer, relay, comparator
- Five+ pin components: opamp, microcontroller
- Special: ground, wire (can have multiple connections)

CONNECTION VALIDATION RULES:
1. EVERY two-pin component must be connected on BOTH ends (not left dangling on one end)
2. EVERY three-pin component must have at least 3 connections
3. DIODES ESPECIALLY: Must have a complete path through them (anode → diode → cathode)
4. Resistors used for LEDs MUST connect: Power → Resistor → LED → Ground (complete chain)
5. All passive protection components (diodes, fuses, TVS) must be fully connected in the circuit
6. No isolated components - everything must have a complete path to ground

BEFORE SUBMITTING YOUR RESPONSE:
- Count connections for each component using the index numbers
- Verify each component has the MINIMUM required connections
- Check that no component is left with one connection dangling
- Ensure all protection/passive components are part of a complete circuit path
- If a component looks incomplete, add the missing connections

RULES:
1. For BUILD requests (build, create, make a circuit): Use "build_circuit" type with ALL components AND ALL connections
2. For ADD requests (add a resistor): Use "add_component" type with single component, empty connections array
3. For questions/explanations: Use "explain" type with empty components and connections arrays
4. ALWAYS include connections when building circuits - this is CRITICAL
5. Component types must match EXACTLY from the list above (lowercase)
6. If the user asks to modify or change an existing circuit, respond with "build_circuit" and "mode": "replace" and return the FULL updated circuit

EXAMPLES:

User: "Build an LED circuit"
Response: {
  "type": "build_circuit",
  "mode": "replace",
  "components": [{"type": "battery"}, {"type": "resistor"}, {"type": "led"}],
  "connections": [{"from": 0, "to": 1}, {"from": 1, "to": 2}, {"from": 2, "to": 0}],
  "message": "I've created a series LED circuit: Battery → Resistor → LED → back to Battery. The resistor limits current to protect the LED."
}

User: "Add a capacitor"
Response: {
  "type": "add_component",
  "components": [{"type": "capacitor"}],
  "connections": [],
  "message": "Added a capacitor to your canvas."
}

User: "What is Ohm's Law?"
Response: {
  "type": "explain",
  "components": [],
  "connections": [],
  "message": "Ohm's Law states V = I × R..."
}

User: "Build a circuit to measure voltage across a resistor"
Response: {
  "type": "build_circuit",
  "components": [{"type": "battery"}, {"type": "resistor"}, {"type": "voltmeter"}, {"type": "ground"}],
  "connections": [{"from": 0, "to": 1}, {"from": 1, "to": 3}, {"from": 0, "to": 2}, {"from": 2, "to": 3}],
  "message": "Series battery-resistor-ground, with voltmeter connected in parallel across the resistor."
}

User: "Build a series circuit with two LEDs and a buzzer with a 10v battery"
Response: {
  "type": "build_circuit",
  "components": [{"type": "battery"}, {"type": "resistor"}, {"type": "led"}, {"type": "led"}, {"type": "buzzer"}],
  "connections": [{"from": 0, "to": 1}, {"from": 1, "to": 2}, {"from": 2, "to": 3}, {"from": 3, "to": 4}, {"from": 4, "to": 0}],
  "message": "Series circuit: Battery (10V) → Resistor → LED → LED → Buzzer → back to Battery. The resistor protects the LEDs from excessive current."
}

User: "Create a motor control circuit with a switch"
Response: {
  "type": "build_circuit",
  "components": [{"type": "battery"}, {"type": "switch"}, {"type": "motor"}, {"type": "diode"}, {"type": "ground"}],
  "connections": [{"from": 0, "to": 1}, {"from": 1, "to": 2}, {"from": 2, "to": 3}, {"from": 3, "to": 4}, {"from": 4, "to": 0}],
  "message": "Motor control circuit: Battery → Switch → Motor → Flyback Diode → Ground. The diode protects against back-EMF."
}

User: "Build a circuit with 4 DC motors and an H-bridge motor driver"
Response: {
  "type": "build_circuit",
  "mode": "replace",
  "components": [{"type": "battery"}, {"type": "h-bridge"}, {"type": "h-bridge"}, {"type": "motor"}, {"type": "motor"}, {"type": "motor"}, {"type": "motor"}, {"type": "ground"}],
  "connections": [
    {"from": 0, "to": 1}, {"from": 0, "to": 2},
    {"from": 1, "to": 3}, {"from": 1, "to": 4},
    {"from": 2, "to": 5}, {"from": 2, "to": 6},
    {"from": 3, "to": 7}, {"from": 4, "to": 7}, {"from": 5, "to": 7}, {"from": 6, "to": 7},
    {"from": 1, "to": 7}, {"from": 2, "to": 7},
    {"from": 7, "to": 0}
  ],
  "message": "Circuit with 4 DC motors: Battery powers 2 H-bridge drivers. Each H-bridge controls 2 motors. All motors and drivers connect to common ground. H-bridges enable bidirectional motor control."
}

User: "Create a circuit with a battery, buck converter for 5V, pressure sensor, and 4 motors with 2 H-bridges"
Response: {
  "type": "build_circuit",
  "mode": "replace",
  "components": [{"type": "battery"}, {"type": "buck-converter"}, {"type": "h-bridge"}, {"type": "h-bridge"}, {"type": "pressure-sensor"}, {"type": "motor"}, {"type": "motor"}, {"type": "motor"}, {"type": "motor"}, {"type": "ground"}],
  "connections": [
    {"from": 0, "to": 1},
    {"from": 1, "to": 2}, {"from": 1, "to": 3}, {"from": 1, "to": 4},
    {"from": 2, "to": 5}, {"from": 2, "to": 6},
    {"from": 3, "to": 7}, {"from": 3, "to": 8},
    {"from": 4, "to": 9}, {"from": 5, "to": 9}, {"from": 6, "to": 9}, {"from": 7, "to": 9}, {"from": 8, "to": 9},
    {"from": 2, "to": 9}, {"from": 3, "to": 9},
    {"from": 9, "to": 0}
  ],
  "message": "12V battery → buck converter (steps down to 5V) → powers 2 H-bridges, pressure sensor, and 4 motors (2 per H-bridge). All components share common ground."
}

User: "Design a battery-powered industrial motor control and monitoring circuit for a small automated mechanical system with a buck converter for low-voltage control, 2 H-bridges controlling 4 DC motors in 2 groups by load, LED indicators with resistors for power/motor/fault status, pressure sensors for load monitoring, and audible buzzers for overload alerts with realistic production-style wiring"
Response: {
  "type": "build_circuit",
  "mode": "replace",
  "components": [
    {"type": "battery"}, {"type": "buck-converter"}, 
    {"type": "h-bridge"}, {"type": "h-bridge"},
    {"type": "motor"}, {"type": "motor"}, {"type": "motor"}, {"type": "motor"},
    {"type": "pressure-sensor"}, {"type": "pressure-sensor"},
    {"type": "led"}, {"type": "resistor"}, {"type": "led"}, {"type": "resistor"}, {"type": "led"}, {"type": "resistor"}, {"type": "led"}, {"type": "resistor"}, {"type": "led"}, {"type": "resistor"}, {"type": "led"}, {"type": "resistor"},
    {"type": "buzzer"}, {"type": "buzzer"}, {"type": "resistor"}, {"type": "resistor"},
    {"type": "diode"}, {"type": "diode"}, {"type": "diode"}, {"type": "diode"},
    {"type": "ground"}
  ],
  "connections": [
    {"from": 0, "to": 1},
    {"from": 1, "to": 2}, {"from": 1, "to": 3},
    {"from": 2, "to": 4}, {"from": 2, "to": 5}, {"from": 3, "to": 6}, {"from": 3, "to": 7},
    {"from": 4, "to": 25}, {"from": 5, "to": 25}, {"from": 6, "to": 25}, {"from": 7, "to": 25},
    {"from": 1, "to": 8}, {"from": 1, "to": 9},
    {"from": 8, "to": 12}, {"from": 9, "to": 16},
    {"from": 10, "to": 11}, {"from": 11, "to": 25},
    {"from": 12, "to": 13}, {"from": 13, "to": 25},
    {"from": 14, "to": 15}, {"from": 15, "to": 25},
    {"from": 16, "to": 17}, {"from": 17, "to": 25},
    {"from": 18, "to": 19}, {"from": 19, "to": 25},
    {"from": 20, "to": 21}, {"from": 21, "to": 25},
    {"from": 1, "to": 22}, {"from": 1, "to": 23},
    {"from": 22, "to": 24}, {"from": 24, "to": 25},
    {"from": 23, "to": 25},
    {"from": 2, "to": 26}, {"from": 3, "to": 27}, {"from": 4, "to": 28}, {"from": 5, "to": 29},
    {"from": 25, "to": 0}
  ],
  "message": "Production-grade industrial motor control circuit: 12V battery → buck converter (5V rail for control/sensing). Two H-bridges control 4 DC motors in 2 groups: H-bridge 1 drives motors 1-2 (high-torque load), H-bridge 2 drives motors 3-4 (auxiliary load). 2 pressure sensors monitor mechanical load on each group. 6 LED status indicators with 220Ω resistors: power presence, motor 1-2 active, motor 3-4 active, pressure warning 1, pressure warning 2, fault condition. 2 audible buzzers (one per load group) for overload/fault signaling with current-limiting resistors. Flyback diodes protect motor drivers from back-EMF. All components share common ground with explicit return paths. Realistic industrial layout with individual component connections rather than block abstraction."
}


HANDLING MODIFICATIONS:
When a user asks to modify an existing circuit (e.g., "add 3 more motors", "I want 4 LEDs instead of 1", "change the resistor to a capacitor"):
1. You will receive the current circuit state in the context
2. Use type "build_circuit" with mode "replace" to return the COMPLETE updated circuit
3. Preserve components that should remain unchanged
4. Add/remove/modify components as requested
5. Recalculate all connections for the new circuit layout

Examples of modification requests:
- "I want 4 motors" → If there's 1 motor, add 3 more motors to make 4 total
- "Add 2 more LEDs" → Keep existing components, add 2 more LEDs
- "Remove the buzzer" → Return circuit without the buzzer
- "Change to parallel" → Reconfigure connections for parallel layout

IMPORTANT REMINDERS:
1. ALWAYS include the connections array - NEVER omit it
2. Use 0-based indexing for component positions
3. For complete circuits, ensure all components are connected in a logical path
4. Include componentInsights when possible for any components you add
5. Respond with ONLY valid JSON - no markdown, no explanation outside JSON
6. When modifying existing circuits, ALWAYS return the FULL updated circuit with ALL components`;

const INSIGHT_SYSTEM_PROMPT = `You are a friendly electronics tutor for Amperon. Explain components for beginners in <60 words.

Return EXACTLY three short lines, each starting with a bold label:
**Purpose:** ...
**Where it fits:** ...
**Connection tips:** ...

Keep it kid-friendly, no extra markup, no code fences.`;

const componentCatalog = new Map<string, CircuitComponent>(
  circuitComponents.map((c) => [c.type, c]),
);

export async function sendMessageToAI(
  userMessage: string,
  options?: {
    history?: Array<{ role: "user" | "assistant"; content: string }>;
    lastCircuit?: CircuitAction | null;
    currentCircuitState?: CurrentCircuitState | null;
  },
): Promise<CircuitAction> {
  // If no API key, fall back to local intent-based builder so the app still works
  if (!OPENROUTER_API_KEY) {
    console.warn(
      "OpenRouter API key not configured — using local fallback builder",
    );
    const modified = deriveModifiedCircuitFromText(
      userMessage,
      options?.currentCircuitState,
      options?.lastCircuit,
    );
    if (modified) return modified;
    const fallback = buildCircuitFromIntent(userMessage);
    if (fallback) return fallback;
    return {
      type: "explain",
      message:
        "AI service not configured. Please add VITE_OPENROUTER_API_KEY to your .env file.",
    };
  }

  try {
    const contextMessages: Array<{
      role: "system" | "user" | "assistant";
      content: string;
    }> = [{ role: "system", content: SYSTEM_PROMPT }];

    // Provide current circuit state for modifications
    if (
      options?.currentCircuitState &&
      options.currentCircuitState.components.length > 0
    ) {
      const componentSummary = options.currentCircuitState.components
        .map((c, i) => `${i}: ${c.type}${c.label ? ` (${c.label})` : ""}`)
        .join(", ");
      contextMessages.push({
        role: "system",
        content: `CURRENT CIRCUIT STATE (user may want to modify this):
Components on canvas: [${componentSummary}]
Total: ${options.currentCircuitState.components.length} components

If user asks to add more, change quantities, or modify the circuit, return a complete updated circuit with "build_circuit" type and "replace" mode.`,
      });
    }

    if (options?.lastCircuit) {
      contextMessages.push({
        role: "system",
        content: `Previous circuit action JSON (for reference): ${JSON.stringify(options.lastCircuit)}`,
      });
    }

    if (options?.history && options.history.length > 0) {
      const trimmedHistory = options.history.slice(-6);
      contextMessages.push(...trimmedHistory);
    }

    contextMessages.push({ role: "user", content: userMessage });

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "Amperon",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: contextMessages,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", response.status, errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response content from AI");
    }

    console.log("Raw AI response:", content);

    // Parse the JSON response
    try {
      // Clean up the response - remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.slice(7);
      }
      if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith("```")) {
        cleanContent = cleanContent.slice(0, -3);
      }
      cleanContent = cleanContent.trim();

      console.log("Cleaned content:", cleanContent);

      const parsed = JSON.parse(cleanContent) as CircuitAction;

      console.log("Parsed action:", parsed);

      // Validate the response structure
      if (!parsed.type || !parsed.message) {
        throw new Error("Invalid response structure");
      }

      // Fallback autowire: if building a circuit and connections missing, create a simple series path
      const components = parsed.components || [];
      let connections = parsed.connections || [];
      if (
        (parsed.type === "build_circuit" || parsed.type === "add_component") &&
        (!connections || connections.length === 0)
      ) {
        connections = generateSeriesConnections(components);
        console.log("Auto-generated connections (fallback):", connections);
      }

      // CRITICAL: Validate and fix ALL connections to ensure no component is left incomplete
      if (components.length > 0 && connections.length > 0) {
        connections = validateAndFixConnections(components, connections);
        console.log("Validated and fixed connections:", connections);
      }

      let result: CircuitAction = {
        type: parsed.type || "explain",
        mode: parsed.mode,
        components,
        connections,
        message: parsed.message,
        componentInsights: parsed.componentInsights,
      };

      // If the AI responded with explain/no components, attempt local modification-aware fallback
      if (!components || components.length === 0 || result.type === "explain") {
        const modified = deriveModifiedCircuitFromText(
          userMessage,
          options?.currentCircuitState,
          options?.lastCircuit,
        );
        if (modified) {
          result = modified;
        } else {
          const fallback = buildCircuitFromIntent(userMessage);
          if (fallback) {
            result = fallback;
          }
        }
      }

      // Seed insights cache from response and fill any gaps with a single batch call
      const componentTypes = (result.components || []).map((c) => c.type);
      const fromResponse = result.componentInsights || {};
      Object.entries(fromResponse).forEach(([type, text]) => {
        if (text) insightCache.set(type, text);
      });
      if (componentTypes.length > 0) {
        const batch = await fetchComponentInsightsBatch(componentTypes);
        result.componentInsights = { ...batch, ...fromResponse };
      }

      console.log("Final result:", result);
      return result;
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      // Try local modification-aware fallback when parsing fails
      const modified = deriveModifiedCircuitFromText(
        userMessage,
        options?.currentCircuitState,
        options?.lastCircuit,
      );
      if (modified) return modified;
      const fallback = buildCircuitFromIntent(userMessage);
      if (fallback) return fallback;
      return {
        type: "explain",
        message: content,
      };
    }
  } catch (error) {
    console.error("AI service error:", error);
    const modified = deriveModifiedCircuitFromText(
      userMessage,
      options?.currentCircuitState,
      options?.lastCircuit,
    );
    if (modified) return modified;
    const fallback = buildCircuitFromIntent(userMessage);
    if (fallback) return fallback;
    return {
      type: "explain",
      message:
        "I encountered an error processing your request. Please try again.",
    };
  }
}

// Component categorization for intelligent connection building
const POWER_SOURCES = new Set(['battery', 'dc-power-supply', 'ac-dc-converter']);
const REGULATORS = new Set(['buck-converter', 'boost-converter', 'buck-boost-converter', 'ldo']);
const MOTOR_DRIVERS = new Set(['h-bridge', 'half-bridge', 'stepper-driver', 'solenoid-driver']);
const MOTORS = new Set(['motor', 'stepper-motor', 'servo-motor']);
const PASSIVE_LOADS = new Set(['led', 'lightbulb', 'buzzer', 'speaker', 'resistive-load']);
const SENSORS = new Set(['analog-sensor', 'digital-sensor', 'temperature-sensor', 'pressure-sensor', 'current-sensor', 'voltage-sensor']);
const PROTECTION = new Set(['diode', 'flyback-diode', 'fuse', 'polyfuse', 'tvs-diode', 'reverse-polarity', 'battery-protection']);
const CONTROL = new Set(['switch', 'pushbutton', 'relay', 'solid-state-relay', 'e-stop']);

/**
 * CRITICAL: Validate and fix incomplete connections in ANY circuit
 * This ensures all components with required connections get them, regardless of AI or fallback generation
 */
function validateAndFixConnections(
  components: Array<{ type: string }>,
  connections: Array<{ from: number; to: number; label?: string }>,
): Array<{ from: number; to: number; label?: string }> {
  if (!components || components.length === 0) return connections;

  const conns = [...connections]; // Make a copy to modify
  
  // Build connection tracking map
  const connectedToComponent = new Map<number, Set<number>>();
  components.forEach((_, idx) => {
    connectedToComponent.set(idx, new Set<number>());
  });

  // Track existing connections
  conns.forEach((conn) => {
    const fromSet = connectedToComponent.get(conn.from);
    const toSet = connectedToComponent.get(conn.to);
    if (fromSet) fromSet.add(conn.to);
    if (toSet) toSet.add(conn.from);
  });

  // Find key indices
  const powerIdx = components.findIndex((c) => POWER_SOURCES.has(c.type));
  const groundIdx = components.findIndex((c) => c.type === 'ground');

  // CRITICAL: Ensure all components with required connections have them
  components.forEach((comp, idx) => {
    const requiredConnections = getComponentPinCount(comp.type);
    const actualConnections = connectedToComponent.get(idx)!.size;

    // If component needs more connections, add them
    if (actualConnections < requiredConnections) {
      const existingConnections = connectedToComponent.get(idx)!;
      let connectionsNeeded = requiredConnections - actualConnections;

      // Priority order for connection points
      const connectionCandidates = [
        groundIdx,
        powerIdx,
      ].filter(i => i >= 0 && i !== idx && !existingConnections.has(i));

      // First, connect to priority candidates
      for (const candidate of connectionCandidates) {
        if (connectionsNeeded <= 0) break;
        conns.push({ from: idx, to: candidate });
        existingConnections.add(candidate);
        connectedToComponent.get(candidate)?.add(idx);
        connectionsNeeded--;
      }

      // If still need connections, find any available component
      if (connectionsNeeded > 0) {
        for (let i = 0; i < components.length; i++) {
          if (connectionsNeeded <= 0) break;
          if (i !== idx && !existingConnections.has(i)) {
            conns.push({ from: idx, to: i });
            existingConnections.add(i);
            connectedToComponent.get(i)?.add(idx);
            connectionsNeeded--;
          }
        }
      }
    }
  });

  return conns;
}

// Helper: Generate intelligent connections based on component types and proper circuit topology
// This version ensures all components are properly connected according to electrical rules
function generateSeriesConnections(
  components: Array<{ type: string; properties?: Record<string, unknown> }>,
): Array<{ from: number; to: number; label?: string }> {
  if (!components || components.length === 0) return [];
  
  const conns: Array<{ from: number; to: number; label?: string }> = [];
  
  // Find key component indices
  const powerIdx = components.findIndex((c) => POWER_SOURCES.has(c.type));
  const groundIdx = components.findIndex((c) => c.type === 'ground');
  const regulatorIdxs = components.map((c, i) => REGULATORS.has(c.type) ? i : -1).filter(i => i >= 0);
  const motorDriverIdxs = components.map((c, i) => MOTOR_DRIVERS.has(c.type) ? i : -1).filter(i => i >= 0);
  const motorIdxs = components.map((c, i) => MOTORS.has(c.type) ? i : -1).filter(i => i >= 0);
  const loadIdxs = components.map((c, i) => PASSIVE_LOADS.has(c.type) ? i : -1).filter(i => i >= 0);
  const sensorIdxs = components.map((c, i) => SENSORS.has(c.type) ? i : -1).filter(i => i >= 0);
  const controlIdxs = components.map((c, i) => CONTROL.has(c.type) ? i : -1).filter(i => i >= 0);
  const protectionIdxs = components.map((c, i) => PROTECTION.has(c.type) ? i : -1).filter(i => i >= 0);
  
  // Get resistor and capacitor indices (for proper current limiting and filtering)
  const resistorIdxs = components.map((c, i) => c.type === 'resistor' ? i : -1).filter(i => i >= 0);
  const capacitorIdxs = components.map((c, i) => c.type === 'capacitor' ? i : -1).filter(i => i >= 0);
  let resistorUsed = 0; // Track how many resistors have been used for LEDs/loads
  
  // Track which components have been connected and how many connections each has
  const connectedToComponent = new Map<number, Set<number>>();
  components.forEach((_, idx) => {
    connectedToComponent.set(idx, new Set<number>());
  });
  
  // Helper to add a connection and track it
  const addConnection = (from: number, to: number, label?: string) => {
    conns.push({ from, to, label });
    connectedToComponent.get(from)?.add(to);
    connectedToComponent.get(to)?.add(from);
  };
  
  // Determine power distribution point (after regulator if exists)
  let powerDistributionPoint = powerIdx >= 0 ? powerIdx : 0;
  
  // STEP 1: Power source to regulator (if exists)
  if (powerIdx >= 0 && regulatorIdxs.length > 0) {
    const regIdx = regulatorIdxs[0];
    addConnection(powerIdx, regIdx);
    powerDistributionPoint = regIdx; // Power now comes from regulator output
  }
  
  // STEP 2: Connect motor drivers to power distribution point
  motorDriverIdxs.forEach((driverIdx) => {
    if (connectedToComponent.get(driverIdx)!.size === 0 || driverIdx !== powerDistributionPoint) {
      addConnection(powerDistributionPoint, driverIdx);
      // Also connect to ground for power return
      if (groundIdx >= 0) {
        addConnection(driverIdx, groundIdx);
      }
    }
  });
  
  // STEP 3: Connect motors to motor drivers (parallel, one motor per driver or shared)
  if (motorIdxs.length > 0 && motorDriverIdxs.length > 0) {
    motorIdxs.forEach((motorIdx, i) => {
      const driverIdx = motorDriverIdxs[i % motorDriverIdxs.length];
      addConnection(driverIdx, motorIdx);
      // Motors need return path to ground
      if (groundIdx >= 0) {
        addConnection(motorIdx, groundIdx);
      }
    });
  } else if (motorIdxs.length > 0) {
    // No motor drivers, connect motors directly
    motorIdxs.forEach((motorIdx) => {
      let sourcePoint = powerDistributionPoint;
      
      // If there's a control switch, insert it in the path
      if (controlIdxs.length > 0 && connectedToComponent.get(controlIdxs[0])!.size === 0) {
        const ctrlIdx = controlIdxs[0];
        addConnection(powerDistributionPoint, ctrlIdx);
        sourcePoint = ctrlIdx;
      }
      
      addConnection(sourcePoint, motorIdx);
      
      // Add flyback protection if available
      const flybackIdx = protectionIdxs.find(idx => 
        components[idx].type === 'flyback-diode' || components[idx].type === 'diode'
      );
      if (flybackIdx !== undefined && connectedToComponent.get(flybackIdx)!.size < 2) {
        addConnection(motorIdx, flybackIdx);
        if (groundIdx >= 0 && connectedToComponent.get(flybackIdx)!.size < 2) {
          addConnection(flybackIdx, groundIdx);
        }
      } else if (groundIdx >= 0) {
        addConnection(motorIdx, groundIdx);
      }
    });
  }
  
  // STEP 4: Connect passive loads (LEDs, buzzers, speakers, etc.)
  if (loadIdxs.length > 0) {
    loadIdxs.forEach((loadIdx) => {
      let sourcePoint = powerDistributionPoint;
      
      // Use a resistor for current limiting (especially for LEDs)
      if (components[loadIdx].type === 'led' && resistorUsed < resistorIdxs.length) {
        const resIdx = resistorIdxs[resistorUsed++];
        // Resistor must be properly inserted: Power → Resistor → LED → Ground
        // This ensures the resistor is fully connected (2 connections for a 2-pin device)
        addConnection(powerDistributionPoint, resIdx);
        sourcePoint = resIdx;
      }
      
      addConnection(sourcePoint, loadIdx);
      
      // Return to ground
      if (groundIdx >= 0 && connectedToComponent.get(loadIdx)!.size < 2) {
        addConnection(loadIdx, groundIdx);
      }
    });
  }
  
  // STEP 5: Connect protection components (diodes, fuses) and unused resistors properly
  // Diodes, fuses, capacitors etc. need to be part of the main circuit chain, not dangling
  // IMPORTANT: Any resistor used as protection/snubber should also be fully connected
  const allResistorIdxs = components.map((c, i) => c.type === 'resistor' ? i : -1).filter(i => i >= 0);
  const usedResistors = new Set(resistorIdxs.slice(0, resistorUsed || 0));
  const unusedResistorIdxs = allResistorIdxs.filter(idx => !usedResistors.has(idx) && connectedToComponent.get(idx)!.size === 0);
  const danglingProtection = protectionIdxs.filter(idx => connectedToComponent.get(idx)!.size < 2);
  const danglingCapacitors = capacitorIdxs.filter(idx => connectedToComponent.get(idx)!.size < 2);
  
  // Connect unused resistors as parallel snubbers or current limiting elements
  unusedResistorIdxs.forEach((resIdx) => {
    if (connectedToComponent.get(resIdx)!.size === 0) {
      // Connect between power and ground for filtering/snubbing
      addConnection(powerDistributionPoint, resIdx);
      if (groundIdx >= 0 && connectedToComponent.get(resIdx)!.size < 2) {
        addConnection(resIdx, groundIdx);
      }
    }
  });
  
  // CRITICAL: All protection components (diodes) MUST have 2 connections
  danglingProtection.forEach((protIdx) => {
    const currentConnections = connectedToComponent.get(protIdx)!.size;
    
    if (currentConnections === 0) {
      // Completely disconnected: connect both ends
      addConnection(powerDistributionPoint, protIdx);
      if (groundIdx >= 0 && connectedToComponent.get(protIdx)!.size < 2) {
        addConnection(protIdx, groundIdx);
      }
    } else if (currentConnections === 1) {
      // Only 1 connection: MUST complete to 2 connections
      let connected = false;
      const existingConnections = connectedToComponent.get(protIdx)!;
      
      // First try: connect to ground (preferred for diodes)
      if (groundIdx >= 0 && !existingConnections.has(groundIdx)) {
        addConnection(protIdx, groundIdx);
        connected = true;
      }
      
      // Second try: connect to power if ground didn't work
      if (!connected && powerIdx >= 0 && !existingConnections.has(powerIdx)) {
        addConnection(protIdx, powerIdx);
        connected = true;
      }
      
      // Third try: connect to power distribution point
      if (!connected && powerDistributionPoint >= 0 && !existingConnections.has(powerDistributionPoint)) {
        addConnection(protIdx, powerDistributionPoint);
        connected = true;
      }
      
      // Last resort: find any available component to connect to
      if (!connected) {
        for (let i = 0; i < components.length; i++) {
          if (i !== protIdx && !existingConnections.has(i)) {
            addConnection(protIdx, i);
            connected = true;
            break;
          }
        }
      }
    }
  });
  
  // Connect capacitors for filtering
  danglingCapacitors.forEach((capIdx) => {
    const currentConnections = connectedToComponent.get(capIdx)!.size;
    
    if (currentConnections === 0) {
      addConnection(powerDistributionPoint, capIdx);
      if (groundIdx >= 0 && connectedToComponent.get(capIdx)!.size < 2) {
        addConnection(capIdx, groundIdx);
      }
    } else if (currentConnections === 1) {
      // Only 1 connection: MUST complete to 2 connections
      let connected = false;
      const existingConnections = connectedToComponent.get(capIdx)!;
      
      // First try: connect to ground (preferred for capacitors)
      if (groundIdx >= 0 && !existingConnections.has(groundIdx)) {
        addConnection(capIdx, groundIdx);
        connected = true;
      }
      
      // Second try: connect to power if ground didn't work
      if (!connected && powerIdx >= 0 && !existingConnections.has(powerIdx)) {
        addConnection(capIdx, powerIdx);
        connected = true;
      }
      
      // Third try: connect to power distribution point
      if (!connected && powerDistributionPoint >= 0 && !existingConnections.has(powerDistributionPoint)) {
        addConnection(capIdx, powerDistributionPoint);
        connected = true;
      }
      
      // Last resort: find any available component to connect to
      if (!connected) {
        for (let i = 0; i < components.length; i++) {
          if (i !== capIdx && !existingConnections.has(i)) {
            addConnection(capIdx, i);
            connected = true;
            break;
          }
        }
      }
    }
  });
  
  // STEP 6: Connect sensors (they need power and ground)
  sensorIdxs.forEach((sensorIdx) => {
    const sensorConnections = connectedToComponent.get(sensorIdx)!.size;
    if (sensorConnections === 0) {
      addConnection(powerDistributionPoint, sensorIdx);
      if (groundIdx >= 0) {
        addConnection(sensorIdx, groundIdx);
      }
    } else if (sensorConnections === 1) {
      if (groundIdx >= 0) {
        addConnection(sensorIdx, groundIdx);
      }
    }
  });
  
  // STEP 7: Connect any remaining unconnected components
  // This ensures NO component is left "hanging" or with incomplete connections
  components.forEach((comp, idx) => {
    const connections = connectedToComponent.get(idx)!.size;
    const requiredConnections = getComponentPinCount(comp.type);
    
    if (connections === 0 && idx !== powerIdx && idx !== groundIdx) {
      // Component is completely isolated - must connect it
      addConnection(powerDistributionPoint, idx);
      // If it needs 2+ connections, also connect to ground
      if (requiredConnections >= 2 && groundIdx >= 0) {
        addConnection(idx, groundIdx);
      }
    } else if (connections === 1 && requiredConnections >= 2 && idx !== powerIdx && idx !== groundIdx) {
      // Component only has one connection, but needs more - complete the circuit
      if (!POWER_SOURCES.has(comp.type) && comp.type !== 'ground') {
        let connected = false;
        const existingConnections = connectedToComponent.get(idx)!;
        
        // First try: connect to ground
        if (groundIdx >= 0 && !existingConnections.has(groundIdx)) {
          addConnection(idx, groundIdx);
          connected = true;
        }
        
        // Second try: connect to power if ground didn't work
        if (!connected && powerIdx >= 0 && !existingConnections.has(powerIdx)) {
          addConnection(idx, powerIdx);
          connected = true;
        }
        
        // Third try: connect to power distribution point
        if (!connected && powerDistributionPoint >= 0 && !existingConnections.has(powerDistributionPoint)) {
          addConnection(idx, powerDistributionPoint);
          connected = true;
        }
        
        // Last resort: find any available component to connect to
        if (!connected) {
          for (let i = 0; i < components.length; i++) {
            if (i !== idx && !existingConnections.has(i)) {
              addConnection(idx, i);
              connected = true;
              break;
            }
          }
        }
      }
    }
  });
  
  // STEP 8: Ensure ground connects back to power source (close the circuit)
  if (groundIdx >= 0 && powerIdx >= 0 && groundIdx !== powerIdx) {
    if (!connectedToComponent.get(groundIdx)!.has(powerIdx)) {
      addConnection(groundIdx, powerIdx);
    }
  }
  
  return conns;
}

// Attempt to locally modify an existing circuit when the user asks for quantity changes
function deriveModifiedCircuitFromText(
  userMessage: string,
  currentState?: CurrentCircuitState | null,
  lastAction?: CircuitAction | null,
): CircuitAction | null {
  if (!currentState || currentState.components.length === 0) return null;

  const text = (userMessage || "").toLowerCase();
  const numberMatch = text.match(
    /(\d+|one|two|three|four|five|six|seven|eight|nine|ten)/,
  );
  const desiredCount = numberMatch ? wordToNumber(numberMatch[1]) : null;
  if (!desiredCount || desiredCount < 0) return null;

  const synonyms: Record<string, string> = {
    // Motors and drivers
    "dc motor": "motor",
    motors: "motor",
    motor: "motor",
    "h-bridge": "h-bridge",
    "hbridge": "h-bridge",
    "h bridge": "h-bridge",
    "motor driver": "h-bridge",
    "motor control": "h-bridge",
    "stepper": "stepper-motor",
    "stepper motor": "stepper-motor",
    "servo": "servo-motor",
    "servo motor": "servo-motor",
    "stepper driver": "stepper-driver",
    "solenoid driver": "solenoid-driver",
    "half-bridge": "half-bridge",
    "half bridge": "half-bridge",
    
    // Lights and outputs
    leds: "led",
    led: "led",
    light: "led",
    lights: "led",
    "light bulb": "lightbulb",
    
    // Power supplies
    "power supply": "battery",
    "dc power": "dc-power-supply",
    "ac converter": "ac-dc-converter",
    converter: "buck-converter",
    "buck": "buck-converter",
    "boost": "boost-converter",
    regulator: "ldo",
    "charger": "battery-charger",
    
    // Protection
    protection: "battery-protection",
    diode: "diode",
    "flyback diode": "flyback-diode",
    
    // Logic and control
    "and gate": "and-gate",
    "or gate": "or-gate",
    "not gate": "not-gate",
    "nand gate": "nand-gate",
    "nor gate": "nor-gate",
    "xor gate": "xor-gate",
    
    // Sensors
    sensor: "analog-sensor",
    temperature: "temperature-sensor",
    pressure: "pressure-sensor",
    current: "current-sensor",
    voltage: "voltage-sensor",
  };

  const findTargetType = () => {
    for (const [key, mapped] of Object.entries(synonyms)) {
      if (text.includes(key)) return mapped;
    }
    for (const type of componentCatalog.keys()) {
      if (text.includes(type) || text.includes(type.replace(/-/g, " ")))
        return type;
    }
    return null;
  };

  const targetType = findTargetType();
  if (!targetType) return null;

  const baseline = (
    lastAction?.components?.length
      ? lastAction.components
      : currentState.components
  ).map((c) => ({ type: c.type }));
  const retained = baseline.filter((c) => c.type !== targetType);
  const updated = [...retained];
  for (let i = 0; i < desiredCount; i++) {
    updated.push({ type: targetType });
  }

  // Guarantee power and return path
  if (!updated.some((c) => c.type === "battery")) {
    updated.unshift({ type: "battery" });
  }
  if (!updated.some((c) => c.type === "ground")) {
    updated.push({ type: "ground" });
  }

  const connections = generateSeriesConnections(updated);
  const plural = desiredCount === 1 ? "" : "s";
  return {
    type: "build_circuit",
    mode: "replace",
    components: updated,
    connections,
    message: `Updated circuit to include ${desiredCount} ${targetType}${plural} while keeping the rest of the design.`,
  };
}

function wordToNumber(word: string): number | null {
  const normalized = word.toLowerCase();
  if (/^\d+$/.test(normalized)) return Number.parseInt(normalized, 10);
  const map: Record<string, number> = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
  };
  return map[normalized] ?? null;
}

// Local intent-based circuit builder: intelligently parses detailed requirements
function buildCircuitFromIntent(userMessage: string): CircuitAction | null {
  const text = (userMessage || "").toLowerCase();

  const create = (
    components: Array<{ type: string }>,
    connections: Array<{ from: number; to: number; label?: string }>,
    message: string,
  ): CircuitAction => ({
    type: "build_circuit",
    mode: "replace",
    components,
    connections,
    message,
  });

  // COMPLEX CIRCUIT DETECTION: Industrial, multi-component systems
  // Match: industrial motor, battery-powered control, monitoring circuit, pressure sensors, etc.
  if (
    (text.includes("industrial") || text.includes("production") || text.includes("automated")) &&
    (text.includes("motor") || text.includes("control") || text.includes("monitoring")) &&
    (text.includes("h-bridge") || text.includes("motor driver") || text.includes("motor control"))
  ) {
    // Extract quantities from text
    const motorMatch = text.match(/(\d+|four|2)\s*(dc\s*)?motors?/);
    const motorCount = motorMatch ? (motorMatch[1] === "four" || motorMatch[1] === "4" ? 4 : parseInt(motorMatch[1]) || 4) : 4;
    
    const hbridgeMatch = text.match(/(\d+|two|2)\s*h-?bridges?/);
    const hbridgeCount = hbridgeMatch ? (hbridgeMatch[1] === "two" || hbridgeMatch[1] === "2" ? 2 : parseInt(hbridgeMatch[1]) || 2) : 2;
    
    const hasLEDs = text.includes("led") || text.includes("indicator") || text.includes("status");
    const ledCount = hasLEDs ? 6 : 0; // Power, motor group 1, motor group 2, pressure 1, pressure 2, fault
    
    const hasPressureSensors = text.includes("pressure sensor") || text.includes("pressure") || text.includes("load");
    const pressureCount = hasPressureSensors ? 2 : 0;
    
    const hasBuzzers = text.includes("buzzer") || text.includes("audible") || text.includes("alert") || text.includes("alarm");
    const buzzerCount = hasBuzzers ? 2 : 0;
    
    const hasFlybackDiodes = text.includes("diode") || text.includes("flyback") || text.includes("protection");
    const diodeCount = hasFlybackDiodes ? motorCount : 0;
    
    const hasBuckConverter = text.includes("buck") || text.includes("regulator") || text.includes("low-voltage");

    // Build comprehensive component list
    const components: Array<{ type: string }> = [];
    let compIndex = 0;
    
    components.push({ type: "battery" }); // 0
    compIndex++;
    
    if (hasBuckConverter) {
      components.push({ type: "buck-converter" }); // 1
      compIndex++;
    }
    
    // H-bridges
    const hbridgeStart = compIndex;
    for (let i = 0; i < hbridgeCount; i++) {
      components.push({ type: "h-bridge" });
      compIndex++;
    }
    
    // Motors
    const motorStart = compIndex;
    for (let i = 0; i < motorCount; i++) {
      components.push({ type: "motor" });
      compIndex++;
    }
    
    // Pressure sensors
    const pressureStart = compIndex;
    for (let i = 0; i < pressureCount; i++) {
      components.push({ type: "pressure-sensor" });
      compIndex++;
    }
    
    // LEDs and resistors for indicators
    const ledStart = compIndex;
    for (let i = 0; i < ledCount; i++) {
      components.push({ type: "led" });
      components.push({ type: "resistor" });
      compIndex += 2;
    }
    
    // Buzzers and resistors
    const buzzerStart = compIndex;
    for (let i = 0; i < buzzerCount; i++) {
      components.push({ type: "buzzer" });
      components.push({ type: "resistor" });
      compIndex += 2;
    }
    
    // Flyback diodes
    const diodeStart = compIndex;
    for (let i = 0; i < diodeCount; i++) {
      components.push({ type: "diode" });
      compIndex++;
    }
    
    // Ground
    const groundIndex = compIndex;
    components.push({ type: "ground" });

    // Build realistic connections
    const connections: Array<{ from: number; to: number }> = [];
    const batteryIdx = 0;
    const buckConverterIdx = hasBuckConverter ? 1 : -1;
    const powerRailSource = hasBuckConverter ? buckConverterIdx : batteryIdx;

    // Battery to buck converter (if present)
    if (hasBuckConverter) {
      connections.push({ from: batteryIdx, to: buckConverterIdx });
    }

    // Power distribution to H-bridges
    for (let i = 0; i < hbridgeCount; i++) {
      connections.push({ from: powerRailSource, to: hbridgeStart + i });
    }

    // Power distribution to pressure sensors (via buck converter if present)
    for (let i = 0; i < pressureCount; i++) {
      connections.push({ from: powerRailSource, to: pressureStart + i });
    }

    // Power distribution to buzzers
    for (let i = 0; i < buzzerCount; i++) {
      connections.push({ from: powerRailSource, to: buzzerStart + i * 2 });
    }

    // H-bridges to motors (each H-bridge controls motorCount/hbridgeCount motors)
    const motorsPerBridge = Math.ceil(motorCount / hbridgeCount);
    let diodeUsed = 0;
    for (let i = 0; i < hbridgeCount; i++) {
      for (let j = 0; j < motorsPerBridge && i * motorsPerBridge + j < motorCount; j++) {
        const motorIdx = motorStart + i * motorsPerBridge + j;
        connections.push({ from: hbridgeStart + i, to: motorIdx });
        
        // Add flyback diode in parallel with motor (H-bridge output → Diode → Ground)
        // IMPORTANT: Only use diodes that exist in the array
        if (diodeUsed < diodeCount) {
          const diodeIdx = diodeStart + diodeUsed;
          connections.push({ from: hbridgeStart + i, to: diodeIdx });
          connections.push({ from: diodeIdx, to: groundIndex });
          diodeUsed++;
        }
      }
    }

    // Connect motors to ground (complete motor circuit)
    for (let i = 0; i < motorCount; i++) {
      connections.push({ from: motorStart + i, to: groundIndex });
    }

    // Pressure sensors to indicators (optional signal routing)
    for (let i = 0; i < pressureCount; i++) {
      const ledPairStart = ledStart + i * 2;
      connections.push({ from: pressureStart + i, to: ledPairStart });
    }

    // LED indicators with resistors
    for (let i = 0; i < ledCount; i++) {
      const ledIdx = ledStart + i * 2;
      const resistorIdx = ledIdx + 1;
      connections.push({ from: powerRailSource, to: resistorIdx });
      connections.push({ from: resistorIdx, to: ledIdx });
      connections.push({ from: ledIdx, to: groundIndex });
    }

    // Buzzers with resistors
    for (let i = 0; i < buzzerCount; i++) {
      const buzzerIdx = buzzerStart + i * 2;
      const resistorIdx = buzzerIdx + 1;
      connections.push({ from: buzzerIdx, to: resistorIdx });
      connections.push({ from: resistorIdx, to: groundIndex });
    }

    // Connect any remaining unused diodes (if any) as protection/snubber elements
    while (diodeUsed < diodeCount) {
      const diodeIdx = diodeStart + diodeUsed;
      // Connect unused diodes between power rail and ground for protection
      connections.push({ from: powerRailSource, to: diodeIdx });
      connections.push({ from: diodeIdx, to: groundIndex });
      diodeUsed++;
    }

    // All H-bridges, motors, and sensors to ground (redundant but ensures solid connections)
    for (let i = 0; i < hbridgeCount; i++) {
      connections.push({ from: hbridgeStart + i, to: groundIndex });
    }
    for (let i = 0; i < motorCount; i++) {
      connections.push({ from: motorStart + i, to: groundIndex });
    }
    for (let i = 0; i < pressureCount; i++) {
      connections.push({ from: pressureStart + i, to: groundIndex });
    }

    // Ground back to battery (complete circuit)
    connections.push({ from: groundIndex, to: batteryIdx });

    const message = `Industrial motor control circuit with ${motorCount} DC motors, ${hbridgeCount} H-bridge drivers, ${ledCount} status LEDs, ${pressureCount} pressure sensors, ${buzzerCount} buzzers, and protective flyback diodes. ${hasBuckConverter ? "Buck converter provides regulated 5V control rail. " : ""}All components share common ground with realistic production-style wiring.`;

    return create(components, connections, message);
  }

  // STANDARD LED CIRCUIT
  if (text.includes("led") || text.includes("light") || text.includes("lamp")) {
    const ledMatch = text.match(/(\d+|two|three|four|five)\s*leds?/);
    const ledCount = ledMatch ? (["two", "2"].includes(ledMatch[1]) ? 2 : ["three", "3"].includes(ledMatch[1]) ? 3 : ["four", "4"].includes(ledMatch[1]) ? 4 : ["five", "5"].includes(ledMatch[1]) ? 5 : 1) : 1;
    
    const components: Array<{ type: string }> = [{ type: "battery" }];
    for (let i = 0; i < ledCount; i++) {
      components.push({ type: "resistor" }, { type: "led" });
    }
    components.push({ type: "ground" });

    const connections: Array<{ from: number; to: number }> = [];
    for (let i = 0; i < ledCount; i++) {
      const resistorIdx = 1 + i * 2;
      const ledIdx = 1 + i * 2 + 1;
      connections.push({ from: 0, to: resistorIdx });
      connections.push({ from: resistorIdx, to: ledIdx });
      connections.push({ from: ledIdx, to: components.length - 1 });
    }
    connections.push({ from: components.length - 1, to: 0 });

    return create(components, connections, `Built a protected ${ledCount} LED circuit${ledCount > 1 ? "s with parallel branches" : ""}: Battery → Resistor(s) → LED(s) → Ground.`);
  }

  // MULTI-MOTOR CIRCUITS
  if ((text.includes("motor") || text.includes("actuator")) && (text.includes("4") || text.includes("four") || text.includes("multiple"))) {
    const motorMatch = text.match(/(\d+|four|six|eight)\s*(dc\s*)?motors?/);
    const motorCount = motorMatch ? (["four", "4"].includes(motorMatch[1]) ? 4 : ["six", "6"].includes(motorMatch[1]) ? 6 : ["eight", "8"].includes(motorMatch[1]) ? 8 : 2) : 4;
    
    const hbridgeCount = Math.max(2, Math.ceil(motorCount / 2));

    const components: Array<{ type: string }> = [{ type: "battery" }];
    for (let i = 0; i < hbridgeCount; i++) {
      components.push({ type: "h-bridge" });
    }
    for (let i = 0; i < motorCount; i++) {
      components.push({ type: "motor" });
    }
    for (let i = 0; i < motorCount; i++) {
      components.push({ type: "diode" });
    }
    components.push({ type: "ground" });

    const connections: Array<{ from: number; to: number }> = [];
    const hbridgeStart = 1;
    const motorStart = hbridgeStart + hbridgeCount;
    const diodeStart = motorStart + motorCount;
    const groundIdx = components.length - 1;

    // Battery to H-bridges
    for (let i = 0; i < hbridgeCount; i++) {
      connections.push({ from: 0, to: hbridgeStart + i });
    }

    // H-bridges to motors and flyback diodes (diodes in parallel with motors)
    for (let i = 0; i < motorCount; i++) {
      const bridgeIdx = hbridgeStart + Math.floor(i / 2);
      const diodeIdx = diodeStart + i;
      
      // Motor connection
      connections.push({ from: bridgeIdx, to: motorStart + i });
      connections.push({ from: motorStart + i, to: groundIdx });
      
      // Flyback diode in parallel (H-bridge → Diode → Ground)
      connections.push({ from: bridgeIdx, to: diodeIdx });
      connections.push({ from: diodeIdx, to: groundIdx });
    }

    // Everything to ground
    for (let i = 0; i < hbridgeCount; i++) {
      connections.push({ from: hbridgeStart + i, to: groundIdx });
    }

    connections.push({ from: groundIdx, to: 0 });

    return create(components, connections, `Built a ${motorCount}-motor circuit with ${hbridgeCount} H-bridge drivers and flyback protection. Each H-bridge controls 1-2 motors with bidirectional control.`);
  }

  // MOTOR WITH SWITCH + FLYBACK
  if (text.includes("motor")) {
    const comps = [
      { type: "battery" },
      { type: "switch" },
      { type: "motor" },
      { type: "diode" },
      { type: "ground" },
    ];
    const conns = [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 0 },
    ];
    return create(
      comps,
      conns,
      "Built a motor control circuit with flyback diode: Battery → Switch → Motor → Diode → Ground.",
    );
  }

  // Measurement: measure voltage across a resistor
  if (text.includes("measure") && text.includes("voltage")) {
    const comps = [
      { type: "battery" },
      { type: "resistor" },
      { type: "voltmeter" },
      { type: "ground" },
    ];
    const conns = [
      { from: 0, to: 1 },
      { from: 1, to: 3 },
      { from: 0, to: 2 },
      { from: 2, to: 3 },
    ];
    return create(
      comps,
      conns,
      "Setup: Battery → Resistor with voltmeter across it and ground reference.",
    );
  }

  // Logic AND gate example with two inputs and LED output
  if (
    text.includes("and gate") ||
    (text.includes("and") && text.includes("gate"))
  ) {
    const comps = [
      { type: "battery" },
      { type: "switch" },
      { type: "switch" },
      { type: "and-gate" },
      { type: "resistor" },
      { type: "led" },
      { type: "ground" },
    ];
    const conns = [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 5, to: 6 },
      { from: 6, to: 0 },
    ];
    return create(
      comps,
      conns,
      "Built a 2-input AND gate with LED output; both switches must be ON to light the LED.",
    );
  }

  // Op-amp amplifier template (non-inverting)
  if (
    text.includes("op-amp") ||
    text.includes("opamp") ||
    text.includes("operational amplifier")
  ) {
    const comps = [
      { type: "battery" },
      { type: "resistor" },
      { type: "capacitor" },
      { type: "opamp" },
      { type: "resistor" },
      { type: "capacitor" },
      { type: "ground" },
    ];
    const conns = [
      { from: 0, to: 1 },
      { from: 1, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 6 },
      { from: 3, to: 1 },
      { from: 2, to: 6 },
      { from: 5, to: 6 },
      { from: 6, to: 0 },
    ];
    return create(
      comps,
      conns,
      "Built a simple op-amp amplifier stage with feedback and decoupling capacitors.",
    );
  }

  // OR/NOT/NAND/NOR/XOR templates map to LED outputs
  const gateMap: Array<{
    key: string;
    type: "or-gate" | "not-gate" | "nand-gate" | "nor-gate" | "xor-gate";
    label: string;
  }> = [
    { key: "or gate", type: "or-gate", label: "OR" },
    { key: "not gate", type: "not-gate", label: "NOT" },
    { key: "nand gate", type: "nand-gate", label: "NAND" },
    { key: "nor gate", type: "nor-gate", label: "NOR" },
    { key: "xor gate", type: "xor-gate", label: "XOR" },
  ];
  for (const g of gateMap) {
    if (text.includes(g.key)) {
      const comps = [
        { type: "battery" },
        { type: "switch" },
        { type: "switch" },
        { type: g.type },
        { type: "resistor" },
        { type: "led" },
        { type: "ground" },
      ];
      const conns = [
        { from: 0, to: 1 },
        { from: 0, to: 2 },
        { from: 1, to: 3 },
        { from: 2, to: 3 },
        { from: 3, to: 4 },
        { from: 4, to: 5 },
        { from: 5, to: 6 },
        { from: 6, to: 0 },
      ];
      return create(
        comps,
        conns,
        `Built a 2-input ${g.label} gate driving an LED through a resistor.`,
      );
    }
  }

  // Buzzer circuit
  if (text.includes("buzzer")) {
    const comps = [
      { type: "battery" },
      { type: "resistor" },
      { type: "buzzer" },
      { type: "ground" },
    ];
    const conns = [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 0 },
    ];
    return create(
      comps,
      conns,
      "Built a buzzer circuit with current limiting resistor.",
    );
  }

  // Stepper motor driver
  if (text.includes("stepper")) {
    const comps = [
      { type: "battery" },
      { type: "microcontroller" },
      { type: "stepper-driver" },
      { type: "stepper-motor" },
      { type: "ground" },
    ];
    const conns = [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 0 },
    ];
    return create(
      comps,
      conns,
      "Built a stepper motor control circuit: Battery → Microcontroller → Stepper Driver → Stepper Motor.",
    );
  }

  // Servo motor
  if (text.includes("servo")) {
    const comps = [
      { type: "battery" },
      { type: "microcontroller" },
      { type: "servo-motor" },
      { type: "ground" },
    ];
    const conns = [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 0 },
    ];
    return create(
      comps,
      conns,
      "Built a servo motor control circuit: Battery → Microcontroller (PWM signal) → Servo Motor.",
    );
  }

  // If intent not detected, return null to let caller use explanation
  return null;
}

// Fetch a concise, hover-friendly explanation for a component using Gemini
export async function fetchComponentInsight(
  component: CircuitComponent,
  context?: string,
): Promise<string> {
  const cacheKey = context ? `${component.type}|${context}` : component.type;
  const cached = insightCache.get(cacheKey);
  if (cached) return cached;

  const fallbackContext = context && context.length > 0 ? `\n**This circuit:** ${context}` : '';
  const fallback = `**Purpose:** ${component.description}\n**Where it fits:** A fundamental part of basic circuits.${fallbackContext}\n**Connection tips:** Wire following its symbol; respect polarity if present.`;

  if (!OPENROUTER_API_KEY) {
    return fallback;
  }

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "Amperon",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        temperature: 0.35,
        max_tokens: 220,
        messages: [
          { role: "system", content: INSIGHT_SYSTEM_PROMPT },
          {
            role: "user",
            content: `Component: ${component.name}\nCategory: ${component.category}\nSymbol: ${component.symbol}\nDescription: ${component.description}\nConnections: ${component.connections}\nCircuit context: ${context || 'No other components connected yet.'}\nExplain its role and how it links to neighbors. Keep it hover-friendly in <70 words.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter insight error:", response.status, errorText);
      throw new Error(`Insight request failed: ${response.status}`);
    }

    const data = await response.json();
    let content: string | undefined = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No insight content returned");
    }

    content = content.trim();
    if (content.startsWith("```")) {
      content = content
        .replace(/^```[a-zA-Z]*\n?/, "")
        .replace(/```$/, "")
        .trim();
    }

    const finalContent = content.length > 0 ? content : fallback;
    insightCache.set(cacheKey, finalContent);
    return finalContent;
  } catch (error) {
    console.error("AI insight error:", error);
    return fallback;
  }
}

// Batch-fetch insights for multiple component types in one Gemini call
async function fetchComponentInsightsBatch(
  componentTypes: string[],
): Promise<Record<string, string>> {
  const uniqueTypes = Array.from(new Set(componentTypes));
  if (uniqueTypes.length === 0) return {};

  const resolved = uniqueTypes
    .map((type) => componentCatalog.get(type))
    .filter((c): c is CircuitComponent => Boolean(c));

  const cached: Record<string, string> = {};
  const missing: CircuitComponent[] = [];

  resolved.forEach((c) => {
    const fromCache = insightCache.get(c.type);
    if (fromCache) {
      cached[c.type] = fromCache;
    } else {
      missing.push(c);
    }
  });

  if (missing.length === 0) {
    return cached;
  }

  const fallbackText = (comp: CircuitComponent) =>
    `**Purpose:** ${comp.description}\n**Where it fits:** A fundamental part of basic circuits.\n**Connection tips:** Wire following its symbol; respect polarity if present.`;

  if (!OPENROUTER_API_KEY) {
    missing.forEach((comp) => {
      const text = fallbackText(comp);
      insightCache.set(comp.type, text);
      cached[comp.type] = text;
    });
    return cached;
  }

  const list = missing
    .map(
      (c) =>
        `- ${c.type}: ${c.name} — ${c.description} (category: ${c.category}, connections: ${c.connections})`,
    )
    .join("\n");

  const prompt = `Return valid JSON mapping component type to a short hover tooltip. Each value MUST be exactly three lines with bold labels: **Purpose:**, **Where it fits:**, **Connection tips:**. Keep it friendly and under 45 words per component. Components:\n${list}`;

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "Amperon",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        temperature: 0.35,
        max_tokens: 256,
        messages: [
          {
            role: "system",
            content: "You write concise component tooltips as JSON.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "OpenRouter batch insight error:",
        response.status,
        errorText,
      );
      throw new Error(`Batch insight request failed: ${response.status}`);
    }

    const data = await response.json();
    let content: string | undefined = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("No batch insight content returned");

    content = content.trim();
    if (content.startsWith("```")) {
      content = content
        .replace(/^```[a-zA-Z]*\n?/, "")
        .replace(/```$/, "")
        .trim();
    }

    const parsed = JSON.parse(content) as Record<string, string>;

    Object.entries(parsed).forEach(([type, text]) => {
      const finalText = (text || "").trim();
      if (finalText.length > 0) {
        insightCache.set(type, finalText);
        cached[type] = finalText;
      }
    });

    // Fill any remaining missing with fallback
    missing.forEach((comp) => {
      if (!cached[comp.type]) {
        const text = fallbackText(comp);
        insightCache.set(comp.type, text);
        cached[comp.type] = text;
      }
    });

    return cached;
  } catch (error) {
    console.error("Batch insight fetch failed, using fallback:", error);
    missing.forEach((comp) => {
      const text = fallbackText(comp);
      insightCache.set(comp.type, text);
      cached[comp.type] = text;
    });
    return cached;
  }
}
