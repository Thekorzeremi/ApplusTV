import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PlusIcon, UserCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Spotlight from './Spotlight';
import ProfileModal from './ProfileModal';

function Navbar({ onSpotlightOpen }) {
  const { user, logout, setShowAuthModal } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <nav className="bg-zinc-900/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold bg-gradient-to-r text-white bg-clip-text">
              ApplusTV
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onSpotlightOpen}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              title="Rechercher (Ctrl+K)"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>

            {user ? (
              <>
                <Link
                  to="/add"
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Ajouter un film
                </Link>

                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
                >
                  <UserCircleIcon className="h-5 w-5 mr-2" />
                  {user.name}
                </button>

                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors text-sm font-medium"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 transition-colors text-sm font-medium"
              >
                Se connecter
              </button>
            )}
          </div>
        </div>
      </div>

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </nav>
  );
}

export default Navbar;
