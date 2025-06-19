export interface User {
  id: string;
  username: string;
  password: string;
  role: null | 'admin' | 'user' | 'usp' | 'dataadmin';
}

export const users: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin',
    role: 'admin'
  }
];
