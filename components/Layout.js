// components/Layout.js
import React from 'react';
import styles from './Layout.module.css'; // Assuming you will use CSS Modules for styling
import Navbar from './Navbar';
import Footer from './Footer'; // Import Footer component

const Layout = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Navbar />
        <main className={styles.main}>
          {children}
        </main>
      </div>
      <Footer /> {/* Render Footer component */}
    </div>
  );
};

export default Layout;
