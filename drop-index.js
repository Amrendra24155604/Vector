require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please define MONGODB_URI in your .env file!");
  process.exit(1);
}

async function run() {
  console.log("Connecting to database...");
  await mongoose.connect(MONGODB_URI, { dbName: 'careerpilot' });
  console.log("Connected to MongoDB!");
  
  try {
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    console.log("Listing user collection indexes...");
    const indexes = await usersCollection.indexes();
    console.log(indexes.map(idx => idx.name));
    
    const hasUsernameIndex = indexes.some(idx => idx.name === 'username_1');
    if (hasUsernameIndex) {
      console.log("Dropping 'username_1' index to resolve duplicate key duplicate null constraints...");
      await usersCollection.dropIndex('username_1');
      console.log("Successfully dropped 'username_1' index!");
    } else {
      console.log("Index 'username_1' is already deleted or does not exist.");
    }
  } catch (err) {
    console.error("Error modifying database indexes:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database.");
  }
}

run();
