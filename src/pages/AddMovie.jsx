import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { StarIcon } from '@heroicons/react/24/solid';

function AddMovie() {
  const navigate = useNavigate();
  const { user, updateUserMovies } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    trailerUrl: '',
    rating: 4
  });

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/');
      return;
    }

    const newMovie = {
      id: Date.now().toString(),
      ...formData
    };

    const updatedMovies = [...(user.movies || []), newMovie];
    updateUserMovies(updatedMovies);
    navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-xl mx-auto"
    >
      <h1 className="text-2xl font-medium mb-8">Ajouter un film</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Titre
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/10 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/10 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            URL de l'image de couverture
          </label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/10 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            URL de la bande-annonce (YouTube)
          </label>
          <input
            type="url"
            name="trailerUrl"
            value={formData.trailerUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/10 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 transition-colors"
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Note
          </label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, rating }))}
                className="focus:outline-none"
              >
                <StarIcon
                  className={`h-6 w-6 ${
                    rating <= formData.rating ? 'text-yellow-400' : 'text-white/20'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors font-medium"
          >
            Annuler
          </button>

          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition-colors"
          >
            Ajouter
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default AddMovie;
