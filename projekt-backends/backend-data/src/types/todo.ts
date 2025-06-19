// src/types/todo.ts
export type Todo = {
  id: number;
  task: string;
  done: boolean;
  ownerId: string; // user ID som äger todon
};
