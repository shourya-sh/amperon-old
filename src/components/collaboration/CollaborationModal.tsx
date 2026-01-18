import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Users, Share2 } from 'lucide-react';
import { useCollaborationStore } from '../../stores';
import { useAuth } from '../../contexts/AuthContext';
import { collaborationService } from '../../services/collaboration';

interface CollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CollaborationModal: React.FC<CollaborationModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { sessionId, collaborators } = useCollaborationStore();
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
          className="w-full max-w-md bg-dark-900 border-2 border-dark-700 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b-2 border-dark-800 bg-dark-850">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-duo-blue/10 border-2 border-duo-blue/20 flex items-center justify-center">
                <Users className="text-duo-blue" size={22} />
              </div>
              <div>
                <h2 className="font-display font-bold text-dark-100 text-lg">Collaborate</h2>
                <p className="text-sm text-dark-500">Work together in real-time!</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 hover:bg-dark-800 rounded-xl text-dark-400 hover:text-dark-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-5">
            {sessionId ? (
              // Active Session
              <div className="space-y-5">
                {/* Session Info */}
                <div className="p-4 bg-duo-green/10 border-2 border-duo-green/20 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-display font-bold text-duo-green">Session Active</span>
                    <span className="flex items-center gap-1.5 text-xs font-display font-medium text-duo-green">
                      <div className="w-2.5 h-2.5 rounded-full bg-duo-green animate-pulse" />
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-4 py-3 bg-dark-800 border-2 border-dark-700 rounded-xl text-lg font-mono text-dark-100 tracking-widest">
                      {sessionId}
                    </code>
                    <button
                      onClick={handleCopyLink}
                      className="p-3 bg-dark-800 hover:bg-dark-750 border-2 border-dark-700 rounded-xl transition-colors"
                    >
                      {copied ? (
                        <Check size={20} className="text-duo-green" />
                      ) : (
                        <Copy size={20} className="text-dark-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Collaborators */}
                <div>
                  <h3 className="text-sm font-display font-bold text-dark-300 mb-3">
                    Collaborators ({collaborators.length + 1})
                  </h3>
                  <div className="space-y-2">
                    {/* Current User */}
                    <div className="flex items-center gap-3 p-3 bg-dark-800 border-2 border-dark-700 rounded-xl">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-display font-bold"
                        style={{ backgroundColor: '#4ade80' }}
                      >
                        {user?.displayName?.charAt(0) || 'Y'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-display font-semibold text-dark-100">{user?.displayName || 'You'}</p>
                        <p className="text-xs font-display text-dark-500">You (Host)</p>
                      </div>
                    </div>

                    {/* Other Collaborators */}
                    {collaborators.map((collaborator) => (
                      <div
                        key={collaborator.id}
                        className="flex items-center gap-3 p-3 bg-dark-800 border-2 border-dark-700 rounded-xl"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-display font-bold"
                          style={{ backgroundColor: collaborator.color }}
                        >
                          {collaborator.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-display font-semibold text-dark-100">{collaborator.name}</p>
                        </div>
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            collaborator.isActive ? 'bg-duo-green' : 'bg-dark-600'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <button
                  onClick={handleLeaveSession}
                  className="w-full px-4 py-3 bg-duo-red/10 hover:bg-duo-red/20 border-2 border-duo-red/20 hover:border-duo-red/40 rounded-xl font-display font-bold text-duo-red transition-all"
                >
                  Leave Session
                </button>
              </div>
            ) : (
              // No Active Session
              <div className="space-y-5">
                {/* Create Session */}
                <div>
                  <h3 className="text-sm font-display font-bold text-dark-300 mb-3">Start a new session</h3>
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
                    <div className="w-full border-t-2 border-dark-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-dark-900 font-display font-medium text-dark-500">or</span>
                  </div>
                </div>

                {/* Join Session */}
                <div>
                  <h3 className="text-sm font-display font-bold text-dark-300 mb-3">Join existing session</h3>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      maxLength={6}
                      className="flex-1 input-field font-mono uppercase tracking-widest text-center text-lg"
                    />
                    <button
                      onClick={handleJoinSession}
                      disabled={joinCode.length !== 6}
                      className="btn-secondary disabled:opacity-50 px-6"
                    >
                      Join
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 bg-duo-blue/10 border-2 border-duo-blue/20 rounded-xl">
                  <p className="text-sm text-dark-300">
                    <strong className="font-display font-bold text-duo-blue">How it works:</strong>{' '}
                    Create a session and share the code with your friends. Everyone can see each other's cursors and changes in real-time!
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
