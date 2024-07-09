// context/AuthContext.js

import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/login', { email, password });
      console.log("response: ",response);
      const { token, user } = response.data;
      setUser(user);
      return {user,token}
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed');
    }
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token'); // Remove token from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
