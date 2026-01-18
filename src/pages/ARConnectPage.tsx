import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Camera, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Smartphone,
  Wifi,
  RotateCcw
} from 'lucide-react';
import { arConnectionManager } from '../services/arConnectionService';

type ConnectionStatus = 'checking-params' | 'initializing' | 'requesting-camera' | 'connecting' | 'connected' | 'error';

const ARConnectPage: React.FC = () => {
  console.log('🚀 ARConnectPage COMPONENT LOADED');
  
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<ConnectionStatus>('checking-params');
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const peerId = searchParams.get('peer');
  const sessionId = searchParams.get('session');

  console.log('📱 ARConnectPage - Peer ID:', peerId);
  console.log('📱 ARConnectPage - Session ID:', sessionId);
  console.log('📱 ARConnectPage - Full URL:', window.location.href);

  useEffect(() => {
    console.log('🔵 ARConnectPage useEffect RUNNING');
    setDebugInfo(`Params - Peer: ${peerId ? 'OK' : 'MISSING'}, Session: ${sessionId ? 'OK' : 'MISSING'}`);
    
    if (!peerId || !sessionId) {
      console.error('❌ Missing parameters!');
      setStatus('error');
      setError('Invalid connection link. Missing peer ID or session ID. Please scan the QR code again.');
      return;
    }

    console.log('✅ Parameters valid, starting connection...');
    setStatus('initializing');
    startConnection();

    return () => {
      console.log('🧹 ARConnectPage cleanup');
      // Cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      arConnectionManager.disconnect();
    };
  }, [peerId, sessionId]);

  const startConnection = async () => {
    if (!peerId || !sessionId) return;

    console.log('🔌 startConnection() called');

    try {
      console.log('📷 Requesting camera access...');
      setDebugInfo('Requesting camera access...');
      setStatus('requesting-camera');
      
      // Request camera access with a timeout
      const cameraPromise = navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      const cameraTimeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Camera permission timeout - took too long')), 10000)
      );

      console.log('⏳ Waiting for camera permission...');
      const stream = await Promise.race([cameraPromise, cameraTimeout]) as MediaStream;
      console.log('✅ Camera access granted!');

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      console.log(`🔗 Connecting to host: ${peerId}...`);
      setDebugInfo(`Camera ready. Connecting to host: ${peerId}...`);
      setStatus('connecting');
      
      // Connect to the host (laptop)
      await arConnectionManager.connectToHost(peerId, sessionId);
      
      console.log('✅ Connected successfully!');
      setDebugInfo('Connected successfully!');
      setStatus('connected');
    } catch (err) {
      console.error('❌ Connection error:', err);
      setStatus('error');
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('📷 Camera access was denied. Please allow camera access and try again.');
          setDebugInfo('Camera permission denied by user');
        } else if (err.name === 'NotFoundError') {
          setError('📱 No camera found on this device.');
          setDebugInfo('No camera hardware detected');
        } else if (err.message.includes('timeout')) {
          setError('⏱️ ' + err.message + ' Make sure the laptop is running and connected to the same network.');
          setDebugInfo('Connection timed out');
        } else if (err.message.includes('data connection')) {
          setError('🔗 ' + err.message + ' This usually means the IP address is incorrect or the host is not reachable.');
          setDebugInfo('Data connection failed');
        } else if (err.message.includes('Camera permission')) {
          setError('📷 ' + err.message);
          setDebugInfo('Camera permission issue');
        } else {
          setError('❌ ' + (err.message || 'Failed to connect. Please try again.'));
          setDebugInfo(`Error: ${err.message}`);
        }
      } else {
        setError('❌ An unexpected error occurred. Please try again.');
        setDebugInfo('Unknown error occurred');
      }
    }
  };

  const handleRetry = () => {
    setStatus('initializing');
    setError(null);
    setDebugInfo('');
    startConnection();
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col">
      {/* ALWAYS VISIBLE HEADER - If you see this, React is working */}
      <header className="h-14 bg-[#161b22] border-b border-[#30363d] flex items-center justify-center px-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <Camera size={16} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-[#c9d1d9]">Amperon AR Connect</span>
        </div>
      </header>

      {/* Debug Banner - Always visible */}
      <div className="bg-yellow-500/10 border-b border-yellow-500/30 px-4 py-2">
        <p className="text-xs text-yellow-400 font-mono">
          📡 Status: {status} | URL: {window.location.pathname}
        </p>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        {status === 'checking-params' && (
          <div className="text-center">
            <Loader2 size={48} className="text-green-500 animate-spin mx-auto mb-4" />
            <p className="text-[#c9d1d9] font-medium">Checking connection parameters...</p>
            <p className="text-xs text-[#8b949e] mt-2">{debugInfo}</p>
          </div>
        )}

        {status === 'initializing' && (
          <div className="text-center">
            <Loader2 size={48} className="text-green-500 animate-spin mx-auto mb-4" />
            <p className="text-[#c9d1d9] font-medium">Initializing connection...</p>
            <p className="text-xs text-[#8b949e] mt-2">{debugInfo}</p>
          </div>
        )}

        {status === 'requesting-camera' && (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-[#21262d] border border-[#30363d] flex items-center justify-center mx-auto mb-6">
              <Camera size={32} className="text-green-500 animate-pulse" />
            </div>
            <h2 className="text-lg font-semibold text-[#c9d1d9] mb-2">Camera Access Required</h2>
            <p className="text-sm text-[#8b949e] max-w-xs mb-3">
              Please allow camera access when prompted to stream your view to the computer.
            </p>
            <p className="text-xs text-[#8b949e]">{debugInfo}</p>
          </div>
        )}

        {status === 'connecting' && (
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-[#21262d] border border-[#30363d] flex items-center justify-center mx-auto mb-6">
                <Wifi size={32} className="text-green-500" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-green-500/30 animate-ping" />
            </div>
            <h2 className="text-lg font-semibold text-[#c9d1d9] mb-2">Connecting to Host...</h2>
            <p className="text-sm text-[#8b949e] max-w-xs mb-3">
              Establishing secure connection to your computer.
            </p>
            <p className="text-xs text-[#8b949e]">{debugInfo}</p>
            <p className="text-xs text-[#484f58] mt-3">This may take 10-15 seconds</p>
          </div>
        )}

        {status === 'connected' && (
          <div className="w-full max-w-lg">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h2 className="text-lg font-semibold text-[#c9d1d9] mb-1">Connected!</h2>
              <p className="text-sm text-[#8b949e]">
                Your camera is streaming to the computer.
              </p>
            </div>

            {/* Camera Preview */}
            <div className="relative rounded-xl overflow-hidden bg-[#161b22] border border-[#30363d] shadow-xl">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full aspect-video object-cover"
              />
              
              {/* Status Overlay */}
              <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-green-500/20 backdrop-blur-md rounded-full border border-green-500/30">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-green-400">Live</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#161b22] rounded-xl border border-[#30363d]">
              <div className="flex items-start gap-3">
                <Smartphone size={16} className="text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#c9d1d9] mb-1">Keep this page open</p>
                  <p className="text-xs text-[#8b949e]">
                    Point your camera at your breadboard. The video is being streamed to your computer for analysis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="w-full max-w-sm">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
                <XCircle size={32} className="text-red-500" />
              </div>
              <h2 className="text-lg font-semibold text-[#c9d1d9] mb-2">Connection Failed</h2>
              <p className="text-sm text-[#8b949e] mb-6 leading-relaxed">{error}</p>
            </div>

            {/* Troubleshooting Tips */}
            <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-4 mb-6">
              <h3 className="text-sm font-medium text-[#c9d1d9] mb-3">Troubleshooting:</h3>
              <ul className="text-xs text-[#8b949e] space-y-2">
                <li>✓ Check that both devices are on the same WiFi network</li>
                <li>✓ Verify the laptop's IP address is correct (check VITE_LAPTOP_IP in .env)</li>
                <li>✓ Ensure the laptop has the AR Lab page open at http://YOUR_IP:5173/ar</li>
                <li>✓ Check your firewall allows connections on port 5173</li>
                <li>✓ Restart the laptop's dev server (npm run dev)</li>
              </ul>
            </div>
            
            <button
              onClick={handleRetry}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              <RotateCcw size={16} />
              Try Again
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-4 text-center">
        <p className="text-xs text-[#484f58]">
          Powered by Amperon • Secure peer-to-peer connection
        </p>
      </footer>
    </div>
  );
};

export default ARConnectPage;
