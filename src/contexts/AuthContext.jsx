import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setShowAuthModal(false);
    } else {
      setShowAuthModal(true);
    }
  }, []);

  const getUsers = () => {
    return JSON.parse(localStorage.getItem('users') || '[]');
  };

  const saveUsers = (users) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  const login = (userData) => {
    const users = getUsers();
    const user = users.find(u => u.email === userData.email && u.password === userData.password);
    
    if (user) {
      const userWithMovies = {
        ...user,
        movies: user.movies || []
      };
      setUser(userWithMovies);
      localStorage.setItem('user', JSON.stringify(userWithMovies));
      setShowAuthModal(false);
      return true;
    }
    return false;
  };

  const register = (userData) => {
    const users = getUsers();
    const existingUser = users.find(u => u.email === userData.email);
    
    if (existingUser) {
      return false;
    }

    const newUser = {
      id: Date.now(),
      ...userData,
      movies: []
    };

    users.push(newUser);
    saveUsers(users);

    const userWithMovies = {
      ...newUser,
      movies: []
    };
    setUser(userWithMovies);
    localStorage.setItem('user', JSON.stringify(userWithMovies));
    setShowAuthModal(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setShowAuthModal(true);
    navigate("/");
  };

  const updateUserMovies = (movies) => {
    if (user) {
      const updatedUser = { ...user, movies };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      const users = getUsers();
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], movies };
        saveUsers(users);
      }
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    showAuthModal,
    setShowAuthModal,
    updateUserMovies
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
