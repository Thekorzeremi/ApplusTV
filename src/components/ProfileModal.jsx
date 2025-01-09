import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { XMarkIcon, PencilIcon, FilmIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black backdrop-blur-sm z-[9999]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-zinc-900 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden mx-4"
          >
            {/* En-tête avec gradient et avatar */}
            <div className="relative">
              <div className="h-32 bg-gradient-to-br from-purple-600 via-blue-600 to-violet-600">
                <div className="absolute inset-0 bg-black backdrop-blur-sm" />
              </div>
              <div className="absolute top-4 right-4 flex items-center gap-2">
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors group"
                  >
                    <PencilIcon className="h-5 w-5 text-white/70 group-hover:text-white" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors group"
                >
                  <XMarkIcon className="h-5 w-5 text-white/70 group-hover:text-white" />
                </button>
              </div>
              <div className="absolute -bottom-10 left-6">
                <div className="relative group">
                  <img
                    src={user?.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                    alt={user?.name}
                    className="w-24 h-24 rounded-2xl border-4 border-zinc-900 shadow-xl object-cover bg-zinc-800"
                  />
                  {isEditing && (
                    <button
                      onClick={() => document.getElementById('avatar-input').focus()}
                      className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <PencilIcon className="h-6 w-6 text-white" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Contenu */}
            <div className="px-6 pt-14 pb-6">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">
                      URL de l'avatar
                    </label>
                    <input
                      id="avatar-input"
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setName(user?.name || '');
                        setImageUrl(user?.imageUrl || '');
                      }}
                      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-colors text-sm font-medium text-white"
                    >
                      Enregistrer
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                    <p className="text-white/60 text-sm">
                      Membre depuis {new Date(user?.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3 mb-1">
                        <FilmIcon className="h-5 w-5 text-purple-400" />
                        <h3 className="text-sm font-medium text-white/60">Collection</h3>
                      </div>
                      <p className="text-2xl font-semibold text-white">
                        {user?.movies?.length || 0}
                        <span className="text-sm font-normal text-white/60 ml-1">films</span>
                      </p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3 mb-1">
                        <EnvelopeIcon className="h-5 w-5 text-blue-400" />
                        <h3 className="text-sm font-medium text-white/60">Contact</h3>
                      </div>
                      <p className="text-sm text-white break-all">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ProfileModal;
