import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  let logoutTimer;

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('username', user.name);
      localStorage.setItem('role', user.role);
      localStorage.setItem('userId', user._id);
      setUser(user);
      startLogoutTimer(); // Start the logout timer after login
      return { user, token };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    clearTimeout(logoutTimer); // Clear the timer on logout
  };

  const startLogoutTimer = () => {
    clearTimeout(logoutTimer); // Clear any existing timer
    logoutTimer = setTimeout(() => {
      logout();
      alert('You have been logged out due to inactivity.');
    }, 15 * 60 * 1000); // 15 minutes
  };

  useEffect(() => {
    if (user) {
      startLogoutTimer(); // Start the timer when the user is set
    }
    return () => clearTimeout(logoutTimer); // Clear the timer on component unmount
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
