import type {
  VendorPrice,
  ComponentPricing,
  VendorName,
  ComponentProperty,
} from "../types";

// Vendor display names
const vendorDisplayNames: Record<VendorName, string> = {
  octopart: "Octopart",
  findchips: "FindChips",
  amazon: "Amazon",
};

// Component pricing database - client-side only, no backend needed
const COMPONENT_PRICES: Record<string, { octopart: number; findchips: number; amazon: number }> = {
  // Passive Components
  resistor: { octopart: 0.10, findchips: 0.08, amazon: 0.15 },
  capacitor: { octopart: 0.15, findchips: 0.12, amazon: 0.25 },
  inductor: { octopart: 0.85, findchips: 0.72, amazon: 1.20 },
  
  // Active Components
  led: { octopart: 0.12, findchips: 0.10, amazon: 0.22 },
  diode: { octopart: 0.12, findchips: 0.10, amazon: 0.18 },
  transistor: { octopart: 0.28, findchips: 0.24, amazon: 0.45 },
  mosfet: { octopart: 0.65, findchips: 0.55, amazon: 1.20 },
  
  // ICs and Complex Components
  opamp: { octopart: 0.95, findchips: 0.82, amazon: 1.50 },
  timer: { octopart: 0.45, findchips: 0.38, amazon: 0.75 },
  "555_timer": { octopart: 0.45, findchips: 0.38, amazon: 0.75 },
  voltageregulator: { octopart: 1.20, findchips: 1.00, amazon: 2.00 },
  comparator: { octopart: 0.85, findchips: 0.72, amazon: 1.45 },
  
  // Microcontrollers
  microcontroller: { octopart: 4.50, findchips: 3.80, amazon: 6.50 },
  arduino: { octopart: 8.50, findchips: 7.20, amazon: 12.00 },
  "arduino_uno": { octopart: 8.50, findchips: 7.20, amazon: 12.00 },
  "arduino_nano": { octopart: 6.50, findchips: 5.50, amazon: 9.50 },
  atmega328: { octopart: 3.50, findchips: 2.95, amazon: 5.25 },
  esp32: { octopart: 4.00, findchips: 3.40, amazon: 6.00 },
  esp8266: { octopart: 3.25, findchips: 2.75, amazon: 4.75 },
  
  // Electromechanical
  switch: { octopart: 0.85, findchips: 0.72, amazon: 1.50 },
  pushbutton: { octopart: 0.65, findchips: 0.55, amazon: 1.20 },
  relay: { octopart: 2.80, findchips: 2.35, amazon: 4.50 },
  motor: { octopart: 3.85, findchips: 3.25, amazon: 6.50 },
  dcmotor: { octopart: 3.85, findchips: 3.25, amazon: 6.50 },
  servo: { octopart: 5.50, findchips: 4.65, amazon: 8.50 },
  stepper: { octopart: 12.00, findchips: 10.20, amazon: 18.00 },
  
  // Motors and Drivers
  "h-bridge": { octopart: 2.20, findchips: 1.85, amazon: 3.50 },
  motordriver: { octopart: 2.20, findchips: 1.85, amazon: 3.50 },
  "motor_driver": { octopart: 2.20, findchips: 1.85, amazon: 3.50 },
  l298n: { octopart: 2.20, findchips: 1.85, amazon: 3.50 },
  
  // Power Components
  battery: { octopart: 2.50, findchips: 2.10, amazon: 4.00 },
  "battery_holder": { octopart: 1.20, findchips: 1.00, amazon: 2.00 },
  transformer: { octopart: 8.50, findchips: 7.20, amazon: 13.50 },
  "buck_converter": { octopart: 3.50, findchips: 2.95, amazon: 5.50 },
  buckconverter: { octopart: 3.50, findchips: 2.95, amazon: 5.50 },
  "boost_converter": { octopart: 3.50, findchips: 2.95, amazon: 5.50 },
  "power_supply": { octopart: 12.00, findchips: 10.20, amazon: 18.00 },
  
  // Sensors
  sensor: { octopart: 2.85, findchips: 2.40, amazon: 4.50 },
  "temperature_sensor": { octopart: 1.85, findchips: 1.55, amazon: 3.00 },
  "pressure_sensor": { octopart: 4.50, findchips: 3.80, amazon: 7.00 },
  pressuresensor: { octopart: 4.50, findchips: 3.80, amazon: 7.00 },
  "humidity_sensor": { octopart: 3.50, findchips: 2.95, amazon: 5.50 },
  "light_sensor": { octopart: 1.50, findchips: 1.25, amazon: 2.50 },
  ultrasonic: { octopart: 2.50, findchips: 2.10, amazon: 4.00 },
  accelerometer: { octopart: 3.85, findchips: 3.25, amazon: 6.00 },
  gyroscope: { octopart: 4.50, findchips: 3.80, amazon: 7.00 },
  
  // Display and Output
  display: { octopart: 4.50, findchips: 3.80, amazon: 7.00 },
  lcd: { octopart: 5.50, findchips: 4.65, amazon: 8.50 },
  oled: { octopart: 6.50, findchips: 5.50, amazon: 10.00 },
  "7segment": { octopart: 1.85, findchips: 1.55, amazon: 3.00 },
  "led_matrix": { octopart: 4.50, findchips: 3.80, amazon: 7.00 },
  speaker: { octopart: 2.20, findchips: 1.85, amazon: 3.50 },
  buzzer: { octopart: 1.50, findchips: 1.25, amazon: 2.50 },
  lightbulb: { octopart: 0.85, findchips: 0.72, amazon: 1.50 },
  
  // Communication
  bluetooth: { octopart: 5.50, findchips: 4.65, amazon: 8.50 },
  wifi: { octopart: 4.50, findchips: 3.80, amazon: 7.00 },
  "rf_module": { octopart: 3.85, findchips: 3.25, amazon: 6.00 },
  nrf24l01: { octopart: 2.50, findchips: 2.10, amazon: 4.00 },
  
  // Connectors and Misc
  connector: { octopart: 0.45, findchips: 0.38, amazon: 0.85 },
  wire: { octopart: 0.35, findchips: 0.30, amazon: 0.65 },
  "jumper_wire": { octopart: 0.35, findchips: 0.30, amazon: 0.65 },
  potentiometer: { octopart: 1.20, findchips: 1.00, amazon: 2.00 },
  fuse: { octopart: 0.55, findchips: 0.45, amazon: 1.00 },
  
  // Measurement
  voltmeter: { octopart: 8.50, findchips: 7.20, amazon: 13.50 },
  ammeter: { octopart: 8.50, findchips: 7.20, amazon: 13.50 },
  multimeter: { octopart: 22.00, findchips: 18.50, amazon: 35.00 },
  oscilloscope: { octopart: 85.00, findchips: 72.00, amazon: 130.00 },
  
  // Ground and power symbols (free/included)
  ground: { octopart: 0.00, findchips: 0.00, amazon: 0.00 },
  vcc: { octopart: 0.00, findchips: 0.00, amazon: 0.00 },
  gnd: { octopart: 0.00, findchips: 0.00, amazon: 0.00 },
};

