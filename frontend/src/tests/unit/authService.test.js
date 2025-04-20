import { login, register, logout } from '../../services/authService';

// Mock fetch API
global.fetch = jest.fn();

describe('Auth Service', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('login makes correct API call and returns token', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ token: 'test-token', user: { id: '1', name: 'Test User' } }),
    };
    fetch.mockResolvedValueOnce(mockResponse);

    const result = await login('test@example.com', 'password123');

    expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });
    expect(result).toEqual({ token: 'test-token', user: { id: '1', name: 'Test User' } });
  });

  test('login throws error when API returns non-ok response', async () => {
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({ error: 'Invalid credentials' }),
    };
    fetch.mockResolvedValueOnce(mockResponse);

    await expect(login('test@example.com', 'wrongpassword')).rejects.toThrow('Invalid credentials');
  });

  test('register makes correct API call and returns user data', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ 
        token: 'new-token', 
        user: { id: '2', name: 'New User', email: 'new@example.com' } 
      }),
    };
    fetch.mockResolvedValueOnce(mockResponse);

    const result = await register('New User', 'new@example.com', 'password123');

    expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
      }),
    });
    expect(result).toEqual({ 
      token: 'new-token', 
      user: { id: '2', name: 'New User', email: 'new@example.com' } 
    });
  });

  test('logout makes correct API call and clears local storage', async () => {
    // Configure le localStorage spy
    const localStorageSpy = jest.spyOn(Storage.prototype, 'removeItem');
    
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ message: 'Logged out successfully' }),
    };
    fetch.mockResolvedValueOnce(mockResponse);

    // Configure le token dans localStorage pour le test
    localStorage.setItem('authToken', 'test-token');
    
    await logout();

    expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token',
      },
    });
    expect(localStorageSpy).toHaveBeenCalledWith('authToken');
    expect(localStorageSpy).toHaveBeenCalledWith('user');
    
    // Nettoyage
    localStorageSpy.mockRestore();
  });
}); 