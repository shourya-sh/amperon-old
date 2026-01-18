import React, { useEffect } from 'react';
import { ShoppingCart, MessageSquare } from 'lucide-react';
import ComponentLibrary from '../components/sidebar/ComponentLibrary';
import CircuitCanvas from '../components/canvas/CircuitCanvas';
import ChatPanel from '../components/chat/ChatPanel';
import ShopPanel from '../components/shop/ShopPanel';
import { useChatStore, useShopStore } from '../stores';

const DesignerPage: React.FC = () => {
  const { isOpen: isChatOpen, setIsOpen: setIsChatOpen } = useChatStore();
  const { isOpen: isShopOpen, setIsOpen: setIsShopOpen } = useShopStore();

  // Ensure chat is open on page load
  useEffect(() => {
    if (!isChatOpen && !isShopOpen) {
      setIsChatOpen(true);
    }
  }, []);

  const handleChatClick = () => {
    if (isShopOpen) {
      setIsShopOpen(false);
    }
    setIsChatOpen(true);
  };

  const handleShopClick = () => {
    if (isChatOpen) {
      setIsChatOpen(false);
    }
    setIsShopOpen(true);
  };

  return (
    <div className="flex h-full">
      {/* Left Sidebar - Component Library */}
      <ComponentLibrary />

      {/* Main Canvas Area */}
      <div className="flex-1 relative">
        <CircuitCanvas />
        
        {/* Toggle Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 items-end">
          {/* Chat Toggle Button */}
          <button
            onClick={handleChatClick}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl font-medium transition-all w-fit ${
              isChatOpen && !isShopOpen
                ? 'bg-duo-green text-dark-900 shadow-lg shadow-duo-green/20'
                : 'bg-dark-800 text-dark-200 border border-dark-700 hover:border-duo-green/50 hover:text-duo-green'
            }`}
          >
            <MessageSquare size={18} />
            <span>AI Chat</span>
          </button>

          {/* Shop Toggle Button */}
          <button
            onClick={handleShopClick}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl font-medium transition-all w-fit ${
              isShopOpen
                ? 'bg-duo-green text-dark-900 shadow-lg shadow-duo-green/20'
                : 'bg-dark-800 text-dark-200 border border-dark-700 hover:border-duo-green/50 hover:text-duo-green'
            }`}
          >
            <ShoppingCart size={18} />
            <span>Shop Parts</span>
          </button>
        </div>
      </div>

      {/* Right Sidebar - Chat Panel */}
      {isChatOpen && !isShopOpen && <ChatPanel />}
      
      {/* Right Sidebar - Shop Panel */}
      {isShopOpen && <ShopPanel />}
    </div>
  );
};

export default DesignerPage;
