import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { XMarkIcon, PencilIcon } from '@heroicons/react/24/outline';

function ProfileModal({ isOpen, onClose }) {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [imageUrl, setImageUrl] = useState(user?.imageUrl || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile({ name, imageUrl });
    setIsEditing(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50"
          >
            <div className="mx-4">
              <div className="bg-zinc-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
                {/* En-tête */}
                <div className="relative h-32 bg-gradient-to-r from-purple-600 to-blue-600">
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5 text-white" />
                  </button>
                </div>

                {/* Contenu */}
                <div className="px-6 pb-6">
                  <div className="flex items-center -mt-10 mb-6">
                    <img
                      src={user?.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                      alt={user?.name}
                      className="w-20 h-20 rounded-2xl border-4 border-zinc-900 shadow-xl object-cover bg-zinc-800"
                    />
                    <div className="ml-4 flex-1">
                      <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                      <p className="text-white/60 text-sm">
                        Membre depuis {new Date(user?.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <PencilIcon className="h-5 w-5 text-white" />
                    </button>
                  </div>

                  {/* Mode édition */}
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white/60 mb-1">
                          Nom
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/60 mb-1">
                          URL de l'avatar
                        </label>
                        <input
                          type="url"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                          placeholder="https://..."
                        />
                      </div>
                      <div className="flex justify-end space-x-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 transition-colors text-sm font-medium text-white"
                        >
                          Enregistrer
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-white/60 mb-1">
                          Collection
                        </h3>
                        <p className="text-white">
                          {user?.movies?.length || 0} films
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-white/60 mb-1">
                          Email
                        </h3>
                        <p className="text-white">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ProfileModal;
