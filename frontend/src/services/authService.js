// Fonction pour se connecter
export const login = async (email, password) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Invalid email or password');
  }

  return data;
};

// Fonction pour s'inscrire
export const register = async (name, email, password) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Registration failed');
  }

  return data;
};

// Fonction pour se déconnecter
export const logout = async () => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const data = await response.json();
    console.error('Logout failed:', data.error);
  }
  
  return true;
};

// Fonction pour demander une réinitialisation de mot de passe
export const requestPasswordReset = async (email) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to request password reset');
  }

  return data;
};

// Fonction pour réinitialiser le mot de passe avec un token
export const resetPassword = async (token, newPassword) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/reset-password/${token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password: newPassword }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to reset password');
  }

  return data;
}; 