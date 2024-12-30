// components/Navbar.js
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import LoginForm from './LoginForm'; // Ensure this import is correct
import RegisterForm from './RegisterForm';


const Navbar = () => {
  const [username, setUsername] = useState("Connexion");
  const [role, setRole] = useState("")

  const { logout } = useAuth();
  const router = useRouter();
  useEffect(() => {
    const userName = localStorage.getItem('username');
    setUsername(userName ? userName : 'Connexion');
    if((localStorage.getItem('role')=='admin')){
      setRole(localStorage.getItem('role'))
    }
  }, []);

  const logOut = () => {
    logout();
    router.reload('/');
    setUsername('Connexion');
  };

  return (
    <>
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
                  {username !== "Connexion" ? (
                    <>
                      <li className="nav-item">
                        <Link href="/cart" legacyBehavior>
                          <a className="nav-link">
                            <i className="fa fa-shopping-cart"></i> Cart (0)
                          </a>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link href="/" legacyBehavior>
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
                          {role && 
                                              <li>
                                                    <a className="dropdown-item" data-bs-toggle="modal"data-bs-target="#formModal">
                                                      <i className="fa fa-user"></i> Register
                                                    </a>
                                              </li>
                          }

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
                    </>
                  ) : (
                    <li className="nav-item">
                      {/* Modal Trigger Button */}
                      <button
                        type="button"
                        className="nav-link btn btn-link"
                        data-bs-toggle="modal"
                        data-bs-target="#loginModal"
                      >
                        <i className="fa fa-user"></i> Connexion
                      </button>
                    </li>
                  )}
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
                  <Link href="/AllCategory" legacyBehavior>
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
                  <Link href="/electronics" legacyBehavior>
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
      {/* Modal */}
      <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="loginModalLabel">Login</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <LoginForm/>
            </div>
          </div>
        </div>
      </div>
      {/* Register Modal */}
      {/* <div className={`modal ${showRegisterModal ? 'show' : ''}`} tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Register</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={closeRegisterModal}></button>
            </div>
            <div className="modal-body">
              <RegisterForm closeModal={closeRegisterModal} />
            </div>
          </div>
        </div>
      </div> */}

<div className="modal fade" id="formModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-body">
              <RegisterForm />
            </div>
          </div>
      </div>

    </>
  );
};

export default Navbar;
