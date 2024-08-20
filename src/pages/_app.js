// pages/_app.js
import '../styles/globals.css'; // Global styles if any
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../../components/Layout';
import { AuthProvider} from '../../context/AuthContext';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS globally
import 'font-awesome/css/font-awesome.min.css';
import { useEffect, useState } from 'react';
import { MantineProvider } from '@mantine/core';

function MyApp({ Component, pageProps }) {

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.bundle.min.js');
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
