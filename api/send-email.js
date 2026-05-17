export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { from_name, from_email, subject, message } = req.body;

  if (!from_name || !from_email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Log to see if env vars are being read (visible in Vercel logs)
  console.log('Service ID:', process.env.EMAILJS_SERVICE_ID);
  console.log('Template ID:', process.env.EMAILJS_TEMPLATE_ID);
  console.log('Public Key:', process.env.EMAILJS_PUBLIC_KEY ? 'EXISTS' : 'MISSING');

  try {
    const payload = {
      service_id:  process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id:     process.env.EMAILJS_PUBLIC_KEY,
      template_params: {
        from_name,
        from_email,
        subject,
        message
      }
    };

    console.log('Sending payload:', JSON.stringify(payload));

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    console.log('EmailJS response status:', response.status);
    console.log('EmailJS response body:', responseText);

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: responseText });
    }

  } catch (err) {
    console.error('Catch error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}