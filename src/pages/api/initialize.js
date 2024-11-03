// pages/api/initialize.js

import initializeAdmin from "../../../utils/adminSetup";

export default async function handler(req, res) {
  try {
    await initializeAdmin();
    res.status(200).json({ message: 'Admin initialization complete' });
  } catch (error) {
    res.status(500).json({ error: 'Error initializing admin' });
  }
}
