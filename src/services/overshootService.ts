// Overshoot AI Service for real-time breadboard video analysis
import { RealtimeVision, StreamClient, type StreamInferenceResult } from '@overshoot/sdk';

// Overshoot API configuration
const OVERSHOOT_API_URL = 'https://cluster1.overshoot.ai/api/v0.2';
const OVERSHOOT_API_KEY = import.meta.env.VITE_OVERSHOOT_API_KEY;

// OpenRouter API for Gemini fallback
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Default ICE servers (same as SDK uses)
const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
  {
    urls: 'turn:34.63.114.235:3478',
    username: '1769538895:c66a907c-61f4-4ec2-93a6-9d6b932776bb',
    credential: 'Fu9L4CwyYZvsOLc+23psVAo3i/Y='
  }
];

// Component detection output schema for structured JSON responses
const COMPONENT_DETECTION_SCHEMA = {
  type: 'object',
  properties: {
    components: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          count: { type: 'number' },
          colors: { type: 'array', items: { type: 'string' } },
          position: { type: 'string' }
        }
      }
    },
    breadboard: {
      type: 'object',
      properties: {
        detected: { type: 'boolean' },
        type: { type: 'string' },
        rows: { type: 'number' }
      }
    },
    wiring: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          color: { type: 'string' },
          from: { type: 'string' },
          to: { type: 'string' }
        }
      }
    },
    issues: {
      type: 'array',
      items: { type: 'string' }
    },
    suggestions: {
      type: 'array',
      items: { type: 'string' }
    }
  }
};

// Prompt for detecting circuit components on a breadboard
const CIRCUIT_DETECTION_PROMPT = `You are an expert circuit analyzer. Analyze the breadboard and electronic components visible in the video.

Identify and report:
1. COMPONENTS: List all electronic components you see (resistors, LEDs, capacitors, wires, batteries, ICs, buttons, etc.)
   - For resistors, try to read the color bands
   - For LEDs, note the color
   - Count multiples of same component

2. BREADBOARD: Describe the breadboard if visible
   - Type (mini, half, full size)
   - Approximate number of rows being used

3. WIRING: Describe the wire connections
   - Color of wires
   - General connection pattern

4. ISSUES: Note any potential problems
   - Loose connections
   - Wrong polarity
   - Missing components
   - Short circuits

5. SUGGESTIONS: Provide 1-2 helpful tips

Be concise and focus on what you can actually see. If something is unclear, say so.`;

// Detected component result from Overshoot
export interface DetectedCircuitState {
  components: Array<{
    type: string;
    count: number;
    colors?: string[];
    position?: string;
  }>;
  breadboard: {
    detected: boolean;
    type?: string;
    rows?: number;
  };
  wiring: Array<{
    color: string;
    from?: string;
    to?: string;
  }>;
  issues: string[];
  suggestions: string[];
  rawResult?: string;
  timestamp: number;
  latency?: number;
}

// Callback types for Overshoot events
export type OnResultCallback = (result: DetectedCircuitState) => void;
export type OnErrorCallback = (error: Error) => void;
export type OnStatusCallback = (status: 'connecting' | 'connected' | 'analyzing' | 'stopped' | 'error') => void;

// Overshoot Vision instance wrapper
class OvershootVisionService {
  private vision: RealtimeVision | null = null;
  private onResultCallback: OnResultCallback | null = null;
  private onErrorCallback: OnErrorCallback | null = null;
  private onStatusCallback: OnStatusCallback | null = null;
  private currentPrompt: string = CIRCUIT_DETECTION_PROMPT;
  private isRunning: boolean = false;

