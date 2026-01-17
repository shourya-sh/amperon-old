import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import DesignerPage from './pages/DesignerPage';
import TutorialsPage from './pages/TutorialsPage';
import ProjectsPage from './pages/ProjectsPage';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          
          {/* App Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<DesignerPage />} />
            <Route path="tutorials" element={<TutorialsPage />} />
            <Route path="projects" element={<ProjectsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
