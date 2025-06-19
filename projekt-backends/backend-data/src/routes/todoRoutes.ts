import { Router, Request, Response } from 'express';
import { authenticateToken, authorizeAtLeast } from '../../../backend-auth/src/middleware/authMiddleware';
import { Role } from '../../../backend-auth/src/types/Role';
import { Todo } from '../types/todo';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      role: Role;
    };
  }
}
const router = Router();

let todos: Todo[] = [
  { id: 1, task: "Göra något viktigt", done: false, ownerId: 'user1' },
  { id: 2, task: "Laga mat", done: true, ownerId: 'user2' }
];
let nextId = 3;

// Rollhierarki (samma som i backend-auth)
const roleHierarchy: Record<Role, number> = {
  user: 1,
  usp: 2,
  dataadmin: 3,
  admin: 4,
};

// Hjälpfunktion: true om rollen är minst dataadmin (inkl admin)
const hasDataAdminAccess = (req: Request) => {
  if (!req.user) return false;
  return roleHierarchy[req.user.role] >= roleHierarchy['dataadmin'];
};

const getUserId = (req: Request) => req.user?.id;
const isOwner = (req: Request, todo: Todo) => todo.ownerId === getUserId(req);

// GET alla todos - admin/dataadmin ser alla, user bara sina egna
router.get('/todos', authenticateToken, authorizeAtLeast('user'), (req: Request, res: Response) => {
  if (!req.user) return res.status(403).json({ message: 'Ingen användare' });

  if (hasDataAdminAccess(req)) {
    return res.json(todos);
  }
  const userTodos = todos.filter(todo => isOwner(req, todo));
  res.json(userTodos);
});
// NY: GET mina todos - oavsett roll, alltid bara egna todos
router.get('/todos/mine', authenticateToken, authorizeAtLeast('user'), (req: Request, res: Response) => {
  if (!req.user) return res.status(403).json({ message: 'Ingen användare' });

  const userTodos = todos.filter(todo => isOwner(req, todo));
  res.json(userTodos);
});
// GET en todo efter id - kontrollera åtkomst
router.get('/todos/:id', authenticateToken, authorizeAtLeast('user'), (req: Request, res: Response) => {
  if (!req.user) return res.status(403).json({ message: 'Ingen användare' });

  const id = Number(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).json({ message: 'Todo hittades inte' });

  if (!hasDataAdminAccess(req) && !isOwner(req, todo)) {
    return res.status(403).json({ message: 'Otillåtet' });
  }

  res.json(todo);
});

// POST ny todo - spara med ownerId = inloggad användare
router.post('/todos', authenticateToken, authorizeAtLeast('user'), (req: Request, res: Response) => {
  if (!req.user) return res.status(403).json({ message: 'Ingen användare' });

  const { task, done } = req.body;
  if (typeof task !== 'string') return res.status(400).json({ message: 'Ogiltig data' });

  const newTodo: Todo = {
    id: nextId++,
    task,
    done: !!done,
    ownerId: getUserId(req)!
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT uppdatera todo - kolla ägarskap eller admin/dataadmin
router.put('/todos/:id', authenticateToken, authorizeAtLeast('user'), (req: Request, res: Response) => {
  if (!req.user) return res.status(403).json({ message: 'Ingen användare' });

  const id = Number(req.params.id);
  const { task, done } = req.body;

  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).json({ message: 'Todo hittades inte' });

  if (!hasDataAdminAccess(req) && !isOwner(req, todo)) {
    return res.status(403).json({ message: 'Otillåtet' });
  }

  if (typeof task === 'string') todo.task = task;
  if (typeof done === 'boolean') todo.done = done;

  res.json(todo);
});

// DELETE todo - kolla ägarskap eller admin/dataadmin
router.delete('/todos/:id', authenticateToken, authorizeAtLeast('user'), (req: Request, res: Response) => {
  if (!req.user) return res.status(403).json({ message: 'Ingen användare' });

  const id = Number(req.params.id);
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ message: 'Todo hittades inte' });

  const todo = todos[index];
  if (!hasDataAdminAccess(req) && !isOwner(req, todo)) {
    return res.status(403).json({ message: 'Otillåtet' });
  }

  const deleted = todos.splice(index, 1);
  res.json(deleted[0]);
});

router.delete('/delall', authenticateToken, authorizeAtLeast('admin'), (req, res) => {
  todos = [];
  res.json({ message: 'Alla todos har raderats' });
});


export default router;
