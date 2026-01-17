import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Users, Link, Share2, QrCode } from 'lucide-react';
import { useCollaborationStore } from '../../stores';
import { useAuth } from '../../contexts/AuthContext';
import { collaborationService } from '../../services/collaboration';

interface CollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CollaborationModal: React.FC<CollaborationModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { sessionId, collaborators, isConnected } = useCollaborationStore();
  const [copied, setCopied] = useState(false);
  const [joinCode, setJoinCode] = useState('');

  const handleCreateSession = () => {
    if (user) {
      collaborationService.connect(user.id, user.displayName || 'Anonymous');
      collaborationService.createSession();
    }
  };

  const handleJoinSession = () => {
    if (user && joinCode) {
      collaborationService.connect(user.id, user.displayName || 'Anonymous');
      collaborationService.joinSession(joinCode.toUpperCase());
    }
  };

  const handleCopyLink = () => {
    if (sessionId) {
      const link = collaborationService.getSessionLink();
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLeaveSession = () => {
    collaborationService.leaveSession();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-dark-900 border border-dark-700 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-dark-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-forest-600/20 flex items-center justify-center">
                <Users className="text-forest-400" size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-dark-100">Collaborate</h2>
                <p className="text-xs text-dark-500">Work together in real-time</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-dark-800 rounded-lg text-dark-400 hover:text-dark-200"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {sessionId ? (
              // Active Session
              <div className="space-y-4">
                {/* Session Info */}
                <div className="p-4 bg-forest-600/10 border border-forest-600/30 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-forest-400 font-medium">Session Active</span>
                    <span className="flex items-center gap-1 text-xs text-forest-400">
                      <div className="w-2 h-2 rounded-full bg-forest-500 animate-pulse" />
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-dark-800 rounded-lg text-lg font-mono text-dark-100 tracking-widest">
                      {sessionId}
                    </code>
                    <button
                      onClick={handleCopyLink}
                      className="p-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors"
                    >
                      {copied ? (
                        <Check size={18} className="text-forest-400" />
                      ) : (
                        <Copy size={18} className="text-dark-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Collaborators */}
                <div>
                  <h3 className="text-sm font-medium text-dark-300 mb-2">
                    Collaborators ({collaborators.length + 1})
                  </h3>
                  <div className="space-y-2">
                    {/* Current User */}
                    <div className="flex items-center gap-3 p-2 bg-dark-800 rounded-lg">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                        style={{ backgroundColor: '#22c55e' }}
                      >
                        {user?.displayName?.charAt(0) || 'Y'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-dark-100">{user?.displayName || 'You'}</p>
                        <p className="text-xs text-dark-500">You (Host)</p>
                      </div>
                    </div>

                    {/* Other Collaborators */}
                    {collaborators.map((collaborator) => (
                      <div
                        key={collaborator.id}
                        className="flex items-center gap-3 p-2 bg-dark-800 rounded-lg"
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                          style={{ backgroundColor: collaborator.color }}
                        >
                          {collaborator.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-dark-100">{collaborator.name}</p>
                        </div>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            collaborator.isActive ? 'bg-forest-500' : 'bg-dark-600'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <button
                  onClick={handleLeaveSession}
                  className="w-full btn-secondary text-red-400 hover:text-red-300"
                >
                  Leave Session
                </button>
              </div>
            ) : (
              // No Active Session
              <div className="space-y-4">
                {/* Create Session */}
                <div>
                  <h3 className="text-sm font-medium text-dark-300 mb-2">Start a new session</h3>
                  <button
                    onClick={handleCreateSession}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    <Share2 size={18} />
                    Create Collaboration Session
                  </button>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-dark-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-dark-900 text-dark-500">or</span>
                  </div>
                </div>

                {/* Join Session */}
                <div>
                  <h3 className="text-sm font-medium text-dark-300 mb-2">Join existing session</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      placeholder="Enter session code"
                      maxLength={6}
                      className="flex-1 input-field font-mono uppercase tracking-widest text-center"
                    />
                    <button
                      onClick={handleJoinSession}
                      disabled={joinCode.length !== 6}
                      className="btn-secondary disabled:opacity-50"
                    >
                      Join
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3 bg-dark-800 rounded-lg">
                  <p className="text-xs text-dark-400">
                    <strong className="text-dark-300">How it works:</strong> Create a session and share 
                    the code with your friends. Everyone can see each other's cursors and changes in real-time!
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CollaborationModal;
