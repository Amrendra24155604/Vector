const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const ApplicationSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  company: String,
  role: String,
  logo: String,
  status: String,
}, { timestamps: true });

const Application = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);

async function checkDb() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    const apps = await Application.find({}).sort('-createdAt');
    console.log(`Found ${apps.length} applications.`);

    apps.forEach((app, idx) => {
      console.log(`${idx + 1}. Company: "${app.company}", Role: "${app.role}", Logo: "${app.logo}", Status: "${app.status}"`);
    });

    await mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
}

checkDb();
