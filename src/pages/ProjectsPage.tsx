import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderOpen, 
  Plus, 
  Search, 
  MoreHorizontal,
  Clock,
  Trash2,
  Copy,
  Share,
  Edit2,
  Grid,
  List,
  Zap,
  MessageSquare,
  Save,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import { useProjectStore, useCircuitStore, useChatStore } from '../stores';
import { useAuth } from '../contexts/AuthContext';
import type { Project, ChatSession } from '../types';

// Extended project type with chat session
interface ExtendedProject extends Project {
  chatSessionId?: string;
  chatSession?: ChatSession;
}

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    projects, 
    currentProjectId,
    addProject, 
    deleteProject, 
    updateProject,
    setCurrentProjectId,
    isLoading 
  } = useProjectStore();
  const { nodes, edges, loadProject, clearCanvas } = useCircuitStore();
  const { sessions, currentSessionId, switchSession, createSession } = useChatStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  // Filter projects based on search
  const filteredProjects = (projects as ExtendedProject[]).filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Create a new project
  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;

    const currentSession = sessions.find(s => s.id === currentSessionId);
    const projectId = 'project-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    const newProject: ExtendedProject = {
      id: projectId,
      name: newProjectName.trim(),
      description: newProjectDescription.trim() || 'No description',
      userId: user?.id || 'local',
      nodes: [...nodes],
      edges: [...edges],
      createdAt: new Date(),
      updatedAt: new Date(),
      collaborators: [],
      isPublic: false,
      chatSessionId: currentSessionId || undefined,
      chatSession: currentSession ? { ...currentSession } : undefined,
    };

    addProject(newProject);
    setShowNewProjectModal(false);
    setNewProjectName('');
    setNewProjectDescription('');
  };

  // Open a project
  const handleOpenProject = (project: ExtendedProject) => {
    loadProject(project.nodes, project.edges);
    setCurrentProjectId(project.id);
    
    if (project.chatSessionId) {
      const sessionExists = sessions.some(s => s.id === project.chatSessionId);
      if (sessionExists) {
        switchSession(project.chatSessionId);
      }
    }
    
    navigate('/');
  };

  // Delete a project
  const handleDeleteProject = (id: string) => {
    deleteProject(id);
    setProjectToDelete(null);
  };

  // Duplicate a project
  const handleDuplicateProject = (project: ExtendedProject) => {
    const duplicateId = 'project-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    const duplicatedProject: ExtendedProject = {
      ...project,
      id: duplicateId,
      name: project.name + ' (Copy)',
      createdAt: new Date(),
      updatedAt: new Date(),
      chatSessionId: undefined,
      chatSession: undefined,
    };
    addProject(duplicatedProject);
  };

  // Start editing a project name
  const handleStartEdit = (project: ExtendedProject) => {
    setEditingProject(project.id);
    setEditName(project.name);
  };

  // Save project name edit
  const handleSaveEdit = (id: string) => {
    if (editName.trim()) {
      updateProject(id, { name: editName.trim() });
    }
    setEditingProject(null);
    setEditName('');
  };

  // Create new project from scratch
  const handleNewFromScratch = () => {
    clearCanvas();
    const newSessionId = createSession('New Project');
    const newProjectId = 'project-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    const newProject: ExtendedProject = {
      id: newProjectId,
      name: 'Untitled Project',
      description: 'A new circuit project',
      userId: user?.id || 'local',
      nodes: [],
      edges: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      collaborators: [],
      isPublic: false,
      chatSessionId: newSessionId,
    };

    addProject(newProject);
    setCurrentProjectId(newProject.id);
    navigate('/');
  };

  return (
    <div className="h-full overflow-y-auto bg-dark-900">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-dark-100 mb-2">Your Projects</h1>
          <p className="text-dark-400 text-base">Create, manage, and share your circuit designs</p>
        </motion.div>

        {/* Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-12 pr-4 py-3 bg-dark-850 border-2 border-dark-700 rounded-xl text-dark-100 placeholder-dark-500 focus:outline-none focus:border-duo-green/50 transition-all"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-dark-850 border-2 border-dark-700 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-duo-green/20 text-duo-green' : 'text-dark-500 hover:text-dark-300'
                }`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-duo-green/20 text-duo-green' : 'text-dark-500 hover:text-dark-300'
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {(nodes.length > 0 || edges.length > 0) && (
              <button 
                onClick={() => setShowNewProjectModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-dark-800 border-2 border-dark-700 rounded-xl text-dark-200 hover:border-duo-green/50 hover:text-duo-green transition-all"
              >
                <Save size={18} />
                Save Current
              </button>
            )}
            
            <button 
              onClick={handleNewFromScratch}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={18} />
              New Project
            </button>
          </div>
        </motion.div>

        {/* Projects Grid/List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-duo-green border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-2xl bg-dark-800 border-2 border-dark-700 flex items-center justify-center mx-auto mb-5">
              <FolderOpen className="text-dark-500" size={32} />
            </div>
            <h3 className="text-xl font-display font-bold text-dark-200 mb-2">
              {searchQuery ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="text-dark-500 mb-6">
              {searchQuery ? 'Try a different search term' : 'Start building your first circuit!'}
            </p>
            {!searchQuery && (
              <button onClick={handleNewFromScratch} className="btn-primary">
                <Plus size={18} className="mr-2" />
                Create your first project
              </button>
            )}
          </motion.div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProjectCard 
                  project={project}
                  isActive={project.id === currentProjectId}
                  isEditing={editingProject === project.id}
                  editName={editName}
                  onEditNameChange={setEditName}
                  onOpen={() => handleOpenProject(project)}
                  onDelete={() => setProjectToDelete(project.id)}
                  onDuplicate={() => handleDuplicateProject(project)}
                  onStartEdit={() => handleStartEdit(project)}
                  onSaveEdit={() => handleSaveEdit(project.id)}
                  onCancelEdit={() => setEditingProject(null)}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <ProjectListItem 
                  project={project}
                  isActive={project.id === currentProjectId}
                  onOpen={() => handleOpenProject(project)}
                  onDelete={() => setProjectToDelete(project.id)}
                  onDuplicate={() => handleDuplicateProject(project)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* New Project Modal */}
      <AnimatePresence>
        {showNewProjectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewProjectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-dark-850 border-2 border-dark-700 rounded-2xl p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-display font-bold text-dark-100 mb-4">
                Save Current Circuit as Project
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="My Awesome Circuit"
                    className="w-full px-4 py-3 bg-dark-800 border-2 border-dark-700 rounded-xl text-dark-100 placeholder-dark-500 focus:outline-none focus:border-duo-green/50 transition-all"
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    placeholder="Describe what this circuit does..."
                    rows={3}
                    className="w-full px-4 py-3 bg-dark-800 border-2 border-dark-700 rounded-xl text-dark-100 placeholder-dark-500 focus:outline-none focus:border-duo-green/50 transition-all resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 p-3 bg-dark-800 rounded-xl">
                  <Zap size={18} className="text-duo-green" />
                  <span className="text-sm text-dark-300">
                    {nodes.length} components, {edges.length} connections
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2.5 text-dark-400 hover:text-dark-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateProject}
                  disabled={!newProjectName.trim()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={18} className="mr-2" />
                  Save Project
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {projectToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setProjectToDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-dark-850 border-2 border-dark-700 rounded-2xl p-6 w-full max-w-sm"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-duo-red/20 flex items-center justify-center">
                  <AlertCircle className="text-duo-red" size={20} />
                </div>
                <h2 className="text-xl font-display font-bold text-dark-100">
                  Delete Project?
                </h2>
              </div>
              
              <p className="text-dark-400 mb-6">
                This action cannot be undone. The project and all its data will be permanently deleted.
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setProjectToDelete(null)}
                  className="px-4 py-2.5 text-dark-400 hover:text-dark-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteProject(projectToDelete)}
                  className="px-4 py-2.5 bg-duo-red text-white rounded-xl hover:bg-duo-red/80 transition-colors"
                >
                  <Trash2 size={18} className="mr-2 inline" />
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ProjectCardProps {
  project: ExtendedProject;
  isActive: boolean;
  isEditing: boolean;
  editName: string;
  onEditNameChange: (name: string) => void;
  onOpen: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  isActive, 
  isEditing,
  editName,
  onEditNameChange,
  onOpen, 
  onDelete, 
  onDuplicate,
  onStartEdit,
  onSaveEdit,
  onCancelEdit
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`bg-dark-850 border-2 rounded-2xl overflow-hidden transition-all group cursor-pointer ${
        isActive 
          ? 'border-duo-green/50 ring-2 ring-duo-green/20' 
          : 'border-dark-700 hover:border-duo-green/30'
      }`}
      onClick={onOpen}
    >
      {/* Thumbnail */}
      <div className="h-36 bg-dark-800 circuit-grid relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-duo-green/10 border-2 border-duo-green/20 flex items-center justify-center">
            <Zap size={28} className="text-duo-green" />
          </div>
        </div>
        
        {/* Component count badge */}
        <div className="absolute bottom-3 left-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-dark-900/80 backdrop-blur-sm rounded-lg text-xs font-display font-medium text-dark-300">
            <Zap size={12} />
            {project.nodes.length} components
          </div>
        </div>
        
        {/* Menu Button */}
        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="p-2.5 bg-dark-900/80 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity text-dark-400 hover:text-dark-200"
          >
            <MoreHorizontal size={18} />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-44 bg-dark-850 border-2 border-dark-700 rounded-xl shadow-xl overflow-hidden z-10 p-1"
                onClick={e => e.stopPropagation()}
              >
                <button 
                  onClick={() => { onStartEdit(); setShowMenu(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-display font-medium text-dark-300 hover:bg-dark-800 rounded-lg transition-colors"
                >
                  <Edit2 size={16} />
                  Rename
                </button>
                <button 
                  onClick={() => { onDuplicate(); setShowMenu(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-display font-medium text-dark-300 hover:bg-dark-800 rounded-lg transition-colors"
                >
                  <Copy size={16} />
                  Duplicate
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-display font-medium text-dark-300 hover:bg-dark-800 rounded-lg transition-colors">
                  <Share size={16} />
                  Share
                </button>
                <button 
                  onClick={() => { onDelete(); setShowMenu(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-display font-medium text-duo-red hover:bg-duo-red/10 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Active badge */}
        {isActive && (
          <div className="absolute top-3 left-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-duo-green/20 rounded-lg text-xs font-display font-semibold text-duo-green">
              <Check size={12} />
              Active
            </div>
          </div>
        )}

        {/* Chat session indicator */}
        {project.chatSession && (
          <div className="absolute bottom-3 right-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-dark-900/80 backdrop-blur-sm rounded-lg text-xs font-display font-medium text-dark-300">
              <MessageSquare size={12} />
              {project.chatSession.messages.length} messages
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {isEditing ? (
          <div className="flex items-center gap-2 mb-1.5" onClick={e => e.stopPropagation()}>
            <input
              type="text"
              value={editName}
              onChange={(e) => onEditNameChange(e.target.value)}
              className="flex-1 px-2 py-1 bg-dark-800 border border-dark-600 rounded-lg text-dark-100 text-sm font-display font-bold focus:outline-none focus:border-duo-green/50"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSaveEdit();
                if (e.key === 'Escape') onCancelEdit();
              }}
            />
            <button onClick={onSaveEdit} className="p-1 text-duo-green hover:bg-duo-green/20 rounded">
              <Check size={16} />
            </button>
            <button onClick={onCancelEdit} className="p-1 text-dark-400 hover:bg-dark-700 rounded">
              <X size={16} />
            </button>
          </div>
        ) : (
          <h3 className="font-display font-bold text-dark-100 mb-1.5 group-hover:text-duo-green transition-colors">
            {project.name}
          </h3>
        )}
        <p className="text-sm text-dark-500 line-clamp-2 mb-4">{project.description}</p>
        
        <div className="flex items-center gap-2 text-xs font-display text-dark-500">
          <Clock size={14} />
          Updated {new Date(project.updatedAt).toLocaleDateString()}
        </div>
      </div>
    </motion.div>
  );
};

interface ProjectListItemProps {
  project: ExtendedProject;
  isActive: boolean;
  onOpen: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

const ProjectListItem: React.FC<ProjectListItemProps> = ({ 
  project, 
  isActive,
  onOpen, 
  onDelete, 
  onDuplicate 
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div 
      className={`flex items-center gap-4 p-4 bg-dark-850 border-2 rounded-2xl transition-all group cursor-pointer ${
        isActive 
          ? 'border-duo-green/50 ring-2 ring-duo-green/20' 
          : 'border-dark-700 hover:border-duo-green/30'
      }`}
      onClick={onOpen}
    >
      {/* Icon */}
      <div className="w-14 h-14 rounded-xl bg-duo-green/10 border-2 border-duo-green/20 flex items-center justify-center">
        <Zap size={24} className="text-duo-green" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-display font-bold text-dark-100 group-hover:text-duo-green transition-colors truncate">
            {project.name}
          </h3>
          {isActive && (
            <span className="px-2 py-0.5 bg-duo-green/20 rounded text-xs font-display font-semibold text-duo-green">
              Active
            </span>
          )}
        </div>
        <p className="text-sm text-dark-500 truncate">{project.description}</p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-dark-500">
        <div className="flex items-center gap-1.5">
          <Zap size={14} />
          {project.nodes.length}
        </div>
        {project.chatSession && (
          <div className="flex items-center gap-1.5">
            <MessageSquare size={14} />
            {project.chatSession.messages.length}
          </div>
        )}
      </div>

      {/* Updated */}
      <div className="text-sm font-display text-dark-500 whitespace-nowrap">
        {new Date(project.updatedAt).toLocaleDateString()}
      </div>

      {/* Actions */}
      <div className="relative">
        <button 
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          className="p-2.5 hover:bg-dark-800 rounded-xl text-dark-500 hover:text-dark-300 transition-colors"
        >
          <MoreHorizontal size={18} />
        </button>
        
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-44 bg-dark-850 border-2 border-dark-700 rounded-xl shadow-xl overflow-hidden z-10 p-1"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => { onDuplicate(); setShowMenu(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-display font-medium text-dark-300 hover:bg-dark-800 rounded-lg transition-colors"
              >
                <Copy size={16} />
                Duplicate
              </button>
              <button 
                onClick={() => { onDelete(); setShowMenu(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-display font-medium text-duo-red hover:bg-duo-red/10 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProjectsPage;
