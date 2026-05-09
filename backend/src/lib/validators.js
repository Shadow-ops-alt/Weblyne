import { z } from 'zod';

// ─── Disposable-email domain blocklist (mirrors frontend list) ───────────────
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'throwam.com',
  'yopmail.com', 'sharklasers.com', 'guerrillamailblock.com', 'grr.la',
  'guerrillamail.info', 'guerrillamail.biz', 'guerrillamail.de',
  'guerrillamail.net', 'guerrillamail.org', 'spam4.me', 'trashmail.com',
  'trashmail.me', 'trashmail.net', 'dispostable.com', 'mailnull.com',
  'spamgourmet.com', 'spamgourmet.net', 'spamgourmet.org', 'maildrop.cc',
  'fakeinbox.com', 'mailnesia.com', 'spamfree24.org', 'discard.email',
  'spamhereplease.com', 'mailscrap.com', 'spamspot.com', 'trashmail.at',
  'trashmail.io', 'wegwerfmail.de', 'tempinbox.com', 'tempr.email',
  'mytemp.email', 'temp-mail.org', 'tempail.com', 'getairmail.com',
  'filzmail.com', 'easytrashmail.com', '10minutemail.com', '10minutemail.net',
  '10minutemail.org', 'minutemailbox.com', '20minutemail.com', 'spamex.com',
  // protonmail.com intentionally NOT blocked
]);

