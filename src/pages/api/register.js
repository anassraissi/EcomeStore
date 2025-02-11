import bcrypt from 'bcrypt';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

dbConnect();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  
  const { name, email, password, role, telephone, adresse } = req.body;
  
  
  try {
    
    // console.log("anass",phone,address);

    let user = await User.findOne({ email });
    if (user) { 
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    user = new User({
      name,
      email,
      password,
      role, // Assign the role here
      telephone,
      adresse
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
