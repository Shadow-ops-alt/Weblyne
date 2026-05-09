/**
 * formValidation.js
 * Weblyne — Contact form validation & sanitization utilities.
 * All functions are pure and exported individually for reuse on both
 * the contact page and any other form that needs the same rules.
 *
 * NO external libraries (no Yup, no Zod) — clean vanilla JS only.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Disposable / temp-mail domain blocklist
// ─────────────────────────────────────────────────────────────────────────────
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
  // protonmail.com is intentionally NOT in this list (legitimate provider)
]);

// ─────────────────────────────────────────────────────────────────────────────
// FULL NAME
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sanitize a name value before validation.
 * - Strips HTML tags and special characters
 * - Removes digits and symbols not allowed in names
 * - Trims and collapses whitespace
 */
export function sanitizeName(raw) {
  if (typeof raw !== 'string') return '';
  return raw
    // Strip HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove special HTML/injection characters
    .replace(/[<>{}\[\]\\^$|?*+()"`;]/g, '')
    // Remove digits and symbols — keep only letters, spaces, hyphens, apostrophes
    .replace(/[^a-zA-Z\s\-']/g, '')
    // Trim leading/trailing whitespace
    .trim()
    // Collapse multiple consecutive spaces into one
    .replace(/\s{2,}/g, ' ');
}

/**
 * Validate a sanitized name string.
 * Returns null on success, or an error message string on failure.
 */
export function validateName(value) {
  const v = typeof value === 'string' ? value : '';

  if (!v) return 'Please enter your full name';
  if (v.length < 2) return 'Name must be at least 2 characters';
  if (v.length > 50) return 'Name cannot exceed 50 characters';

  // Only letters, spaces, hyphens, apostrophes
  if (!/^[a-zA-Z\s\-']+$/.test(v)) {
    return 'Name can only contain letters, spaces, and hyphens';
  }

  // No consecutive spaces
  if (/\s{2,}/.test(v)) {
    return 'Name can only contain letters, spaces, and hyphens';
  }

  // Must have at least one space → at least first + last name
  if (!v.includes(' ')) {
    return 'Please enter both first and last name';
  }

  return null; // valid
}

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL ADDRESS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sanitize an email value before validation.
 * - Trims whitespace
 * - Lowercases
 * - Strips characters that are not valid in email addresses
 */
export function sanitizeEmail(raw) {
  if (typeof raw !== 'string') return '';
  return raw
    .trim()
    .toLowerCase()
    // Keep only chars valid in email addresses: alphanum, @, ., _, -, +
    .replace(/[^a-z0-9@._\-+]/g, '');
}

/**
 * Validate a sanitized email string.
 * Returns null on success, or an error message string on failure.
 */
export function validateEmail(value) {
  const v = typeof value === 'string' ? value : '';

  if (!v) return 'Please enter your email address';

  // Full RFC-5321-inspired regex:
  // local@domain.tld — TLD ≥ 2 chars, no consecutive dots, no special chars before @
  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(v)) return 'Please enter a valid email address';

  // No consecutive dots anywhere
  if (/\.{2,}/.test(v)) return 'Please enter a valid email address';

  // Extract domain and check against blocklist
  const domain = v.split('@')[1];
  if (domain && DISPOSABLE_DOMAINS.has(domain)) {
    return 'Temporary or disposable email addresses are not allowed. Please use your real email.';
  }

  return null; // valid
}

// ─────────────────────────────────────────────────────────────────────────────
// PHONE NUMBER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sanitize a phone value before validation.
 * Keeps only digits, +, -, spaces, and parentheses.
 */
export function sanitizePhone(raw) {
  if (typeof raw !== 'string') return '';
  return raw
    // Strip HTML tags
    .replace(/<[^>]*>/g, '')
    // Keep only valid phone characters
    .replace(/[^0-9+\-\s()]/g, '')
    .trim();
}

/**
 * Validate a sanitized phone string.
 * Returns null on success, or an error message string on failure.
 */
export function validatePhone(value) {
  const v = typeof value === 'string' ? value : '';

  if (!v) return 'Please enter your phone number';

  // Letters are never allowed
  if (/[a-zA-Z]/.test(v)) {
    return 'Phone number can only contain digits, +, spaces, and dashes';
  }

  // Normalize: strip formatting chars for length/pattern checks
  const digitsOnly = v.replace(/[\s\-().]/g, '');

  // After stripping formatting, only digits and leading + are allowed
  if (!/^\+?\d+$/.test(digitsOnly)) {
    return 'Phone number can only contain digits, +, spaces, and dashes';
  }

  // Actual digit count (no +)
  const digits = digitsOnly.replace(/^\+/, '');

  if (digits.length < 7) return 'Phone number is too short';
  if (digits.length > 15) return 'Phone number is too long';

  // Must not be all the same digit (e.g. 0000000, 1111111)
  if (/^(\d)\1+$/.test(digits)) return 'Please enter a valid phone number';

  // Must not be a sequential ascending pattern (e.g. 1234567890)
  const isSequential = digits.split('').every(
    (d, i, arr) => i === 0 || Number(d) === Number(arr[i - 1]) + 1
  );
  if (isSequential && digits.length >= 7) return 'Please enter a valid phone number';

  // Nepal-specific validation: +977 or 977 prefix
  const nepalMatch = digitsOnly.match(/^\+?977(\d+)$/);
  if (nepalMatch) {
    const local = nepalMatch[1];
    // Must be exactly 10 digits after country code
    if (local.length !== 10) return 'Invalid Nepal phone number format';
    // Must start with 97, 98, or 96
    if (!/^(97|98|96)/.test(local)) return 'Invalid Nepal phone number format';
  }

  return null; // valid
}

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGE / INQUIRY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sanitize a message value before validation.
 * - Strips all HTML tags
 * - Removes script-injection attempts
 * - Trims whitespace
 */
export function sanitizeMessage(raw) {
  if (typeof raw !== 'string') return '';
  return raw
    // Remove script tags and their content entirely
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    // Remove javascript: protocol anywhere
    .replace(/javascript\s*:/gi, '')
    // Remove all remaining HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove SQL-style injection markers that shouldn't appear in messages
    .replace(/[<>{}]/g, '')
    // Trim whitespace (but preserve internal newlines)
    .replace(/^[\s]+|[\s]+$/g, '');
}

/**
 * Validate a sanitized message string.
 * Returns null on success, or an error message string on failure.
 */
export function validateMessage(value) {
  const v = typeof value === 'string' ? value : '';

  if (!v) return 'Please enter your message';

  // Must not be only whitespace / line breaks
  if (!v.replace(/[\s\r\n]/g, '')) return 'Please enter your message';

  if (v.length < 20) return 'Message must be at least 20 characters';
  if (v.length > 1000) return 'Message cannot exceed 1000 characters';

  // Must not be all the same character repeated
  const stripped = v.replace(/\s/g, '');
  if (stripped.length > 0 && /^(.)\1+$/.test(stripped)) {
    return 'Message must be at least 20 characters';
  }

  return null; // valid
}

// ─────────────────────────────────────────────────────────────────────────────
// Convenience: validate the entire contact form at once
// Returns an object { name, email, phone, desc } where values are null (ok)
// or an error string. Also returns sanitized field values.
// ─────────────────────────────────────────────────────────────────────────────
export function validateContactForm(raw) {
  const name    = sanitizeName(raw.name);
  const email   = sanitizeEmail(raw.email);
  const phone   = sanitizePhone(raw.phone);
  const desc    = sanitizeMessage(raw.desc);

  const errors = {
    name:  validateName(name),
    email: validateEmail(email),
    phone: validatePhone(phone),
    desc:  validateMessage(desc),
  };

  const sanitized = { name, email, phone, desc };
  const isValid   = Object.values(errors).every(e => e === null);

  return { errors, sanitized, isValid };
}
