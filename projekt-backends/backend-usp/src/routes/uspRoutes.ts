import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../../../backend-auth/src/middleware/authMiddleware';

const router = Router();

router.get('/special', authenticateToken, authorizeRole('usp'), (req, res) => {
  res.json([
    { id: 'a1', info: "Special USP Data 1" },
    { id: 'a2', info: "Special USP Data 2" }
  ]);
});

export default router;