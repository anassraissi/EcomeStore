// pages/_app.js
import '../styles/globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../../components/Layout';
import { AuthProvider } from '../../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { useEffect } from 'react';
import { MantineProvider } from '@mantine/core';
import '../styles/HeaderBanner.module.css';
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.bundle.min.js');

      // Call the API route to initialize the admin
      fetch('/api/initialize')
        .then(response => response.json())
        .then(data => console.log(data.message))
        .catch(error => console.error('Admin initialization error:', error));
    }
  }, []);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
          <ToastContainer />
        </Layout>
      </AuthProvider>
    </MantineProvider>
  );
}

export default MyApp;