  // Initialize and start the vision service with camera or external stream
  async start(options?: {
    cameraFacing?: 'user' | 'environment';
    videoElement?: HTMLVideoElement;
    onResult?: OnResultCallback;
    onError?: OnErrorCallback;
    onStatus?: OnStatusCallback;
    customPrompt?: string;
  }): Promise<void> {
    if (this.vision) {
      await this.stop();
    }

    if (options?.onResult) this.onResultCallback = options.onResult;
    if (options?.onError) this.onErrorCallback = options.onError;
    if (options?.onStatus) this.onStatusCallback = options.onStatus;
    if (options?.customPrompt) this.currentPrompt = options.customPrompt;

    this.onStatusCallback?.('connecting');

    try {
      this.vision = new RealtimeVision({
        apiUrl: OVERSHOOT_API_URL,
        apiKey: OVERSHOOT_API_KEY,
        prompt: this.currentPrompt,
        outputSchema: COMPONENT_DETECTION_SCHEMA,
        source: {
          type: 'camera',
          cameraFacing: options?.cameraFacing || 'environment'
        },
        processing: {
          clip_length_seconds: 2,  // Analyze 2 second windows
          delay_seconds: 1.5,      // Get results every 1.5 seconds
          fps: 15,                 // Capture at 15fps
          sampling_ratio: 0.2     // Sample 20% of frames
        },
        onResult: (result) => {
          this.handleResult(result);
        }
      });

      await this.vision.start();
      this.isRunning = true;
      this.onStatusCallback?.('connected');
    } catch (error) {
      this.onStatusCallback?.('error');
      this.onErrorCallback?.(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  // External stream WebRTC components
  private streamClient: StreamClient | null = null;
  private peerConnection: RTCPeerConnection | null = null;
  private webSocket: WebSocket | null = null;
  private streamId: string | null = null;
  private keepaliveInterval: ReturnType<typeof setInterval> | null = null;

  // Start with a specific MediaStream (for phone camera streaming)
  // Uses low-level StreamClient API to properly use Overshoot with external streams
  async startWithStream(
    stream: MediaStream,
    options?: {
      onResult?: OnResultCallback;
      onError?: OnErrorCallback;
      onStatus?: OnStatusCallback;
      customPrompt?: string;
    }
  ): Promise<void> {
    // Stop any existing vision service
    if (this.vision) {
      await this.stop();
    }
    this.cleanupExternalStream();

    if (options?.onResult) this.onResultCallback = options.onResult;
    if (options?.onError) this.onErrorCallback = options.onError;
    if (options?.onStatus) this.onStatusCallback = options.onStatus;
    if (options?.customPrompt) this.currentPrompt = options.customPrompt;

    this.onStatusCallback?.('connecting');

    try {
      console.log('📹 Starting Overshoot with external MediaStream');
      
      // Validate stream has video track
      const videoTracks = stream.getVideoTracks();
      if (!videoTracks.length) {
        throw new Error('MediaStream has no video tracks');
      }
      const videoTrack = videoTracks[0];
      console.log('  Video track:', videoTrack.label, videoTrack.getSettings());

      // Create StreamClient for low-level API access
      this.streamClient = new StreamClient({
        baseUrl: OVERSHOOT_API_URL,
        apiKey: OVERSHOOT_API_KEY
      });

      // Create RTCPeerConnection with ICE servers
      this.peerConnection = new RTCPeerConnection({
        iceServers: DEFAULT_ICE_SERVERS
      });

      // Add event listeners for debugging
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('  ICE candidate:', event.candidate.type);
        }
      };

      this.peerConnection.oniceconnectionstatechange = () => {
        console.log('  ICE state:', this.peerConnection?.iceConnectionState);
      };

      // Add the external stream's video track to peer connection
      this.peerConnection.addTrack(videoTrack, stream);
      console.log('  Added video track to peer connection');

      // Create SDP offer
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      
      if (!this.peerConnection.localDescription) {
        throw new Error('Failed to create local description');
      }

      // Get FPS from track settings
      const settings = videoTrack.getSettings();
      const fps = settings.frameRate || 30;

      // Create stream on Overshoot server
      console.log('  Creating stream on Overshoot server...');
      const response = await this.streamClient.createStream({
        webrtc: {
          type: 'offer',
          sdp: this.peerConnection.localDescription.sdp
        },
        processing: {
          sampling_ratio: 0.2,
          fps: fps,
          clip_length_seconds: 2,
          delay_seconds: 1.5
        },
        inference: {
          prompt: this.currentPrompt,
          backend: 'overshoot',
          model: 'Qwen/Qwen3-VL-30B-A3B-Instruct',
          output_schema_json: COMPONENT_DETECTION_SCHEMA
        }
      });

      console.log('  Stream created:', response.stream_id);
      this.streamId = response.stream_id;

      // Set remote description
      await this.peerConnection.setRemoteDescription({
        type: 'answer',
        sdp: response.webrtc.sdp
      });

      // Set up keepalive
      const ttlSeconds = response.lease?.ttl_seconds || 300;
      this.keepaliveInterval = setInterval(async () => {
        if (this.streamId && this.streamClient) {
          try {
            await this.streamClient.renewLease(this.streamId);
          } catch (error) {
            console.error('Keepalive failed:', error);
          }
        }
      }, (ttlSeconds / 2) * 1000);

      // Connect WebSocket for results
      this.webSocket = this.streamClient.connectWebSocket(response.stream_id);
      
      this.webSocket.onopen = () => {
        console.log('  WebSocket connected');
        this.webSocket?.send(JSON.stringify({ api_key: OVERSHOOT_API_KEY }));
      };

      this.webSocket.onmessage = (event) => {
        try {
          const result: StreamInferenceResult = JSON.parse(event.data);
          this.handleResult(result);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.webSocket.onerror = () => {
        console.error('WebSocket error');
      };

      this.webSocket.onclose = (event) => {
        if (this.isRunning) {
          console.warn('WebSocket closed unexpectedly:', event.code);
        }
      };

      this.isRunning = true;
      this.onStatusCallback?.('connected');
      console.log('✅ Overshoot started with external MediaStream');

    } catch (error) {
      console.error('❌ Failed to start Overshoot with external stream:', error);
      this.onStatusCallback?.('error');
      this.onErrorCallback?.(error instanceof Error ? error : new Error(String(error)));
      this.cleanupExternalStream();
      throw error;
    }
  }

  // Clean up external stream WebRTC resources
  private cleanupExternalStream(): void {
    if (this.keepaliveInterval) {
      clearInterval(this.keepaliveInterval);
      this.keepaliveInterval = null;
    }
    if (this.webSocket) {
      this.webSocket.close();
      this.webSocket = null;
    }
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    this.streamClient = null;
    this.streamId = null;
  }

  // Handle result from Overshoot
  private handleResult(result: { result: string; inference_latency_ms?: number; total_latency_ms?: number }): void {
    this.onStatusCallback?.('analyzing');
    
    try {
      let parsed: any;
      
      try {
        parsed = JSON.parse(result.result);
      } catch {
        // If JSON parsing fails, create a basic result from text
        parsed = {
          components: [],
          breadboard: { detected: false },
          wiring: [],
          issues: [],
          suggestions: [result.result]
        };
      }

      const detectedState: DetectedCircuitState = {
        components: parsed.components || [],
        breadboard: parsed.breadboard || { detected: false },
        wiring: parsed.wiring || [],
        issues: parsed.issues || [],
        suggestions: parsed.suggestions || [],
        rawResult: result.result,
        timestamp: Date.now(),
        latency: result.total_latency_ms
      };

      this.onResultCallback?.(detectedState);
    } catch (error) {
      console.error('Error parsing Overshoot result:', error);
      this.onErrorCallback?.(error instanceof Error ? error : new Error('Failed to parse result'));
    }
  }

  // Update the detection prompt (e.g., for tutorial-specific guidance)
  updatePrompt(prompt: string): void {
    this.currentPrompt = prompt;
    if (this.vision) {
      this.vision.updatePrompt(prompt);
    }
  }

  // Create a tutorial-specific prompt
  createTutorialPrompt(tutorialStep: string, expectedComponents: string[]): string {
    return `${CIRCUIT_DETECTION_PROMPT}

CURRENT TUTORIAL STEP: ${tutorialStep}

EXPECTED COMPONENTS FOR THIS STEP:
${expectedComponents.map(c => `- ${c}`).join('\n')}

Additional tasks:
- Check if the expected components are present and correctly placed
- Provide specific guidance for completing the current step
- Note if any expected components are missing`;
  }

  // Stop the vision service
  async stop(): Promise<void> {
    // Clean up external stream resources first
    this.cleanupExternalStream();
    
    if (this.vision) {
      try {
        await this.vision.stop();
      } catch (error) {
        console.error('Error stopping Overshoot vision:', error);
      }
      this.vision = null;
    }
    
    this.isRunning = false;
    this.onStatusCallback?.('stopped');
  }

  // Check if the service is running
  getIsRunning(): boolean {
    return this.isRunning;
  }

  // Get the default circuit detection prompt
  getDefaultPrompt(): string {
    return CIRCUIT_DETECTION_PROMPT;
  }

  // Direct frame analysis using Gemini (reliable fallback)
  // Captures a frame from the video/stream and sends it to Gemini for analysis
  async analyzeFrame(videoElement: HTMLVideoElement): Promise<DetectedCircuitState> {
    // Capture frame from video element
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth || 640;
    canvas.height = videoElement.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Failed to create canvas context');
    }
    
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    const base64Image = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
    
    console.log('📸 Captured frame for Gemini analysis:', canvas.width, 'x', canvas.height);
    
    try {
      const response = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Amperon Circuit Analyzer'
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-001',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Analyze this image for circuit components. Return ONLY a valid JSON object with this exact structure:
{
  "breadboard": { "detected": true/false, "type": "mini/half/full" },
  "components": [{ "type": "component_name", "count": 1 }],
  "wiring": [{ "color": "wire_color" }],
  "issues": ["issue1"],
  "suggestions": ["suggestion1"]
}

Be very generous - if you see ANYTHING that looks like a breadboard (white/tan rectangular board with holes), set breadboard.detected = true.
If you see ANY electronic components (resistors, LEDs, wires, batteries, etc.), list them.
Return ONLY the JSON, no other text.`
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`
                  }
                }
              ]
            }
          ],
          max_tokens: 500,
          temperature: 0.1
        })
      });
      
      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }
      
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      
      console.log('🤖 Gemini response:', content);
      
      // Parse the JSON response
      let parsed;
      try {
        // Extract JSON from response (handle markdown code blocks)
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (e) {
        console.error('Failed to parse Gemini response:', e);
        parsed = {
          breadboard: { detected: false },
          components: [],
          wiring: [],
          issues: ['Failed to parse response'],
          suggestions: []
        };
      }
      
      const result: DetectedCircuitState = {
        components: parsed.components || [],
        breadboard: parsed.breadboard || { detected: false },
        wiring: parsed.wiring || [],
        issues: parsed.issues || [],
        suggestions: parsed.suggestions || [],
        rawResult: content,
        timestamp: Date.now()
      };
      
      console.log('✅ Gemini detected breadboard:', result.breadboard.detected);
      return result;
      
    } catch (error) {
      console.error('Gemini analysis error:', error);
      throw error;
    }
  }

  // Start continuous frame analysis with Gemini (polls every few seconds)
  private frameAnalysisInterval: ReturnType<typeof setInterval> | null = null;
  private frameVideoElement: HTMLVideoElement | null = null;
  
  async startFrameAnalysis(
    videoElement: HTMLVideoElement,
    options?: {
      onResult?: OnResultCallback;
      onError?: OnErrorCallback;
      onStatus?: OnStatusCallback;
      intervalMs?: number;
    }
  ): Promise<void> {
    this.stopFrameAnalysis();
    
    this.frameVideoElement = videoElement;
    if (options?.onResult) this.onResultCallback = options.onResult;
    if (options?.onError) this.onErrorCallback = options.onError;
    if (options?.onStatus) this.onStatusCallback = options.onStatus;
    
    this.onStatusCallback?.('connecting');
    this.isRunning = true;
    
    const intervalMs = options?.intervalMs || 1500; // Every 1.5 seconds for fast response
    
    console.log('🎬 Starting Gemini frame analysis every', intervalMs, 'ms');
    
    // Initial analysis - start immediately
    this.runFrameAnalysis();
    
    // Continuous analysis
    this.frameAnalysisInterval = setInterval(async () => {
      await this.runFrameAnalysis();
    }, intervalMs);
    
    this.onStatusCallback?.('connected');
  }
  
  private async runFrameAnalysis(): Promise<void> {
    if (!this.frameVideoElement || !this.isRunning) return;
    
    // Check if video has valid dimensions
    if (this.frameVideoElement.videoWidth === 0 || this.frameVideoElement.videoHeight === 0) {
      console.log('⏳ Video not ready yet, skipping frame...');
      return;
    }
    
    this.onStatusCallback?.('analyzing');
    
    try {
      const result = await this.analyzeFrame(this.frameVideoElement);
      this.onResultCallback?.(result);
    } catch (error) {
      console.error('Frame analysis error:', error);
      this.onErrorCallback?.(error instanceof Error ? error : new Error(String(error)));
    }
  }
  
  stopFrameAnalysis(): void {
    if (this.frameAnalysisInterval) {
      clearInterval(this.frameAnalysisInterval);
      this.frameAnalysisInterval = null;
    }
    this.frameVideoElement = null;
  }
}

