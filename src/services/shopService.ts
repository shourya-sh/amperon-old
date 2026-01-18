import type {
  VendorPrice,
  ComponentPricing,
  VendorName,
  ComponentProperty,
} from "../types";

// Vendor display names
const vendorDisplayNames: Record<VendorName, string> = {
  texas_instruments: "Texas Instruments",
  octopart: "Octopart",
  findchips: "FindChips",
  amazon: "Amazon",
};

// Component type to search term mapping for better search results
const componentSearchTerms: Record<string, string[]> = {
  resistor: ["resistor", "through hole resistor", "axial resistor"],
  capacitor: ["capacitor", "electrolytic capacitor", "ceramic capacitor"],
  inductor: ["inductor", "power inductor", "choke"],
  led: ["LED", "light emitting diode", "5mm LED"],
  diode: ["diode", "1N4148", "rectifier diode"],
  transistor: ["transistor", "NPN transistor", "BJT", "2N2222"],
  battery: ["battery holder", "battery clip", "9V battery connector"],
  switch: ["toggle switch", "SPST switch", "push button switch"],
  pushbutton: ["push button", "tactile switch", "momentary switch"],
  motor: ["DC motor", "hobby motor", "small DC motor"],
  buzzer: ["piezo buzzer", "buzzer", "active buzzer"],
  potentiometer: ["potentiometer", "variable resistor", "rotary potentiometer"],
  fuse: ["fuse", "glass fuse", "blade fuse"],
  opamp: ["operational amplifier", "op amp", "LM741", "LM358"],
  relay: ["relay", "SPDT relay", "5V relay module"],
  lightbulb: ["incandescent bulb", "miniature bulb", "indicator lamp"],
  speaker: ["speaker", "small speaker", "8 ohm speaker"],
  "7segment": ["7 segment display", "seven segment", "LED display"],
  microcontroller: ["Arduino", "microcontroller", "ATmega328", "ESP32"],
  ground: ["ground terminal", "chassis ground", "PCB terminal"],
  wire: ["jumper wire", "hookup wire", "breadboard wire"],
  voltmeter: ["multimeter", "voltmeter", "DMM"],
  ammeter: ["ammeter", "current meter", "multimeter"],
  connector: ["connector", "header pins", "terminal block"],
  transformer: ["transformer", "power transformer", "step down transformer"],
};

