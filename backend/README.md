# Portfolio Backend

Node.js/Express backend for portfolio contact form with reCAPTCHA verification and OTP email validation.

## Quick Start

### Development
```bash
npm install
npm run dev
```

### Production
```bash
npm install
npm start
```

## Configuration

Copy `.env.example` to `.env` and update values:
```bash
cp .env.example .env
```

## Environment Variables

- `RECAPTCHA_SECRET_KEY` - Google reCAPTCHA v3 secret key
- `MAILGUN_API_KEY` - Mailgun API key
- `MAILGUN_DOMAIN` - Mailgun domain (mail.getcurious.dev)
- `ADMIN_EMAIL` - Email to receive contact form submissions
- `PORT` - Server port (default: 3000)

## API Routes

- `POST /api/verify-recaptcha` - Verify reCAPTCHA token
- `POST /api/send-otp` - Send OTP to email
- `POST /api/verify-otp` - Verify OTP code
- `POST /api/submit-contact` - Submit contact form
- `GET /api/health` - Health check

## Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for Railway deployment instructions.

## Technologies

- Express.js - Web framework
- Axios - HTTP client for Mailgun & reCAPTCHA
- CORS - Cross-origin resource sharing
- Dotenv - Environment variable management

## Features

✅ reCAPTCHA v3 bot detection
✅ OTP-based email verification
✅ Mailgun email integration
✅ Contact form submission with confirmation email
✅ Error handling and validation
✅ CORS enabled for GitHub Pages

## License

MIT
