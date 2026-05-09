import path from 'node:path';
import fs from 'node:fs';
import multer from 'multer';

const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ── Allowed MIME types (SVG intentionally excluded — can carry inline <script>)
const ALLOWED_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

// ── Allowed file extensions that must match the MIME type.
//    Defence-in-depth: a file named "evil.php" with MIME image/jpeg is rejected.
const ALLOWED_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

// ── Extensions that are ALWAYS blocked, regardless of MIME type.
const BLOCKED_EXTS = new Set([
  '.php', '.php3', '.php4', '.php5', '.phtml',
  '.asp', '.aspx', '.jsp', '.jspx',
  '.py', '.rb', '.pl', '.sh', '.bash',
  '.exe', '.dll', '.so', '.bat', '.cmd',
  '.js', '.ts', '.mjs', '.cjs',
  '.html', '.htm', '.svg', '.xml',
  '.htaccess', '.htpasswd',
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    // Sanitise extension — keep only the last extension, force lowercase
    const rawExt = path.extname(file.originalname).toLowerCase();
    const ext = rawExt.replace(/[^a-z0-9.]/g, '');

    // Sanitise base name
    const safe = path.basename(file.originalname, path.extname(file.originalname))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 60);

    cb(null, `${Date.now()}-${safe}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB hard cap
  fileFilter: (_req, file, cb) => {
    const rawExt = path.extname(file.originalname).toLowerCase();
    const ext = rawExt.replace(/[^a-z0-9.]/g, '');

    // 1. Block known-dangerous extensions unconditionally.
    if (BLOCKED_EXTS.has(ext)) {
      return cb(new Error('File type not allowed.'));
    }

    // 2. Extension must be in the allowed image set.
    if (!ALLOWED_EXTS.has(ext)) {
      return cb(new Error('Only image files (jpg, png, webp, gif) are allowed.'));
    }

    // 3. MIME type must also be in the allowed set.
    if (!ALLOWED_MIMES.has(file.mimetype)) {
      return cb(new Error('Only image files are allowed.'));
    }

    cb(null, true);
  },
});
