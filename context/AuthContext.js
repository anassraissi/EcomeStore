// context/AuthContext.js

import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/login', { email, password });
      // console.log("response: ",response);
      const { token, user } = response.data;
      localStorage.setItem('token', token); // Store token in localStorage
      localStorage.setItem('username', user.name); // Store username in localStorage
      localStorage.setItem('role', user.role); // Store role in localStorage
      localStorage.setItem('userId', user._id); // Store role in localStorage
      setUser(user);
      return {user,token}
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed');
    }s
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token'); // Remove token from localStorage
    localStorage.removeItem('user'); // Remove token from localStorage
    localStorage.removeItem('username'); // Remove token from localStorage
    localStorage.removeItem('role'); // Remove token from localStorage
    
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