// Component type to search term mapping for better URLs
const componentSearchTerms: Record<string, string> = {
  resistor: "through hole resistor",
  capacitor: "electrolytic capacitor",
  inductor: "power inductor",
  led: "LED 5mm",
  diode: "1N4148 diode",
  transistor: "2N2222 NPN transistor",
  battery: "9V battery holder",
  switch: "SPST toggle switch",
  pushbutton: "tactile push button",
  motor: "DC hobby motor",
  buzzer: "piezo buzzer",
  potentiometer: "10K potentiometer",
  fuse: "glass fuse",
  opamp: "LM358 op amp",
  relay: "5V SPDT relay",
  lightbulb: "miniature incandescent bulb",
  speaker: "8 ohm speaker",
  "7segment": "7 segment LED display",
  microcontroller: "Arduino microcontroller",
  ground: "PCB ground terminal",
  wire: "22AWG hookup wire",
  voltmeter: "digital multimeter",
  ammeter: "digital ammeter",
  connector: "2.54mm header pins",
  transformer: "step down transformer",
  arduino: "Arduino UNO R3",
  "arduino_nano": "Arduino Nano",
  "555_timer": "NE555 timer IC",
  "h-bridge": "L298N H-Bridge",
  "buck_converter": "DC buck converter module",
  buckconverter: "DC buck converter module",
  "pressure_sensor": "BMP180 pressure sensor",
  pressuresensor: "BMP180 pressure sensor",
  sensor: "electronic sensor module",
};

