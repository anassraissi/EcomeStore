// components/Layout.js
import React from 'react';
import Link from 'next/link';
import styles from './Layout.module.css'; // Assuming you will use CSS Modules for styling

const Layout = ({ children }) => {
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
            <Link href="/Register"legacyBehavior><a className={styles.authLink}>Register</a></Link>
            <Link href="/logout"legacyBehavior ><a className={styles.authLink}>Logout</a></Link>
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
