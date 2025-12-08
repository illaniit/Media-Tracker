// src/App.tsx
// Componente principal de la aplicación con routing

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GuestProvider } from './contexts/GuestContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import MediaDetail from './components/media/MediaDetail';
import LandingPage from './components/landing/LandingPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GuestProvider>
          <Routes>
            {/* Landing page as root */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Guest mode route */}
            <Route path="/guest" element={<Dashboard />} />
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/media/:id"
              element={
                <ProtectedRoute>
                  <MediaDetail />
                </ProtectedRoute>
              }
            />
            
            {/* 404 - Redirect to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </GuestProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