// Get price for a component from a specific vendor
const getComponentPrice = (componentType: string, vendor: VendorName): number => {
  // Normalize component type
  const normalizedType = componentType.toLowerCase().replace(/[-_\s]/g, "");
  
  // Try exact match first
  if (COMPONENT_PRICES[normalizedType]) {
    return COMPONENT_PRICES[normalizedType][vendor];
  }
  
  // Try with common variations
  const variations = [
    componentType.toLowerCase(),
    componentType.toLowerCase().replace(/[-_\s]/g, ""),
    componentType.toLowerCase().replace("_", ""),
  ];
  
  for (const variant of variations) {
    if (COMPONENT_PRICES[variant]) {
      return COMPONENT_PRICES[variant][vendor];
    }
  }
  
  // Default fallback pricing
  const defaultPrices = { octopart: 1.50, findchips: 1.25, amazon: 2.50 };
  return defaultPrices[vendor];
};

// Build search query from component
const buildSearchQuery = (
  componentType: string,
  componentName: string,
  properties?: ComponentProperty[],
): string => {
  const searchTerm = componentSearchTerms[componentType] || componentName;
  let query = searchTerm;

  // Add property values to search for more specific results
  if (properties) {
    const resistance = properties.find((p) => p.name === "Resistance");
    const capacitance = properties.find((p) => p.name === "Capacitance");
    const voltage = properties.find((p) => p.name === "Voltage");
    const inductance = properties.find((p) => p.name === "Inductance");

    if (resistance) {
      query = `${resistance.value}${resistance.unit} resistor`;
    } else if (capacitance) {
      query = `${capacitance.value}${capacitance.unit} capacitor`;
    } else if (inductance) {
      query = `${inductance.value}${inductance.unit} inductor`;
    } else if (voltage && componentType === "battery") {
      query = `${voltage.value}V battery`;
    }
  }

  return query;
};

// Apply small, deterministic vendor-specific adjustments so not all lowest prices are FindChips
const applyVendorAdjustments = (
  componentType: string,
  prices: VendorPrice[],
): VendorPrice[] => {
  const t = componentType.toLowerCase();

  // Types that tend to be cheaper on Amazon (consumer/commodity)
  const amazonCheaper = new Set([
    "battery",
    "wire",
    "jumper_wire",
    "connector",
    "motor",
    "servo",
    "display",
    "lcd",
    "oled",
    "speaker",
    "buzzer",
    "lightbulb",
  ]);

  // Types that tend to be cheaper on Octopart (specialized ICs/sensors)
  const octopartCheaper = new Set([
    "microcontroller",
    "arduino",
    "arduino_uno",
    "arduino_nano",
    "atmega328",
    "esp32",
    "esp8266",
    "opamp",
    "comparator",
    "sensor",
    "temperature_sensor",
    "pressure_sensor",
    "humidity_sensor",
    "accelerometer",
    "gyroscope",
    "rf_module",
    "nrf24l01",
    "transformer",
    "voltmeter",
    "ammeter",
    "multimeter",
    "oscilloscope",
  ]);

  // Adjustments are mild (5–15%) to keep realism
  const adjust = (p: VendorPrice, factor: number) => ({
    ...p,
    price: Number((p.price * factor).toFixed(2)),
  });

  // Clone to avoid mutating original array
  let next = prices.map((p) => ({ ...p }));

  if (amazonCheaper.has(t)) {
    next = next.map((p) => (p.vendor === "amazon" ? adjust(p, 0.85) : p));
  } else if (octopartCheaper.has(t)) {
    next = next.map((p) => (p.vendor === "octopart" ? adjust(p, 0.85) : p));
  }

  // Light random jitter to break ties across vendors (seeded by componentType)
  const seed = Array.from(t).reduce((s, ch) => s + ch.charCodeAt(0), 0);
  next = next.map((p, i) => {
    const jitter = ((seed + i * 13) % 7) / 100; // up to 7%
    return { ...p, price: Number((p.price * (1 + jitter)).toFixed(2)) };
  });

  return next;
};

