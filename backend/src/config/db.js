import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import mongoose from 'mongoose';
import User from '../models/User.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Seed default Admin User
    const adminEmail = 'admin@leelacrm.com';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: adminEmail,
        password: 'adminpassword'
      });
      console.log(`Default admin user seeded: ${adminEmail} / adminpassword`);
    } else {
      console.log(`Admin user ${adminEmail} already exists`);
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
