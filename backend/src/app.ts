import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import crypto from 'crypto';
import routes from './routes/index.js';
import { sendSuccess, sendError } from './utils/response.js';

const app = express();

// Konfigurasi CORS dengan exposedHeaders X-Request-Id
app.use(
  cors({
    exposedHeaders: ['X-Request-Id']
  })
);

app.use(express.json());

// Middleware 1: Menghasilkan dan menyematkan X-Request-Id unik pada response dan request
app.use((req: Request, res: Response, next: NextFunction) => {
  const requestId = (req.headers['x-request-id'] as string) || crypto.randomUUID();
  res.setHeader('X-Request-Id', requestId);
  req.headers['x-request-id'] = requestId;
  next();
});

// Middleware 2: Pencatat (logger) yang menulis satu baris log berisi requestId, method, dan URL
app.use((req: Request, res: Response, next: NextFunction) => {
  const requestId = res.getHeader('X-Request-Id') || req.headers['x-request-id'];
  console.log(`[${requestId}] ${req.method} ${req.originalUrl || req.url}`);
  next();
});

// Route utama - cek apakah server berjalan
app.get('/', (req: Request, res: Response) => {
  sendSuccess(res, 'Backend Todo Praktikum Berjalan Mulus!');
});

// Daftarkan semua route dengan prefix /api
app.use('/api', routes);

// 404 Handler - dipanggil jika tidak ada route yang cocok
app.use((req: Request, res: Response) => {
  sendError(res, `Route ${req.method} ${req.originalUrl || req.url} tidak ditemukan!`, 404);
});

// Global Error Handler - menangkap error yang tidak tertangani
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Terjadi error:', err.message);
  sendError(res, 'Terjadi kesalahan pada server.', 500);
});

export default app;
