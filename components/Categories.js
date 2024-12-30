// components/AllCategory.js

import Image from 'next/image';
import styles from '../src/styles/AllCategory.module.css'; // If using CSS modules

const Categories = () => {
  return (
    <div className="py-3 py-md-5 bg-light">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h4 className="mb-4">Our Categories</h4>
          </div>
          <div className="col-6 col-md-3">
            <div className={styles.categoryCard}>
              <a href="">
                <div className={styles.categoryCardImg}>
                  <Image 
                    src="/images/laptop.jpg" 
                    alt="Laptop" 
                    width={500} 
                    height={300} 
                    layout="responsive" 
                  />
                </div>
                <div className={styles.categoryCardBody}>
                  <h5>Laptop</h5>
                </div>
              </a>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className={styles.categoryCard}>
              <a href="">
                <div className={styles.categoryCardImg}>
                  <Image 
                    src="/images/mobile.jpg" 
                    alt="Mobile Devices" 
                    width={500} 
                    height={300} 
                    layout="responsive" 
                  />
                </div>
                <div className={styles.categoryCardBody}>
                  <h5>Mobile</h5>
                </div>
              </a>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className={styles.categoryCard}>
              <a href="">
                <div className={styles.categoryCardImg}>
                  <Image 
                    src="/images/mens-fashion.jpg" 
                    alt="Mens Fashion" 
                    width={500} 
                    height={300} 
                    layout="responsive" 
                  />
                </div>
                <div className={styles.categoryCardBody}>
                  <h5>Mens Fashion</h5>
                </div>
              </a>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className={styles.categoryCard}>
              <a href="">
                <div className={styles.categoryCardImg}>
                  <Image 
                    src="/images/women.jpg" 
                    alt="Women Fashion" 
                    width={500} 
                    height={300} 
                    layout="responsive" 
                  />
                </div>
                <div className={styles.categoryCardBody}>
                  <h5>Women Fashion</h5>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
