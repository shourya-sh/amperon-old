import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  ShoppingCart,
  X,
  ExternalLink,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Package,
  AlertCircle,
  Check,
  Loader2,
  DollarSign,
  TrendingDown,
} from 'lucide-react';
import { useCircuitStore, useShopStore } from '../../stores';
import { 
  fetchAllComponentPrices, 
  calculateTotalPrice, 
  exportToExcel,
  vendorDisplayNames,
} from '../../services/shopService';
import { getKiCadSvg } from '../../services/kicadSvgService';
import { circuitComponents } from '../../data/components';
import type { VendorName, VendorPrice, ComponentPricing, ComponentProperty } from '../../types';

interface CanvasComponentItem {
  id: string;
  type: string;
  name: string;
  count: number;
  properties?: ComponentProperty[];
}

// Match the canvas palette so colors are consistent with the board
const categoryColorMap: Record<string, string> = {
  source: '#ef4444',
  passive: '#a855f7',
  active: '#3b82f6',
  output: '#f59e0b',
  measurement: '#06b6d4',
  connection: '#9ca3af',
};

// Vendor colors for visual distinction
const vendorColors: Record<VendorName, string> = {
  texas_instruments: '#cc0000',
  octopart: '#00a651',
  findchips: '#0066cc',
  amazon: '#ff9900',
};

