import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  BookOpen, 
  Clock, 
  Play, 
  CheckCircle, 
  Zap,
  Star,
  Lock,
  Lightbulb,
  Cpu,
  Battery,
  CircuitBoard,
  Radio,
  Waves,
  Target,
  Gift,
  ArrowRight,
  Flame,
  X
} from 'lucide-react';
import { tutorials } from '../data/tutorials';
import { useTutorialStore } from '../stores';
import type { Tutorial } from '../types';
import InteractiveTutorialCanvas from '../components/tutorials/InteractiveTutorialCanvas';
import ComponentVisualizer from '../components/tutorials/ComponentVisualizer';

// Icon mapping for tutorials based on their content
const getTutorialIcon = (tutorialId: string, isCompleted: boolean, isLocked: boolean) => {
  const iconProps = { 
    size: 28, 
    strokeWidth: 2.5,
    className: isLocked ? 'text-dark-500' : isCompleted ? 'text-white' : 'text-white'
  };
  
  if (tutorialId.includes('basic') || tutorialId.includes('intro')) {
    return <Lightbulb {...iconProps} fill={isLocked ? 'transparent' : 'currentColor'} />;
  }
  if (tutorialId.includes('resistor') || tutorialId.includes('ohm')) {
    return <Waves {...iconProps} />;
  }
  if (tutorialId.includes('led') || tutorialId.includes('light')) {
    return <Lightbulb {...iconProps} fill={isLocked ? 'transparent' : 'currentColor'} />;
  }
  if (tutorialId.includes('capacitor')) {
    return <Battery {...iconProps} />;
  }
  if (tutorialId.includes('series') || tutorialId.includes('parallel')) {
    return <CircuitBoard {...iconProps} />;
  }
  if (tutorialId.includes('transistor') || tutorialId.includes('amp')) {
    return <Radio {...iconProps} />;
  }
  if (tutorialId.includes('sensor') || tutorialId.includes('input')) {
    return <Cpu {...iconProps} />;
  }
  return <Star {...iconProps} fill={isLocked ? 'transparent' : 'currentColor'} />;
};

