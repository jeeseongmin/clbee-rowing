import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 7500;

app.use('/rowing', express.static(join(__dirname, 'dist')));

app.get('/rowing/{*splat}', (_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// / 접근 시 /rowing으로 리다이렉트
app.get('/', (_req, res) => {
  res.redirect('/rowing');
});

app.listen(PORT, () => {
  console.log(`Rowing app running at http://localhost:${PORT}/rowing`);
});
