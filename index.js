import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/user.js';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 5001;

// ------------------ MongoDB ------------------
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27018/aist';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully!'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// // ------------------ Gmail OAuth2 ------------------
// const oauth2Client = new google.auth.OAuth2(
//   process.env.OAUTH_CLIENT_ID,
//   process.env.OAUTH_CLIENT_SECRET,
//   process.env.OAUTH_REDIRECT_URI,
// );

// // Используем только refresh token
// oauth2Client.setCredentials({
//   refresh_token: process.env.OAUTH_REFRESH_TOKEN,
// });

// const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

// // ------------------ Функция отправки тестового письма ------------------
// async function sendTestEmail() {
//   const message = Buffer.from(
//     `To: gafarova011094@gmail.com\r\n` + `Subject: AIST POST\r\n\r\n` + `POST IS WORKING`,
//   )
//     .toString('base64')
//     .replace(/\+/g, '-')
//     .replace(/\//g, '_')
//     .replace(/=+$/, '');

//   try {
//     const res = await gmail.users.messages.send({
//       userId: 'me',
//       requestBody: { raw: message },
//     });
//     console.log('✅ Email sent, ID:', res.data.id);
//   } catch (err) {
//     console.error('❌ Gmail send error:', err);
//   }
// }

// // Отправка тестового письма сразу после запуска
// sendTestEmail();

// ------------------ Запуск сервера ------------------
app.get('/', (req, res) => res.send('Server is running.'));
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
