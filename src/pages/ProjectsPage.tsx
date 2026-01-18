import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FolderOpen, 
  Plus, 
  Search, 
  MoreHorizontal,
  Clock,
  Users,
  Trash2,
  Copy,
  Share,
  Edit2,
  Grid,
  List,
  Zap
} from 'lucide-react';
import { useProjectStore } from '../stores';
import type { Project } from '../types';

const ProjectsPage: React.FC = () => {
  const { projects } = useProjectStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Demo projects for display
  const demoProjects: Project[] = [
    {
      id: '1',
      name: 'LED Flasher Circuit',
      description: 'A simple LED circuit that blinks using a 555 timer',
      userId: 'demo',
      nodes: [],
      edges: [],
      createdAt: new Date('2026-01-15'),
      updatedAt: new Date('2026-01-16'),
      collaborators: [],
      isPublic: true,
    },
    {
      id: '2',
      name: 'Traffic Light Simulator',
      description: 'Red, yellow, green LED sequence with timing control',
      userId: 'demo',
      nodes: [],
      edges: [],
      createdAt: new Date('2026-01-10'),
      updatedAt: new Date('2026-01-14'),
      collaborators: ['user2'],
      isPublic: false,
    },
    {
      id: '3',
      name: 'Touch Sensor with Transistor',
      description: 'A touch-activated LED using NPN transistor',
      userId: 'demo',
      nodes: [],
      edges: [],
      createdAt: new Date('2026-01-05'),
      updatedAt: new Date('2026-01-05'),
      collaborators: [],
      isPublic: true,
    },
  ];

  const allProjects = [...projects, ...demoProjects];
  
  const filteredProjects = allProjects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

          {/* New Project Button */}
          <button className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            New Project
          </button>
        </motion.div>

        {/* Projects Grid/List */}
        {filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-2xl bg-dark-800 border-2 border-dark-700 flex items-center justify-center mx-auto mb-5">
              <FolderOpen className="text-dark-500" size={32} />
            </div>
            <h3 className="text-xl font-display font-bold text-dark-200 mb-2">No projects yet</h3>
            <p className="text-dark-500 mb-6">Start building your first circuit!</p>
            <button className="btn-primary">
              <Plus size={18} className="mr-2" />
              Create your first project
            </button>
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
                <ProjectCard project={project} />
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
                <ProjectListItem project={project} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-dark-850 border-2 border-dark-700 rounded-2xl overflow-hidden hover:border-duo-green/30 transition-all group"
    >
      {/* Thumbnail */}
      <div className="h-36 bg-dark-800 circuit-grid relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-duo-green/10 border-2 border-duo-green/20 flex items-center justify-center">
            <Zap size={28} className="text-duo-green" />
          </div>
        </div>
        
        {/* Menu Button */}
        <div className="absolute top-3 right-3">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2.5 bg-dark-900/80 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity text-dark-400 hover:text-dark-200"
          >
            <MoreHorizontal size={18} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-dark-850 border-2 border-dark-700 rounded-xl shadow-xl overflow-hidden z-10 p-1">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-display font-medium text-dark-300 hover:bg-dark-800 rounded-lg transition-colors">
                <Edit2 size={16} />
                Rename
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-display font-medium text-dark-300 hover:bg-dark-800 rounded-lg transition-colors">
                <Copy size={16} />
                Duplicate
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-display font-medium text-dark-300 hover:bg-dark-800 rounded-lg transition-colors">
                <Share size={16} />
                Share
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-display font-medium text-duo-red hover:bg-duo-red/10 rounded-lg transition-colors">
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Collaborators badge */}
        {project.collaborators.length > 0 && (
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-900/80 backdrop-blur-sm rounded-full text-xs font-display font-semibold text-dark-300">
              <Users size={14} />
              {project.collaborators.length + 1}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-bold text-dark-100 mb-1.5 group-hover:text-duo-green transition-colors">
          {project.name}
        </h3>
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
  project: Project;
}

const ProjectListItem: React.FC<ProjectListItemProps> = ({ project }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-dark-850 border-2 border-dark-700 rounded-2xl hover:border-duo-green/30 transition-all group">
      {/* Icon */}
      <div className="w-14 h-14 rounded-xl bg-duo-green/10 border-2 border-duo-green/20 flex items-center justify-center">
        <Zap size={24} className="text-duo-green" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-bold text-dark-100 group-hover:text-duo-green transition-colors truncate">
          {project.name}
        </h3>
        <p className="text-sm text-dark-500 truncate">{project.description}</p>
      </div>

      {/* Collaborators */}
      {project.collaborators.length > 0 && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-800 rounded-full text-xs font-display font-semibold text-dark-400">
          <Users size={14} />
          {project.collaborators.length + 1}
        </div>
      )}

      {/* Updated */}
      <div className="text-sm font-display text-dark-500 whitespace-nowrap">
        {new Date(project.updatedAt).toLocaleDateString()}
      </div>

      {/* Actions */}
      <button className="p-2.5 hover:bg-dark-800 rounded-xl text-dark-500 hover:text-dark-300 transition-colors">
        <MoreHorizontal size={18} />
      </button>
    </div>
  );
};

export default ProjectsPage;
