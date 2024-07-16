// utils/auth.js

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dbConnect from '../lib/mongodb';
import User from '../models/User';


export async function generateToken(user) {
  try {
    if (!user) {
      throw new Error('User object is null or undefined');
      console.log(user);
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h' // Token expiration time
    });

    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Token generation failed');
  }
}

export async function loginUser(email, password) {
  try {
    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new Error('Invalid credentials');
    }

    const token = await generateToken(user);

    return { token, user };
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Login failed');
  }
}