export const contactSchema = z.object({
  name: z.string()
    .trim()
    // Strip HTML/injection chars, keep only name-safe characters
    .transform(v =>
      v.replace(/<[^>]*>/g, '')
       .replace(/[^a-zA-Z\s\-']/g, '')
       .trim()
       .replace(/\s{2,}/g, ' ')
    )
    .refine(v => v.length >= 2,  { message: 'Name must be at least 2 characters' })
    .refine(v => v.length <= 50, { message: 'Name cannot exceed 50 characters' })
    .refine(v => /^[a-zA-Z\s\-']+$/.test(v), {
      message: 'Name can only contain letters, spaces, and hyphens',
    })
    .refine(v => v.includes(' '), {
      message: 'Please enter both first and last name',
    }),

  email: z.string()
    .trim()
    .toLowerCase()
    .transform(v => v.replace(/[^a-z0-9@._\-+]/g, ''))
    .refine(v => v.length > 0, { message: 'Please enter your email address' })
    .refine(v => /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(v), {
      message: 'Please enter a valid email address',
    })
    .refine(v => !(/\.{2,}/.test(v)), { message: 'Please enter a valid email address' })
    .refine(v => {
      const domain = v.split('@')[1];
      return !domain || !DISPOSABLE_DOMAINS.has(domain);
    }, {
      message: 'Temporary or disposable email addresses are not allowed. Please use your real email.',
    })
    .max(200),

  phone: z.string()
    .trim()
    .transform(v => v.replace(/<[^>]*>/g, '').replace(/[^0-9+\-\s()]/g, '').trim())
    .refine(v => v.length > 0, { message: 'Please enter your phone number' })
    .refine(v => !/[a-zA-Z]/.test(v), {
      message: 'Phone number can only contain digits, +, spaces, and dashes',
    })
    .refine(v => {
      const norm = v.replace(/[\s\-().]/g, '');
      return /^\+?\d+$/.test(norm);
    }, { message: 'Phone number can only contain digits, +, spaces, and dashes' })
    .refine(v => {
      const digits = v.replace(/[\s\-().+]/g, '');
      return digits.length >= 7;
    }, { message: 'Phone number is too short' })
    .refine(v => {
      const digits = v.replace(/[\s\-().+]/g, '');
      return digits.length <= 15;
    }, { message: 'Phone number is too long' })
    .refine(v => {
      const digits = v.replace(/[\s\-().+]/g, '');
      return !/^(\d)\1+$/.test(digits);
    }, { message: 'Please enter a valid phone number' })
    .refine(v => {
      const digits = v.replace(/[\s\-().+]/g, '');
      const isSeq = digits.split('').every(
        (d, i, a) => i === 0 || Number(d) === Number(a[i - 1]) + 1
      );
      return !(isSeq && digits.length >= 7);
    }, { message: 'Please enter a valid phone number' })
    .refine(v => {
      const norm = v.replace(/[\s\-().]/g, '');
      const m = norm.match(/^\+?977(\d+)$/);
      if (!m) return true; // Not a Nepal number — skip
      const local = m[1];
      return local.length === 10 && /^(97|98|96)/.test(local);
    }, { message: 'Invalid Nepal phone number format' })
    .optional()
    .or(z.literal('').transform(() => undefined)),

  service: z.string().trim().max(80).optional().or(z.literal('').transform(() => undefined)),
  budget:  z.string().trim().max(80).optional().or(z.literal('').transform(() => undefined)),

  // accept either `desc` (frontend form field) or `description` (api standard)
  description: z.string()
    .trim()
    .transform(v =>
      v.replace(/<script[\s\S]*?<\/script>/gi, '')
       .replace(/javascript\s*:/gi, '')
       .replace(/<[^>]*>/g, '')
       .replace(/[<>{}]/g, '')
       .trim()
    )
    .refine(v => v.replace(/[\s\r\n]/g, '').length > 0, { message: 'Please enter your message' })
    .refine(v => v.length >= 20,   { message: 'Message must be at least 20 characters' })
    .refine(v => v.length <= 1000, { message: 'Message cannot exceed 1000 characters' })
    .refine(v => {
      const s = v.replace(/\s/g, '');
      return !(s.length > 0 && /^(.)\1+$/.test(s));
    }, { message: 'Message must be at least 20 characters' })
    .optional(),

  desc: z.string()
    .trim()
    .transform(v =>
      v.replace(/<script[\s\S]*?<\/script>/gi, '')
       .replace(/javascript\s*:/gi, '')
       .replace(/<[^>]*>/g, '')
       .replace(/[<>{}]/g, '')
       .trim()
    )
    .refine(v => v.length >= 20,   { message: 'Message must be at least 20 characters' })
    .refine(v => v.length <= 1000, { message: 'Message cannot exceed 1000 characters' })
    .optional(),

  // Honeypot fields
  website:  z.string().max(500).optional(),
  hp_token: z.string().max(500).optional(),
}).refine(d => d.description || d.desc, { message: 'description is required', path: ['description'] })
  .transform(d => ({ ...d, description: d.description || d.desc }));

export const newsletterSchema = z.object({
  email: z.string().trim().email().max(200),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6).max(200),
});

export const portfolioSchema = z.object({
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().max(2000).optional(),
  category: z.string().trim().min(1).max(40),
  client_name: z.string().trim().max(120).optional(),
  tech_stack: z.array(z.string().trim().max(40)).default([]),
  image_url: z.string().trim().max(500).optional()
    .or(z.literal('').transform(() => undefined))
    .refine(v => !v || /^(https?:\/\/|\/uploads\/)/.test(v), 'image_url must be an absolute URL or /uploads/... path'),
  live_url: z.string().trim().url().max(500).optional().or(z.literal('').transform(() => undefined)),
  challenge: z.string().trim().max(4000).optional(),
  approach: z.string().trim().max(4000).optional(),
  results: z.string().trim().max(4000).optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

export const blogSchema = z.object({
  slug: z.string().trim().min(2).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase-dashed slug'),
  title: z.string().trim().min(2).max(200),
  excerpt: z.string().trim().max(500).optional(),
  body: z.string().trim().min(10),
  category: z.string().trim().max(40).optional(),
  author: z.string().trim().max(120).optional(),
  read_time: z.string().trim().max(20).optional(),
  image_url: z.string().trim().max(500).optional()
    .or(z.literal('').transform(() => undefined))
    .refine(v => !v || /^(https?:\/\/|\/uploads\/)/.test(v), 'image_url must be an absolute URL or /uploads/... path'),
  published: z.boolean().optional(),
  published_at: z.string().datetime().optional(),
});

export const adminCreateSchema = z.object({
  email: z.string().trim().email().max(200),
  password: z.string().min(8).max(200),
  name: z.string().trim().max(120).optional(),
});

export const contactPatchSchema = z.object({
  status: z.enum(['new', 'replied', 'archived']).optional(),
});
