import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

const app = express();
const port = Number(process.env.API_PORT || 3001);
const jwtSecret = process.env.JWT_SECRET || 'autolink-development-secret';
const database = new Database('AutoLink.api/autolink.db');

database.pragma('foreign_keys = ON');
database.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    phone TEXT,
    birth_date TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    approved INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS cars (
    id TEXT PRIMARY KEY,
    payload TEXT NOT NULL,
    created_by TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS favorites (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    car_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    UNIQUE(user_id, car_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS proposals (
    id TEXT PRIMARY KEY,
    payload TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL
  );
`);

const now = () => new Date().toISOString();
const developmentAdminPassword = bcrypt.hashSync('123456', 12);
database.prepare('INSERT OR IGNORE INTO users (id, name, email, password_hash, phone, role, approved, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(
  'admin-fixo-desenvolvimento-123',
  'Administrador Geral',
  'admin@stand.com',
  developmentAdminPassword,
  '912 345 678',
  'admin',
  1,
  now(),
);

app.use(cors({ origin: true }));
app.use(express.json());

const id = () => crypto.randomUUID();
const publicUser = (user) => ({
  uid: user.id,
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  phoneNumber: user.phone,
  birthDate: user.birth_date,
  role: user.role,
  approved: Boolean(user.approved),
  createdAt: user.created_at
});
const tokenFor = (user) => jwt.sign({ uid: user.id }, jwtSecret, { expiresIn: '1h' });
const readPayload = (row) => ({ id: row.id, ...JSON.parse(row.payload), status: row.status, createdAt: row.created_at });

function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  try {
    req.auth = jwt.verify(token, jwtSecret);
    req.authUser = database.prepare('SELECT * FROM users WHERE id = ?').get(req.auth.uid);
    if (!req.authUser) return res.status(401).json({ message: 'Sessão inválida.' });
    next();
  } catch {
    return res.status(401).json({ message: 'Autenticação necessária.' });
  }
}

function adminRequired(req, res, next) {
  if (req.authUser?.role !== 'admin') return res.status(403).json({ message: 'Acesso de administrador necessário.' });
  next();
}

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone, birthDate } = req.body || {};
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (!name || !normalizedEmail || !password) return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.', code: 'auth/invalid-input' });
  if (database.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail)) return res.status(409).json({ message: 'Este e-mail já está cadastrado.', code: 'auth/email-already-in-use' });

  const user = { id: id(), name: String(name).trim(), email: normalizedEmail, passwordHash: bcrypt.hashSync(password, 12), phone: phone || '', birthDate: birthDate || '', role: 'user', createdAt: now() };
  database.prepare('INSERT INTO users (id, name, email, password_hash, phone, birth_date, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(user.id, user.name, user.email, user.passwordHash, user.phone, user.birthDate, user.role, user.createdAt);
  const saved = database.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
  res.status(201).json({ token: tokenFor(saved), user: publicUser(saved), profile: publicUser(saved) });
});

app.post('/api/auth/login', (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const user = database.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(String(req.body?.password || ''), user.password_hash)) return res.status(401).json({ message: 'E-mail ou senha incorretos.', code: 'auth/invalid-credential' });
  res.json({ token: tokenFor(user), user: publicUser(user), profile: publicUser(user) });
});

app.get('/api/auth/me', authRequired, (req, res) => res.json({ user: publicUser(req.authUser), profile: publicUser(req.authUser) }));
app.post('/api/auth/logout', (_req, res) => res.status(204).end());
app.post('/api/auth/forgot-password', (_req, res) => res.json({ message: 'Se o e-mail existir, as instruções serão enviadas.' }));

app.patch('/api/users/me', authRequired, (req, res) => {
  const name = String(req.body?.name || '').trim();
  const phone = String(req.body?.phone || '');
  database.prepare('UPDATE users SET name = ?, phone = ? WHERE id = ?').run(name, phone, req.authUser.id);
  res.json({ profile: publicUser(database.prepare('SELECT * FROM users WHERE id = ?').get(req.authUser.id)) });
});

app.patch('/api/users/me/password', authRequired, (req, res) => {
  const current = String(req.body?.currentPassword || '');
  const next = String(req.body?.newPassword || '');
  if (!bcrypt.compareSync(current, req.authUser.password_hash)) return res.status(401).json({ message: 'Senha atual incorreta.', code: 'auth/wrong-password' });
  database.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(bcrypt.hashSync(next, 12), req.authUser.id);
  res.status(204).end();
});

app.delete('/api/users/me', authRequired, (req, res) => {
  const password = String(req.headers['x-delete-password'] || '');
  if (!bcrypt.compareSync(password, req.authUser.password_hash)) return res.status(401).json({ message: 'Senha incorreta.', code: 'auth/wrong-password' });
  database.prepare('DELETE FROM users WHERE id = ?').run(req.authUser.id);
  res.status(204).end();
});

app.get('/api/users', authRequired, adminRequired, (_req, res) => {
  res.json({ users: database.prepare('SELECT * FROM users ORDER BY created_at DESC').all().map(publicUser) });
});
app.patch('/api/users/:id/role', authRequired, adminRequired, (req, res) => {
  const role = req.body?.role === 'admin' ? 'admin' : 'user';
  database.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, req.params.id);
  res.json({ user: publicUser(database.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id)) });
});
app.delete('/api/users/:id', authRequired, adminRequired, (req, res) => {
  database.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

app.get('/api/cars', (_req, res) => {
  const rows = database.prepare('SELECT cars.*, users.name AS created_by_name, users.email AS created_by_email FROM cars LEFT JOIN users ON users.id = cars.created_by ORDER BY cars.created_at DESC').all();
  res.json({ cars: rows.map((row) => ({ ...readPayload(row), userId: row.created_by, createdByName: row.created_by_name || '', createdByEmail: row.created_by_email || '' })) });
});
app.post('/api/cars', authRequired, (req, res) => {
  const carId = id();
  database.prepare('INSERT INTO cars (id, payload, created_by, created_at) VALUES (?, ?, ?, ?)').run(carId, JSON.stringify(req.body || {}), req.authUser.id, now());
  res.status(201).json({ car: { id: carId, ...(req.body || {}), userId: req.authUser.id, createdByName: req.authUser.name, createdByEmail: req.authUser.email } });
});
app.patch('/api/cars/:id', authRequired, (req, res) => {
  const existing = database.prepare('SELECT * FROM cars WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ message: 'Carro não encontrado.' });
  database.prepare('UPDATE cars SET payload = ? WHERE id = ?').run(JSON.stringify({ ...JSON.parse(existing.payload), ...(req.body || {}) }), req.params.id);
  res.json({ car: { ...readPayload(database.prepare('SELECT * FROM cars WHERE id = ?').get(req.params.id)), ...(req.body || {}) } });
});
app.delete('/api/cars/:id', authRequired, (req, res) => {
  database.prepare('DELETE FROM cars WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

app.get('/api/favorites', authRequired, (req, res) => res.json({ favorites: database.prepare('SELECT id, car_id AS carId FROM favorites WHERE user_id = ?').all(req.authUser.id) }));
app.post('/api/favorites/:carId', authRequired, (req, res) => {
  const favoriteId = id();
  database.prepare('INSERT OR IGNORE INTO favorites (id, user_id, car_id, created_at) VALUES (?, ?, ?, ?)').run(favoriteId, req.authUser.id, req.params.carId, now());
  const favorite = database.prepare('SELECT id, car_id AS carId FROM favorites WHERE user_id = ? AND car_id = ?').get(req.authUser.id, req.params.carId);
  res.status(201).json({ favorite });
});
app.delete('/api/favorites/:carId', authRequired, (req, res) => {
  database.prepare('DELETE FROM favorites WHERE user_id = ? AND car_id = ?').run(req.authUser.id, req.params.carId);
  res.status(204).end();
});

app.get('/api/proposals', authRequired, (_req, res) => {
  const rows = database.prepare('SELECT * FROM proposals ORDER BY created_at DESC').all();
  res.json({ proposals: rows.map(readPayload) });
});
app.post('/api/proposals', authRequired, (req, res) => {
  const proposal = { ...(req.body || {}), userId: req.authUser.id, ownerId: req.authUser.id };
  const proposalId = id();
  database.prepare('INSERT INTO proposals (id, payload, status, created_at) VALUES (?, ?, ?, ?)').run(proposalId, JSON.stringify(proposal), 'pending', now());
  res.status(201).json({ proposal: { id: proposalId, ...proposal, status: 'pending' } });
});
app.patch('/api/proposals/:id', authRequired, (req, res) => {
  const existing = database.prepare('SELECT * FROM proposals WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ message: 'Proposta não encontrada.' });
  const proposal = { ...JSON.parse(existing.payload), ...(req.body || {}) };
  database.prepare('UPDATE proposals SET payload = ?, status = ? WHERE id = ?').run(JSON.stringify(proposal), proposal.status || existing.status, req.params.id);
  if (proposal.status === 'approved' && proposal.carId && proposal.carId !== 'simulador') database.prepare('DELETE FROM cars WHERE id = ?').run(String(proposal.carId));
  res.json({ proposal: { id: req.params.id, ...proposal } });
});
app.delete('/api/proposals/:id', authRequired, (req, res) => {
  database.prepare('DELETE FROM proposals WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

app.listen(port, () => console.log(`API AutoLink disponível em http://localhost:${port}`));
