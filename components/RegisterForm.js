// components/RegisterForm.js
import React, { useState } from 'react';
import axios from 'axios';


const RegisterForm = () => {
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
    // Send registration data to backend API
    try {
      const response = await axios.post('/api/register', formData);
      console.log('Registration successful!', response.data);
      // Optionally redirect to login page or home page after successful registration
    } catch (error) {
      console.error('Registration failed!', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
      <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required />
      <select name="role" value={formData.role} onChange={handleChange}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
        <option value="operator">operator</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
