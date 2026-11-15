import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn('[MongoDB Warning] MONGO_URI is missing from environment variables!');
    console.log('[MongoDB] Initializing MongoMemoryServer fallback so login and data work out-of-the-box...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`[MongoDB Connected] In-Memory MongoDB running at: ${uri}`);
      return conn;
    } catch (memError) {
      console.error('[MongoDB Fallback Error]:', memError.message);
      return null;
    }
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(
      `[MongoDB Connected] Host: ${conn.connection.host} / DB: ${conn.connection.name}`
    );
    return conn;
  } catch (error) {
    console.error('[MongoDB Connection Failed]:', error.message);
    console.warn(
      '[MongoDB Tip] Check that 0.0.0.0/0 (Allow from Anywhere) is enabled in your MongoDB Atlas Network Access!'
    );
    return null;
  }
};

export default connectDB;
