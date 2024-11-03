// pages/api/login.js

import { loginUser } from "../../../utils/auth";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;    
    try {      
      const { token, user } = await loginUser(email, password);
      res.status(200).json({ token, user });
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({ message: 'Login failed' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
