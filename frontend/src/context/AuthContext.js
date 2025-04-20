import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginApi, register as registerApi, logout as logoutApi } from '../services/authService';

// Création du contexte
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifier le token au chargement de l'application
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (err) {
        // En cas d'erreur (par exemple, user mal formaté), nettoyer le localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await loginApi(email, password);
      
      // Stocker les informations dans le localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Mettre à jour l'état
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      
      return data;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction d'inscription
  const register = async (name, email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await registerApi(name, email, password);
      
      // Stocker les informations dans le localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Mettre à jour l'état
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      
      return data;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Appeler l'API de déconnexion si nécessaire
      if (token) {
        await logoutApi();
      }
      
      // Nettoyer le localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Réinitialiser l'état
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Valeurs à exposer dans le contexte
  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 