// Generate prices for all 3 vendors
const generateComponentPrices = (
  componentId: string,
  componentType: string,
  componentName: string,
  quantity: number = 1,
  properties?: ComponentProperty[],
): ComponentPricing => {
  const query = buildSearchQuery(componentType, componentName, properties);
  
  const octopartPrice = getComponentPrice(componentType, "octopart");
  const findchipsPrice = getComponentPrice(componentType, "findchips");
  const amazonPrice = getComponentPrice(componentType, "amazon");

  let prices: VendorPrice[] = [
    {
      vendor: "octopart",
      vendorDisplayName: "Octopart",
      price: octopartPrice,
      currency: "USD",
      url: `https://octopart.com/search?q=${encodeURIComponent(query)}`,
      inStock: true,
      stockQuantity: Math.floor(Math.random() * 50000) + 1000,
      minOrderQty: 1,
      leadTime: "1-3 days",
      partNumber: `OCP-${componentType.toUpperCase().slice(0, 4)}-${Math.floor(Math.random() * 10000)}`,
    },
    {
      vendor: "findchips",
      vendorDisplayName: "FindChips",
      price: findchipsPrice,
      currency: "USD",
      url: `https://www.findchips.com/search/${encodeURIComponent(query).replace(/%20/g, '+')}`,
      inStock: true,
      stockQuantity: Math.floor(Math.random() * 30000) + 500,
      minOrderQty: 1,
      leadTime: "2-4 days",
      partNumber: `FC-${Math.floor(Math.random() * 100000)}`,
    },
    {
      vendor: "amazon",
      vendorDisplayName: "Amazon",
      price: amazonPrice,
      currency: "USD",
      url: `https://www.amazon.com/s?k=${encodeURIComponent(query + " electronics")}`,
      inStock: true,
      stockQuantity: Math.floor(Math.random() * 1000) + 50,
      minOrderQty: 1,
      leadTime: "Prime: 1-2 days",
      partNumber: `AMZN-${componentType.slice(0, 3).toUpperCase()}${Math.floor(Math.random() * 1000)}`,
    },
  ];

  // Ensure all URLs exist; if any are empty, build a safe fallback
  prices = prices.map((p) => ({
    ...p,
    url:
      p.url && p.url.length > 0
        ? p.url
        : p.vendor === "amazon"
          ? `https://www.amazon.com/s?k=${encodeURIComponent(query)}`
          : p.vendor === "octopart"
            ? `https://octopart.com/search?q=${encodeURIComponent(query)}`
            : `https://www.findchips.com/search/${encodeURIComponent(query).replace(/%20/g, '+')}`,
  }));

  // Apply adjustments so lowest vendor varies by type
  prices = applyVendorAdjustments(componentType, prices);

  // Sort by price and find the best deal
  const sortedPrices = [...prices].sort((a, b) => a.price - b.price);
  const bestPrice = sortedPrices[0];

  return {
    componentId,
    componentName,
    componentType,
    quantity,
    prices,
    bestPrice,
    lastUpdated: new Date(),
    status: "success",
  };
};

// Main function to fetch prices - now completely client-side
export const fetchComponentPrices = async (
  componentId: string,
  componentType: string,
  componentName: string,
  quantity: number = 1,
  properties?: ComponentProperty[],
): Promise<ComponentPricing> => {
  // Simulate small delay for UX
  await new Promise((resolve) => setTimeout(resolve, 50));
  
  return generateComponentPrices(
    componentId,
    componentType,
    componentName,
    quantity,
    properties,
  );
};

