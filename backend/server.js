import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Environment variables
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'yasararafathjiy@gmail.com';

// In-memory OTP storage (consider using Redis/database in production)
const otpStorage = new Map();

// Helper: Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper: Send email via Mailgun
async function sendMailgunEmail(to, subject, text, html) {
  const auth = Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64');

  try {
    const data = new URLSearchParams();
    data.append('from', `noreply@${MAILGUN_DOMAIN}`);
    data.append('to', to);
    data.append('subject', subject);
    data.append('text', text);
    data.append('html', html);

    const response = await axios.post(
      `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
      data,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Mailgun error:', error.response?.data || error.message);
    throw error;
  }
}

// Endpoint: Verify reCAPTCHA
app.post('/api/verify-recaptcha', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Verify with Google reCAPTCHA
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: RECAPTCHA_SECRET_KEY,
          response: token
        }
      }
    );

    const { success, score, action, challenge_ts, hostname, error_codes } = response.data;

    if (!success) {
      return res.status(400).json({
        error: 'reCAPTCHA verification failed',
        details: error_codes
      });
    }

    // reCAPTCHA v3 returns a score (0.0 - 1.0)
    // Higher score = more likely legitimate (lower = more likely bot)
    if (score < 0.5) {
      return res.status(400).json({
        error: 'Suspicious activity detected',
        score: score
      });
    }

    res.json({
      success: true,
      score: score,
      action: action,
      challenge_ts: challenge_ts
    });
  } catch (error) {
    console.error('reCAPTCHA verification error:', error.message);
    res.status(500).json({ error: 'reCAPTCHA verification failed' });
  }
});

// Endpoint: Send OTP
app.post('/api/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Generate OTP
    const otp = generateOTP();
    const expirationTime = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    otpStorage.set(email, {
      otp: otp,
      expiresAt: expirationTime,
      attempts: 0
    });

    // Send OTP via Mailgun
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px;">
          <h2 style="color: #06b6d4;">Email Verification</h2>
          <p>Your one-time password (OTP) for portfolio contact form:</p>
          <div style="background-color: #f0f9ff; padding: 20px; margin: 20px 0; text-align: center; border-radius: 4px;">
            <h1 style="color: #06b6d4; letter-spacing: 2px; margin: 0;">${otp}</h1>
          </div>
          <p style="color: #666;">This OTP will expire in 10 minutes.</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      </div>
    `;

    await sendMailgunEmail(
      email,
      'Your Portfolio Contact Form OTP',
      `Your OTP is: ${otp}. This will expire in 10 minutes.`,
      emailHtml
    );

    res.json({
      success: true,
      message: 'OTP sent to email',
      email: email
    });
  } catch (error) {
    console.error('Send OTP error:', error.message);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Endpoint: Verify OTP
app.post('/api/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const storedOTP = otpStorage.get(email);

    if (!storedOTP) {
      return res.status(400).json({ error: 'No OTP found for this email. Please request a new one.' });
    }

    // Check if OTP expired
    if (Date.now() > storedOTP.expiresAt) {
      otpStorage.delete(email);
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    // Check attempt limit
    if (storedOTP.attempts >= 3) {
      otpStorage.delete(email);
      return res.status(400).json({ error: 'Too many attempts. Please request a new OTP.' });
    }

    // Verify OTP
    if (storedOTP.otp !== otp.toString()) {
      storedOTP.attempts += 1;
      return res.status(400).json({
        error: 'Invalid OTP',
        attemptsLeft: 3 - storedOTP.attempts
      });
    }

    // OTP verified - remove it from storage
    otpStorage.delete(email);

    res.json({
      success: true,
      message: 'OTP verified successfully',
      email: email
    });
  } catch (error) {
    console.error('Verify OTP error:', error.message);
    res.status(500).json({ error: 'OTP verification failed' });
  }
});

// Endpoint: Submit contact form
app.post('/api/submit-contact', async (req, res) => {
  try {
    const { email, name, subject, message } = req.body;

    // Validate fields
    if (!email || !name || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (name.length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters' });
    }

    if (subject.length < 3) {
      return res.status(400).json({ error: 'Subject must be at least 3 characters' });
    }

    if (message.length < 10) {
      return res.status(400).json({ error: 'Message must be at least 10 characters' });
    }

    // Send email to admin
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #06b6d4;">New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
      </div>
    `;

    await sendMailgunEmail(
      ADMIN_EMAIL,
      `New Contact: ${subject}`,
      `From: ${name} (${email})\n\nSubject: ${subject}\n\nMessage:\n${message}`,
      adminEmailHtml
    );

    // Send confirmation email to user
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px;">
          <h2 style="color: #06b6d4;">Message Received</h2>
          <p>Hi ${name},</p>
          <p>Thank you for contacting me. I've received your message and will get back to you as soon as possible.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <h4>Your Message:</h4>
          <p><strong>Subject:</strong> ${subject}</p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">This is an automated response. Please don't reply to this email.</p>
        </div>
      </div>
    `;

    await sendMailgunEmail(
      email,
      'Re: ' + subject,
      `Thank you for your message. We will get back to you soon.`,
      confirmationHtml
    );

    res.json({
      success: true,
      message: 'Message sent successfully! Check your email for confirmation.'
    });
  } catch (error) {
    console.error('Submit contact error:', error.message);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
