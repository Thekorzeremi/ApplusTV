import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import MovieModal from './MovieModal';
import { createPortal } from 'react-dom';

function Spotlight({ isOpen, onClose }) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedMovie) {
          setSelectedMovie(null);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredMovies.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
      } else if (e.key === 'Enter' && filteredMovies[selectedIndex]) {
        setSelectedMovie(filteredMovies[selectedIndex]);
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose, selectedIndex, selectedMovie]);

  const filteredMovies = (user?.movies || []).filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const spotlight = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl"
            >
              <div className="bg-zinc-900 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedIndex(0);
                    }}
                    placeholder="Rechercher un film..."
                    className="w-full pl-12 pr-12 py-4 bg-transparent text-white/90 placeholder-white/40 focus:outline-none text-lg"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    >
                      <XMarkIcon className="h-5 w-5 text-white/40 hover:text-white/60 transition-colors" />
                    </button>
                  )}
                </div>
                {searchQuery && (
                  <div className="border-t border-white/10">
                    <div className="max-h-[60vh] overflow-y-auto">
                      {filteredMovies.length === 0 ? (
                        <div className="py-4 px-4 text-white/60 text-center">
                          Aucun film ne correspond à votre recherche
                        </div>
                      ) : (
                        <div className="py-2">
                          {filteredMovies.map((movie, index) => (
                            <motion.div
                              key={movie.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => setSelectedMovie(movie)}
                              className={`px-4 py-3 flex items-start gap-4 cursor-pointer transition-colors ${
                                index === selectedIndex ? 'bg-white/10' : 'hover:bg-white/5'
                              }`}
                            >
                              <img
                                src={movie.imageUrl}
                                alt={movie.title}
                                className="w-12 h-16 object-cover rounded-lg flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="text-white font-medium truncate">
                                  {movie.title}
                                </h3>
                                <div className="flex items-center space-x-1 my-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <StarIcon
                                      key={star}
                                      className={`h-3.5 w-3.5 ${
                                        star <= movie.rating ? 'text-yellow-400' : 'text-white/20'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <p className="text-sm text-white/60 line-clamp-2">
                                  {movie.description}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            <MovieModal
              movie={selectedMovie}
              isOpen={!!selectedMovie}
              onClose={() => setSelectedMovie(null)}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(spotlight, document.body);
}

export default Spotlight;
