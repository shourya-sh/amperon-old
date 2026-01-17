import React from 'react';
import ComponentLibrary from '../components/sidebar/ComponentLibrary';
import CircuitCanvas from '../components/canvas/CircuitCanvas';
import ChatPanel from '../components/chat/ChatPanel';
import { useChatStore } from '../stores';

const DesignerPage: React.FC = () => {
  const { isOpen: isChatOpen } = useChatStore();

  return (
    <div className="flex h-full">
      {/* Left Sidebar - Component Library */}
      <ComponentLibrary />

      {/* Main Canvas Area */}
      <div className="flex-1 relative">
        <CircuitCanvas />
      </div>

      {/* Right Sidebar - Chat Panel */}
      {isChatOpen && <ChatPanel />}
    </div>
  );
};

export default DesignerPage;
