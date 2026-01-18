# Amperon - Development Instructions

## Project Overview
Amperon is an educational circuit design web application built with React, TypeScript, and Tailwind CSS. It features an AI-powered chat assistant, real-time collaboration, and interactive tutorials.

## Key Technologies
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Flow** - Infinite canvas for circuit design
- **Zustand** - State management
- **Firebase** - Authentication
- **Socket.io** - Real-time collaboration
- **Framer Motion** - Animations

## Design Principles
- Dark grey (#1a1a1f) and forest green (#22c55e) color scheme
- Linear.app-inspired clean, professional UI
- Kid-friendly and educational focus
- Responsive and accessible design

## File Organization
- `src/components/` - Reusable UI components
- `src/pages/` - Route-level page components
- `src/stores/` - Zustand state management
- `src/types/` - TypeScript type definitions
- `src/data/` - Static data (components, tutorials)
- `src/contexts/` - React contexts
- `src/services/` - API and external services
- `server/` - WebSocket collaboration server

## Running the Project
1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and configure Firebase
3. Start dev server: `npm run dev`
4. (Optional) Start collab server: `cd server && npm start`

## Component Naming
- Use PascalCase for component files
- Use descriptive names (e.g., `CircuitCanvas`, `ComponentLibrary`)
- Group related components in subdirectories

## State Management
- Use Zustand stores for global state
- Use local state for component-specific state
- Stores are in `src/stores/index.ts`

## Styling
- Use Tailwind utility classes
- Custom classes defined in `src/index.css`
- Use the `glass`, `btn-primary`, `btn-secondary`, `card` utility classes
