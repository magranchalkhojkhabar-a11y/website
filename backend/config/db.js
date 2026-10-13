const mongoose = require('mongoose');
const { log } = require('./logger');

let connectionPromise;
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (connectionPromise) return connectionPromise;

  try {
    connectionPromise = mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    const conn = await connectionPromise;
    log('info', 'database_connected', { host: conn.connection.host });
    return conn;
  } catch (error) {
    connectionPromise = undefined;
    log('error', 'database_connection_failed', { message: error.message });
    throw error;
  }
};

module.exports = connectDB;
