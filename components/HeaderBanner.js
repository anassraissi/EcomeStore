import React from 'react';
import styles from '../src/styles/HeaderBanner.module.css';

const HeaderBanner = () => {
  return (
    <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src="../images/slider/banner1.jpg" className={`d-block w-100 ${styles.customCarouselImage}`} alt="Banner 1" />
          <div className={`carousel-caption d-none d-md-block ${styles.customCarouselContent}`}>
            <h1>
              <span>discount 80 for iphone 16 </span>
            </h1>
            <p>
           Grab the iPhone 16 now at an unbeatable 80% discount! Limited time offer to elevate your tech game without breaking the bank.


            </p>
            <a href="#" className={styles.btnSlider}>Get Now</a>
          </div>
        </div>
        <div className="carousel-item">
          <img src="/images/slider-2.jpg" className={`d-block w-100 ${styles.customCarouselImage}`} alt="Banner 2" />
          <div className={`carousel-caption d-none d-md-block ${styles.customCarouselContent}`}>
            <h1>
              <span>Best Ecommerce Solutions 2 </span> to Boost your Brand Name &amp; Sales
            </h1>
            <p>
              We offer an industry-driven and successful digital marketing strategy that helps our clients
              in achieving a strong online presence and maximum company profit.
            </p>
            <a href="#" className={styles.btnSlider}>Get Now</a>
          </div>
        </div>
        <div className="carousel-item">
          <img src="/images/slider-3.jpg" className={`d-block w-100 ${styles.customCarouselImage}`} alt="Banner 3" />
          <div className={`carousel-caption d-none d-md-block ${styles.customCarouselContent}`}>
            <h1>
              <span>Best Ecommerce Solutions 3 </span> to Boost your Brand Name &amp; Sales
            </h1>
            <p>
              We offer an industry-driven and successful digital marketing strategy that helps our clients
              in achieving a strong online presence and maximum company profit.
            </p>
            <a href="#" className={styles.btnSlider}>Get Now</a>
          </div>
        </div>
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
        <span className="carousel-control-prev-icon visually-hidden">‹</span>
        <span className={styles.customArrow}>‹</span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
        <span className="carousel-control-next-icon visually-hidden">›</span>
        <span className={styles.customArrow}>›</span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default HeaderBanner;
