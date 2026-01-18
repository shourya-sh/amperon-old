import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import Layout from './components/layout/Layout';
import DesignerPage from './pages/DesignerPage';
import TutorialsPage from './pages/TutorialsPage';
import ProjectsPage from './pages/ProjectsPage';
import AuthPage from './pages/AuthPage';
import ARTutorialPage from './pages/ARTutorialPage';
import ARConnectPage from './pages/ARConnectPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          
          {/* Phone AR Connect Route (standalone, no layout) */}
          <Route path="/ar-connect" element={
            <ErrorBoundary>
              <ARConnectPage />
            </ErrorBoundary>
          } />
          
          {/* App Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<DesignerPage />} />
            <Route path="tutorials" element={<TutorialsPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="ar" element={<ARTutorialPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
