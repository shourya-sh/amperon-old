import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Camera, 
  CameraOff, 
  QrCode,
  Smartphone,
  Monitor,
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  CheckCircle, 
  Circle,
  AlertTriangle,
  Lightbulb,
  Eye,
  EyeOff,
  MessageSquare,
  HelpCircle,
  Loader2,
  Wifi,
  WifiOff,
  X,
  Cpu
} from 'lucide-react';
import { useARStore, useChatStore } from '../stores';
import { overshootService, mapDetectedToAppComponents, type DetectedCircuitState } from '../services/overshootService';
import { arConnectionManager, type ARConnectionState } from '../services/arConnectionService';

interface TutorialStep {
  id: number;
  instruction: string;
  completed: boolean;
  expectedComponents?: string[];
  feedback?: string;
}

interface HintButton {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  position: { x: string; y: string };
}

const ARTutorialPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  // Local state
  const [isLocalCameraActive, setIsLocalCameraActive] = useState(false);
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'local' | 'phone'>('local');
  const [connectionUrl, setConnectionUrl] = useState<string | null>(null);
  const [isOnLocalhost, setIsOnLocalhost] = useState(false);
  
  const [tutorialSteps, setTutorialSteps] = useState<TutorialStep[]>([
    { id: 1, instruction: 'Place a breadboard in the camera view', completed: false, expectedComponents: ['breadboard'] },
    { id: 2, instruction: 'Add a resistor (check the color bands!)', completed: false, expectedComponents: ['resistor'] },
    { id: 3, instruction: 'Connect an LED with proper polarity', completed: false, expectedComponents: ['led'] },
    { id: 4, instruction: 'Add wires to connect your components', completed: false, expectedComponents: ['wire', 'jumper'] },
    { id: 5, instruction: 'Connect a battery to power the circuit', completed: false, expectedComponents: ['battery', 'power supply', 'power'] },
  ]);

  const localStreamRef = useRef<MediaStream | null>(null);
  const completedStepsRef = useRef<Set<number>>(new Set()); // Track completed steps
  const detectionStartTimeRef = useRef<number | null>(null); // Track when detection started
  const DETECTION_THRESHOLD_MS = 0; // Advance immediately on detection
  
  // Refs to keep callback up-to-date with latest state (avoids stale closures)
  const currentStepRef = useRef(currentStep);
  const isTutorialActiveRef = useRef(isTutorialActive);
  const tutorialStepsRef = useRef(tutorialSteps);
  
  // Keep refs in sync with state to avoid stale closures in callbacks
  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);
  
  useEffect(() => {
    isTutorialActiveRef.current = isTutorialActive;
  }, [isTutorialActive]);
  
  useEffect(() => {
    tutorialStepsRef.current = tutorialSteps;
  }, [tutorialSteps]);
  
  // AR Store
  const {
    connectionStatus,
    analysisStatus,
    detectedComponents,
    breadboardDetected,
    currentIssues,
    currentSuggestions,
    showHints,
    showDetectedComponents,
    showIssues,
    setConnectionStatus,
    setAnalysisStatus,
    setDetectedComponents,
    setBreadboardDetected,
    setCurrentIssues,
    setCurrentSuggestions,
    setShowHints,
    setShowDetectedComponents,
    setShowIssues,
    setCameraSource,
    resetARState
  } = useARStore();

  // Chat store for AI help integration
  const { setIsOpen: setChatOpen, addMessage } = useChatStore();

  // Handle phone connection state changes
  useEffect(() => {
    const unsubscribe = arConnectionManager.subscribe((state: ARConnectionState) => {
      console.log('AR state update:', { status: state.status, hasStream: !!state.remoteStream });
      setConnectionStatus(state.status);
      
      if (state.status === 'connected' && state.remoteStream) {
        console.log('Stream received, checking video element...', {
          streamId: state.remoteStream.id,
          videoTracks: state.remoteStream.getVideoTracks().length,
          hasVideoRef: !!remoteVideoRef.current
        });
        
        // Set stream immediately if ref is ready
        const setVideoStream = () => {
          if (!remoteVideoRef.current) {
            console.warn('Video ref not ready yet, retrying...');
            return false;
          }
          
          console.log('Setting remote video srcObject now');
          remoteVideoRef.current.srcObject = state.remoteStream;
          
          // Force play after srcObject is set
          remoteVideoRef.current.play().then(() => {
            console.log('✅ Remote video play() succeeded');
          }).catch(err => {
            console.error('❌ Remote video play() failed:', err);
          });
          
          return true;
        };
        
        // Try immediately, then retry if needed
        if (!setVideoStream()) {
          setTimeout(() => {
            if (setVideoStream()) {
              console.log('Video stream set successfully on retry');
            } else {
              console.error('Failed to set video stream after retry');
            }
          }, 100);
        }
        
        setCameraSource('phone');
        setActiveTab('phone');
        setShowQRModal(false);
        
        // Auto-start tutorial when phone connects
        console.log('📚 Auto-starting tutorial with phone camera');
        setIsTutorialActive(true);
        setShowHints(true);
        setShowDetectedComponents(true);
        setShowIssues(true);
        setCurrentStep(0);
        
        // Start Gemini frame analysis on the phone video
        // Wait for video element to be ready, then start analysis
        setTimeout(() => {
          if (remoteVideoRef.current) {
            startFrameAnalysisWithVideo(remoteVideoRef.current);
          }
        }, 1000);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle analysis results from Overshoot/Gemini
  // Creates a stable callback that reads from refs to get latest state
  const handleAnalysisResult = useCallback((result: DetectedCircuitState) => {
    const mappedComponents = mapDetectedToAppComponents(result);
    
    setDetectedComponents(mappedComponents.map(c => ({
      type: c.type,
      count: c.count,
      colors: c.colors
    })));
    setBreadboardDetected(result.breadboard.detected);
    setCurrentIssues(result.issues);
    setCurrentSuggestions(result.suggestions);

    // Read current values from refs to avoid stale closures
    const tutorialActive = isTutorialActiveRef.current;
    const step = currentStepRef.current;
    const steps = tutorialStepsRef.current;

    // Auto-check tutorial progress based on detected components
    if (!tutorialActive) return;
    
    // Skip if step already completed
    if (completedStepsRef.current.has(step)) {
      console.log('Step', step + 1, 'already completed, skipping');
      return;
    }
    
    const currentStepData = steps[step];
    console.log('📋 Tutorial check - Step:', step + 1, 'Expected:', currentStepData?.expectedComponents, 'Breadboard detected:', result.breadboard.detected);
    
    if (!currentStepData?.expectedComponents) return;
    
    // Get all detected types - include breadboard if detected
    const detectedTypes = mappedComponents.map(c => c.type.toLowerCase());
    
    // Special handling for breadboard detection (step 1)
    if (result.breadboard.detected) {
      detectedTypes.push('breadboard');
      console.log('🟢 Added breadboard to detected types');
    }
    
    const hasExpected = currentStepData.expectedComponents.some(
      exp => detectedTypes.some(det => det.includes(exp.toLowerCase()))
    );
    
    console.log('🔍 Detected types:', detectedTypes, '| Has expected:', hasExpected);
    
    if (hasExpected) {
      // Start tracking detection time if not already
      if (detectionStartTimeRef.current === null) {
        detectionStartTimeRef.current = Date.now();
        console.log('⏱️ Detection started for step', step + 1);
      }
      
      const detectionDuration = Date.now() - detectionStartTimeRef.current;
      console.log('⏳ Detection duration:', detectionDuration, 'ms / threshold:', DETECTION_THRESHOLD_MS, 'ms');
      
      // Check if we've detected for long enough
      if (detectionDuration >= DETECTION_THRESHOLD_MS) {
        console.log('✅ STEP', step + 1, 'COMPLETE after', detectionDuration, 'ms - ADVANCING NOW');
        
        // Mark in ref immediately to prevent duplicates
        completedStepsRef.current.add(step);
        detectionStartTimeRef.current = null; // Reset for next step
        
        // Mark step as completed in state
        setTutorialSteps(prev => 
          prev.map((s, idx) => 
            idx === step 
              ? { ...s, completed: true, feedback: '✓ Detected!' }
              : s
          )
        );
        
        // Advance to next step
        const nextStep = step + 1;
        console.log('🎯 Advancing from step', step + 1, 'to step', nextStep + 1);
        if (nextStep < steps.length) {
          setCurrentStep(nextStep);
        } else {
          console.log('🏁 Tutorial complete!');
        }
      } else {
        // Update UI to show detection in progress
        const remaining = Math.ceil((DETECTION_THRESHOLD_MS - detectionDuration) / 1000);
        setTutorialSteps(prev => 
          prev.map((s, idx) => 
            idx === step 
              ? { ...s, feedback: `Detecting... ${remaining}s` }
              : s
          )
        );
      }
    } else {
      // Reset detection timer if expected component not found
      if (detectionStartTimeRef.current !== null) {
        console.log('❌ Detection lost for step', step + 1);
        detectionStartTimeRef.current = null;
        // Clear the "Detecting..." feedback
        setTutorialSteps(prev => 
          prev.map((s, idx) => 
            idx === step 
              ? { ...s, feedback: undefined }
              : s
          )
        );
      }
    }
  }, []); // Empty deps - uses refs for latest values

  // Start Gemini-based frame analysis with a video element
  const startFrameAnalysisWithVideo = useCallback(async (videoElement: HTMLVideoElement) => {
    try {
      console.log('🎬 Starting Gemini frame analysis...');
      await overshootService.startFrameAnalysis(videoElement, {
        onResult: handleAnalysisResult,
        onError: (error) => console.error('Analysis error:', error),
        onStatus: (status) => setAnalysisStatus(status),
        intervalMs: 3000 // Analyze every 3 seconds
      });
    } catch (error) {
      console.error('Failed to start frame analysis:', error);
    }
  }, [handleAnalysisResult, setAnalysisStatus]);

  // Ensure frame analysis stays active when tutorial is active
  useEffect(() => {
    if (!isTutorialActive || !isLocalCameraActive) return;
    
    // If tutorial becomes active and camera is on, make sure frame analysis is running
    console.log('📊 Tutorial state changed, ensuring frame analysis is active');
    if (videoRef.current?.srcObject) {
      startFrameAnalysisWithVideo(videoRef.current);
    }
  }, [isTutorialActive, isLocalCameraActive]);

  // Start local webcam
  const startLocalCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        localStreamRef.current = stream;
        setIsLocalCameraActive(true);
        setCameraSource('local');
        
        // Enable overlays
        setShowHints(true);
        setShowDetectedComponents(true);
        setShowIssues(true);
        
        // Auto-start tutorial when camera connects
        console.log('📚 Auto-starting tutorial with local camera');
        setIsTutorialActive(true);
        setCurrentStep(0);
        setTutorialSteps(prev => prev.map(step => ({ ...step, completed: false, feedback: undefined })));
        
        // Start Gemini frame analysis with the video element
        setTimeout(() => {
          if (videoRef.current) {
            startFrameAnalysisWithVideo(videoRef.current);
          }
        }, 500);
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
      alert('Unable to access webcam. Please ensure you have granted camera permissions.');
    }
  };

  // Stop local webcam
  const stopLocalCamera = async () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    // Stop frame analysis and any Overshoot services
    overshootService.stopFrameAnalysis();
    await overshootService.stop();
    setIsLocalCameraActive(false);
    setIsTutorialActive(false);
    resetARState();
  };

  // Start QR code generation for phone connection
  const startPhoneConnection = async () => {
    const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
    
    setIsOnLocalhost(isLocalhost);
    setShowQRModal(true);
    
    try {
      const result = await arConnectionManager.startHost();
      setQrCodeDataUrl(result.qrDataUrl);
      setConnectionUrl(result.connectionUrl);
    } catch (error) {
      console.error('Failed to start phone connection:', error);
    }
  };

  // Disconnect phone
  const disconnectPhone = () => {
    // Stop frame analysis when disconnecting
    overshootService.stopFrameAnalysis();
    arConnectionManager.disconnect();
    setQrCodeDataUrl(null);
    setConnectionUrl(null);
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  // Start tutorial
  const startTutorial = () => {
    setIsTutorialActive(true);
    setCurrentStep(0);
    setTutorialSteps(prev => prev.map(step => ({ ...step, completed: false, feedback: undefined })));
  };

  // Pause tutorial
  const pauseTutorial = () => {
    setIsTutorialActive(false);
  };

  // Reset tutorial
  const resetTutorial = () => {
    setCurrentStep(0);
    setIsTutorialActive(false);
    completedStepsRef.current.clear(); // Clear completed steps tracking
    detectionStartTimeRef.current = null; // Reset detection timer
    setTutorialSteps(prev => prev.map(step => ({ ...step, completed: false, feedback: undefined })));
  };

  // Ask for help - opens chat with context
  const askForHelp = () => {
    const context = detectedComponents.length > 0
      ? `I can see: ${detectedComponents.map(c => `${c.count}x ${c.type}`).join(', ')}`
      : 'No components detected yet';
    
    const currentInstruction = tutorialSteps[currentStep]?.instruction || 'building a circuit';
    
    addMessage({
      id: Date.now().toString(),
      role: 'user',
      content: `I'm working on my breadboard and need help with: ${currentInstruction}. ${context}. What should I do?`,
      timestamp: new Date()
    });
    
    setChatOpen(true);
  };

  // Hint buttons that appear on the camera overlay
  const hintButtons: HintButton[] = [
    {
      id: 'help',
      label: 'Ask AI',
      icon: <MessageSquare size={16} />,
      action: askForHelp,
      position: { x: 'right-4', y: 'bottom-20' }
    },
    {
      id: 'tip',
      label: 'Quick Tip',
      icon: <Lightbulb size={16} />,
      action: () => {
        const tip = currentSuggestions[0] || 'Make sure all connections are secure!';
        addMessage({
          id: Date.now().toString(),
          role: 'assistant',
          content: `💡 **Quick Tip:** ${tip}`,
          timestamp: new Date()
        });
        setChatOpen(true);
      },
      position: { x: 'right-4', y: 'bottom-36' }
    }
  ];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopLocalCamera();
      disconnectPhone();
    };
  }, []);

  const isAnyCameraActive = isLocalCameraActive || connectionStatus === 'connected';

  return (
    <div className="flex-1 flex flex-col bg-dark-900 min-h-0">
      {/* Header */}
      <div className="h-14 bg-dark-800 border-b border-dark-700 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-duo-green flex items-center justify-center shadow-lg">
            <Camera size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-display font-bold text-dark-100">AR Lab</h1>
            <p className="text-xs text-dark-400">Scan your breadboard in real-time</p>
          </div>
        </div>
        
        {/* Camera source tabs */}
        <div className="flex items-center gap-1 bg-dark-700 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('local')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'local'
                ? 'bg-duo-green text-white'
                : 'text-dark-400 hover:text-dark-100'
            }`}
          >
            <Monitor size={14} />
            Webcam
          </button>
          <button
            onClick={() => setActiveTab('phone')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'phone'
                ? 'bg-duo-green text-white'
                : 'text-dark-400 hover:text-dark-100'
            }`}
          >
            <Smartphone size={14} />
            Phone
            {connectionStatus === 'connected' && (
              <span className="w-2 h-2 rounded-full bg-duo-green animate-pulse" />
            )}
          </button>
        </div>

        {/* Control buttons */}
        <div className="flex items-center gap-2">
          {activeTab === 'local' ? (
            !isLocalCameraActive ? (
              <button
                onClick={startLocalCamera}
                className="flex items-center gap-2 px-4 py-2 bg-duo-green hover:bg-duo-greenDark text-white text-sm font-display font-semibold rounded-xl shadow-lg transition-colors"
              >
                <Camera size={14} />
                Start Camera
              </button>
            ) : (
              <button
                onClick={stopLocalCamera}
                className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-dark-100 text-sm font-display font-medium rounded-xl border border-dark-600 transition-colors"
              >
                <CameraOff size={14} />
                Stop Camera
              </button>
            )
          ) : (
            connectionStatus !== 'connected' ? (
              <button
                onClick={startPhoneConnection}
                className="flex items-center gap-2 px-4 py-2 bg-duo-green hover:bg-duo-greenDark text-white text-sm font-display font-semibold rounded-xl shadow-lg transition-colors"
              >
                <QrCode size={14} />
                Connect Phone
              </button>
            ) : (
              <button
                onClick={disconnectPhone}
                className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-dark-100 text-sm font-display font-medium rounded-xl border border-dark-600 transition-colors"
              >
                <WifiOff size={14} />
                Disconnect
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Video Feed Area */}
        <div className="flex-1 flex flex-col items-center justify-center bg-dark-900 relative overflow-hidden">
          {!isAnyCameraActive ? (
            // Empty state
            <div className="text-center max-w-md">
              <div className="w-20 h-20 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center mx-auto mb-6">
                {activeTab === 'local' ? (
                  <Camera size={32} className="text-dark-500" />
                ) : (
                  <Smartphone size={32} className="text-dark-500" />
                )}
              </div>
              <h2 className="text-lg font-display font-bold text-dark-100 mb-2">
                {activeTab === 'local' ? 'Start Your Webcam' : 'Connect Your Phone'}
              </h2>
              <p className="text-sm text-dark-400 mb-6">
                {activeTab === 'local' 
                  ? 'Click "Start Camera" to begin analyzing your breadboard in real-time.'
                  : 'Scan the QR code with your phone to stream its camera to this screen.'}
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={activeTab === 'local' ? startLocalCamera : startPhoneConnection}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-duo-green hover:bg-duo-greenDark text-white font-display font-semibold rounded-xl shadow-lg transition-colors"
                >
                  {activeTab === 'local' ? <Camera size={18} /> : <QrCode size={18} />}
                  {activeTab === 'local' ? 'Start Camera' : 'Show QR Code'}
                </button>
              </div>
              
              <div className="mt-8 p-4 bg-dark-800 rounded-2xl border border-dark-700">
                <div className="flex items-start gap-3">
                  <Zap size={16} className="text-duo-green shrink-0 mt-0.5" />
                  <div className="text-left">
                    <p className="text-xs font-display font-semibold text-dark-100 mb-1">Pro Tips</p>
                    <ul className="text-xs text-dark-400 space-y-1">
                      <li>• Ensure good lighting on your breadboard</li>
                      <li>• Keep the camera steady for best detection</li>
                      <li>• Phone cameras often have better quality!</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Active camera view with overlay
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              {/* Video elements - fill the entire container */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`absolute inset-0 w-full h-full object-cover ${
                  activeTab === 'local' && isLocalCameraActive ? 'block' : 'hidden'
                }`}
              />
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className={`absolute inset-0 w-full h-full object-cover ${
                  activeTab === 'phone' && connectionStatus === 'connected' ? 'block' : 'hidden'
                }`}
                onLoadedMetadata={() => {
                  console.log('Remote video loaded:', remoteVideoRef.current?.videoWidth, 'x', remoteVideoRef.current?.videoHeight);
                }}
                onPlay={() => console.log('Remote video playing')}
                onError={(e) => console.error('Remote video error:', e)}
              />
              
              {/* Hidden canvas for frame capture */}
              <canvas ref={canvasRef} className="hidden" />

              {/* === OVERLAY ELEMENTS === */}

              {/* Breadboard Detection Overlay */}
              {breadboardDetected && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="relative w-[70%] h-[50%] max-w-lg max-h-80">
                    {/* Animated border corners */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500 rounded-tl-lg animate-pulse" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500 rounded-tr-lg animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500 rounded-bl-lg animate-pulse" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500 rounded-br-lg animate-pulse" />
                    
                    {/* Dashed outline */}
                    <div className="absolute inset-2 border-2 border-dashed border-green-500/50 rounded-lg" />
                    
                    {/* Label */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-duo-green text-white text-xs font-display font-semibold px-3 py-1 rounded-xl whitespace-nowrap shadow-lg">
                      Breadboard Detected
                    </div>
                  </div>
                </div>
              )}

              {/* Analysis Status Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-display font-semibold backdrop-blur-md ${
                  analysisStatus === 'analyzing' 
                    ? 'bg-duo-green/20 text-duo-green border border-duo-green/30'
                    : analysisStatus === 'connected'
                    ? 'bg-duo-blue/20 text-duo-blue border border-duo-blue/30'
                    : 'bg-dark-800/80 text-dark-400 border border-dark-700'
                }`}>
                  {analysisStatus === 'analyzing' ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-duo-green animate-pulse" />
                      Analyzing...
                    </>
                  ) : analysisStatus === 'connected' ? (
                    <>
                      <Wifi size={12} />
                      Connected
                    </>
                  ) : (
                    <>
                      <Cpu size={12} />
                      Ready
                    </>
                  )}
                </div>
                
                {breadboardDetected && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-display font-semibold bg-duo-green/20 text-duo-green border border-duo-green/30 backdrop-blur-md">
                    <CheckCircle size={12} />
                    Breadboard Detected
                  </div>
                )}
              </div>

              {/* Tutorial Step Overlay */}
              {isTutorialActive && showHints && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 max-w-md w-full px-4">
                  <div className="bg-dark-800/95 backdrop-blur-md rounded-2xl border border-dark-700 p-4 shadow-xl">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-duo-green flex items-center justify-center shrink-0 shadow-lg">
                        <span className="text-white text-sm font-display font-bold">{currentStep + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-dark-100 font-display font-semibold text-sm">
                          {tutorialSteps[currentStep]?.instruction}
                        </p>
                        {tutorialSteps[currentStep]?.feedback && (
                          <p className="text-duo-green text-xs mt-1 flex items-center gap-1">
                            <CheckCircle size={12} />
                            {tutorialSteps[currentStep].feedback}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Step progress */}
                    <div className="flex gap-1 mt-3">
                      {tutorialSteps.map((step, idx) => (
                        <div
                          key={step.id}
                          className={`h-1.5 flex-1 rounded-full transition-colors ${
                            step.completed
                              ? 'bg-duo-green'
                              : idx === currentStep
                              ? 'bg-duo-green/50'
                              : 'bg-dark-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Detected Components Display */}
              {showDetectedComponents && detectedComponents.length > 0 && (
                <div className="absolute bottom-4 left-4 max-w-xs">
                  <div className="bg-dark-800/95 backdrop-blur-md rounded-2xl border border-dark-700 p-3 shadow-xl">
                    <p className="text-dark-400 text-xs font-display font-semibold mb-2 flex items-center gap-1.5">
                      <Eye size={12} />
                      Detected Components
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {detectedComponents.map((comp, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-duo-green/10 text-duo-green text-xs rounded-lg border border-duo-green/20"
                        >
                          {comp.count > 1 && <span className="font-bold">{comp.count}×</span>}
                          {comp.type}
                          {comp.colors && comp.colors.length > 0 && (
                            <span className="text-dark-400">({comp.colors.join(', ')})</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Issues & Warnings */}
              {showIssues && currentIssues.length > 0 && (
                <div className="absolute bottom-4 right-4 max-w-xs">
                  <div className="bg-dark-800/95 backdrop-blur-md rounded-2xl border border-yellow-500/30 p-3 shadow-xl">
                    <p className="text-yellow-400 text-xs font-display font-semibold mb-2 flex items-center gap-1.5">
                      <AlertTriangle size={12} />
                      Issues Detected
                    </p>
                    <ul className="space-y-1">
                      {currentIssues.slice(0, 3).map((issue, idx) => (
                        <li key={idx} className="text-xs text-dark-100">
                          • {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Hint Buttons */}
              {showHints && hintButtons.map((hint) => (
                <button
                  key={hint.id}
                  onClick={hint.action}
                  className={`absolute ${hint.position.x} ${hint.position.y} flex items-center gap-2 px-4 py-2.5 bg-duo-green hover:bg-duo-greenDark text-white text-sm font-display font-semibold rounded-xl shadow-lg backdrop-blur-sm transition-all hover:scale-105`}
                >
                  {hint.icon}
                  {hint.label}
                </button>
              ))}

              {/* Overlay Controls Toggle */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => setShowHints(!showHints)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-display font-semibold backdrop-blur-md transition-colors ${
                    showHints
                      ? 'bg-duo-green/20 text-duo-green border border-duo-green/30'
                      : 'bg-dark-800/80 text-dark-400 border border-dark-700'
                  }`}
                >
                  {showHints ? <Eye size={12} /> : <EyeOff size={12} />}
                  Hints
                </button>
                <button
                  onClick={() => setShowDetectedComponents(!showDetectedComponents)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-display font-semibold backdrop-blur-md transition-colors ${
                    showDetectedComponents
                      ? 'bg-duo-green/20 text-duo-green border border-duo-green/30'
                      : 'bg-dark-800/80 text-dark-400 border border-dark-700'
                  }`}
                >
                  <Cpu size={12} />
                  Components
                </button>
                <button
                  onClick={() => setShowIssues(!showIssues)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-display font-semibold backdrop-blur-md transition-colors ${
                    showIssues
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : 'bg-dark-800/80 text-dark-400 border border-dark-700'
                  }`}
                >
                  <AlertTriangle size={12} />
                  Issues
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Tutorial Panel */}
        <div className="w-80 bg-dark-800 border-l border-dark-700 flex flex-col shrink-0">
          {/* Tutorial Controls */}
          <div className="p-4 border-b border-dark-700">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-display font-bold text-dark-100">Tutorial Mode</h2>
              {isTutorialActive && (
                <span className="flex items-center gap-1.5 text-xs text-duo-green font-display font-semibold">
                  <div className="w-2 h-2 rounded-full bg-duo-green animate-pulse" />
                  Active
                </span>
              )}
            </div>
            {!isAnyCameraActive ? (
              <p className="text-xs text-dark-400 italic">
                Connect a camera to start the tutorial automatically
              </p>
            ) : (
              <div className="flex gap-2">
                {isTutorialActive ? (
                  <button
                    onClick={pauseTutorial}
                    className="flex items-center justify-center gap-2 flex-1 px-4 py-2.5 bg-dark-700 hover:bg-dark-600 text-dark-100 text-sm font-display font-semibold rounded-xl border border-dark-600 transition-colors"
                  >
                    <Pause size={14} />
                    Pause
                  </button>
                ) : (
                  <button
                    onClick={startTutorial}
                    className="flex items-center justify-center gap-2 flex-1 px-4 py-2.5 bg-duo-green hover:bg-duo-greenDark text-white text-sm font-display font-semibold rounded-xl shadow-lg transition-colors"
                  >
                    <Play size={14} />
                    Resume
                  </button>
                )}
                <button
                  onClick={resetTutorial}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 bg-dark-700 hover:bg-dark-600 text-dark-100 text-sm font-display font-medium rounded-xl border border-dark-600 transition-colors"
                  title="Reset Tutorial"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Steps List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {tutorialSteps.map((step, idx) => (
              <div
                key={step.id}
                className={`p-3 rounded-xl border transition-all ${
                  idx === currentStep && isTutorialActive
                    ? 'border-duo-green/50 bg-duo-green/5'
                    : step.completed
                    ? 'border-dark-700 bg-dark-700'
                    : 'border-dark-700 bg-dark-900/50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {step.completed ? (
                    <CheckCircle size={16} className="text-duo-green shrink-0 mt-0.5" />
                  ) : idx === currentStep && isTutorialActive ? (
                    <div className="w-4 h-4 rounded-full border-2 border-duo-green shrink-0 mt-0.5 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-duo-green animate-pulse" />
                    </div>
                  ) : (
                    <Circle size={16} className="text-dark-500 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${
                      step.completed ? 'text-dark-400' : 'text-dark-100'
                    }`}>
                      {step.instruction}
                    </p>
                    {step.feedback && (
                      <p className="text-xs text-duo-green mt-1">{step.feedback}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Help Section */}
          <div className="p-4 border-t border-dark-700">
            <button
              onClick={askForHelp}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-dark-700 hover:bg-dark-600 text-dark-100 text-sm font-display font-semibold rounded-xl border border-dark-600 transition-colors"
            >
              <HelpCircle size={16} />
              Ask AI for Help
            </button>
            
            {/* Current suggestions */}
            {currentSuggestions.length > 0 && (
              <div className="mt-3 p-3 bg-dark-900 rounded-xl border border-dark-700">
                <div className="flex items-start gap-2">
                  <Lightbulb size={14} className="text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-display font-semibold text-dark-100 mb-1">AI Suggestion</p>
                    <p className="text-xs text-dark-400">{currentSuggestions[0]}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-2xl border border-dark-700 max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-display font-bold text-dark-100">Connect Your Phone</h3>
              <button
                onClick={() => {
                  setShowQRModal(false);
                  if (connectionStatus !== 'connected') {
                    disconnectPhone();
                  }
                }}
                className="p-1 hover:bg-dark-700 rounded-xl transition-colors"
              >
                <X size={20} className="text-dark-400" />
              </button>
            </div>

            <div className="text-center">
              {connectionStatus === 'waiting' || connectionStatus === 'generating' ? (
                <>
                  {qrCodeDataUrl ? (
                    <div className="bg-white p-4 rounded-2xl inline-block mb-4">
                      <img 
                        src={qrCodeDataUrl} 
                        alt="QR Code" 
                        className="w-48 h-48"
                      />
                    </div>
                  ) : (
                    <div className="w-56 h-56 bg-dark-700 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                      <Loader2 size={32} className="text-duo-green animate-spin" />
                    </div>
                  )}
                  
                  <p className="text-dark-100 font-display font-semibold mb-2">Scan with your phone camera</p>
                  <p className="text-dark-400 text-sm mb-4">
                    Point your phone's camera at this QR code to connect
                  </p>
                  
                  <div className="flex items-center justify-center gap-2 text-yellow-400 text-xs font-display font-semibold">
                    <Wifi size={14} className="animate-pulse" />
                    Waiting for connection...
                  </div>
                </>
              ) : connectionStatus === 'connecting' ? (
                <div className="py-8">
                  <Loader2 size={48} className="text-duo-green animate-spin mx-auto mb-4" />
                  <p className="text-dark-100 font-display font-semibold">Connecting...</p>
                </div>
              ) : connectionStatus === 'error' ? (
                <div className="py-8">
                  <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                    <X size={32} className="text-red-500" />
                  </div>
                  <p className="text-dark-100 font-display font-semibold mb-2">Connection Failed</p>
                  <p className="text-dark-400 text-sm mb-4">Please try again</p>
                  <button
                    onClick={startPhoneConnection}
                    className="px-4 py-2 bg-duo-green hover:bg-duo-greenDark text-white text-sm font-display font-semibold rounded-xl shadow-lg transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : null}
            </div>

            <div className="mt-6 p-4 bg-dark-900 rounded-2xl border border-dark-700">
              <h4 className="text-sm font-display font-semibold text-dark-100 mb-2">How it works:</h4>
              <ol className="text-xs text-dark-400 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-lg bg-dark-700 flex items-center justify-center shrink-0 text-dark-100 text-xs font-display font-semibold">1</span>
                  Scan the QR code with your phone camera
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-lg bg-dark-700 flex items-center justify-center shrink-0 text-dark-100 text-xs font-display font-semibold">2</span>
                  Allow camera access when prompted
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-lg bg-dark-700 flex items-center justify-center shrink-0 text-dark-100 text-xs font-display font-semibold">3</span>
                  Your phone camera will stream to this screen
                </li>
              </ol>

              {/* Localhost helper - show editable URL */}
              {isOnLocalhost && connectionUrl && (
                <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                  <div className="flex items-start gap-2 mb-3">
                    <AlertTriangle size={14} className="text-yellow-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-display font-semibold text-yellow-400 mb-1">Using Localhost</p>
                      <p className="text-xs text-dark-400">
                        Replace <code className="text-dark-100 bg-dark-700 px-1 rounded">localhost</code> with your computer's IP address:
                      </p>
                    </div>
                  </div>
                  <div className="bg-dark-800 rounded-xl p-2 font-mono text-xs">
                    <input
                      type="text"
                      defaultValue={connectionUrl}
                      className="w-full bg-transparent text-duo-green outline-none border-b border-dark-700 pb-1"
                      onClick={(e) => e.currentTarget.select()}
                      readOnly
                    />
                    <p className="text-dark-400 mt-2 text-[10px]">
                      Run <code className="text-duo-green">ipconfig</code> and replace localhost with your IPv4 address
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ARTutorialPage;
