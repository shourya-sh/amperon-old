import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Link, 
  Copy, 
  Check, 
  Globe, 
  Lock, 
  Users, 
  Edit3, 
  Eye,
  Loader2,
  Share2
} from 'lucide-react';
import { useLiveShareStore, useCircuitStore } from '../../stores';
import { useAuth } from '../../contexts/AuthContext';
import liveShareService from '../../services/liveShareService';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { nodes, edges } = useCircuitStore();
  const { isLiveSession, shareId, activeUsers, permission } = useLiveShareStore();
  
  const [projectName, setProjectName] = useState('My Circuit Project');
  const [isPublic, setIsPublic] = useState(false);
  const [allowEditing, setAllowEditing] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shareUrl = shareId 
    ? `${window.location.origin}/project/${shareId}` 
    : null;

  const handleCreateShare = async () => {
    if (!user) {
      setError('Please sign in to share your project');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      // Initialize user in service
      liveShareService.setUser(user.id, user.displayName || user.email || 'Anonymous');
      
      // Create shared project
      await liveShareService.createSharedProject(
        projectName,
        '',
        nodes,
        edges,
        isPublic,
        allowEditing
      );
    } catch (err) {
      setError('Failed to create share link. Please try again.');
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleStopSharing = async () => {
    await liveShareService.leaveSession();
  };

  const handleUpdateSettings = async () => {
    try {
      await liveShareService.updateProjectSettings({
        name: projectName,
        isPublic,
        allowEditing
      });
    } catch (err) {
      console.error('Failed to update settings:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-md shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-dark-700">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-duo-green/10">
                <Share2 className="w-5 h-5 text-duo-green" />
              </div>
              <h2 className="text-lg font-semibold text-white">Share Project</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-dark-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {!isLiveSession ? (
              // Create share form
              <>
                {/* Project Name */}
                <div>
                  <label className="block text-sm text-dark-300 mb-2">Project Name</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-dark-900 border border-dark-600 rounded-xl text-white placeholder-dark-500 focus:border-duo-green focus:outline-none transition-colors"
                    placeholder="Enter project name"
                  />
                </div>

                {/* Visibility Toggle */}
                <div className="flex items-center justify-between p-3 bg-dark-900 rounded-xl">
                  <div className="flex items-center gap-3">
                    {isPublic ? (
                      <Globe className="w-5 h-5 text-duo-green" />
                    ) : (
                      <Lock className="w-5 h-5 text-dark-400" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">
                        {isPublic ? 'Public' : 'Private'}
                      </p>
                      <p className="text-xs text-dark-400">
                        {isPublic 
                          ? 'Anyone with the link can access' 
                          : 'Only invited users can access'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsPublic(!isPublic)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      isPublic ? 'bg-duo-green' : 'bg-dark-600'
                    }`}
                  >
                    <motion.div
                      className="absolute top-1 w-4 h-4 bg-white rounded-full"
                      animate={{ left: isPublic ? '28px' : '4px' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                {/* Editing Permission */}
                <div className="flex items-center justify-between p-3 bg-dark-900 rounded-xl">
                  <div className="flex items-center gap-3">
                    {allowEditing ? (
                      <Edit3 className="w-5 h-5 text-duo-green" />
                    ) : (
                      <Eye className="w-5 h-5 text-dark-400" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">
                        {allowEditing ? 'Can Edit' : 'View Only'}
                      </p>
                      <p className="text-xs text-dark-400">
                        {allowEditing 
                          ? 'Collaborators can modify the circuit' 
                          : 'Collaborators can only view'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setAllowEditing(!allowEditing)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      allowEditing ? 'bg-duo-green' : 'bg-dark-600'
                    }`}
                  >
                    <motion.div
                      className="absolute top-1 w-4 h-4 bg-white rounded-full"
                      animate={{ left: allowEditing ? '28px' : '4px' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                {error && (
                  <p className="text-sm text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">
                    {error}
                  </p>
                )}

                {/* Create Button */}
                <button
                  onClick={handleCreateShare}
                  disabled={isCreating || !user}
                  className="w-full py-3 bg-duo-green text-dark-900 font-semibold rounded-xl hover:bg-duo-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Link className="w-5 h-5" />
                      Create Share Link
                    </>
                  )}
                </button>

                {!user && (
                  <p className="text-xs text-dark-400 text-center">
                    Sign in to share your project with others
                  </p>
                )}
              </>
            ) : (
              // Active session view
              <>
                {/* Share Link */}
                <div>
                  <label className="block text-sm text-dark-300 mb-2">Share Link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={shareUrl || ''}
                      readOnly
                      className="flex-1 px-4 py-2.5 bg-dark-900 border border-dark-600 rounded-xl text-white text-sm truncate"
                    />
                    <button
                      onClick={handleCopyLink}
                      className={`px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                        copied 
                          ? 'bg-duo-green text-dark-900' 
                          : 'bg-dark-700 text-white hover:bg-dark-600'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Active Users */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-dark-400" />
                    <span className="text-sm text-dark-300">
                      {activeUsers.length + 1} {activeUsers.length === 0 ? 'person' : 'people'} in session
                    </span>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {/* Current user */}
                    <div className="flex items-center gap-3 p-2 bg-dark-900 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-duo-green flex items-center justify-center">
                        <span className="text-sm font-medium text-dark-900">
                          {user?.displayName?.charAt(0) || 'Y'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">You</p>
                        <p className="text-xs text-dark-400">Owner</p>
                      </div>
                      <span className="w-2 h-2 bg-duo-green rounded-full" />
                    </div>
                    
                    {/* Other users */}
                    {activeUsers.filter(u => u.isOnline).map((activeUser) => (
                      <div 
                        key={activeUser.id} 
                        className="flex items-center gap-3 p-2 bg-dark-900 rounded-lg"
                      >
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: activeUser.color }}
                        >
                          <span className="text-sm font-medium text-white">
                            {activeUser.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{activeUser.name}</p>
                          <p className="text-xs text-dark-400">
                            {activeUser.permission === 'edit' ? 'Can edit' : 'View only'}
                          </p>
                        </div>
                        <span className="w-2 h-2 bg-duo-green rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Your Permission */}
                <div className="flex items-center gap-2 p-3 bg-dark-900 rounded-xl">
                  {permission === 'edit' ? (
                    <Edit3 className="w-4 h-4 text-duo-green" />
                  ) : (
                    <Eye className="w-4 h-4 text-dark-400" />
                  )}
                  <span className="text-sm text-dark-300">
                    Your permission: <span className="text-white font-medium">
                      {permission === 'edit' ? 'Can Edit' : 'View Only'}
                    </span>
                  </span>
                </div>

                {/* Settings (for owner) */}
                {permission === 'edit' && (
                  <div className="space-y-3 pt-2 border-t border-dark-700">
                    <p className="text-xs text-dark-400 uppercase tracking-wider">Settings</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-dark-300">Allow editing</span>
                      <button
                        onClick={() => {
                          setAllowEditing(!allowEditing);
                          handleUpdateSettings();
                        }}
                        className={`relative w-10 h-5 rounded-full transition-colors ${
                          allowEditing ? 'bg-duo-green' : 'bg-dark-600'
                        }`}
                      >
                        <motion.div
                          className="absolute top-0.5 w-4 h-4 bg-white rounded-full"
                          animate={{ left: allowEditing ? '22px' : '2px' }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>
                  </div>
                )}

                {/* Stop Sharing */}
                <button
                  onClick={handleStopSharing}
                  className="w-full py-2.5 bg-red-500/10 text-red-400 font-medium rounded-xl hover:bg-red-500/20 transition-colors"
                >
                  Stop Sharing
                </button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ShareModal;