// Component icon with KiCad SVG in category color
const ComponentIcon: React.FC<{ componentType: string }> = ({ componentType }) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Get the component's category to determine color
  const component = circuitComponents.find(c => c.type === componentType);
  const color = component ? categoryColorMap[component.category] || '#22c55e' : '#22c55e';

  useEffect(() => {
    let cancelled = false;
    getKiCadSvg(componentType)
      .then((svg) => {
        if (cancelled) return;
        // Recolor to category color and scale stroke
        const recolored = svg.replace(/#22c55e/gi, color);
        const scaled = recolored.replace(/stroke-width="([\d.]+)"/g, (_m, w) => {
          const numeric = Number.parseFloat(w);
          const newWidth = Number.isFinite(numeric) ? Math.max(numeric * 1.4, 1.4) : 1.8;
          return `stroke-width="${newWidth.toFixed(2)}"`;
        });
        setSvgContent(scaled);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setSvgContent('');
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [componentType, color]);

  if (loading) {
    return (
      <div className="w-10 h-10 bg-dark-700 rounded-lg flex items-center justify-center">
        <div className="w-4 h-4 border-2 border-dark-600 border-t-duo-green rounded-full animate-spin" />
      </div>
    );
  }

  if (!svgContent) {
    return (
      <div className="w-10 h-10 bg-dark-700 rounded-lg flex items-center justify-center">
        <Package size={20} className="text-dark-500" />
      </div>
    );
  }

  return (
    <div
      className="w-10 h-10 bg-dark-700/50 rounded-lg flex items-center justify-center p-1.5 [&>svg]:block [&>svg]:mx-auto [&>svg]:my-auto [&>svg]:h-full [&>svg]:w-full [&>svg]:overflow-visible"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

// Vendor logos/icons
const VendorBadge: React.FC<{ vendor: VendorName; isSelected?: boolean }> = ({ vendor, isSelected }) => {
  return (
    <span 
      className={`px-2 py-0.5 text-xs font-medium rounded-md transition-all ${
        isSelected 
          ? 'ring-2 ring-duo-green ring-offset-1 ring-offset-dark-850' 
          : ''
      }`}
      style={{ 
        backgroundColor: `${vendorColors[vendor]}20`,
        color: vendorColors[vendor],
        borderLeft: `3px solid ${vendorColors[vendor]}`,
      }}
    >
      {vendorDisplayNames[vendor]}
    </span>
  );
};

// Price display component
const PriceDisplay: React.FC<{ 
  price: VendorPrice; 
  isSelected: boolean;
  isBest: boolean;
  onSelect: () => void;
}> = ({ price, isSelected, isBest, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center justify-between p-2 rounded-lg transition-all ${
        isSelected 
          ? 'bg-duo-green/20 border border-duo-green/50' 
          : 'bg-dark-800 border border-dark-700 hover:border-dark-600'
      }`}
    >
      <div className="flex items-center gap-2">
        <VendorBadge vendor={price.vendor} isSelected={isSelected} />
        {isBest && (
          <span className="flex items-center gap-1 text-xs text-duo-green">
            <TrendingDown size={12} />
            Best
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className={`font-mono font-semibold ${isSelected ? 'text-duo-green' : 'text-dark-200'}`}>
          ${price.price.toFixed(2)}
        </span>
        {price.inStock ? (
          <span className="flex items-center text-xs text-green-500">
            <Check size={12} className="mr-0.5" />
            In Stock
          </span>
        ) : (
          <span className="text-xs text-amber-500">Out of Stock</span>
        )}
      </div>
    </button>
  );
};

// Individual component card
const ComponentPriceCard: React.FC<{
  pricing: ComponentPricing;
  selectedVendor: VendorName | undefined;
  onSelectVendor: (vendor: VendorName) => void;
  quantity: number;
}> = ({ pricing, selectedVendor, onSelectVendor, quantity }) => {
  const [expanded, setExpanded] = useState(false);
  
  const activeVendor = selectedVendor 
    ? pricing.prices.find(p => p.vendor === selectedVendor) ?? pricing.bestPrice
    : pricing.bestPrice;
  
  if (pricing.status === 'loading') {
    return (
      <div className="p-4 bg-dark-800 rounded-xl border border-dark-700 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-dark-700 rounded-lg" />
          <div className="flex-1">
            <div className="h-4 bg-dark-700 rounded w-1/2 mb-2" />
            <div className="h-3 bg-dark-700 rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }
  
  if (pricing.status === 'error' || pricing.status === 'no_results') {
    return (
      <div className="p-4 bg-dark-800 rounded-xl border border-red-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-900/20 rounded-lg flex items-center justify-center">
            <AlertCircle size={20} className="text-red-500" />
          </div>
          <div>
            <h4 className="font-medium text-dark-200">{pricing.componentName}</h4>
            <p className="text-xs text-red-400">
              {pricing.errorMessage || 'No pricing data available'}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden transition-all hover:border-dark-600">
      {/* Header */}
      <button 
        className="w-full p-4 flex items-center justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <ComponentIcon componentType={pricing.componentType} />
          <div className="text-left">
            <h4 className="font-medium text-dark-200">{pricing.componentName}</h4>
            <p className="text-xs text-dark-500">
              {pricing.componentType} × {quantity}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {activeVendor && (
            <div className="text-right">
              <p className="font-mono font-semibold text-duo-green">
                ${(activeVendor.price * quantity).toFixed(2)}
              </p>
              <p className="text-xs text-dark-500">
                ${activeVendor.price.toFixed(2)} each
              </p>
            </div>
          )}
          {expanded ? (
            <ChevronUp size={18} className="text-dark-500" />
          ) : (
            <ChevronDown size={18} className="text-dark-500" />
          )}
        </div>
      </button>
      
      {/* Expanded vendor options */}
      {expanded && (
        <div className="px-4 pb-4 space-y-2 border-t border-dark-700 pt-3">
          <p className="text-xs text-dark-500 mb-2">Select vendor:</p>
          {pricing.prices.map((price) => (
            <PriceDisplay
              key={price.vendor}
              price={price}
              isSelected={selectedVendor === price.vendor || (!selectedVendor && price === pricing.bestPrice)}
              isBest={price === pricing.bestPrice}
              onSelect={() => onSelectVendor(price.vendor)}
            />
          ))}
          
          {/* Links */}
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-dark-700">
            {pricing.prices.map((price) => (
              <a
                key={price.vendor}
                href={price.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-dark-700 text-dark-300 hover:text-duo-green hover:bg-dark-600 transition-all"
              >
                <ExternalLink size={12} />
                {vendorDisplayNames[price.vendor]}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ShopPanel: React.FC = () => {
  const { isOpen, setIsOpen, pricing, setPricing, isLoadingPrices, setIsLoadingPrices, selectedVendors, setSelectedVendor, clearPricing } = useShopStore();
  const { nodes } = useCircuitStore();
  const [lastFetchedNodes, setLastFetchedNodes] = useState<string>('');
  
  // Get unique components from canvas
  const canvasComponents = useMemo(() => {
    const componentMap = new Map<string, CanvasComponentItem>();
    
    nodes.forEach(node => {
      const comp = node.data.component;
      if (!comp) return;
      
      // Skip non-purchasable items
      if (['wire', 'ground'].includes(comp.type)) return;
      
      const key = `${comp.type}-${comp.name}`;
      const existing = componentMap.get(key);
      
      if (existing) {
        existing.count++;
      } else {
        componentMap.set(key, {
          id: comp.id,
          type: comp.type,
          name: comp.name,
          count: 1,
          properties: comp.properties,
        });
      }
    });
    
    return Array.from(componentMap.values());
  }, [nodes]);
  
  // Fetch prices when panel opens or components change
  const fetchPrices = useCallback(async () => {
    if (canvasComponents.length === 0) {
      clearPricing();
      return;
    }
    
    const nodesKey = JSON.stringify(canvasComponents.map(c => `${c.type}-${c.count}`));
    if (nodesKey === lastFetchedNodes && Object.keys(pricing).length > 0) {
      return;
    }
    
    setIsLoadingPrices(true);
    
    try {
      const pricingData = await fetchAllComponentPrices(
        canvasComponents.map(c => ({
          componentId: c.id,
          componentType: c.type,
          componentName: c.name,
          quantity: c.count,
          properties: c.properties,
        }))
      );
      
      setPricing(pricingData);
      setLastFetchedNodes(nodesKey);
    } catch (error) {
      console.error('Failed to fetch prices:', error);
    } finally {
      setIsLoadingPrices(false);
    }
  }, [canvasComponents, lastFetchedNodes, pricing, clearPricing, setIsLoadingPrices, setPricing]);
  
  useEffect(() => {
    if (isOpen && canvasComponents.length > 0) {
      fetchPrices();
    }
  }, [isOpen, canvasComponents.length, fetchPrices]);
  
  // Calculate total price
  const totalPrice = useMemo(() => {
    return calculateTotalPrice(pricing, selectedVendors);
  }, [pricing, selectedVendors]);
  
  // Count in-stock items
  const inStockCount = useMemo(() => {
    return Object.values(pricing).filter(p => p.bestPrice?.inStock).length;
  }, [pricing]);
  
  const handleExport = () => {
    exportToExcel(pricing, selectedVendors);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="w-96 h-full bg-dark-850 border-l-2 border-dark-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b-2 border-dark-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-duo-green/20 rounded-xl flex items-center justify-center">
            <ShoppingCart size={20} className="text-duo-green" />
          </div>
          <div>
            <h2 className="font-display font-bold text-dark-200">Shop Parts</h2>
            <p className="text-xs text-dark-500">
              {canvasComponents.length} components on canvas
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-dark-200 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {canvasComponents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 bg-dark-800 rounded-2xl flex items-center justify-center mb-4">
              <Package size={32} className="text-dark-600" />
            </div>
            <h3 className="font-display font-semibold text-dark-400 mb-2">No Components</h3>
            <p className="text-sm text-dark-500">
              Add components to your circuit to see pricing information.
            </p>
          </div>
        ) : isLoadingPrices && Object.keys(pricing).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 size={32} className="text-duo-green animate-spin mb-4" />
            <p className="text-sm text-dark-400">Fetching prices from vendors...</p>
          </div>
        ) : (
          <>
            {/* Refresh button */}
            <button
              onClick={fetchPrices}
              disabled={isLoadingPrices}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-dark-800 border border-dark-700 rounded-xl text-sm text-dark-300 hover:text-duo-green hover:border-duo-green/50 transition-all disabled:opacity-50"
            >
              <RefreshCw size={16} className={isLoadingPrices ? 'animate-spin' : ''} />
              {isLoadingPrices ? 'Refreshing...' : 'Refresh Prices'}
            </button>
            
            {/* Summary stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-dark-800 rounded-xl border border-dark-700">
                <div className="flex items-center gap-2 text-dark-500 mb-1">
                  <Package size={14} />
                  <span className="text-xs">Components</span>
                </div>
                <p className="font-mono font-semibold text-dark-200">
                  {canvasComponents.reduce((sum, c) => sum + c.count, 0)}
                </p>
              </div>
              <div className="p-3 bg-dark-800 rounded-xl border border-dark-700">
                <div className="flex items-center gap-2 text-dark-500 mb-1">
                  <Check size={14} />
                  <span className="text-xs">In Stock</span>
                </div>
                <p className="font-mono font-semibold text-green-500">
                  {inStockCount}/{Object.keys(pricing).length}
                </p>
              </div>
            </div>
            
            {/* Component list */}
            <div className="space-y-2">
              <h3 className="text-xs font-display font-semibold text-dark-500 uppercase tracking-wider">
                Parts List
              </h3>
              {canvasComponents.map((comp) => (
                <ComponentPriceCard
                  key={`${comp.type}-${comp.name}`}
                  pricing={pricing[comp.id] || {
                    componentId: comp.id,
                    componentName: comp.name,
                    componentType: comp.type,
                    quantity: comp.count,
                    prices: [],
                    bestPrice: null,
                    lastUpdated: new Date(),
                    status: 'loading',
                  }}
                  selectedVendor={selectedVendors[comp.id]}
                  onSelectVendor={(vendor) => setSelectedVendor(comp.id, vendor)}
                  quantity={comp.count}
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Footer with total */}
      {canvasComponents.length > 0 && Object.keys(pricing).length > 0 && (
        <div className="p-4 border-t-2 border-dark-700 space-y-3">
          {/* Total price */}
          <div className="flex items-center justify-between p-3 bg-duo-green/10 rounded-xl border border-duo-green/30">
            <div className="flex items-center gap-2">
              <DollarSign size={20} className="text-duo-green" />
              <span className="font-display font-semibold text-dark-200">Estimated Total</span>
            </div>
            <span className="font-mono text-xl font-bold text-duo-green">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
          
          {/* Export button */}
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-duo-green text-dark-900 font-semibold rounded-xl hover:bg-duo-green/90 transition-all"
          >
            <Download size={18} />
            Download Parts List (CSV)
          </button>
          
          <p className="text-xs text-dark-500 text-center">
            Prices are estimates and may vary. Click component to see all vendor options.
          </p>
        </div>
      )}
    </div>
  );
};

export default ShopPanel;
