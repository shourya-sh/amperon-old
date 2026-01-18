import React from 'react';
import { ShoppingCart } from 'lucide-react';
import ComponentLibrary from '../components/sidebar/ComponentLibrary';
import CircuitCanvas from '../components/canvas/CircuitCanvas';
import ChatPanel from '../components/chat/ChatPanel';
import ShopPanel from '../components/shop/ShopPanel';
import { useChatStore, useShopStore } from '../stores';

const DesignerPage: React.FC = () => {
  const { isOpen: isChatOpen } = useChatStore();
  const { isOpen: isShopOpen, toggleShop } = useShopStore();

  return (
    <div className="flex h-full">
      {/* Left Sidebar - Component Library */}
      <ComponentLibrary />

      {/* Main Canvas Area */}
      <div className="flex-1 relative">
        <CircuitCanvas />
        
        {/* Shop Toggle Button */}
        <button
          onClick={toggleShop}
          className={`absolute top-4 right-4 flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all z-10 ${
            isShopOpen
              ? 'bg-duo-green text-dark-900 shadow-lg shadow-duo-green/20'
              : 'bg-dark-800 text-dark-200 border border-dark-700 hover:border-duo-green/50 hover:text-duo-green'
          }`}
        >
          <ShoppingCart size={18} />
          <span>Shop Parts</span>
        </button>
      </div>

      {/* Right Sidebar - Chat Panel */}
      {isChatOpen && !isShopOpen && <ChatPanel />}
      
      {/* Right Sidebar - Shop Panel */}
      {isShopOpen && <ShopPanel />}
    </div>
  );
};

export default DesignerPage;
