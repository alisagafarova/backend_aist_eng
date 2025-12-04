import { google } from 'googleapis';
import { oauth2Client } from './oauth2Client.js';
import { createRawMessage } from './createRawMessage.js';

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

const sendEmail = async (to, subject, htmlContent) => {
  const rawMessage = createRawMessage('AIST', to, subject, htmlContent);

  try {
    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: rawMessage,
      },
    });
    console.log('Email sent:', res.data);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export { sendEmail };
