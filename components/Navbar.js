// components/Navbar.js
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

const Navbar = () => {

  const [username, setUsername] = useState("");
  const {logout}=useAuth(); 
  const router=useRouter();
  useEffect(()=>{
    setUsername(localStorage.getItem('username'))
  },[])
  const logOut=(e)=>{
    console.log("yess");
    logout();
    router.replace('/Login');
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
              <form role="search">
                <div className="input-group">
                  <input
                    type="search"
                    placeholder="Search your product"
                    className="form-control"
                  />
                  <button className="btn bg-white" type="submit">
                    <i className="fa fa-search"></i>
                  </button>
                </div>
              </form>
            </div>
            <div className="col-md-5 my-auto">
              <ul className="nav justify-content-end">
                <li className="nav-item">
                  <Link href="/cart"  legacyBehavior>
                    <a className="nav-link">
                      <i className="fa fa-shopping-cart"></i> Cart (0)
                    </a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/wishlist" legacyBehavior>
                    <a className="nav-link">
                      <i className="fa fa-heart"></i> Wishlist (0)
                    </a>
                  </Link>
                </li>
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
                      <Link href="/Register" legacyBehavior>
                        <a className="dropdown-item">
                          <i className="fa fa-user"></i> Register
                          </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/orders" legacyBehavior>
                        <a className="dropdown-item">
                          <i className="fa fa-list"></i> My Orders
                          </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/wishlist" legacyBehavior>
                        <a className="dropdown-item">
                          <i className="fa fa-heart"></i> My Wishlist
                          </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/cart" legacyBehavior>
                        <a className="dropdown-item">
                          <i className="fa fa-shopping-cart"></i> My Cart
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
                <Link href="/" legacyBehavior>
                  <a className="nav-link">Home</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/categories" legacyBehavior> 
                  <a className="nav-link">All Categories</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/new-arrivals" legacyBehavior>
                  <a className="nav-link">New Arrivals</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/featured-products" legacyBehavior>
                  <a className="nav-link">Featured Products</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/electronics legacyBehavior" legacyBehavior>
                  <a className="nav-link">Electronics</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/fashions" legacyBehavior>
                  <a className="nav-link">Fashions</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/accessories" legacyBehavior>
                  <a className="nav-link">Accessories</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/home" legacyBehavior>
                  <a className="nav-link">Home</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/appliances" legacyBehavior>
                  <a className="nav-link">Appliances</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
