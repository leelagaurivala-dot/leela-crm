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
    const adminPassword = 'J@YshreeeR@m9';
    const adminExists = await User.findOne({ email: adminEmail }).select('+password');
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: adminEmail,
        password: adminPassword
      });
      console.log(`Default admin user seeded: ${adminEmail} / ${adminPassword}`);
    } else {
      // Ensure the password is updated to the new one
      adminExists.password = adminPassword;
      await adminExists.save();
      console.log(`Admin user password verified/updated`);
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
