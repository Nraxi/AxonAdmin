import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { users, User } from '../data/db';
import { authenticateToken, authorizeAtLeast } from '../middleware/authMiddleware';

const router = Router();
const secret = 'secret123';

// Registrering - alltid tillgänglig
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  const exists = users.find(u => u.username === username);
  if (exists) return res.status(400).json({ message: 'Användarnamn används redan' });

  const newUser: User = {
    id: Date.now().toString(),
    username,
    password,
    role: null // måste sättas av admin
  };
  users.push(newUser);
  res.status(201).json({ message: 'Registrerad! Vänta på admin.' });
});

// Inloggning - returnerar JWT-token
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: 'Ogiltig inloggning' });

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, secret);
  res.json({ token, role: user.role });
});

// Hämtar alla användare - endast admin
router.get('/users', authenticateToken, authorizeAtLeast('admin'), (req, res) => {
  res.json(users);
});

// Uppdatera roll - endast admin
router.put('/users/:id/role', authenticateToken, authorizeAtLeast('admin'), (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const target = users.find(u => u.id === id);
  if (!target) return res.status(404).json({ message: 'Användare hittades inte' });

  target.role = role;
  res.json({ message: 'Roll uppdaterad' });
});

// Hämtar nuvarande användare
router.get('/me', authenticateToken, (req, res) => {
  const user = req.user!;
  res.json({
    // id: user.id,
    username: user.username,
    role: user.role
  });
});

// router.get('/me', authenticateToken, (req, res) => {
//   const user = (req as any).user;
//   res.json({ username: user.username, role: user.role });
// });

// Ta bort användare - endast admin, men förhindrar borttagning av grundadmin
router.delete('/users/:id', authenticateToken, authorizeAtLeast('admin'), (req, res) => {
  const { id } = req.params;

  if (id === '1') {
    return res.status(400).json({ message: 'Grundadmin kan inte tas bort' });
  }

  const index = users.findIndex(u => u.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Användare hittades inte' });
  }

  users.splice(index, 1);
  res.json({ message: 'Användare borttagen' });
});

export default router;
