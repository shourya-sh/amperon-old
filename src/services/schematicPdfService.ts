import { jsPDF } from "jspdf";
import type { CanvasNode, CanvasEdge } from "../types";

// Component symbol definitions for schematic view
const componentSymbols: Record<
  string,
  {
    width: number;
    height: number;
    draw: (
      pdf: jsPDF,
      x: number,
      y: number,
      label: string,
      value?: string,
    ) => void;
    pins: { dx: number; dy: number; name: string }[];
  }
> = {
  resistor: {
    width: 60,
    height: 20,
    pins: [
      { dx: -30, dy: 0, name: "1" },
      { dx: 30, dy: 0, name: "2" },
    ],
    draw: (pdf, x, y, label, value) => {
      pdf.setDrawColor(200, 0, 0);
      pdf.setLineWidth(0.5);
      // Draw resistor zigzag symbol
      pdf.line(x - 30, y, x - 20, y);
      pdf.rect(x - 20, y - 5, 40, 10);
      pdf.line(x + 20, y, x + 30, y);
      // Label
      pdf.setFontSize(8);
      pdf.setTextColor(200, 0, 0);
      pdf.text(label, x, y - 10, { align: "center" });
      if (value) {
        pdf.text(value, x, y + 15, { align: "center" });
      }
    },
  },
  led: {
    width: 40,
    height: 30,
    pins: [
      { dx: -20, dy: 0, name: "anode" },
      { dx: 20, dy: 0, name: "cathode" },
    ],
    draw: (pdf, x, y, label, value) => {
      pdf.setDrawColor(200, 0, 0);
      pdf.setLineWidth(0.5);
      // LED triangle
      pdf.line(x - 20, y, x - 8, y);
      pdf.triangle(x - 8, y - 8, x - 8, y + 8, x + 8, y);
      pdf.line(x + 8, y - 8, x + 8, y + 8);
      pdf.line(x + 8, y, x + 20, y);
      // Arrows indicating light emission
      pdf.line(x + 2, y - 12, x + 8, y - 18);
      pdf.line(x + 6, y - 10, x + 12, y - 16);
      // Label
      pdf.setFontSize(8);
      pdf.setTextColor(200, 0, 0);
      pdf.text(label, x, y + 18, { align: "center" });
      if (value) {
        pdf.text(value, x, y - 20, { align: "center" });
      }
    },
  },
  capacitor: {
    width: 30,
    height: 30,
    pins: [
      { dx: -15, dy: 0, name: "1" },
      { dx: 15, dy: 0, name: "2" },
    ],
    draw: (pdf, x, y, label, value) => {
      pdf.setDrawColor(200, 0, 0);
      pdf.setLineWidth(0.5);
      // Capacitor symbol
      pdf.line(x - 15, y, x - 3, y);
      pdf.line(x - 3, y - 10, x - 3, y + 10);
      pdf.line(x + 3, y - 10, x + 3, y + 10);
      pdf.line(x + 3, y, x + 15, y);
      // Label
      pdf.setFontSize(8);
      pdf.setTextColor(200, 0, 0);
      pdf.text(label, x, y - 15, { align: "center" });
      if (value) {
        pdf.text(value, x, y + 18, { align: "center" });
      }
    },
  },
  battery: {
    width: 30,
    height: 30,
    pins: [
      { dx: -15, dy: 0, name: "+" },
      { dx: 15, dy: 0, name: "-" },
    ],
    draw: (pdf, x, y, label, value) => {
      pdf.setDrawColor(200, 0, 0);
      pdf.setLineWidth(0.5);
      // Battery symbol
      pdf.line(x - 15, y, x - 5, y);
      pdf.line(x - 5, y - 12, x - 5, y + 12);
      pdf.setLineWidth(1);
      pdf.line(x + 2, y - 6, x + 2, y + 6);
      pdf.setLineWidth(0.5);
      pdf.line(x + 2, y, x + 15, y);
      // + and - signs
      pdf.setFontSize(8);
      pdf.text("+", x - 10, y - 8);
      pdf.text("-", x + 8, y - 8);
      // Label
      pdf.setTextColor(200, 0, 0);
      pdf.text(label, x, y + 18, { align: "center" });
      if (value) {
        pdf.text(value, x, y - 18, { align: "center" });
      }
    },
  },
  diode: {
    width: 40,
    height: 20,
    pins: [
      { dx: -20, dy: 0, name: "anode" },
      { dx: 20, dy: 0, name: "cathode" },
    ],
    draw: (pdf, x, y, label) => {
      pdf.setDrawColor(200, 0, 0);
      pdf.setLineWidth(0.5);
      // Diode symbol
      pdf.line(x - 20, y, x - 8, y);
      pdf.triangle(x - 8, y - 8, x - 8, y + 8, x + 8, y);
      pdf.line(x + 8, y - 8, x + 8, y + 8);
      pdf.line(x + 8, y, x + 20, y);
      // Label
      pdf.setFontSize(8);
      pdf.setTextColor(200, 0, 0);
      pdf.text(label, x, y - 15, { align: "center" });
    },
  },
  microcontroller: {
    width: 80,
    height: 120,
    pins: [
      { dx: -40, dy: -45, name: "VIN" },
      { dx: -40, dy: -35, name: "5V" },
      { dx: -40, dy: -25, name: "3.3V" },
      { dx: -40, dy: -15, name: "AREF" },
      { dx: -40, dy: -5, name: "IOREF" },
      { dx: -40, dy: 5, name: "RES" },
      { dx: -40, dy: 15, name: "A0" },
      { dx: -40, dy: 25, name: "A1" },
      { dx: -40, dy: 35, name: "A2" },
      { dx: -40, dy: 45, name: "A3" },
      { dx: -40, dy: 55, name: "GND" },
      { dx: 40, dy: -50, name: "RX" },
      { dx: 40, dy: -40, name: "TX" },
      { dx: 40, dy: -30, name: "D2" },
      { dx: 40, dy: -20, name: "D3" },
      { dx: 40, dy: -10, name: "D4" },
      { dx: 40, dy: 0, name: "D5" },
      { dx: 40, dy: 10, name: "D6" },
      { dx: 40, dy: 20, name: "D7" },
      { dx: 40, dy: 30, name: "D8" },
      { dx: 40, dy: 40, name: "D9" },
      { dx: 40, dy: 50, name: "D10" },
    ],
    draw: (pdf, x, y, label) => {
      pdf.setDrawColor(200, 0, 0);
      pdf.setLineWidth(0.5);
      // Main rectangle
      pdf.rect(x - 35, y - 55, 70, 110);
      // Label inside
      pdf.setFontSize(7);
      pdf.setTextColor(200, 0, 0);
      pdf.text("Arduino", x, y - 5, { align: "center" });
      pdf.text("UNO", x, y + 5, { align: "center" });
      // Component label
      pdf.setFontSize(8);
      pdf.text(label, x, y - 62, { align: "center" });
      // Pin labels on left
      pdf.setFontSize(5);
      const leftPins = [
        "VIN",
        "5V",
        "3.3V",
        "AREF",
        "IOREF",
        "RES",
        "A0",
        "A1",
        "A2",
        "A3",
        "GND",
      ];
      leftPins.forEach((pin, i) => {
        const pinY = y - 45 + i * 10;
        pdf.line(x - 40, pinY, x - 35, pinY);
        pdf.text(pin, x - 33, pinY + 1.5);
      });
      // Pin labels on right
      const rightPins = [
        "RX",
        "TX",
        "D2",
        "D3",
        "D4",
        "D5",
        "D6",
        "D7",
        "D8",
        "D9",
        "D10",
      ];
      rightPins.forEach((pin, i) => {
        const pinY = y - 50 + i * 10;
        pdf.line(x + 35, pinY, x + 40, pinY);
        pdf.text(pin, x + 25, pinY + 1.5);
      });
    },
  },
  ground: {
    width: 20,
    height: 20,
    pins: [{ dx: 0, dy: -10, name: "gnd" }],
    draw: (pdf, x, y, label) => {
      pdf.setDrawColor(200, 0, 0);
      pdf.setLineWidth(0.5);
      // Ground symbol
      pdf.line(x, y - 10, x, y);
      pdf.line(x - 10, y, x + 10, y);
      pdf.line(x - 6, y + 4, x + 6, y + 4);
      pdf.line(x - 3, y + 8, x + 3, y + 8);
      // Label
      pdf.setFontSize(8);
      pdf.setTextColor(200, 0, 0);
      pdf.text(label, x, y + 18, { align: "center" });
    },
  },
  switch: {
    width: 50,
    height: 20,
    pins: [
      { dx: -25, dy: 0, name: "1" },
      { dx: 25, dy: 0, name: "2" },
    ],
    draw: (pdf, x, y, label) => {
      pdf.setDrawColor(200, 0, 0);
      pdf.setLineWidth(0.5);
      // Switch symbol
      pdf.line(x - 25, y, x - 10, y);
      pdf.circle(x - 10, y, 2);
      pdf.line(x - 8, y - 1, x + 8, y - 8);
      pdf.circle(x + 10, y, 2);
      pdf.line(x + 10, y, x + 25, y);
      // Label
      pdf.setFontSize(8);
      pdf.setTextColor(200, 0, 0);
      pdf.text(label, x, y - 15, { align: "center" });
    },
  },
  transistor: {
    width: 40,
    height: 40,
    pins: [
      { dx: -20, dy: 0, name: "base" },
      { dx: 20, dy: -15, name: "collector" },
      { dx: 20, dy: 15, name: "emitter" },
    ],
    draw: (pdf, x, y, label) => {
      pdf.setDrawColor(200, 0, 0);
      pdf.setLineWidth(0.5);
      // Transistor symbol
      pdf.line(x - 20, y, x - 5, y);
      pdf.line(x - 5, y - 15, x - 5, y + 15);
      pdf.line(x - 5, y - 8, x + 10, y - 15);
      pdf.line(x + 10, y - 15, x + 20, y - 15);
      pdf.line(x - 5, y + 8, x + 10, y + 15);
      pdf.line(x + 10, y + 15, x + 20, y + 15);
      // Arrow for emitter
      pdf.triangle(x + 5, y + 10, x + 3, y + 14, x + 8, y + 14);
      // Label
      pdf.setFontSize(8);
      pdf.setTextColor(200, 0, 0);
      pdf.text(label, x, y - 25, { align: "center" });
    },
  },
  inductor: {
    width: 60,
    height: 20,
    pins: [
      { dx: -30, dy: 0, name: "1" },
      { dx: 30, dy: 0, name: "2" },
    ],
    draw: (pdf, x, y, label, value) => {
      pdf.setDrawColor(200, 0, 0);
      pdf.setLineWidth(0.5);
      // Inductor symbol (loops)
      pdf.line(x - 30, y, x - 20, y);
      for (let i = 0; i < 4; i++) {
        const cx = x - 15 + i * 10;
        pdf.ellipse(cx, y, 5, 5, "S");
      }
      pdf.line(x + 20, y, x + 30, y);
      // Label
      pdf.setFontSize(8);
      pdf.setTextColor(200, 0, 0);
      pdf.text(label, x, y - 12, { align: "center" });
      if (value) {
        pdf.text(value, x, y + 15, { align: "center" });
      }
    },
  },
  buzzer: {
    width: 30,
    height: 30,
    pins: [
      { dx: 0, dy: 15, name: "+" },
      { dx: 0, dy: -15, name: "-" },
    ],
    draw: (pdf, x, y, label) => {
      pdf.setDrawColor(200, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.circle(x, y, 12);
      pdf.setFontSize(6);
      pdf.text("+", x - 2, y + 5);
      // Label
      pdf.setFontSize(8);
      pdf.setTextColor(200, 0, 0);
      pdf.text(label, x, y - 18, { align: "center" });
    },
  },
  motor: {
    width: 40,
    height: 40,
    pins: [
      { dx: -20, dy: 0, name: "+" },
      { dx: 20, dy: 0, name: "-" },
    ],
    draw: (pdf, x, y, label) => {
      pdf.setDrawColor(200, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.circle(x, y, 15);
      pdf.setFontSize(10);
      pdf.text("M", x, y + 3, { align: "center" });
      pdf.line(x - 20, y, x - 15, y);
      pdf.line(x + 15, y, x + 20, y);
      // Label
      pdf.setFontSize(8);
      pdf.text(label, x, y - 22, { align: "center" });
    },
  },
  lightbulb: {
    width: 30,
    height: 30,
    pins: [
      { dx: 0, dy: -15, name: "1" },
      { dx: 0, dy: 15, name: "2" },
    ],
    draw: (pdf, x, y, label) => {
      pdf.setDrawColor(200, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.circle(x, y, 10);
      // Cross inside
      pdf.line(x - 5, y - 5, x + 5, y + 5);
      pdf.line(x - 5, y + 5, x + 5, y - 5);
      pdf.line(x, y - 15, x, y - 10);
      pdf.line(x, y + 10, x, y + 15);
      // Label
      pdf.setFontSize(8);
      pdf.setTextColor(200, 0, 0);
      pdf.text(label, x + 15, y, { align: "left" });
    },
  },
};

// Default symbol for unknown components
const defaultSymbol = {
  width: 50,
  height: 30,
  pins: [
    { dx: -25, dy: 0, name: "1" },
    { dx: 25, dy: 0, name: "2" },
  ],
  draw: (pdf: jsPDF, x: number, y: number, label: string, type?: string) => {
    pdf.setDrawColor(200, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.rect(x - 20, y - 12, 40, 24);
    pdf.setFontSize(6);
    pdf.setTextColor(200, 0, 0);
    pdf.text(type || "COMP", x, y + 2, { align: "center" });
    pdf.setFontSize(8);
    pdf.text(label, x, y - 18, { align: "center" });
    // Connection lines
    pdf.line(x - 25, y, x - 20, y);
    pdf.line(x + 20, y, x + 25, y);
  },
};

function getComponentValue(node: CanvasNode): string | undefined {
  const props = node.data.component.properties;
  if (!props || props.length === 0) return undefined;

  const valueProp = props.find(
    (p) =>
      p.name.toLowerCase() === "resistance" ||
      p.name.toLowerCase() === "capacitance" ||
      p.name.toLowerCase() === "voltage" ||
      p.name.toLowerCase() === "value",
  );

  if (valueProp) {
    return `${valueProp.value}${valueProp.unit}`;
  }
  return undefined;
}

export function generateSchematicPdf(
  nodes: CanvasNode[],
  edges: CanvasEdge[],
  projectName: string = "Untitled Circuit",
): void {
  // Create PDF in landscape A4
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 297;
  const pageHeight = 210;
  const margin = 10;
  const borderWidth = pageWidth - 2 * margin;
  const borderHeight = pageHeight - 2 * margin;

  // Draw border frame like Tinkercad
  pdf.setDrawColor(200, 0, 0); // Red color for schematic
  pdf.setLineWidth(0.5);
  pdf.rect(margin, margin, borderWidth, borderHeight);

  // Draw grid reference markers (A-E rows, 1-6 columns)
  const gridCols = 6;
  const gridRows = 5;
  const cellWidth = borderWidth / gridCols;
  const cellHeight = borderHeight / gridRows;

  // Column markers
  pdf.setFontSize(10);
  pdf.setTextColor(200, 0, 0);
  for (let i = 0; i < gridCols; i++) {
    const x = margin + cellWidth * i + cellWidth / 2;
    pdf.text(String(i + 1), x, margin + 5, { align: "center" });
    pdf.text(String(i + 1), x, pageHeight - margin - 2, { align: "center" });
    // Vertical grid lines
    if (i > 0) {
      pdf.setLineDashPattern([1, 1], 0);
      pdf.line(
        margin + cellWidth * i,
        margin,
        margin + cellWidth * i,
        pageHeight - margin,
      );
    }
  }

  // Row markers
  const rowLabels = ["A", "B", "C", "D", "E"];
  for (let i = 0; i < gridRows; i++) {
    const y = margin + cellHeight * i + cellHeight / 2;
    pdf.text(rowLabels[i], margin + 3, y + 2);
    pdf.text(rowLabels[i], pageWidth - margin - 3, y + 2);
    // Horizontal grid lines
    if (i > 0) {
      pdf.setLineDashPattern([1, 1], 0);
      pdf.line(
        margin,
        margin + cellHeight * i,
        pageWidth - margin,
        margin + cellHeight * i,
      );
    }
  }

  // Reset dash pattern
  pdf.setLineDashPattern([], 0);

  // Title block in bottom right
  const titleBlockWidth = 80;
  const titleBlockHeight = 25;
  const titleBlockX = pageWidth - margin - titleBlockWidth;
  const titleBlockY = pageHeight - margin - titleBlockHeight;

  pdf.setLineWidth(0.5);
  pdf.rect(titleBlockX, titleBlockY, titleBlockWidth, titleBlockHeight);
  pdf.line(
    titleBlockX,
    titleBlockY + 12,
    titleBlockX + titleBlockWidth,
    titleBlockY + 12,
  );

  pdf.setFontSize(8);
  pdf.setTextColor(0, 0, 0);
  pdf.text("Title:", titleBlockX + 3, titleBlockY + 8);
  pdf.setFontSize(10);
  pdf.text(projectName, titleBlockX + 18, titleBlockY + 8);

  pdf.setFontSize(8);
  const now = new Date();
  const dateStr = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}, ${now.toLocaleTimeString()}`;
  pdf.text(`Date: ${dateStr}`, titleBlockX + 3, titleBlockY + 20);
  pdf.text("Sheet: 1/1", titleBlockX + titleBlockWidth - 20, titleBlockY + 20);

  // Calculate bounds for positioning components
  if (nodes.length === 0) {
    pdf.save(`${projectName.replace(/[^a-z0-9]/gi, "_")}_schematic.pdf`);
    return;
  }

  // Find bounds of all nodes
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  nodes.forEach((node) => {
    minX = Math.min(minX, node.position.x);
    minY = Math.min(minY, node.position.y);
    maxX = Math.max(maxX, node.position.x);
    maxY = Math.max(maxY, node.position.y);
  });

  // Available drawing area (leaving space for title block and margins)
  const drawAreaX = margin + 15;
  const drawAreaY = margin + 15;
  const drawAreaWidth = borderWidth - 30;
  const drawAreaHeight = borderHeight - 50;

  // Scale factor to fit circuit in drawing area
  const canvasWidth = maxX - minX + 200;
  const canvasHeight = maxY - minY + 200;
  const scale = Math.min(
    drawAreaWidth / canvasWidth,
    drawAreaHeight / canvasHeight,
    1.5, // Max scale
  );

  // Transform function from canvas to PDF coordinates
  const transformX = (x: number) => drawAreaX + (x - minX + 100) * scale;
  const transformY = (y: number) => drawAreaY + (y - minY + 100) * scale;

  // Store component positions for wire drawing
  const componentPositions: Map<
    string,
    { x: number; y: number; symbol: typeof defaultSymbol }
  > = new Map();

  // Draw components
  nodes.forEach((node, index) => {
    const type = node.data.component.type;
    const symbol = componentSymbols[type] || defaultSymbol;
    const x = transformX(node.position.x);
    const y = transformY(node.position.y);

    const label =
      node.data.label ||
      `${node.data.component.name.charAt(0).toUpperCase()}${index + 1}`;
    const value = getComponentValue(node);

    componentPositions.set(node.id, { x, y, symbol });

    if (componentSymbols[type]) {
      symbol.draw(pdf, x, y, label, value);
    } else {
      defaultSymbol.draw(pdf, x, y, label, type);
    }
  });

  // Draw wires (edges)
  pdf.setDrawColor(200, 0, 0);
  pdf.setLineWidth(0.5);

  edges.forEach((edge) => {
    const source = componentPositions.get(edge.source);
    const target = componentPositions.get(edge.target);

    if (source && target) {
      // Find connection points based on handles or use default pin positions
      let sourceX = source.x;
      let sourceY = source.y;
      let targetX = target.x;
      let targetY = target.y;

      // Adjust for pin positions
      if (source.symbol.pins.length > 0) {
        const sourceHandleIndex = edge.sourceHandle
          ? parseInt(edge.sourceHandle.split("-")[1]) || 0
          : 0;
        const sourcePin =
          source.symbol.pins[sourceHandleIndex % source.symbol.pins.length];
        sourceX = source.x + sourcePin.dx;
        sourceY = source.y + sourcePin.dy;
      }

      if (target.symbol.pins.length > 0) {
        const targetHandleIndex = edge.targetHandle
          ? parseInt(edge.targetHandle.split("-")[1]) || 0
          : 0;
        const targetPin =
          target.symbol.pins[targetHandleIndex % target.symbol.pins.length];
        targetX = target.x + targetPin.dx;
        targetY = target.y + targetPin.dy;
      }

      // Draw wire with right-angle routing (like professional schematics)
      const midX = (sourceX + targetX) / 2;

      // Simple L-shaped or straight routing
      if (Math.abs(sourceY - targetY) < 5) {
        // Horizontal line
        pdf.line(sourceX, sourceY, targetX, targetY);
      } else if (Math.abs(sourceX - targetX) < 5) {
        // Vertical line
        pdf.line(sourceX, sourceY, targetX, targetY);
      } else {
        // L-shaped routing
        pdf.line(sourceX, sourceY, midX, sourceY);
        pdf.line(midX, sourceY, midX, targetY);
        pdf.line(midX, targetY, targetX, targetY);
      }
    }
  });

  // Add "Made with Amperon" watermark
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text("Made with Amperon", margin + 5, pageHeight - margin - 5);

  // Save the PDF
  pdf.save(`${projectName.replace(/[^a-z0-9]/gi, "_")}_schematic.pdf`);
}

export default generateSchematicPdf;
