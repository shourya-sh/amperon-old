// AR Connection Service - Handles QR code generation and WebRTC peer connection
// This enables phone camera streaming to the web app

// Simple signaling via PeerJS (uses their free signaling server)
// In production, you'd want to use your own signaling server

export interface ARConnectionState {
  status: 'idle' | 'generating' | 'waiting' | 'connecting' | 'connected' | 'error';
  peerId: string | null;
  connectionUrl: string | null;
  error: string | null;
  remoteStream: MediaStream | null;
}

export type ARConnectionCallback = (state: ARConnectionState) => void;

// Generate a random peer ID for the connection
function generatePeerId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'amperon-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Get the proper base URL for QR code generation
// Automatically converts localhost to work across network
function getConnectionBaseUrl(): string {
  const hostname = window.location.hostname;
  const port = window.location.port;
  const protocol = window.location.protocol;

  // Prefer new env var VITE_LAPTOP_IP_ADRESS; fallback to VITE_LAPTOP_IP
  const envIpRaw = (import.meta.env as any).VITE_LAPTOP_IP_ADRESS || (import.meta.env as any).VITE_LAPTOP_IP;
  const envIp = typeof envIpRaw === 'string' ? envIpRaw.trim() : undefined;

  // Detect if we're running on a publicly hosted domain (not localhost/IP)
  const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';
  const isIpHostname = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
  const isHostedDomain = !isLocalHost && !isIpHostname;

  console.log('🔍 getConnectionBaseUrl() called');
  console.log('  hostname:', hostname);
  console.log('  isHostedDomain:', isHostedDomain);
  console.log('  envIpPreferred (ADRESS → IP):', envIp);
  console.log('  Full import.meta.env:', import.meta.env);

  // When hosted on a real domain, always use the origin (e.g., https://circuitco.web.app)
  if (isHostedDomain) {
    const url = window.location.origin;
    console.log('  🌐 Hosted domain detected, using origin:', url);
    return url;
  }

  // Development: if env IP override is defined, use it
  if (envIp && envIp.length > 0) {
    const url = `${protocol}//${envIp}${port ? ':' + port : ''}`;
    console.log('  ✅ Using env IP override (dev):', url);
    return url;
  }

  // Fallback to current host (localhost or IP)
  const url = `${protocol}//${hostname}${port ? ':' + port : ''}`;
  console.log('  ⚠️ Fallback to current host:', url);
  return url;
}

