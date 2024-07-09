// pages/_app.js
import '../styles/globals.css'; // Global styles if any
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../../components/Layout';
import { AuthProvider } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS globally
import 'font-awesome/css/font-awesome.min.css';
import { useEffect } from 'react';




function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, []);

  const router=useRouter();
  const noLayoutPaths = ['/Login','/Register'];

  // Determine if the current path should use the Layout
  const shouldUseLayout = !noLayoutPaths.includes(router.pathname);
  return (
    <AuthProvider>
    {shouldUseLayout ? (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    ) : (
      <Component {...pageProps} />
    )}
  </AuthProvider>
  );
}

export default MyApp;
