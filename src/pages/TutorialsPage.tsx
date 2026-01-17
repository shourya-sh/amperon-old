import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  ChevronRight, 
  Play, 
  CheckCircle2, 
  Lock,
  Star,
  Zap,
  Search,
  Filter
} from 'lucide-react';
import { tutorials, getTutorialsByDifficulty } from '../data/tutorials';
import type { Tutorial } from '../types';

const TutorialsPage: React.FC = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTutorial, setActiveTutorial] = useState<Tutorial | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const difficulties = [
    { id: 'all', label: 'All Levels', color: 'bg-dark-700' },
    { id: 'beginner', label: '🌱 Beginner', color: 'bg-green-600' },
    { id: 'intermediate', label: '🌿 Intermediate', color: 'bg-amber-600' },
    { id: 'advanced', label: '🌳 Advanced', color: 'bg-red-600' },
  ];

  const filteredTutorials = tutorials.filter((tutorial) => {
    const matchesDifficulty = selectedDifficulty === 'all' || tutorial.difficulty === selectedDifficulty;
    const matchesSearch = 
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'intermediate': return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
      case 'advanced': return 'text-red-400 bg-red-400/10 border-red-400/30';
      default: return 'text-dark-400 bg-dark-400/10 border-dark-400/30';
    }
  };

  if (activeTutorial) {
    return (
      <TutorialViewer
        tutorial={activeTutorial}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onClose={() => {
          setActiveTutorial(null);
          setCurrentStep(0);
        }}
      />
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-dark-100 mb-2">
              Learn Electronics 🔬
            </h1>
            <p className="text-dark-400 text-lg">
              Interactive tutorials to help you master circuit design
            </p>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center gap-4 mb-8"
        >
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tutorials..."
              className="w-full pl-10 pr-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-dark-100 placeholder-dark-500 focus:outline-none focus:border-forest-600 transition-colors"
            />
          </div>

          {/* Difficulty Filters */}
          <div className="flex items-center gap-2">
            {difficulties.map((diff) => (
              <button
                key={diff.id}
                onClick={() => setSelectedDifficulty(diff.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedDifficulty === diff.id
                    ? 'bg-forest-600 text-white'
                    : 'bg-dark-800 text-dark-300 hover:bg-dark-700 border border-dark-700'
                }`}
              >
                {diff.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-dark-900 border border-dark-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-600/20 flex items-center justify-center">
                <Zap className="text-green-400" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-dark-100">0</p>
                <p className="text-sm text-dark-500">Completed</p>
              </div>
            </div>
          </div>
          <div className="bg-dark-900 border border-dark-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-600/20 flex items-center justify-center">
                <BookOpen className="text-amber-400" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-dark-100">{tutorials.length}</p>
                <p className="text-sm text-dark-500">Total Tutorials</p>
              </div>
            </div>
          </div>
          <div className="bg-dark-900 border border-dark-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-forest-600/20 flex items-center justify-center">
                <Star className="text-forest-400" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-dark-100">0</p>
                <p className="text-sm text-dark-500">XP Earned</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tutorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredTutorials.map((tutorial, index) => (
              <motion.div
                key={tutorial.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <TutorialCard
                  tutorial={tutorial}
                  onClick={() => setActiveTutorial(tutorial)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredTutorials.length === 0 && (
          <div className="text-center py-16">
            <p className="text-dark-500 text-lg">No tutorials found</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDifficulty('all');
              }}
              className="mt-2 text-forest-500 hover:text-forest-400"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface TutorialCardProps {
  tutorial: Tutorial;
  onClick: () => void;
}

const TutorialCard: React.FC<TutorialCardProps> = ({ tutorial, onClick }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'intermediate': return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
      case 'advanced': return 'text-red-400 bg-red-400/10 border-red-400/30';
      default: return '';
    }
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="w-full text-left bg-dark-900 border border-dark-800 rounded-xl p-5 hover:border-forest-700/50 transition-all group"
    >
      {/* Icon */}
      <div className="text-4xl mb-4">{tutorial.icon}</div>

      {/* Title & Description */}
      <h3 className="text-lg font-semibold text-dark-100 mb-1 group-hover:text-forest-400 transition-colors">
        {tutorial.title}
      </h3>
      <p className="text-sm text-dark-400 mb-4 line-clamp-2">
        {tutorial.description}
      </p>

      {/* Meta */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor(tutorial.difficulty)}`}>
            {tutorial.difficulty}
          </span>
          <span className="flex items-center gap-1 text-xs text-dark-500">
            <Clock size={12} />
            {tutorial.duration}
          </span>
        </div>
        
        <div className="w-8 h-8 rounded-full bg-forest-600/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Play size={14} className="text-forest-400 ml-0.5" />
        </div>
      </div>

      {/* Progress Bar */}
      {tutorial.progress !== undefined && tutorial.progress > 0 && (
        <div className="mt-4 pt-4 border-t border-dark-800">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-dark-500">Progress</span>
            <span className="text-forest-400">{tutorial.progress}%</span>
          </div>
          <div className="h-1.5 bg-dark-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-forest-500 rounded-full transition-all"
              style={{ width: `${tutorial.progress}%` }}
            />
          </div>
        </div>
      )}
    </motion.button>
  );
};

interface TutorialViewerProps {
  tutorial: Tutorial;
  currentStep: number;
  onStepChange: (step: number) => void;
  onClose: () => void;
}

const TutorialViewer: React.FC<TutorialViewerProps> = ({
  tutorial,
  currentStep,
  onStepChange,
  onClose,
}) => {
  const step = tutorial.steps[currentStep];
  const progress = ((currentStep + 1) / tutorial.steps.length) * 100;

  return (
    <div className="h-full flex">
      {/* Left Sidebar - Steps */}
      <div className="w-72 bg-dark-900 border-r border-dark-800 flex flex-col">
        <div className="p-4 border-b border-dark-800">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-dark-400 hover:text-dark-200 text-sm mb-4"
          >
            ← Back to tutorials
          </button>
          <div className="text-3xl mb-2">{tutorial.icon}</div>
          <h2 className="font-semibold text-dark-100">{tutorial.title}</h2>
          <p className="text-xs text-dark-500 mt-1">{tutorial.duration}</p>
        </div>

        {/* Progress */}
        <div className="p-4 border-b border-dark-800">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-dark-500">Progress</span>
            <span className="text-forest-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-forest-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps List */}
        <div className="flex-1 overflow-y-auto p-2">
          {tutorial.steps.map((s, index) => (
            <button
              key={s.id}
              onClick={() => onStepChange(index)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors ${
                index === currentStep
                  ? 'bg-forest-600/20 text-forest-400'
                  : index < currentStep
                  ? 'text-dark-400 hover:bg-dark-800'
                  : 'text-dark-500 hover:bg-dark-800'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                index === currentStep
                  ? 'bg-forest-600 text-white'
                  : index < currentStep
                  ? 'bg-forest-600/30 text-forest-400'
                  : 'bg-dark-700 text-dark-500'
              }`}>
                {index < currentStep ? <CheckCircle2 size={14} /> : index + 1}
              </div>
              <span className="truncate">{s.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-6">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                  step.type === 'interactive' 
                    ? 'bg-forest-600/20 text-forest-400' 
                    : step.type === 'quiz'
                    ? 'bg-amber-600/20 text-amber-400'
                    : 'bg-dark-700 text-dark-400'
                }`}>
                  {step.type === 'interactive' ? '🎮 Interactive' : step.type === 'quiz' ? '❓ Quiz' : '📖 Lesson'}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold text-dark-100 mb-6">{step.title}</h2>
              
              <div className="prose prose-invert prose-lg max-w-none">
                {step.content.split('\n').map((line, i) => {
                  if (line.startsWith('# ')) {
                    return <h1 key={i} className="text-3xl font-bold text-dark-100 mt-6 mb-4">{line.slice(2)}</h1>;
                  }
                  if (line.startsWith('## ')) {
                    return <h2 key={i} className="text-xl font-bold text-dark-100 mt-6 mb-3">{line.slice(3)}</h2>;
                  }
                  if (line.startsWith('### ')) {
                    return <h3 key={i} className="text-lg font-semibold text-forest-400 mt-4 mb-2">{line.slice(4)}</h3>;
                  }
                  if (line.startsWith('- ')) {
                    return <li key={i} className="text-dark-300 ml-4">{line.slice(2)}</li>;
                  }
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <p key={i} className="font-bold text-dark-200 my-2">{line.slice(2, -2)}</p>;
                  }
                  if (line.trim() === '') {
                    return <div key={i} className="h-4" />;
                  }
                  return <p key={i} className="text-dark-300 my-2">{line}</p>;
                })}
              </div>

              {step.type === 'interactive' && (
                <div className="mt-8 p-6 bg-forest-600/10 border border-forest-600/30 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="text-forest-400" size={20} />
                    <span className="font-semibold text-forest-400">Try it yourself!</span>
                  </div>
                  <p className="text-dark-300 text-sm">
                    Open the circuit designer and apply what you've learned. 
                    The components mentioned are available in the left sidebar.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t border-dark-800 p-4">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <button
              onClick={() => onStepChange(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            <span className="text-sm text-dark-500">
              Step {currentStep + 1} of {tutorial.steps.length}
            </span>

            {currentStep === tutorial.steps.length - 1 ? (
              <button onClick={onClose} className="btn-primary">
                Complete Tutorial 🎉
              </button>
            ) : (
              <button
                onClick={() => onStepChange(Math.min(tutorial.steps.length - 1, currentStep + 1))}
                className="btn-primary"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialsPage;
