import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
// import { Role } from '@shared/types/Role';
import { Role } from '../types/Role';


const secret = 'secret123';

const roleHierarchy: Record<Role, number> = {
  user: 1,
  usp: 2,
  dataadmin: 3,
  admin: 4,
};

interface JwtPayload {
  id: string;
  role: Role;
  username?: string;  // gör optional om du vill
}



declare module 'express' {
  interface Request {
    user?: JwtPayload;
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.sendStatus(403);

    if (typeof decoded === 'object' && decoded !== null && 'id' in decoded && 'role' in decoded) {
      req.user = {
        id: (decoded as any).id,
        username: (decoded as any).username,
        role: (decoded as any).role,
      };
      next();
    } else {
      return res.status(403).json({ message: 'Ogiltig token' });
    }
  });
}

export function authorizeRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return res.status(403).json({ message: 'Åtkomst nekad' });

    if (user.role === 'admin' || roles.includes(user.role)) {
      return next();
    }
    return res.status(403).json({ message: 'Åtkomst nekad' });
  };
}

export function authorizeAtLeast(minRole: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user || !user.role) {
      return res.status(403).json({ message: 'Åtkomst nekad' });
    }

    const userLevel = roleHierarchy[user.role];
    const requiredLevel = roleHierarchy[minRole];

    if (userLevel >= requiredLevel) {
      return next();
    }

    return res.status(403).json({ message: 'Otillräcklig behörighet' });
  };
}

export const jwtSecret = secret;
