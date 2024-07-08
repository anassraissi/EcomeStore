// pages/_app.js
import '../styles/globals.css'; // Global styles if any
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../../components/Layout';
import { AuthProvider } from '../../context/AuthContext';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Layout>
        <ToastContainer />
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}

export default MyApp;
