// components/LoginForm.js
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { user, token } = await login(email, password);
      toast.success('Login successful!');
      router.reload('/');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="form-outline mb-4">
        <input
          type="email"
          id="typeEmailX"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="form-label" htmlFor="typeEmailX">Email</label>
      </div>

      <div className="form-outline mb-4">
        <input
          type="password"
          id="typePasswordX"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label className="form-label" htmlFor="typePasswordX">Password</label>
      </div>

      <button className="btn btn-primary btn-block" type="submit">Login</button>
     <a data-bs-toggle="modal"data-bs-target="#formModal">create an account ?</a>

    </form>
  );
};

export default LoginForm;
