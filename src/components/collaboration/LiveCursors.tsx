import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveShareStore } from '../../stores';

// Cursor SVG component
const CursorIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
  >
    <path
      d="M5.5 3.21V20.8C5.5 21.3 5.81 21.5 6.21 21.29L10.59 18.29L13 22.71C13.18 23.05 13.5 23.13 13.81 23L15.5 22.21C15.81 22.08 15.93 21.71 15.76 21.37L13.34 16.95L18.5 16.63C18.95 16.6 19.17 16.09 18.88 15.75L6.38 2.75C6.09 2.41 5.5 2.63 5.5 3.21Z"
      fill={color}
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface LiveCursorsProps {
  // Offset for canvas pan/zoom
  viewportTransform?: {
    x: number;
    y: number;
    zoom: number;
  };
}

const LiveCursors: React.FC<LiveCursorsProps> = ({ viewportTransform }) => {
  const { cursors, activeUsers } = useLiveShareStore();
  
  // Create a map of user colors for quick lookup
  const userColorMap = React.useMemo(() => {
    const map: Record<string, { color: string; name: string }> = {};
    activeUsers.forEach(user => {
      map[user.id] = { color: user.color, name: user.name };
    });
    return map;
  }, [activeUsers]);

  // Get all cursor entries - filtering done based on lastUpdate in render
  const cursorEntries = Object.entries(cursors);

  if (cursorEntries.length === 0) return null;

  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden z-50"
      style={{ isolation: 'isolate' }}
    >
      <AnimatePresence>
        {cursorEntries.map(([userId, cursor]) => {
          const userInfo = userColorMap[userId] || { 
            color: cursor.userColor, 
            name: cursor.userName 
          };
          
          // Apply viewport transform if provided
          let x = cursor.x;
          let y = cursor.y;
          
          if (viewportTransform) {
            x = cursor.x * viewportTransform.zoom + viewportTransform.x;
            y = cursor.y * viewportTransform.zoom + viewportTransform.y;
          }

          return (
            <motion.div
              key={userId}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x,
                y
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ 
                type: 'spring',
                stiffness: 500,
                damping: 30,
                mass: 0.5
              }}
              className="absolute top-0 left-0"
              style={{ 
                willChange: 'transform',
                zIndex: 9999
              }}
            >
              {/* Cursor icon */}
              <CursorIcon color={userInfo.color} />
              
              {/* User name label */}
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-5 top-5 whitespace-nowrap"
              >
                <div 
                  className="px-2 py-1 rounded-md text-xs font-medium text-white shadow-lg"
                  style={{ 
                    backgroundColor: userInfo.color,
                    maxWidth: '120px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {userInfo.name}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default LiveCursors;