// Build search query from component
const buildSearchQuery = (
  componentType: string,
  componentName: string,
  properties?: ComponentProperty[],
): string => {
  const searchTerms = componentSearchTerms[componentType] || [componentName];
  let query = searchTerms[0];

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

// Simulated API calls for each vendor
// In production, these would call actual APIs or a backend proxy

const fetchTexasInstrumentsPrice = async (
  _query: string,
  componentType: string,
): Promise<VendorPrice | null> => {
  // TI mainly sells ICs, so filter appropriately
  const tiComponents = [
    "opamp",
    "microcontroller",
    "transistor",
    "diode",
    "comparator",
    "ldo",
    "buck-converter",
    "boost-converter",
  ];

  if (!tiComponents.includes(componentType)) {
    return null;
  }

  // Simulate API delay
  await new Promise((resolve) =>
    setTimeout(resolve, 300 + Math.random() * 200),
  );

  // Generate realistic mock data
  const partNumbers: Record<string, string> = {
    opamp: "LM741CN",
    microcontroller: "MSP430G2553",
    transistor: "TIP31C",
    diode: "1N4148",
    comparator: "LM339N",
    ldo: "TPS7A4701",
    "buck-converter": "TPS54331",
    "boost-converter": "TPS61200",
  };

  const basePrice = 0.5 + Math.random() * 5;

  return {
    vendor: "texas_instruments",
    vendorDisplayName: "Texas Instruments",
    price: Math.round(basePrice * 100) / 100,
    currency: "USD",
    url: `https://www.ti.com/product/${partNumbers[componentType] || "LM741"}`,
    inStock: Math.random() > 0.2,
    stockQuantity: Math.floor(Math.random() * 10000) + 100,
    minOrderQty: 1,
    leadTime: Math.random() > 0.5 ? "2-3 days" : "1 week",
    partNumber: partNumbers[componentType] || "LM741CN",
  };
};

const fetchOctopartPrice = async (
  query: string,
  componentType: string,
): Promise<VendorPrice | null> => {
  // Simulate API delay
  await new Promise((resolve) =>
    setTimeout(resolve, 400 + Math.random() * 300),
  );

  // Generate price based on component type
  const basePrices: Record<string, number> = {
    resistor: 0.05,
    capacitor: 0.15,
    inductor: 0.8,
    led: 0.12,
    diode: 0.1,
    transistor: 0.25,
    switch: 0.75,
    pushbutton: 0.5,
    motor: 3.5,
    buzzer: 1.2,
    potentiometer: 0.9,
    fuse: 0.4,
    opamp: 0.85,
    relay: 2.5,
    microcontroller: 5.0,
    default: 1.0,
  };

  const basePrice = basePrices[componentType] || basePrices.default;
  const price = basePrice * (0.8 + Math.random() * 0.4);

  return {
    vendor: "octopart",
    vendorDisplayName: "Octopart",
    price: Math.round(price * 100) / 100,
    currency: "USD",
    url: `https://octopart.com/search?q=${encodeURIComponent(query)}`,
    inStock: Math.random() > 0.15,
    stockQuantity: Math.floor(Math.random() * 50000) + 500,
    minOrderQty: 1,
    leadTime: "1-3 days",
    partNumber: `OCP-${componentType.toUpperCase().slice(0, 4)}-${Math.floor(Math.random() * 1000)}`,
  };
};

const fetchFindChipsPrice = async (
  query: string,
  componentType: string,
): Promise<VendorPrice | null> => {
  // Simulate API delay
  await new Promise((resolve) =>
    setTimeout(resolve, 350 + Math.random() * 250),
  );

  // Generate competitive prices
  const basePrices: Record<string, number> = {
    resistor: 0.04,
    capacitor: 0.12,
    inductor: 0.7,
    led: 0.1,
    diode: 0.08,
    transistor: 0.22,
    switch: 0.65,
    pushbutton: 0.45,
    motor: 3.0,
    buzzer: 1.0,
    potentiometer: 0.8,
    fuse: 0.35,
    opamp: 0.75,
    relay: 2.2,
    microcontroller: 4.5,
    default: 0.9,
  };

  const basePrice = basePrices[componentType] || basePrices.default;
  const price = basePrice * (0.85 + Math.random() * 0.35);

  return {
    vendor: "findchips",
    vendorDisplayName: "FindChips",
    price: Math.round(price * 100) / 100,
    currency: "USD",
    url: `https://www.findchips.com/search/${encodeURIComponent(query)}`,
    inStock: Math.random() > 0.1,
    stockQuantity: Math.floor(Math.random() * 30000) + 200,
    minOrderQty: 10,
    leadTime: "2-5 days",
    partNumber: `FC-${Math.floor(Math.random() * 10000)}`,
  };
};

const fetchAmazonPrice = async (
  query: string,
  componentType: string,
): Promise<VendorPrice | null> => {
  // Simulate API delay
  await new Promise((resolve) =>
    setTimeout(resolve, 500 + Math.random() * 300),
  );

  // Amazon typically sells in packs/kits at higher prices
  const basePrices: Record<string, number> = {
    resistor: 0.08, // per piece in a pack
    capacitor: 0.2,
    inductor: 1.0,
    led: 0.15,
    diode: 0.12,
    transistor: 0.35,
    switch: 1.2,
    pushbutton: 0.8,
    motor: 5.0,
    buzzer: 2.0,
    potentiometer: 1.5,
    fuse: 0.6,
    opamp: 1.5,
    relay: 4.0,
    microcontroller: 8.0,
    battery: 3.0,
    wire: 0.5,
    default: 2.0,
  };

  const basePrice = basePrices[componentType] || basePrices.default;
  const price = basePrice * (0.9 + Math.random() * 0.5);

  return {
    vendor: "amazon",
    vendorDisplayName: "Amazon",
    price: Math.round(price * 100) / 100,
    currency: "USD",
    url: `https://www.amazon.com/s?k=${encodeURIComponent(query + " electronics")}`,
    inStock: Math.random() > 0.05,
    stockQuantity: Math.floor(Math.random() * 1000) + 50,
    minOrderQty: 1,
    leadTime: "Prime: 1-2 days",
    partNumber: `AMZN-${componentType.slice(0, 3).toUpperCase()}`,
  };
};

// Main function to fetch prices from all vendors
export const fetchComponentPrices = async (
  componentId: string,
  componentType: string,
  componentName: string,
  quantity: number = 1,
  properties?: ComponentProperty[],
): Promise<ComponentPricing> => {
  const searchQuery = buildSearchQuery(
    componentType,
    componentName,
    properties,
  );

  try {
    // Fetch from all vendors in parallel
    const [tiPrice, octopartPrice, findchipsPrice, amazonPrice] =
      await Promise.all([
        fetchTexasInstrumentsPrice(searchQuery, componentType).catch(
          () => null,
        ),
        fetchOctopartPrice(searchQuery, componentType).catch(() => null),
        fetchFindChipsPrice(searchQuery, componentType).catch(() => null),
        fetchAmazonPrice(searchQuery, componentType).catch(() => null),
      ]);

    // Collect all valid prices
    const prices: VendorPrice[] = [
      tiPrice,
      octopartPrice,
      findchipsPrice,
      amazonPrice,
    ].filter((p): p is VendorPrice => p !== null);

    // Find best price (lowest in-stock price)
    const inStockPrices = prices.filter((p) => p.inStock);
    const bestPrice =
      inStockPrices.length > 0
        ? inStockPrices.reduce(
            (min, p) => (p.price < min.price ? p : min),
            inStockPrices[0],
          )
        : prices.length > 0
          ? prices.reduce(
              (min, p) => (p.price < min.price ? p : min),
              prices[0],
            )
          : null;

    return {
      componentId,
      componentName,
      componentType,
      quantity,
      prices,
      bestPrice,
      lastUpdated: new Date(),
      status: prices.length > 0 ? "success" : "no_results",
    };
  } catch (error) {
    return {
      componentId,
      componentName,
      componentType,
      quantity,
      prices: [],
      bestPrice: null,
      lastUpdated: new Date(),
      status: "error",
      errorMessage:
        error instanceof Error ? error.message : "Failed to fetch prices",
    };
  }
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
  const results = await Promise.all(
    components.map((comp) =>
      fetchComponentPrices(
        comp.componentId,
        comp.componentType,
        comp.componentName,
        comp.quantity,
        comp.properties,
      ),
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
    if (item.status !== "success" || !item.bestPrice) return total;

    const selectedVendor = useSelectedVendors?.[item.componentId];
    const price = selectedVendor
      ? (item.prices.find((p) => p.vendor === selectedVendor)?.price ??
        item.bestPrice.price)
      : item.bestPrice.price;

    return total + price * item.quantity;
  }, 0);
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
    "Texas Instruments Price",
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
      getVendorPrice("texas_instruments"),
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
