// pages/dashboard.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
const DashboardPage = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);

    if (!storedToken) {
      router.push('/login');
    }
  }, []);

  if (!token) {
    return <p>Loading...</p>; // Handle loading state
  }

  return (
    <div>
    </div>
  );
};

export default DashboardPage;
