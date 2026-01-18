import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  fetchComponentPrices,
  fetchAllComponentPrices,
  clearCache,
  getCacheStats,
  checkApiStatus,
} from './priceScraperService.js';

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);

// ===== PRICE SCRAPING API ENDPOINTS =====

// Health check with API status
app.get('/api/health', async (req, res) => {
  const apiStatus = await checkApiStatus();
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    priceApi: apiStatus,
  });
});

// Fetch price for a single component
app.post('/api/prices/component', async (req, res) => {
  try {
    const { componentId, componentType, componentName, quantity, properties } = req.body;
    
    if (!componentId || !componentType || !componentName) {
      return res.status(400).json({ 
        error: 'Missing required fields: componentId, componentType, componentName' 
      });
    }

    // Note: fetchComponentPrices signature is (id, name, type)
    const pricing = await fetchComponentPrices(
      componentId,
      componentName,
      componentType
    );

    res.json(pricing);
  } catch (error) {
    console.error('Error fetching component price:', error);
    res.status(500).json({ error: error.message });
  }
});

// Fetch prices for multiple components
app.post('/api/prices/batch', async (req, res) => {
  try {
    const { components } = req.body;
    
    if (!components || !Array.isArray(components)) {
      return res.status(400).json({ 
        error: 'Missing required field: components (array)' 
      });
    }

    const pricing = await fetchAllComponentPrices(components);
    res.json(pricing);
  } catch (error) {
    console.error('Error fetching batch prices:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get cache statistics
app.get('/api/prices/cache/stats', (req, res) => {
  const stats = getCacheStats();
  res.json(stats);
});

// Clear price cache
app.post('/api/prices/cache/clear', (req, res) => {
  clearCache();
  res.json({ message: 'Cache cleared successfully' });
});
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://circuitco.web.app',
  process.env.CLIENT_ORIGIN,
  process.env.VITE_SITE_URL,
].filter(Boolean);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

// Store active sessions
const sessions = new Map();

// AR Sessions - for phone camera streaming
const arSessions = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a collaboration session
  socket.on('join-session', (data) => {
    const { sessionId, userId, userName, userColor } = data;
    
    socket.join(sessionId);
    
    // Initialize session if it doesn't exist
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, {
        users: new Map(),
        nodes: [],
        edges: [],
      });
    }
    
    const session = sessions.get(sessionId);
    session.users.set(userId, {
      id: userId,
      name: userName,
      color: userColor,
      socketId: socket.id,
    });
    
    // Notify other users in the session
    socket.to(sessionId).emit('user-joined', {
      id: userId,
      name: userName,
      color: userColor,
    });
    
    // Send current session state to the new user
    socket.emit('session-state', {
      users: Array.from(session.users.values()),
      nodes: session.nodes,
      edges: session.edges,
    });
    
    console.log(`User ${userName} joined session ${sessionId}`);
  });

  // Leave session
  socket.on('leave-session', (data) => {
    const { sessionId, userId } = data;
    
    socket.leave(sessionId);
    
    const session = sessions.get(sessionId);
    if (session) {
      session.users.delete(userId);
      
      // Notify other users
      socket.to(sessionId).emit('user-left', { id: userId });
      
      // Clean up empty sessions
      if (session.users.size === 0) {
        sessions.delete(sessionId);
      }
    }
  });

  // Cursor movement
  socket.on('cursor-move', (data) => {
    const { sessionId, userId, x, y } = data;
    socket.to(sessionId).emit('cursor-move', { id: userId, x, y });
  });

  // Node operations
  socket.on('node-added', (data) => {
    const { sessionId, node } = data;
    const session = sessions.get(sessionId);
    if (session) {
      session.nodes.push(node);
      socket.to(sessionId).emit('node-added', { node });
    }
  });

  socket.on('node-moved', (data) => {
    const { sessionId, nodeId, position } = data;
    const session = sessions.get(sessionId);
    if (session) {
      const node = session.nodes.find((n) => n.id === nodeId);
      if (node) {
        node.position = position;
      }
      socket.to(sessionId).emit('node-moved', { nodeId, position });
    }
  });

  socket.on('node-removed', (data) => {
    const { sessionId, nodeId } = data;
    const session = sessions.get(sessionId);
    if (session) {
      session.nodes = session.nodes.filter((n) => n.id !== nodeId);
      socket.to(sessionId).emit('node-removed', { nodeId });
    }
  });

  // Edge operations
  socket.on('edge-added', (data) => {
    const { sessionId, edge } = data;
    const session = sessions.get(sessionId);
    if (session) {
      session.edges.push(edge);
      socket.to(sessionId).emit('edge-added', { edge });
    }
  });

  socket.on('edge-removed', (data) => {
    const { sessionId, edgeId } = data;
    const session = sessions.get(sessionId);
    if (session) {
      session.edges = session.edges.filter((e) => e.id !== edgeId);
      socket.to(sessionId).emit('edge-removed', { edgeId });
    }
  });

  // ===== AR SESSION HANDLING =====

  // Create/join AR session (laptop)
  socket.on('ar-create-session', (data) => {
    const { sessionId } = data;
    console.log(`Creating AR session: ${sessionId}`);
    
    if (!arSessions.has(sessionId)) {
      arSessions.set(sessionId, {
        host: socket.id,
        phone: null,
        lastFrame: null,
      });
    }
    
    socket.join(`ar-${sessionId}`);
    socket.emit('ar-session-created', { sessionId });
  });

  // Join AR session (phone)
  socket.on('ar-join-session', (data) => {
    const { sessionId } = data;
    console.log(`Phone joining AR session: ${sessionId}`);
    
    const session = arSessions.get(sessionId);
    if (!session) {
      socket.emit('ar-error', { message: 'Session not found' });
      return;
    }
    
    session.phone = socket.id;
    socket.join(`ar-${sessionId}`);
    
    // Notify host that phone connected
    io.to(`ar-${sessionId}`).emit('ar-phone-connected');
  });

  // Handle camera frame from phone
  socket.on('ar-frame', (data) => {
    const { sessionId, frameData } = data;
    const session = arSessions.get(sessionId);
    
    if (session) {
      session.lastFrame = frameData;
      // Broadcast frame to all in session (host will display it)
      io.to(`ar-${sessionId}`).emit('ar-frame', { frameData });
    }
  });

  // Leave AR session
  socket.on('ar-leave-session', (data) => {
    const { sessionId } = data;
    const session = arSessions.get(sessionId);
    
    if (session) {
      socket.leave(`ar-${sessionId}`);
      
      // Notify others and clean up
      if (session.host === socket.id) {
        io.to(`ar-${sessionId}`).emit('ar-host-disconnected');
        arSessions.delete(sessionId);
      } else if (session.phone === socket.id) {
        session.phone = null;
        io.to(`ar-${sessionId}`).emit('ar-phone-disconnected');
      }
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Clean up AR sessions
    arSessions.forEach((session, sessionId) => {
      if (session.host === socket.id) {
        io.to(`ar-${sessionId}`).emit('ar-host-disconnected');
        arSessions.delete(sessionId);
      } else if (session.phone === socket.id) {
        session.phone = null;
        io.to(`ar-${sessionId}`).emit('ar-phone-disconnected');
      }
    });
    
    // Find and clean up user from all collaboration sessions
    sessions.forEach((session, sessionId) => {
      session.users.forEach((user, userId) => {
        if (user.socketId === socket.id) {
          session.users.delete(userId);
          io.to(sessionId).emit('user-left', { id: userId });
        }
      });
    });
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 Collaboration server running on port ${PORT}`);
});