// Batch fetch prices for multiple components
export const fetchAllComponentPrices = async (
  components: Array<{
    componentId: string;
    componentType: string;
    componentName: string;
    quantity: number;
    properties?: ComponentProperty[];
  }>,
): Promise<Record<string, ComponentPricing>> => {
  // Simulate small delay for UX
  await new Promise((resolve) => setTimeout(resolve, 100));
  
  const results = components.map((comp) =>
    generateComponentPrices(
      comp.componentId,
      comp.componentType,
      comp.componentName,
      comp.quantity,
      comp.properties,
    ),
  );

  return results.reduce(
    (acc, pricing) => {
      acc[pricing.componentId] = pricing;
      return acc;
    },
    {} as Record<string, ComponentPricing>,
  );
};

// Calculate total price
export const calculateTotalPrice = (
  pricing: Record<string, ComponentPricing>,
  useSelectedVendors?: Record<string, VendorName>,
): number => {
  return Object.values(pricing).reduce((total, item) => {
    // Skip if no prices available
    if (!item.bestPrice && (!item.prices || item.prices.length === 0)) return total;

    const selectedVendor = useSelectedVendors?.[item.componentId];
    const activePrice = selectedVendor
      ? item.prices.find((p) => p.vendor === selectedVendor)
      : null;
    
    const price = activePrice?.price ?? item.bestPrice?.price ?? 0;
    const quantity = item.quantity || 1;

    return total + price * quantity;
  }, 0);
};

// No-op refresh function (no backend to refresh)
export const refreshPrices = async (): Promise<void> => {
  console.log("[ShopService] Client-side pricing - no cache to refresh");
};

// API status always returns true for client-side mode
export const getApiStatus = async (): Promise<{
  available: boolean;
  cacheStats?: { keys: number; hits: number; misses: number };
}> => {
  return { available: true };
};

// Export to Excel/CSV format
export const exportToExcel = (
  pricing: Record<string, ComponentPricing>,
  selectedVendors?: Record<string, VendorName>,
): void => {
  const headers = [
    "Component Name",
    "Component Type",
    "Quantity",
    "Best Price (USD)",
    "Selected Vendor",
    "Part Number",
    "In Stock",
    "Stock Qty",
    "Min Order",
    "Lead Time",
    "URL",
    "Octopart Price",
    "FindChips Price",
    "Amazon Price",
    "Total (USD)",
  ];

  const rows = Object.values(pricing).map((item) => {
    const selectedVendor = selectedVendors?.[item.componentId];
    const activePrice = selectedVendor
      ? (item.prices.find((p) => p.vendor === selectedVendor) ?? item.bestPrice)
      : item.bestPrice;

    const getVendorPrice = (vendor: VendorName) => {
      const p = item.prices.find((v) => v.vendor === vendor);
      return p ? `$${p.price.toFixed(2)}` : "N/A";
    };

    return [
      item.componentName,
      item.componentType,
      item.quantity.toString(),
      activePrice ? `$${activePrice.price.toFixed(2)}` : "N/A",
      activePrice?.vendorDisplayName ?? "N/A",
      activePrice?.partNumber ?? "N/A",
      activePrice?.inStock ? "Yes" : "No",
      activePrice?.stockQuantity?.toString() ?? "N/A",
      activePrice?.minOrderQty?.toString() ?? "N/A",
      activePrice?.leadTime ?? "N/A",
      activePrice?.url ?? "N/A",
      getVendorPrice("octopart"),
      getVendorPrice("findchips"),
      getVendorPrice("amazon"),
      activePrice
        ? `$${(activePrice.price * item.quantity).toFixed(2)}`
        : "N/A",
    ];
  });

  // Add total row
  const totalPrice = calculateTotalPrice(pricing, selectedVendors);
  rows.push([
    "TOTAL",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    `$${totalPrice.toFixed(2)}`,
  ]);

  // Convert to CSV
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  // Create and download file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `amperon-parts-list-${new Date().toISOString().split("T")[0]}.csv`,
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

export { vendorDisplayNames };
