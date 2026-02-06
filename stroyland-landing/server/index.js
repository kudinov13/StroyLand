import express from 'express'
import cors from 'cors'
import sqlite3 from 'sqlite3'
import crypto from 'crypto'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import multer from 'multer'

const app = express()
const PORT = process.env.PORT || 5174
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data.sqlite')
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, 'uploads')
const DIST_DIR = process.env.DIST_DIR || path.join(__dirname, '..', 'dist')

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true })
}

const ADMIN_LOGIN = process.env.ADMIN_LOGIN || 'admin'
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'stroy123'
const ADMIN_PASSWORD_HASH =
  process.env.ADMIN_PASSWORD_HASH ||
  crypto.createHash('sha256').update(DEFAULT_PASSWORD).digest('hex')

const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean)

app.use(
  cors({
    origin: corsOrigins.length ? corsOrigins : false,
    credentials: true,
  }),
)
app.use(express.json({ limit: '4mb' }))
app.use('/uploads', express.static(UPLOADS_DIR))

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '-')
    cb(null, `${Date.now()}-${base}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf',
    ]
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Unsupported file type'))
    }
    return cb(null, true)
  },
})

const db = new sqlite3.Database(DB_PATH)

db.serialize(() => {
  db.run(
    'CREATE TABLE IF NOT EXISTS content (page TEXT PRIMARY KEY, data TEXT NOT NULL)',
  )
  db.run(
    'CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, created_at INTEGER NOT NULL)',
  )
})

function getContent(page) {
  return new Promise((resolve, reject) => {
    db.get('SELECT data FROM content WHERE page = ?', [page], (err, row) => {
      if (err) return reject(err)
      if (!row) return resolve(null)
      try {
        resolve(JSON.parse(row.data))
      } catch (parseError) {
        resolve(null)
      }
    })
  })
}

function saveContent(page, data) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO content(page, data) VALUES(?, ?) ON CONFLICT(page) DO UPDATE SET data = excluded.data',
      [page, JSON.stringify(data)],
      (err) => {
        if (err) return reject(err)
        resolve()
      },
    )
  })
}

function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'No token provided' })
  db.get('SELECT token FROM sessions WHERE token = ?', [token], (err, row) => {
    if (err) return res.status(500).json({ error: 'Failed to validate session' })
    if (!row) return res.status(401).json({ error: 'Invalid session' })
    return next()
  })
}

app.get('/api/content/:page', async (req, res) => {
  try {
    const data = await getContent(req.params.page)
    if (!data) return res.json({})
    return res.json(data)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load content' })
  }
})

app.post('/api/content/:page', authenticate, async (req, res) => {
  try {
    await saveContent(req.params.page, req.body)
    res.json({ ok: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to save content' })
  }
})

app.post('/api/upload', authenticate, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  const url = `/uploads/${req.file.filename}`
  return res.json({ url })
})

app.post('/api/login', (req, res) => {
  const { login, password } = req.body
  const incomingHash = crypto
    .createHash('sha256')
    .update(password || '')
    .digest('hex')
  if (login !== ADMIN_LOGIN || incomingHash !== ADMIN_PASSWORD_HASH) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  const token = crypto.randomBytes(24).toString('hex')
  db.run(
    'INSERT INTO sessions(token, created_at) VALUES(?, ?)',
    [token, Date.now()],
    (err) => {
      if (err) return res.status(500).json({ error: 'Failed to create session' })
      return res.json({ token })
    },
  )
})

if (process.env.NODE_ENV === 'production' && fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR))
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return res.status(404).end()
    return res.sendFile(path.join(DIST_DIR, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})
