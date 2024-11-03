import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import 'mdb-react-ui-kit/dist/css/mdb.min.css'; // Import MDB React UI Kit CSS
import { MDBInput } from 'mdb-react-ui-kit';
import { toast } from 'react-toastify';


const RegisterForm = ({ closeModal }) => {
  const router = useRouter();

  const [role, setRole] = useState("");

  useEffect(() => {
      if (localStorage.getItem('role')) {
          setRole('admin');
          console.log(role);
      
    }
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer', // Default role
    telephone: '',
    adresse: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    
    try {
      const response = await axios.post('/api/register', formData);
      console.log('Registration successful!', response.data);
      toast.success('Registration successful!');
          // Clear the form inputs
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'customer',
      telephone: '',
      adresse: ''
    });

  
      // Close the modal after successful registration
      if (localStorage.getItem('role') !== "admin") {
        closeModal();
        // router.reload('/');
      } else {
        closeModal();
      }
    } catch (error) {
      console.error('Registration failed!', error);
      // toast.error('Registration failed!');
    }
  };
  
  return (
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="registerModalLabel">Register</h5>
        <button type="button" className="btn-close" onClick={closeModal}></button>
      </div>
      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="nameInput"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              id="emailInput"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              id="passwordInput"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              id="confirmPasswordInput"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone */}
          <div data-mdb-input-init className="form mb-3" style={{ width: '100%', maxWidth: '22rem' }}>
            <input
              type="text"
              id="phone"
              className="form-control"
              name="telephone"
              placeholder="Phone number with country code"
              value={formData.telephone}
              onChange={handleChange}
              data-mdb-input-mask="+48 999-999-999"
              required
            />
          </div>

          {/* Address */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="addressInput"
              name="adresse"
              placeholder="Address"
              value={formData.adresse}
              onChange={handleChange}
              required
            />
          </div>

          {/* Role (select dropdown) */}
            <div className="mb-3">
              <select
                className="form-select"
                id="roleSelect"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
          {role ? (
             <>
                             <option value="admin">Admin</option>
                             <option value="operator">Operator</option>
             </>
              )  :
                              <>
                              <option value="customer">customer</option>
                              <option value="seller">seller</option>
                              </>
          }
               


              </select>
            </div>
          

          {/* Submit button */}
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
