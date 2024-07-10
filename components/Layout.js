// components/Layout.js
import React, { useEffect, useState } from 'react';
import styles from './Layout.module.css'; // Assuming you will use CSS Modules for styling
import Navbar from './Navbar';
import Footer from './Footer'; // Import Footer component
import NavOperator from './NavOperator';

const Layout = ({ children }) => {
  const [role, setRole] = useState("")
  useEffect(()=>{
    if((localStorage.getItem('role')=='operator')){
      setRole(localStorage.getItem('role'))
      console.log(role);
    }
  },[])
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {role=='operator' ?   <NavOperator/> : <Navbar/>}
        <main className={styles.main}>
          {children}
        </main>
      </div>
      <Footer /> {/* Render Footer component */}
    </div>
  );
};

export default Layout;
