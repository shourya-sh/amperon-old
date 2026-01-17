// AI Service using OpenRouter API for circuit design assistance

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface CircuitAction {
  type: 'add_component' | 'build_circuit' | 'explain' | 'none';
  mode?: 'replace' | 'merge';
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
}

const SYSTEM_PROMPT = `You are an expert circuit design assistant for CircuitCo, an educational circuit design application.

You help users build and understand electronic circuits. When a user asks you to build something, you MUST respond with actual component actions.

AVAILABLE COMPONENTS (use exact type names):
- battery: Power source (9V DC)
- resistor: Limits current flow (1000Ω default)
- capacitor: Stores electrical energy (100µF)
- inductor: Stores energy in magnetic field (10mH)
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
  "message": "Your explanation to the user"
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

IMPORTANT REMINDERS:
1. ALWAYS include the connections array - NEVER omit it
2. Use 0-based indexing for component positions
3. For complete circuits, ensure all components are connected in a logical path
4. Respond with ONLY valid JSON - no markdown, no explanation outside JSON`;

export async function sendMessageToAI(
  userMessage: string,
  options?: {
    history?: Array<{ role: 'user' | 'assistant'; content: string }>; 
    lastCircuit?: CircuitAction | null;
  }
): Promise<CircuitAction> {
  if (!OPENROUTER_API_KEY) {
    console.error('OpenRouter API key not configured');
    return {
      type: 'explain',
      message: 'AI service not configured. Please add VITE_OPENROUTER_API_KEY to your .env file.',
    };
  }

  try {
    const contextMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    if (options?.lastCircuit) {
      contextMessages.push({
        role: 'system',
        content: `Previous circuit JSON (use for modifications): ${JSON.stringify(options.lastCircuit)}`,
      });
    }

    if (options?.history && options.history.length > 0) {
      const trimmedHistory = options.history.slice(-6);
      contextMessages.push(...trimmedHistory);
    }

    contextMessages.push({ role: 'user', content: userMessage });

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'CircuitCo',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: contextMessages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No response content from AI');
    }

    console.log('Raw AI response:', content);

    // Parse the JSON response
    try {
      // Clean up the response - remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.slice(7);
      }
      if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.slice(0, -3);
      }
      cleanContent = cleanContent.trim();

      console.log('Cleaned content:', cleanContent);

      const parsed = JSON.parse(cleanContent) as CircuitAction;
      
      console.log('Parsed action:', parsed);

      // Validate the response structure
      if (!parsed.type || !parsed.message) {
        throw new Error('Invalid response structure');
      }

      // Fallback autowire: if building a circuit and connections missing, create a simple series path
      const components = parsed.components || [];
      let connections = parsed.connections || [];
      if ((parsed.type === 'build_circuit' || parsed.type === 'add_component') && (!connections || connections.length === 0)) {
        connections = generateSeriesConnections(components);
        console.log('Auto-generated connections (fallback):', connections);
      }

      const result: CircuitAction = {
        type: parsed.type || 'explain',
        mode: parsed.mode,
        components,
        connections,
        message: parsed.message,
      };
      
      console.log('Final result:', result);
      return result;
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      // If JSON parsing fails, treat it as an explanation
      return {
        type: 'explain',
        message: content,
      };
    }
  } catch (error) {
    console.error('AI service error:', error);
    return {
      type: 'explain',
      message: 'I encountered an error processing your request. Please try again.',
    };
  }
}

// Helper: Generate a simple series connection across given components
function generateSeriesConnections(components: Array<{ type: string; properties?: Record<string, unknown> }>): Array<{ from: number; to: number; label?: string }> {
  if (!components || components.length === 0) return [];
  const conns: Array<{ from: number; to: number; label?: string }> = [];

  // Build series: 0->1->2->... and close loop back to 0 if more than 2 comps
  for (let i = 0; i < components.length - 1; i++) {
    conns.push({ from: i, to: i + 1 });
  }
  if (components.length > 1) {
    // Prefer closing the loop back to battery if present; else close to 0
    const batteryIndex = components.findIndex(c => c.type === 'battery');
    const closeTo = batteryIndex >= 0 ? batteryIndex : 0;
    conns.push({ from: components.length - 1, to: closeTo });
  }

  return conns;
}
