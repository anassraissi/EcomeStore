// pages/api/register.js
import bcrypt from 'bcrypt';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

dbConnect();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    console.log(user);

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    // Create new user
    user = new User({
      name,
      email,
      password: hashedPassword,
      role // Assign the role here
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