// QR Code data URL generator using a simple QR code library approach
// We'll use an API-based approach for simplicity
export async function generateQRCodeDataUrl(text: string): Promise<string> {
  // Use QR Server API (free, no API key needed)
  const encodedText = encodeURIComponent(text);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodedText}&bgcolor=1a1a1f&color=22c55e`;
  
  // Fetch and convert to data URL for reliability
  try {
    const response = await fetch(qrUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    // Fallback to direct URL if fetch fails
    return qrUrl;
  }
}

// Connection data embedded in QR code
export interface QRConnectionData {
  type: 'amperon-ar';
  peerId: string;
  timestamp: number;
  sessionId: string;
}

// AR Connection Manager using WebRTC
class ARConnectionManager {
  private peer: any = null; // PeerJS instance
  private connection: any = null;
  private mediaConnection: any = null;
  private state: ARConnectionState = {
    status: 'idle',
    peerId: null,
    connectionUrl: null,
    error: null,
    remoteStream: null
  };
  private callbacks: Set<ARConnectionCallback> = new Set();
  private peerJsLoaded: boolean = false;

  // Subscribe to state changes
  subscribe(callback: ARConnectionCallback): () => void {
    this.callbacks.add(callback);
    callback(this.state);
    return () => this.callbacks.delete(callback);
  }

  // Notify all subscribers of state change
  private notifySubscribers(): void {
    this.callbacks.forEach(cb => cb(this.state));
  }

  // Update state and notify
  private updateState(partial: Partial<ARConnectionState>): void {
    this.state = { ...this.state, ...partial };
    this.notifySubscribers();
  }

  // Load PeerJS dynamically with timeout and fallback
  private async loadPeerJS(): Promise<void> {
    if (this.peerJsLoaded) return;

    return new Promise((resolve, reject) => {
      if ((window as any).Peer) {
        this.peerJsLoaded = true;
        resolve();
        return;
      }

      let resolved = false;
      let timeoutId: ReturnType<typeof setTimeout> | null = null;

      const cleanup = () => {
        if (timeoutId) clearTimeout(timeoutId);
      };

      const handleSuccess = () => {
        if (!resolved) {
          resolved = true;
          cleanup();
          this.peerJsLoaded = true;
          resolve();
        }
      };

      const handleError = (error: string) => {
        if (!resolved) {
          resolved = true;
          cleanup();
          reject(new Error(error));
        }
      };

      const script = document.createElement('script');
      
      // Set timeout to detect if script loading is hanging
      timeoutId = setTimeout(() => {
        handleError('PeerJS library took too long to load (10s timeout). Check your internet connection.');
      }, 10000);

      script.onload = () => handleSuccess();
      script.onerror = () => {
        handleError('Failed to load PeerJS library. Check your internet connection.');
      };

      // Try primary CDN
      script.src = 'https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js';
      document.head.appendChild(script);
    });
  }

  // Start hosting a connection (laptop side)
  async startHost(): Promise<{ qrDataUrl: string; connectionUrl: string; peerId: string }> {
    this.updateState({ status: 'generating', error: null });

    try {
      await this.loadPeerJS();

      const peerId = generatePeerId();
      const Peer = (window as any).Peer;

      return new Promise((resolve, reject) => {
        // Build ICE servers list with optional TURN support
        const iceServers: RTCIceServer[] = [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun3.l.google.com:19302' }
        ];
        
        // Add TURN servers if configured (for restrictive networks)
        const turnUrls = import.meta.env.VITE_TURN_URLS;
        const turnUsername = import.meta.env.VITE_TURN_USERNAME;
        const turnCredential = import.meta.env.VITE_TURN_CREDENTIAL;
        
        if (turnUrls && turnUsername && turnCredential) {
          const urls = turnUrls.split(',').map((u: string) => u.trim());
          iceServers.push({
            urls,
            username: turnUsername,
            credential: turnCredential
          });
          console.log('🔄 TURN servers configured for relay');
        }
        
        this.peer = new Peer(peerId, {
          debug: 0,  // Disable debug mode for better performance
          key: 'peerjs',  // Use default key
          config: {
            iceServers,
            iceTransportPolicy: 'all'
          }
        });

        this.peer.on('open', async (id: string) => {
          const sessionId = Date.now().toString(36);

          // Create connection URL for the phone
          const baseUrl = getConnectionBaseUrl();
          const connectionUrl = `${baseUrl}/ar-connect?peer=${id}&session=${sessionId}`;
          
          // Generate QR code
          const qrDataUrl = await generateQRCodeDataUrl(connectionUrl);

          this.updateState({
            status: 'waiting',
            peerId: id,
            connectionUrl
          });

          // Set up connection handlers
          this.setupHostHandlers();

          resolve({ qrDataUrl, connectionUrl, peerId: id });
        });

        this.peer.on('error', (err: Error) => {
          this.updateState({ status: 'error', error: err.message });
          reject(err);
        });
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start host';
      this.updateState({ status: 'error', error: errorMessage });
      throw error;
    }
  }

  // Set up handlers for incoming connections (laptop side)
  private setupHostHandlers(): void {
    if (!this.peer) return;

    // Handle incoming data connection
    this.peer.on('connection', (conn: any) => {
      this.connection = conn;
      this.updateState({ status: 'connecting' });

      conn.on('open', () => {
        console.log('Data connection established');
      });

      conn.on('data', (data: any) => {
        console.log('Received data:', data);
        // Handle any control messages from phone
      });

      conn.on('close', () => {
        this.handleDisconnect();
      });
    });

    // Handle incoming media call
    this.peer.on('call', (call: any) => {
      this.mediaConnection = call;
      
      // Answer without sending our own stream
      call.answer();

      call.on('stream', (remoteStream: MediaStream) => {
        console.log('Received remote camera stream:', {
          id: remoteStream.id,
          active: remoteStream.active,
          videoTracks: remoteStream.getVideoTracks().length,
          audioTracks: remoteStream.getAudioTracks().length,
          tracks: remoteStream.getTracks().map(t => ({
            kind: t.kind,
            enabled: t.enabled,
            muted: t.muted,
            readyState: t.readyState
          }))
        });
        this.updateState({
          status: 'connected',
          remoteStream
        });
      });

      call.on('close', () => {
        this.handleDisconnect();
      });

      call.on('error', (err: Error) => {
        console.error('Call error:', err);
        this.updateState({ status: 'error', error: err.message });
      });
    });
  }

  // Connect to a host (phone side) - called from the /ar-connect page
  async connectToHost(peerId: string, _sessionId: string, timeoutMs: number = 15000): Promise<void> {
    this.updateState({ status: 'connecting', error: null });

    try {
      await this.loadPeerJS();

      const Peer = (window as any).Peer;
      const myPeerId = `${peerId}-client-${Date.now().toString(36)}`;

      return new Promise((resolve, reject) => {
        let timeoutHandle: ReturnType<typeof setTimeout> | null = null;
        let resolved = false;

        const cleanup = () => {
          if (timeoutHandle) clearTimeout(timeoutHandle);
        };

        const handleSuccess = () => {
          if (!resolved) {
            resolved = true;
            cleanup();
            resolve();
          }
        };

        const handleError = (error: Error | string) => {
          if (!resolved) {
            resolved = true;
            cleanup();
            const errorMsg = error instanceof Error ? error.message : String(error);
            this.updateState({ status: 'error', error: errorMsg });
            reject(new Error(errorMsg));
          }
        };

        // Set overall timeout
        timeoutHandle = setTimeout(() => {
          if (!resolved) {
            handleError('Connection timeout (15s). The laptop may not be reachable. Check that the host is running and your IP address is correct.');
            // Try to cleanup peer connection
            if (this.peer) {
              this.peer.destroy();
              this.peer = null;
            }
          }
        }, timeoutMs);

        // Build ICE servers list with optional TURN support
        const iceServers: RTCIceServer[] = [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun3.l.google.com:19302' }
        ];
        
        // Add TURN servers if configured (for restrictive networks)
        const turnUrls = import.meta.env.VITE_TURN_URLS;
        const turnUsername = import.meta.env.VITE_TURN_USERNAME;
        const turnCredential = import.meta.env.VITE_TURN_CREDENTIAL;
        
        if (turnUrls && turnUsername && turnCredential) {
          const urls = turnUrls.split(',').map((u: string) => u.trim());
          iceServers.push({
            urls,
            username: turnUsername,
            credential: turnCredential
          });
          console.log('🔄 TURN servers configured for relay');
        }
        
        this.peer = new Peer(myPeerId, {
          debug: 0,  // Disable debug mode for better performance
          key: 'peerjs',  // Use default key
          config: {
            iceServers,
            iceTransportPolicy: 'all'
          }
        });

        this.peer.on('open', async () => {
          try {
            // Establish data connection first
            this.connection = this.peer.connect(peerId);
            let connectionOpened = false;

            const connectionTimeout = setTimeout(() => {
              if (!connectionOpened && !resolved) {
                handleError('Unable to establish data connection. The host may not be listening or the network is unreachable.');
              }
            }, 10000);

            this.connection.on('open', async () => {
              clearTimeout(connectionTimeout);
              connectionOpened = true;
              
              try {
                // Now get camera and start streaming
                const stream = await navigator.mediaDevices.getUserMedia({
                  video: {
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                  },
                  audio: false
                });

                // Call the host with our camera stream
                this.mediaConnection = this.peer.call(peerId, stream);

                this.mediaConnection.on('close', () => {
                  stream.getTracks().forEach(track => track.stop());
                  this.handleDisconnect();
                });

                this.mediaConnection.on('error', (err: Error) => {
                  stream.getTracks().forEach(track => track.stop());
                  handleError(err);
                });

                this.updateState({ status: 'connected' });
                handleSuccess();
              } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to access camera';
                handleError(errorMessage);
              }
            });

            this.connection.on('error', (err: Error) => {
              clearTimeout(connectionTimeout);
              if (!connectionOpened) {
                handleError(`Connection error: ${err.message}`);
              }
            });

            this.connection.on('close', () => {
              cleanup();
            });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to request camera';
            handleError(errorMessage);
          }
        });

        this.peer.on('error', (err: Error) => {
          handleError(err);
        });
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect';
      this.updateState({ status: 'error', error: errorMessage });
      throw error;
    }
  }

  // Handle disconnection
  private handleDisconnect(): void {
    this.updateState({
      status: 'idle',
      remoteStream: null
    });
  }

  // Disconnect and cleanup
  disconnect(): void {
    if (this.mediaConnection) {
      this.mediaConnection.close();
      this.mediaConnection = null;
    }

    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }

    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }

    if (this.state.remoteStream) {
      this.state.remoteStream.getTracks().forEach(track => track.stop());
    }

    this.updateState({
      status: 'idle',
      peerId: null,
      connectionUrl: null,
      error: null,
      remoteStream: null
    });
  }

  // Get current state
  getState(): ARConnectionState {
    return this.state;
  }

  // Check if connected
  isConnected(): boolean {
    return this.state.status === 'connected';
  }
}

// Export singleton instance
export const arConnectionManager = new ARConnectionManager();
