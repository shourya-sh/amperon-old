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
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useCircuitStore, useShopStore } from '../../stores';
import { 
  fetchAllComponentPrices, 
  calculateTotalPrice, 
  exportToExcel,
  vendorDisplayNames,
  refreshPrices as refreshPriceCache,
  getApiStatus,
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
  octopart: '#00a651',
  findchips: '#4ecdc4',
  amazon: '#ff9900',
};

// Proper display names for vendors
const vendorLabels: Record<VendorName, string> = {
  octopart: 'Octopart',
  findchips: 'FindChips',
  amazon: 'Amazon',
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
  // Use local labels for proper display names
  const displayName = vendorLabels[vendor] || vendorDisplayNames[vendor] || vendor.charAt(0).toUpperCase() + vendor.slice(1);
  const color = vendorColors[vendor] || '#888888';
  
  return (
    <span 
      className={`px-2 py-0.5 text-xs font-medium rounded-md transition-all ${
        isSelected 
          ? 'ring-2 ring-duo-green ring-offset-1 ring-offset-dark-850' 
          : ''
      }`}
      style={{ 
        backgroundColor: `${color}20`,
        color: color,
        borderLeft: `3px solid ${color}`,
      }}
    >
      {displayName}
    </span>
  );
};

// Price display component with clear lowest price indication
const PriceDisplay: React.FC<{ 
  price: VendorPrice; 
  isSelected: boolean;
  isBest: boolean;
  onSelect: () => void;
}> = ({ price, isSelected, isBest, onSelect }) => {
  const priceSource = (price as any).source;
  const isNexarLive = priceSource === 'nexar-live';
  const isLive = isNexarLive || priceSource === 'live' || priceSource?.includes('scrape');
  
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all relative ${
        isBest 
          ? 'bg-dark-800 border-2 border-duo-green' 
          : isSelected 
            ? 'bg-dark-750 border border-dark-600' 
            : 'bg-dark-800 border border-dark-700 hover:border-dark-600'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-start gap-1">
          <VendorBadge vendor={price.vendor} isSelected={isSelected || isBest} />
          <span className={`text-[10px] ${isNexarLive ? 'text-red-400' : isLive ? 'text-green-400' : 'text-dark-500'}`}>
            {isNexarLive ? '🔴 Nexar Live' : isLive ? '● Live Price' : ''}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`font-[family-name:var(--font-fredoka)] text-lg font-bold ${isBest ? 'text-duo-green' : isSelected ? 'text-dark-100' : 'text-dark-200'}`}>
          ${price.price.toFixed(2)}
        </span>
        {price.inStock ? (
          <span className="flex items-center text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
            <Check size={10} className="mr-1" />
            {price.stockQuantity?.toLocaleString() || 'In Stock'}
          </span>
        ) : (
          <span className="text-xs text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">Out of Stock</span>
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
            <h4 className="font-[family-name:var(--font-fredoka)] font-semibold text-dark-200">{pricing.componentName}</h4>
            <div className="flex flex-col gap-1 mt-1">
              <span className="text-sm font-[family-name:var(--font-fredoka)] font-medium text-dark-300">
                {pricing.componentType} × {quantity}
              </span>
              {pricing.bestPrice && (
                <a
                  href={pricing.bestPrice.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-duo-green font-medium inline-flex items-center gap-1 hover:underline w-fit"
                  title={`Open ${vendorDisplayNames[pricing.bestPrice.vendor]} link`}
                >
                  via {vendorDisplayNames[pricing.bestPrice.vendor]}
                  <ExternalLink size={10} />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {activeVendor && (
            <div className="text-right">
              <p className="font-[family-name:var(--font-fredoka)] text-sm font-bold text-duo-green">
                ${(activeVendor.price * quantity).toFixed(2)}
              </p>
              <p className="text-xs text-dark-400 font-[family-name:var(--font-fredoka)]">
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
        <div className="px-4 pb-4 space-y-3 border-t border-dark-700 pt-4">
          <p className="text-xs text-dark-500 font-[family-name:var(--font-fredoka)]">Compare prices from {pricing.prices.length} vendors:</p>
          {pricing.bestPrice && (
            <p className="text-sm text-duo-green font-[family-name:var(--font-fredoka)] font-medium">
              Lowest: ${pricing.bestPrice.price.toFixed(2)} at {vendorDisplayNames[pricing.bestPrice.vendor]}
            </p>
          )}
          {pricing.prices.map((price) => (
            <PriceDisplay
              key={price.vendor}
              price={price}
              isSelected={selectedVendor === price.vendor || (!selectedVendor && price === pricing.bestPrice)}
              isBest={price === pricing.bestPrice}
              onSelect={() => onSelectVendor(price.vendor)}
            />
          ))}
          
          {/* Part numbers and links */}
          <div className="mt-4 pt-3 border-t border-dark-700">
            <p className="text-xs text-dark-500 mb-2 font-[family-name:var(--font-fredoka)]">Part Numbers & Links:</p>
            <div className="space-y-1">
              {pricing.prices.map((price) => (
                <div key={price.vendor} className="flex items-center justify-between text-xs">
                  <span className="text-dark-400">{vendorDisplayNames[price.vendor]}: <span className="font-mono text-dark-300">{price.partNumber}</span></span>
                  <a
                    href={price.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-duo-green hover:underline"
                  >
                    View <ExternalLink size={10} />
                  </a>
                </div>
              ))}
            </div>
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
  const [apiStatus, setApiStatus] = useState<{ available: boolean; checked: boolean }>({ available: false, checked: false });
  
  // Check API status on mount
  useEffect(() => {
    if (isOpen && !apiStatus.checked) {
      getApiStatus().then(status => {
        setApiStatus({ available: status.available, checked: true });
      });
    }
  }, [isOpen, apiStatus.checked]);
  
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

  // Force refresh prices from web scraping
  const handleForceRefresh = async () => {
    await refreshPriceCache();
    setLastFetchedNodes(''); // Clear cached key to force re-fetch
    await fetchPrices();
    // Re-check API status
    const status = await getApiStatus();
    setApiStatus({ available: status.available, checked: true });
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="w-80 h-full bg-dark-850 border-l-2 border-dark-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b-2 border-dark-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-duo-green/20 rounded-xl flex items-center justify-center">
            <ShoppingCart size={20} className="text-duo-green" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-dark-200">Shop Parts</h2>
              {apiStatus.checked && (
                <span 
                  className={`flex items-center gap-1 px-2 py-0.5 text-xs rounded-full font-[family-name:var(--font-fredoka)] ${
                    apiStatus.available 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                  title={apiStatus.available ? 'Live prices from web scraping' : 'Using estimated prices'}
                >
                  {apiStatus.available ? <Wifi size={10} /> : <WifiOff size={10} />}
                  {apiStatus.available ? 'Live' : 'Offline'}
                </span>
              )}
            </div>
            <p className="text-xs text-dark-500 font-[family-name:var(--font-fredoka)]">
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
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
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
              onClick={apiStatus.available ? handleForceRefresh : fetchPrices}
              disabled={isLoadingPrices}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-dark-800 border border-dark-700 rounded-xl text-sm text-dark-300 hover:text-duo-green hover:border-duo-green/50 transition-all disabled:opacity-50"
            >
              <RefreshCw size={16} className={isLoadingPrices ? 'animate-spin' : ''} />
              {isLoadingPrices ? 'Fetching prices...' : apiStatus.available ? 'Refresh Live Prices' : 'Refresh Prices'}
            </button>
            
            {/* Summary stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-dark-800 rounded-xl border border-dark-700">
                <div className="flex items-center gap-2 text-dark-500 mb-2">
                  <Package size={14} />
                  <span className="text-xs font-medium font-[family-name:var(--font-fredoka)]">Components</span>
                </div>
                <p className="font-[family-name:var(--font-fredoka)] font-semibold text-lg text-dark-200">
                  {canvasComponents.reduce((sum, c) => sum + c.count, 0)}
                </p>
              </div>
              <div className="p-4 bg-dark-800 rounded-xl border border-dark-700">
                <div className="flex items-center gap-2 text-dark-500 mb-2">
                  <Check size={14} />
                  <span className="text-xs font-medium font-[family-name:var(--font-fredoka)]">In Stock</span>
                </div>
                <p className="font-[family-name:var(--font-fredoka)] font-semibold text-lg text-green-500">
                  {inStockCount}/{Object.keys(pricing).length}
                </p>
              </div>
            </div>
            
            {/* Component list */}
            <div className="space-y-3">
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
        <div className="p-3 border-t-2 border-dark-700 space-y-2">
          {/* Total price */}
          <div className="flex items-center justify-between p-3 bg-duo-green/10 rounded-xl border border-duo-green/30">
            <div className="flex items-center gap-2">
              <DollarSign size={18} className="text-duo-green" />
              <span className="font-[family-name:var(--font-fredoka)] font-semibold text-dark-200 text-sm">Estimated Total</span>
            </div>
            <span className="font-[family-name:var(--font-fredoka)] text-xl font-bold text-duo-green">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
          
          {/* Export button */}
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-duo-green text-dark-900 font-[family-name:var(--font-fredoka)] font-semibold rounded-xl hover:bg-duo-green/90 transition-all text-sm"
          >
            <Download size={16} />
            Download Parts List (CSV)
          </button>
          
          <p className="text-xs text-dark-500 text-center leading-tight font-[family-name:var(--font-fredoka)]">
            {apiStatus.available 
              ? 'Live prices from Octopart, ComponentsCSE, and Amazon. Click component to compare all vendors.' 
              : 'Prices are estimates and may vary. Start the server for live prices.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ShopPanel;