// Export singleton instance
export const overshootService = new OvershootVisionService();

// Convert detected components to app component types
export function mapDetectedToAppComponents(detected: DetectedCircuitState): Array<{
  type: string;
  name: string;
  count: number;
  colors?: string[];
}> {
  const componentMap: Record<string, string> = {
    'resistor': 'resistor',
    'led': 'led',
    'capacitor': 'capacitor',
    'inductor': 'inductor',
    'battery': 'battery',
    'button': 'pushbutton',
    'switch': 'switch',
    'transistor': 'transistor',
    'diode': 'diode',
    'buzzer': 'buzzer',
    'motor': 'motor',
    'potentiometer': 'potentiometer',
    'ic': 'opamp',
    'chip': 'opamp',
    'wire': 'wire',
    'jumper': 'wire',
    'speaker': 'speaker',
    'fuse': 'fuse',
    'ground': 'ground',
    '7-segment': '7segment',
    'display': '7segment'
  };

  return detected.components.map(comp => {
    const lowerType = comp.type.toLowerCase();
    let mappedType = 'wire'; // default
    
    for (const [key, value] of Object.entries(componentMap)) {
      if (lowerType.includes(key)) {
        mappedType = value;
        break;
      }
    }

    return {
      type: mappedType,
      name: comp.type,
      count: comp.count,
      colors: comp.colors
    };
  });
}
