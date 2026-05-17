export default async function handler(req, res) {

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { from_name, from_email, subject, message } = req.body;

  // Basic validation
  if (!from_name || !from_email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id:  process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id:     process.env.EMAILJS_PUBLIC_KEY,
        template_params: {
          from_name,
          from_email,
          subject,
          message
        }
      })
    });

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      const err = await response.text();
      return res.status(500).json({ error: err });
    }

  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}