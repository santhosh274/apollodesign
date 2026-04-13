const express = require('express');
const { Resend } = require('resend');
const path = require('path');
require('dotenv').config();

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post('/api/send-email', async (req, res) => {
  const { user_name, user_email, project_type, message } = req.body;

  try {
    const data = await resend.emails.send({
      from: 'Apollo Designs <onboarding@resend.dev>',
      to: ['apollodesigns.sv@gmail.com'],
      subject: `New Project Manifest: ${user_name}`,
      html: `
        <h2>New Project Inquiry</h2>
        <p><strong>Name:</strong> ${user_name}</p>
        <p><strong>Email:</strong> ${user_email}</p>
        <p><strong>Project Type:</strong> ${project_type}</p>
        <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
      `
    });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve static files - serve landingpage.html as index
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'landingpage.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));