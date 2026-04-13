import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user_name, user_email, project_type, message } = req.body;

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

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}