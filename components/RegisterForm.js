// components/RegisterForm.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './RegisterForm.module.css'; // Import the CSS module
import { useRouter } from 'next/router';

const RegisterForm = ({ closeModal }) => {
  const router = useRouter();

  const [role, setRole] = useState("")
  useEffect(()=>{
    if((localStorage.getItem('role')=='admin')){
      setRole(localStorage.getItem('role'))
    }
  },[])
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' // Default role
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/register', formData);
      console.log('Registration successful!', response.data);
      toast.success('Register successful!');
      router.push('/');
      // Optionally redirect to login page or home page after successful registration
      closeModal(); // Close modal after successful registration
    } catch (error) {
      console.error('Registration failed!', error);
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
          {/* Form fields */}
          {/* Example: Name */}
          <div className="mb-3">
            <label htmlFor="nameInput" className="form-label">Name</label>
            <input type="text" className="form-control" id="nameInput" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          {/* Example: Email */}
          <div className="mb-3">
            <label htmlFor="emailInput" className="form-label">Email address</label>
            <input type="email" className="form-control" id="emailInput" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          {/* Example: Password */}
          <div className="mb-3">
            <label htmlFor="passwordInput" className="form-label">Password</label>
            <input type="password" className="form-control" id="passwordInput" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          {/* Example: Confirm Password */}
          <div className="mb-3">
            <label htmlFor="confirmPasswordInput" className="form-label">Confirm Password</label>
            <input type="password" className="form-control" id="confirmPasswordInput" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          </div>
        {role && 
                  <div className="mb-3">
                  <label htmlFor="roleSelect" className="form-label">Role</label>
                  <select className="form-select" id="roleSelect" name="role" value={formData.role} onChange={handleChange} required>
                    <option value="admin">Admin</option>
                    <option value="operator">Operator</option>
                  </select>
                </div>
        }
          {/* Example: Role (select dropdown) */}

          {/* Submit button */}
          <button type="submit" className="btn btn-primary">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
