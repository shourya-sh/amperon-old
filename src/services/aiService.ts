// AI Service using OpenRouter API for circuit design assistance
import type { CircuitComponent } from "../types";
import { circuitComponents } from "../data/components";

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

const SYSTEM_PROMPT = `You are an expert circuit design assistant for CircuitCo, an educational circuit design application.

You help users build and understand electronic circuits. When a user asks you to build something, you MUST respond with actual component actions.

AVAILABLE COMPONENTS (use exact type names):
- battery: Power source (9V DC)
- resistor: Limits current flow (1000Ω default)
- capacitor: Stores electrical energy (100µF)
- inductor: Stores energy in magnetic field (10mH)
- opamp: Operational amplifier (LM358) for analog signal processing
- and-gate: Logic AND gate (2 inputs, 1 output)
- or-gate: Logic OR gate (2 inputs, 1 output)
- not-gate: Logic NOT gate/inverter (1 input, 1 output)
- nand-gate: Logic NAND gate (2 inputs, 1 output)
- nor-gate: Logic NOR gate (2 inputs, 1 output)
- xor-gate: Logic XOR gate (2 inputs, 1 output)
- led: Light Emitting Diode (needs resistor protection)
- diode: One-way current flow
- transistor: Electronic switch/amplifier (NPN 2N2222)
- switch: Opens/closes circuit
- lightbulb: Incandescent light (5W)
- buzzer: Produces sound
- motor: DC motor (6V)
- voltmeter: Measures voltage
- ammeter: Measures current
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
  "components": [{"type": "battery"}, {"type": "switch"}, {"type": "motor"}, {"type": "diode"}],
  "connections": [{"from": 0, "to": 1}, {"from": 1, "to": 2}, {"from": 2, "to": 3}, {"from": 3, "to": 0}],
  "message": "Motor control circuit in series: Battery → Switch → Motor → Diode → back to Battery. The diode protects against back-EMF."
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

const INSIGHT_SYSTEM_PROMPT = `You are a friendly electronics tutor for CircuitCo. Explain components for beginners in <60 words.

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
        "X-Title": "CircuitCo",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: contextMessages,
        temperature: 0.7,
        max_tokens: 1024,
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

// Helper: Generate a simple series connection across given components
function generateSeriesConnections(
  components: Array<{ type: string; properties?: Record<string, unknown> }>,
): Array<{ from: number; to: number; label?: string }> {
  if (!components || components.length === 0) return [];
  const conns: Array<{ from: number; to: number; label?: string }> = [];

  // Build series: 0->1->2->... and close loop back to 0 if more than 2 comps
  for (let i = 0; i < components.length - 1; i++) {
    conns.push({ from: i, to: i + 1 });
  }
  if (components.length > 1) {
    // Prefer closing the loop back to battery if present; else close to 0
    const batteryIndex = components.findIndex((c) => c.type === "battery");
    const closeTo = batteryIndex >= 0 ? batteryIndex : 0;
    conns.push({ from: components.length - 1, to: closeTo });
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
    "dc motor": "motor",
    motors: "motor",
    motor: "motor",
    leds: "led",
    led: "led",
    light: "led",
    lights: "led",
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

// Local intent-based circuit builder: ensures the app builds circuits even without AI
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

  // LED circuit templates
  if (text.includes("led") || text.includes("light") || text.includes("lamp")) {
    const comps = [
      { type: "battery" },
      { type: "resistor" },
      { type: "led" },
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
      "Built a protected LED circuit: Battery → Resistor → LED → Ground → back to Battery.",
    );
  }

  // Motor with switch + flyback diode
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
      { from: 0, to: 1 }, // Battery to input A switch
      { from: 0, to: 2 }, // Battery to input B switch
      { from: 1, to: 3 }, // Switch A to AND gate
      { from: 2, to: 3 }, // Switch B to AND gate
      { from: 3, to: 4 }, // Gate to resistor
      { from: 4, to: 5 }, // Resistor to LED
      { from: 5, to: 6 }, // LED to ground
      { from: 6, to: 0 }, // close loop
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
    // Basic non-inverting amplifier template with feedback from output back to input
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
      { from: 0, to: 1 }, // battery -> input resistor
      { from: 1, to: 3 }, // input resistor -> op-amp input
      { from: 3, to: 4 }, // op-amp output -> output resistor
      { from: 4, to: 6 }, // output resistor -> ground/load
      { from: 3, to: 1 }, // feedback: op-amp output -> input node (creates feedback loop)
      { from: 2, to: 6 }, // decoupling cap -> ground
      { from: 5, to: 6 }, // output cap -> ground
      { from: 6, to: 0 }, // close loop
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

  // If intent not detected, return null to let caller use explanation
  return null;
}

// Fetch a concise, hover-friendly explanation for a component using Gemini
export async function fetchComponentInsight(
  component: CircuitComponent,
): Promise<string> {
  const cached = insightCache.get(component.type);
  if (cached) return cached;

  const fallback = `**Purpose:** ${component.description}\n**Where it fits:** A fundamental part of basic circuits.\n**Connection tips:** Wire following its symbol; respect polarity if present.`;

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
        "X-Title": "CircuitCo",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        temperature: 0.35,
        max_tokens: 220,
        messages: [
          { role: "system", content: INSIGHT_SYSTEM_PROMPT },
          {
            role: "user",
            content: `Component: ${component.name}\nCategory: ${component.category}\nSymbol: ${component.symbol}\nDescription: ${component.description}\nConnections: ${component.connections}\nExplain it for a hover tooltip.`,
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
    insightCache.set(component.type, finalContent);
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
        "X-Title": "CircuitCo",
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
