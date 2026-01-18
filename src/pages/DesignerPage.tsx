import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ShoppingCart, MessageSquare, Share2, Users, X, Eye, Edit3, Check, Cloud } from 'lucide-react';
import ComponentLibrary from '../components/sidebar/ComponentLibrary';
import CircuitCanvas from '../components/canvas/CircuitCanvas';
import ChatPanel from '../components/chat/ChatPanel';
import ShopPanel from '../components/shop/ShopPanel';
import ShareModal from '../components/collaboration/ShareModal';
import { useChatStore, useShopStore, useLiveShareStore, useCircuitStore, useProjectStore } from '../stores';
import { useAuth } from '../contexts/AuthContext';
import liveShareService from '../services/liveShareService';

const DesignerPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { isOpen: isChatOpen, setIsOpen: setIsChatOpen, sessions, currentSessionId } = useChatStore();
  const { isOpen: isShopOpen, setIsOpen: setIsShopOpen } = useShopStore();
  const { isLiveSession, activeUsers, permission } = useLiveShareStore();
  const { nodes, edges } = useCircuitStore();
  const { 
    currentProjectId, 
    updateProject, 
    autosaveEnabled,
    setHasUnsavedChanges,
    setLastSaved,
    getCurrentProject
  } = useProjectStore();
  
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSaveRef = useRef<string>('');
  const isOnDesignerPageRef = useRef(true);

  const currentProject = getCurrentProject();

  // Track if we're on the designer page
  useEffect(() => {
    isOnDesignerPageRef.current = location.pathname === '/' || location.pathname === '/designer';
    
    // Clean up autosave timer when leaving designer page
    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [location.pathname]);

  // Ensure chat is open on page load
  useEffect(() => {
    if (!isChatOpen && !isShopOpen) {
      setIsChatOpen(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Initialize live share service when user is available
  useEffect(() => {
    if (user) {
      liveShareService.setUser(user.id, user.displayName || user.email || 'Anonymous');
    }
  }, [user]);

  // Autosave functionality
  useEffect(() => {
    if (!autosaveEnabled || !currentProjectId || !isOnDesignerPageRef.current) return;

    // Create a hash of current state to detect changes
    const currentStateHash = JSON.stringify({ nodes, edges });
    
    // Don't save if nothing has changed
    if (currentStateHash === lastSaveRef.current) return;

    // Clear existing timer
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    // Mark as having unsaved changes
    setHasUnsavedChanges(true);

    // Set a new timer to autosave after 2 seconds of inactivity
    autosaveTimerRef.current = setTimeout(() => {
      const currentSession = sessions.find(s => s.id === currentSessionId);
      
      updateProject(currentProjectId, {
        nodes: [...nodes],
        edges: [...edges],
        chatSessionId: currentSessionId || undefined,
        chatSession: currentSession ? { ...currentSession } : undefined,
        updatedAt: new Date(),
      });
      
      lastSaveRef.current = currentStateHash;
      setLastSaved(new Date());
      setShowSaveIndicator(true);
      
      // Hide save indicator after 2 seconds
      setTimeout(() => setShowSaveIndicator(false), 2000);
    }, 2000);

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [nodes, edges, currentProjectId, autosaveEnabled, currentSessionId, sessions, updateProject, setHasUnsavedChanges, setLastSaved]);

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
        
        {/* Toggle Buttons - Left Side */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 items-start">
          {/* Project Name & Autosave Indicator */}
          {currentProject && (
            <div className="flex items-center gap-2 px-3 py-2 bg-dark-800/90 backdrop-blur-sm border border-dark-700 rounded-xl">
              <span className="text-sm font-medium text-dark-200 max-w-[150px] truncate">
                {currentProject.name}
              </span>
              {showSaveIndicator ? (
                <div className="flex items-center gap-1 text-duo-green">
                  <Check size={14} />
                  <span className="text-xs">Saved</span>
                </div>
              ) : autosaveEnabled ? (
                <div className="flex items-center gap-1 text-dark-500">
                  <Cloud size={14} />
                  <span className="text-xs">Auto-save on</span>
                </div>
              ) : null}
            </div>
          )}

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
        </div>

        {/* Toggle Buttons - Right Side */}
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
      
      {/* Share Modal */}
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
      />
    </div>
  );
};

export default DesignerPage;