const TutorialsPage: React.FC = () => {
  const [activeTutorial, setActiveTutorial] = useState<Tutorial | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  
  const { 
    totalCircuitPoints, 
    completedTutorials, 
    isTutorialComplete, 
    getTutorialProgress 
  } = useTutorialStore();

  // Calculate Amperes rewards based on difficulty
  const getAmperesReward = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 50;
      case 'intermediate': return 100;
      case 'advanced': return 200;
      default: return 50;
    }
  };

  // Group tutorials by section/difficulty
  const tutorialSections = useMemo(() => {
    const sections = [
      { 
        id: 'basics', 
        title: 'Circuit Basics', 
        subtitle: 'Learn the fundamentals',
        tutorials: tutorials.filter(t => t.difficulty === 'beginner').slice(0, 5)
      },
      { 
        id: 'components', 
        title: 'Components', 
        subtitle: 'Master each part',
        tutorials: tutorials.filter(t => t.difficulty === 'beginner').slice(5, 10).concat(
          tutorials.filter(t => t.difficulty === 'intermediate').slice(0, 2)
        )
      },
      { 
        id: 'circuits', 
        title: 'Build Circuits', 
        subtitle: 'Put it together',
        tutorials: tutorials.filter(t => t.difficulty === 'intermediate').slice(2, 7)
      },
      { 
        id: 'advanced', 
        title: 'Advanced', 
        subtitle: 'Level up',
        tutorials: tutorials.filter(t => t.difficulty === 'advanced')
      },
    ].filter(section => section.tutorials.length > 0);

    // Add metadata to tutorials
    return sections.map((section, sectionIndex) => ({
      ...section,
      tutorials: section.tutorials.map((t, tutorialIndex) => {
        const isCompleted = isTutorialComplete(t.id);
        const progress = getTutorialProgress(t.id);
        
        return {
          ...t,
          amperesReward: getAmperesReward(t.difficulty),
          completed: isCompleted,
          progress,
          isLocked: false, // For now, unlock all tutorials for better UX
          sectionIndex,
          tutorialIndex,
        };
      })
    }));
  }, [isTutorialComplete, getTutorialProgress]);

  const completedCount = completedTutorials.size;
  const totalTutorials = tutorials.length;
  const currentStreak = Math.min(completedCount, 7); // Simulated streak

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
    <div className="h-full overflow-y-auto bg-dark-900">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-20 bg-dark-900/95 backdrop-blur-sm border-b border-dark-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-display font-bold text-dark-100">Learn</h1>
          </div>
          
          {/* Currency Display */}
          <div className="flex items-center gap-3">
            {/* Streak */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-800 rounded-xl">
              <Flame className="text-orange-500" size={18} fill="currentColor" />
              <span className="font-display font-semibold text-dark-100">{currentStreak}</span>
            </div>
            
            {/* Amperes */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-800 rounded-xl">
              <Zap className="text-yellow-500" size={18} fill="currentColor" />
              <span className="font-display font-semibold text-dark-100">{totalCircuitPoints}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Progress Card - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-dark-800 rounded-2xl border border-dark-700 flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-full bg-duo-green/20 flex items-center justify-center shrink-0">
            <span className="font-display font-bold text-xl text-duo-green">
              {Math.round((completedCount / totalTutorials) * 100)}%
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-bold text-dark-100">Your Progress</h2>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-duo-green rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedCount / totalTutorials) * 100}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
              <span className="text-sm text-dark-400 shrink-0">{completedCount}/{totalTutorials}</span>
            </div>
          </div>
        </motion.div>

        {/* Tutorial Path - Curved Snake Layout */}
        <div className="relative">
          {tutorialSections.map((section, sectionIdx) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: sectionIdx * 0.1 }}
              className="mb-8"
            >
              {/* Section Header - Compact */}
              <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-8 h-8 rounded-lg bg-duo-green/20 flex items-center justify-center">
                  <Star size={16} className="text-duo-green" fill="currentColor" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-dark-100 text-sm">{section.title}</h3>
                  <p className="text-xs text-dark-500">{section.subtitle}</p>
                </div>
              </div>

              {/* Curved Snake Path - 4 items per row */}
              <div className="relative">
                {/* SVG Path connecting nodes */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                  <defs>
                    <linearGradient id={`path-gradient-${section.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Grid of tutorial nodes - snake pattern */}
                <div className="grid grid-cols-4 gap-x-2 gap-y-4">
                  {section.tutorials.map((tutorial, idx) => {
                    const isCompleted = tutorial.completed;
                    const isLocked = tutorial.isLocked;
                    const isInProgress = tutorial.progress > 0 && !isCompleted;
                    
                    // Snake pattern: reverse every other row
                    const row = Math.floor(idx / 4);
                    const col = idx % 4;
                    const isReversedRow = row % 2 === 1;
                    const actualCol = isReversedRow ? 3 - col : col;
                    
                    return (
                      <motion.button
                        key={tutorial.id}
                        onClick={() => !isLocked && setActiveTutorial(tutorial)}
                        disabled={isLocked}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: idx * 0.03 }}
                        whileHover={!isLocked ? { scale: 1.05, y: -2 } : {}}
                        whileTap={!isLocked ? { scale: 0.95 } : {}}
                        style={{ order: row * 4 + actualCol }}
                        className="relative group flex flex-col items-center"
                      >
                        {/* Node Circle */}
                        <div className={`
                          w-14 h-14 rounded-2xl flex items-center justify-center
                          transition-all duration-200 shadow-lg
                          ${isLocked 
                            ? 'bg-dark-700 border-2 border-dark-600 cursor-not-allowed' 
                            : isCompleted 
                              ? 'bg-duo-green border-2 border-duo-greenDark cursor-pointer' 
                              : isInProgress
                                ? 'bg-duo-blue border-2 border-blue-600 cursor-pointer'
                                : 'bg-duo-green border-2 border-duo-greenDark cursor-pointer hover:brightness-110'
                          }
                        `}>
                          {isLocked ? (
                            <Lock size={20} className="text-dark-500" />
                          ) : isCompleted ? (
                            <CheckCircle size={24} className="text-white" fill="currentColor" />
                          ) : (
                            getTutorialIcon(tutorial.id, isCompleted, isLocked)
                          )}
                        </div>

                        {/* Star badge for completed */}
                        {isCompleted && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-dark-900 z-10">
                            <Star size={10} className="text-white" fill="currentColor" />
                          </div>
                        )}

                        {/* Progress indicator */}
                        {isInProgress && (
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-dark-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-duo-blue rounded-full"
                              style={{ width: `${tutorial.progress}%` }}
                            />
                          </div>
                        )}

                        {/* Title - shown below */}
                        <div className="mt-2 text-center max-w-[80px]">
                          <p className="text-xs font-display font-medium text-dark-300 truncate">
                            {tutorial.title.split(':')[0]}
                          </p>
                        </div>

                        {/* Hover tooltip */}
                        <div className={`
                          absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-44 p-2.5 rounded-xl
                          bg-dark-800 border border-dark-700 shadow-xl
                          opacity-0 group-hover:opacity-100 pointer-events-none
                          transition-opacity duration-200 z-20
                        `}>
                          <p className="font-display font-semibold text-xs text-dark-100 text-center mb-1">
                            {tutorial.title}
                          </p>
                          <div className="flex items-center justify-center gap-2 text-[10px] text-dark-400">
                            <Clock size={10} />
                            <span>{tutorial.duration}</span>
                            <Zap size={10} className="text-yellow-500" />
                            <span>+{tutorial.amperesReward}</span>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Connecting curved lines between rows */}
                {section.tutorials.length > 4 && (
                  <div className="absolute right-0 top-[72px] w-12 h-16 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 48 64">
                      <path
                        d="M 24 0 Q 48 0 48 32 Q 48 64 24 64"
                        fill="none"
                        stroke="rgba(34, 197, 94, 0.3)"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* End treasure/reward - Compact */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-4 mt-4 p-4 bg-purple-600/10 border border-purple-600/30 rounded-2xl"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border-2 border-purple-600/40 flex items-center justify-center">
              <Gift size={28} className="text-purple-400" />
            </div>
            <div>
              <p className="font-display font-bold text-dark-100">Complete all lessons!</p>
              <p className="text-sm text-dark-400">Unlock special rewards</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
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
  const { markTutorialComplete, updateTutorialProgress, isTutorialComplete } = useTutorialStore();
  const isCompleted = isTutorialComplete(tutorial.id);
  
  const amperesReward = useMemo(() => {
    switch (tutorial.difficulty) {
      case 'beginner': return 50;
      case 'intermediate': return 100;
      case 'advanced': return 200;
      default: return 50;
    }
  }, [tutorial.difficulty]);
  
  const handleComplete = () => {
    markTutorialComplete(tutorial.id, amperesReward);
    onClose();
  };

  const handleStepChange = (newStep: number) => {
    onStepChange(newStep);
    const newProgress = ((newStep + 1) / tutorial.steps.length) * 100;
    updateTutorialProgress(tutorial.id, newProgress);
  };

  return (
    <div className="h-full flex flex-col bg-dark-900">
      {/* Header */}
      <div className="flex-shrink-0 bg-dark-800 border-b border-dark-700">
        <div className="flex items-center gap-4 px-4 py-3">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-dark-700 hover:bg-dark-600 flex items-center justify-center transition-colors"
          >
            <X size={20} className="text-dark-300" />
          </button>
          
          {/* Progress bar */}
          <div className="flex-1 h-3 bg-dark-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-duo-green rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Reward preview */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-700 rounded-xl">
            <Zap size={16} className="text-yellow-500" fill="currentColor" />
            <span className="font-display font-semibold text-sm text-dark-200">+{amperesReward}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Step type badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`
                inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-display font-semibold
                ${step.type === 'interactive' 
                  ? 'bg-duo-green/20 text-duo-green' 
                  : step.type === 'diagram'
                  ? 'bg-duo-blue/20 text-duo-blue'
                  : step.type === 'quiz'
                  ? 'bg-duo-orange/20 text-duo-orange'
                  : 'bg-dark-700 text-dark-300'
                }
              `}>
                {step.type === 'interactive' && <Play size={12} fill="currentColor" />}
                {step.type === 'diagram' && <CircuitBoard size={12} />}
                {step.type === 'quiz' && <Target size={12} />}
                {step.type === 'text' && <BookOpen size={12} />}
                {step.type === 'interactive' ? 'Practice' : step.type === 'diagram' ? 'Circuit' : step.type === 'quiz' ? 'Quiz' : 'Lesson'}
              </span>
              <span className="text-xs text-dark-500">
                Step {currentStep + 1} of {tutorial.steps.length}
              </span>
            </div>
            
            <h2 className="font-display font-bold text-2xl text-dark-100 mb-6">{step.title}</h2>
            
            {/* Render circuit diagram if present */}
            {(step.type === 'diagram' || step.type === 'interactive') && step.circuit && (
              <div className="mb-8 rounded-2xl overflow-hidden border border-dark-700">
                <InteractiveTutorialCanvas
                  key={`circuit-${currentStep}`}
                  initialNodes={step.circuit.nodes || []}
                  initialEdges={step.circuit.edges || []}
                  isReadOnly={step.type === 'diagram' || step.circuit.isReadOnly}
                  showSimulation={step.circuit.showSimulation !== false}
                  height="h-80"
                />
              </div>
            )}
            
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: (props) => <h1 className="font-display font-bold text-2xl text-dark-100 mt-6 mb-4" {...props} />,
                  h2: (props) => <h2 className="font-display font-bold text-xl text-dark-100 mt-6 mb-3" {...props} />,
                  h3: (props) => <h3 className="font-display font-semibold text-lg text-duo-green mt-4 mb-2" {...props} />,
                  p: (props) => <p className="text-dark-300 my-3 leading-relaxed text-base" {...props} />,
                  ul: (props) => <ul className="list-disc ml-6 my-4 space-y-2" {...props} />,
                  li: (props) => <li className="text-dark-300" {...props} />,
                  strong: (props) => <strong className="font-semibold text-dark-100" {...props} />,
                  em: (props) => <em className="italic text-dark-200" {...props} />,
                  code: ({ inline, ...props }: { inline?: boolean; children?: React.ReactNode }) => 
                    inline ? (
                      <code className="px-1.5 py-0.5 bg-dark-800 text-duo-green rounded text-sm" {...props} />
                    ) : (
                      <code className="block p-4 bg-dark-800 text-dark-200 rounded-xl my-4 overflow-x-auto" {...props} />
                    ),
                }}
              >
                {step.content}
              </ReactMarkdown>
            </div>

            {/* Component Visualizer */}
            {step.visualizeComponents && step.visualizeComponents.length > 0 && (
              <div className="mt-8">
                <ComponentVisualizer
                  componentIds={step.visualizeComponents}
                  title="Explore Components"
                  description="Tap to learn more about each part"
                  interactive={true}
                />
              </div>
            )}

            {step.type === 'interactive' && !step.circuit && (
              <div className="mt-8 p-5 bg-duo-green/10 border-2 border-duo-green/30 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-duo-green/20 flex items-center justify-center">
                    <Zap className="text-duo-green" size={20} />
                  </div>
                  <span className="font-display font-bold text-duo-green">Try it yourself!</span>
                </div>
                <p className="text-dark-300 text-sm">
                  Head to the circuit designer and build what you've learned.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex-shrink-0 border-t border-dark-700 bg-dark-800 p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          {currentStep > 0 ? (
            <button
              onClick={() => handleStepChange(currentStep - 1)}
              className="px-6 py-3 bg-dark-700 hover:bg-dark-600 text-dark-200 font-display font-semibold rounded-xl transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {currentStep === tutorial.steps.length - 1 ? (
            <button 
              onClick={handleComplete} 
              className={`
                flex-1 max-w-xs px-6 py-3 rounded-xl font-display font-bold text-white
                flex items-center justify-center gap-2 transition-all
                ${isCompleted 
                  ? 'bg-dark-600' 
                  : 'bg-duo-green hover:bg-duo-greenDark active:scale-95'
                }
              `}
            >
              {isCompleted ? (
                <>
                  <CheckCircle size={20} />
                  Completed
                </>
              ) : (
                <>
                  Complete
                  <Zap size={18} fill="currentColor" />
                  +{amperesReward}
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => handleStepChange(currentStep + 1)}
              className="flex-1 max-w-xs px-6 py-3 bg-duo-green hover:bg-duo-greenDark text-white font-display font-bold rounded-xl transition-colors flex items-center justify-center gap-2 active:scale-95"
            >
              Continue
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorialsPage;
