// components/Footer.js
import React from 'react';
import styles from './Footer.module.css'; // Import CSS module for styling

const Footer = () => {
  return (
    <footer className={styles.footerArea}>
      <div className="container">
        {/* Copyright Message */}
        <div className={`row ${styles.copyright}`}>
          <div className="col-md-12">
            <p className={styles.initialCopyright}>&copy; 2024</p>
            <p className={styles.fullCopyright}>&copy; 2024 Your Company. All rights reserved.</p>
          </div>
        </div>
        {/* Full Footer Content */}
        <div className={`row ${styles.fullFooter}`}>
          <div className="col-md-3">
            <h4 className={styles.footerHeading}>Funda E-Commerce</h4>
            <div className={styles.footerUnderline}></div>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s
            </p>
          </div>
          {/* Add other sections like Quick Links, Shop Now, and Reach Us */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
