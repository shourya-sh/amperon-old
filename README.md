# ⚡ CircuitCo - Educational Circuit Designer

<div align="center">

![CircuitCo Logo](./public/circuit-icon.svg)

**An interactive, AI-powered circuit design platform for kids to learn electronics**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)

</div>

---

## 🌟 Features

### 🎨 **Intuitive Circuit Designer**
- Infinite canvas with zoom, pan, and grid snapping
- Drag-and-drop components from the library
- Visual wire connections with smooth animations
- Real-time component info on hover/click

### 🤖 **AI-Powered Assistant (CircuitBot)**
- Natural language circuit building ("add an LED circuit")
- Component explanations for learning
- Circuit debugging assistance
- Educational concept teaching

### 📚 **Interactive Tutorials**
- Progressive learning from beginner to advanced
- Hands-on interactive exercises
- Visual explanations of concepts
- Track your progress

### 👥 **Real-time Collaboration**
- Work together with friends online
- See each other's cursors (like Figma!)
- Shared canvas updates in real-time
- Easy session sharing with codes

### 🔐 **User Accounts**
- Firebase authentication
- Save and load projects
- Track tutorial progress
- Personalized experience

### 🍞 **Breadboard View**
- Simple breadboard representation
- Grid notation (A1, B2, etc.)
- Visual connection indicators

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase account (for authentication)

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd circuitco
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **(Optional) Start collaboration server:**
   ```bash
   cd server
   npm install
   npm start
   ```

5. **Open in browser:**
   ```
   http://localhost:5173
   ```

---

## 📁 Project Structure

```
circuitco/
├── public/                  # Static assets
├── server/                  # WebSocket collaboration server
│   ├── index.js            # Express + Socket.io server
│   └── package.json
├── src/
│   ├── components/         # React components
│   │   ├── canvas/         # Circuit canvas & nodes
│   │   ├── chat/           # AI chat panel
│   │   ├── collaboration/  # Real-time collab features
│   │   ├── info/           # Component info panels
│   │   ├── layout/         # App layout & navbar
│   │   └── sidebar/        # Component library
│   ├── contexts/           # React contexts (Auth)
│   ├── data/               # Static data (components, tutorials)
│   ├── lib/                # External service configs
│   ├── pages/              # Route pages
│   ├── services/           # API services
│   ├── stores/             # Zustand state stores
│   └── types/              # TypeScript types
├── .env.example            # Environment template
├── tailwind.config.js      # Tailwind configuration
└── vite.config.ts          # Vite configuration
```

---

## 🎨 Design System

CircuitCo uses a **dark grey + forest green** color scheme inspired by [Linear.app](https://linear.app):

| Color | Hex | Usage |
|-------|-----|-------|
| Dark 950 | `#1a1a1f` | Background |
| Dark 900 | `#27272e` | Cards, panels |
| Dark 700 | `#454552` | Borders |
| Forest 500 | `#22c55e` | Primary accent |
| Forest 600 | `#16a34a` | Buttons, links |

---

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint

# Collaboration Server
npm run server       # Start WebSocket server
```

---

## 📦 Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 3.4
- **State Management:** Zustand 5
- **Canvas:** React Flow 11
- **Animations:** Framer Motion 12
- **Icons:** Lucide React
- **Authentication:** Firebase Auth
- **Real-time:** Socket.io
- **Routing:** React Router 7

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

MIT License - feel free to use this project for learning and teaching!

---

<div align="center">
Made with ❤️ for young engineers everywhere
</div>

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
