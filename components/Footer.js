import React from 'react';
import styles from './Footer.module.css'; // Import CSS module for styling

const Footer = () => {
  return (
    <footer className={styles.footerArea}>
      <div className="container">
        {/* Copyright Message */}
        <div className={`row ${styles.copyright}`}>
          <div className="col-md-12">
            <p className={styles.initialCopyright}>EcomStore &copy; 2024</p>
            <p className={styles.fullCopyright}>&copy; 2024 Your Company. All rights reserved.</p>
          </div>
        </div>
        {/* Full Footer Content */}
        <div className={`row ${styles.fullFooter}`}>
          <div className="col-md-3">
            <h4 className={styles.footerHeading}>Funda E-Commerce</h4>
            <div className={styles.footerUnderline}></div>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
            </p>
          </div>
          <div className="col-md-3">
            <h4 className={styles.footerHeading}>Quick Links</h4>
            <div className={styles.footerUnderline}></div>
            <div className="mb-2"><a href="#" className="text-white">Home</a></div>
            <div className="mb-2"><a href="#" className="text-white">About Us</a></div>
            <div className="mb-2"><a href="#" className="text-white">Contact Us</a></div>
            <div className="mb-2"><a href="#" className="text-white">Blogs</a></div>
            <div className="mb-2"><a href="#" className="text-white">Sitemaps</a></div>
          </div>
          <div className="col-md-3">
            <h4 className={styles.footerHeading}>Shop Now</h4>
            <div className={styles.footerUnderline}></div>
            <div className="mb-2"><a href="#" className="text-white">Collections</a></div>
            <div className="mb-2"><a href="#" className="text-white">Trending Products</a></div>
            <div className="mb-2"><a href="#" className="text-white">New Arrivals Products</a></div>
            <div className="mb-2"><a href="#" className="text-white">Featured Products</a></div>
            <div className="mb-2"><a href="#" className="text-white">Cart</a></div>
          </div>
          <div className="col-md-3">
            <h4 className={styles.footerHeading}>Reach Us</h4>
            <div className={styles.footerUnderline}></div>
            <div className="mb-2">
              <p>
                <i className="fa fa-map-marker"></i> #444, some main road, some area, some street, Bangalore, India - 560077
              </p>
            </div>
            <div className="mb-2">
              <a href="#" className="text-white">
                <i className="fa fa-phone"></i> +91 888-XXX-XXXX
              </a>
            </div>
            <div className="mb-2">
              <a href="#" className="text-white">
                <i className="fa fa-envelope"></i> fundaofwebit@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
