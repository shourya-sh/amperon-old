import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Users, Lock, AlertCircle, ArrowLeft, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import liveShareService from '../services/liveShareService';

interface ProjectInfo {
  name: string;
  ownerName: string;
  isPublic: boolean;
  allowEditing: boolean;
  activeUserCount: number;
}

const SharedProjectPage: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    const fetchProjectInfo = async () => {
      if (!shareId) {
        setError('Invalid share link');
        setIsLoading(false);
        return;
      }

      try {
        const info = await liveShareService.getProjectInfo(shareId);
        if (info) {
          setProjectInfo(info);
        } else {
          setError('Project not found or has been deleted');
        }
      } catch (err) {
        setError('Failed to load project information');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectInfo();
  }, [shareId]);

  const handleJoinProject = async () => {
    if (!shareId || !user) return;

    setIsJoining(true);
    setError(null);

    try {
      // Initialize user in live share service
      liveShareService.setUser(user.id, user.displayName || user.email || 'Anonymous');
      
      // Join the session
      const success = await liveShareService.joinSession(
        shareId, 
        projectInfo?.allowEditing ? 'edit' : 'view'
      );

      if (success) {
        // Navigate to designer page
        navigate('/designer');
      } else {
        setError('Failed to join the project. Please try again.');
      }
    } catch (err) {
      setError('Failed to join the project');
      console.error(err);
    } finally {
      setIsJoining(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-duo-green animate-spin mx-auto mb-4" />
          <p className="text-dark-300">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-800 rounded-2xl border border-dark-700 p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Unable to Join Project</h1>
          <p className="text-dark-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-3 bg-dark-700 text-white rounded-xl hover:bg-dark-600 transition-colors mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Home
          </button>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-800 rounded-2xl border border-dark-700 p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-full bg-duo-green/10 flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-duo-green" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Sign In Required</h1>
          <p className="text-dark-400 mb-2">
            You've been invited to collaborate on:
          </p>
          <p className="text-lg font-semibold text-duo-green mb-6">
            {projectInfo?.name || 'A Circuit Project'}
          </p>
          <p className="text-dark-500 text-sm mb-6">
            Sign in to join this shared project and collaborate in real-time.
          </p>
          <button
            onClick={() => navigate('/auth', { state: { returnTo: `/project/${shareId}` } })}
            className="w-full py-3 bg-duo-green text-dark-900 font-semibold rounded-xl hover:bg-duo-green/90 transition-colors"
          >
            Sign In to Join
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 mt-3 text-dark-400 hover:text-dark-200 transition-colors"
          >
            Go Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-800 rounded-2xl border border-dark-700 p-8 max-w-md w-full"
      >
        {/* Project Info */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-duo-green/10 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-duo-green" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">{projectInfo?.name}</h1>
          <p className="text-dark-400">by {projectInfo?.ownerName}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-dark-900 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Users className="w-4 h-4 text-duo-green" />
              <span className="text-xl font-bold text-white">
                {projectInfo?.activeUserCount || 0}
              </span>
            </div>
            <p className="text-xs text-dark-400">Currently Online</p>
          </div>
          <div className="bg-dark-900 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Lock className={`w-4 h-4 ${projectInfo?.allowEditing ? 'text-duo-green' : 'text-amber-400'}`} />
              <span className="text-xl font-bold text-white">
                {projectInfo?.allowEditing ? 'Edit' : 'View'}
              </span>
            </div>
            <p className="text-xs text-dark-400">Your Permission</p>
          </div>
        </div>

        {/* Join Button */}
        <button
          onClick={handleJoinProject}
          disabled={isJoining}
          className="w-full py-4 bg-duo-green text-dark-900 font-bold rounded-xl hover:bg-duo-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
        >
          {isJoining ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Joining...
            </>
          ) : (
            <>
              <Users className="w-5 h-5" />
              Join Project
            </>
          )}
        </button>

        {/* Info */}
        <p className="text-xs text-dark-500 text-center mt-4">
          You'll be able to see other collaborators' cursors and changes in real-time
        </p>

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="w-full py-2 mt-4 text-dark-400 hover:text-dark-200 transition-colors text-sm"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
};

export default SharedProjectPage;
