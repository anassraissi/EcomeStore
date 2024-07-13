// components/Navbar.js
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

const NavOperator = () => {

  const [username, setUsername] = useState("");
  const {logout}=useAuth(); 
  const router=useRouter();
  useEffect(()=>{
    localStorage.getItem('username') ? setUsername(localStorage.getItem('username')) :setUsername('Connexion')        
  },[])
  const logOut=()=>{
    logout();
    router.reload('/');
  }
  return (
    <div className="main-navbar shadow-sm sticky-top">
        <div className="top-navbar">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2 my-auto d-none d-md-block">
              <h5 className="brand-name">EcomStore</h5>
            </div>
            <div className="col-md-5 my-auto">
            </div>
            <div className="col-md-5 my-auto">
              <ul className="nav justify-content-end">
                <li className="nav-item dropdown"> 
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fa fa-user"></i> {username}
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li>
                      <Link href="/profile" legacyBehavior>
                        <a className="dropdown-item">
                          <i className="fa fa-user"></i> Profile
                          </a>
                      </Link>
                    </li>
                    <li>
    
                        <a className="dropdown-item" onClick={logOut}>
                          <i className="fa fa-sign-out"></i> Logout
                          </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link href="/" legacyBehavior>
            <a className="navbar-brand d-block d-md-none">EcomStore</a>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link href="/AddProduct" legacyBehavior>
                  <a className="nav-link">Add Product</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/AddCategories" legacyBehavior> 
                  <a className="nav-link">Add Categories</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>      
    </div>
  );
};

export default NavOperator;
