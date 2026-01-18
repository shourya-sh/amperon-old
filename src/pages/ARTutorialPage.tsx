import React, { useRef, useEffect, useState } from 'react';
import { Camera, CameraOff, Play, Pause, RotateCcw, Zap, CheckCircle, Circle } from 'lucide-react';
// Note: analyzeCircuitImage and getContinuousTutorialGuidance are not yet implemented in aiService

interface TutorialStep {
  id: number;
  instruction: string;
  completed: boolean;
  feedback?: string;
}

const ARTutorialPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tutorialSteps, setTutorialSteps] = useState<TutorialStep[]>([
    { id: 1, instruction: 'Place a breadboard in the camera view', completed: false },
    { id: 2, instruction: 'Connect the battery to the breadboard', completed: false },
    { id: 3, instruction: 'Add a resistor between the power rails', completed: false },
    { id: 4, instruction: 'Connect an LED with proper polarity', completed: false },
    { id: 5, instruction: 'Complete the circuit', completed: false },
  ]);
  const [aiGuidance, setAiGuidance] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedComponents, setDetectedComponents] = useState<string[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const analysisIntervalRef = useRef<number | null>(null);

  // Start webcam
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Prefer back camera on mobile
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
      alert('Unable to access webcam. Please ensure you have granted camera permissions.');
    }
  };

  // Stop webcam
  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsStreaming(false);
      setIsTutorialActive(false);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    
    // Clear analysis interval
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
  };

  // Capture frame from video
  const captureFrame = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/jpeg', 0.8);
  };

  // Analyze current frame
  const analyzeCurrentFrame = async () => {
    if (!isStreaming || isAnalyzing) return;

    setIsAnalyzing(true);
    const frame = captureFrame();

    if (frame) {
      try {
        // Note: getContinuousTutorialGuidance is not yet implemented
        // const currentInstruction = tutorialSteps[currentStep]?.instruction || 'Follow the tutorial steps';
        // const result = await getContinuousTutorialGuidance(frame, currentInstruction, detectedComponents);
        
        setAiGuidance('Frame analysis placeholder - AI guidance not yet implemented');
        // setDetectedComponents(result.detectedComponents || []);

        // Auto-advance step if AI confirms completion
        // if (result.stepCompleted && currentStep < tutorialSteps.length - 1) {
        //   setTutorialSteps(prev => 
        //     prev.map((step, idx) => 
        //       idx === currentStep ? { ...step, completed: true, feedback: result.guidance } : step
        //     )
        //   );
        //   setTimeout(() => setCurrentStep(prev => prev + 1), 1000);
        // }
      } catch (error) {
        console.error('Error analyzing frame:', error);
      }
    }

    setIsAnalyzing(false);
  };

  // Start tutorial with continuous analysis
  const startTutorial = () => {
    setIsTutorialActive(true);
    setCurrentStep(0);
    setTutorialSteps(prev => prev.map(step => ({ ...step, completed: false, feedback: undefined })));
    
    // Start periodic analysis (every 3 seconds)
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
    }
    analysisIntervalRef.current = window.setInterval(analyzeCurrentFrame, 3000);
  };

  // Pause tutorial
  const pauseTutorial = () => {
    setIsTutorialActive(false);
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
  };

  // Reset tutorial
  const resetTutorial = () => {
    setCurrentStep(0);
    setIsTutorialActive(false);
    setAiGuidance('');
    setDetectedComponents([]);
    setTutorialSteps(prev => prev.map(step => ({ ...step, completed: false, feedback: undefined })));
    
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-dark-950">
      {/* Header */}
      <div className="h-12 bg-dark-900 border-b border-dark-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Camera size={16} className="text-forest-500" />
          <h1 className="text-sm font-semibold text-dark-100">AR Tutorial</h1>
        </div>
        <div className="flex items-center gap-2">
          {!isStreaming ? (
            <button
              onClick={startWebcam}
              className="btn-primary flex items-center gap-2"
            >
              <Camera size={14} />
              Start Camera
            </button>
          ) : (
            <button
              onClick={stopWebcam}
              className="btn-secondary flex items-center gap-2"
            >
              <CameraOff size={14} />
              Stop Camera
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Feed */}
        <div className="flex-1 flex flex-col items-center justify-center bg-dark-950 relative">
          {!isStreaming ? (
            <div className="text-center">
              <Camera size={64} className="text-dark-700 mx-auto mb-4" />
              <p className="text-dark-400 text-sm mb-4">Click "Start Camera" to begin</p>
              <p className="text-dark-500 text-xs max-w-md">
                Point your camera at your breadboard and components. The AI will guide you through building circuits step by step.
              </p>
            </div>
          ) : (
            <>
              {/* Video Element */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              
              {/* Canvas for frame capture (hidden) */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Overlay - Current Step Indicator */}
              {isTutorialActive && (
                <div className="absolute top-4 left-4 right-4 glass p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-forest-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">{currentStep + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-dark-100 font-medium text-sm mb-1">
                        {tutorialSteps[currentStep]?.instruction}
                      </p>
                      {aiGuidance && (
                        <p className="text-forest-400 text-xs mt-2">
                          {isAnalyzing ? 'Analyzing...' : aiGuidance}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Detected Components Badge */}
              {detectedComponents.length > 0 && (
                <div className="absolute bottom-4 left-4 glass px-3 py-2 rounded-lg">
                  <p className="text-dark-400 text-xs mb-1">Detected:</p>
                  <div className="flex flex-wrap gap-1">
                    {detectedComponents.map((comp, idx) => (
                      <span key={idx} className="bg-forest-600/20 text-forest-400 text-xs px-2 py-0.5 rounded">
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Analyzing Indicator */}
              {isAnalyzing && (
                <div className="absolute top-4 right-4 glass px-3 py-2 rounded-lg flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-forest-500 animate-pulse" />
                  <span className="text-dark-300 text-xs">Analyzing...</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Tutorial Panel */}
        <div className="w-96 bg-dark-900 border-l border-dark-800 flex flex-col">
          {/* Tutorial Controls */}
          <div className="p-4 border-b border-dark-800">
            <h2 className="text-sm font-semibold text-dark-100 mb-3">Tutorial Progress</h2>
            <div className="flex gap-2">
              {!isTutorialActive ? (
                <button
                  onClick={startTutorial}
                  disabled={!isStreaming}
                  className="btn-primary flex items-center gap-2 flex-1"
                >
                  <Play size={14} />
                  Start Tutorial
                </button>
              ) : (
                <button
                  onClick={pauseTutorial}
                  className="btn-secondary flex items-center gap-2 flex-1"
                >
                  <Pause size={14} />
                  Pause
                </button>
              )}
              <button
                onClick={resetTutorial}
                className="btn-secondary flex items-center gap-2"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Steps List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {tutorialSteps.map((step, idx) => (
              <div
                key={step.id}
                className={`p-3 rounded-lg border transition-all ${
                  idx === currentStep && isTutorialActive
                    ? 'border-forest-500 bg-forest-500/5'
                    : step.completed
                    ? 'border-dark-700 bg-dark-800'
                    : 'border-dark-700 bg-dark-800/50'
                }`}
              >
                <div className="flex items-start gap-2">
                  {step.completed ? (
                    <CheckCircle size={16} className="text-forest-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Circle size={16} className="text-dark-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${step.completed ? 'text-dark-300' : 'text-dark-100'}`}>
                      {step.instruction}
                    </p>
                    {step.feedback && (
                      <p className="text-xs text-forest-400 mt-1">{step.feedback}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tips Section */}
          <div className="p-4 border-t border-dark-800 bg-dark-800/50">
            <div className="flex items-start gap-2">
              <Zap size={14} className="text-forest-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-dark-200 mb-1">Tips</p>
                <ul className="text-xs text-dark-400 space-y-1">
                  <li>• Ensure good lighting for better detection</li>
                  <li>• Keep components clearly visible</li>
                  <li>• Follow each step before moving forward</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARTutorialPage;
