// components/Layout.js
import React from 'react';
import Link from 'next/link';
import styles from './Layout.module.css'; // Assuming you will use CSS Modules for styling
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

const Layout = ({ children }) => {
  const { logout } = useAuth();
const route=useRouter();
  const logOut = (e) => {
    e.preventDefault();
    logout(); // Assuming this function clears authentication state or tokens
    route.push('/Login');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <nav>
          <ul className={styles.navLinks}>
            <li><Link href="/" legacyBehavior><a>Home</a></Link></li>
            <li><Link href="/products" legacyBehavior><a>Products</a></Link></li>
            <li><Link href="/cart" legacyBehavior><a>Cart</a></Link></li>
            <li><Link href="/about" legacyBehavior><a>About</a></Link></li>
          </ul>
          <div className={styles.authLinks}>
            <Link href="/Register" legacyBehavior><a className={styles.authLink}>Register</a></Link>
            <Link href="/" legacyBehavior>
              <a className={styles.authLink} onClick={logOut}>Logout</a>
            </Link>
          </div>
        </nav>
      </header>

      <main className={styles.main}>
        {children}
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} EcomStore</p>
      </footer>
    </div>
  );
};

export default Layout;
