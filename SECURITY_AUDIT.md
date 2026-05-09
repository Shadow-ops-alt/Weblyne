# Weblyne Security Audit & Remediation Report

**Date:** 2026-05-09
**Scope:** Frontend (React/Vite) and Backend (Node/Express/PostgreSQL)

This document outlines the security vulnerabilities identified during the comprehensive audit of the Weblyne project, along with the specific remediations applied.

---

## 1. Input Validation & Data Sanitization

### Findings
- The original contact form lacked robust validation and sanitization. Malicious input could bypass simple client-side checks and enter the database.
- Disposable email addresses were permitted.
- Telephone numbers were not strictly validated to local (Nepal) or international formats.

### Remediation
- **Frontend Validation Layer (`formValidation.js`)**: Implemented strict, vanilla JS-based validation rules. Added real-time sanitization (stripping HTML tags, invalid characters) and strict format checking for names, emails, and phone numbers.
- **Backend Schema Synchronization (`validators.js`)**: Upgraded Zod schemas to mirror the frontend rules exactly, ensuring defense-in-depth.
- **Disposable Email Blocking**: Added a comprehensive list of known disposable email domains to reject spam/disposable submissions.

---

## 2. Cross-Site Scripting (XSS) Prevention

### Findings
- The email notification templates (`templates.js`) interpolated user-provided values (e.g., `c.name`, `c.description`, `intro`) directly into HTML without escaping.
- The React frontend lacked a Content-Security-Policy (CSP) header, increasing the risk of inline script execution.
- JWT tokens are stored in `localStorage`, which makes them susceptible to extraction via XSS.

### Remediation
- **HTML Escaping**: Introduced a strict `escape()` function in `templates.js` that encodes `&`, `<`, `>`, `"`, `'`, and `/`. All user-supplied variables are now securely escaped before HTML interpolation.
- **Strict Content-Security-Policy**: Added a robust CSP via meta tags in `index.html`. It restricts `script-src` and `style-src` (allowing inline only where required by GTM/React) and strictly defines `connect-src` and `frame-src`.
- **JWT Documentation**: Added security notes in `api.js` detailing the risks of `localStorage` and proposing a future migration to `httpOnly` cookies. Current mitigation relies on the strict CSP and 7-day token expiration.

---

## 3. Information Exposure & Secrets Management

### Findings
- The database seed script (`seed.js`) printed the plain-text admin password to `stdout`, which would be captured in production logs.
- The global error handler (`errors.js`) returned raw `err.message` strings on HTTP 500 errors, potentially leaking internal stack traces, DB paths, or configuration details to users.
- `req.originalUrl` was reflected in 404 responses, enabling path disclosure.
- Missing `.env.*` patterns in `.gitignore` could lead to accidental commits of secrets.

### Remediation
- **Error Masking**: Modified `errors.js` to return generic "Internal server error" messages for all 500-level errors, while logging the actual trace internally. Reflected URLs were removed from 404s. Zod validation errors were stripped to only return safe field paths and messages.
- **Seed Script Logging**: Removed plain-text password logging from `seed.js`.
- **Gitignore Expansion**: Added comprehensive rules to `.gitignore` to ignore all variations of `.env` files and common OS/editor artifacts.
- **Environment Configuration**: Updated `.env.example` with clear instructions and stronger default placeholder requirements for `JWT_SECRET`.

---

## 4. Authentication & Database Hardening

### Findings
- The bcrypt hashing algorithm used a cost factor of `10`, which is considered too low for modern hardware.
- The Postgres SSL configuration (`PGSSL=true`) set `rejectUnauthorized: false`, effectively disabling certificate verification and enabling Man-in-the-Middle (MitM) attacks.

### Remediation
- **Bcrypt Cost Factor**: Increased the bcrypt hashing cost to `12` in `seed.js` and `admin.js`.
- **SSL Certificate Verification**: Fixed the SSL config in `db.js`. Setting `PGSSL=true` now strictly enforces `rejectUnauthorized: true`. A new `PGSSL=noverify` option was added explicitly for local/dev environments using self-signed certificates.
- **Connection Pool Hardening**: Implemented `statement_timeout` and `idle_in_transaction_session_timeout` to prevent runaway queries from exhausting connection slots.

---

## 5. File Upload Vulnerabilities (RCE Prevention)

### Findings
- The Multer configuration (`upload.js`) relied primarily on checking `file.mimetype`. This is susceptible to "double-extension" bypasses (e.g., `evil.php.jpg`), where a malicious executable file is uploaded disguised as an image MIME type.

### Remediation
- **Defense-in-Depth File Filtering**: Updated `upload.js` to implement a strict pipeline:
  1. Validates the physical file extension against an explicit blocklist (`.php`, `.sh`, `.exe`, etc.).
  2. Validates the file extension against an explicit allowlist (`.jpg`, `.png`, etc.).
  3. Validates the MIME type matches the allowed image types.
- **Filename Sanitization**: Uploaded files now have their base names stripped of all non-alphanumeric characters, preventing path traversal via filenames.

---

## 6. HTTP & API Security

### Findings
- The CORS configuration allowed any request lacking an `Origin` header (e.g., `curl` or SSRF relays) to access the API in production.
- Outdated dependencies contained known high/moderate severity CVEs.

### Remediation
- **Strict CORS Verification**: Updated `cors.js` to explicitly block requests without an `Origin` header when running in production. Warned against the combination of `credentials: true` and wildcard origins.
- **Dependency Audit**: Executed `npm audit fix --force` in both the `frontend` and `backend` directories.
  - **Frontend**: Updated Vite and esbuild, resolving 2 moderate severity vulnerabilities.
  - **Backend**: Updated Nodemailer to `v8.x`, resolving 1 high severity vulnerability involving SMTP command injection and DoS vectors.

---

**Audit Status:** Complete. The codebase is significantly hardened against common web vulnerabilities (OWASP Top 10). Continuous monitoring and periodic dependency updates are recommended.
