// Seed: 1 admin user + a couple of blog posts. No fake portfolio — Weblyne is new.
// Usage: npm run db:seed
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool } from '../src/lib/db.js';

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'bibek@weblyne.np';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'change-me-on-first-login';

const POSTS = [
  {
    slug: 'why-your-business-needs-a-website-2025',
    title: 'Why your business needs a website in 2025 — even if you have Facebook',
    excerpt: 'Facebook reach is shrinking. Instagram is for browsing, not deciding. Your website is the only digital property you actually own.',
    category: 'Strategy',
    author: 'Aditya Bhujel',
    read_time: '6 min',
    body: `## The myth of "Facebook is enough"
For most local businesses, Facebook was the first foothold online. It was free, familiar, and your customers were already there. But the platform of 2018 isn't the platform of 2026 — organic reach has plummeted, and your business page is increasingly a billboard nobody walks past.

You don't own your Facebook page in any real sense. The platform decides who sees your posts, when, and at what cost.

## What a website actually does
A website is a digital storefront on land you own. It works 24/7, it's the first thing Google indexes when someone searches for your business, and it answers the questions a casual social post can't.

- Detailed service or menu pages
- Booking, ordering, or contact forms
- Trust signals — reviews, certifications, real photos
- SEO that brings strangers to your door

## A simple stack we recommend
For most Biratnagar businesses, a marketing site doesn't need to be complicated. Here's the stack we default to:

\`\`\`
- Framework  : Next.js  (or Astro for content sites)
- Styling    : Tailwind CSS
- CMS        : Sanity   (or Headless WP)
- Hosting    : Vercel
- Domain     : .com.np  (Mercantile)
- Analytics  : Plausible (Nepal-friendly)
\`\`\`

## So… do I need one?
If you sell anything, serve anyone, or want to be found on Google when a stranger needs what you offer — yes. Even a 5-page site is more valuable than a year of Facebook posts.`,
  },
  {
    slug: 'esewa-vs-khalti-vs-stripe',
    title: 'eSewa vs Khalti vs Stripe: which to use for a small Nepali shop',
    excerpt: 'A no-fluff comparison of the three payment options most local businesses end up choosing between.',
    category: 'Tech',
    author: 'Aditya Bhujel',
    read_time: '5 min',
    body: `## The short answer
If you're selling to Nepalis, integrate **both eSewa and Khalti**. If you're selling internationally too, add **Stripe** (via a US/Singapore entity).

## eSewa
- Largest user base in Nepal
- Slightly older API (REST + redirect-based)
- Settlement: 1–2 working days

## Khalti
- Cleaner developer experience
- Webhook-driven settlement reporting
- Younger but growing fast among urban users

## Stripe
- Required for international cards
- Needs a foreign business entity to onboard from Nepal
- Best DX, but not for purely-domestic shops

## Our default
For a domestic shop: eSewa as primary, Khalti as fallback. For a mixed audience: add Stripe behind a country toggle.`,
  },
];

(async () => {
  try {
    // 1) Admin user
    // Use bcrypt cost factor 12 — minimum recommended for 2024+ hardware.
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await pool.query(
      `INSERT INTO admins (email, password_hash, name)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
      [ADMIN_EMAIL, hash, 'Aditya Bhujel'],
    );
    console.log('[seed] admin upserted:', ADMIN_EMAIL);

    // 2) Blog posts
    for (const p of POSTS) {
      await pool.query(
        `INSERT INTO blog (slug, title, excerpt, body, category, author, read_time, published, published_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, true, now())
         ON CONFLICT (slug) DO UPDATE SET
           title = EXCLUDED.title,
           excerpt = EXCLUDED.excerpt,
           body = EXCLUDED.body,
           category = EXCLUDED.category,
           author = EXCLUDED.author,
           read_time = EXCLUDED.read_time,
           updated_at = now()`,
        [p.slug, p.title, p.excerpt, p.body, p.category, p.author, p.read_time],
      );
    }
    console.log(`[seed] ${POSTS.length} blog posts upserted`);

    console.log('\n[seed] done. Sign in with:');
    console.log(`  email: ${ADMIN_EMAIL}`);
    // SECURITY: never log the plain-text password — check your .env for the value.
    console.log('  password: <see SEED_ADMIN_PASSWORD in .env>');
    console.log('Change the password immediately after first login.');
  } catch (err) {
    console.error('[seed] failed:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
