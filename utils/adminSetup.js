
import bcrypt from 'bcrypt';
import User from '../models/User';
import dbConnect from '../lib/mongodb';

async function initializeAdmin() {
    await dbConnect(); // Ensure the database is connected before proceeding
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'anass',
        email: 'anass.raissi.ar@gmail.com',
        password: 123,
        role: 'admin',
        telephone: '0633110420',
        adresse: 'sale',
      });
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

export default initializeAdmin;
