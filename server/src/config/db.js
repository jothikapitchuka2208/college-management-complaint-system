const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('[Database Warning] MONGODB_URI environment variable is NOT set in Render. Using fallback: ' + env.mongodbUri);
    }
    const conn = await mongoose.connect(env.mongodbUri);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[Database] Connection Error: ${error.message}`);
    if (!process.env.MONGODB_URI) {
      console.error('[Database Guide] Please set MONGODB_URI in your Render Web Service Environment settings to your MongoDB Atlas connection string.');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
