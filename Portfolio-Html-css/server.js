import express from 'express';
import morgan from 'morgan';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

// Static files
app.use(morgan('dev'));
app.use(cors());
app.use(express.static('public'));
app.use(express.static('.'));

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9-_]/gi, '_').toLowerCase();
    const name = `${base}_${Date.now()}${ext}`;
    cb(null, name);
  }
});

const upload = multer({ storage });

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  // Public URL path for client
  const urlPath = `/uploads/${req.file.filename}`;
  res.json({ path: urlPath, absolute: `${req.protocol}://${req.get('host')}${urlPath}` });
});

app.listen(PORT, () => {
  console.log(`Portfolio server running at http://localhost:${PORT}`);
});


