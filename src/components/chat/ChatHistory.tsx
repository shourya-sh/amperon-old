import React, { useState } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  Archive, 
  Copy, 
  X,
  Edit3,
  Check,
  ChevronRight,
  Clock,
  Search
} from 'lucide-react';
import { useChatStore } from '../../stores';
import type { ChatSession } from '../../types';

interface ChatHistoryProps {
  onClose: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ onClose }) => {
  const { 
    sessions, 
    currentSessionId, 
    createSession, 
    switchSession, 
    deleteSession, 
    renameSession, 
    archiveSession,
    duplicateSession 
  } = useChatStore();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const filteredSessions = sessions
    .filter(s => showArchived ? s.isArchived : !s.isArchived)
    .filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const handleCreateNew = () => {
    createSession();
    onClose();
  };

  const handleSelect = (sessionId: string) => {
    switchSession(sessionId);
    onClose();
  };

  const handleStartRename = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditName(session.name);
  };

  const handleSaveRename = (sessionId: string) => {
    if (editName.trim()) {
      renameSession(sessionId, editName.trim());
    }
    setEditingId(null);
  };

  const handleDelete = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this chat? This action cannot be undone.')) {
      deleteSession(sessionId);
    }
  };

  const handleArchive = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    archiveSession(sessionId);
  };

  const handleDuplicate = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newId = duplicateSession(sessionId);
    if (newId) {
      onClose();
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getPreview = (session: ChatSession) => {
    const lastUserMessage = [...session.messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      return lastUserMessage.content.slice(0, 50) + (lastUserMessage.content.length > 50 ? '...' : '');
    }
    return 'No messages yet';
  };

  return (
    <div className="absolute inset-0 bg-dark-900 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-dark-700 bg-dark-850">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-duo-green/10 border-2 border-duo-green/20 flex items-center justify-center">
            <Clock size={18} className="text-duo-green" />
          </div>
          <span className="font-display font-bold text-dark-100">Chat History</span>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-dark-800 rounded-xl text-dark-400 hover:text-dark-200 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Search & New Chat */}
      <div className="p-3 border-b border-dark-700/50 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-dark-800 border-2 border-dark-700 rounded-xl text-sm text-dark-200 placeholder-dark-500 focus:outline-none focus:border-duo-green/50"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleCreateNew}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-duo-green hover:bg-duo-greenDark text-white rounded-xl font-display font-semibold text-sm transition-all shadow-[0_3px_0_0_#16a34a] hover:translate-y-[1px] hover:shadow-[0_2px_0_0_#16a34a]"
          >
            <Plus size={16} />
            New Chat
          </button>
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`px-4 py-2.5 rounded-xl font-display font-medium text-sm border-2 transition-all ${
              showArchived 
                ? 'bg-dark-700 border-duo-green/50 text-duo-green' 
                : 'bg-dark-800 border-dark-700 text-dark-400 hover:text-dark-200'
            }`}
          >
            <Archive size={16} />
          </button>
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto">
        {filteredSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-dark-500">
            <MessageSquare size={32} className="mb-3 opacity-50" />
            <p className="text-sm font-display">
              {showArchived ? 'No archived chats' : 'No chats found'}
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => handleSelect(session.id)}
                className={`group relative p-3 rounded-xl cursor-pointer transition-all ${
                  session.id === currentSessionId
                    ? 'bg-duo-green/10 border-2 border-duo-green/30'
                    : 'bg-dark-850 border-2 border-transparent hover:border-dark-600 hover:bg-dark-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    session.id === currentSessionId 
                      ? 'bg-duo-green/20 text-duo-green' 
                      : 'bg-dark-700 text-dark-400'
                  }`}>
                    <MessageSquare size={14} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {editingId === session.id ? (
                      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveRename(session.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                          autoFocus
                          className="flex-1 px-2 py-1 bg-dark-700 border border-dark-600 rounded-lg text-sm text-dark-100 focus:outline-none focus:border-duo-green"
                        />
                        <button
                          onClick={() => handleSaveRename(session.id)}
                          className="p-1 hover:bg-dark-600 rounded text-duo-green"
                        >
                          <Check size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <h3 className={`font-display font-semibold text-sm truncate ${
                            session.id === currentSessionId ? 'text-duo-green' : 'text-dark-200'
                          }`}>
                            {session.name}
                          </h3>
                          {session.checkpoints.length > 0 && (
                            <span className="px-1.5 py-0.5 text-xs bg-amber-500/20 text-amber-400 rounded font-medium">
                              {session.checkpoints.length}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-dark-500 truncate mt-0.5">
                          {getPreview(session)}
                        </p>
                        <p className="text-xs text-dark-600 mt-1">
                          {formatDate(session.updatedAt)} • {session.messages.length} messages
                        </p>
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className={`flex items-center gap-1 transition-opacity ${
                    editingId === session.id ? 'hidden' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    <button
                      onClick={(e) => handleStartRename(session, e)}
                      className="p-1.5 hover:bg-dark-600 rounded-lg text-dark-400 hover:text-dark-200"
                      title="Rename"
                    >
                      <Edit3 size={12} />
                    </button>
                    <button
                      onClick={(e) => handleDuplicate(session.id, e)}
                      className="p-1.5 hover:bg-dark-600 rounded-lg text-dark-400 hover:text-dark-200"
                      title="Duplicate"
                    >
                      <Copy size={12} />
                    </button>
                    {!session.isArchived && (
                      <button
                        onClick={(e) => handleArchive(session.id, e)}
                        className="p-1.5 hover:bg-dark-600 rounded-lg text-dark-400 hover:text-dark-200"
                        title="Archive"
                      >
                        <Archive size={12} />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDelete(session.id, e)}
                      className="p-1.5 hover:bg-red-500/20 rounded-lg text-dark-400 hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  <ChevronRight size={16} className={`flex-shrink-0 transition-colors ${
                    session.id === currentSessionId ? 'text-duo-green' : 'text-dark-600'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="px-4 py-3 border-t border-dark-700/50 bg-dark-850">
        <p className="text-xs text-dark-500 text-center">
          {sessions.filter(s => !s.isArchived).length} active chats • {sessions.filter(s => s.isArchived).length} archived
        </p>
      </div>
    </div>
  );
};

export default ChatHistory;
