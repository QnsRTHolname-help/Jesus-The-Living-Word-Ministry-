# Aurora Ministry Platform

Premium Next.js ministry platform with a protected admin dashboard, MongoDB CMS data, retreat management, editable site settings, contact inbox, SEO controls, uploads, and animated responsive UI.

## Local Setup

```powershell
cd "C:\Users\qnsrt\OneDrive\Documents\New project"
npm install
copy .env.example .env.local
npm.cmd run seed
npm.cmd run dev
```

Open `http://localhost:3000`.

## Required Environment Variables

Set these in `.env.local` locally and in your hosting provider:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ministry_website?retryWrites=true&w=majority
MONGODB_DNS_SERVERS=8.8.8.8,1.1.1.1
JWT_SECRET=replace-with-a-long-random-secret
ADMIN_EMAIL=admin@ministry.local
ADMIN_PASSWORD=ChangeMe123!
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Optional contact delivery:

```env
ADMIN_NOTIFICATION_EMAIL=
RESEND_API_KEY=
EMAIL_FROM=Aurora Ministry <onboarding@resend.dev>
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
ADMIN_WHATSAPP_TO=
```

## Admin

Seed creates the first admin from `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

Admin routes:

- `/admin/login`
- `/admin/dashboard`
- `/admin/notifications`
- `/admin/retreats`
- `/admin/settings`
- `/admin/users`

Use `/admin/users` to create more admin accounts with email and password. Passwords are hashed before being stored in MongoDB.

## Contact Inbox

Contact messages are saved to MongoDB. The dashboard inbox supports unread/read, archive, delete, search, reply history, admin toast notifications, optional browser notifications, optional Resend email, optional Twilio WhatsApp, spam honeypot, rate limiting, and a simple CAPTCHA check.

## Build And Deploy

```powershell
npm.cmd run build
npm.cmd run start
```

For Vercel or another host, add the same environment variables, deploy the repo, then run the seed command once with production environment variables.
