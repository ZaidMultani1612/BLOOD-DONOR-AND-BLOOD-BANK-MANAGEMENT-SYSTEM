import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/healthtech_bloodbank';
    
    // Attempt standard connection first with 3s timeout
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB Connected] Host: ${conn.connection.host} / DB: ${conn.connection.name}`);
  } catch (error) {
    console.warn(`[MongoDB Warning] Local MongoDB connection failed: ${error.message}`);
    console.log('[MongoDB] Initializing MongoDB In-Memory Server fallback for zero-setup execution...');
    
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`[MongoDB Connected] In-Memory MongoDB running at: ${uri}`);
    } catch (memError) {
      console.error(`[MongoDB Error] Failed to start In-Memory fallback: ${memError.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;
