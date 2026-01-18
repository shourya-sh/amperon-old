import React, { useState } from 'react';
import { 
  Save, 
  RotateCcw, 
  Trash2, 
  Edit3, 
  Check, 
  X,
  History,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Clock
} from 'lucide-react';
import { useChatStore, useCircuitStore } from '../../stores';
import type { ChatCheckpoint, CanvasNode, CanvasEdge } from '../../types';

interface CheckpointManagerProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

const CheckpointManager: React.FC<CheckpointManagerProps> = ({ 
  isExpanded = false, 
  onToggle 
}) => {
  const { 
    getCurrentSession, 
    createCheckpoint, 
    deleteCheckpoint, 
    renameCheckpoint 
  } = useChatStore();
  const { nodes, edges, loadProject, triggerFitView } = useCircuitStore();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newCheckpointName, setNewCheckpointName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [confirmRestore, setConfirmRestore] = useState<string | null>(null);

  const session = getCurrentSession();
  const checkpoints = session?.checkpoints || [];

  const handleCreateCheckpoint = () => {
    if (!newCheckpointName.trim()) return;
    
    createCheckpoint(newCheckpointName.trim(), nodes, edges);
    setNewCheckpointName('');
    setIsCreating(false);
  };

  const handleQuickSave = () => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    createCheckpoint(`Checkpoint ${timestamp}`, nodes, edges, undefined, true);
  };

  const handleRestore = (checkpoint: ChatCheckpoint) => {
    loadProject(
      checkpoint.nodes as CanvasNode[], 
      checkpoint.edges as CanvasEdge[]
    );
    setTimeout(() => triggerFitView(), 100);
    setConfirmRestore(null);
  };

  const handleDelete = (checkpointId: string) => {
    if (confirm('Delete this checkpoint? This cannot be undone.')) {
      deleteCheckpoint(checkpointId);
    }
  };

  const handleStartRename = (checkpoint: ChatCheckpoint) => {
    setEditingId(checkpoint.id);
    setEditName(checkpoint.name);
  };

  const handleSaveRename = (checkpointId: string) => {
    if (editName.trim()) {
      renameCheckpoint(checkpointId, editName.trim());
    }
    setEditingId(null);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    return isToday ? 'Today' : date.toLocaleDateString();
  };

  if (!isExpanded) {
    return (
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-3 py-2 bg-dark-800/50 hover:bg-dark-800 border border-dark-700/50 rounded-xl text-sm transition-all group"
      >
        <div className="flex items-center gap-2 text-dark-400 group-hover:text-dark-300">
          <Bookmark size={14} className="text-amber-500" />
          <span className="font-display font-medium">Checkpoints</span>
          {checkpoints.length > 0 && (
            <span className="px-1.5 py-0.5 text-xs bg-amber-500/20 text-amber-400 rounded-full font-medium">
              {checkpoints.length}
            </span>
          )}
        </div>
        <ChevronDown size={14} className="text-dark-500" />
      </button>
    );
  }

  return (
    <div className="bg-dark-850/80 border-2 border-dark-700/50 rounded-xl overflow-hidden">
      {/* Header */}
      <div 
        onClick={onToggle}
        className="flex items-center justify-between px-3 py-2.5 bg-dark-800 border-b border-dark-700/50 cursor-pointer hover:bg-dark-750 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Bookmark size={14} className="text-amber-500" />
          <span className="font-display font-semibold text-sm text-dark-200">Checkpoints</span>
          {checkpoints.length > 0 && (
            <span className="px-1.5 py-0.5 text-xs bg-amber-500/20 text-amber-400 rounded-full font-medium">
              {checkpoints.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleQuickSave();
            }}
            disabled={nodes.length === 0}
            className="p-1.5 hover:bg-dark-600 rounded-lg text-dark-400 hover:text-duo-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Quick save checkpoint"
          >
            <Save size={14} />
          </button>
          <ChevronUp size={14} className="text-dark-500" />
        </div>
      </div>

      {/* Content */}
      <div className="p-2 max-h-64 overflow-y-auto">
        {/* Create new checkpoint */}
        {isCreating ? (
          <div className="p-2 bg-dark-800 rounded-lg mb-2">
            <input
              type="text"
              placeholder="Checkpoint name..."
              value={newCheckpointName}
              onChange={(e) => setNewCheckpointName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateCheckpoint();
                if (e.key === 'Escape') setIsCreating(false);
              }}
              autoFocus
              className="w-full px-2 py-1.5 bg-dark-700 border border-dark-600 rounded-lg text-sm text-dark-100 placeholder-dark-500 focus:outline-none focus:border-duo-green"
            />
            <div className="flex gap-1 mt-2">
              <button
                onClick={handleCreateCheckpoint}
                disabled={!newCheckpointName.trim()}
                className="flex-1 px-2 py-1.5 bg-duo-green hover:bg-duo-greenDark text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
              >
                Save
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="px-2 py-1.5 bg-dark-700 hover:bg-dark-600 text-dark-300 rounded-lg text-xs font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            disabled={nodes.length === 0}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-dark-800 hover:bg-dark-750 border border-dashed border-dark-600 hover:border-duo-green/50 rounded-lg text-sm text-dark-400 hover:text-dark-300 transition-all mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={14} />
            <span>Save Checkpoint</span>
          </button>
        )}

        {/* Checkpoints list */}
        {checkpoints.length === 0 ? (
          <div className="py-6 text-center">
            <History size={24} className="mx-auto mb-2 text-dark-600" />
            <p className="text-xs text-dark-500">No checkpoints yet</p>
            <p className="text-xs text-dark-600 mt-1">Save your circuit state to restore later</p>
          </div>
        ) : (
          <div className="space-y-1">
            {[...checkpoints].reverse().map((checkpoint) => (
              <div
                key={checkpoint.id}
                className="group relative p-2 bg-dark-800/50 hover:bg-dark-800 rounded-lg transition-colors"
              >
                {confirmRestore === checkpoint.id ? (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-amber-400">Restore this checkpoint?</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleRestore(checkpoint)}
                        className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded text-xs font-medium"
                      >
                        Restore
                      </button>
                      <button
                        onClick={() => setConfirmRestore(null)}
                        className="px-2 py-1 bg-dark-700 hover:bg-dark-600 text-dark-300 rounded text-xs font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : editingId === checkpoint.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveRename(checkpoint.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      autoFocus
                      className="flex-1 px-2 py-1 bg-dark-700 border border-dark-600 rounded text-xs text-dark-100 focus:outline-none focus:border-duo-green"
                    />
                    <button
                      onClick={() => handleSaveRename(checkpoint.id)}
                      className="p-1 hover:bg-dark-600 rounded text-duo-green"
                    >
                      <Check size={12} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1 hover:bg-dark-600 rounded text-dark-400"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium truncate ${
                          checkpoint.isAutoSave ? 'text-dark-400' : 'text-dark-200'
                        }`}>
                          {checkpoint.name}
                        </span>
                        {checkpoint.isAutoSave && (
                          <span className="px-1 py-0.5 text-[10px] bg-dark-700 text-dark-500 rounded">
                            auto
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-dark-500">
                        <Clock size={10} />
                        <span>{formatDate(checkpoint.timestamp)} at {formatTime(checkpoint.timestamp)}</span>
                        <span>•</span>
                        <span>{checkpoint.nodes.length} components</span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setConfirmRestore(checkpoint.id)}
                        className="p-1.5 hover:bg-amber-500/20 rounded text-dark-400 hover:text-amber-400 transition-colors"
                        title="Restore checkpoint"
                      >
                        <RotateCcw size={12} />
                      </button>
                      <button
                        onClick={() => handleStartRename(checkpoint)}
                        className="p-1.5 hover:bg-dark-600 rounded text-dark-400 hover:text-dark-200 transition-colors"
                        title="Rename"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(checkpoint.id)}
                        className="p-1.5 hover:bg-red-500/20 rounded text-dark-400 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckpointManager;
