# Portfolio Backend Deployment Guide

## Overview
This backend handles:
- **reCAPTCHA verification** (v3 from Google)
- **OTP generation and sending** via Mailgun
- **Contact form submission** with email confirmation

## Prerequisites
- Node.js 16+ installed locally (for testing)
- Railway account (free - sign up at https://railway.app)
- GitHub account (to connect your repository)

---

## Local Testing

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Create `.env` file
Copy the contents of `.env.example` and create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

The `.env` file should contain:
```
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here
MAILGUN_API_KEY=your_mailgun_api_key_here
MAILGUN_DOMAIN=your_mailgun_domain_here
ADMIN_EMAIL=your_email@example.com
PORT=3000
```

### 3. Run Locally
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The server will start on `http://localhost:3000`

### 4. Test Endpoints
You can test the endpoints using Postman or curl:

**Test reCAPTCHA verification:**
```bash
curl -X POST http://localhost:3000/api/verify-recaptcha \
  -H "Content-Type: application/json" \
  -d '{"token":"your-recaptcha-token"}'
```

**Test OTP sending:**
```bash
curl -X POST http://localhost:3000/api/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

**Health check:**
```bash
curl http://localhost:3000/api/health
```

---

## Deploy to Railway

### Step 1: Push to GitHub
Make sure your repository is on GitHub and includes the `backend` folder:

```bash
git add .
git commit -m "Add backend with reCAPTCHA and OTP verification"
git push origin main
```

### Step 2: Create Railway Project
1. Go to https://railway.app
2. Sign in or create an account
3. Click "New Project"
4. Select "Deploy from GitHub"
5. Connect your GitHub account
6. Select your portfolio repository
7. Select the `backend` directory as the root directory

### Step 3: Configure Environment Variables
**Important:** Never store secrets in your code or git repository. Use Railway's environment variable management instead.

In the Railway dashboard:

1. Go to your project
2. Click on the service (backend)
3. Click on the "Variables" tab
4. Add the following variables with your actual values:

| Variable | Value | Where to Find |
|----------|-------|---------|
| `RECAPTCHA_SECRET_KEY` | Your reCAPTCHA secret key | Google reCAPTCHA Console |
| `MAILGUN_API_KEY` | Your Mailgun API key | Mailgun Dashboard > API Keys |
| `MAILGUN_DOMAIN` | Your Mailgun domain | Mailgun Dashboard > Domains |
| `ADMIN_EMAIL` | Your email address | Any valid email |
| `PORT` | `3000` | Default port |

**Getting Your Secrets:**
- **reCAPTCHA Secret**: https://console.cloud.google.com/security/recaptcha
- **Mailgun API Key & Domain**: https://app.mailgun.com/app/account/security/api_keys

Once you add variables to Railway, they will be automatically available to your backend via `process.env` when deployed. Your local `.env` file (not in git) is only for local development.

### Step 4: Get Your Backend URL
After deployment:
1. Railway will assign a public URL (e.g., `https://portfolio-backend-prod.railway.app`)
2. Copy this URL

### Step 5: Update Frontend
In your `index.html` (or `script.js`), replace the `BACKEND_URL`:

**In script.js line 304:**
```javascript
const BACKEND_URL = 'https://your-railway-url.railway.app'; // Replace with your Railway URL
```

For example:
```javascript
const BACKEND_URL = 'https://portfolio-backend-prod.railway.app';
```

### Step 6: Deploy Frontend
Push the changes to GitHub Pages:

```bash
git add script.js
git commit -m "Update backend URL for production"
git push origin main
```

---

## Verify Deployment

1. Visit your portfolio website
2. Scroll to the Contact section
3. Enter an email and click "Send OTP"
4. Check your email for the OTP
5. Enter the OTP and verify
6. Fill in the contact form and submit

---

## API Endpoints

### POST `/api/verify-recaptcha`
Verify reCAPTCHA token

**Request:**
```json
{
  "token": "recaptcha-token-from-client"
}
```

**Response:**
```json
{
  "success": true,
  "score": 0.9,
  "action": "submit",
  "challenge_ts": "2024-01-01T12:00:00Z"
}
```

---

### POST `/api/send-otp`
Generate and send OTP to email

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to email",
  "email": "user@example.com"
}
```

---

### POST `/api/verify-otp`
Verify the OTP

**Request:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "email": "user@example.com"
}
```

---

### POST `/api/submit-contact`
Submit the contact form

**Request:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "subject": "Project Inquiry",
  "message": "I'm interested in collaborating on a project..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully! Check your email for confirmation."
}
```

---

### GET `/api/health`
Health check endpoint

**Response:**
```json
{
  "status": "Backend is running"
}
```

---

## Troubleshooting

### Backend not receiving requests
- Check that `BACKEND_URL` in `script.js` is correct
- Ensure CORS is configured (it is in `server.js`)
- Check browser console for network errors

### OTP not being sent
- Verify Mailgun API key is correct
- Check Mailgun domain is active
- Verify email address is valid
- Check backend logs for errors

### reCAPTCHA verification failing
- Verify reCAPTCHA secret key is correct
- Check that reCAPTCHA site key matches in frontend (`script.js`)
- Ensure reCAPTCHA is enabled in Google Console

### Railway deployment issues
- Check logs in Railway dashboard
- Verify all environment variables are set
- Ensure `package.json` and `server.js` are in the correct directory
- Check Node.js version compatibility

---

## Security Notes

1. **Never commit `.env` file** - Already in `.gitignore`
2. **API Keys** - Set via Railway environment variables, not in code
3. **OTP Storage** - Currently in-memory; use Redis/database for production
4. **CORS** - Configured to allow requests from your domain
5. **reCAPTCHA v3** - Score-based; adjust threshold if needed

---

## Future Improvements

1. Add database (MongoDB/PostgreSQL) for storing submissions
2. Use Redis for OTP storage instead of memory
3. Add email rate limiting
4. Implement request logging
5. Add webhook support for form submissions
6. Add admin dashboard for viewing submissions

---

## Support

For issues or questions, check:
- Railway Documentation: https://docs.railway.app
- Mailgun Documentation: https://documentation.mailgun.com
- Google reCAPTCHA: https://developers.google.com/recaptcha
