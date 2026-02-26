require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { startIngestionWorker } = require('./workers/ingestionWorker');

const PORT = process.env.PORT || 5000;

const start = async () => {
  // 1. Connect to MongoDB
  await connectDB();

  // 2. Start Express server
  app.listen(PORT, () => {
    console.log(`🚀 mrkts server running on http://localhost:${PORT}`);
  });

  // 3. Start RSS ingestion worker
  startIngestionWorker();
};

start();
