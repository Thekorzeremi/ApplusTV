import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';
import { PencilSquareIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function MovieModal({ movie, isOpen, onClose }) {
  const navigate = useNavigate();
  const { user, updateUserMovies } = useAuth();

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce film ?')) {
      const updatedMovies = user.movies.filter(m => m.id !== movie.id);
      updateUserMovies(updatedMovies);
      onClose();
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    const videoId = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : '';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 p-4 md:p-8 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-6xl mx-auto bg-zinc-900/90 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
          >
            <div className="absolute top-4 right-4 z-10 flex items-center space-x-2 bg-black p-2 rounded-full">
              <Link
                to={`/edit/${movie.id}`}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/70 hover:text-white"
              >
                <PencilSquareIcon className="h-5 w-5" />
              </Link>
              <button
                onClick={handleDelete}
                className="p-2 rounded-full bg-white/10 hover:bg-red-500/20 transition-colors text-white/70 hover:text-red-500"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/70 hover:text-white"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="aspect-video w-full bg-black">
              <iframe
                src={`${getYouTubeEmbedUrl(movie.trailerUrl)}?autoplay=1&mute=0`}
                title={`${movie.title} trailer`}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="px-8 py-4 flex">
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  {movie.title}
                </h2>
                <div className="flex items-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`h-5 w-5 ${
                        star <= movie.rating ? 'text-yellow-400' : 'text-white/20'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-white/80 leading-relaxed">
                  {movie.description}
                </p>
              </div>
              <img
                src={movie.imageUrl}
                alt={movie.title}
                className="w-32 h-48 object-cover rounded-lg shadow-lg ml-6 border border-white/10"
              />
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MovieModal;
