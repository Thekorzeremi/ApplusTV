import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import MovieList from './pages/MovieList';
import AddMovie from './pages/AddMovie';
import EditMovie from './pages/EditMovie';
import AuthModal from './components/AuthModal';
import SplashScreen from './components/SplashScreen';

function PrivateRoute({ children }) {
  const { user, setShowAuthModal } = useAuth();

  if (!user) {
    setShowAuthModal(true);
    return <Navigate to="/" />;
  }

  return children;
}

function AppContent() {
  const { showAuthModal, setShowAuthModal } = useAuth();
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  const handleSplashComplete = () => {
    setShowSplashScreen(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {showSplashScreen ? (
        <SplashScreen onComplete={handleSplashComplete} />
      ) : (
        <>
          <Navbar />
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<MovieList />} />
              <Route
                path="/add"
                element={
                  <PrivateRoute>
                    <AddMovie />
                  </PrivateRoute>
                }
              />
              <Route
                path="/edit/:id"
                element={
                  <PrivateRoute>
                    <EditMovie />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>

          {showAuthModal && (
            <AuthModal onClose={() => setShowAuthModal(false)} />
          )}
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
