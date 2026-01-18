import React, { useEffect, useState } from 'react';
import { ShoppingCart, MessageSquare, Share2, Users, X, Eye, Edit3 } from 'lucide-react';
import ComponentLibrary from '../components/sidebar/ComponentLibrary';
import CircuitCanvas from '../components/canvas/CircuitCanvas';
import ChatPanel from '../components/chat/ChatPanel';
import ShopPanel from '../components/shop/ShopPanel';
import ShareModal from '../components/collaboration/ShareModal';
import { useChatStore, useShopStore, useLiveShareStore } from '../stores';
import { useAuth } from '../contexts/AuthContext';
import liveShareService from '../services/liveShareService';

const DesignerPage: React.FC = () => {
  const { user } = useAuth();
  const { isOpen: isChatOpen, setIsOpen: setIsChatOpen } = useChatStore();
  const { isOpen: isShopOpen, setIsOpen: setIsShopOpen } = useShopStore();
  const { isLiveSession, activeUsers, permission } = useLiveShareStore();
  
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Ensure chat is open on page load
  useEffect(() => {
    if (!isChatOpen && !isShopOpen) {
      setIsChatOpen(true);
    }
  }, []);
  
  // Initialize live share service when user is available
  useEffect(() => {
    if (user) {
      liveShareService.setUser(user.id, user.displayName || user.email || 'Anonymous');
    }
  }, [user]);

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
  
  const handleLeaveSession = async () => {
    await liveShareService.leaveSession();
  };

  return (
    <div className="flex h-full">
      {/* Left Sidebar - Component Library */}
      <ComponentLibrary />

      {/* Main Canvas Area */}
      <div className="flex-1 relative">
        <CircuitCanvas />
        
        {/* Live Session Banner */}
        {isLiveSession && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
            <div className="flex items-center gap-3 px-4 py-2 bg-dark-800/95 backdrop-blur-sm border border-duo-green/30 rounded-xl shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-duo-green rounded-full animate-pulse" />
                <span className="text-sm font-medium text-white">Live Session</span>
              </div>
              
              {/* Active Users Avatars */}
              <div className="flex items-center -space-x-2">
                {activeUsers.slice(0, 3).map((u) => (
                  <div 
                    key={u.id}
                    className="w-6 h-6 rounded-full border-2 border-dark-800 flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ backgroundColor: u.color }}
                    title={u.name}
                  >
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                ))}
                {activeUsers.length > 3 && (
                  <div className="w-6 h-6 rounded-full border-2 border-dark-800 bg-dark-600 flex items-center justify-center text-[10px] font-medium text-dark-200">
                    +{activeUsers.length - 3}
                  </div>
                )}
              </div>
              
              {/* User count */}
              <span className="text-xs text-dark-400">
                {activeUsers.length + 1} online
              </span>
              
              {/* Permission badge */}
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                permission === 'edit' 
                  ? 'bg-duo-green/20 text-duo-green' 
                  : 'bg-amber-500/20 text-amber-400'
              }`}>
                {permission === 'edit' ? <Edit3 size={10} /> : <Eye size={10} />}
                {permission === 'edit' ? 'Can Edit' : 'View Only'}
              </div>
              
              {/* Leave button */}
              <button
                onClick={handleLeaveSession}
                className="p-1 hover:bg-dark-700 rounded transition-colors text-dark-400 hover:text-red-400"
                title="Leave session"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}
        
        {/* Toggle Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 items-end">
          {/* Share Button */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl font-medium transition-all w-fit ${
              isLiveSession
                ? 'bg-duo-green text-dark-900 shadow-lg shadow-duo-green/20'
                : 'bg-dark-800 text-dark-200 border border-dark-700 hover:border-duo-green/50 hover:text-duo-green'
            }`}
          >
            {isLiveSession ? <Users size={18} /> : <Share2 size={18} />}
            <span>{isLiveSession ? 'Sharing' : 'Share'}</span>
          </button>
          
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
      
      {/* Share Modal */}
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
      />
    </div>
  );
};

export default DesignerPage;
