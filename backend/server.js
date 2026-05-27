require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/send-email', async (req, res) => {
  const { nom, email, sujet, message } = req.body;

  if (!nom || !email || !sujet || !message) {
    return res.status(400).json({ success: false, error: 'Tous les champs sont requis.' });
  }

  const mailOptions = {
    from: `"${nom} via Mimi 💌" <${process.env.EMAIL_USER}>`,
    to: email,
    replyTo: process.env.EMAIL_USER,
    subject: sujet,
    text: `Message de : ${nom} (${email})\n\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email envoyé avec succès !' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Échec de l\'envoi.' });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`✅ Serveur Mimi démarré sur http://localhost:3000`);
});