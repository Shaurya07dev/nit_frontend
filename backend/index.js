import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import assetsRouter from './routes/assets.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/assets', assetsRouter);

app.get('/', (req, res) => {
  res.send('University Assets Backend API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});