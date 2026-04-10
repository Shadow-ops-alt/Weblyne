# Weblyne — Full Stack Web Agency Website

Built with React + Vite + TypeScript + Supabase.

## Pages
- `/` — Homepage (hero + services + CTA)
- `/pricing` — 3-tier pricing + FAQ
- `/contact` — Contact form (saves to Supabase)
- `/admin/login` — Admin login (Supabase Auth)
- `/admin/dashboard` — View, filter, update, delete inquiries

---

## Setup Guide

### 1. Install dependencies
```bash
npm install
```

### 2. Create a Supabase project
Go to https://supabase.com → New project → pick a name + region

### 3. Run the database schema
Supabase dashboard → SQL Editor → paste `supabase-schema.sql` → Run

### 4. Create your admin account
Supabase → Authentication → Users → Add user
Set your email + password. This is your `/admin/login` credential.

### 5. Add environment variables
```bash
cp .env.example .env
```
Fill in from Supabase → Project Settings → API:
- `VITE_SUPABASE_URL` — your project URL
- `VITE_SUPABASE_ANON_KEY` — your anon/public key

### 6. Start dev server
```bash
npm run dev
```

### 7. Deploy to Vercel
```bash
npm run build
```
Push to GitHub → connect repo on Vercel → add the two env vars in Vercel dashboard → deploy.

---

## Admin Panel Usage
1. Visit `/admin/login`
2. Sign in with your Supabase Auth user
3. All contact form submissions appear here
4. Click any row to open details panel
5. Mark as read / replied, reply by email, or delete

## Stack
- React 18 + Vite + TypeScript
- React Router v6
- Supabase (PostgreSQL + Auth + Row Level Security)
- Custom CSS — full brand control, no Tailwind
- Fonts: Bricolage Grotesque + Instrument Sans
