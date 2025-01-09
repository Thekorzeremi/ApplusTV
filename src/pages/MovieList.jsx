import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from '../contexts/AuthContext';
import { StarIcon } from '@heroicons/react/24/solid';
import { ChevronDownIcon, ArrowsUpDownIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import SplashScreen from '../components/SplashScreen';
import MovieModal from '../components/MovieModal';

function MovieCard({ movie, isHovered, onHoverStart, onHoverEnd }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.05 }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      className="bg-zinc-900/50 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10 cursor-pointer group"
    >
      <div className="aspect-[2/3] relative overflow-hidden">
        <img
          src={movie.imageUrl}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <motion.div 
          layout
          className="absolute bottom-0 left-0 right-0 p-4"
        >
          <motion.h3 layout="position" className="font-medium mb-1 truncate">
            {movie.title}
          </motion.h3>
          <motion.p layout="position" className="text-sm text-white/60 line-clamp-2 mb-2">
            {movie.description}
          </motion.p>
          <motion.div layout="position" className="flex items-center space-x-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`h-4 w-4 ${
                  star <= movie.rating ? 'text-yellow-400' : 'text-white/20'
                }`}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function MovieList() {
  const { user } = useAuth();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [showSplash, setShowSplash] = useState(!user);
  const [sortType, setSortType] = useState('none');
  const movies = user?.movies || [];

  const sortedMovies = [...movies].sort((a, b) => {
    if (sortType === 'alpha') {
      return a.title.localeCompare(b.title);
    } else if (sortType === 'rating') {
      return b.rating - a.rating;
    }
    return 0;
  });

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    const videoId = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : '';
  };

  const getSortLabel = () => {
    switch (sortType) {
      case 'alpha':
        return 'Alphabétique';
      case 'rating':
        return 'Par notes';
      default:
        return 'Trier par';
    }
  };

  if (!user) {
    return (
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-12 px-4"
          >
            <h2 className="text-2xl font-medium text-center mb-4">
              Bienvenue sur ApplusTV !
            </h2>
            <p className="text-white/60 text-center mb-8 max-w-md">
              Connectez-vous pour commencer à créer votre collection de films.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  if (movies.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="flex flex-col items-center justify-center py-12 px-4"
      >
        <h2 className="text-2xl font-medium text-center mb-4">
          Bienvenue, {user.name} !
        </h2>
        <p className="text-white/60 text-center mb-8 max-w-md">
          Vous n'avez pas encore ajouté de films. Commencez à construire votre collection dès maintenant !
        </p>
        <Link
          to="/add"
          className="inline-flex items-center px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-colors"
        >
          Ajouter mon premier film
        </Link>
      </motion.div>
    );
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="inline-flex items-center px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 transition-all text-sm font-medium text-white/90">
            <span>{getSortLabel()}</span>
            <ChevronDownIcon className="ml-2 -mr-1 h-4 w-4" />
          </Menu.Button>
          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-zinc-800/90 backdrop-blur-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-zinc-700/50 p-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setSortType('none')}
                    className={`${
                      active || sortType === 'none' ? 'bg-white/10' : ''
                    } ${
                      sortType === 'none' ? 'text-white' : 'text-white/70'
                    } group flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors`}
                  >
                    <ArrowsUpDownIcon className="mr-2 h-5 w-5" />
                    Aucun tri
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setSortType('alpha')}
                    className={`${
                      active || sortType === 'alpha' ? 'bg-white/10' : ''
                    } ${
                      sortType === 'alpha' ? 'text-white' : 'text-white/70'
                    } group flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors`}
                  >
                    <ArrowsUpDownIcon className="mr-2 h-5 w-5" />
                    Alphabétique
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setSortType('rating')}
                    className={`${
                      active || sortType === 'rating' ? 'bg-white/10' : ''
                    } ${
                      sortType === 'rating' ? 'text-white' : 'text-white/70'
                    } group flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors`}
                  >
                    <StarIcon className="mr-2 h-5 w-5" />
                    Par notes
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 z-0"
      >
        {sortedMovies.map((movie) => (
          <div key={movie.id} onClick={() => setSelectedMovie(movie)}>
            <MovieCard
              movie={movie}
              isHovered={hoveredId === movie.id}
              onHoverStart={() => setHoveredId(movie.id)}
              onHoverEnd={() => setHoveredId(null)}
            />
          </div>
        ))}
      </motion.div>

      <MovieModal
        movie={selectedMovie}
        isOpen={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </>
  );
}

export default MovieList;
