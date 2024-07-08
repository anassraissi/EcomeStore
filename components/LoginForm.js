// components/LoginForm.js

import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login,setUser } = useAuth();
  const router=useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const {user,token}=await login(email, password);
      setUser(user);
      localStorage.setItem('token',token ); // Store token in localStorage
      router.push('/');
      // Example: Display success toast message
      toast.success('Login successful!');
      // Redirect or update state to reflect logged-in status
    } catch (error) {
      console.error('Login error:', error);
      // Example: Display error toast message
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;